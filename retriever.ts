export type ApprovedSource = { id: string; title: string; uri: string; type: "curriculum" | "lesson" | "lab" | "policy" | "reference" };
export type RetrievalResult = ApprovedSource & { excerpt: string; score: number };
export type Retriever = { search(query: string, scope?: ApprovedSource["type"][]): Promise<RetrievalResult[]> };
export function emptyRetriever(): Retriever { return { async search() { return []; } }; }
export function sourceCitation(source: RetrievalResult) { return { sourceId: source.id, title: source.title, uri: source.uri, excerpt: source.excerpt, score: source.score }; }
