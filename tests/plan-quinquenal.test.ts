/**
 * El documento del plan no puede contar otra cosa que el código.
 *
 * `docs/PLAN-QUINQUENAL.md` se genera con `pnpm plan` desde la malla de cinco
 * años. Este test recalcula lo que el documento debe decir y lo busca en el
 * fichero: si alguien amplía la malla y no regenera, la contradicción se ve aquí
 * y no en una reunión.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CURRICULUM_5Y, TOTAL_WEEKS, curriculumStats, phasesOfYear } from "../packages/shared/src/curriculum-5y";
import { LIBRARY } from "../packages/shared/src/library";

const root = join(__dirname, "..");
const plan = readFileSync(join(root, "docs/PLAN-QUINQUENAL.md"), "utf8");
const stats = curriculumStats();

describe("plan quinquenal publicado", () => {
  it("declara las diez franjas con sus semanas y su estado", () => {
    for (const fase of CURRICULUM_5Y) {
      expect(plan).toContain(`### ${fase.id} — semanas ${fase.from}–${fase.to} (semestre ${fase.semester})`);
      expect(plan).toContain(
        fase.published > 0 ? `**publicadas ${fase.published} de 20 semanas**` : "`PLANNED` (por escribir)"
      );
      expect(plan).toContain(`**Modo**: \`${fase.mode}\``);
    }
  });

  it("no presume de lo que falta", () => {
    const pendientes = CURRICULUM_5Y.filter((fase) => fase.published === 0);
    expect(pendientes.length).toBe(6);
    expect(plan.match(/`PLANNED` \(por escribir\)/g)).toHaveLength(pendientes.length);
    expect(plan).toContain(`**Pendiente de escribir**: ${TOTAL_WEEKS - stats.publishedWeeks} semanas`);
    expect(plan).toContain(`**Escrito y publicado hoy**: ${stats.publishedWeeks} semanas`);
  });

  it("cita sólo recursos que existen en la biblioteca", () => {
    const ids = new Set(LIBRARY.map((recurso) => recurso.id));
    for (const fase of CURRICULUM_5Y) {
      for (const id of fase.sources) {
        expect(ids.has(id), `${fase.id} cita un recurso inexistente: ${id}`).toBe(true);
        expect(plan).toContain(`(${LIBRARY.find((r) => r.id === id)?.url})`);
      }
    }
    expect(plan).not.toContain("recurso no encontrado");
  });

  it("cubre los cinco años y dice cómo se regenera", () => {
    for (const ano of [1, 2, 3, 4, 5]) {
      expect(plan).toContain(`## Año ${ano}`);
      expect(phasesOfYear(ano).length).toBe(2);
    }
    expect(plan).toContain("pnpm plan");
    expect(plan).toContain("tests/plan-quinquenal.test.ts");
  });
});
