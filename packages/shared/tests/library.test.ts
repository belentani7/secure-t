/**
 * La biblioteca abierta y el plan quinquenal: contratos de honestidad.
 *
 * Dos reglas que no dependen de la buena voluntad de nadie:
 *  1. **Nada robado.** La biblioteca enlaza autores y plataformas; nunca espejos
 *     ni agregadores que redistribuyen cursos de pago sin permiso. Es la regla
 *     que el propio campus enseña en la semana 1 de ofensiva (permiso por
 *     escrito) aplicada a su propio material.
 *  2. **Nada prometido de más.** El plan de cinco años dice cuántas semanas hay
 *     publicadas hoy y cuáles faltan, sin huecos ni solapes, y sin duplicar las
 *     semanas del campus.
 */

import { describe, expect, it } from "vitest";
import {
  CAMPUS_WEEKS_PUBLISHED,
  CURRICULUM_5Y,
  DOMINIOS_PROHIBIDOS,
  LIBRARY,
  LIBRARY_COSTS,
  LIBRARY_KINDS,
  LIBRARY_LANGS,
  LIBRARY_LEVELS,
  LIBRARY_TAGS,
  TOTAL_WEEKS,
  TOTAL_YEARS,
  curriculumStats,
  filterLibrary,
  libraryForCourse,
  libraryStats,
  phaseAt,
  phasesOfYear,
  validateCurriculum
} from "../src/index";

const CURSOS = ["ciber-ofensiva", "ciber-defensiva", "ia-aplicada-segura", "gobernanza-compliance"];

describe("biblioteca abierta", () => {
  it("no enlaza espejos ni agregadores de cursos ajenos", () => {
    const culpables = LIBRARY.filter((recurso) =>
      DOMINIOS_PROHIBIDOS.some((dominio) => recurso.url.includes(dominio))
    );
    expect(culpables.map((r) => `${r.id} → ${r.url}`)).toEqual([]);
  });

  it("cada recurso tiene identificador único, URL https y datos completos", () => {
    const ids = new Set<string>();
    const urls = new Set<string>();
    for (const recurso of LIBRARY) {
      expect(ids.has(recurso.id), `id repetido: ${recurso.id}`).toBe(false);
      ids.add(recurso.id);
      expect(recurso.name.trim().length, `${recurso.id} sin nombre`).toBeGreaterThan(1);
      expect(recurso.org.trim().length, `${recurso.id} sin autor`).toBeGreaterThan(1);
      expect(recurso.note.trim().length, `${recurso.id} sin nota`).toBeGreaterThan(30);
      expect(recurso.url.startsWith("https://"), `${recurso.id} no usa https`).toBe(true);
      expect(urls.has(recurso.url), `url repetida: ${recurso.url}`).toBe(false);
      urls.add(recurso.url);
      expect(LIBRARY_KINDS).toContain(recurso.kind);
      expect(LIBRARY_LANGS).toContain(recurso.lang);
      expect(LIBRARY_COSTS).toContain(recurso.cost);
      expect(LIBRARY_LEVELS).toContain(recurso.level);
      expect(recurso.courses.length, `${recurso.id} sin programas`).toBeGreaterThan(0);
      for (const slug of recurso.courses) {
        expect(CURSOS, `${recurso.id} apunta a un programa inexistente: ${slug}`).toContain(slug);
      }
      for (const etiqueta of recurso.tags) {
        expect(LIBRARY_TAGS, `${recurso.id} usa una etiqueta no declarada: ${etiqueta}`).toContain(etiqueta);
      }
    }
    expect(LIBRARY.length).toBeGreaterThanOrEqual(40);
  });

  it("cubre los cuatro programas y los cuatro idiomas de la casa", () => {
    for (const slug of CURSOS) {
      expect(libraryForCourse(slug).length, `${slug} sin recursos`).toBeGreaterThanOrEqual(4);
    }
    const idiomas = new Set(LIBRARY.map((r) => r.lang));
    for (const idioma of ["pt", "es", "en", "multi"] as const) {
      expect(idiomas.has(idioma), `sin recursos en ${idioma}`).toBe(true);
    }
  });

  it("el filtro es determinista y respeta todos los criterios", () => {
    const web = filterLibrary({ query: "owasp" });
    expect(web.length).toBeGreaterThan(0);
    expect(web.every((r) => `${r.name} ${r.org} ${r.tags.join(" ")} ${r.note}`.toLowerCase().includes("owasp"))).toBe(true);

    const enPt = filterLibrary({ langs: ["pt"] });
    expect(enPt.length).toBeGreaterThanOrEqual(4);
    expect(enPt.every((r) => r.lang === "pt")).toBe(true);

    const abiertosAvanzados = filterLibrary({ costs: ["abierto"], levels: ["avanzado"] });
    expect(abiertosAvanzados.every((r) => r.cost === "abierto" && r.level === "avanzado")).toBe(true);

    const deOfensiva = filterLibrary({ course: "ciber-ofensiva" });
    expect(deOfensiva.every((r) => r.courses.includes("ciber-ofensiva"))).toBe(true);

    const laboratorios = filterLibrary({ kinds: ["laboratorio"] });
    expect(laboratorios.every((r) => r.kind === "laboratorio")).toBe(true);

    // Misma consulta, mismo resultado (nada de aleatoriedad en la interfaz).
    expect(filterLibrary({ query: "mitre" })).toEqual(filterLibrary({ query: "mitre" }));
    expect(filterLibrary({ query: "zzqxw" })).toEqual([]);
  });

  it("el recuento sale de los datos, no de un número escrito a mano", () => {
    const stats = libraryStats();
    expect(stats.total).toBe(LIBRARY.length);
    expect(stats.coursesCovered).toBe(4);
    expect(stats.domains).toBeGreaterThanOrEqual(20);
    const suma = LIBRARY_KINDS.reduce((total, kind) => total + stats.byKind[kind], 0);
    expect(suma).toBe(LIBRARY.length);
    const sumaLang = LIBRARY_LANGS.reduce((total, lang) => total + stats.byLang[lang], 0);
    expect(sumaLang).toBe(LIBRARY.length);
  });
});

