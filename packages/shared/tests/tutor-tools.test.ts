/**
 * Herramientas del tutor: lo que el agente hace, no lo que dice.
 *
 * Se comprueba con un corpus de mentira (determinista, sin depender del material
 * publicado): qué herramienta se activa con cada pregunta, que todas sean de
 * sólo lectura, que ninguna devuelva texto inventado y que la misma pregunta dé
 * siempre el mismo resultado. El contrato de efectos es el que importa: un tutor
 * que puede tocar cosas sin que nadie lo confirme es un riesgo (OWASP LLM08),
 * y aquí eso no existe.
 */

import { describe, expect, it } from "vitest";
import {
  CURRICULUM_5Y,
  LIBRARY,
  TOOL_IDS,
  TUTOR_TOOLS,
  detectTools,
  runTutorTools,
  weekMentioned,
  type KnowledgePack
} from "../src/index";

const pack: KnowledgePack = {
  version: 1,
  generatedAt: "2026-10-11T00:00:00.000Z",
  sourceDigest: "0000000000000000000000000000000000000000000000000000000000000000",
  counts: { courses: 2, weeks: 4, chunks: 4, words: 400 },
  chunks: [
    {
      id: "ciber-ofensiva:s1:syllabus",
      course: "ciber-ofensiva",
      courseTitle: "Ciberseguridad Ofensiva",
      week: 1,
      kind: "week",
      title: "Semana 1 · Ética y alcance",
      text: "Trabajar con permiso por escrito, alcance firmado y reglas de enfrentamiento antes de tocar nada.",
      source: "campus/cursos/ciber-ofensiva/semana-01.md",
      url: "/pt/programas/ciber-ofensiva/semana/1"
    },
    {
      id: "ciber-ofensiva:s7:week",
      course: "ciber-ofensiva",
      courseTitle: "Ciberseguridad Ofensiva",
      week: 7,
      kind: "week",
      title: "Semana 7 · Escaneo de vulnerabilidades",
      text: "Validar antes de escribir: reproducir, aislar la causa, medir el impacto y priorizar con KEV y EPSS.",
      source: "campus/cursos/ciber-ofensiva/semana-07.md",
      url: "/pt/programas/ciber-ofensiva/semana/7"
    },
    {
      id: "ciber-defensiva:s1:week",
      course: "ciber-defensiva",
      courseTitle: "Ciberseguridad Defensiva",
      week: 1,
      kind: "week",
      title: "Semana 1 · Tríada CIA y controles",
      text: "Confidencialidad, integridad y disponibilidad; controles preventivos, detectivos y correctivos.",
      source: "campus/cursos/ciber-defensiva/semana-01.md",
      url: "/pt/programas/ciber-defensiva/semana/1"
    },
    {
      id: "ciber-defensiva:glosario",
      course: "ciber-defensiva",
      courseTitle: "Ciberseguridad Defensiva",
      kind: "glossary",
      title: "Glosario · Telemetría",
      text: "Telemetría: registros y métricas que permiten decidir si un hecho importa.",
      source: "campus/cursos/ciber-defensiva/glosario.md",
      url: "/pt/programas/ciber-defensiva"
    }
  ]
};

