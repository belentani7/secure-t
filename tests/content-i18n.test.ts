/**
 * Traducciones del material docente: ni una palabra de más.
 *
 * La regla de honestidad del proyecto también vale para los idiomas: no se dice
 * «traducido» si no lo está. Aquí se comprueba (1) que cada fichero traducido es
 * válido y corresponde a una semana real del programa, (2) que la cobertura que
 * calcula la web es exactamente la que hay en el disco y (3) que los números que
 * publica el README son esos mismos: si alguien traduce más, el README tiene que
 * enterarse, y si alguien promete de más, el test falla.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TRANSLATION_LANGS, localeCoverage, readWeek } from "../apps/web/src/lib/content";

const root = join(__dirname, "..");
const cursosDir = join(root, "campus", "cursos");
const leer = (rel: string) => readFileSync(join(root, rel), "utf8");

function cursos(): string[] {
  return readdirSync(cursosDir).filter((nombre) => statSync(join(cursosDir, nombre)).isDirectory());
}

describe("traducciones del material", () => {
  it("cada semana traducida existe, se numera bien y tiene encabezado propio", () => {
    const problemas: string[] = [];
    for (const slug of cursos()) {
      for (const lang of TRANSLATION_LANGS) {
        const dir = join(cursosDir, slug, "i18n", lang);
        if (!existsSync(dir)) continue;
        for (const nombre of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
          const numero = Number(/^semana-(\d{2})\.md$/.exec(nombre)?.[1]);
          if (!numero) {
            problemas.push(`${slug}/i18n/${lang}/${nombre}: nombre inesperado`);
            continue;
          }
          if (!existsSync(join(cursosDir, slug, `semana-${String(numero).padStart(2, "0")}.md`))) {
            problemas.push(`${slug}/i18n/${lang}/${nombre}: el original no existe`);
          }
          const markdown = readFileSync(join(dir, nombre), "utf8");
          if (!new RegExp(`^#\\s+Semana\\s+${numero}\\b`, "m").test(markdown)) {
            problemas.push(`${slug}/i18n/${lang}/${nombre}: falta el encabezado «# Semana ${numero}»`);
          }
          if (markdown.split(/\s+/).filter(Boolean).length < 200) {
            problemas.push(`${slug}/i18n/${lang}/${nombre}: parece un fragmento, no una semana`);
          }
        }
      }
    }
    expect(problemas).toEqual([]);
  });

  it("cada curso.json traducido dice título y resumen", () => {
    const problemas: string[] = [];
    for (const slug of cursos()) {
      for (const lang of TRANSLATION_LANGS) {
        const file = join(cursosDir, slug, "i18n", lang, "curso.json");
        if (!existsSync(file)) continue;
        const datos = JSON.parse(readFileSync(file, "utf8")) as { title?: string; summary?: string };
        if (!datos.title?.trim()) problemas.push(`${slug}/i18n/${lang}/curso.json: sin título`);
        if (!datos.summary?.trim()) problemas.push(`${slug}/i18n/${lang}/curso.json: sin resumen`);
      }
    }
    expect(problemas).toEqual([]);
  });

  it("la cobertura que calcula la web es la que hay en el disco", () => {
    const cobertura = new Map(localeCoverage().map((entrada) => [entrada.lang, entrada]));
    for (const lang of TRANSLATION_LANGS) {
      const esperadas = cursos().reduce((total, slug) => {
        const dir = join(cursosDir, slug, "i18n", lang);
        if (!existsSync(dir)) return total;
        return total + readdirSync(dir).filter((f) => /^semana-\d{2}\.md$/.test(f)).length;
      }, 0);
      expect(cobertura.get(lang)?.weeks).toBe(esperadas);
    }
  });

  it("una semana con traducción se sirve traducida, y una sin ella lo confiesa", () => {
    const traducida = readWeek("ciber-ofensiva", 1, "pt");
    expect(traducida?.translated).toBe(true);
    expect(traducida?.sourceLocale).toBe("pt");
    expect(traducida?.translationSource).toBe("campus/cursos/ciber-ofensiva/i18n/pt/semana-01.md");
    // El título viene traducido de verdad, no del original en español.
    expect(traducida?.title).toContain("escopo");
    expect(traducida?.title).not.toContain("alcance");

    const pendiente = readWeek("ciber-ofensiva", 20, "pt");
    expect(pendiente?.translated).toBe(false);
    expect(pendiente?.sourceLocale).toBe("es");

    // En español no hay traducción que buscar: el original es el original.
    const original = readWeek("ciber-ofensiva", 1, "es");
    expect(original?.translated).toBe(false);
    expect(original?.sourceLocale).toBe("es");
  });

  it("el README no presume de más", () => {
    const readme = leer("README.md");
    const filas: Record<string, { programas: number; semanas: number; palabras: number }> = {};
    for (const lang of TRANSLATION_LANGS) {
      const fila = new RegExp(`\\|\\s*${lang}\\s*\\|\\s*(\\d+)/(\\d+)\\s*\\|\\s*(\\d+)/(\\d+)\\s*\\|\\s*(\\d+)\\s*\\|`).exec(readme);
      expect(fila, `falta la fila de cobertura de «${lang}» en README.md`).not.toBeNull();
      if (!fila) continue;
      filas[lang] = { programas: Number(fila[1]), semanas: Number(fila[3]), palabras: Number(fila[5]) };
    }
    const cobertura = new Map(localeCoverage().map((entrada) => [entrada.lang, entrada]));
    const totalProgramas = cursos().length;
    const totalSemanas = cursos().reduce((total, slug) => total + readdirSync(join(cursosDir, slug)).filter((f) => /^semana-\d{2}\.md$/.test(f)).length, 0);
    for (const lang of TRANSLATION_LANGS) {
      const real = cobertura.get(lang);
      expect(filas[lang].programas, `programas de ${lang}`).toBe(real?.courses);
      expect(filas[lang].semanas, `semanas de ${lang}`).toBe(real?.weeks);
      expect(filas[lang].palabras, `palabras de ${lang}`).toBe(real?.words);
      expect(totalProgramas).toBeGreaterThan(0);
      expect(totalSemanas).toBeGreaterThan(0);
    }
  });
});
