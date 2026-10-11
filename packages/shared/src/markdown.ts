/**
 * Renderizador de Markdown propio, seguro por construcción.
 *
 * Por qué no una dependencia: el campus publica material de terceros
 * (recursos abiertos, casos reales) y debe poder renderizarlo sin ejecutar
 * HTML arbitrario. Aquí **todo** se escapa primero y sólo después se aplican
 * las reglas de Markdown, así que no existe vía de inyección.
 *
 * Soporta: encabezados, párrafos, listas, tablas, citas, código, reglas
 * horizontales, enlaces, imágenes, negrita, cursiva, tachado y anclas.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SAFE_SCHEME = /^(https?:|mailto:|tel:)/i;

/** Sólo enlaces seguros: absolutos con esquema permitido, o relativos/ancla. */
export function safeUrl(url: string): string | null {
  const value = url.trim();
  if (!value) return null;
  if (value.startsWith("#") || value.startsWith("./") || value.startsWith("../") || value.startsWith("/")) return value;
  if (SAFE_SCHEME.test(value)) return value;
  return null;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function inline(text: string): string {
  let out = escapeHtml(text);
  const codes: string[] = [];

  // Bloques de código en línea: se protegen para que nada los transforme.
  out = out.replace(/`([^`]+)`/g, (_match, code: string) => {
    codes.push(code);
    return `\u0000${codes.length - 1}\u0000`;
  });

  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_match, alt: string, url: string) => {
    const href = safeUrl(url);
    return href ? `<img src="${href}" alt="${alt}" loading="lazy" decoding="async">` : alt;
  });

  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, url: string) => {
    const href = safeUrl(url);
    if (!href) return label;
    const external = /^https?:/i.test(href);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer nofollow"' : "";
    return `<a href="${href}"${attrs}>${label}</a>`;
  });

  out = out
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_\n]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])_([^_\n]+)_/g, "$1<em>$2</em>")
    .replace(/~~([^~\n]+)~~/g, "<del>$1</del>");

  return out.replace(/\u0000(\d+)\u0000/g, (_match, index: string) => `<code>${codes[Number(index)]}</code>`);
}

export interface RenderOptions {
  /** Añade `id` a los encabezados para poder enlazarlos. */
  headingIds?: boolean;
  /** Nivel al que desplazar los encabezados (útil al incrustar un fragmento). */
  headingOffset?: number;
}

export function renderMarkdown(markdown: string, options: RenderOptions = {}): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const html: string[] = [];
  const offset = options.headingOffset ?? 0;
  let index = 0;

  const pushList = (items: string[], ordered: boolean, start: number) => {
    if (!items.length) return;
    const tag = ordered ? "ol" : "ul";
    const startAttr = ordered && start !== 1 ? ` start="${start}"` : "";
    html.push(`<${tag}${startAttr}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`);
  };

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    // Código cercado
    if (/^```/.test(trimmed)) {
      const language = trimmed.slice(3).trim();
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !/^```/.test((lines[index] ?? "").trim())) {
        body.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      const langAttr = language ? ` class="language-${slugify(language)}"` : "";
      html.push(`<pre><code${langAttr}>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }

    // Regla horizontal
    if (/^([-*_])\1{2,}$/.test(trimmed)) {
      html.push("<hr>");
      index += 1;
      continue;
    }

    // Encabezados
    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = Math.min(6, heading[1].length + offset);
      const text = heading[2].replace(/\s+#+\s*$/, "");
      const id = options.headingIds === false ? "" : ` id="${slugify(text)}"`;
      html.push(`<h${level}${id}>${inline(text)}</h${level}>`);
      index += 1;
      continue;
    }

    // Tablas
    if (/^\|.+\|$/.test(trimmed) && /^\|[\s:|-]+\|$/.test((lines[index + 1] ?? "").trim())) {
      const parseRow = (row: string) =>
        row
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => cell.trim());
      const head = parseRow(trimmed);
      index += 2;
      const body: string[][] = [];
      while (index < lines.length && /^\|.+\|$/.test((lines[index] ?? "").trim())) {
        body.push(parseRow(lines[index] ?? ""));
        index += 1;
      }
      const headHtml = head.map((cell) => `<th scope="col">${inline(cell)}</th>`).join("");
      const bodyHtml = body
        .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
        .join("");
      html.push(`<div class="table-wrap"><table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`);
      continue;
    }

    // Cita
    if (/^>\s?/.test(trimmed)) {
      const body: string[] = [];
      while (index < lines.length && /^>\s?/.test((lines[index] ?? "").trim())) {
        body.push((lines[index] ?? "").trim().replace(/^>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote>${renderMarkdown(body.join("\n"), { headingIds: false })}</blockquote>`);
      continue;
    }

    // Listas
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*+]\s+/.test((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().replace(/^[-*+]\s+/, ""));
        index += 1;
      }
      pushList(items, false, 1);
      continue;
    }
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      const start = Number(/^(\d+)/.exec(trimmed)?.[1] ?? 1);
      while (index < lines.length && /^\d+[.)]\s+/.test((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().replace(/^\d+[.)]\s+/, ""));
        index += 1;
      }
      pushList(items, true, start);
      continue;
    }

    // Párrafo
    const paragraph: string[] = [];
    while (index < lines.length) {
      const candidate = (lines[index] ?? "").trim();
      if (
        !candidate ||
        /^(#{1,6})\s+/.test(candidate) ||
        /^```/.test(candidate) ||
        /^>\s?/.test(candidate) ||
        /^[-*+]\s+/.test(candidate) ||
        /^\d+[.)]\s+/.test(candidate) ||
        /^([-*_])\1{2,}$/.test(candidate) ||
        /^\|.+\|$/.test(candidate)
      ) {
        break;
      }
      paragraph.push(candidate);
      index += 1;
    }
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}

/**
 * Divide un Markdown en secciones por encabezado de nivel `level`.
 * Es la base del índice de lecciones que consumen la interfaz y el agente.
 */
export function splitSections(markdown: string, level = 2): { title: string; body: string }[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const pattern = new RegExp(`^#{${level}}\\s+(.*)$`);
  const sections: { title: string; body: string[] }[] = [];
  let current: { title: string; body: string[] } | null = null;
  for (const line of lines) {
    const match = pattern.exec(line.trim());
    if (match) {
      if (current) sections.push(current);
      current = { title: (match[1] ?? "").trim(), body: [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  if (current) sections.push(current);
  return sections.map((section) => ({ title: section.title, body: section.body.join("\n").trim() }));
}

/** Quita el marcado para obtener texto plano: títulos, resúmenes y búsqueda. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/\r\n?/g, "\n")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, "$1")
    .replace(/^\|.*\|$/gm, (row) => row.replace(/\|/g, " "))
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export function firstHeading(markdown: string): string | undefined {
  const match = /^\s{0,3}#{1,6}\s+(.+)$/m.exec(markdown);
  return match?.[1] ? toPlainText(match[1]).trim() : undefined;
}
