/**
 * Genera `docs/PLAN-QUINQUENAL.md` a partir de la malla de cinco años.
 *
 * El plan vive en el código (`packages/shared/src/curriculum-5y.ts`) y aquí sólo
 * se imprime: si alguien edita la malla y no regenera, `tests/plan-quinquenal.test.ts`
 * falla y el documento no puede quedarse contando otra cosa que el producto.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CAMPUS_WEEKS_PUBLISHED,
  CURRICULUM_5Y,
  TOTAL_WEEKS,
  TOTAL_YEARS,
  curriculumStats,
  phasesOfYear
} from "../packages/shared/src/curriculum-5y";
import { LIBRARY } from "../packages/shared/src/library";

const root = join(import.meta.dirname, "..");
const stats = curriculumStats();
const porId = new Map(LIBRARY.map((recurso) => [recurso.id, recurso]));

const lineas: string[] = [
  "# Plan quinquenal — secure T",
  "",
  "> Documento generado por `pnpm plan` desde `packages/shared/src/curriculum-5y.ts`.",
  "> No se edita a mano: la fuente única es el código y el test compara ambos.",
  "",
  "## Resumen",
  "",
  `- **Duración**: ${TOTAL_YEARS} años · ${TOTAL_WEEKS} semanas · ${CURRICULUM_5Y.length} franjas de 20 semanas (10 semestres).`,
  `- **Escrito y publicado hoy**: ${CAMPUS_WEEKS_PUBLISHED} semanas, las cuatro franjas de fundamentos (los cuatro programas del campus).`,
  `- **Pendiente de escribir**: ${TOTAL_WEEKS - CAMPUS_WEEKS_PUBLISHED} semanas, en seis franjas declaradas con su modo de estudio.`,
  stats.capstone ? "- **Proyecto final**: incluido en la franja de capstone (semestre 10)." : "",
  "",
  "Cada franja indica su **modo**: `programa` (curso publicado del campus), `laboratorio` (práctica dirigida en",
  "entorno propio) o `proyecto` (entrega con informe). Un plan que no distingue lo escrito de lo declarado no es un",
  "plan: es un folleto.",
  ""
];

for (const ano of [1, 2, 3, 4, 5]) {
  lineas.push(`## Año ${ano}`, "");
  for (const fase of phasesOfYear(ano)) {
    const estado = fase.published > 0 ? `**publicadas ${fase.published} de 20 semanas**` : "`PLANNED` (por escribir)";
    lineas.push(
      `### ${fase.id} — semanas ${fase.from}–${fase.to} (semestre ${fase.semester})`,
      "",
      `- **Estado**: ${estado}`,
      `- **Modo**: \`${fase.mode}\`${fase.course ? ` · curso \`${fase.course}\`` : ""}`,
      `- **Nivel**: ${fase.level}`,
      `- **Se alinea con**: ${fase.aligns.join(" · ")}`,
      fase.capstone ? "- **Capstone**: sí, cierre del quinquenio con defensa pública." : "",
      "- **Recursos que la sostienen**:",
      ...fase.sources.map((id) => {
        const recurso = porId.get(id);
        return recurso ? `  - [${recurso.name}](${recurso.url}) — ${recurso.org}` : `  - \`${id}\` (recurso no encontrado: revisar la biblioteca)`;
      }),
      ""
    );
  }
}

lineas.push(
  "---",
  "",
  "## Cómo se mantiene",
  "",
  "```bash",
  "pnpm plan        # regenera este documento desde la malla",
  "pnpm test        # falla si el documento y la malla divergen (tests/plan-quinquenal.test.ts)",
  "```"
);

const contenido = `${lineas.filter((linea) => linea !== "").join("\n").replace(/\n(##|###)/g, "\n\n$1")}\n`.replace(/\n{3,}/g, "\n\n");
writeFileSync(join(root, "docs/PLAN-QUINQUENAL.md"), contenido, "utf8");
console.log(`PLAN-QUINQUENAL.md → ${CURRICULUM_5Y.length} franjas · ${TOTAL_WEEKS} semanas · ${stats.publishedWeeks} publicadas`);
