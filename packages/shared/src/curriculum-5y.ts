/**
 * El plan quinquenal: cinco años, diez semestres, doscientas semanas.
 *
 * El campus publica hoy cuatro programas de veinte semanas (ochenta en total) y
 * este plan dice, sin adornos, **cómo se completan los cinco años**: qué se
 * estudia en cada franja, con qué material abierto y qué queda por escribir. Es
 * la diferencia entre «tenemos un plan de futuro» y «esta semana toca esto».
 *
 * Regla que vigila el test: las doscientas semanas están cubiertas sin huecos ni
 * solapes, los cursos citados existen de verdad en el campus y las semanas del
 * campus no se prometen dos veces.
 */

import type { TranslationKey } from "./i18n";

export type PlanMode = "programa" | "laboratorio" | "proyecto";

export const PLAN_MODES: readonly PlanMode[] = ["programa", "laboratorio", "proyecto"] as const;

export interface PlanPhase {
  /** Identificador estable: también es la clave `plan.phase.<id>.title`. */
  id: string;
  year: number;
  semester: number;
  from: number;
  to: number;
  mode: PlanMode;
  /** Programa del campus que se cursa, si la franja es un programa completo. */
  course: string | null;
  /** Semanas del campus que se publican hoy y cubren esta franja (0 si no hay). */
  published: number;
  /** Certificaciones con las que se alinea la franja: preparación, no acreditación. */
  aligns: readonly string[];
  /** Recursos de la biblioteca que sostienen la franja. */
  sources: readonly string[];
  capstone?: boolean;
}

export const TOTAL_YEARS = 5;
export const TOTAL_WEEKS = 200;

export const CURRICULUM_5Y: readonly PlanPhase[] = [
  {
    id: "fundamentos-defensa",
    year: 1,
    semester: 1,
    from: 1,
    to: 20,
    mode: "programa",
    course: "ciber-defensiva",
    published: 20,
    aligns: ["CompTIA Security+", "ISC2 CC"],
    sources: ["professor-messer", "tryhackme", "overthewire", "wazuh"]
  },
  {
    id: "fundamentos-ia",
    year: 1,
    semester: 2,
    from: 21,
    to: 40,
    mode: "programa",
    course: "ia-aplicada-segura",
    published: 20,
    aligns: ["Microsoft AI-900 (concepts)", "Google Cloud Digital Leader"],
    sources: ["cs50", "curso-em-video", "owasp-llm-top10"]
  },
  {
    id: "profundizacion-ofensiva",
    year: 2,
    semester: 3,
    from: 41,
    to: 60,
    mode: "programa",
    course: "ciber-ofensiva",
    published: 20,
    aligns: ["INE eJPT", "CompTIA PenTest+"],
    sources: ["portswigger-academy", "owasp-juice-shop", "ippsec", "s4vitar"]
  },
  {
    id: "profundizacion-gobernanza",
    year: 2,
    semester: 4,
    from: 61,
    to: 80,
    mode: "programa",
    course: "gobernanza-compliance",
    published: 20,
    aligns: ["ISO 27001 Lead Implementer (preparación)", "ISACA CISM (preparación)"],
    sources: ["nist-csf", "iso-27001", "rgpd", "lgpd"]
  },
  {
    id: "especialidad-defensa",
    year: 3,
    semester: 5,
    from: 81,
    to: 100,
    mode: "laboratorio",
    course: null,
    published: 0,
    aligns: ["CompTIA CySA+ (preparación)", "GCIA (preparación)"],
    sources: ["detectionlab", "atomic-red-team", "sigma", "13cubed", "hackavis"]
  },
  {
    id: "especialidad-ofensiva",
    year: 3,
    semester: 6,
    from: 101,
    to: 120,
    mode: "laboratorio",
    course: null,
    published: 0,
    aligns: ["OffSec OSCP (preparación)", "PNPT"],
    sources: ["hack-the-box", "vulnhub", "liveoverflow", "sans-offensive", "hackaflag"]
  },
  {
    id: "arquitectura-nube",
    year: 4,
    semester: 7,
    from: 121,
    to: 140,
    mode: "proyecto",
    course: null,
    published: 0,
    aligns: ["AWS Security Specialty (preparación)", "CCSK (preparación)"],
    sources: ["owasp-cheatsheets", "nist-csf", "typescript-handbook"]
  },
  {
    id: "direccion-ciso",
    year: 4,
    semester: 8,
    from: 141,
    to: 160,
    mode: "proyecto",
    course: null,
    published: 0,
    aligns: ["ISACA CISM", "ISC2 CISSP (preparación)"],
    sources: ["nist-ai-rmf", "simply-cyber", "cis-benchmarks"]
  },
  {
    id: "capstone",
    year: 5,
    semester: 9,
    from: 161,
    to: 180,
    mode: "proyecto",
    course: null,
    published: 0,
    aligns: ["Portafolio propio", "Informe de auditoría firmado"],
    sources: ["atomic-red-team", "defcon", "rootedcon"],
    capstone: true
  },
  {
    id: "docencia-comunidad",
    year: 5,
    semester: 10,
    from: 181,
    to: 200,
    mode: "proyecto",
    course: null,
    published: 0,
    aligns: ["Contribución abierta verificable"],
    sources: ["mente-binaria", "hackaflag", "ctftime", "exercism"]
  }
] as const;

