/**
 * Buscador propio (BM25) sobre el material del campus.
 *
 * Sustituye al fuse.js vendoreado del campus clásico **sin perder la promesa**:
 * buscar funciona sin conexión, sin dependencias y ahora también con
 * relevancia real (frecuencia inversa) y resaltado de coincidencias.
 */

export interface SearchDoc {
  id: string;
  title: string;
  text: string;
  url?: string;
  course?: string;
  week?: number;
  kind?: string;
}

export interface SearchHit<T extends SearchDoc = SearchDoc> {
  doc: T;
  score: number;
  /** Fragmento con la mejor coincidencia, para mostrar contexto. */
  excerpt: string;
  matched: string[];
}

export interface SearchIndex<T extends SearchDoc = SearchDoc> {
  docs: T[];
  tokens: Map<string, Map<number, number>>;
  lengths: number[];
  averageLength: number;
}

const STOPWORDS = new Set([
  // ES
  "de", "la", "el", "los", "las", "un", "una", "unos", "unas", "y", "o", "que", "en", "con", "por", "para", "del", "al", "se", "su", "sus", "es", "son", "como", "más", "mas", "pero", "sin", "sobre", "entre", "cuando", "donde", "este", "esta", "estos", "estas", "cada", "todo", "toda", "muy",
  // PT
  "da", "do", "das", "dos", "um", "uma", "uns", "umas", "e", "o", "os", "as", "que", "em", "com", "por", "para", "no", "na", "nos", "nas", "se", "seu", "sua", "são", "como", "mais", "mas", "sem", "sobre", "entre", "quando", "onde", "este", "esta", "cada", "muito",
  // EN
  "the", "a", "an", "of", "to", "in", "on", "for", "and", "or", "is", "are", "be", "with", "by", "from", "that", "this", "these", "those", "as", "at", "it", "its", "not", "but", "can", "will", "you", "your", "we", "our",
  // CA
  "el", "la", "els", "les", "un", "una", "uns", "unes", "i", "o", "que", "en", "amb", "per", "del", "al", "se", "són", "com", "més", "sense", "sobre", "entre", "quan", "on", "aquest", "aquesta", "cada", "tot"
]);

/** Normaliza texto: minúsculas y sin acentos, para buscar «practica» y «práctica». */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function tokenize(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token));
}

function termFrequency(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const token of tokens) map.set(token, (map.get(token) ?? 0) + 1);
  return map;
}

export function buildIndex<T extends SearchDoc>(docs: T[]): SearchIndex<T> {
  const tokens = new Map<string, Map<number, number>>();
  const lengths: number[] = [];
  docs.forEach((doc, position) => {
    // El título pesa más: se indexa dos veces.
    const docTokens = [...tokenize(doc.title), ...tokenize(doc.title), ...tokenize(doc.text)];
    lengths.push(docTokens.length || 1);
    for (const [term, count] of termFrequency(docTokens)) {
      const postings = tokens.get(term) ?? new Map<number, number>();
      postings.set(position, count);
      tokens.set(term, postings);
    }
  });
  const averageLength = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 1;
  return { docs, tokens, lengths, averageLength };
}

export interface SearchOptions {
  limit?: number;
  course?: string;
  kinds?: string[];
  /** Peso mínimo para considerar un resultado relevante. */
  minScore?: number;
}

export function search<T extends SearchDoc>(index: SearchIndex<T>, query: string, options: SearchOptions = {}): SearchHit<T>[] {
  const limit = options.limit ?? 10;
  const minScore = options.minScore ?? 0.15;
  const terms = [...new Set(tokenize(query))];
  if (!terms.length) return [];

  const { k1, b } = { k1: 1.5, b: 0.75 };
  const total = index.docs.length;
  const scores = new Map<number, number>();

  for (const term of terms) {
    const postings = index.tokens.get(term);
    if (!postings) continue;
    const df = postings.size;
    const idf = Math.log(1 + (total - df + 0.5) / (df + 0.5));
    for (const [position, frequency] of postings) {
      const doc = index.docs[position];
      if (!doc) continue;
      if (options.course && doc.course !== options.course) continue;
      if (options.kinds?.length && !options.kinds.includes(doc.kind ?? "")) continue;
      const length = index.lengths[position] ?? 1;
      const denominator = frequency + k1 * (1 - b + (b * length) / index.averageLength);
      scores.set(position, (scores.get(position) ?? 0) + idf * ((frequency * (k1 + 1)) / denominator));
    }
  }

  const normalizedQuery = normalize(query);
  const hits: SearchHit<T>[] = [];
  for (const [position, score] of scores) {
    const doc = index.docs[position];
    if (!doc) continue;
    // Bonus por frase exacta: quien escribe «zero trust» busca la frase.
    const phraseBonus = normalizedQuery.length > 4 && normalize(doc.text).includes(normalizedQuery) ? 0.6 : 0;
    const finalScore = score + phraseBonus;
    if (finalScore < minScore) continue;
    hits.push({ doc, score: Number(finalScore.toFixed(4)), excerpt: excerptFor(doc, terms), matched: terms });
  }

  return hits.sort((a, b2) => b2.score - a.score || a.doc.title.localeCompare(b2.doc.title)).slice(0, limit);
}

/** Fragmento centrado en la primera coincidencia, sin cortar palabras. */
export function excerptFor(doc: SearchDoc, terms: string[], radius = 130): string {
  const text = doc.text.replace(/\s+/g, " ").trim();
  if (!text) return "";
  const haystack = normalize(text);
  let position = -1;
  for (const term of terms) {
    const found = haystack.indexOf(term);
    if (found !== -1 && (position === -1 || found < position)) position = found;
  }
  if (position === -1) return text.slice(0, radius * 2).trim() + (text.length > radius * 2 ? "…" : "");
  const start = Math.max(0, position - radius);
  const end = Math.min(text.length, position + radius);
  const slice = text.slice(start, end).trim();
  return `${start > 0 ? "…" : ""}${slice}${end < text.length ? "…" : ""}`;
}

const ACCENT_CLASSES: Record<string, string> = {
  a: "[aáàâäã]",
  e: "[eéèêë]",
  i: "[iíìîï]",
  o: "[oóòôöõ]",
  u: "[uúùûü]",
  n: "[nñ]",
  c: "[cç]"
};

/**
 * Construye un patrón insensible a acentos: quien busca «telemetria» ve
 * resaltado «telemetría», y al contrario. No usa `normalize` sobre el texto
 * porque necesitamos conservar los índices originales para el resaltado.
 */
function accentInsensitivePattern(term: string): string {
  return [...term]
    .map((char) => ACCENT_CLASSES[char] ?? char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("");
}

/** Resalta los términos encontrados con `<mark>` sobre texto ya escapado. */
export function highlight(escapedText: string, terms: string[]): string {
  let output = escapedText;
  for (const term of terms) {
    if (term.length < 3) continue;
    const pattern = new RegExp(`(${accentInsensitivePattern(term)})`, "gi");
    output = output.replace(pattern, "<mark>$1</mark>");
  }
  return output;
}
