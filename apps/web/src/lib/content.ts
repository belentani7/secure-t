import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { firstHeading, renderMarkdown, splitSections, toPlainText } from "@secure-t/shared";

/**
 * Acceso al material del campus **en tiempo de build**.
 *
 * El campus clásico (`campus/`) sigue siendo la única fuente de verdad: aquí
 * sólo se lee y se renderiza con el renderizador seguro propio, de modo que
 * no existe una segunda copia del temario que pueda desincronizarse.
 */

export interface WeekSummary {
  index: number;
  title: string;
  slack: string;
  sections: string[];
  words: number;
  hash: string;
}

export interface CourseArtifact {
  kind: string;
  title: string;
  words: number;
  hash: string;
}

export interface CourseCatalogEntry {
  slug: string;
  title: string;
  summary: string;
  hours: number;
  /** Palabras del temario, sumadas de las veinte semanas. */
  words: number;
  weeks: WeekSummary[];
  quizCount: number;
  artifacts: CourseArtifact[];
  url: string;
  source: string;
}

export interface Catalog {
  version: number;
  generatedAt: string;
  sourceDigest: string;
  locale: string;
  courses: CourseCatalogEntry[];
  totals: { courses: number; weeks: number; words: number; quizItems: number };
}

function findRepoRoot(): string {
  let current = process.cwd();
  for (let depth = 0; depth < 6; depth += 1) {
    if (existsSync(join(current, "campus", "cursos"))) return current;
    const parent = resolve(current, "..");
    if (parent === current) break;
    current = parent;
  }
  throw new Error("No se encontró la carpeta campus/ del repositorio");
}

export function repoRoot(): string {
  return findRepoRoot();
}

export function campusDir(): string {
  return join(repoRoot(), "campus");
}

function findContentFile(name: string): string {
  const candidates: string[] = [process.cwd()];
  let current = process.cwd();
  for (let depth = 0; depth < 4; depth += 1) {
    const parent = resolve(current, "..");
    if (parent === current) break;
    current = parent;
    candidates.push(current);
  }
  const paths = candidates.flatMap((base) => [
    join(base, "public", "content", name),
    join(base, "apps", "web", "public", "content", name)
  ]);
  const found = paths.find((candidate) => existsSync(candidate));
  if (!found) throw new Error(`No se encontró ${name}. Ejecuta «pnpm content» antes de compilar.`);
  return found;
}

export function readCatalog(): Catalog {
  const raw = JSON.parse(readFileSync(findContentFile("catalog.json"), "utf8")) as Catalog;
  return {
    ...raw,
    courses: raw.courses.map((course) => ({
      ...course,
      words: course.weeks.reduce((sum, week) => sum + week.words, 0)
    }))
  };
}

export function courseBySlug(slug: string): CourseCatalogEntry | undefined {
  return readCatalog().courses.find((course) => course.slug === slug);
}

export function allCourses(): CourseCatalogEntry[] {
  return readCatalog().courses;
}

export interface WeekContent {
  index: number;
  title: string;
  markdown: string;
  html: string;
  sections: { title: string; body: string }[];
  words: number;
}

export function readWeek(slug: string, week: number): WeekContent | null {
  const file = join(campusDir(), "cursos", slug, `semana-${String(week).padStart(2, "0")}.md`);
  if (!existsSync(file)) return null;
  const markdown = readFileSync(file, "utf8");
  const heading = firstHeading(markdown) ?? `Semana ${week}`;
  return {
    index: week,
    title: heading.replace(/^Semana\s+\d+\s*[:·-]\s*/i, "").trim() || heading,
    markdown,
    // `headingOffset: 1`: el material empieza con «#», y la página ya tiene su `<h1>`.
    html: renderMarkdown(markdown, { headingIds: true, headingOffset: 1 }),
    sections: splitSections(markdown, 2),
    words: toPlainText(markdown).split(/\s+/).filter(Boolean).length
  };
}

export type ArtifactFile =
  | "syllabus.md"
  | "laboratorio.md"
  | "rubrica.md"
  | "glosario.md"
  | "chuleta.md"
  | "examen.md"
  | "recursos.md";

export function readArtifact(slug: string, file: ArtifactFile): { html: string; markdown: string } | null {
  const path = join(campusDir(), "cursos", slug, file);
  if (!existsSync(path)) return null;
  const markdown = readFileSync(path, "utf8");
  return { markdown, html: renderMarkdown(markdown, { headingIds: true, headingOffset: 1 }) };
}

export interface QuizItem {
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}

export function readQuiz(slug: string): QuizItem[] {
  const path = join(campusDir(), "cursos", slug, "quiz.json");
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf8")) as QuizItem[];
}

export interface KevEntry {
  cve_id: string;
  vendor: string;
  product: string;
  name: string;
  date_added: string;
  due_date: string;
  ransomware: string | boolean;
  cwes?: string[];
  short_description: string;
  required_action: string;
}

export interface NvdEntry {
  cve_id: string;
  published: string;
  score: number;
  attack_vector?: string;
  description: string;
  refs?: { url: string; tags?: string[] }[];
}

export interface ThreatIntel {
  generated_utc?: string;
  kev?: { catalog_version?: string; date_released?: string; total_count?: number; recent?: KevEntry[] };
  nvd_critical_recent?: NvdEntry[];
  stats?: {
    total_kev?: number;
    ransomware_linked?: number;
    ransomware_pct?: number;
    top_vendors?: { vendor: string; count: number }[];
  };
}

/** Catálogo de amenazas descargado por los scripts del repo (CISA KEV + NVD). */
export function readThreatIntel(): ThreatIntel {
  const path = join(campusDir(), "data", "threat-intel.json");
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8")) as ThreatIntel;
  } catch {
    return {};
  }
}

/**
 * Programa imprimible del curso, si el material de papel ya se ha generado
 * (`pnpm syllabus`). Se comprueba la existencia real: si no está, la interfaz
 * no ofrece un enlace roto.
 */
export function printPlanUrl(slug: string): string | null {
  const file = join(repoRoot(), "apps", "web", "public", "plan", `syllabus-${slug}.html`);
  return existsSync(file) ? `/plan/syllabus-${slug}.html` : null;
}

export function printPlanTex(): string | null {
  const file = join(repoRoot(), "apps", "web", "public", "plan", "syllabus.tex");
  return existsSync(file) ? "/plan/syllabus.tex" : null;
}

export interface PackageIndex {
  generatedAt: string;
  standards: Record<string, string>;
  courses: { slug: string; title: string; weeks: number; quizItems: number }[];
  files: { path: string; bytes: number; sha256: string }[];
  assets: { path: string; bytes: number; sha256: string }[];
}

/**
 * Índice de los paquetes interoperables (EPUB, SCORM, Common Cartridge, QTI,
 * xAPI). Si aún no se han generado, la página de estándares sigue explicando
 * qué cumple el campus y avisa de que los ficheros están pendientes.
 */
export function readPackages(): PackageIndex | null {
  const file = join(repoRoot(), "apps", "web", "public", "packages", "index.json");
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as PackageIndex;
  } catch {
    return null;
  }
}

export function buildStamp(): string {
  const catalog = readCatalog();
  return catalog.generatedAt.slice(0, 10);
}
