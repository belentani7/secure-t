export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface QuizLessonSource {
  id: string;
  title: string;
  objective?: string;
  content?: string;
}

export interface BuildQuizOptions {
  count?: number;
  focusIds?: string[];
  seed?: string | number;
}

export function grade(answer: number | string, q: Question): boolean {
  return Number(answer) === q.answer;
}

function hashSeed(seed: string | number): number {
  const s = String(seed);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: readonly T[], rnd: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

export function buildQuizFromLessons(
  lessons: readonly QuizLessonSource[],
  options: BuildQuizOptions = {},
): Question[] {
  const count = Math.max(1, Math.min(options.count ?? 3, lessons.length));
  const rnd = mulberry32(hashSeed(options.seed ?? "edu"));
  const pool: QuizLessonSource[] = [];
  for (const l of lessons) {
    if (l && typeof l.id === "string" && typeof l.title === "string") pool.push(l);
  }
  if (!pool.length) return [];

  const focusLessons: QuizLessonSource[] = [];
  if (Array.isArray(options.focusIds)) {
    for (const id of options.focusIds) {
      const hit = pool.find((x) => x.id === id);
      if (hit) focusLessons.push(hit);
    }
  }
  const focus = focusLessons.length ? focusLessons : shuffle(pool, rnd);
  const others = (l: QuizLessonSource) => pool.filter((o) => o.id !== l.id);

  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    const lesson = focus[i % focus.length];
    const variant = i % 2;
    const correct = variant === 0 ? lesson.objective || lesson.title : lesson.title;
    const candidates = others(lesson)
      .map((o) => (variant === 0 ? o.objective || o.title : o.title))
      .filter((t): t is string => Boolean(t) && t !== correct);
    const distractors = shuffle(candidates, rnd).slice(0, 2);
    if (distractors.length < 1) continue;
    const optionsArr = shuffle([correct, ...distractors], rnd);
    out.push({
      id: `${lesson.id}-q${i}`,
      prompt:
        variant === 0
          ? `¿Cuál es el objetivo de la lección «${lesson.title}»?`
          : `¿Qué lección persigue este objetivo? «${lesson.objective || lesson.title}»`,
      options: optionsArr,
      answer: optionsArr.indexOf(correct),
      explanation: lesson.content || correct,
    });
  }
  return out;
}

export type CongratLang = "es" | "pt-BR" | "en" | "ca";

const CONGRATS: Record<CongratLang, { perfect: string[]; partial: string[]; effort: string[] }> = {
  es: {
    perfect: [
      "¡Perfecto, {score} de {total}! Racha de {streak} días. Nada que corregir.",
      "¡Impecable! {score}/{total} correctas y {streak} días seguidos de práctica.",
    ],
    partial: [
      "Buen trabajo: {score} de {total}. Revisa las explicaciones y repite para consolidar.",
      "Vas por buen camino: {score}/{total}. La siguiente pasada será impecable.",
    ],
    effort: [
      "Lo importante es intentarlo. {score} de {total}; repasa la lección y vuelve.",
      "Cada error es evidencia para aprender. {score}/{total} hoy, mejor mañana.",
    ],
  },
  "pt-BR": {
    perfect: [
      "Perfeito, {score} de {total}! Sequência de {streak} dias. Nada a corrigir.",
      "Impecável! {score}/{total} corretas e {streak} dias seguidos de prática.",
    ],
    partial: [
      "Bom trabalho: {score} de {total}. Revise as explicações e repita para consolidar.",
      "Você está no caminho certo: {score}/{total}. A próxima rodada será impecável.",
    ],
    effort: [
      "O importante é tentar. {score} de {total}; revise a lição e volte.",
      "Cada erro é evidência para aprender. {score}/{total} hoje, melhor amanhã.",
    ],
  },
  en: {
    perfect: [
      "Perfect, {score} out of {total}! A {streak}-day streak. Nothing to fix.",
      "Flawless! {score}/{total} correct with a {streak}-day streak.",
    ],
    partial: [
      "Good job: {score} out of {total}. Review the explanations and try again.",
      "You're on track: {score}/{total}. The next pass will be flawless.",
    ],
    effort: [
      "Trying is what matters. {score} out of {total}; review the lesson and come back.",
      "Every mistake is evidence to learn from. {score}/{total} today, better tomorrow.",
    ],
  },
  ca: {
    perfect: [
      "Perfecte, {score} de {total}! Ratxa de {streak} dies. Res a corregir.",
      "Impecable! {score}/{total} correctes i {streak} dies seguits de pràctica.",
    ],
    partial: [
      "Bona feina: {score} de {total}. Revisa les explicacions i repeteix-ho per consolidar.",
      "Vas per bon camí: {score}/{total}. La propera passada serà impecable.",
    ],
    effort: [
      "L'important és intentar-ho. {score} de {total}; repassa la lliçó i torna.",
      "Cada error és evidència per aprendre. {score}/{total} avui, millor demà.",
    ],
  },
};

function normalizeLang(lang: string): CongratLang {
  const l = lang.toLowerCase();
  if (l.startsWith("pt")) return "pt-BR";
  if (l === "ca" || l === "ca-es") return "ca";
  if (l === "en") return "en";
  return "es";
}

export function pickCongrats(
  score: number,
  total: number,
  streak = 0,
  lang: string | CongratLang = "es",
): string {
  const key = normalizeLang(lang);
  const bucket =
    total > 0 && score >= total
      ? "perfect"
      : total > 0 && score >= Math.ceil(total / 2)
        ? "partial"
        : "effort";
  const msgs = CONGRATS[key][bucket];
  const tpl = msgs[Math.abs(score + streak) % msgs.length];
  return tpl
    .replace("{score}", String(score))
    .replace("{total}", String(total))
    .replace("{streak}", String(streak));
}
