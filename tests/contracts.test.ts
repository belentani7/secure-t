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
import { globSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CSP, CSP_DIRECTIVES, CSP_META, META_HEADERS, SECURITY_HEADERS } from "../apps/web/src/lib/security-headers";
import { LOCALES } from "../packages/shared/src/i18n";
import { TOOL_IDS } from "../packages/shared/src/tutor-tools";

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

  it("el sitio estático aplica la política como metadatos, sin lo que un <meta> no admite", () => {
    expect(chrome).toContain("META_HEADERS");
    const cspMeta = META_HEADERS.find((meta) => meta.httpEquiv === "Content-Security-Policy");
    expect(cspMeta?.content).toBe(CSP_META);
    // `frame-ancestors` sólo viaja como cabecera: dentro de un `<meta>` Chrome
    // lo ignora y lo denuncia en la consola, que es un error de verdad y además
    // una auditoría de Lighthouse en rojo.
    expect(CSP).toContain("frame-ancestors 'none'");
    expect(cspMeta?.content).not.toContain("frame-ancestors");
    expect(CSP_META.split("; ")).toHaveLength(CSP_DIRECTIVES.length - 1);
  });

  it("el service worker no precarga nada externo ni el propio SBOM", () => {
    const sw = leer("apps/web/public/sw.js");
    expect(sw).not.toMatch(/https?:\/\//);
    expect(sw).not.toContain("sbom.cdx.json");
  });

  it("el service worker monta sus rutas sobre la carpeta real del despliegue", () => {
    // Publicado en `/app`, cachear `/pt` no guardaba nada: las rutas se derivan
    // de dónde vive el propio `sw.js`.
    const sw = leer("apps/web/public/sw.js");
    expect(sw).toContain("self.location.pathname");
    expect(sw).toMatch(/SHELL\s*=\s*\[[\s\S]*?\]\.map\(ruta\)/);
    expect(sw).toMatch(/PREFIJOS_CACHEABLES[\s\S]*?\.map\(ruta\)/);
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

/* ------------------------------- biblioteca, plan quinquenal y laboratorio -- */

/**
 * Las tres páginas nuevas existen en los cuatro idiomas y sus claves están en
 * los cuatro diccionarios. Se comprueba contra el fichero, no contra la
 * intención: una ruta sin traducción es una ruta a medio hacer.
 */

describe("biblioteca abierta, plan de cinco años y laboratorio de IA", () => {
  const CLAVES = [
    "nav.library",
    "nav.plan",
    "nav.lab",
    "library.title",
    "library.rule.title",
    "plan.title",
    "plan.phase.capstone.title",
    "lab.title",
    "lab.guard.injection",
    "lab.limit.patterns",
    "tool.panel.title",
    "tool.listar_programas"
  ];

  for (const locale of ["pt", "es", "en", "ca"]) {
    it(`las tres rutas y sus claves existen en ${locale}`, () => {
      for (const ruta of ["biblioteca", "plano", "laboratorio"]) {
        expect(hay(`apps/web/src/app/(landing)/${ruta}/page.tsx`), `falta la portada PT de ${ruta}`).toBe(true);
        expect(hay(`apps/web/src/app/[locale]/${ruta}/page.tsx`), `falta la ruta con idioma de ${ruta}`).toBe(true);
      }
      const diccionario = leer(`packages/shared/src/i18n/${locale}.ts`);
      for (const clave of CLAVES) expect(diccionario).toContain(`"${clave}"`);
    });
  }

  it("las rutas están en el menú, el mapa del sitio y el pie", () => {
    const site = leer("apps/web/src/lib/site.ts");
    const sitemap = leer("apps/web/src/app/sitemap.ts");
    const footer = leer("apps/web/src/components/site-footer.tsx");
    for (const ruta of ["/biblioteca", "/plano", "/laboratorio"]) {
      expect(site).toContain(`path: "${ruta}"`);
      expect(sitemap).toContain(`"${ruta}"`);
      expect(footer).toContain(`localePath(locale, "${ruta}")`);
    }
  });

  it("la biblioteca enlaza autores y no espejos de cursos de pago", () => {
    const biblioteca = leer("packages/shared/src/library.ts");
    expect(biblioteca).toContain("DOMINIOS_PROHIBIDOS");
    expect(biblioteca).toMatch(/drivedepobre\.com/);
    expect(biblioteca).toMatch(/youtube\.com\/@/);
    // La regla vive en el dato y en el test: sin lista negra no hay promesa.
    expect(leer("packages/shared/tests/library.test.ts")).toContain("DOMINIOS_PROHIBIDOS");
  });

  it("el plan cubre 200 semanas y dice cuántas están publicadas", () => {
    const plan = leer("packages/shared/src/curriculum-5y.ts");
    expect(plan).toContain("TOTAL_WEEKS = 200");
    expect(plan).toContain("CAMPUS_WEEKS_PUBLISHED");
    expect(plan).toContain("validateCurriculum");
    expect(leer("packages/shared/tests/library.test.ts")).toContain("validateCurriculum");
  });

  it("el laboratorio son cinco instrumentos y ninguno promete de más", () => {
    const lab = leer("packages/shared/src/lab.ts");
    expect(lab).toContain("LAB_INSTRUMENTS");
    expect(lab).toContain("lab.limit.patterns");
    expect(lab).not.toMatch(/\bfetch\s*\(/);
    expect(leer("packages/shared/tests/lab.test.ts")).toContain("declara su límite");
    // Los instrumentos se integran en la consola del agente, no en una página suelta.
    expect(leer("apps/web/src/components/agent-console.tsx")).toContain("tool.panel.title");
  });

  it("el contrato de la API documenta las herramientas del tutor", () => {
    const contrato = leer("CONTRATO_API.md");
    expect(contrato).toContain('"tools"');
    for (const herramienta of TOOL_IDS) expect(contrato).toContain(`\`${herramienta}\``);
    expect(contrato).toContain("sólo lectura");
    expect(contrato).toContain("plan_estudio");
  });
});

/* ------------------------ experiencia: psicología aplicada y el guiño de Río */

describe("experiencia medida y guiño de Río", () => {
  const CLAVES = [
    "nav.experience",
    "experience.title",
    "experience.color.why",
    "experience.laws.title",
    "experience.motion.note",
    "experience.rio.lead",
    "experience.proof.title"
  ];

  for (const locale of ["pt", "es", "en", "ca"]) {
    it(`la página de experiencia existe con traducción en ${locale}`, () => {
      expect(hay(`apps/web/src/app/(landing)/experiencia/page.tsx`)).toBe(true);
      expect(hay(`apps/web/src/app/[locale]/experiencia/page.tsx`)).toBe(true);
      const diccionario = leer(`packages/shared/src/i18n/${locale}.ts`);
      for (const clave of CLAVES) expect(diccionario).toContain(`"${clave}"`);
    });
  }

  it("la ruta está en el menú, el mapa del sitio y el pie", () => {
    expect(leer("apps/web/src/lib/site.ts")).toContain('path: "/experiencia"');
    expect(leer("apps/web/src/app/sitemap.ts")).toContain('"/experiencia"');
    expect(leer("apps/web/src/components/site-footer.tsx")).toContain('localePath(locale, "/experiencia")');
  });

  it("el horizonte de Río es decoración y viaja en el HTML", () => {
    const horizonte = leer("apps/web/src/components/rio-horizon.tsx");
    expect(horizonte).toContain('aria-hidden="true"');
    expect(horizonte).toContain("<svg");
    const codigo = horizonte.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(codigo).not.toMatch(/<img|\.svg|\.png|\.jpg|background-image/);
    // Y abre y cierra la portada, como manda la regla del pico-final.
    const landing = leer("apps/web/src/components/landing.tsx");
    expect((landing.match(/<RioHorizon /g) ?? []).length).toBe(2);
  });

  it("la matriz de accesibilidad cubre las tres rutas nuevas", () => {
    const matriz = leer("e2e/a11y.spec.ts");
    for (const ruta of ["/app/biblioteca", "/app/plano", "/app/laboratorio", "/app/experiencia"]) {
      expect(matriz, `falta ${ruta} en la matriz axe`).toContain(ruta);
    }
  });
});

describe("el README documenta la capa de experiencia", () => {
  const readme = leer("README.md");

  it("explica el método y enlaza la investigación", () => {
    expect(readme).toContain("La experiencia, medida");
    expect(readme).toContain("packages/ui/src/psychology.ts");
    expect(readme).toContain("docs/PSICOLOGIA-Y-EXPERIENCIA.md");
  });

  it("publica las cifras de prueba que existen de verdad", () => {
    // Los ficheros de test de vitest son la fuente: si crecen, el README tiene que decirlo.
    // El número de tests no se puede contar desde dentro de la propia suite: se
    // exige un suelo honesto (> 300) y lo que sí se puede comprobar —el número de
    // ficheros— se comprueba exactamente contra el árbol real.
    const declarados = Number(readme.match(/(\d+) ficheros, (\d+) tests \(vitest\)/)?.[2] ?? 0);
    expect(declarados).toBeGreaterThan(300);
    const ficheros = globSync(["packages/*/tests/**/*.test.ts", "tests/**/*.test.ts"]);
    const numero = Number(readme.match(/(\d+) ficheros, \d+ tests \(vitest\)/)?.[1] ?? 0);
    expect(ficheros.length, "el README declara un número de ficheros de test distinto del real").toBe(numero);
  });

  it("no promete nada del guiño que el código no haga", () => {
    expect(readme).toContain("SVG en línea");
    expect(readme).toContain("aria-hidden");
    expect(readme).toContain("docs/PSICOLOGIA-Y-EXPERIENCIA.md");
  });
});
