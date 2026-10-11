import { sha256Hex } from "./knowledge";

/**
 * Credencial abierta, verificable **sin servidor**.
 *
 * Implementa el perfil de aserción de **Open Badges 2.0** (1EdTech/IMS, antes
 * Badge Alliance): `Assertion` + `BadgeClass` + `Issuer`, con los campos
 * obligatorios que exige el estándar, y la variante **SignedBadge**: la
 * aserción se serializa como JWS compacto firmado con RS256 (RSA-SHA256), que
 * es exactamente lo que describe el apartado «Signed Badges» del estándar.
 *
 * Por qué firmado y no alojado: el campus no tiene servidor, así que no puede
 * alojar una URL por credencial. Con un par de claves generado en el propio
 * dispositivo, la credencial se puede **verificar sin conexión** con la clave
 * pública que la acompaña. Lo que no se promete (y se dice): no hay registro
 * público de emisiones ni revocación en línea; eso está `PLANNED`.
 *
 * Referencias: Open Badges 2.0 (§ Assertion, § Signed Badges), JSON Web
 * Signature RFC 7515, RSASSA-PKCS1-v1_5 (RFC 8017 §9.2), base64url RFC 4648 §5.
 */

export const OB2_CONTEXT = "https://w3id.org/openbadges/v2" as const;
export const OB3_CONTEXT = "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json" as const;
export const VC_CONTEXT = "https://www.w3.org/2018/credentials/v1" as const;

export interface IssuerProfile {
  id: string;
  type: "Issuer";
  name: string;
  url: string;
  description?: string;
  email?: string;
  image?: string;
  publicKey?: { id: string; owner: string };
}

export interface BadgeClass {
  id: string;
  type: "BadgeClass";
  name: string;
  description: string;
  image: string;
  criteria: { id: string; narrative: string };
  issuer: string;
  tags?: string[];
  alignment?: { targetName: string; targetUrl: string; targetDescription?: string }[];
}

export interface Assertion {
  "@context": typeof OB2_CONTEXT;
  id: string;
  type: "Assertion";
  recipient: { type: "url" | "email"; identity: string; hashed: boolean };
  badge: string;
  issuedOn: string;
  narrative?: string;
  evidence?: { id: string; narrative?: string }[];
  expires?: string;
  verification: { type: "SignedBadge"; creator: string };
}

/**
 * JWK público de la clave de firma. `JsonWebKey` del DOM no declara `kid`, y el
 * identificador de clave es justo lo que permite verificar sin ambigüedad: se
 * extiende aquí en vez de repartir castings por el código.
 */
export interface PublicJwk extends JsonWebKey {
  kid?: string;
  use?: string;
  alg?: string;
}

export interface SerializedBadge {
  jws: string;
  /** Clave pública en formato JWK: permite verificar sin servidor. */
  jwk: PublicJwk;
  assertion: Assertion;
  badgeClass: BadgeClass;
  issuer: IssuerProfile;
  note: string;
}

const encoder = new TextEncoder();

/* ------------------------------------------------------------- base64url */

export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  // ArrayBuffer explícito: la API de criptografía del navegador exige
  // `ArrayBufferView<ArrayBuffer>`, no el `ArrayBufferLike` por defecto de TS 5.7+.
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

/* --------------------------------------------------------------- perfiles */

export function buildIssuer(baseUrl: string, publicKeyId?: string): IssuerProfile {
  const base = baseUrl.replace(/\/$/, "");
  return {
    id: `${base}/api/issuer`,
    type: "Issuer",
    name: "secure T · instituto abierto de ciberseguridad e IA",
    url: `${base}/`,
    description:
      "Instituto abierto de ciberseguridad e inteligencia artificial. Cuatro programas de veinte semanas, gratuitos, sin cuentas y funcionales sin conexión.",
    ...(publicKeyId ? { publicKey: { id: publicKeyId, owner: `${base}/api/issuer` } } : {})
  };
}

/**
 * Clase de insignia de un programa. Los criterios son literales y verificables:
 * veinte semanas, cuestionario, laboratorio, proyecto y examen (rúbrica 30/30/40).
 */
