/**
 * Herramientas del tutor: lo que el agente **hace** además de responder.
 *
 * Un asistente que sólo redacta es un buscador con buenos modales. Aquí vive la
 * capa de herramientas que el agente ejecuta sobre datos que ya están en el
 * dispositivo: recomendar material de la biblioteca, resumir una semana, listar
 * los programas, explicar una ruta por sus prerrequisitos o proponer un plan de
 * estudio. Todas son **deterministas** (misma pregunta + mismo corpus = mismo
 * resultado), se ejecutan sin red y sin claves, y devuelven datos estructurados
 * que la interfaz pinta: nunca texto inventado.
 *
 * Lo que estas herramientas **no** hacen, por diseño y con test: ejecutar
 * comandos, escribir ficheros, enviar datos a terceros o tomar decisiones con
 * efecto. Cuando algo tiene efecto (abrir una semana, exportar una credencial,
 * arrancar un laboratorio), la herramienta sólo *propone* y pide confirmación
 * humana: es la regla LLM08 del OWASP Top 10 para LLM, y el campus la cumple en
 * su propio agente.
 */

import { CURRICULUM_5Y, TOTAL_WEEKS, type PlanPhase } from "./curriculum-5y";
import type { Locale } from "./i18n";
import type { KnowledgePack } from "./knowledge";
import { LIBRARY, libraryForCourse, type LibraryResource } from "./library";
import { knowledgeToSearchDocs } from "./knowledge";
import { buildIndex, search } from "./search";
import { TRACKS, trackLevelKey, type TrackDef } from "./tracks";

export type ToolId =
  | "listar_programas"
  | "resumen_semana"
  | "recomendar_biblioteca"
  | "ruta_itinerario"
  | "plan_estudio";

export const TOOL_IDS: readonly ToolId[] = [
  "listar_programas",
  "resumen_semana",
  "recomendar_biblioteca",
  "ruta_itinerario",
  "plan_estudio"
] as const;

/** Toda herramienta es de sólo lectura sobre lo que ya está en el navegador. */
export interface ToolDefinition {
  id: ToolId;
  /** Palabras que activan la herramienta (en los cuatro idiomas del campus). */
  triggers: readonly string[];
  /** Efecto declarado: `lectura` no cambia nada; `propuesta` pide confirmación. */
  effect: "lectura" | "propuesta";
}

export const TUTOR_TOOLS: readonly ToolDefinition[] = [
  {
    id: "listar_programas",
    triggers: ["programa", "programas", "programa", "cursos", "cursos", "qué curso", "que curso", "cual curso"],
    effect: "lectura"
  },
  {
    id: "resumen_semana",
    triggers: ["semana", "semana", "week", "setmana", "clase"],
    effect: "lectura"
  },
  {
    id: "recomendar_biblioteca",
    triggers: [
      "recurso",
      "recursos",
      "canal",
      "youtube",
      "biblioteca",
      "dónde aprender",
      "onde aprender",
      "where can i learn",
      "llibre",
      "libro",
      "recomienda",
      "recomenda"
    ],
    effect: "lectura"
  },
  {
    id: "ruta_itinerario",
    triggers: ["itinerario", "itinerário", "ruta", "rota", "prerequisito", "pré-requisito", "por dónde empiezo", "por onde começo"],
    effect: "lectura"
  },
  {
    id: "plan_estudio",
    triggers: ["plan", "cronograma", "calendario", "calendário", "ritmo", "cinco años", "cinco anos", "5 anos", "5 años", "quinquenal"],
    effect: "lectura"
  }
] as const;

export interface ToolItem {
  label: string;
  detail?: string;
  url?: string;
  /** Semana y programa, cuando el elemento apunta a material del campus. */
  course?: string;
  week?: number;
}

export interface ToolResult {
  tool: ToolId;
  effect: "lectura" | "propuesta";
  /** Frase corta que explica qué hizo la herramienta (sin adornos). */
  summary: string;
  items: ToolItem[];
}

export interface TutorToolInput {
  question: string;
  locale: Locale;
  knowledge: KnowledgePack;
  /** Programa sobre el que se está preguntando, si la interfaz lo sabe. */
  course?: string;
  /** Tope de elementos por herramienta (la interfaz no pinta listas infinitas). */
  limit?: number;
}

const SIN_ACENTOS = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** ¿Qué herramienta pide la pregunta? Determinista y auditable. */
export function detectTools(question: string): ToolId[] {
  const texto = SIN_ACENTOS(question);
  const elegidas: ToolId[] = [];
  for (const tool of TUTOR_TOOLS) {
    if (tool.triggers.some((disparador) => texto.includes(SIN_ACENTOS(disparador)))) {
      elegidas.push(tool.id);
    }
  }
  return elegidas;
}