/** Total de semanas del campus publicadas hoy (cuatro programas × veinte). */
export const CAMPUS_WEEKS_PUBLISHED = CURRICULUM_5Y.reduce((total, fase) => total + fase.published, 0);

/** La franja del plan a la que pertenece una semana del quinquenio (1..200). */
export function phaseAt(week: number): PlanPhase | undefined {
  return CURRICULUM_5Y.find((fase) => week >= fase.from && week <= fase.to);
}

export function phasesOfYear(year: number): PlanPhase[] {
  return CURRICULUM_5Y.filter((fase) => fase.year === year);
}

export interface CurriculumStats {
  years: number;
  semesters: number;
  weeks: number;
  publishedWeeks: number;
  phases: number;
  capstone: boolean;
  labs: number;
  programs: number;
}

export function curriculumStats(): CurriculumStats {
  const cursos = new Set(CURRICULUM_5Y.map((fase) => fase.course).filter((c): c is string => Boolean(c)));
  return {
    years: TOTAL_YEARS,
    semesters: TOTAL_YEARS * 2,
    weeks: TOTAL_WEEKS,
    publishedWeeks: CAMPUS_WEEKS_PUBLISHED,
    phases: CURRICULUM_5Y.length,
    capstone: CURRICULUM_5Y.some((fase) => Boolean(fase.capstone)),
    labs: CURRICULUM_5Y.filter((fase) => fase.mode === "laboratorio").length,
    programs: cursos.size
  };
}

/**
 * Comprueba la coherencia del plan: es el contrato que exige el test y evita que
 * el plan se degrade a mano (una franja movida deja huecos que nadie ve).
 */
export function validateCurriculum(): string[] {
  const problemas: string[] = [];
  const ordenadas = [...CURRICULUM_5Y].sort((a, b) => a.from - b.from);
  let esperada = 1;
  for (const fase of ordenadas) {
    if (fase.from !== esperada) {
      problemas.push(`hueco o solape: ${fase.id} empieza en ${fase.from} y se esperaba ${esperada}`);
    }
    if (fase.to < fase.from) problemas.push(`franja invertida: ${fase.id}`);
    esperada = fase.to + 1;
    if (fase.published > fase.to - fase.from + 1) {
      problemas.push(`semanas publicadas de más: ${fase.id}`);
    }
    if (fase.mode === "programa" && !fase.course) {
      problemas.push(`franja de programa sin curso: ${fase.id}`);
    }
    if (fase.mode !== "programa" && fase.course) {
      problemas.push(`franja sin programa con curso asignado: ${fase.id}`);
    }
    if (fase.published > 0 && !fase.course) {
      problemas.push(`semanas publicadas sin curso: ${fase.id}`);
    }
  }
  if (esperada !== TOTAL_WEEKS + 1) {
    problemas.push(`el plan cubre ${esperada - 1} semanas y declara ${TOTAL_WEEKS}`);
  }
  const ids = CURRICULUM_5Y.map((fase) => fase.id);
  if (new Set(ids).size !== ids.length) problemas.push("identificadores de franja duplicados");
  return problemas;
}

/** Claves de idioma del plan quinquenal (una por franja, más los modos y los años). */
export const PLAN_UI_KEYS: readonly TranslationKey[] = [
  "plan.title",
  "plan.lead",
  "plan.source",
  "plan.honesty",
  "plan.week",
  "plan.weeks",
  "plan.total",
  "plan.published",
  "plan.pending",
  "plan.aligns",
  "plan.sources",
  "plan.year",
  "plan.semester",
  "plan.mode.programa",
  "plan.mode.laboratorio",
  "plan.mode.proyecto",
  "plan.capstone",
  "plan.goCampus",
  "plan.goLibrary",
  "plan.legend"
] as const;
