import { describe, expect, it } from "vitest";
import { realLearningRecord, searchCampusCatalog, type PortalProgram } from "../client/src/lib/portal-data";

const programs: PortalProgram[] = [{
  slug: "defensa", title: "Defensa cibernética",
  description: "Protege sistemas empresariales",
  weeks: [
    { number: 1, title: "Redes seguras", objective: "Identificar riesgos" },
    { number: 2, title: "Respuesta a incidentes", objective: "Análisis forense" },
  ],
  resources: [{ label: "Guía OWASP", url: "https://owasp.org/" }],
  links: { course: "campus/full/cursos/defensa/index.html" },
}];

describe("portal backed by real curriculum and local progress", () => {
  it("does not show results for an empty query", () => {
    expect(searchCampusCatalog(programs, " ")).toEqual([]);
  });
  it("searches accent-insensitively and links to published course assets", () => {
    const matches = searchCampusCatalog(programs, "cibernetica");
    expect(matches.some(match => match.kind === "program" && match.href === "/campus/full/cursos/defensa/index.html")).toBe(true);
  });
  it("searches week objectives, not only course titles", () => {
    const matches = searchCampusCatalog(programs, "analisis forense");
    expect(matches[0].kind).toBe("week");
    expect(matches[0].href).toContain("#semana-2");
  });
  it("only returns HTTPS references and honors result cap", () => {
    const data = [{ ...programs[0], resources: [
      { label: "Guía OWASP", url: "https://owasp.org/" },
      { label: "Inseguro", url: "javascript:alert(1)" },
    ] }];
    expect(searchCampusCatalog(data, "OWASP", 1)).toHaveLength(1);
    expect(searchCampusCatalog(data, "Inseguro")).toEqual([]);
    expect(searchCampusCatalog(data, "OWASP", 0)).toEqual([]);
  });
  it("never invents learning outcomes from an empty progress record", () => {
    const record = realLearningRecord(programs, {});
    expect(record[0]).toMatchObject({ done: 0, total: 6, completedWeeks: 0, complete: false });
  });
  it("counts only actual marked items and real weeks", () => {
    const record = realLearningRecord(programs, {
      "defensa/semana-01": true,
      "defensa/quiz": true,
      "otro/semana-01": true,
    });
    expect(record[0]).toMatchObject({ done: 2, total: 6, completedWeeks: 1, percent: 33 });
  });
});