/** Semana mencionada explícitamente en la pregunta («semana 7», «week 12»). */
export function weekMentioned(question: string): number | undefined {
  const match = /(?:semana|week|setmana)\s*(\d{1,3})/i.exec(SIN_ACENTOS(question));
  if (!match) return undefined;
  const numero = Number(match[1]);
  return numero >= 1 && numero <= TOTAL_WEEKS ? numero : undefined;
}

function programasDisponibles(knowledge: KnowledgePack): { slug: string; title: string }[] {
  const mapa = new Map<string, string>();
  for (const chunk of knowledge.chunks) {
    if (!mapa.has(chunk.course)) mapa.set(chunk.course, chunk.courseTitle);
  }
  return [...mapa.entries()].map(([slug, title]) => ({ slug, title }));
}

function ejecutarListarProgramas(input: TutorToolInput, limit: number): ToolResult {
  const programas = programasDisponibles(input.knowledge);
  const items: ToolItem[] = programas.map((programa) => {
    const semanas = input.knowledge.chunks.filter((c) => c.course === programa.slug && typeof c.week === "number");
    const total = new Set(semanas.map((c) => c.week)).size;
    const recursos = libraryForCourse(programa.slug).length;
    return {
      label: programa.title,
      detail: `${programa.slug} · ${total} semanas · ${recursos} recursos abiertos`,
      url: `/${input.locale}/programas/${programa.slug}`,
      course: programa.slug
    };
  });
  return {
    tool: "listar_programas",
    effect: "lectura",
    summary: `${programas.length} programas disponibles en el campus`,
    items: items.slice(0, limit)
  };
}

function ejecutarResumenSemana(input: TutorToolInput, limit: number): ToolResult {
  const numero = weekMentioned(input.question);
  const curso = input.course;
  const candidatos = input.knowledge.chunks.filter(
    (chunk) => typeof chunk.week === "number" && (numero ? chunk.week === numero : true) && (curso ? chunk.course === curso : true)
  );
  if (!candidatos.length) {
    return {
      tool: "resumen_semana",
      effect: "lectura",
      summary: numero
        ? `no hay material de la semana ${numero} en el corpus cargado`
        : "dime el número de semana y el programa",
      items: []
    };
  }
  const porSemana = new Map<string, ToolItem>();
  for (const chunk of candidatos) {
    const clave = `${chunk.course}#${chunk.week}`;
    if (porSemana.has(clave)) continue;
    const titulo = chunk.title.split("·").pop()?.trim() ?? chunk.title;
    porSemana.set(clave, {
      label: `${chunk.courseTitle} · semana ${chunk.week}: ${titulo}`,
      detail: chunk.text.slice(0, 220),
      url: chunk.url,
      course: chunk.course,
      week: chunk.week
    });
  }
  const items = [...porSemana.values()];
  return {
    tool: "resumen_semana",
    effect: "lectura",
    summary: numero ? `material de la semana ${numero}` : `semanas disponibles (${items.length})`,
    items: items.slice(0, limit)
  };
}

function recursoAToolItem(recurso: LibraryResource): ToolItem {
  const etiquetaIdioma: Record<LibraryResource["lang"], string> = {
    pt: "PT-BR",
    es: "ES",
    en: "EN",
    ca: "CA",
    multi: "multi"
  };
  return {
    label: recurso.name,
    detail: `${recurso.org} · ${etiquetaIdioma[recurso.lang]} · ${recurso.cost === "abierto" ? "abierto" : "requiere registro"} · ${recurso.note}`,
    url: recurso.url
  };
}

function ejecutarRecomendarBiblioteca(input: TutorToolInput, limit: number): ToolResult {
  const terminos = input.question
    .toLowerCase()
    .split(/[^\p{L}\p{N}-]+/u)
    .filter((palabra) => palabra.length > 3);
  const puntuados = LIBRARY.map((recurso) => {
    const heno = [recurso.name, recurso.org, ...recurso.tags, recurso.note, ...recurso.courses].join(" ").toLowerCase();
    let puntos = 0;
    for (const termino of terminos) if (heno.includes(termino)) puntos += 1;
    if (input.course && recurso.courses.includes(input.course)) puntos += 2;
    if (recurso.lang === input.locale || recurso.lang === "multi") puntos += 1;
    return { recurso, puntos };
  })
    .filter((entrada) => entrada.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos || a.recurso.name.localeCompare(b.recurso.name));

  const elegidos = (puntuados.length ? puntuados : LIBRARY.map((recurso) => ({ recurso, puntos: 0 })))
    .slice(0, limit)
    .map((entrada) => recursoAToolItem(entrada.recurso));

  return {
    tool: "recomendar_biblioteca",
    effect: "lectura",
    summary: `recursos abiertos ordenados por encaje con la pregunta (${LIBRARY.length} en la biblioteca)`,
    items: elegidos
  };
}

