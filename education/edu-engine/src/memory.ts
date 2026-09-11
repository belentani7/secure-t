export type AnswerRecord = { lessonId: string; ok: boolean; at: string };
export type Progress = { answers: Record<string, AnswerRecord[]>; updatedAt: string };

const memFallback = new Map<string, string>();

export class MemoryStore<T> {
  readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  static init<T>(prefix: string): MemoryStore<T> {
    return new MemoryStore<T>(prefix);
  }

  private key(key: string): string {
    return `${this.prefix}:${key}`;
  }

  get<K extends string>(key: K): T | undefined {
    const raw = this.readRaw(key);
    if (raw === null) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  set<K extends string>(key: K, value: T): void {
    this.writeRaw(key, JSON.stringify(value));
  }

  remove<K extends string>(key: K): void {
    this.writeRaw(key, null);
  }

  private readRaw(key: string): string | null {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(this.key(key));
      }
    } catch {
      /* storage no disponible: cae al fallback en memoria */
    }
    const k = this.key(key);
    return memFallback.has(k) ? (memFallback.get(k) ?? null) : null;
  }

  private writeRaw(key: string, value: string | null): void {
    try {
      if (typeof localStorage !== "undefined") {
        if (value === null) localStorage.removeItem(this.key(key));
        else localStorage.setItem(this.key(key), value);
        return;
      }
    } catch {
      /* storage no disponible: cae al fallback en memoria */
    }
    const k = this.key(key);
    if (value === null) memFallback.delete(k);
    else memFallback.set(k, value);
  }
}

export type ProgressStore = MemoryStore<Progress>;

const PROGRESS_KEY = "progress";

export function getProgress(store: MemoryStore<Progress>): Progress {
  return store.get(PROGRESS_KEY) ?? { answers: {}, updatedAt: "" };
}

export function recordAnswer(
  store: MemoryStore<Progress>,
  lessonId: string,
  ok: boolean,
  now: Date = new Date(),
): Progress {
  const progress = getProgress(store);
  const at = now.toISOString();
  const list = progress.answers[lessonId] ?? [];
  list.push({ lessonId, ok, at });
  progress.answers[lessonId] = list;
  progress.updatedAt = at;
  store.set(PROGRESS_KEY, progress);
  return progress;
}

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function computeStreak(progress: Progress, now: Date = new Date()): number {
  const days = new Set<string>();
  for (const recs of Object.values(progress.answers)) {
    for (const r of recs) {
      if (!r.ok) continue;
      const d = new Date(r.at);
      if (Number.isNaN(d.getTime())) continue;
      days.add(dayKey(d));
    }
  }
  if (!days.size) return 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
    if (streak > 3650) break;
  }
  return streak;
}

export interface SuggestionSource {
  id: string;
  title?: string;
}

export interface NextStep {
  lessonId: string;
  title: string;
  reason: "pending" | "review" | "complete";
}

export function sugerirSiguientePaso(
  progress: Progress,
  lessons: readonly SuggestionSource[],
): NextStep | null {
  if (!lessons.length) return null;
  for (const l of lessons) {
    const recs = progress.answers[l.id];
    if (!recs || recs.length === 0) {
      return { lessonId: l.id, title: String(l.title ?? l.id), reason: "pending" };
    }
  }
  for (const l of lessons) {
    const recs = progress.answers[l.id] ?? [];
    if (recs.length && !recs[recs.length - 1].ok) {
      return { lessonId: l.id, title: String(l.title ?? l.id), reason: "review" };
    }
  }
  const last = lessons[lessons.length - 1];
  return { lessonId: last.id, title: String(last.title ?? last.id), reason: "complete" };
}
