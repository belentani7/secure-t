// Motor educativo compartido (framework-agnostic, sin dependencias runtime).
// Implementa el contrato que fijan los tests en ../tests/quiz.test.mjs.

export interface Lesson {
  id: string;
  title: string;
  objective: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface BuildQuizOptions {
  count: number;
  focusIds?: string[];
  seed?: string;
}

export interface AnswerLog {
  lessonId: string;
  ok: boolean;
  at: string;
}

export interface Progress {
  answers: Record<string, AnswerLog[]>;
  updatedAt: string;
}

export interface LessonPlanSource {
  code?: string;
  title?: string;
  year?: number;
  credits?: number;
  description?: string;
  competencies?: string[];
  lessons?: Array<{
    id: string;
    title: string;
    type: string;
    minutes: number;
    objective: string;
    content: string;
  }>;
}

export interface LessonPlan {
  code: string;
  title: string;
  year: number;
  credits: number;
  description: string;
  competencies: string[];
  lessons: LessonPlanSource["lessons"];
}

// ---------------------------------------------------------------------------
// PRNG determinista (mulberry32) a partir de una semilla de texto.
// ---------------------------------------------------------------------------

function seedToInt(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRng(seed?: string): () => number {
  return seed ? mulberry32(seedToInt(seed)) : Math.random;
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export function grade(answer: number | string, question: QuizQuestion): boolean {
  const n = typeof answer === "string" ? Number(answer) : answer;
  if (Number.isNaN(n)) return false;
  return n === question.answer;
}

export function buildQuizFromLessons(
  lessons: Lesson[],
  options: BuildQuizOptions
): QuizQuestion[] {
  if (!lessons || lessons.length === 0) return [];

  const rng = makeRng(options.seed);
  const focusIds = new Set(options.focusIds ?? []);
  const focused = lessons.filter((l) => focusIds.has(l.id));
  const rest = shuffle(
    lessons.filter((l) => !focusIds.has(l.id)),
    rng
  );
  const ordered = [...focused, ...rest];
  const count = Math.min(options.count, ordered.length);
  const targets = ordered.slice(0, count);

  return targets.map((lesson, idx) => {
    const distractorPool = shuffle(
      lessons.filter((l) => l.id !== lesson.id).map((l) => l.objective),
      rng
    );
    const distractorCount = Math.min(2, distractorPool.length);
    const distractors = distractorPool.slice(0, distractorCount);
    const optionsShuffled = shuffle([lesson.objective, ...distractors], rng);
    const answerIndex = optionsShuffled.indexOf(lesson.objective);

    return {
      id: `${lesson.id}-q${idx}`,
      prompt: `Sobre «${lesson.title}»: ¿cuál es el objetivo correcto?`,
      options: optionsShuffled,
      answer: answerIndex,
      explanation: lesson.objective,
    };
  });
}

const CONGRATS = {
  es: { perfect: "¡Perfecto! {score} de {total}", partial: "{score} de {total}", effort: "{score} de {total}, sigue" },
  pt: { perfect: "Perfeito! {score} de {total}", partial: "{score} de {total}", effort: "{score} de {total}, continue" },
  "pt-BR": { perfect: "Perfeito! {score} de {total}", partial: "{score} de {total}", effort: "{score} de {total}, continue" },
  en: { perfect: "Perfect! {score} of {total}", partial: "{score} of {total}", effort: "{score} of {total}, keep going" },
  ca: { perfect: "Perfecte! {score} de {total}", partial: "{score} de {total}", effort: "{score} de {total}, continua" },
} as const;

type SupportedLocale = keyof typeof CONGRATS;

function resolveLocale(locale: string): SupportedLocale {
  if (locale in CONGRATS) return locale as SupportedLocale;
  const base = locale.split("-")[0];
  return (base in CONGRATS ? base : "es") as SupportedLocale;
}

export function pickCongrats(
  score: number,
  total: number,
  streakDays: number,
  locale: string
): string {
  const loc = resolveLocale(locale);
  const copy = CONGRATS[loc];
  const bucket = total > 0 && score === total ? "perfect" : score > 0 ? "partial" : "effort";
  let message = copy[bucket].replace("{score}", String(score)).replace("{total}", String(total));
  if (streakDays > 0) {
    const streakWord = loc === "en" ? "days" : loc === "pt" || loc === "pt-BR" ? "dias" : loc === "ca" ? "dies" : "días";
    message += ` · ${streakDays} ${streakWord}`;
  }
  return message;
}

// ---------------------------------------------------------------------------
// Progreso / rachas
// ---------------------------------------------------------------------------

function dateKey(value: string | Date): string {
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function computeStreak(progress: Progress, now: Date = new Date()): number {
  const trueDays = new Set<string>();
  for (const list of Object.values(progress.answers ?? {})) {
    for (const entry of list) {
      if (entry.ok) trueDays.add(dateKey(entry.at));
    }
  }
  if (trueDays.size === 0) return 0;

  const dayMs = 24 * 60 * 60 * 1000;
  let cursor = new Date(now);
  let anchorFound = false;
  for (let i = 0; i < 3650; i++) {
    if (trueDays.has(dateKey(cursor))) {
      anchorFound = true;
      break;
    }
    cursor = new Date(cursor.getTime() - dayMs);
  }
  if (!anchorFound) return 0;

  let streak = 0;
  for (let i = 0; i < 3650; i++) {
    if (!trueDays.has(dateKey(cursor))) break;
    streak++;
    cursor = new Date(cursor.getTime() - dayMs);
  }
  return streak;
}

export function getProgress(store: MemoryStore): Progress {
  return store.data;
}

export function recordAnswer(
  store: MemoryStore,
  lessonId: string,
  ok: boolean,
  at: Date
): Progress {
  const progress = store.data;
  const log = progress.answers[lessonId] ?? (progress.answers[lessonId] = []);
  log.push({ lessonId, ok, at: at.toISOString() });
  progress.updatedAt = new Date().toISOString();
  return progress;
}

export class MemoryStore {
  readonly prefix: string;
  data: Progress;

  private constructor(prefix: string) {
    this.prefix = prefix;
    this.data = { answers: {}, updatedAt: "" };
  }

  static init(prefix: string): MemoryStore {
    return new MemoryStore(prefix);
  }
}

// ---------------------------------------------------------------------------
// Planes de lección
// ---------------------------------------------------------------------------

export function normalizeLessonPlan(src: LessonPlanSource): LessonPlan | null {
  if (!src || !src.code || !Array.isArray(src.lessons) || src.lessons.length === 0) {
    return null;
  }
  return {
    code: src.code,
    title: src.title ?? "",
    year: src.year ?? 1,
    credits: src.credits ?? 0,
    description: src.description ?? "",
    competencies: src.competencies ?? [],
    lessons: src.lessons,
  };
}

export function nextLesson(plan: LessonPlan, lessonId: string) {
  const lessons = plan.lessons ?? [];
  const idx = lessons.findIndex((l) => l.id === lessonId);
  if (idx === -1 || idx === lessons.length - 1) return undefined;
  return lessons[idx + 1];
}

export function prevLesson(plan: LessonPlan, lessonId: string) {
  const lessons = plan.lessons ?? [];
  const idx = lessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return undefined;
  return lessons[idx - 1];
}

export interface NextStep {
  lessonId: string | null;
  reason: "pending" | "review" | "complete";
}

export function sugerirSiguientePaso(
  progress: Progress,
  lessons: Array<{ id: string }>
): NextStep | null {
  if (!lessons || lessons.length === 0) return null;

  const answers = progress.answers ?? {};
  const pending = lessons.find((l) => !answers[l.id] || answers[l.id].length === 0);
  if (pending) {
    return { lessonId: pending.id, reason: "pending" };
  }

  const needsReview = lessons.find((l) => {
    const log = answers[l.id] ?? [];
    return log.length > 0 && !log.some((a) => a.ok);
  });
  if (needsReview) {
    return { lessonId: needsReview.id, reason: "review" };
  }

  return { lessonId: null, reason: "complete" };
}

// ---------------------------------------------------------------------------
// Tutor con voz (degradado a no-op fuera del navegador)
// ---------------------------------------------------------------------------

const LOCALES = { es: "es", pt: "pt-BR", en: "en", ca: "ca" } as const;

export class TutorAgent {
  readonly locales = LOCALES;

  voiceAvailable(): boolean {
    return typeof globalThis.speechSynthesis !== "undefined";
  }

  say(_text: string, _locale: string): void {
    if (!this.voiceAvailable()) return;
  }

  welcome(name: string, locale: string): void {
    this.say(`Bienvenida, ${name}`, locale);
  }

  celebrate(locale: string): void {
    this.say("¡Lo lograste!", locale);
  }

  encourage(locale: string): void {
    this.say("Vas bien, sigue así.", locale);
  }

  stop(): void {
    if (this.voiceAvailable()) {
      globalThis.speechSynthesis.cancel();
    }
  }
}
