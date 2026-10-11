import { sha256Hex } from "./knowledge";

/**
 * Modelo de progreso anónimo.
 *
 * Promesa P6 del contrato: sin cuenta, sin correo, sin seguimiento. El
 * expediente vive en `localStorage`, se puede **exportar firmado** para
 * llevarlo a otro dispositivo y nadie más puede leerlo: no hay servidor.
 */

export interface CourseProgress {
  slug: string;
  /** Semanas completadas (1..20). */
  weeks: number[];
  quiz?: { score: number; total: number; at: string };
  lab?: boolean;
  /** URL o nota de la evidencia entregada, si el estudiante la registra. */
  project?: string;
  exam?: boolean;
  updatedAt: string;
}

export interface ProgressRecord {
  version: 1;
  /** Token anónimo generado en el dispositivo (crypto.randomUUID). */
  token: string;
  createdAt: string;
  updatedAt: string;
  locale?: string;
  courses: Record<string, CourseProgress>;
}

export interface SignedProgress extends ProgressRecord {
  /** SHA-256 canónico del expediente sin el propio sello. */
  seal: string;
}

export function emptyProgress(token: string, locale?: string): ProgressRecord {
  const now = new Date().toISOString();
  return { version: 1, token, createdAt: now, updatedAt: now, ...(locale ? { locale } : {}), courses: {} };
}

/** JSON determinista: claves ordenadas recursivamente. Base del sello. */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, item]) => item !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, item]) => `${JSON.stringify(key)}:${canonicalize(item)}`);
  return `{${entries.join(",")}}`;
}

export async function sealProgress(record: ProgressRecord): Promise<SignedProgress> {
  const seal = await sha256Hex(canonicalize(record));
  return { ...record, seal };
}

export async function verifyProgress(record: SignedProgress): Promise<boolean> {
  const { seal, ...rest } = record;
  if (typeof seal !== "string" || seal.length !== 64) return false;
  return (await sha256Hex(canonicalize(rest))) === seal;
}

export function parseProgress(json: string): ProgressRecord | null {
  try {
    const parsed = JSON.parse(json) as ProgressRecord;
    if (parsed?.version !== 1) return null;
    if (typeof parsed.token !== "string" || parsed.token.length < 8) return null;
    if (typeof parsed.courses !== "object" || parsed.courses === null) return null;
    return parsed;
  } catch {
    return null;
  }
}

export interface CompletionReport {
  slug: string;
  weeksDone: number;
  weeksTotal: number;
  percent: number;
  quizDone: boolean;
  labDone: boolean;
  projectDone: boolean;
  examDone: boolean;
  /** Todos los requisitos cumplidos: la credencial se puede emitir. */
  ready: boolean;
  missing: string[];
}

export function completionOf(record: ProgressRecord, slug: string, weeksTotal = 20): CompletionReport {
  const course = record.courses[slug];
  const weeksDone = course ? new Set(course.weeks.filter((week) => week >= 1 && week <= weeksTotal)).size : 0;
  const quizDone = Boolean(course?.quiz && course.quiz.total > 0 && course.quiz.score / course.quiz.total >= 0.7);
  const labDone = Boolean(course?.lab);
  const projectDone = Boolean(course?.project && course.project.trim().length >= 12);
  const examDone = Boolean(course?.exam);
  const missing: string[] = [];
  if (weeksDone < weeksTotal) missing.push(`weeks:${weeksDone}/${weeksTotal}`);
  if (!quizDone) missing.push("quiz");
  if (!labDone) missing.push("lab");
  if (!projectDone) missing.push("project");
  if (!examDone) missing.push("exam");
  return {
    slug,
    weeksDone,
    weeksTotal,
    percent: Math.round(((weeksDone / weeksTotal) * 0.6 + (quizDone ? 0.15 : 0) + (labDone ? 0.1 : 0) + (projectDone ? 0.1 : 0) + (examDone ? 0.05 : 0)) * 100),
    quizDone,
    labDone,
    projectDone,
    examDone,
    ready: missing.length === 0,
    missing
  };
}

export function markWeek(record: ProgressRecord, slug: string, week: number, done = true): ProgressRecord {
  const current = record.courses[slug] ?? { slug, weeks: [], updatedAt: new Date().toISOString() };
  const weeks = new Set(current.weeks);
  if (done) weeks.add(week);
  else weeks.delete(week);
  const now = new Date().toISOString();
  return {
    ...record,
    updatedAt: now,
    courses: { ...record.courses, [slug]: { ...current, weeks: [...weeks].sort((a, b) => a - b), updatedAt: now } }
  };
}

export function recordQuiz(record: ProgressRecord, slug: string, score: number, total: number): ProgressRecord {
  const current = record.courses[slug] ?? { slug, weeks: [], updatedAt: new Date().toISOString() };
  const now = new Date().toISOString();
  const previous = current.quiz;
  const best = previous && previous.score > score ? previous : { score, total, at: now };
  return { ...record, updatedAt: now, courses: { ...record.courses, [slug]: { ...current, quiz: best, updatedAt: now } } };
}

export function setFlag(record: ProgressRecord, slug: string, flag: "lab" | "exam", value = true): ProgressRecord {
  const current = record.courses[slug] ?? { slug, weeks: [], updatedAt: new Date().toISOString() };
  const now = new Date().toISOString();
  return { ...record, updatedAt: now, courses: { ...record.courses, [slug]: { ...current, [flag]: value, updatedAt: now } } };
}

export function setProject(record: ProgressRecord, slug: string, note: string): ProgressRecord {
  const current = record.courses[slug] ?? { slug, weeks: [], updatedAt: new Date().toISOString() };
  const now = new Date().toISOString();
  return { ...record, updatedAt: now, courses: { ...record.courses, [slug]: { ...current, project: note.trim(), updatedAt: now } } };
}

/** Texto de la credencial: exactamente lo que se firma con SHA-256. */
export function credentialText(input: {
  token: string;
  slug: string;
  courseTitle: string;
  weeksTotal: number;
  issuedAt: string;
  locale: string;
}): string {
  return [
    "secure T · credencial de aprovechamiento",
    `programa: ${input.slug} — ${input.courseTitle}`,
    `semanas acreditadas: ${input.weeksTotal}`,
    `identificador anónimo: ${input.token}`,
    `fecha de emisión: ${input.issuedAt}`,
    `idioma: ${input.locale}`,
    "verificación: recalcular SHA-256 de este texto en el navegador",
    "revisión humana de evidencias: PLANIFICADO"
  ].join("\n");
}
