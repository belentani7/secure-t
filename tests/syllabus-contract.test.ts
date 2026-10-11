import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { buildSyllabus, latexEscape, syllabusHtml, syllabusTex } from "../tools/build-syllabus";

/**
 * Contrato de los programas imprimibles.
 *
 * El material de papel no se escribe a mano: se genera desde `campus/`. Estos
 * tests garantizan que el resultado sigue siendo **(a)** completo, **(b)**
 * imprimible sin conexión, **(c)** determinista y **(d)** verificable por huella.
 */

const outDir = mkdtempSync(join(tmpdir(), "secure-t-plan-"));
const AHORA = new Date("2026-10-11T00:00:00.000Z");
const resultado = buildSyllabus({ outDir, now: AHORA });
const indice = JSON.parse(readFileSync(join(outDir, "indice.json"), "utf8")) as {
  digest: string;
  courses: { slug: string; weeks: number; words: number }[];
  files: { path: string; bytes: number; sha256: string }[];
};

afterAll(() => {
  rmSync(outDir, { recursive: true, force: true });
});

describe("programas imprimibles", () => {
  it("genera los cuatro cursos con veinte semanas cada uno", () => {
    expect(indice.courses).toHaveLength(4);
    for (const course of indice.courses) {
      expect(course.weeks).toBe(20);
      expect(course.words).toBeGreaterThan(5_000);
    }
  });

  it("produce un HTML por curso, hoja de estilos, LaTeX e índice", () => {
    const nombres = indice.files.map((file) => file.path).sort();
    expect(nombres).toEqual([
      "syllabus-ciber-defensiva.html",
      "syllabus-ciber-ofensiva.html",
      "syllabus-gobernanza-compliance.html",
      "syllabus-ia-aplicada-segura.html",
      "syllabus.css",
      "syllabus.tex"
    ]);
    for (const file of indice.files) {
      expect(existsSync(join(outDir, file.path))).toBe(true);
    }
    // El manifiesto no se lista a sí mismo: un fichero no puede contener su
    // propia huella. Sí existe y sí se publica.
    expect(existsSync(join(outDir, "indice.json"))).toBe(true);
  });

  it("el índice lleva la huella real de cada fichero (integridad comprobable)", () => {
    for (const file of indice.files) {
      const contenido = readFileSync(join(outDir, file.path));
      const huella = createHash("sha256").update(contenido).digest("hex");
      expect(huella).toBe(file.sha256);
      expect(contenido.byteLength).toBe(file.bytes);
    }
    expect(indice.digest).toMatch(/^[0-9a-f]{8,}/);
  });

  it("cada programa es imprimible en A4 y no depende de la red", () => {
    for (const course of indice.courses) {
      const html = readFileSync(join(outDir, `syllabus-${course.slug}.html`), "utf8");
      expect(html).toContain("@page { size: A4");
      expect(html).toContain("break-inside: avoid");
      expect(html).not.toMatch(/<script/i);
      expect(html).not.toMatch(/<link[^>]+href="https?:/i);
      expect(html).not.toMatch(/<img[^>]+src="https?:/i);
      expect(html).toContain("Semana 20");
      expect(html.match(/class="week"/g)?.length).toBe(20);
      // Autocontenido: la hoja de estilos va incrustada, no enlazada.
      expect(html).toContain("<style>");
      expect(html).not.toContain('href="syllabus.css"');
    }
  });

  it("nombra la fuente y la fecha: nada de documentos sin procedencia", () => {
    const html = readFileSync(join(outDir, "syllabus-ciber-defensiva.html"), "utf8");
    expect(html).toContain("2026-10-11");
    expect(html).toContain("huella del material");
    expect(html).toContain("belentani7/secure-t");
  });

  it("es determinista: el mismo material y la misma fecha dan la misma huella", () => {
    const otra = mkdtempSync(join(tmpdir(), "secure-t-plan-"));
    const segundo = buildSyllabus({ outDir: otra, now: AHORA });
    const porNombre = (files: { path: string; sha256: string }[]) =>
      files.slice().sort((a, b) => a.path.localeCompare(b.path)).map((file) => `${file.path}:${file.sha256}`);
    expect(porNombre(segundo.files)).toEqual(porNombre(resultado.files));
    rmSync(otra, { recursive: true, force: true });
  });
});

describe("LaTeX", () => {
  it("escapa los caracteres que rompen una compilación", () => {
    expect(latexEscape("100% & 50% _ x #1 {a} ~ ^ \\")).toBe(
      "100\\% \\& 50\\% \\_ x \\#1 \\{a\\} \\textasciitilde{} \\textasciicircum{} \\textbackslash{}"
    );
  });

  it("el documento declara clase, márgenes y compilador", () => {
    const tex = readFileSync(join(outDir, "syllabus.tex"), "utf8");
    expect(tex).toContain("\\documentclass[10pt,a4paper]{article}");
    expect(tex).toContain("\\usepackage[margin=2cm]{geometry}");
    expect(tex).toContain("pdflatex");
    expect(tex).toContain("\\section{Ciberseguridad Ofensiva: Pensar como Atacante}");
    expect(tex.match(/\\subsection\{Semana/g)?.length).toBe(80);
  });

  it("escapa también dentro de la tabla y de las listas", () => {
    const cursoMinimo = {
      slug: "prueba",
      title: "Curso 100% & prueba_uno",
      summary: "Resumen con % y _ y &",
      hours: 6,
      weeks: [
        {
          index: 1,
          title: "Semana & 1",
          markdown: "# Semana 1\n",
          objectives: ["Objetivo 1 con 100% de cobertura", "Objetivo con guion_bajo"],
          sections: ["Teoría 50%", "Práctica & laboratorio"],
          words: 100
        }
      ],
      syllabus: "# Curso 100% & prueba_uno\n\nTexto con % y _.",
      rubric: "# Rúbrica\n\n30 % P1.",
      exam: "# Examen\n\nProyecto & defensa.",
      glossary: "# Glosario\n\nA: 1.",
      resources: "# Recursos\n\n- uno"
    };
    const tex = syllabusTex([cursoMinimo], { generatedAt: "2026-10-11T00:00:00.000Z", digest: "abc123" });
    // Sin `%` sueltos: fuera de los comentarios del preámbulo, todo `%` va escapado.
    const cuerpoTex = tex.split("\n").filter((line) => !line.trimStart().startsWith("%")).join("\n");
    expect(cuerpoTex).not.toMatch(/[^\\]%/);
    expect(tex).toContain("Curso 100\\% \\& prueba\\_uno");
    expect(tex).toContain("Semana \\& 1");
    expect(tex).toContain("Objetivo con guion\\_bajo");

    const html = syllabusHtml(cursoMinimo, { generatedAt: "2026-10-11T00:00:00.000Z", digest: "abc123" });
    expect(html).toContain("Curso 100% &amp; prueba");
    expect(html).toContain("Objetivo 1 con 100% de cobertura");
  });
});
