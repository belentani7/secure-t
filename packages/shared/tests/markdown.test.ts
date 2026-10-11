import { describe, expect, it } from "vitest";
import { escapeHtml, firstHeading, renderMarkdown, safeUrl, splitSections, toPlainText } from "../src/index";

describe("renderizador de Markdown seguro", () => {
  it("escapa HTML en lugar de ejecutarlo", () => {
    const html = renderMarkdown('Antes <script>alert("xss")</script> después');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("neutraliza enlaces peligrosos pero conserva el texto", () => {
    const html = renderMarkdown("[pulsa aquí](javascript:alert(1)) y [web](https://owasp.org)");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("pulsa aquí");
    expect(html).toContain('href="https://owasp.org"');
    expect(html).toContain('rel="noopener noreferrer nofollow"');
    expect(safeUrl("data:text/html,<script>")).toBeNull();
    expect(safeUrl("./semana-01.md")).toBe("./semana-01.md");
    expect(safeUrl("mailto:hola@owasp.org")).toBe("mailto:hola@owasp.org");
  });

  it("no permite escapar de un atributo con comillas", () => {
    const html = renderMarkdown('[x](https://ejemplo.test/" onmouseover="alert(1))');
    expect(html).not.toContain('onmouseover="alert');
    expect(html).toContain("&quot;");
  });

  it("renderiza la estructura real del material del campus", () => {
    const markdown = [
      "# Semana 1: Ética",
      "",
      "Párrafo con **negrita**, *cursiva* y `código`.",
      "",
      "## Objetivos",
      "",
      "- Uno",
      "- Dos",
      "",
      "1. Primero",
      "2. Segundo",
      "",
      "> Cita literal del estándar.",
      "",
      "| Campo | Valor |",
      "|---|---|",
      "| NIST | 800-61 |",
      "",
      "```bash",
      "nmap -sV objetivo",
      "```",
      "",
      "---"
    ].join("\n");
    const html = renderMarkdown(markdown, { headingIds: true });
    expect(html).toContain('<h1 id="semana-1-etica">');
    expect(html).toContain("<strong>negrita</strong>");
    expect(html).toContain("<em>cursiva</em>");
    expect(html).toContain("<code>código</code>");
    expect(html).toContain("<ul><li>Uno</li><li>Dos</li></ul>");
    expect(html).toContain("<ol>");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<table>");
    expect(html).toContain('<th scope="col">Campo</th>');
    expect(html).toContain('class="language-bash"');
    expect(html).toContain("<hr>");
  });

  it("divide el material en secciones para el índice y las citas", () => {
    const sections = splitSections("# Título\n\n## Objetivos\nAprender\n\n## Caso real\nUna empresa\n", 2);
    expect(sections.map((section) => section.title)).toEqual(["Objetivos", "Caso real"]);
    expect(sections[0].body).toBe("Aprender");
  });

  it("extrae texto plano para búsqueda y resúmenes", () => {
    const plain = toPlainText("## Título\n\n**Fuerte** y `code` con [enlace](https://owasp.org).\n\n|a|b|\n|---|---|\n|1|2|");
    expect(plain).toContain("Título");
    expect(plain).toContain("Fuerte y code con enlace.");
    expect(plain).not.toContain("**");
    expect(plain).not.toContain("https://");
  });

  it("encuentra el primer encabezado y escapa como es debido", () => {
    expect(firstHeading("texto\n\n# Semana 3: SIEM\nmás")).toBe("Semana 3: SIEM");
    expect(escapeHtml("<b>&'\"")).toBe("&lt;b&gt;&amp;&#39;&quot;");
  });
});
