import { beforeAll, describe, expect, it } from "vitest";
import {
  badgeSvg,
  buildAssertion,
  buildBadgeClass,
  buildIssuer,
  createIssuerKey,
  exportPublicJwk,
  fromBase64Url,
  keyIdFor,
  signAssertion,
  signCredentialJwt,
  toBase64Url,
  toOpenBadges3,
  validateAssertion,
  validateBadgeClass,
  verifyBadgeJws,
  verifyCredentialJwt,
  type Assertion,
  type PublicJwk
} from "../src/badges";

/**
 * Credenciales abiertas (Open Badges 2.0) firmadas con RS256.
 *
 * Lo que se comprueba aquí es lo que hace que una credencial **valga**: que
 * cumpla los campos obligatorios del estándar, que la firma se pueda verificar
 * con la clave pública sin servidor y que **cualquier manipulación se detecte**.
 */

const BASE = "https://belentani7.github.io/secure-t/app";
/** Identificador anónimo de prueba: se genera en ejecución, no vive en el repositorio. */
const TOKEN = crypto.randomUUID();
let pareja: CryptoKeyPair;
let jwk: PublicJwk;
let otroJwk: PublicJwk;

beforeAll(async () => {
  pareja = await createIssuerKey();
  jwk = await exportPublicJwk(pareja);
  const otra = await createIssuerKey();
  otroJwk = await exportPublicJwk(otra);
});

const clase = buildBadgeClass({
  baseUrl: BASE,
  slug: "ciber-defensiva",
  title: "Ciberseguridad Defensiva: Operar como SOC",
  weeks: 20
});

const asercion = (): Assertion =>
  buildAssertion({
    baseUrl: BASE,
    token: TOKEN,
    badgeClassId: clase.id,
    issuedOn: "2026-05-24T00:00:00.000Z",
    weeksDone: 20,
    weeksTotal: 20,
    keyId: `RS256:${jwk.kid}`
  });

describe("base64url", () => {
  it("ida y vuelta sin perder bytes", () => {
    const original = new Uint8Array([0, 1, 2, 250, 255, 128, 64]);
    expect([...fromBase64Url(toBase64Url(original))]).toEqual([...original]);
  });

  it("no usa +, / ni relleno (RFC 4648 §5)", () => {
    const codificado = toBase64Url(new Uint8Array([251, 255, 191, 254]));
    expect(codificado).not.toMatch(/[+/=]/);
  });
});

describe("perfiles del estándar", () => {
  it("la clase de insignia cumple Open Badges 2.0", () => {
    expect(validateBadgeClass(clase)).toEqual([]);
    expect(clase.type).toBe("BadgeClass");
    expect(clase.criteria.narrative).toContain("30 % P1");
    expect(clase.image).toBe(`${BASE}/badges/ciber-defensiva.svg`);
    expect(clase.alignment?.length).toBeGreaterThan(0);
  });

  it("el emisor declara URL, nombre y descripción", () => {
    const issuer = buildIssuer(BASE, "RS256:abc");
    expect(issuer.type).toBe("Issuer");
    expect(issuer.id).toBe(`${BASE}/api/issuer`);
    expect(issuer.publicKey?.id).toBe("RS256:abc");
  });

  it("la aserción cumple los campos obligatorios y no lleva datos personales", () => {
    const assertion = asercion();
    expect(validateAssertion(assertion)).toEqual([]);
    expect(assertion["@context"]).toBe("https://w3id.org/openbadges/v2");
    expect(assertion.recipient.type).toBe("url");
    expect(assertion.recipient.hashed).toBe(false);
    expect(JSON.stringify(assertion)).not.toMatch(/@\w+\.\w+/); // sin correos
  });

  it("detecta aserciones incompletas en lugar de aceptarlas", () => {
    const problemas = validateAssertion({ type: "Assertion", issuedOn: "ayer" } as Partial<Assertion>);
    expect(problemas).toContain("falta id");
    expect(problemas).toContain("falta badge (ID de la clase)");
    expect(problemas).toContain("falta recipient");
    expect(problemas).toContain("issuedOn no es una fecha ISO 8601");
    expect(problemas).toContain("falta verification.type");
  });
});

