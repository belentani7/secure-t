/**
 * Cobertura real de traducciones del material docente.
 *
 * Se lee del disco, no de una tabla escrita a mano: lo que imprime este informe
 * es exactamente lo que hay en `campus/cursos/<slug>/i18n/<lang>/`. El README y
 * los tests usan las mismas cifras, así que ninguna promesa puede ir por delante
 * de la realidad.
 *
 *   pnpm locales            # tabla legible
 *   pnpm locales --json     # las mismas cifras en JSON (para el informe)
 */

import { localeCoverage, TRANSLATION_LANGS } from "../apps/web/src/lib/content";

const cobertura = localeCoverage();
const comoJson = process.argv.includes("--json");

if (comoJson) {
  console.log(JSON.stringify(cobertura, null, 2));
} else {
  console.log("Cobertura del material docente (leída de campus/cursos/*/i18n/)\n");
  console.log("idioma  programas  semanas  palabras");
  for (const entrada of cobertura) {
    const programas = `${entrada.courses}/${entrada.detail.length}`;
    console.log(
      `${entrada.lang.padEnd(6)}  ${programas.padEnd(9)}  ${String(entrada.weeks).padStart(5)}    ${String(entrada.words).padStart(6)}`
    );
  }
  console.log(`\nIdiomas vigilados: ${TRANSLATION_LANGS.join(", ")} · el español es el original.`);
}
