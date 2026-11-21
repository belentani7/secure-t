/** Progreso anónimo compartido con el campus estático (misma clave y esquema). */
export const CAMPUS_PROGRESS_KEY = "stt-progreso";

export type ProgressState = Record<string, boolean>;

type ProgressProgram = {
  slug: string;
  items: readonly string[];
};

export const CAMPUS_EXTRA_ITEMS = ["quiz", "laboratorio", "proyecto", "examen"] as const;

/** IDs compartidos con campus/progreso.html para un curso de N semanas. */
export function campusItems(weekCount: number): string[] {
  return [
    ...Array.from(
      { length: weekCount },
      (_, index) => `semana-${String(index + 1).padStart(2, "0")}`,
    ),
    ...CAMPUS_EXTRA_ITEMS,
  ];
}

export function progressId(slug: string, item: string): string {
  return `${slug}/${item}`;
}

/** Solo acepta un objeto plano con valores `true`; nada de datos inventados. */
export function normalizeProgress(value: unknown): ProgressState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      (entry): entry is [string, true] => entry[1] === true,
    ),
  );
}

export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return {};
  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function serializeProgress(state: ProgressState): string {
  return JSON.stringify(state);
}

export function isDone(
  state: ProgressState,
  slug: string,
  item: string,
): boolean {
  return state[progressId(slug, item)] === true;
}

export function toggleProgress(
  state: ProgressState,
  slug: string,
  item: string,
  done: boolean,
): ProgressState {
  const next = { ...state };
  const id = progressId(slug, item);
  if (done) next[id] = true;
  else delete next[id];
  return next;
}

export type CourseProgress = {
  done: number;
  total: number;
  percent: number;
  complete: boolean;
};

export function courseProgress(
  state: ProgressState,
  slug: string,
  items: readonly string[],
): CourseProgress {
  const done = items.filter((item) => isDone(state, slug, item)).length;
  const total = items.length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
    complete: total > 0 && done === total,
  };
}

export function globalProgress(
  state: ProgressState,
  programs: readonly ProgressProgram[],
): { done: number; total: number; percent: number } {
  let done = 0;
  let total = 0;
  for (const program of programs) {
    const progress = courseProgress(state, program.slug, program.items);
    done += progress.done;
    total += progress.total;
  }
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

/** El examen se desbloquea con semanas, quiz y laboratorio (igual que el campus). */
export function isExamUnlocked(
  state: ProgressState,
  slug: string,
  items: readonly string[],
): boolean {
  return items
    .filter((item) => item !== "examen" && item !== "proyecto")
    .every((item) => isDone(state, slug, item));
}
