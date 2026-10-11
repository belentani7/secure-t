/**
 * Genera `docs/REQUISITOS.md` desde `packages/shared/src/requirements.ts`.
 *
 * El documento es una vista, no la fuente: si alguien cambia un estado y no
 * regenera, `tests/requirements.test.ts` detecta la contradicción. Se imprime
 * también lo que NO está en verde, con su motivo, porque una tabla de requisitos
 * que sólo enseña lo que va bien no es una tabla de requisitos.
 *
 *   pnpm requirements
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  DOMAINS,
  LEVEL_MEANING,
  LEVELS,
  REQUIREMENTS,
  STATUSES,
  STATUSES_NEEDING_NOTE,
  STATUS_MEANING,
  TARGETS,
  mustGaps,
  requirementStats,
  type DomainId,
  type Evidence
} from "../packages/shared/src/requirements";

const root = join(import.meta.dirname, "..");
const stats = requirementStats();

/** Cómo se cita una evidencia en el documento. */
function evidencia(evidence: Evidence): string {
  switch (evidence.kind) {
    case "test":
      return `\`${evidence.ref}\``;
    case "file":
      return `\`${evidence.ref}\``;
    case "script":
      return `\`pnpm ${evidence.ref}\``;
    case "workflow":
      return `workflow \`${evidence.ref}\` (marca: «${evidence.marker}»)`;
    case "ci":
      return `CI ${evidence.ref}`;
  }
}

const lineas: string[] = [
  "# Requisitos de plataforma — secure T",
  "",
  "> Documento **generado** por `pnpm requirements` desde `packages/shared/src/requirements.ts`.",
  "> No se edita a mano: el código es la fuente y `tests/requirements.test.ts` falla si este documento se separa de él.",
  "",
  "Este es el contrato que la plataforma firma consigo misma. Cada requisito lleva identificador, nivel, norma de",
  "origen, **evidencia ejecutable** y estado. Las reglas son duras y se aplican por test:",
  "",
  "1. Toda evidencia citada **existe** (fichero, script declarado o marca dentro del workflow).",
  "2. `VERIFIED` exige evidencia ejecutable (una prueba o un script, no un documento).",
  "3. `CI` exige evidencia de la integración continua.",
  "4. Todo lo que no está en verde **obliga a escribir el motivo**.",
  "",
  "## El listón",
  "",
  "| Área | Objetivo | Aspiración declarada |",
  "|---|---|---|",
  `| Accesibilidad | ${TARGETS.wcag.required} | ${TARGETS.wcag.stretch} |`,
  `| Seguridad de aplicación | OWASP ASVS 5.0 nivel ${TARGETS.asvs.target} | nivel ${TARGETS.asvs.stretch} donde aplique |`,
  `| Lighthouse | rendimiento ≥ ${TARGETS.lighthouse.performance} · accesibilidad ${TARGETS.lighthouse.accessibility} · buenas prácticas ≥ ${TARGETS.lighthouse.bestPractices} · SEO ${TARGETS.lighthouse.seo} | — |`,
  `| Core Web Vitals (p75) | LCP ≤ ${TARGETS.cwv.lcpMs} ms · INP ≤ ${TARGETS.cwv.inpMs} ms · CLS ≤ ${TARGETS.cwv.cls} | — |`,
  `| Cobertura de lo crítico | ≥ ${TARGETS.coverage} % | — |`,
  `| JavaScript por página (comprimido) | ≤ ${TARGETS.jsBudgetKb.target} kB | límite duro ${TARGETS.jsBudgetKb.hard} kB |`,
  `| Pruebas automatizadas | ≥ ${TARGETS.testsFloor} | — |`,
  `| Datos personales almacenados | ${TARGETS.pii} | no hay objetivo distinto de cero |`,
  `| Vulnerabilidades críticas abiertas | ${TARGETS.criticalVulnerabilities} | — |`,
  "",
  "## Resumen",
  "",
  `- **Total**: ${stats.total} requisitos en ${Object.keys(DOMAINS).length} dominios — ${stats.byLevel.MUST} MUST, ${stats.byLevel.SHOULD} SHOULD, ${stats.byLevel.MAY} MAY`,
  `- **En verde**: ${stats.byStatus.VERIFIED + stats.byStatus.CI} de ${stats.total} (${stats.greenShare.toString().replace(".", ",")} %) — comprobados aquí o por la CI`,
  `- **Obligatorios sin cerrar**: ${mustGaps().length}`,
  "",
  "### Por estado",
  "",
  "| Estado | Cuántos | Qué significa |",
  "|---|---|---|",
  ...STATUSES.map((status) => `| ${status} | ${stats.byStatus[status]} | ${STATUS_MEANING[status]} |`),
  "",
  "### Por dominio",
  "",
  "| Dominio | Requisitos | En verde |",
  "|---|---|---|",
  ...(Object.keys(DOMAINS) as DomainId[]).map((domain) => {
    const delDominio = REQUIREMENTS.filter((r) => r.domain === domain);
    const verde = delDominio.filter((r) => r.status === "VERIFIED" || r.status === "CI").length;
    return `| ${DOMAINS[domain]} | ${stats.byDomain[domain]} | ${verde} de ${delDominio.length} |`;
  }),
  ""
];