describe("plan quinquenal", () => {
  it("cubre doscientas semanas sin huecos ni solapes", () => {
    expect(validateCurriculum()).toEqual([]);
    expect(CURRICULUM_5Y.length).toBeGreaterThanOrEqual(10);
    expect(TOTAL_YEARS).toBe(5);
    expect(TOTAL_WEEKS).toBe(200);
  });

  it("cada franja declara lo que ya existe y lo que falta", () => {
    const stats = curriculumStats();
    expect(stats.publishedWeeks).toBe(CAMPUS_WEEKS_PUBLISHED);
    expect(CAMPUS_WEEKS_PUBLISHED).toBe(80);
    const publicadas = CURRICULUM_5Y.filter((fase) => fase.published > 0);
    expect(publicadas.length).toBe(4);
    expect(publicadas.every((fase) => fase.published === 20 && fase.course)).toBe(true);
    const pendientes = CURRICULUM_5Y.filter((fase) => fase.published === 0);
    expect(pendientes.every((fase) => fase.course === null)).toBe(true);
    expect(stats.capstone).toBe(true);
  });

  it("los itinerarios del plan apuntan a recursos que existen en la biblioteca", () => {
    const ids = new Set(LIBRARY.map((recurso) => recurso.id));
    for (const fase of CURRICULUM_5Y) {
      expect(fase.sources.length, `${fase.id} sin recursos`).toBeGreaterThan(0);
      for (const fuente of fase.sources) {
        expect(ids.has(fuente), `${fase.id} cita un recurso inexistente: ${fuente}`).toBe(true);
      }
    }
  });

  it("responde qué se estudia en cualquier semana del quinquenio", () => {
    expect(phaseAt(1)?.course).toBe("ciber-defensiva");
    expect(phaseAt(20)?.course).toBe("ciber-defensiva");
    expect(phaseAt(21)?.course).toBe("ia-aplicada-segura");
    expect(phaseAt(80)?.course).toBe("gobernanza-compliance");
    expect(phaseAt(90)?.mode).toBe("laboratorio");
    expect(phaseAt(170)?.capstone).toBe(true);
    expect(phaseAt(201)).toBeUndefined();
    expect(phasesOfYear(5).length).toBe(2);
    for (let semana = 1; semana <= TOTAL_WEEKS; semana += 1) {
      expect(phaseAt(semana), `semana ${semana} sin franja`).toBeDefined();
    }
  });
});
