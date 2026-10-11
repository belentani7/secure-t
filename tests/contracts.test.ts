/**
 * Contratos de la capa de estándares: lo que el campus **afirma** sobre sí
 * mismo se comprueba aquí contra el fichero que lo implementa.
 *
 * Criterio de honestidad del proyecto: ninguna conformidad se declara sin una
 * prueba que la respalde. Este fichero es el que impide que una página de
 * estándares se quede contando algo que el repositorio ya no hace.
 */

import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CSP, CSP_DIRECTIVES, META_HEADERS, SECURITY_HEADERS } from "../apps/web/src/lib/security-headers";
import { LOCALES } from "../packages/shared/src/i18n";

const root = join(__dirname, "..");
const leer = (rel: string) => readFileSync(join(root, rel), "utf8");
const hay = (rel: string) => existsSync(join(root, rel));

/**
 * Los contratos de estándares leen artefactos **generados**. Si no están,
 * el error tiene que decir qué hacer en lugar de soltar un ENOENT críptico:
 * en CI se ejecuta `pnpm content:all` antes de los tests.
 */
function leerGenerado(rel: string): string {
  if (!hay(rel)) throw new Error(`Falta ${rel}: ejecuta «pnpm content:all» antes de los tests.`);
  return leer(rel);
}

/* ------------------------------------------------------------- security.txt */

describe("security.txt (RFC 9116)", () => {
  const texto = leer("apps/web/public/.well-known/security.txt");
  const campos = (nombre: string) =>
    texto
      .split("\n")
      .filter((linea) => linea.startsWith(`${nombre}:`))
      .map((linea) => linea.slice(nombre.length + 1).trim());

  it("está en la ruta que exige la norma", () => {
    expect(hay("apps/web/public/.well-known/security.txt")).toBe(true);
  });

  it("declara al menos un contacto, expiración, canonical y lenguas", () => {
    expect(campos("Contact").length).toBeGreaterThan(0);
    expect(campos("Expires")).toHaveLength(1);
    expect(campos("Canonical")).toHaveLength(1);
    expect(campos("Preferred-Languages").length).toBeGreaterThan(0);
  });

  it("caduca en el futuro y dentro de un año (la norma pide < 1 año)", () => {
    const expira = new Date(campos("Expires")[0]!);
    expect(Number.isNaN(expira.getTime())).toBe(false);
    const ahora = Date.now();
    expect(expira.getTime()).toBeGreaterThan(ahora);
    expect(expira.getTime() - ahora).toBeLessThan(366 * 24 * 3600 * 1000);
  });

  it("todos los contactos son mailto u https", () => {
    for (const contacto of campos("Contact")) {
      expect(contacto).toMatch(/^(mailto:[^\s@]+@[^\s@]+|https:\/\/\S+)$/);
    }
  });

  it("no anuncia claves ni documentos que no existan", () => {
    // Si se declara `Encryption:` el fichero de clave tiene que estar publicado;
    // hoy no lo está, así que no se declara (y este test lo vigila).
    if (campos("Encryption").length) {
      expect(hay("apps/web/public/.well-known/pgp-key.txt")).toBe(true);
    } else {
      expect(hay("apps/web/public/.well-known/pgp-key.txt")).toBe(false);
    }
  });

  it("Policy apunta a la página de privacidad que existe en el campus", () => {
    for (const url of campos("Policy")) {
      expect(url).toContain("/privacidad");
    }
    expect(hay("apps/web/src/components/privacy-view.tsx")).toBe(true);
  });

  it("Hiring, si se declara, apunta a un fichero del repositorio", () => {
    for (const url of campos("Hiring")) {
      const rel = url.split("/blob/main/")[1];
      expect(rel).toBeTruthy();
      expect(hay(rel!)).toBe(true);
    }
  });
});

/* --------------------------------------------------------------- cabeceras */