/* ------------------------------------------------------- requisitos por dominio */

for (const domain of Object.keys(DOMAINS) as DomainId[]) {
  const delDominio = REQUIREMENTS.filter((r) => r.domain === domain);
  if (!delDominio.length) continue;
  lineas.push(`### ${DOMAINS[domain]}`, "");
  lineas.push("| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |", "|---|---|---|---|---|---|");
  for (const r of delDominio) {
    lineas.push(
      `| \`${r.id}\` | ${r.level} | **${r.title}**. ${r.statement} | ${r.source} | ${r.evidence.map(evidencia).join(" · ")} | ${r.status} |`
    );
  }
  lineas.push("");
  for (const r of delDominio) {
    if (STATUSES_NEEDING_NOTE.includes(r.status)) lineas.push(`- \`${r.id}\` (${r.status}) — ${r.note ?? "SIN MOTIVO ESCRITO"}`);
  }
  lineas.push("");
}

/* ------------------------------------------------------------------ lo que falta */

lineas.push("## Lo que no está en verde", "");
lineas.push(
  `De ${stats.total} requisitos, ${stats.gaps.length} no están cerrados. Se listan aquí en lugar de dejarlos`,
  "escondidos en la tabla: son el trabajo que queda y la parte incómoda de este documento.",
  ""
);
for (const r of stats.gaps) {
  lineas.push(`- **${r.id} — ${r.title}** (\`${r.status}\`) — ${r.note ?? "SIN MOTIVO ESCRITO"}`);
}
lineas.push("");

lineas.push("### Obligatorios sin cerrar (lo que de verdad bloquea)", "");
const bloqueos = mustGaps();
if (!bloqueos.length) {
  lineas.push("Ninguno: todos los requisitos `MUST` están en verde.", "");
} else {
  for (const r of bloqueos) lineas.push(`- **${r.id}** (${r.status}) — ${r.title}: ${r.note ?? "SIN MOTIVO ESCRITO"}`);
  lineas.push("");
}

/* ------------------------------------------------------------------- verificación */

lineas.push(
  "## Cómo se verifica",
  "",
  "```bash",
  "pnpm requirements        # regenera este documento desde el código",
  "pnpm test                # incluye tests/requirements.test.ts (evidencia + deriva de este documento)",
  "python -m pytest -q tests/",
  "pnpm audit:site          # accesibilidad estática y peso del export",
  "pnpm e2e                 # axe · WCAG 2.2 AA en navegador (en CI)",
  "```",
  "",
  "Niveles según RFC 2119 y RFC 8174:",
  "",
  ...LEVELS.map((level) => `- **${level}** — ${LEVEL_MEANING[level]}`),
  "",
  `_Última generación: el documento cambia sólo cuando cambia el código. Fichero fuente: \`${join("packages", "shared", "src", "requirements.ts")}\`._`,
  ""
);

writeFileSync(join(root, "docs/REQUISITOS.md"), lineas.join("\n"), "utf8");

export const resumen = {
  total: stats.total,
  verde: stats.byStatus.VERIFIED + stats.byStatus.CI,
  gaps: stats.gaps.length,
  mustGaps: mustGaps().length
};

console.log(
  `✔ docs/REQUISITOS.md — ${stats.total} requisitos, ${resumen.verde} en verde (${stats.greenShare} %), ${resumen.gaps} sin cerrar, ${resumen.mustGaps} de ellos obligatorios`
);
