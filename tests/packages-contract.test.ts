import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { buildPackages } from "../tools/build-packages";
import { readZipEntries } from "../tools/lib/zip";
import { isWellFormedXml, xmlErrors } from "../tools/lib/xml";
import { validateStatement, type XapiStatement } from "@secure-t/shared";

/**
 * Contrato de los paquetes interoperables.
 *
 * Cada fichero que sale de `tools/build-packages.ts` tiene que ser **válido para
 * el estándar que dice cumplir**, no solo existir: EPUB 3.3 con su `mimetype`
 * primero y sin comprimir, SCORM 2004 con sus namespaces y sus SCO XHTML,
 * Common Cartridge 1.3 con QTI 1.2 dentro, y declaraciones xAPI conformes.
 *
 * Además se exige **determinismo**: el mismo material debe producir los mismos
 * bytes, porque de eso depende que las huellas SHA-256 publicadas sirvan para
 * verificar una copia.
 */

const outDir = mkdtempSync(join(tmpdir(), "secure-t-paquetes-"));
const AHORA = new Date("2026-10-11T00:00:00.000Z");
const resultado = buildPackages({ outDir, now: AHORA, baseUrl: "https://example.invalid/app" });
const indice = JSON.parse(readFileSync(join(outDir, "index.json"), "utf8")) as {
  standards: Record<string, string>;
  courses: { slug: string; weeks: number; quizItems: number }[];
  files: { path: string; bytes: number; sha256: string }[];
  assets: { path: string; bytes: number; sha256: string }[];
};

const CURSOS = ["ciber-defensiva", "ciber-ofensiva", "gobernanza-compliance", "ia-aplicada-segura"];

function leer(nombre: string): Buffer {
  return readFileSync(join(outDir, nombre));
}

function xmlDe(nombre: string, dentro: string): string {
  const entrada = readZipEntries(leer(nombre)).find((item) => item.name === dentro);
  if (!entrada) throw new Error(`${nombre} no contiene ${dentro}`);
  return entrada.data.toString("utf8");
}

afterAll(() => {
  rmSync(outDir, { recursive: true, force: true });
});

describe("manifiesto de paquetes", () => {
  it("declara los cinco estándares aplicados", () => {
    expect(indice.standards).toMatchObject({
      epub: "EPUB 3.3 (W3C) + EPUB Accessibility 1.1",
      scorm: "SCORM 2004 4th Edition (ADL)",
      commonCartridge: "IMS Common Cartridge 1.3",
      qti: "IMS QTI 1.2",
      xapi: "xAPI 1.0.3 (ADL, IEEE 9274.1.1-2023)"
    });
  });

  it("cubre los cuatro programas con 20 semanas y 6 preguntas", () => {
    expect(indice.courses.map((course) => course.slug)).toEqual(CURSOS);
    for (const course of indice.courses) {
      expect(course.weeks).toBe(20);
      expect(course.quizItems).toBe(6);
    }
  });

  it("publica la huella real de cada fichero y el total coincide con el disco", () => {
    for (const file of indice.files) {
      const contenido = readFileSync(join(outDir, file.path));
      expect(createHash("sha256").update(contenido).digest("hex")).toBe(file.sha256);
      expect(contenido.byteLength).toBe(file.bytes);
    }
  });

  it("las insignias SVG acompañan a cada clase de insignia", () => {
    expect(indice.assets.map((asset) => asset.path).sort()).toEqual(
      CURSOS.map((slug) => `badges/${slug}.svg`).sort()
    );
  });

  it("es determinista: dos compilaciones dan exactamente los mismos bytes", () => {
    const otro = mkdtempSync(join(tmpdir(), "secure-t-paquetes-"));
    const segundo = buildPackages({ outDir: otro, now: AHORA, baseUrl: "https://example.invalid/app" });
    const firma = (files: { path: string; sha256: string }[]) =>
      files
        .slice()
        .sort((a, b) => a.path.localeCompare(b.path))
        .map((file) => `${file.path}:${file.sha256}`);
    expect(firma(segundo.files)).toEqual(firma(resultado.files));
    rmSync(otro, { recursive: true, force: true });
  });
});