describe("firma y verificación sin servidor", () => {
  it("el identificador de clave deriva del propio JWK (estable y sin aleatoriedad)", async () => {
    const otro = await keyIdFor(jwk);
    expect(await keyIdFor(jwk)).toBe(otro);
    expect(otro).toHaveLength(32);
  });

  it("firma un JWS de tres partes y se verifica con la clave pública", async () => {
    const jws = await signAssertion(asercion(), pareja.privateKey, `RS256:${jwk.kid}`);
    expect(jws.split(".")).toHaveLength(3);

    const resultado = await verifyBadgeJws(jws, jwk);
    expect(resultado.valid).toBe(true);
    expect(resultado.assertion?.badge).toBe(clase.id);
    expect(resultado.assertion?.narrative).toContain("20 de 20 semanas");
  });

  it("detecta una aserción manipulada (no basta con cambiar el JSON)", async () => {
    const jws = await signAssertion(asercion(), pareja.privateKey, `RS256:${jwk.kid}`);
    const [cabecera, carga, firma] = jws.split(".") as [string, string, string];
    const alterada = JSON.parse(new TextDecoder().decode(fromBase64Url(carga))) as Assertion;
    alterada.narrative = "Expediente inventado: 20 de 20 semanas";
    const nuevaCarga = toBase64Url(new TextEncoder().encode(JSON.stringify(alterada)));

    const resultado = await verifyBadgeJws(`${cabecera}.${nuevaCarga}.${firma}`, jwk);
    expect(resultado.valid).toBe(false);
    expect(resultado.reason).toBe("firma_no_valida");
  });

  it("rechaza la firma de otra clave distinta", async () => {
    const jws = await signAssertion(asercion(), pareja.privateKey, "RS256:ajena");
    const resultado = await verifyBadgeJws(jws, otroJwk);
    expect(resultado.valid).toBe(false);
  });

  it("rechaza un JWS mal formado sin lanzar excepciones", async () => {
    expect((await verifyBadgeJws("no-es-un-jws", jwk)).reason).toBe("jws_mal_formado");
    expect((await verifyBadgeJws("a.b.c", jwk)).valid).toBe(false);
  });
});

describe("insignia visual y vista 3.0", () => {
  it("genera un SVG accesible con título y nombre del programa", () => {
    const svg = badgeSvg({ title: "Gobernanza y Compliance Digital", slug: "gobernanza-compliance" });
    expect(svg.startsWith('<?xml version="1.0" encoding="utf-8"?>')).toBe(true);
    expect(svg).toContain('role="img"');
    expect(svg).toContain("<title>Credencial de aprovechamiento");
    expect(svg).toContain("Gobernanza");
    expect(svg).toContain("APROVECHAMIENTO");
  });

  it("escapa el texto que va dentro del SVG", () => {
    const svg = badgeSvg({ title: "Curso <script> & \"comillas\"", slug: "x" });
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&amp;");
  });

  it("la vista Open Badges 3.0 lleva los contextos y el logro, y dice la verdad sobre el registro", () => {
    const vista = toOpenBadges3({
      baseUrl: BASE,
      assertion: asercion(),
      badgeClass: clase,
      issuer: buildIssuer(BASE)
    }) as Record<string, any>;

    expect(vista["@context"]).toContain("https://www.w3.org/2018/credentials/v1");
    expect(vista["@context"]).toContain("https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json");
    expect(vista.type).toEqual(["VerifiableCredential", "OpenBadgeCredential"]);
    expect(vista.credentialSubject.achievement.name).toContain("Ciberseguridad Defensiva");
    expect(vista.credentialStatus.type).toContain("PLANNED");
  });
});

describe("Open Badges 3.0 en VC-JWT", () => {
  it("la credencial firmada se verifica con la clave pública y conserva el contexto 3.0", async () => {
    const emisor = buildIssuer(BASE, `RS256:${jwk.kid}`);
    const credencial = {
      ...toOpenBadges3({ baseUrl: BASE, assertion: asercion(), badgeClass: clase, issuer: emisor }),
      iss: emisor.id
    };

    const jwt = await signCredentialJwt(credencial, pareja.privateKey, `RS256:${jwk.kid}`);
    expect(jwt.split(".")).toHaveLength(3);

    const resultado = await verifyCredentialJwt(jwt, jwk);
    expect(resultado.valid, resultado.reason).toBe(true);
    expect(resultado.credential?.type).toContain("OpenBadgeCredential");
    expect(String((resultado.credential?.["@context"] as string[]).join(" "))).toContain("ob/v3p0");
  });

  it("una carga útil manipulada se detecta", async () => {
    const jwt = await signCredentialJwt({ id: "urn:uuid:prueba" }, pareja.privateKey, "RS256:kid-de-prueba");
    const [cabecera, , firma] = jwt.split(".") as [string, string, string];
    const manipulada = Buffer.from(JSON.stringify({ id: "urn:uuid:otra" })).toString("base64url");

    const resultado = await verifyCredentialJwt(`${cabecera}.${manipulada}.${firma}`, jwk);
    expect(resultado.valid).toBe(false);
    expect(resultado.reason).toBe("firma_no_valida");
  });

  it("otra clave no valida la firma aunque el algoritmo sea el mismo", async () => {
    const jwt = await signCredentialJwt({ id: "urn:uuid:prueba" }, pareja.privateKey, "RS256:kid-de-prueba");
    const resultado = await verifyCredentialJwt(jwt, otroJwk);
    expect(resultado.valid).toBe(false);
    expect(resultado.reason).toBe("firma_no_valida");
  });

  it("un texto que no es un JWT se rechaza sin intentar verificar", async () => {
    const resultado = await verifyCredentialJwt("no-es-un-jwt", jwk);
    expect(resultado.valid).toBe(false);
    expect(resultado.reason).toBe("jwt_mal_formado");
  });
});
