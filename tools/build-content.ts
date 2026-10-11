/**
 * Generador de contenido del campus elevado.
 *
 * Lee el material **publicado** en `campus/` (una sola fuente de verdad: el
 * mismo Markdown que valida pytest) y emite:
 *
 *   apps/web/public/content/catalog.json    → catálogo, semanas y artefactos
 *   apps/web/public/content/knowledge.json  → corpus para el agente IA y el buscador
 *   apps/web/public/content/digest.txt      → SHA-256 del material indexado
 *
 * Uso:  npx tsx tools/build-content.ts
 *
 * No hay segunda copia del contenido: las páginas de semana leen el Markdown
 * del repositorio en tiempo de build (export estático) y lo renderizan.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { firstHeading, renderMarkdown, splitSections, toPlainText, type KnowledgePack } from "../packages/shared/src/index";

const ROOT = resolve(import.meta.dirname, "..");
const CAMPUS = join(ROOT, "campus");
const OUT = join(ROOT, "apps", "web", "public", "content");

type ArtifactKind = "syllabus" | "lab" | "rubric" | "glossary" | "cheatsheet" | "exam" | "resources" | "calendar";

const ARTIFACTS: { file: string; kind: ArtifactKind; title: string }[] = [
  { file: "syllabus.md", kind: "syllabus", title: "Programa" },
  { file: "laboratorio.md", kind: "lab", title: "Laboratorio" },
  { file: "rubrica.md", kind: "rubric", title: "Rúbrica" },
  { file: "glosario.md", kind: "glossary", title: "Glosario" },
  { file: "chuleta.md", kind: "cheatsheet", title: "Chuleta" },
  { file: "examen.md", kind: "exam", title: "Examen final" },
  { file: "recursos.md", kind: "resources", title: "Recursos" }
];

interface WeekSummary {
  index: number;
  title: string;
  slack: string;
  sections: string[];
  words: number;
  hash: string;
}

interface CourseSummary {
  slug: string;
  title: string;
  summary: string;
  hours: number;
  weeks: WeekSummary[];
  quizCount: number;
  artifacts: { kind: ArtifactKind; title: string; words: number; hash: string }[];
  url: string;
  source: string;
}

const PROGRAM_TITLES: Record<string, string> = {
  "ciber-ofensiva": "Ciberseguridad Ofensiva: Pensar como Atacante",
  "ciber-defensiva": "Ciberseguridad Defensiva: Operar como SOC",
  "ia-aplicada-segura": "Inteligencia Artificial Aplicada y Segura",
  "gobernanza-compliance": "Gobernanza y Compliance Digital"
};

const PROGRAM_SUMMARIES: Record<string, string> = {
  "ciber-ofensiva":
    "Ética y legalidad desde el día 1, reconocimiento pasivo y OSINT, OWASP Top 10 y laboratorio final con informe de hallazgos reproducibles.",
  "ciber-defensiva":
    "Tríada CIA, telemetría y logs, mini-SOC con herramientas abiertas, respuesta a incidentes NIST 800-61 y hardening verificable con matriz CIS.",
  "ia-aplicada-segura":
    "Fundamentos de aprendizaje automático, LLM y prompting responsable, ataques adversarios, RAG seguro y salvaguardas medibles.",
  "gobernanza-compliance":
    "ISO 27001, NIST CSF y ENS, protección de datos con minimización extrema, gestión de riesgos y evidencia de control."
};

const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

function sortedFiles(dir: string): string[] {
  return readdirSync(dir)
    .filter((name) => !name.startsWith("."))
    .sort()
    .flatMap((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() ? sortedFiles(full) : [full];
    });
}

const chunks: KnowledgePack["chunks"] = [];
const courses: CourseSummary[] = [];
const digestParts: string[] = [];

const courseDirs = readdirSync(join(CAMPUS, "cursos"))
  .filter((name) => statSync(join(CAMPUS, "cursos", name)).isDirectory())
  .sort();

for (const slug of courseDirs) {
  const dir = join(CAMPUS, "cursos", slug);
  const title = PROGRAM_TITLES[slug] ?? slug;
  const summary = PROGRAM_SUMMARIES[slug] ?? "";
  const weekFiles = readdirSync(dir)
    .filter((name) => /^semana-\d{2}\.md$/.test(name))
    .sort();

  const weeks: WeekSummary[] = [];
  for (const file of weekFiles) {
    const index = Number(/semana-(\d{2})\.md/.exec(file)?.[1] ?? 0);
    const markdown = readFileSync(join(dir, file), "utf8");
    digestParts.push(`${slug}/${file}:${sha256(markdown)}`);
    const plain = toPlainText(markdown);
    const sections = splitSections(markdown, 2);
    const heading = firstHeading(markdown) ?? `Semana ${index}`;
    const weekTitle = heading.replace(/^Semana\s+\d+\s*[:·-]\s*/i, "").trim() || heading;

    weeks.push({
      index,
      title: weekTitle,
      slack: plain.replace(/\s+/g, " ").slice(0, 240),
      sections: sections.map((section) => section.title),
      words: plain.split(/\s+/).filter(Boolean).length,
      hash: sha256(markdown).slice(0, 16)
    });

    chunks.push({
      id: `${slug}/week-${String(index).padStart(2, "0")}`,
      course: slug,
      courseTitle: title,
      week: index,
      kind: "week",
      title: `Semana ${index} — ${weekTitle}`,
      text: plain.slice(0, 1800),
      source: `campus/cursos/${slug}/${file}`,
      url: `/campus/${slug}/semana/${index}`
    });
  }

  const artifacts: CourseSummary["artifacts"] = [];
  for (const artifact of ARTIFACTS) {
    let markdown: string;
    try {
      markdown = readFileSync(join(dir, artifact.file), "utf8");
    } catch {
      continue;
    }
    digestParts.push(`${slug}/${artifact.file}:${sha256(markdown)}`);
    const plain = toPlainText(markdown);
    artifacts.push({
      kind: artifact.kind,
      title: artifact.title,
      words: plain.split(/\s+/).filter(Boolean).length,
      hash: sha256(markdown).slice(0, 16)
    });
    chunks.push({
      id: `${slug}/${artifact.kind}`,
      course: slug,
      courseTitle: title,
      kind: artifact.kind,
      title: `${artifact.title} — ${title}`,
      text: plain.slice(0, 2400),
      source: `campus/cursos/${slug}/${artifact.file}`,
      url: `/campus/${slug}#${artifact.kind}`
    });
  }

  let quizCount = 0;
  try {
    const quiz = JSON.parse(readFileSync(join(dir, "quiz.json"), "utf8")) as unknown[];
    quizCount = quiz.length;
    digestParts.push(`${slug}/quiz.json:${sha256(JSON.stringify(quiz))}`);
  } catch {
    quizCount = 0;
  }

  courses.push({
    slug,
    title,
    summary,
    hours: 60,
    weeks,
    quizCount,
    artifacts,
    url: `/campus/${slug}`,
    source: `campus/cursos/${slug}/`
  });
  console.log(`· ${slug}: ${weeks.length} semanas, ${artifacts.length} artefactos, quiz ${quizCount}`);
}