describe("EPUB 3.3", () => {
  for (const slug of CURSOS) {
    it(`${slug}: mimetype sin comprimir y primero, estructura y metadatos completos`, () => {
      const buffer = leer(`${slug}.epub`);
      const entradas = readZipEntries(buffer);

      const primera = entradas[0];
      expect(primera?.name).toBe("mimetype");
      expect(primera?.method).toBe(0); // almacenado, como exige EPUB
      expect(primera?.data.toString("utf8")).toBe("application/epub+zip");
      // El fichero mimetype tiene que empezar en el byte 38: cabecera local +
      // nombre, sin campo extra. Lo comprueba la propia especificación (OCF §4).
      expect(buffer.indexOf("application/epub+zip")).toBe(38);

      const container = xmlDe(`${slug}.epub`, "META-INF/container.xml");
      expect(isWellFormedXml(container), xmlErrors(container).join("; ")).toBe(true);
      expect(container).toContain('full-path="OEBPS/package.opf"');
      expect(container).toContain("application/oebps-package+xml");

      const opf = xmlDe(`${slug}.epub`, "OEBPS/package.opf");
      expect(isWellFormedXml(opf), xmlErrors(opf).join("; ")).toBe(true);
      expect(opf).toContain('version="3.0"');
      expect(opf).toContain('unique-identifier="pub-id"');
      expect(opf).toContain('property="dcterms:modified"'); // obligatorio en EPUB 3
      expect(opf).toContain("dc:identifier");
      expect(opf).toContain("dc:language");
      expect(opf).toContain('properties="nav"');
      // EPUB Accessibility 1.1: modos, características y aviso de peligro.
      expect(opf).toContain('property="schema:accessMode"');
      expect(opf).toContain('property="schema:accessibilityFeature"');
      expect(opf).toContain('property="schema:accessibilityHazard">none');
      expect(opf).toContain("epub-a11y-11");

      const nav = xmlDe(`${slug}.epub`, "OEBPS/nav.xhtml");
      expect(isWellFormedXml(nav), xmlErrors(nav).join("; ")).toBe(true);
      expect(nav).toContain('epub:type="toc"');

      const semanas = entradas.filter((entrada) => /^OEBPS\/semana-\d+\.xhtml$/.test(entrada.name));
      expect(semanas).toHaveLength(20);
      for (const semana of semanas) {
        const xhtml = semana.data.toString("utf8");
        expect(isWellFormedXml(xhtml), `${semana.name}: ${xmlErrors(xhtml).join("; ")}`).toBe(true);
      }
    });
  }
});

describe("SCORM 2004 4th Edition", () => {
  for (const slug of CURSOS) {
    it(`${slug}: manifiesto con namespaces, SCO por semana y puente de la API`, () => {
      const nombre = `${slug}-scorm2004.zip`;
      const manifest = xmlDe(nombre, "imsmanifest.xml");
      expect(isWellFormedXml(manifest), xmlErrors(manifest).join("; ")).toBe(true);
      expect(manifest).toContain('xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"');
      expect(manifest).toContain('xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"');
      expect(manifest).toContain('xmlns:imsss="http://www.imsglobal.org/xsd/imsss"');
      expect(manifest).toContain("<schema>ADL SCORM</schema>");
      expect(manifest).toContain("<schemaversion>2004 4th Edition</schemaversion>");
      expect(manifest.match(/adlcp:scormType="sco"/g)).toHaveLength(21); // 20 semanas + presentación
      expect(manifest.match(/<item /g)).toHaveLength(21);
      // Cada item apunta a un recurso que existe.
      for (const item of manifest.matchAll(/identifierref="([^"]+)"/g)) {
        expect(manifest).toContain(`<resource identifier="${item[1]}"`);
      }

      const scos = readZipEntries(leer(nombre)).filter((entrada) => entrada.name.startsWith("sco/") && entrada.name.endsWith(".html"));
      expect(scos).toHaveLength(21);
      for (const sco of scos) {
        const xhtml = sco.data.toString("utf8");
        expect(isWellFormedXml(xhtml), `${sco.name}: ${xmlErrors(xhtml).join("; ")}`).toBe(true);
        expect(xhtml).toContain("API_1484_11");
        expect(xhtml).toContain("cmi.completion_status");
        expect(xhtml).toContain("cmi.session_time");
        expect(xhtml).toContain("LMSTerminate");
        expect(xhtml).toContain("xhtml");
      }
      // LOM mínimo para que el catálogo del LMS tenga datos.
      const lom = xmlDe(nombre, "metadata.xml");
      expect(isWellFormedXml(lom), xmlErrors(lom).join("; ")).toBe(true);
      expect(lom).toContain("learningResourceType");
    });
  }
});

