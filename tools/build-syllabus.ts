#!/usr/bin/env node
/**
 * Genera el material imprimible del campus desde la **fuente única** (`campus/`).
 *
 *   · `apps/web/public/plan/syllabus-<curso>.html` — programa completo listo para
 *     imprimir o guardar como PDF desde el navegador (A4, sin JavaScript, sin
 *     recursos externos: se abre desde un pendrive en un aula sin internet).
 *   · `apps/web/public/plan/syllabus.tex` — el mismo contenido en LaTeX, para
 *     quien quiera componerlo con su propia tipografía.
 *   · `apps/web/public/plan/indice.json` — huellas SHA-256 de todo lo generado,
 *     para poder comprobar que dos copias son idénticas.
 *
 * Por qué existe: prometimos «máximo frontend» y también «funciona desde el
 * disco». Un estudiante sin conexión tiene que poder llevarse el plan de las 20
 * semanas en papel. Nada de esto se escribe a mano: todo sale del Markdown real.
 *
 * Uso: `pnpm syllabus` (o `node --import tsx tools/build-syllabus.ts`).
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { firstHeading, renderMarkdown, splitSections, toPlainText } from "@secure-t/shared";

export interface GeneratedFile {
  path: string;
  bytes: number;
  sha256: string;
}

export interface SyllabusOptions {
  repoRoot?: string;
  outDir?: string;
  now?: Date;
}

const TEX_MAP: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "{": "\\{",
  "}": "\\}",
  "&": "\\&",
  "%": "\\%",
  "$": "\\$",
  "#": "\\#",
  "_": "\\_",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}"
};

/**
 * Escapa para LaTeX **en una sola pasada**.
 *
 * Importa el orden: si primero se sustituye la barra invertida y después las
 * llaves, la salida de la primera regla (`\textbackslash{}`) se vuelve a
 * escapar y el documento no compila. Una pasada por carácter con un mapa evita
 * ese error.
 */
