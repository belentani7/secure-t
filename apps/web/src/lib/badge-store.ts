"use client";

import {
  PublicJwk,
  buildAssertion,
  buildBadgeClass,
  buildIssuer,
  createIssuerKey,
  exportPublicJwk,
  keyIdFor,
  signAssertion,
  signCredentialJwt,
  toOpenBadges3,
  validateAssertion,
  validateBadgeClass,
  verifyBadgeJws,
  verifyCredentialJwt,
  type Assertion,
  type BadgeClass,
  type IssuerProfile,
  type SerializedBadge,
  type VerificationResult
} from "@secure-t/shared";
import { SITE } from "./site";

/**
 * Emisor de credenciales del propio dispositivo.
 *
 * Cuando el estudiante cumple los requisitos, este módulo crea o reutiliza su
 * par de claves RSA (RSASSA-PKCS1-v1_5 · RS256), firma la aserción de Open
 * Badges 2.0 y entrega un fichero con la credencial **y su clave pública**, de
 * modo que cualquiera puede verificarla sin conexión y sin pedir permiso a
 * ningún servidor. La clave privada no sale de `localStorage`.
 *
 * Lo que esto significa y lo que no: la firma garantiza integridad y procedencia
 * de esa emisión, no una identidad legal. La revisión humana de evidencias y el
 * registro público de emisiones siguen marcados como PLANIFICADOS.
 */

const KEY_STORAGE = "secure-t-issuer-key-v1";
const ISSUED_STORAGE = "secure-t-issued-v1";

interface StoredKey {
  privateJwk: JsonWebKey;
  publicJwk: PublicJwk;
  createdAt: string;
}

export function siteBaseUrl(): string {
  if (typeof window !== "undefined") return `${window.location.origin}${SITE.basePath}`;
  return SITE.pagesUrl.replace(/\/$/, "");
}

function readKey(): StoredKey | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.localStorage.getItem(KEY_STORAGE);
    if (!bruto) return null;
    const datos = JSON.parse(bruto) as StoredKey;
    return datos?.privateJwk && datos?.publicJwk ? datos : null;
  } catch {
    return null;
  }
}

/** Obtiene (o crea) la clave del dispositivo. Nunca sale del navegador. */
export async function issuerKey(): Promise<StoredKey> {
  const existente = readKey();
  if (existente) return existente;

  const pareja = await createIssuerKey();
  const privateJwk = await crypto.subtle.exportKey("jwk", pareja.privateKey);
  const publicJwk = await exportPublicJwk(pareja);
  const almacenada: StoredKey = { privateJwk, publicJwk, createdAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY_STORAGE, JSON.stringify(almacenada));
  } catch {
    /* sin persistencia: la clave vale para esta sesión */
  }
  return almacenada;
}

export async function resetIssuerKey() {
  try {
    window.localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* sin almacenamiento */
  }
}

export interface IssueInput {
  slug: string;
  title: string;
  weeks: number;
  weeksDone: number;
  token: string;
  locale: string;
  teacher?: string;
  /** Fecha de emisión en ISO 8601. Por defecto, hoy. */
  issuedOn?: string;
}

export interface IssuedBadge {
  serialized: SerializedBadge;
  badgeClass: BadgeClass;
  issuer: IssuerProfile;
  assertion: Assertion;
  ob3: Record<string, unknown>;
  /** La misma credencial OB 3.0 en VC-JWT (JOSE, RFC 7515), para monederos. */
  ob3Jwt: string;
  problems: string[];
}

