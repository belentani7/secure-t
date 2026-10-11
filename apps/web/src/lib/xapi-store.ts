"use client";

import {
  buildStatement,
  iso8601Duration,
  statementsToJsonLd,
  XAPI_VERBS,
  type XapiStatement,
  type XapiVerb
} from "@secure-t/shared";
import { SITE } from "./site";

/**
 * Registro local de declaraciones xAPI.
 *
 * El campus **no envía nada a ningún LRS**: sería contradecir la promesa de que
 * el progreso sólo existe en el dispositivo. Lo que hace es anotar cada acción
 * en el vocabulario estándar (xAPI 1.0.3) y ofrecer la exportación, para que
 * quien quiera la importe en su propio sistema. El actor es anónimo.
 */

const STORAGE_KEY = "secure-t-xapi-v1";
const MAXIMO = 500;

export function baseUrl(): string {
  if (typeof window !== "undefined") return `${window.location.origin}${SITE.basePath}`;
  return SITE.pagesUrl.replace(/\/$/, "");
}

function leer(): XapiStatement[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    const datos = bruto ? (JSON.parse(bruto) as XapiStatement[]) : [];
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function escribir(declaraciones: XapiStatement[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(declaraciones.slice(-MAXIMO)));
  } catch {
    /* modo privado: el registro vive mientras dure la pestaña */
  }
}

export interface RecordInput {
  token: string;
  locale: string;
  courseSlug: string;
  courseTitle: string;
  verb: XapiVerb;
  week?: number;
  activityId?: string;
  activityName?: string;
  activityType?: "course" | "lesson" | "assessment" | "question" | "badge";
  result?: XapiStatement["result"];
  progress?: number;
  /** Duración medida de la interacción, en milisegundos. */
  elapsedMs?: number;
}

/** Anota una acción. Devuelve la declaración creada (o `null` sin navegador). */
export function recordStatement(input: RecordInput): XapiStatement | null {
  if (typeof window === "undefined") return null;
  const base = baseUrl();
  const ahora = new Date().toISOString();
  const actividad =
    input.activityId ??
    (input.week !== undefined ? `/programas/${input.courseSlug}/semana/${input.week}` : `/programas/${input.courseSlug}`);

  const declaracion = buildStatement({
    baseUrl: base,
    token: input.token,
    locale: input.locale,
    courseSlug: input.courseSlug,
    courseTitle: input.courseTitle,
    verb: input.verb,
    activity: {
      id: actividad,
      type: input.activityType ?? (input.week !== undefined ? "lesson" : "course"),
      name: input.activityName ?? (input.week !== undefined ? `Semana ${input.week}` : input.courseTitle)
    },
    result: {
      ...(input.elapsedMs !== undefined ? { duration: iso8601Duration(input.elapsedMs) } : {}),
      ...input.result
    },
    timestamp: ahora,
    grouping: [
      { id: `${base}/programas/${input.courseSlug}`, label: "programa" },
      { id: `${base}/programas`, label: "campus" }
    ],
    ...(input.progress !== undefined ? { progress: input.progress } : {})
  });

  escribir([...leer(), declaracion]);
  return declaracion;
}

export function allStatements(): XapiStatement[] {
  return leer();
}

export function countStatements(): number {
  return leer().length;
}

export function exportStatements(): { filename: string; json: string } {
  const fecha = new Date().toISOString().slice(0, 10);
  return { filename: `secure-t-xapi-${fecha}.json`, json: statementsToJsonLd(leer()) };
}

export function clearStatements() {
  escribir([]);
}

/* ------------------------------------------------ acciones del campus (API) */

export interface Contexto {
  token: string;
  locale: string;
  slug: string;
  title: string;
}

/** Semana marcada o desmarcada en el expediente. */
export function recordWeekToggle(ctx: Contexto, week: number, done: boolean, total: number): void {
  const anteriores = new Set(
    leer()
      .filter((s) => s.verb.id === XAPI_VERBS.completed && s.object.id.includes(`/semana/${week}`))
      .map((s) => s.id)
  );
  if (!done && anteriores.size === 0) return;
  recordStatement({
    ...ctx,
    courseSlug: ctx.slug,
    courseTitle: ctx.title,
    verb: done ? "completed" : "experienced",
    week,
    activityType: "lesson",
    activityName: `Semana ${week}`,
    progress: Math.round((week / Math.max(total, 1)) * 100),
    result: { completion: done, success: done }
  });
}

/** Respuesta a una pregunta del cuestionario. */
export function recordQuizAnswer(
  ctx: Contexto,
  input: { week?: number; index: number; correct: boolean; score: number; total: number; elapsedMs?: number }
): void {
  recordStatement({
    ...ctx,
    courseSlug: ctx.slug,
    courseTitle: ctx.title,
    verb: "answered",
    ...(input.week !== undefined ? { week: input.week } : {}),
    activityId: `${baseUrl()}/programas/${ctx.slug}/cuestionario#p${input.index + 1}`,
    activityType: "question",
    activityName: `Pregunta ${input.index + 1}`,
    progress: Math.round((input.score / Math.max(input.total, 1)) * 100),
    result: { success: input.correct, completion: true, score: { scaled: input.score / Math.max(input.total, 1), raw: input.score, min: 0, max: input.total } },
    ...(input.elapsedMs !== undefined ? { elapsedMs: input.elapsedMs } : {})
  });
}

/** Fin del cuestionario: aprobado o suspendido según el umbral del programa. */
export function recordQuizFinished(
  ctx: Contexto,
  input: { week?: number; score: number; total: number; threshold: number; elapsedMs?: number }
): void {
  const aprobado = input.score >= input.threshold;
  recordStatement({
    ...ctx,
    courseSlug: ctx.slug,
    courseTitle: ctx.title,
    verb: aprobado ? "passed" : "failed",
    ...(input.week !== undefined ? { week: input.week } : {}),
    activityId: `${baseUrl()}/programas/${ctx.slug}/cuestionario`,
    activityType: "assessment",
    activityName: `Cuestionario ${ctx.title}`,
    result: {
      success: aprobado,
      completion: true,
      score: { scaled: input.score / Math.max(input.total, 1), raw: input.score, min: 0, max: input.total }
    },
    ...(input.elapsedMs !== undefined ? { elapsedMs: input.elapsedMs } : {})
  });
}

/** Lectura escuchada (voz del docente, bienvenida o lección). */
export function recordVoiceListened(ctx: Contexto, input: { week?: number; name: string; seconds?: number }): void {
  recordStatement({
    ...ctx,
    courseSlug: ctx.slug,
    courseTitle: ctx.title,
    verb: "experienced",
    ...(input.week !== undefined ? { week: input.week } : {}),
    activityId: `${baseUrl()}/programas/${ctx.slug}/audio/${encodeURIComponent(input.name)}`,
    activityType: input.week !== undefined ? "lesson" : "course",
    activityName: input.name,
    ...(input.seconds !== undefined ? { elapsedMs: Math.round(input.seconds * 1000) } : {})
  });
}

/** Credencial emitida: se anota en el mismo vocabulario. */
export function recordBadgeEarned(ctx: Contexto, input: { weeks: number }): void {
  recordStatement({
    ...ctx,
    courseSlug: ctx.slug,
    courseTitle: ctx.title,
    verb: "earned",
    activityId: `${baseUrl()}/credencial#${ctx.slug}`,
    activityType: "badge",
    activityName: `Credencial ${ctx.title}`,
    progress: 100,
    result: { completion: true, success: true, response: `${input.weeks} semanas` }
  });
}