export function latexEscape(text: string): string {
  return text.replace(/[\\{}&%$#_~^]/g, (char) => TEX_MAP[char] ?? char);
}

function findRepoRoot(start: string): string {
  let current = resolve(start);
  for (let depth = 0; depth < 6; depth += 1) {
    if (existsSync(join(current, "campus", "cursos"))) return current;
    const parent = resolve(current, "..");
    if (parent === current) break;
    current = parent;
  }
  throw new Error("No se encontró campus/cursos");
}

interface CourseSource {
  slug: string;
  title: string;
  summary: string;
  hours: number;
  weeks: { index: number; title: string; markdown: string; objectives: string[]; sections: string[]; words: number }[];
  syllabus: string;
  rubric: string;
  exam: string;
  glossary: string;
  resources: string;
}

function readCourse(root: string, slug: string): CourseSource {
  const dir = join(root, "campus", "cursos", slug);
  const read = (name: string) => {
    const path = join(dir, name);
    return existsSync(path) ? readFileSync(path, "utf8") : "";
  };

  const weeks = readdirSync(dir)
    .filter((name) => /^semana-\d+\.md$/.test(name))
    .map((name) => {
      const index = Number.parseInt(name.replace(/\D+/g, ""), 10);
      const markdown = readFileSync(join(dir, name), "utf8");
      const secciones = splitSections(markdown, 2);
      const objetivos = secciones.find((section) => /objetiv|objective/i.test(section.title));
      const title = (firstHeading(markdown) ?? `Semana ${index}`).replace(/^Semana\s+\d+\s*[:·-]\s*/i, "").trim();
      return {
        index,
        title,
        markdown,
        objectives: (objetivos?.body ?? "")
          .split("\n")
          .map((line) => line.replace(/^[-*+]\s*/, "").trim())
          .filter((line) => line.length > 3 && !line.startsWith("#")),
        sections: secciones.map((section) => section.title),
        words: toPlainText(markdown).split(/\s+/).filter(Boolean).length
      };
    })
    .sort((a, b) => a.index - b.index);

  const syllabus = read("syllabus.md");
  const summarySource = syllabus || weeks[0]?.markdown || "";
  const summary = toPlainText(summarySource).replace(/\s+/g, " ").trim().slice(0, 320);

  return {
    slug,
    title: (firstHeading(syllabus) ?? slug).replace(/^#\s*/, "").trim(),
    summary: summary.length > 240 ? `${summary.slice(0, 240)}…` : summary,
    hours: weeks.length * 6,
    weeks,
    syllabus,
    rubric: read("rubrica.md"),
    exam: read("examen.md"),
    glossary: read("glosario.md"),
    resources: read("recursos.md")
  };
}

const PRINT_CSS = `
:root { --ink: #0b0b0d; --gold: #8a6d1f; --line: #d8d2c2; }
* { box-sizing: border-box; }
body { margin: 0; padding: 2.4rem 2rem; background: #fff; color: var(--ink);
  font: 11.5pt/1.55 "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; }
h1, h2, h3 { font-family: "Helvetica Neue", Arial, sans-serif; line-height: 1.15; }
h1 { font-size: 2.1rem; margin: 0 0 .3rem; }
h2 { font-size: 1.28rem; margin: 2.2rem 0 .6rem; border-bottom: 2px solid var(--gold); padding-bottom: .25rem; }
h3 { font-size: 1.02rem; margin: 1.4rem 0 .4rem; }
p, li { max-width: 78ch; }
.meta { font: .78rem/1.5 ui-monospace, "SFMono-Regular", Menlo, monospace; color: #5d5748; text-transform: uppercase; letter-spacing: .08em; }
.cover { border: 3px double var(--gold); padding: 1.6rem 1.8rem; margin-bottom: 2rem; }
.cover h1 span { display: block; font-size: .82rem; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); margin-bottom: .4rem; }
table { width: 100%; border-collapse: collapse; margin: .8rem 0 1.4rem; font-size: .86rem; }
th, td { border: 1px solid var(--line); padding: .35rem .5rem; text-align: left; vertical-align: top; }
th { background: #f6f3e9; font-family: "Helvetica Neue", Arial, sans-serif; font-size: .74rem; text-transform: uppercase; letter-spacing: .06em; }
.week { break-inside: avoid; border-left: 3px solid var(--gold); padding-left: 1rem; margin: 1.6rem 0; }
.week h3 { margin-top: 0; }
ul { padding-left: 1.2rem; }
.tag { display: inline-block; border: 1px solid var(--line); border-radius: 999px; padding: .05rem .5rem; font: .68rem/1.4 ui-monospace, monospace; margin-right: .35rem; }
.foot { margin-top: 2.5rem; border-top: 1px solid var(--line); padding-top: .8rem; font-size: .8rem; color: #5d5748; }
a { color: var(--ink); }
.skip-link { position: absolute; left: -9999px; top: 0; background: #fff; color: var(--ink);
  border: 2px solid var(--gold); padding: .4rem .8rem; font: .8rem/1.4 ui-monospace, monospace; }
.skip-link:focus { left: .5rem; z-index: 10; }
@media print {
  body { padding: 0; font-size: 10.5pt; }
  .skip-link { display: none; }
  a { text-decoration: none; }
  .week { break-inside: avoid; }
  h2 { break-after: avoid; }
}
@page { size: A4; margin: 16mm 14mm 18mm; }
`.trim();

/** Documento imprimible de un curso completo. Sin recursos externos. */
export function syllabusHtml(course: CourseSource, meta: { generatedAt: string; digest: string; locale?: string }): string {
  const filas = course.weeks
    .map(
      (week) =>
        `<tr><td>${week.index}</td><td>${week.title}</td><td>${
          week.objectives.length > 0 ? week.objectives.length : "—"
        }</td><td>${week.words}</td></tr>`
    )
    .join("\n");

  const semanas = course.weeks
    .map(
      (week) => `<section class="week">
  <h3>Semana ${week.index} · ${week.title}</h3>
  <p class="meta">${week.words} palabras · ${week.sections.length} apartados</p>
  ${
    week.objectives.length
      ? `<p><strong>Objetivos</strong></p><ul>${week.objectives.map((objetivo) => `<li>${objetivo}</li>`).join("")}</ul>`
      : ""
  }
  <p><strong>Contenido</strong>: ${week.sections.join(" · ")}</p>
</section>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${course.title} · secure T</title>
<meta name="description" content="${course.summary}">
<style>${PRINT_CSS}</style>
</head>
<body>
<a class="skip-link" href="#main">Saltar al contenido</a>
<main id="main">
<header class="cover">
  <h1><span>secure T · instituto abierto de ciberseguridad e IA</span>${course.title}</h1>
  <p>${course.summary}</p>
  <p class="meta">${course.weeks.length} semanas · ${course.hours} horas estimadas · licencia MIT en el código · documento generado el ${
    meta.generatedAt.slice(0, 10)
  }</p>
  <p class="meta">huella del material: ${meta.digest.slice(0, 32)}</p>
</header>

<h2>Programa</h2>
<div class="prose">${renderMarkdown(course.syllabus, { headingOffset: 1 })}</div>

<h2>Plan de las ${course.weeks.length} semanas</h2>
<table>
<thead><tr><th>#</th><th>Semana</th><th>Objetivos</th><th>Palabras</th></tr></thead>
<tbody>
${filas}
</tbody>
</table>

<h2>Detalle por semana</h2>
${semanas}

<h2>Evaluación</h2>
<div class="prose">${renderMarkdown(course.rubric, { headingOffset: 1 })}</div>

<h2>Examen final</h2>
<div class="prose">${renderMarkdown(course.exam, { headingOffset: 1 })}</div>

<h2>Glosario</h2>
<div class="prose">${renderMarkdown(course.glossary, { headingOffset: 1 })}</div>

<h2>Recursos abiertos</h2>
<div class="prose">${renderMarkdown(course.resources, { headingOffset: 1 })}</div>

<footer class="foot">
  <p>Documento generado desde el material real del campus (fuente única). Sin cookies, sin cuentas y sin recursos externos: se puede imprimir, fotocopiar y compartir.</p>
  <p>secure T · belentani7/secure-t · licencia MIT para el código; el material didáctico conserva la licencia del repositorio original.</p>
</footer>
</main>
</body>
</html>
`;
}

/** Versión LaTeX del mismo programa, para componer con pdflatex/xelatex. */
export function syllabusTex(courses: CourseSource[], meta: { generatedAt: string; digest: string }): string {
  const cuerpo = courses
    .map(
      (course) => `\\section{${latexEscape(course.title)}}

\\noindent\\textit{${latexEscape(course.summary)}}

\\begin{tabular}{@{}rlrl@{}}
\\toprule
\\# & Semana & Objetivos & Palabras \\\\
\\midrule
${course.weeks
  .map(
    (week) =>
      `${week.index} & ${latexEscape(week.title)} & ${week.objectives.length || "--"} & ${week.words} \\\\`
  )
  .join("\n")}
\\bottomrule
\\end{tabular}

${course.weeks
  .map(
    (week) => `\\subsection{Semana ${week.index}: ${latexEscape(week.title)}}

${week.objectives.length ? `\\begin{itemize}\n${week.objectives.map((objetivo) => `  \\item ${latexEscape(objetivo)}`).join("\n")}\n\\end{itemize}` : ""}

\\noindent\\textit{Contenido:} ${week.sections.map((section) => latexEscape(section)).join("; ")}.
`
  )
  .join("\n")}
`
    )
    .join("\n\\clearpage\n");

  return `% secure T · programa completo (generado automáticamente desde campus/)
% Compilar con: pdflatex syllabus.tex  (dos pasadas)
\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[spanish]{babel}
\\usepackage[margin=2cm]{geometry}
\\usepackage{booktabs}
\\usepackage{hyperref}
\\hypersetup{colorlinks=true,urlcolor=blue!50!black}
\\title{secure T --- instituto abierto de ciberseguridad e inteligencia artificial}
\\author{belentani7/secure-t}
\\date{${meta.generatedAt.slice(0, 10)}}
\\begin{document}
\\maketitle
\\noindent\\textit{Huella del material de origen:} \\texttt{${meta.digest.slice(0, 48)}}
\\vspace{1em}
${cuerpo}
\\end{document}
`;
}

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** Genera todos los ficheros y devuelve su manifiesto. */
export function buildSyllabus(options: SyllabusOptions = {}): { files: GeneratedFile[]; outDir: string; digest: string } {
  const root = options.repoRoot ?? findRepoRoot(process.cwd());
  const outDir = options.outDir ?? join(root, "apps", "web", "public", "plan");
  const generatedAt = (options.now ?? new Date()).toISOString();

  const digestPath = join(root, "apps", "web", "public", "content", "digest.txt");
  const digest = existsSync(digestPath) ? readFileSync(digestPath, "utf8").trim() : "sin-digest";

  const slugs = readdirSync(join(root, "campus", "cursos"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const courses = slugs.map((slug) => readCourse(root, slug));
  const files: GeneratedFile[] = [];

  mkdirSync(outDir, { recursive: true });

  const escribir = (name: string, content: string) => {
    writeFileSync(join(outDir, name), content, "utf8");
    files.push({ path: name, bytes: Buffer.byteLength(content, "utf8"), sha256: sha256(content) });
  };

  escribir("syllabus.css", PRINT_CSS);
  escribir("syllabus.tex", syllabusTex(courses, { generatedAt, digest }));
  for (const course of courses) {
    escribir(`syllabus-${course.slug}.html`, syllabusHtml(course, { generatedAt, digest }));
  }

  const indice = {
    generatedAt,
    digest,
    courses: courses.map((course) => ({
      slug: course.slug,
      title: course.title,
      weeks: course.weeks.length,
      hours: course.hours,
      words: course.weeks.reduce((sum, week) => sum + week.words, 0)
    })),
    files
  };
  escribir("indice.json", JSON.stringify(indice, null, 2));

  return { files, outDir, digest };
}

// Ejecución directa (no cuando se importa desde los tests).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { files, outDir, digest } = buildSyllabus();
  const total = files.reduce((sum, file) => sum + file.bytes, 0);
  console.log(`\nProgramas imprimibles en ${outDir}`);
  for (const file of files) {
    console.log(`  ${file.path.padEnd(34)} ${(file.bytes / 1024).toFixed(1).padStart(7)} kB  ${file.sha256.slice(0, 12)}`);
  }
  console.log(`\n${files.length} ficheros · ${(total / 1024).toFixed(0)} kB · material de origen ${digest.slice(0, 16)}`);
}
