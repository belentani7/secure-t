import {
  buildIndex,
  knowledgeToSearchDocs,
  normalize,
  search,
  toPlainText,
  type KnowledgeChunk,
  type KnowledgePack,
  type SearchDoc,
  type SearchIndex
} from "@secure-t/shared";
import type { AgentSource } from "./contract";

/**
 * Recuperación local (RAG sin servidor).
 *
 * Todo el corpus del campus —80 semanas, laboratorios, rúbricas, glosarios,
 * exámenes, cápsulas y conceptos— se indexa en memoria con BM25. La respuesta
 * cita siempre fragmentos literales, así que la afirmación es verificable:
 * se puede abrir la fuente y comprobar que dice exactamente eso.
 */

export function buildKnowledgeIndex(pack: KnowledgePack): SearchIndex<SearchDoc> {
  return buildIndex(knowledgeToSearchDocs(pack));
}

const QUOTE_LENGTH = 280;

function quoteFrom(chunk: KnowledgeChunk, terms: string[]): string {
  const plain = toPlainText(chunk.text).replace(/\s+/g, " ").trim();
  if (!plain) return "";
  const haystack = normalize(plain);
  let position = -1;
  for (const term of terms) {
    const found = haystack.indexOf(term);
    if (found !== -1 && (position === -1 || found < position)) position = found;
  }
  if (position === -1) return plain.slice(0, QUOTE_LENGTH);
  const start = Math.max(0, position - 120);
  const end = Math.min(plain.length, start + QUOTE_LENGTH);
  const slice = plain.slice(start, end).trim();
  return `${start > 0 ? "…" : ""}${slice}${end < plain.length ? "…" : ""}`;
}

export interface RetrievalResult {
  sources: AgentSource[];
  /** Verdadero cuando ninguna fuente supera el umbral: el agente debe decirlo. */
  insufficient: boolean;
}

export function retrieve(
  index: SearchIndex<SearchDoc>,
  pack: KnowledgePack,
  question: string,
  options: { course?: string; week?: number; maxSources?: number; minScore?: number } = {}
): RetrievalResult {
  const byId = new Map(pack.chunks.map((chunk) => [chunk.id, chunk]));
  const maxSources = options.maxSources ?? 4;

  const base = search(index, question, {
    limit: Math.max(maxSources * 2, 8),
    minScore: options.minScore ?? 0.4,
    ...(options.course ? { course: options.course } : {})
  });

  // Si el estudiante está mirando una semana concreta, esa semana pesa más.
  const boosted = base
    .map((hit) => {
      const chunk = byId.get(hit.doc.id);
      const bonus = options.week && chunk?.week === options.week ? 1.2 : 0;
      return { hit, chunk, score: hit.score + bonus };
    })
    .filter((entry): entry is { hit: typeof base[number]; chunk: KnowledgeChunk; score: number } => Boolean(entry.chunk))
    .sort((a, b) => b.score - a.score);

  const sources: AgentSource[] = boosted.slice(0, maxSources).map(({ hit, chunk, score }) => ({
    id: chunk.id,
    title: chunk.title,
    url: chunk.url,
    course: chunk.course,
    ...(chunk.week ? { week: chunk.week } : {}),
    kind: chunk.kind,
    quote: quoteFrom(chunk, hit.matched),
    score: Number(score.toFixed(3))
  }));

  return { sources, insufficient: sources.length === 0 };
}

export { normalize };
