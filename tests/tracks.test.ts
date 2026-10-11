/**
 * Itinerarios abiertos: la estructura tiene que ser verdad.
 *
 * Estos tests son la garantía de que un itinerario no promete programas que el
 * campus no publica, no esconde ciclos en los prerrequisitos, no inventa horas y
 * se puede leer en los cuatro idiomas. Si algún día se añade un programa nuevo y
 * nadie lo coloca en un itinerario, aquí se avisa.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  LOCALES,
  TRACKS,
  TRACK_LEVELS,
  prerequisitesAreAcyclic,
  prerequisitesOf,
  missingPrerequisites,
  trackDescriptionKey,
  trackHours,
  trackLevelKey,
  trackNameKey,
  trackWeeks,
  translator
} from "../packages/shared/src";

const root = join(__dirname, "..");
const leer = (rel: string) => readFileSync(join(root, rel), "utf8");

interface Entrada {
  slug: string;
  hours: number;
  weeks: unknown[];
}
const catalogo = JSON.parse(leer("apps/web/public/content/catalog.json")) as { courses: Entrada[] };
const horas = Object.fromEntries(catalogo.courses.map((curso) => [curso.slug, curso.hours]));
const semanas = Object.fromEntries(catalogo.courses.map((curso) => [curso.slug, curso.weeks.length]));

describe("itinerarios abiertos", () => {
  it("ningún programa del campus se queda fuera de todos los itinerarios", () => {
    const fuera = catalogo.courses
      .map((curso) => curso.slug)
      .filter((slug) => !TRACKS.some((track) => track.courses.includes(slug)));
    expect(fuera).toEqual([]);
  });

  it("ningún itinerario inventa un programa que el campus no publica", () => {
    const publicados = new Set(catalogo.courses.map((curso) => curso.slug));
    const inventados = TRACKS.flatMap((track) => track.courses).filter((slug) => !publicados.has(slug));
    expect(inventados).toEqual([]);
  });

  it("los prerrequisitos no tienen ciclos y dentro de un itinerario van antes", () => {
    expect(prerequisitesAreAcyclic()).toBe(true);
    for (const track of TRACKS) {
      track.courses.forEach((slug, indice) => {
        for (const prerrequisito of prerequisitesOf(slug)) {
          const posicion = track.courses.indexOf(prerrequisito);
          if (posicion >= 0) expect(posicion).toBeLessThan(indice);
        }
      });
    }
  });

  it("la gobernanza se desbloquea con cualquiera de los tres programas técnicos", () => {
    expect(missingPrerequisites("gobernanza-compliance", [])).toHaveLength(3);
    expect(missingPrerequisites("gobernanza-compliance", ["ciber-defensiva"])).toEqual([]);
    expect(missingPrerequisites("gobernanza-compliance", ["ciber-ofensiva"])).toEqual([]);
    expect(missingPrerequisites("ciber-ofensiva", [])).toEqual([]);
  });

  it("las horas y las semanas salen del catálogo, no de la imaginación", () => {
    const esperadas: Record<string, number> = {
      "ruta-completa": catalogo.courses.reduce((total, curso) => total + curso.hours, 0),
      "defensa-soc": horas["ciber-defensiva"] + horas["gobernanza-compliance"],
      "ofensiva-profesional": horas["ciber-ofensiva"] + horas["gobernanza-compliance"],
      "ia-responsable": horas["ia-aplicada-segura"] + horas["gobernanza-compliance"]
    };
    for (const track of TRACKS) {
      expect(trackHours(track, horas)).toBe(esperadas[track.id]);
      expect(trackHours(track, horas)).toBeGreaterThan(0);
      expect(trackWeeks(track, semanas)).toBe(
        track.courses.reduce((total, slug) => total + (semanas[slug] ?? 0), 0)
      );
    }
  });

  it("todo se puede leer en los cuatro idiomas", () => {
    for (const locale of LOCALES) {
      const t = translator(locale);
      for (const track of TRACKS) {
        expect(t(trackNameKey(track.id))).not.toMatch(/^track\./);
        expect(t(trackDescriptionKey(track.id))).not.toMatch(/^track\./);
        for (const skill of track.skills) expect(t(skill)).not.toMatch(/^skill\./);
      }
      for (const nivel of TRACK_LEVELS) expect(t(trackLevelKey(nivel))).not.toMatch(/^tracks\./);
    }
  });

  it("la ruta existe (portada portuguesa y por idioma) y está en la navegación", () => {
    expect(existsSync(join(root, "apps/web/src/app/(landing)/itinerarios/page.tsx"))).toBe(true);
    expect(existsSync(join(root, "apps/web/src/app/[locale]/itinerarios/page.tsx"))).toBe(true);
    const site = leer("apps/web/src/lib/site.ts");
    expect(site).toContain('path: "/itinerarios"');
  });

  it("el contenido docente se marca con su idioma real (WCAG 3.1.2)", () => {
    const vista = leer("apps/web/src/components/tracks-view.tsx");
    expect(vista).toContain("TeachingText");
    const etiqueta = leer("apps/web/src/components/teaching-text.tsx");
    expect(etiqueta).toContain('lang="es"');
    // La etiqueta sólo aparece donde el contenido no está en el idioma pedido.
    expect(etiqueta).toContain('locale === "es"');
  });
});
