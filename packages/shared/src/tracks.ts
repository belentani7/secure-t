/**
 * Itinerarios abiertos: la estructura de una universidad, sin puerta cerrada.
 *
 * Un itinerario es un camino **recomendado** por los cuatro programas, con los
 * prerrequisitos a la vista. Nadie tiene que recorrerlo para entrar: el campus
 * se puede usar programa a programa, semana a semana. Lo que sí hace el
 * itinerario es decir la verdad sobre el orden: «gobernanza» se disfruta mucho
 * más —y se aprueba mucho mejor— después de haber pasado por uno de los tres
 * programas técnicos, porque sus evidencias hablan de sistemas reales.
 *
 * El texto vive en los diccionarios (`track.<id>.name`, `track.<id>.desc`), no
 * aquí: este fichero es sólo estructura, y por eso se puede comprobar con tests
 * (que ningún curso se quede fuera, que no haya ciclos, que las horas sumen).
 */

import type { TranslationKey } from "./i18n";

export type TrackLevel = "introductorio" | "intermedio" | "avanzado";

export const TRACK_LEVELS: readonly TrackLevel[] = ["introductorio", "intermedio", "avanzado"] as const;

export interface TrackDef {
  /** Identificador estable: también es la clave de idioma `track.<id>.*`. */
  id: string;
  /** Cursos en el orden recomendado. */
  courses: readonly string[];
  /** Nivel del itinerario completo (no de cada programa). */
  level: TrackLevel;
  /** Competencias que se acreditan, en orden de aparición (claves `skill.*`). */
  skills: readonly TranslationKey[];
}

export const TRACKS: readonly TrackDef[] = [
  {
    id: "ruta-completa",
    courses: ["ciber-ofensiva", "ciber-defensiva", "ia-aplicada-segura", "gobernanza-compliance"],
    level: "intermedio",
    skills: ["skill.explotacion", "skill.hardening", "skill.ia-limites", "skill.riesgo"]
  },
  {
    id: "defensa-soc",
    courses: ["ciber-defensiva", "gobernanza-compliance"],
    level: "introductorio",
    skills: ["skill.telemetria", "skill.respuesta", "skill.control"]
  },
  {
    id: "ofensiva-profesional",
    courses: ["ciber-ofensiva", "gobernanza-compliance"],
    level: "avanzado",
    skills: ["skill.alcance", "skill.explotacion", "skill.informe"]
  },
  {
    id: "ia-responsable",
    courses: ["ia-aplicada-segura", "gobernanza-compliance"],
    level: "intermedio",
    skills: ["skill.ia-amenazas", "skill.ia-limites", "skill.control"]
  }
] as const;

/**
 * Prerrequisitos reales entre programas.
 *
 * Se declaran como **alternativas** (basta uno) porque la gobernanza se puede
 * estudiar desde la defensa, la ofensiva o la IA: lo que exige es haber tocado
 * un sistema de verdad, no uno concreto.
 */
export const PREREQUISITES: Readonly<Record<string, readonly string[]>> = {
  "gobernanza-compliance": ["ciber-ofensiva", "ciber-defensiva", "ia-aplicada-segura"]
};

export function prerequisitesOf(slug: string): readonly string[] {
  return PREREQUISITES[slug] ?? [];
}

/** Los prerrequisitos que aún faltan (vacío = se puede empezar ya). */
export function missingPrerequisites(slug: string, completed: readonly string[]): string[] {
  const alternativas = prerequisitesOf(slug);
  if (alternativas.length === 0) return [];
  if (alternativas.some((alternativa) => completed.includes(alternativa))) return [];
  return [...alternativas];
}

/** ¿Este paso está desbloqueado con lo ya completado? */
export function isStepUnlocked(track: TrackDef, index: number, completed: readonly string[]): boolean {
  const slug = track.courses[index];
  if (slug === undefined) return false;
  return missingPrerequisites(slug, completed).length === 0;
}

/** Horas del itinerario (de mayor a menor si hay datos). */
export function trackHours(track: TrackDef, hours: Readonly<Record<string, number>>): number {
  return track.courses.reduce((total, slug) => total + (hours[slug] ?? 0), 0);
}

/** Semanas del itinerario. */
export function trackWeeks(track: TrackDef, weeks: Readonly<Record<string, number>>): number {
  return track.courses.reduce((total, slug) => total + (weeks[slug] ?? 0), 0);
}

/** Itinerarios en los que aparece un programa (para enlazar desde su ficha). */
export function tracksWithCourse(slug: string): TrackDef[] {
  return TRACKS.filter((track) => track.courses.includes(slug));
}

const NIVELES: Readonly<Record<TrackLevel, TranslationKey>> = {
  introductorio: "tracks.level.introductorio",
  intermedio: "tracks.level.intermedio",
  avanzado: "tracks.level.avanzado"
};

export function trackLevelKey(level: TrackLevel): TranslationKey {
  return NIVELES[level];
}

export function trackNameKey(id: string): TranslationKey {
  return `track.${id}.name` as TranslationKey;
}

export function trackDescriptionKey(id: string): TranslationKey {
  return `track.${id}.desc` as TranslationKey;
}

/**
 * Comprobación de ciclos: devuelve `true` si el grafo de prerrequisitos se puede
 * recorrer. Se usa en los tests, pero vive aquí porque es una propiedad del
 * modelo, no del test.
 */
export function prerequisitesAreAcyclic(prerequisites: Readonly<Record<string, readonly string[]>> = PREREQUISITES): boolean {
  const visitando = new Set<string>();
  const visitados = new Set<string>();
  const visita = (nodo: string): boolean => {
    if (visitados.has(nodo)) return true;
    if (visitando.has(nodo)) return false;
    visitando.add(nodo);
    for (const siguiente of prerequisites[nodo] ?? []) {
      // Sólo cuentan las aristas entre cursos declarados: las alternativas
      // externas (p. ej. un curso que aún no está en el campus) no cierran ciclo.
      if (siguiente in prerequisites && !visita(siguiente)) return false;
    }
    visitando.delete(nodo);
    visitados.add(nodo);
    return true;
  };
  return Object.keys(prerequisites).every(visita);
}