export function buildBadgeClass(options: {
  baseUrl: string;
  slug: string;
  title: string;
  weeks?: number;
  description?: string;
  locale?: string;
}): BadgeClass {
  const base = options.baseUrl.replace(/\/$/, "");
  const weeks = options.weeks ?? 20;
  return {
    id: `${base}/badges/${options.slug}`,
    type: "BadgeClass",
    name: `Aprovechamiento · ${options.title}`,
    description:
      options.description ??
      `Superación del programa «${options.title}» del campus secure T: ${weeks} semanas de material abierto, evaluación con rúbrica y proyecto defendido.`,
    image: `${base}/badges/${options.slug}.svg`,
    criteria: {
      id: `${base}/programas/${options.slug}`,
      narrative: [
        `Completar las ${weeks} semanas del programa.`,
        "Aprobar el cuestionario con al menos el 70 %.",
        "Entregar el laboratorio con evidencias reproducibles.",
        "Presentar el proyecto final (rúbrica: 30 % P1, 30 % P2, 40 % P3)."
      ].join(" ")
    },
    issuer: `${base}/api/issuer`,
    tags: ["ciberseguridad", "inteligencia artificial", "privacidad", "estándares abiertos"],
    alignment: [
      {
        targetName: "NIST NICE Framework",
        targetUrl: "https://www.nist.gov/itl/applied-cybersecurity/nice",
        targetDescription: "Competencias de ciberseguridad alineadas con el marco NICE."
      },
      {
        targetName: "SFIA 8 · Security skills",
        targetUrl: "https://sfia-online.org/",
        targetDescription: "Niveles de responsabilidad del marco SFIA 8."
      }
    ]
  };
}

/**
 * Aserción anónima: el destinatario es una **URL** derivada del token que vive
 * en el dispositivo, nunca un correo ni un nombre. Es una opción del estándar
 * (recipient.type puede ser `email` o `url`) y la única compatible con la
 * promesa de anonimato del campus.
 */
export function buildAssertion(options: {
  baseUrl: string;
  token: string;
  badgeClassId: string;
  issuedOn: string;
  weeksDone: number;
  weeksTotal?: number;
  keyId: string;
  evidenceUrl?: string;
  expires?: string;
}): Assertion {
  const base = options.baseUrl.replace(/\/$/, "");
  const weeksTotal = options.weeksTotal ?? 20;
  return {
    "@context": OB2_CONTEXT,
    id: `${base}/credencial/${options.token}`,
    type: "Assertion",
    recipient: { type: "url", identity: `${base}/credencial/${options.token}`, hashed: false },
    badge: options.badgeClassId,
    issuedOn: options.issuedOn,
    narrative: `Expediente anónimo verificado: ${options.weeksDone} de ${weeksTotal} semanas acreditadas, con cuestionario, laboratorio, proyecto y examen registrados en el dispositivo.`,
    evidence: [
      {
        id: options.evidenceUrl ?? `${base}/progreso`,
        narrative: "Expediente firmado con SHA-256 exportable desde /progreso; se puede recalcular para comprobar integridad."
      },
      {
        id: `${base}/credential/verify`,
        narrative: "Verificación local: recalcular la firma RS256 con la clave pública incluida (JWK). Sin servidor."
      }
    ],
    verification: { type: "SignedBadge", creator: options.keyId },
    ...(options.expires ? { expires: options.expires } : {})
  };
}

/* ------------------------------------------------------- firma y validación */

export async function createIssuerKey(): Promise<CryptoKeyPair> {
  return (await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  )) as CryptoKeyPair;
}

export async function exportPublicJwk(pair: CryptoKeyPair): Promise<PublicJwk> {
  const jwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const kid = await keyIdFor(jwk);
  return { ...jwk, kid, use: "sig", alg: "RS256" };
}

/** Identificador de clave estable y derivado del propio JWK (no aleatorio). */
export async function keyIdFor(jwk: JsonWebKey): Promise<string> {
  const material = [jwk.n ?? "", jwk.e ?? "", jwk.kty ?? ""].join("|");
  return (await sha256Hex(material)).slice(0, 32);
}

/** Serializa la aserción como JWS compacto firmado con RS256. */
export async function signAssertion(assertion: Assertion, privateKey: CryptoKey, keyId: string): Promise<string> {
  const header = { alg: "RS256", kid: keyId, typ: "JWT" };
  const cabecera = toBase64Url(encoder.encode(JSON.stringify(header)));
  const carga = toBase64Url(encoder.encode(JSON.stringify(assertion)));
  const firma = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, encoder.encode(`${cabecera}.${carga}`));
  return `${cabecera}.${carga}.${toBase64Url(new Uint8Array(firma))}`;
}

export interface VerificationResult {
  valid: boolean;
  assertion?: Assertion;
  /** Credencial Open Badges 3.0, cuando lo verificado es un VC-JWT. */
  credential?: Record<string, unknown>;
  reason?: string;
}

