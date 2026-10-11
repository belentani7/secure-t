import type { ISODate } from "./calendar/dates";
import { addDays, isValidISO, todayISO } from "./calendar/dates";

/**
 * Repaso espaciado (SM-2, el algoritmo de SuperMemo-2).
 *
 * Por qué existe: un campus de veinte semanas no se aprueba leyendo una vez.
 * Cada semana completada genera una tarjeta que vuelve a aparecer en el momento
 * en que el estudiante está a punto de olvidarla, y el intervalo se recalcula
 * con las tres notas clásicas. Todo se calcula en el dispositivo: sin cuenta,
 * sin servicio externo y sin enviar qué ha fallado el estudiante a ninguna parte.
 *
 * Referencia del algoritmo: P. A. Wozniak, «Optimization of learning» (1990).
 * Aquí se implementa la variante S0 → SM-2 con factor de facilidad inicial 2,5,
 * mínimo 1,3 y penalización de caídas (lapses).
 */

export interface ReviewCard {
  /** Identificador estable: `<curso>/semana-<n>`. */
  id: string;
  course: string;
  week: number;
  title: string;
  url: string;
  /** Factor de facilidad (ease). */
  ease: number;
  /** Intervalo en días. */
  interval: number;
  /** Repeticiones consecutivas acertadas. */
  repetitions: number;
  /** Veces que se ha fallado la tarjeta. */
  lapses: number;
  due: ISODate;
  lastReviewed?: ISODate;
}

export interface ReviewState {
  version: 1;
  /** Fecha en la que se sembró el mazo (primer arranque). */
  created: ISODate;
  cards: Record<string, ReviewCard>;
}

export type ReviewGrade = 0 | 1 | 2 | 3;

export const REVIEW_GRADES: Record<ReviewGrade, { key: string; multiplier: number }> = {
  0: { key: "again", multiplier: 1 },
  1: { key: "hard", multiplier: 1.2 },
  2: { key: "good", multiplier: 1 },
  3: { key: "easy", multiplier: 1.3 }
};

export const EASE_MIN = 1.3;
export const EASE_MAX = 3.2;
export const EASE_START = 2.5;

export interface DeckCourse {
  slug: string;
  title: string;
  weeks: { index: number; title: string }[];
}

/**
 * Siembra el mazo con una tarjeta por semana de cada programa.
 *
 * Las tarjetas nacen **programadas**, no todas el primer día: la primera de cada
 * curso vence hoy y el resto se reparte en los días siguientes. Así el estudiante
 * empieza con tres repasos (uno por programa) y el mazo nunca le cae encima.
 */
export function seedDeck(courses: DeckCourse[], today: ISODate = todayISO() as ISODate): ReviewState {
  const cards: Record<string, ReviewCard> = {};
  for (const [courseIndex, course] of courses.entries()) {
    for (const [weekIndex, week] of course.weeks.entries()) {
      const id = `${course.slug}/semana-${week.index}`;
      const offset = courseIndex === 0 && weekIndex === 0 ? 0 : (courseIndex + weekIndex) % 21;
      cards[id] = {
        id,
        course: course.slug,
        week: week.index,
        title: week.title,
        url: `/programas/${course.slug}/semana/${week.index}`,
        ease: EASE_START,
        interval: 0,
        repetitions: 0,
        lapses: 0,
        due: addDays(today, offset)
      };
    }
  }
  return { version: 1, created: today, cards };
}

function isValidGrade(grade: number): grade is ReviewGrade {
  return grade === 0 || grade === 1 || grade === 2 || grade === 3;
}

/**
 * Aplica una nota a una tarjeta y devuelve la tarjeta actualizada.
 *
 * · Otra vez (0): vuelve a hoy y la facilidad baja un 20 %.
 * · Difícil (1): intervalo ×1,2 y la facilidad baja un 15 %.
 * · Bien (2): el intervalo clásico de SM-2 (1 → 6 → anterior × facilidad).
 * · Fácil (3): como «bien» con facilidad un 15 % más alta.
 *
 * Garantía que comprueba un test: para cualquier tarjeta, el intervalo de
 * «fácil» es mayor que el de «bien», y el de «bien» mayor que el de «difícil».
 * Sin esa garantía el algoritmo castigaría al estudiante constante: la versión
 * ingenua (difícil = anterior × 1,2 × facilidad) podía dar más días por decir
 * «difícil» que por decir «bien».
 */