/** Emite (en el dispositivo) la credencial firmada de un programa. */
export async function issueBadge(input: IssueInput): Promise<IssuedBadge> {
  const base = siteBaseUrl();
  const almacenada = await issuerKey();
  const keyId = `RS256:${almacenada.publicJwk.kid ?? (await keyIdFor(almacenada.publicJwk))}`;

  const badgeClass = buildBadgeClass({
    baseUrl: base,
    slug: input.slug,
    title: input.title,
    weeks: input.weeks,
    ...(input.teacher ? { description: `Superación del programa «${input.title}» con ${input.teacher} como docente responsable.` } : {})
  });
  const issuer = buildIssuer(base, keyId);

  const assertion = buildAssertion({
    baseUrl: base,
    token: input.token,
    badgeClassId: badgeClass.id,
    issuedOn: input.issuedOn ?? new Date().toISOString(),
    weeksDone: input.weeksDone,
    weeksTotal: input.weeks,
    keyId
  });

  const clavePrivada = await crypto.subtle.importKey(
    "jwk",
    { ...almacenada.privateJwk, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const problemas = [...validateBadgeClass(badgeClass), ...validateAssertion(assertion)];
  const jws = await signAssertion(assertion, clavePrivada, keyId);
  const credencialOb3 = toOpenBadges3({ baseUrl: base, assertion, badgeClass, issuer });
  // La VC-JWT añade los claims de JWT (RFC 7519) que la credencial usa como
  // identificadores; el resto del documento es el de Open Badges 3.0.
  const ob3Jwt = await signCredentialJwt(
    {
      ...credencialOb3,
      iss: issuer.id,
      sub: assertion.recipient.identity,
      jti: assertion.id,
      nbf: Math.floor(Date.parse(assertion.issuedOn) / 1000)
    },
    clavePrivada,
    keyId
  );

  const serialized: SerializedBadge = {
    jws,
    jwk: almacenada.publicJwk,
    assertion,
    badgeClass,
    issuer,
    note:
      "Credencial Open Badges 2.0 firmada con RS256 en tu dispositivo. Verifícala sin conexión con la clave pública incluida. Sin registro público de emisiones (PLANNED)."
  };

  try {
    const emitidas = JSON.parse(window.localStorage.getItem(ISSUED_STORAGE) ?? "[]") as string[];
    window.localStorage.setItem(ISSUED_STORAGE, JSON.stringify([...new Set([...emitidas, badgeClass.id])]));
  } catch {
    /* sin persistencia */
  }

  return {
    serialized,
    badgeClass,
    issuer,
    assertion,
    ob3: credencialOb3,
    ob3Jwt,
    problems: problemas
  };
}

/** Un VC-JWT compacto: tres segmentos y ningún carácter JSON. */
function esJwtCompacto(texto: string): boolean {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(texto);
}

/**
 * Verifica una credencial pegada por el estudiante: firma y forma.
 *
 * Se aceptan las dos serializaciones del campus: el sobre de Open Badges 2.0
 * (`jws` + clave pública, verificable por cualquiera sin conexión) y la
 * credencial de Open Badges 3.0 en VC-JWT. Un VC-JWT no lleva la clave dentro,
 * así que se comprueba contra la clave de este dispositivo; si no es esa, se
 * dice por qué en lugar de dar un resultado ambiguo.
 */
export async function verifyBadge(texto: string): Promise<VerificationResult> {
  const limpio = texto.trim();

  if (esJwtCompacto(limpio)) {
    const almacenada = readKey();
    if (!almacenada) return { valid: false, reason: "jwt_sin_clave" };
    const resultado = await verifyCredentialJwt(limpio, almacenada.publicJwk);
    if (!resultado.valid) return { valid: false, reason: resultado.reason };
    return { valid: true, ...(resultado.credential ? { credential: resultado.credential } : {}) };
  }

  let datos: Partial<SerializedBadge>;
  try {
    datos = JSON.parse(texto) as Partial<SerializedBadge>;
  } catch {
    return { valid: false, reason: "json_ilegible" };
  }
  if (!datos.jws || !datos.jwk) return { valid: false, reason: "faltan_jws_o_clave" };

  const resultado = await verifyBadgeJws(datos.jws, datos.jwk);
  if (!resultado.valid) return resultado;

  const problemas = [...validateBadgeClass(datos.badgeClass ?? {}), ...validateAssertion(resultado.assertion ?? {})];
  if (problemas.length) return { valid: false, reason: `forma:${problemas.join(",")}`, assertion: resultado.assertion };

  const claveDerivada = await keyIdFor(datos.jwk);
  if (datos.jwk.kid && claveDerivada !== datos.jwk.kid) {
    return { valid: false, reason: "clave_manipulada" };
  }
  return resultado;
}
