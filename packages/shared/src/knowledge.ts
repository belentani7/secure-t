import type { SearchDoc } from "./search";

/**
 * Paquete de conocimiento del campus.
 *
 * Lo genera `tools/build-content.mjs` a partir del material publicado en
 * `campus/` (una sola fuente de verdad) y lo consumen la interfaz y el agente
 * IA. Va firmado con SHA-256 para que nadie pueda alterar el material sin que
 * la verificación lo note.
 */

export type ChunkKind =
  | "syllabus"
  | "week"
  | "lab"
  | "rubric"
  | "glossary"
  | "cheatsheet"
  | "exam"
  | "resources"
  | "concept"
  | "calendar";

export interface KnowledgeChunk {
  id: string;
  course: string;
  courseTitle: string;
  /** Número de semana cuando el fragmento pertenece a una semana concreta. */
  week?: number;
  kind: ChunkKind;
  title: string;
  /** Texto plano listo para indexar y citar. */
  text: string;
  /** Ruta relativa dentro del repositorio: la cita apunta al original. */
  source: string;
  url: string;
}

export interface KnowledgePack {
  version: 1;
  generatedAt: string;
  /** Hash del material fuente, para auditar que la cita y el texto coinciden. */
  sourceDigest: string;
  counts: { courses: number; weeks: number; chunks: number; words: number };
  chunks: KnowledgeChunk[];
}

export interface WeekArtifact {
  index: number;
  title: string;
  markdown: string;
  html: string;
  plain: string;
  words: number;
  sections: { title: string; body: string }[];
}

export interface CoursePack {
  slug: string;
  title: string;
  summary: string;
  hours: number;
  weeks: number;
  quizCount: number;
  locale: string;
  url: string;
  weeksData: WeekArtifact[];
  quiz: { question: string; options: string[]; answer: number; explanation: string }[];
  syllabus: string;
  artifacts: Record<string, string>;
}

export interface ContentPack {
  version: 1;
  generatedAt: string;
  sourceDigest: string;
  locale: string;
  courses: CoursePack[];
  totals: { courses: number; weeks: number; words: number; quizItems: number };
}

export function knowledgeToSearchDocs(pack: KnowledgePack): SearchDoc[] {
  return pack.chunks.map((chunk) => ({
    id: chunk.id,
    title: chunk.title,
    text: chunk.text,
    url: chunk.url,
    course: chunk.course,
    week: chunk.week,
    kind: chunk.kind
  }));
}

export function chunksForCourse(pack: KnowledgePack, slug: string): KnowledgeChunk[] {
  return pack.chunks.filter((chunk) => chunk.course === slug);
}

export function weekChunk(pack: KnowledgePack, slug: string, week: number): KnowledgeChunk | undefined {
  return pack.chunks.find((chunk) => chunk.course === slug && chunk.kind === "week" && chunk.week === week);
}

/** Recorta un texto largo a un presupuesto de caracteres sin cortar palabras. */
export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  const slice = value.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trim()}…`;
}

/** Comprueba que el paquete no viene alterado (se usa en el cliente). */
export async function verifyPack(pack: { chunks: { id: string; text: string }[] }, expectedDigest: string): Promise<boolean> {
  const material = pack.chunks.map((chunk) => `${chunk.id}\u0001${chunk.text}`).join("\u0002");
  const bytes = new TextEncoder().encode(material);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return hex === expectedDigest;
}

export function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  return crypto.subtle.digest("SHA-256", bytes).then((digest) =>
    [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
  );
}