/** Verifica un JWS de credencial y devuelve la aserción si es auténtica. */
export async function verifyBadgeJws(jws: string, jwk: PublicJwk): Promise<VerificationResult> {
  const partes = jws.split(".");
  if (partes.length !== 3) return { valid: false, reason: "jws_mal_formado" };
  const [cabecera, carga, firma] = partes as [string, string, string];

  let assertion: Assertion;
  try {
    assertion = JSON.parse(new TextDecoder().decode(fromBase64Url(carga))) as Assertion;
  } catch {
    return { valid: false, reason: "carga_ilegible" };
  }

  try {
    const clave = await crypto.subtle.importKey(
      "jwk",
      { ...jwk, alg: "RS256", ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valida = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      clave,
      fromBase64Url(firma),
      encoder.encode(`${cabecera}.${carga}`)
    );
    if (!valida) return { valid: false, reason: "firma_no_valida" };
    return { valid: true, assertion };
  } catch (error) {
    return { valid: false, reason: error instanceof Error ? error.message : "error_de_verificacion" };
  }
}

/** Campos obligatorios según Open Badges 2.0. Devuelve la lista de problemas. */
export function validateAssertion(assertion: Partial<Assertion>): string[] {
  const problemas: string[] = [];
  if (!assertion.id) problemas.push("falta id");
  if (assertion.type !== "Assertion") problemas.push("type debe ser Assertion");
  if (!assertion.badge) problemas.push("falta badge (ID de la clase)");
  if (!assertion.issuedOn || Number.isNaN(Date.parse(assertion.issuedOn))) problemas.push("issuedOn no es una fecha ISO 8601");
  if (!assertion.recipient) problemas.push("falta recipient");
  else {
    if (assertion.recipient.hashed !== false && assertion.recipient.hashed !== true) {
      problemas.push("recipient.hashed debe ser booleano");
    }
    if (!assertion.recipient.identity) problemas.push("falta recipient.identity");
    if (assertion.recipient.type !== "url" && assertion.recipient.type !== "email") {
      problemas.push("recipient.type debe ser url o email");
    }
  }
  if (!assertion.verification?.type) problemas.push("falta verification.type");
  if (assertion.expires && Number.isNaN(Date.parse(assertion.expires))) problemas.push("expires no es una fecha ISO 8601");
  return problemas;
}

export function validateBadgeClass(clase: Partial<BadgeClass>): string[] {
  const problemas: string[] = [];
  if (clase.type !== "BadgeClass") problemas.push("type debe ser BadgeClass");
  for (const campo of ["id", "name", "description", "image", "issuer"] as const) {
    if (!clase[campo]) problemas.push(`falta ${campo}`);
  }
  if (!clase.criteria?.id || !clase.criteria?.narrative) problemas.push("criteria necesita id y narrative");
  return problemas;
}

/* ------------------------------------------------------------------ SVG */

/** Insignia en SVG (determinista y sin dependencias): se sirve desde /badges/. */
export function badgeSvg(options: { title: string; slug: string; locale?: string }): string {
  const iniciales = options.title
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .slice(0, 3)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join("");
  const lineas: string[] = [];
  const palabras = options.title.split(/\s+/);
  let actual = "";
  for (const palabra of palabras) {
    if ((actual + " " + palabra).trim().length > 22) {
      lineas.push(actual.trim());
      actual = palabra;
    } else {
      actual = `${actual} ${palabra}`;
    }
  }
  if (actual.trim()) lineas.push(actual.trim());

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="${escapeXml(
    options.title
  )}">
  <title>Credencial de aprovechamiento · ${escapeXml(options.title)}</title>
  <defs>
    <linearGradient id="oro" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f2d477" />
      <stop offset="0.55" stop-color="#d4af37" />
      <stop offset="1" stop-color="#8a6d1f" />
    </linearGradient>
    <pattern id="trama" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M0 24L24 0" stroke="#d4af37" stroke-opacity="0.10" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="512" height="512" rx="72" fill="#07070a" />
  <rect width="512" height="512" rx="72" fill="url(#trama)" />
  <circle cx="256" cy="256" r="212" fill="none" stroke="url(#oro)" stroke-width="6" />
  <circle cx="256" cy="256" r="188" fill="none" stroke="#d4af37" stroke-opacity="0.35" stroke-width="2" />
  <path d="M256 96l112 220H144z" fill="none" stroke="url(#oro)" stroke-width="12" stroke-linejoin="round" />
  <circle cx="256" cy="262" r="22" fill="#f2d477" />
  <text x="256" y="140" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="url(#oro)" letter-spacing="6">${escapeXml(
    iniciales
  )}</text>
  <text x="256" y="372" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#f5f2e8">secure T</text>