describe("cabeceras de seguridad (una sola política, tres consumidores)", () => {
  const headers = leer("apps/web/public/_headers");
  const nextConfig = leer("apps/web/next.config.ts");
  const chrome = leer("apps/web/src/components/site-chrome.tsx");

  it("la política CSP no permite nada externo ni marcos", () => {
    expect(CSP_DIRECTIVES).toContain("default-src 'self'");
    expect(CSP_DIRECTIVES).toContain("frame-ancestors 'none'");
    expect(CSP_DIRECTIVES).toContain("object-src 'none'");
    expect(CSP_DIRECTIVES).toContain("base-uri 'self'");
    expect(CSP).not.toMatch(/https?:\/\/(?!github)/);
  });

  it("next.config.ts sirve SECURITY_HEADERS en todas las rutas", () => {
    expect(nextConfig).toContain('import { SECURITY_HEADERS } from "./src/lib/security-headers"');
    expect(nextConfig).toContain("async headers()");
    expect(nextConfig).toContain('source: "/:path*"');
  });

  it("_headers repite exactamente las mismas cabeceras (Netlify y Cloudflare)", () => {
    for (const { key, value } of SECURITY_HEADERS) {
      expect(headers).toContain(`${key}: ${value}`);
    }
    for (const linea of headers.split("\n")) {
      if (!linea.includes(": ") || linea.startsWith("#")) continue;
      const [clave, ...resto] = linea.trim().split(": ");
      const declarada = SECURITY_HEADERS.find((cabecera) => cabecera.key === clave);
      if (declarada) expect(resto.join(": ")).toBe(declarada.value);
    }
  });

  it("el sitio estático aplica la política como metadatos (GitHub Pages no admite cabeceras)", () => {
    expect(chrome).toContain("META_HEADERS");
    const cspMeta = META_HEADERS.find((meta) => meta.httpEquiv === "Content-Security-Policy");
    expect(cspMeta?.content).toBe(CSP);
    // El aviso honesto: `frame-ancestors` no se puede expresar como metadato.
    const lib = leer("apps/web/src/lib/security-headers.ts").replace(/^\s*\*\s?/gm, "").replace(/\s+/g, " ");
    expect(lib).toMatch(/frame-ancestors[^.]{0,80}no puede aplicarse/i);
  });

  it("el service worker no precarga nada externo ni el propio SBOM", () => {
    const sw = leer("apps/web/public/sw.js");
    expect(sw).not.toMatch(/https?:\/\//);
    expect(sw).not.toContain("sbom.cdx.json");
  });
});

/* --------------------------------------------------------------------- SBOM */

describe("SBOM en CycloneDX 1.5", () => {
  const sbom = JSON.parse(leerGenerado("apps/web/public/sbom.cdx.json")) as {
    bomFormat: string;
    specVersion: string;
    serialNumber: string;
    metadata: { component: { name: string; version: string; licenses: { license: { id: string } }[] } };
    components: { name: string; version: string; purl: string; hashes: { alg: string; content: string }[]; licenses: Record<string, unknown>[] }[];
  };
  const lock = leer("pnpm-lock.yaml");
  const totalLock = (lock.match(/^ {4}resolution: \{integrity: /gm) ?? []).length;

  it("declara el formato y una versión de especificación soportada", () => {
    expect(sbom.bomFormat).toBe("CycloneDX");
    expect(sbom.specVersion).toBe("1.5");
    expect(sbom.serialNumber).toMatch(/^urn:uuid:[0-9a-f-]{36}$/);
  });

  it("inventaría exactamente lo que instala el lockfile", () => {
    expect(sbom.components.length).toBe(totalLock);
    expect(sbom.components.length).toBeGreaterThan(500);
  });

  it("cada componente lleva purl único y hash SHA-512 en hexadecimal", () => {
    const purls = new Set<string>();
    for (const componente of sbom.components) {
      expect(componente.purl).toMatch(/^pkg:npm\/(%40)?[^@]+@[^@]+$/);
      purls.add(componente.purl);
      expect(componente.hashes[0]!.alg).toBe("SHA-512");
      expect(componente.hashes[0]!.content).toMatch(/^[0-9a-f]{128}$/);
    }
    expect(purls.size).toBe(sbom.components.length);
  });

  it("cada licencia es un identificador o NOASSERTION, nunca un invento", () => {
    for (const componente of sbom.components) {
      const [licencia] = componente.licenses as { license?: { id: string }; expression?: string }[];
      const valor = licencia.license?.id ?? licencia.expression;
      expect(typeof valor).toBe("string");
      expect(valor).toMatch(/^[A-Za-z0-9.+()-]+$| /);
    }
  });

  it("el componente raíz es el propio campus, con licencia MIT", () => {
    expect(sbom.metadata.component.name).toBe("secure-t");
    expect(sbom.metadata.component.licenses[0]!.license.id).toBe("MIT");
    expect(sbom.metadata.component.version).toBe(JSON.parse(leer("package.json")).version);
  });

  it("el generador es reproducible: mismo lock, mismo serial", async () => {
    const { generate } = (await import("../tools/build-sbom.mjs")) as {
      generate: () => { components: unknown[] };
    };
    const primero = generate();
    const segundo = generate();
    expect(JSON.stringify(primero)).toBe(JSON.stringify(segundo));
    expect(primero.components.length).toBe(sbom.components.length);
  });
});

/* ------------------------------------------------- página de estándares */

describe("página de estándares: cada afirmación tiene su prueba", () => {
  const vista = leer("apps/web/src/components/standards-view.tsx");
  const evidencias = [...vista.matchAll(/evidencia: "([^"]+)"/g)].map((coincidencia) => coincidencia[1]!);

  it("declara la conformidad con los estándares que el repositorio implementa", () => {
    for (const norma of [
      "EPUB 3.3",
      "SCORM 2004",
      "Common Cartridge 1.3",
      "QTI 1.2",
      "xAPI 1.0.3",
      "Open Badges 2.0 y 3.0",
      "schema.org",
      "WCAG 2.2 AA",
      "RGPD",
      "RFC 9116",
      "CycloneDX",
      "RFC 5545"
    ]) {
      expect(vista).toContain(norma);
    }
  });

  it("todas las evidencias citadas existen de verdad", () => {
    expect(evidencias.length).toBeGreaterThan(10);
    for (const evidencia of evidencias) {
      const fichero = evidencia.split(" · ")[0]!;
      expect(hay(fichero), `falta ${fichero}`).toBe(true);
    }
  });

  it("los ficheros de evidencia contienen tests de verdad, no notas", () => {
    for (const evidencia of evidencias) {
      const fichero = evidencia.split(" · ")[0]!;
      if (!/\.(ts|mjs|js)$/.test(fichero)) continue;
      const contenido = leer(fichero);
      expect(contenido).toMatch(/\bit\(|\btest\(|expect\(/);
    }
  });

  it("lo que no está se declara PLANIFICADO en lugar de aparentarse", () => {
    expect(vista).toMatch(/LTI 1\.3/);
    expect(vista).toMatch(/PLANIFICADOS/i);
    expect(vista).toMatch(/revocaci/i);
  });
});

/* ------------------------------------------------------------- ESTANDARES.md */

describe("docs/ESTANDARES.md: la tabla de conformidad no cita fantasmas", () => {
  const doc = leer("docs/ESTANDARES.md");
  const filas = doc
    .split("\n")
    .filter((linea) => linea.startsWith("| ") && linea.endsWith(" |"))
    .filter((linea) => /APLICADA|PLANIFICADO|NO PRETENDIDA|FUERA DE ALCANCE/.test(linea));

  it("enumera las normas aplicadas y las planificadas por separado", () => {
    expect(filas.length).toBeGreaterThanOrEqual(15);
    expect(filas.filter((fila) => fila.includes("APLICADA")).length).toBeGreaterThanOrEqual(12);
    expect(filas.filter((fila) => fila.includes("PLANIFICADO")).length).toBeGreaterThanOrEqual(3);
  });

  it("cada evidencia citada en la tabla existe en el repositorio", () => {
    let citadas = 0;
    for (const fila of filas) {
      const columnas = fila.split("|");
      const evidencia = columnas[3] ?? "";
      for (const ruta of [...evidencia.matchAll(/`([^`]+)`/g)].map((m) => m[1]!)) {
        if (ruta.includes("*")) continue;
        citadas += 1;
        expect(hay(ruta), `ESTANDARES.md cita ${ruta}, que no existe`).toBe(true);
      }
    }
    expect(citadas).toBeGreaterThan(10);
  });

  it("las filas planificadas no presumen de prueba", () => {
    for (const fila of filas.filter((f) => f.includes("PLANIFICADO"))) {
      const evidencia = (fila.split("|")[3] ?? "").trim();
      expect(evidencia).toBe("—");
    }
  });

  it("la página del campus enlaza este documento y el ADR de cabeceras", () => {
    const vista = leer("apps/web/src/components/standards-view.tsx");
    expect(vista).toContain("docs/ESTANDARES.md");
    expect(hay("docs/decisions/ADR-0011-cabeceras-y-csp.md")).toBe(true);
  });
});

/* ---------------------------------------------------- rutas de la capa nueva */

describe("privacidad y estándares publicados en los cuatro idiomas", () => {
  for (const locale of ["es", "pt", "en", "ca"]) {
    it(`/privacidad y /estandares existen con traducción en ${locale}`, () => {
      expect(hay(`apps/web/src/app/(landing)/privacidad/page.tsx`)).toBe(true);
      expect(hay(`apps/web/src/app/(landing)/estandares/page.tsx`)).toBe(true);
      expect(hay(`apps/web/src/app/[locale]/privacidad/page.tsx`)).toBe(true);
      expect(hay(`apps/web/src/app/[locale]/estandares/page.tsx`)).toBe(true);
      const diccionario = leer(`packages/shared/src/i18n/${locale}.ts`);
      for (const clave of ["nav.privacy", "privacy.title", "badge.title", "xapi.title", "standards.title"]) {
        expect(diccionario).toContain(`"${clave}"`);
      }
    });
  }

  it("las rutas están en el menú y el pie, sin depender de una sola entrada", () => {
    const site = leer("apps/web/src/lib/site.ts");
    const footer = leer("apps/web/src/components/site-footer.tsx");
    expect(site).toContain('path: "/privacidad"');
    expect(site).toContain('path: "/estandares"');
    expect(footer).toContain('localePath(locale, "/privacidad")');
  });

  it("NAV_LOCALES declara los idiomas reales del campus", () => {
    expect([...LOCALES].sort()).toEqual(["ca", "en", "es", "pt"]);
  });
});

/* ------------------------------------------------------------ voz publicada */

describe("voz humanizada aprobada y publicada", () => {
  const esperados = [
    "apps/web/public/voice/es/welcome.mp3",
    "apps/web/public/voice/es/ciber-ofensiva.mp3",
    "apps/web/public/voice/es/ciber-defensiva.mp3",
    "apps/web/public/voice/pt/welcome.mp3",
    "apps/web/public/voice/pt/ia-aplicada-segura.mp3",
    "apps/web/public/voice/pt/gobernanza-compliance.mp3"
  ];

  it("los seis archivos aprobados están publicados y son MP3 reales", () => {
    for (const ruta of esperados) {
      expect(hay(ruta), `falta ${ruta}`).toBe(true);
      expect(statSync(join(root, ruta)).size).toBeGreaterThan(20_000);
      const cabecera = readFileSync(join(root, ruta)).subarray(0, 3).toString("latin1");
      const frame = readFileSync(join(root, ruta)).subarray(0, 2);
      const esMp3 = cabecera === "ID3" || (frame[0] === 0xff && (frame[1]! & 0xe0) === 0xe0);
      expect(esMp3, `${ruta} no parece MP3`).toBe(true);
    }
  });

  it("la voz de un programa usa el nombre del curso, igual que el componente espera", () => {
    const leccion = leer("apps/web/src/components/voice-lesson.tsx");
    expect(leccion).toContain("`/voice/${locale}/${slug}.mp3`");
    expect(leccion).toMatch(/speechSynthesis/);
  });

  it("escuchar deja constancia en xAPI sin enviar nada a ningún servidor", () => {
    const leccion = leer("apps/web/src/components/voice-lesson.tsx");
    const xapi = leer("apps/web/src/lib/xapi-store.ts");
    expect(leccion).toContain("recordVoiceListened");
    expect(xapi).toMatch(/no envía nada a ningún LRS/);
    expect(xapi).not.toMatch(/fetch\(/);
  });
});