function ejecutarRutaItinerario(input: TutorToolInput, limit: number): ToolResult {
  const curso = input.course;
  const porCurso = curso ? TRACKS.find((ruta) => ruta.courses.includes(curso)) : undefined;
  const elegido: TrackDef | undefined = porCurso ?? TRACKS[0] ?? undefined;
  // Las semanas se cuentan del corpus cargado (el máximo índice visto por curso):
  // así el resumen no depende de una lista escrita a mano que puede envejecer.
  const semanasPorCurso: Record<string, number> = {};
  for (const chunk of input.knowledge.chunks) {
    if (typeof chunk.week === "number") {
      semanasPorCurso[chunk.course] = Math.max(semanasPorCurso[chunk.course] ?? 0, chunk.week);
    }
  }
  if (!elegido) {
    return { tool: "ruta_itinerario", effect: "lectura", summary: "sin itinerario aplicable", items: [] };
  }
  const items: ToolItem[] = elegido.courses.map((slug, indice) => {
    const titulo = input.knowledge.chunks.find((chunk) => chunk.course === slug)?.courseTitle ?? slug;
    return {
      label: `${indice + 1}. ${titulo}`,
      detail: indice === 0 ? "punto de entrada: sin prerrequisitos" : "se disfruta después del anterior (el campus no bloquea nada)",
      url: `/${input.locale}/programas/${slug}`,
      course: slug
    };
  });
  return {
    tool: "ruta_itinerario",
    effect: "lectura",
    summary: `itinerario «${elegido.id}» · ${elegido.courses.reduce((total, slug) => total + (semanasPorCurso[slug] ?? 0), 0)} semanas · ${trackLevelKey(elegido.level)}`,
    items: items.slice(0, limit)
  };
}

function faseAToolItem(fase: PlanPhase): ToolItem {
  const etiqueta = fase.mode === "programa" ? `programa: ${fase.course}` : fase.mode;
  return {
    label: `Año ${fase.year} · semestre ${fase.semester} · semanas ${fase.from}-${fase.to}`,
    detail: `${etiqueta} · ${fase.published > 0 ? `${fase.published} semanas ya publicadas` : "material por escribir"} · alinea con ${fase.aligns.join(", ")}`,
    ...(fase.course ? { course: fase.course } : {})
  };
}

function ejecutarPlanEstudio(input: TutorToolInput, limit: number): ToolResult {
  const items = CURRICULUM_5Y.map(faseAToolItem);
  return {
    tool: "plan_estudio",
    effect: "lectura",
    summary: `plan de ${TOTAL_WEEKS} semanas (5 años) en ${CURRICULUM_5Y.length} franjas`,
    items: items.slice(0, limit)
  };
}

/**
 * Ejecuta las herramientas que la pregunta pide. Si no pide ninguna, devuelve
 * una lista vacía: el agente responde con el material citado y ya está.
 */
export function runTutorTools(input: TutorToolInput): ToolResult[] {
  const limit = Math.max(1, Math.min(input.limit ?? 6, 12));
  const pedidas = detectTools(input.question);
  const resultados: ToolResult[] = [];
  for (const id of pedidas) {
    switch (id) {
      case "listar_programas":
        resultados.push(ejecutarListarProgramas(input, limit));
        break;
      case "resumen_semana":
        resultados.push(ejecutarResumenSemana(input, limit));
        break;
      case "recomendar_biblioteca":
        resultados.push(ejecutarRecomendarBiblioteca(input, limit));
        break;
      case "ruta_itinerario":
        resultados.push(ejecutarRutaItinerario(input, limit));
        break;
      case "plan_estudio":
        resultados.push(ejecutarPlanEstudio(input, limit));
        break;
    }
  }
  return resultados;
}

/** Índice listo para el buscador del campus (atajo para la interfaz). */
export function knowledgeIndex(knowledge: KnowledgePack) {
  return buildIndex(knowledgeToSearchDocs(knowledge));
}

/** Búsqueda citada sobre el corpus: la usa la interfaz de biblioteca y el agente. */
export function searchKnowledge(knowledge: KnowledgePack, question: string, limit = 4) {
  return search(knowledgeIndex(knowledge), question, { limit });
}