describe("herramientas del tutor", () => {
  it("todas las herramientas son de sólo lectura y están documentadas", () => {
    expect(TUTOR_TOOLS.map((t) => t.id).sort()).toEqual([...TOOL_IDS].sort());
    for (const herramienta of TUTOR_TOOLS) {
      expect(herramienta.effect, `${herramienta.id} no es de lectura`).toBe("lectura");
      expect(herramienta.triggers.length, `${herramienta.id} sin disparadores`).toBeGreaterThan(2);
    }
  });

  it("detecta la herramienta por la pregunta, en los cuatro idiomas del campus", () => {
    expect(detectTools("¿qué programas hay?")).toContain("listar_programas");
    expect(detectTools("mastrame la semana 7 de ofensiva")).toContain("resumen_semana");
    expect(detectTools("que canal me recomenda para practicar?")).toContain("recomendar_biblioteca");
    expect(detectTools("por onde começo? qual é o itinerário?")).toContain("ruta_itinerario");
    expect(detectTools("como está organizado o plano de cinco anos?")).toContain("plan_estudio");
    expect(detectTools("explica-me o que é a tríade CIA")).toEqual([]);
  });

  it("lee el número de semana y descarta los que no existen", () => {
    expect(weekMentioned("repásame la semana 7")).toBe(7);
    expect(weekMentioned("week 12 please")).toBe(12);
    expect(weekMentioned("setmana 3")).toBe(3);
    expect(weekMentioned("semana 250")).toBeUndefined();
    expect(weekMentioned("ninguna semana aquí")).toBeUndefined();
  });

  it("la herramienta de semana devuelve el material citado, no prosa inventada", () => {
    const [resultado] = runTutorTools({ question: "semana 7 de ciber-ofensiva", locale: "pt", knowledge: pack });
    expect(resultado?.tool).toBe("resumen_semana");
    expect(resultado?.items.length).toBe(1);
    expect(resultado?.items[0]?.label).toContain("semana 7");
    expect(resultado?.items[0]?.detail).toContain("KEV"); // literal del corpus
    expect(resultado?.items[0]?.week).toBe(7);

    const sinMaterial = runTutorTools({ question: "semana 19", locale: "es", knowledge: pack })[0];
    expect(sinMaterial?.items).toEqual([]);
    expect(sinMaterial?.summary).toContain("19");
  });

  it("la biblioteca recomendada son recursos reales de la lista", () => {
    const [resultado] = runTutorTools({ question: "recomenda um canal para começar", locale: "pt", knowledge: pack });
    expect(resultado?.tool).toBe("recomendar_biblioteca");
    expect(resultado?.items.length).toBeGreaterThan(0);
    const nombres = LIBRARY.map((r) => r.name);
    for (const item of resultado?.items ?? []) {
      expect(nombres, `recurso inventado: ${item.label}`).toContain(item.label);
      expect(item.url?.startsWith("https://")).toBe(true);
    }
  });

  it("el plan devuelve las diez franjas del quinquenio, sin inventarse semanas publicadas", () => {
    const [resultado] = runTutorTools({ question: "cual es el plan de cinco anos", locale: "es", knowledge: pack, limit: 12 });
    expect(resultado?.tool).toBe("plan_estudio");
    expect(resultado?.items.length).toBe(CURRICULUM_5Y.length);
    const publicadas = resultado?.items.filter((item) => item.detail?.includes("ya publicadas")) ?? [];
    expect(publicadas.length).toBe(4);
    const pendientes = resultado?.items.filter((item) => item.detail?.includes("por escribir")) ?? [];
    expect(pendientes.length).toBe(CURRICULUM_5Y.length - 4);
  });

  it("misma pregunta, mismo resultado, y nada fuera del dispositivo", () => {
    const primera = runTutorTools({ question: "que recursos hay de owasp", locale: "es", knowledge: pack });
    const segunda = runTutorTools({ question: "que recursos hay de owasp", locale: "es", knowledge: pack });
    expect(primera).toEqual(segunda);
    const serializado = JSON.stringify(primera);
    expect(serializado).not.toMatch(/fetch\(|http:\/\/|apikey|api_key/i);
  });

  it("un itinerario se explica con cursos reales del corpus", () => {
    const [resultado] = runTutorTools({ question: "por dónde empiezo, hay ruta?", locale: "es", knowledge: pack });
    expect(resultado?.tool).toBe("ruta_itinerario");
    expect(resultado?.items.length).toBeGreaterThan(0);
    for (const item of resultado?.items ?? []) {
      expect(["ciber-ofensiva", "ciber-defensiva", "ia-aplicada-segura", "gobernanza-compliance"]).toContain(item.course);
    }
  });
});