// Cápsulas y conceptos propios también alimentan al agente (material del campus).
try {
  const capsulas = sortedFiles(join(CAMPUS, "capsulas"));
  for (const file of capsulas.slice(-30)) {
    const markdown = readFileSync(file, "utf8");
    digestParts.push(`capsulas/${relative(join(CAMPUS, "capsulas"), file)}:${sha256(markdown)}`);
    const plain = toPlainText(markdown);
    chunks.push({
      id: `capsula/${relative(join(CAMPUS, "capsulas"), file).replace(/\.md$/, "")}`,
      course: "capsulas",
      courseTitle: "Cápsulas diarias",
      kind: "concept",
      title: `Cápsula ${relative(join(CAMPUS, "capsulas"), file).replace(/\.md$/, "")}`,
      text: plain.slice(0, 700),
      source: `campus/capsulas/${relative(join(CAMPUS, "capsulas"), file)}`,
      url: "/campus"
    });
  }
} catch {
  console.warn("· sin cápsulas que indexar");
}

try {
  const concepts = JSON.parse(readFileSync(join(ROOT, "conceptos", "conceptos.json"), "utf8")) as {
    abrev: string;
    nombre: string;
    significado: string;
    categoria: string;
  }[];
  digestParts.push(`conceptos:${sha256(JSON.stringify(concepts))}`);
  for (const concept of concepts.slice(0, 400)) {
    chunks.push({
      id: `concepto/${concept.abrev}-${concept.nombre}`.toLowerCase().replace(/\s+/g, "-"),
      course: "conceptos",
      courseTitle: "Conceptos propios de secure T",
      kind: "concept",
      title: `${concept.abrev} — ${concept.nombre}`,
      text: `${concept.significado} (categoría: ${concept.categoria})`,
      source: "conceptos/conceptos.json",
      url: "/campus"
    });
  }
  console.log(`· conceptos: ${concepts.length}`);
} catch {
  console.warn("· sin conceptos que indexar");
}

const sourceDigest = sha256(digestParts.join("\n"));
const words = chunks.reduce((sum, chunk) => sum + chunk.text.split(/\s+/).filter(Boolean).length, 0);

const knowledge: KnowledgePack = {
  version: 1,
  generatedAt: new Date().toISOString(),
  sourceDigest,
  counts: { courses: courses.length, weeks: courses.reduce((sum, course) => sum + course.weeks.length, 0), chunks: chunks.length, words },
  chunks
};

const catalog = {
  version: 1,
  generatedAt: knowledge.generatedAt,
  sourceDigest,
  locale: "es",
  courses,
  totals: {
    courses: courses.length,
    weeks: courses.reduce((sum, course) => sum + course.weeks.length, 0),
    words: courses.reduce((sum, course) => sum + course.weeks.reduce((total, week) => total + week.words, 0), 0),
    quizItems: courses.reduce((sum, course) => sum + course.quizCount, 0)
  }
};

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "catalog.json"), `${JSON.stringify(catalog, null, 1)}\n`, "utf8");
writeFileSync(join(OUT, "knowledge.json"), `${JSON.stringify(knowledge)}\n`, "utf8");
writeFileSync(join(OUT, "digest.txt"), `${sourceDigest}\n`, "utf8");

console.log(`\n✔ ${chunks.length} fragmentos indexados · ${catalog.totals.words} palabras · ${catalog.totals.quizItems} ítems de quiz`);
console.log(`✔ digest ${sourceDigest.slice(0, 16)}… → apps/web/public/content/`);
console.log(`  catalog.json  ${(JSON.stringify(catalog).length / 1024).toFixed(1)} kB`);
console.log(`  knowledge.json ${(JSON.stringify(knowledge).length / 1024).toFixed(1)} kB`);

// El renderizador se usa también en tiempo de build: dejamos constancia de que
// el material es renderizable sin dependencias externas.
const sample = readFileSync(join(CAMPUS, "cursos", courseDirs[0], "semana-01.md"), "utf8");
const rendered = renderMarkdown(sample, { headingIds: true });
console.log(`✔ render de prueba: ${rendered.length} bytes de HTML seguro (semana 1 de ${courseDirs[0]})`);