export function gradeCard(card: ReviewCard, grade: number, today: ISODate = todayISO() as ISODate): ReviewCard {
  if (!isValidGrade(grade)) throw new Error(`nota de repaso inválida: ${grade}`);
  const factor = REVIEW_GRADES[grade].multiplier;
  const ease = Math.min(EASE_MAX, Math.max(EASE_MIN, card.ease * (grade === 3 ? 1.15 : grade === 2 ? 1 : grade === 1 ? 0.85 : 0.8)));

  if (grade === 0) {
    return {
      ...card,
      ease,
      interval: 0,
      repetitions: 0,
      lapses: card.lapses + 1,
      due: today,
      lastReviewed: today
    };
  }

  const repetitions = card.repetitions + 1;
  const anterior = Math.max(1, card.interval);
  let interval: number;
  if (repetitions === 1) interval = 1;
  else if (repetitions === 2) interval = 6;
  else if (grade === 1) interval = Math.max(1, Math.round(anterior * 1.2));
  else interval = Math.max(1, Math.round(anterior * ease * factor));

  return {
    ...card,
    ease,
    interval,
    repetitions,
    due: addDays(today, interval),
    lastReviewed: today
  };
}

/** Tarjetas que tocan hoy o antes, las más atrasadas primero. */
export function dueCards(state: ReviewState, today: ISODate = todayISO() as ISODate, limit = 20): ReviewCard[] {
  return Object.values(state.cards)
    .filter((card) => !isValidISO(card.due) || card.due <= today)
    .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.id.localeCompare(b.id)))
    .slice(0, Math.max(1, limit));
}

/** Próxima tarjeta futura: sirve para decir «vuelve el día X». */
export function nextDue(state: ReviewState, today: ISODate = todayISO() as ISODate): ISODate | null {
  const pendientes = Object.values(state.cards)
    .map((card) => card.due)
    .filter((due) => due > today)
    .sort();
  return pendientes[0] ?? null;
}

export interface ReviewStats {
  total: number;
  dueToday: number;
  learned: number;
  lapses: number;
  /** Días de repaso previstos en las próximas dos semanas. */
  horizon: { date: ISODate; count: number }[];
}

export function reviewStats(state: ReviewState, today: ISODate = todayISO() as ISODate, horizonDays = 14): ReviewStats {
  const cards = Object.values(state.cards);
  const horizon: { date: ISODate; count: number }[] = [];
  for (let offset = 0; offset < horizonDays; offset += 1) {
    const date = addDays(today, offset);
    horizon.push({ date, count: cards.filter((card) => card.due === date).length });
  }
  return {
    total: cards.length,
    dueToday: cards.filter((card) => card.due <= today).length,
    learned: cards.filter((card) => card.repetitions >= 2).length,
    lapses: cards.reduce((sum, card) => sum + card.lapses, 0),
    horizon
  };
}

/** Valida un estado venido de `localStorage`: si no cuadra, se descarta entero. */
export function parseReviewState(json: string): ReviewState | null {
  try {
    const parsed = JSON.parse(json) as ReviewState;
    if (parsed?.version !== 1 || typeof parsed.cards !== "object" || parsed.cards === null) return null;
    const cards: Record<string, ReviewCard> = {};
    for (const [id, card] of Object.entries(parsed.cards)) {
      if (!card || typeof card !== "object") return null;
      if (typeof card.due !== "string" || !isValidISO(card.due)) return null;
      if (typeof card.ease !== "number" || typeof card.interval !== "number") return null;
      cards[id] = {
        ...card,
        id,
        ease: Math.min(EASE_MAX, Math.max(EASE_MIN, card.ease)),
        interval: Math.max(0, Math.round(card.interval)),
        repetitions: Math.max(0, Math.round(card.repetitions ?? 0)),
        lapses: Math.max(0, Math.round(card.lapses ?? 0))
      };
    }
    return { version: 1, created: isValidISO(parsed.created) ? parsed.created : (todayISO() as ISODate), cards };
  } catch {
    return null;
  }
}

/** Carga las tarjetas de las semanas ya completadas en el expediente. */
export function syncWithProgress(
  state: ReviewState,
  doneWeeks: { course: string; week: number }[],
  today: ISODate = todayISO() as ISODate
): ReviewState {
  if (!doneWeeks.length) return state;
  const cards = { ...state.cards };
  for (const { course, week } of doneWeeks) {
    const id = `${course}/semana-${week}`;
    const existing = cards[id];
    if (!existing) continue;
    if (existing.repetitions > 0) continue;
    // Semana recién terminada: entra en el mazo para mañana, no para hoy.
    cards[id] = { ...existing, due: existing.due <= today ? addDays(today, 1) : existing.due };
  }
  return { ...state, cards };
}