${lineas
  .slice(0, 3)
  .map(
    (linea, indice) =>
      `<text x="256" y="${404 + indice * 26}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="19" fill="#a9a49a">${escapeXml(
        linea
      )}</text>`
  )
  .join("\n")}
  <text x="256" y="480" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="#8a6d1f" letter-spacing="3">APROVECHAMIENTO</text>
</svg>
`;
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Vista Open Badges 3.0 / VC 1.1 del mismo expediente.
 *
 * Se entrega la forma que pide la especificación (incluido el contexto de
 * 1EdTech), pero **sin registro**: no hay endpoint que resuelva `credentialStatus`
 * ni lista de revocación. Se documenta como tal en lugar de aparentar que existe.
 */
export function toOpenBadges3(options: {
  baseUrl: string;
  assertion: Assertion;
  badgeClass: BadgeClass;
  issuer: IssuerProfile;
  achievementId?: string;
}): Record<string, unknown> {
  const { assertion, badgeClass, issuer } = options;
  return {
    "@context": [VC_CONTEXT, OB3_CONTEXT],
    id: assertion.id,
    type: ["VerifiableCredential", "OpenBadgeCredential"],
    issuer: { id: issuer.id, type: ["Profile"], name: issuer.name, url: issuer.url },
    issuanceDate: assertion.issuedOn,
    ...(assertion.expires ? { expirationDate: assertion.expires } : {}),
    credentialSubject: {
      id: assertion.recipient.identity,
      type: ["AchievementSubject"],
      achievement: {
        id: options.achievementId ?? badgeClass.id,
        type: ["Achievement"],
        name: badgeClass.name,
        description: badgeClass.description,
        criteria: { id: badgeClass.criteria.id, narrative: badgeClass.criteria.narrative },
        image: { id: badgeClass.image, type: "Image" }
      }
    },
    credentialStatus: {
      id: `${options.baseUrl.replace(/\/$/, "")}/credential/status`,
      type: "PLANNED · sin registro público de revocación"
    }
  };
}

/* -------------------------------------------- Open Badges 3.0 · VC-JWT */

/**
 * Credencial **Open Badges 3.0 serializada como VC-JWT**.
 *
 * Open Badges 3.0 se apoya en Verifiable Credentials y admite varias formas de
 * firma; la que no necesita un registro central ni un canonizador RDF es la
 * JWT (JOSE, RFC 7515): la credencial viaja como carga útil firmada con RS256,
 * exactamente igual que una aserción firmada de OB 2.0, pero con el contexto y
 * los campos de la versión 3. Es lo que aceptan los verificadores y monederos
 * modernos.
 */
export async function signCredentialJwt(
  credential: Record<string, unknown>,
  privateKey: CryptoKey,
  keyId: string
): Promise<string> {
  const header = { alg: "RS256", kid: keyId, typ: "JWT" };
  const cabecera = toBase64Url(encoder.encode(JSON.stringify(header)));
  const carga = toBase64Url(encoder.encode(JSON.stringify(credential)));
  const firma = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, encoder.encode(`${cabecera}.${carga}`));
  return `${cabecera}.${carga}.${toBase64Url(new Uint8Array(firma))}`;
}

export interface CredentialVerification {
  valid: boolean;
  credential?: Record<string, unknown>;
  reason?: string;
}

/** Verifica un VC-JWT y devuelve la credencial si la firma es auténtica. */
export async function verifyCredentialJwt(jws: string, jwk: PublicJwk): Promise<CredentialVerification> {
  const partes = jws.trim().split(".");
  if (partes.length !== 3) return { valid: false, reason: "jwt_mal_formado" };
  const [cabecera, carga, firma] = partes as [string, string, string];

  let credential: Record<string, unknown>;
  try {
    credential = JSON.parse(new TextDecoder().decode(fromBase64Url(carga))) as Record<string, unknown>;
  } catch {
    return { valid: false, reason: "carga_ilegible" };
  }

  try {
    const clave = await crypto.subtle.importKey(
      "jwk",
      { ...jwk, alg: "RS256", ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valida = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      clave,
      fromBase64Url(firma),
      encoder.encode(`${cabecera}.${carga}`)
    );
    if (!valida) return { valid: false, reason: "firma_no_valida" };
    return { valid: true, credential };
  } catch (error) {
    return { valid: false, reason: error instanceof Error ? error.message : "error_de_verificacion" };
  }
}