describe("IMS Common Cartridge 1.3 + QTI 1.2", () => {
  for (const slug of CURSOS) {
    it(`${slug}: cartucho con webcontent y evaluación QTI`, () => {
      const nombre = `${slug}.imscc`;
      const manifest = xmlDe(nombre, "imsmanifest.xml");
      expect(isWellFormedXml(manifest), xmlErrors(manifest).join("; ")).toBe(true);
      expect(manifest).toContain("http://www.imsglobal.org/xsd/imsccv1p3/imscp_v1p1");
      expect(manifest).toContain("<schema>IMS Common Cartridge</schema>");
      expect(manifest).toContain("<schemaversion>1.3.0</schemaversion>");
      expect(manifest).toContain('type="imsqti_xmlv1p2"');
      expect(manifest.match(/type="webcontent"/g)).toHaveLength(21); // presentación + 20 semanas
      expect(manifest).toContain('structure="rooted-hierarchy"');

      const qti = xmlDe(nombre, `${slug}-qti12.xml`);
      expect(isWellFormedXml(qti), xmlErrors(qti).join("; ")).toBe(true);
      expect(qti).toContain('xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2"');
      expect(qti.match(/<item /g)).toHaveLength(6);
      expect(qti).toContain("<response_lid");
      expect(qti).toContain("<resprocessing>");
      expect(qti).toContain('<setvar varname="SCORE" action="Set">1</setvar>');
      expect(qti.match(/<itemfeedback /g)).toHaveLength(12); // correcta + incorrecta por pregunta
    });
  }

  it("la respuesta correcta de QTI apunta al índice real de quiz.json", () => {
    const fuente = JSON.parse(readFileSync("campus/cursos/ciber-defensiva/quiz.json", "utf8")) as {
      correcta: number;
      opciones: string[];
    }[];
    const qti = xmlDe("ciber-defensiva.imscc", "ciber-defensiva-qti12.xml");
    fuente.forEach((pregunta, indice) => {
      const bloque = qti.slice(qti.indexOf(`ident="ciber-defensiva-pregunta-${indice + 1}"`));
      const fin = bloque.indexOf("</item>");
      expect(bloque.slice(0, fin)).toContain(`>opcion-${pregunta.correcta + 1}</varequal>`);
    });
  });
});

describe("xAPI 1.0.3", () => {
  for (const slug of CURSOS) {
    it(`${slug}: cinco declaraciones conformes y actor anónimo`, () => {
      const datos = JSON.parse(readFileSync(join(outDir, `${slug}-xapi.json`), "utf8")) as {
        statements: XapiStatement[];
        note: string;
      };
      expect(datos.statements).toHaveLength(5);
      expect(datos.note).toContain("no envía datos");
      for (const statement of datos.statements) {
        expect(validateStatement(statement), JSON.stringify(validateStatement(statement))).toEqual([]);
      }
      const verbos = datos.statements.map((statement) => statement.verb.id.split("/").pop());
      expect(verbos).toEqual(["initialized", "progressed", "completed", "passed", "earned"]);
      // Anonimato: ninguna declaración lleva correo ni identificador personal.
      const serializado = JSON.stringify(datos);
      expect(serializado).not.toMatch(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
      expect(serializado).not.toMatch(/mailto:/);
    });
  }
});
