import type { SourceRef } from "../core/contracts.js";

export type ContentKind = "document" | "lesson" | "module" | "quiz" | "flashcards" | "case-study" | "simulation" | "knowledge-map";
export interface ContentNode { id: string; kind: ContentKind; title: string; body: string; tags: string[]; prerequisites: string[]; sources: SourceRef[]; metadata: Record<string, unknown>; }
export interface ContentGraph { root: ContentNode; nodes: ContentNode[]; edges: Array<{ from: string; to: string; relation: "prerequisite" | "contains" | "tests" | "extends" | "references" }>; }

const id = (prefix: string, n: number) => `${prefix}_${n.toString(36)}`;

/** Deterministic first pass. AI can enrich this graph later; it should never erase provenance. */
export function buildLearningGraph(text: string, source: SourceRef): ContentGraph {
  const blocks = text.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
  const nodes: ContentNode[] = blocks.map((body, i) => ({
    id: id("n", i), kind: i === 0 ? "module" : "lesson", title: titleFrom(body, i), body,
    tags: keywords(body), prerequisites: i ? [id("n", i - 1)] : [], sources: [source], metadata: { generated: false },
  }));
  const root: ContentNode = { id: "root", kind: "module", title: "Learning module", body: "", tags: [], prerequisites: [], sources: [source], metadata: {} };
  return { root, nodes, edges: nodes.map(n => ({ from: root.id, to: n.id, relation: "contains" as const })).concat(nodes.slice(1).map((n, i) => ({ from: nodes[i].id, to: n.id, relation: "prerequisite" as const }))) };
}

export function transformKinds(graph: ContentGraph, kinds: ContentKind[]): ContentNode[] {
  return graph.nodes.flatMap((n, i) => kinds.map(kind => ({ ...n, id: `${n.id}_${kind}`, kind, title: `${n.title} — ${kind}`, metadata: { ...n.metadata, derivedFrom: n.id, transform: kind } })));
}

function titleFrom(text: string, i: number): string { const line = text.split("\n")[0].replace(/^#+\s*/, "").trim(); return line.slice(0, 100) || `Lesson ${i + 1}`; }
function keywords(text: string): string[] { return [...new Set((text.toLowerCase().match(/[a-záéíóúñ]{5,}/gi) ?? []).slice(0, 12))]; }
