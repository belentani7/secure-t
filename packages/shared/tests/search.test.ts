import { describe, expect, it } from "vitest";
import { buildIndex, excerptFor, highlight, normalize, search, tokenize, type SearchDoc } from "../src/index";

const docs: SearchDoc[] = [
  {
    id: "w1",
    title: "Semana 1: Descripción general de auditoría",
    text: "Introducción a los conceptos básicos de auditoría de seguridad y control interno.",
    course: "ciberseguridad",
    kind: "lesson",
    week: 1
  },
  {
    id: "w2",
    title: "Semana 2: Logs y SIEM en un SOC",
    text: "El SIEM recopila telemetría, correlaciona eventos y genera detecciones. Un SOC con SIEM puede detectar incidentes en minutos.",
    course: "ciberseguridad",
    kind: "lesson",
    week: 2
  },
  {
    id: "lab",
    title: "Laboratorio: análisis de incidentes con telemetría",
    text: "Analizar un incidente con fuentes de telemetría y responder con evidencia.",
    course: "ciberseguridad",
    kind: "lab"
  },
  {
    id: "other",
    title: "Gobernanza: ISO 27001 y gestión de riesgos",
    text: "Certificar el sistema de gestión de seguridad de la información con ISO 27001 requiere evidencia de controles.",
    course: "gobernanza",
    kind: "lesson"
  }
];

const index = buildIndex(docs);

describe("buscador BM25 del campus", () => {
  it("prioriza el documento que contiene el término consultado", () => {
    const hits = search(index, "SIEM SOC");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].doc.id).toBe("w2");
  });

  it("encuentra sin acentos y con acentos (normalización real)", () => {
    expect(search(index, "auditoria")[0].doc.id).toBe("w1");
    expect(search(index, "auditoría")[0].doc.id).toBe("w1");
    // «telemetría» aparece en el título del laboratorio (pesa doble) y en la semana 2.
    const hits = search(index, "TELEMETRÍA");
    expect(hits[0].doc.id).toBe("lab");
    expect(hits.map((hit) => hit.doc.id)).toContain("w2");
  });

  it("acota por curso y por tipo de material", () => {
    const scoped = search(index, "riesgos", { course: "gobernanza" });
    expect(scoped).toHaveLength(1);
    expect(scoped[0].doc.id).toBe("other");
    const labs = search(index, "incidente", { kinds: ["lab"] });
    expect(labs.every((hit) => hit.doc.kind === "lab")).toBe(true);
  });

  it("ignora palabras vacías y consultas sin contenido", () => {
    expect(search(index, "de la y el")).toEqual([]);
    expect(tokenize("de la SIEM y el SOC")).toEqual(["siem", "soc"]);
    expect(normalize("Telemetría")).toBe("telemetria");
  });

  it("devuelve fragmentos con contexto y resaltado seguro", () => {
    const hits = search(index, "telemetría");
    const excerpt = excerptFor(hits[0].doc, hits[0].matched);
    expect(excerpt.toLowerCase()).toContain("telemetr");
    const marked = highlight("El SIEM recopila telemetría", ["telemetria"]);
    expect(marked).toContain("<mark>telemetría</mark>");
    // Sin acento en la consulta, el resaltado conserva el acento del texto.
    expect(highlight("El SIEM recopila telemetría", ["telemetria"])).toContain("<mark>telemetría</mark>");
  });

  it("respeta el límite de resultados y admite umbral bajo", () => {
    expect(search(index, "evidencia", { limit: 1 })).toHaveLength(1);
    expect(search(index, "evidencia", { minScore: 0 })).toHaveLength(2);
  });

  it("no explota con consultas vacías ni de un solo carácter", () => {
    expect(search(index, "")).toEqual([]);
    expect(search(index, "a")).toEqual([]);
  });
});
