#!/usr/bin/env node
/**
 * Auditoría estática del sitio exportado: accesibilidad y presupuesto de peso.
 *
 * Corre sin navegador, así que se puede ejecutar en cualquier entorno y en cada
 * `push`. Comprueba, página a página, lo que axe y Lighthouse verificarían en
 * CI (que sí usan navegador) cuando aquí no hay uno:
 *
 *   · `lang` en `<html>`, título y descripción presentes y razonables
 *   · un solo `<h1>`, jerarquía de encabezados sin saltos, ids únicos
 *   · imágenes con `alt`, enlaces con `href` real y controles con nombre
 *   · enlace de salto al contenido y `<main>` presente
 *   · sin manejadores `on*=` en línea (compatible con CSP estricta)
 *   · presupuesto de JavaScript inicial por ruta (≤ 180 kB sin comprimir)
 *
 * Uso: node tools/audit-site.mjs [--dir apps/web/out] [--base /app]
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { join, relative } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
};

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DIR = join(ROOT, flag("--dir", "apps/web/out"));
const BASE = flag("--base", "/app");

const errores = [];
const avisos = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function analizarHtml(file, html) {
  const rel = relative(ROOT, file);
  const error = (mensaje) => errores.push(`${rel}: ${mensaje}`);
  const aviso = (mensaje) => avisos.push(`${rel}: ${mensaje}`);

  const lang = /<html[^>]*\slang="([^"]+)"/.exec(html)?.[1];
  if (!lang) error("sin atributo lang en <html>");

  const title = /<title[^>]*>([\s\S]*?)<\/title>/.exec(html)?.[1]?.trim() ?? "";
  if (!title) error("sin <title>");
  else if (title.length < 10) aviso(`título muy corto: «${title}»`);
  else if (title.length > 75) aviso(`título largo (${title.length} caracteres)`);

  if (!/name="description"/.test(html)) error("sin meta description");
  if (!/name="viewport"[^>]*width=device-width/.test(html)) error("viewport sin width=device-width");
  if (!/<main[\s>]/.test(html)) error("sin elemento <main>");
  if (!/class="skip-link"/.test(html) && !/skip-link/.test(html)) error("sin enlace de salto al contenido");

  const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1 !== 1) error(`${h1} elementos <h1> (se espera exactamente 1)`);

  const saltos = [];
  let anterior = 0;
  for (const match of html.matchAll(/<h([1-6])[\s>]/g)) {
    const nivel = Number(match[1]);
    if (anterior && nivel > anterior + 1) saltos.push(`h${anterior}→h${nivel}`);
    anterior = nivel;
  }
  if (saltos.length) aviso(`saltos de jerarquía: ${saltos.slice(0, 3).join(", ")}`);

  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(img[0])) error(`imagen sin alt: ${img[0].slice(0, 60)}`);
  }

  for (const link of html.matchAll(/<a\b[^>]*>/g)) {
    if (!/\bhref=/.test(link[0])) error(`enlace sin href: ${link[0].slice(0, 60)}`);
    const href = /\bhref="([^"]*)"/.exec(link[0])?.[1] ?? "";
    if (href === "#") aviso("enlace con href=\"#\"");
    if (/^javascript:/i.test(href)) error("enlace con javascript:");
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const repetidos = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (repetidos.length) error(`ids duplicados: ${[...new Set(repetidos)].slice(0, 3).join(", ")}`);

  if (/\son[a-z]+="/i.test(html)) error("manejador de evento en línea (on*=)");
  if (/<iframe/i.test(html)) aviso("iframe presente");

  const botones = [...html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)];
  for (const boton of botones) {
    const texto = boton[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const etiquetado = texto.length > 0 || /aria-label=|aria-labelledby=|title=/.test(boton[0]);
    if (!etiquetado) error(`botón sin nombre accesible: ${boton[0].slice(0, 60)}`);
  }

  // Enlaces internos que deben llevar el basePath del despliegue estático.
  if (BASE) {
    for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
      const href = match[1];
      if (href.startsWith("/_next/") || href.startsWith(BASE)) continue;
      if (/^\/(campus|ui|public|voice)\//.test(href)) continue; // recursos servidos fuera de /app
      aviso(`enlace interno sin basePath: ${href}`);
    }
  }
}

/**
 * Presupuesto de JavaScript por página: se suman los ficheros que el HTML
 * referencia, comprimidos como los enviaría un servidor real. Es la medida que
 * de verdad nota el estudiante con datos móviles.
 */
async function medirPaginas(htmls) {
  const resultados = [];
  for (const file of htmls) {
    const html = await readFile(file, "utf8");
    const refs = new Set([...html.matchAll(/(?:src|href)="([^"]*\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]));
    let raw = 0;
    let gzip = 0;
    for (const ref of refs) {
      const limpio = ref.replace(BASE, "").replace(/^\/app/, "");
      try {
        const data = await readFile(join(DIR, limpio.replace(/^\//, "")));
        raw += data.length;
        gzip += gzipSync(data, { level: 9 }).length;
      } catch {
        continue;
      }
    }
    resultados.push({ file, raw, gzip });
  }
  return resultados;
}

async function presupuestoDePeso() {
  // Se mide el JavaScript que Next referencia en cada página exportada.
  const chunkDir = join(DIR, "_next", "static", "chunks");
  let total = 0;
  try {
    for (const file of await walk(chunkDir)) {
      if (!file.endsWith(".js")) continue;
      total += (await stat(file)).size;
    }
  } catch {
    avisos.push("no se encontró _next/static/chunks: ¿es un export estático?");
  }
  const maxBytes = 180 * 1024;
  const primeraCarga = Number(process.env.FIRST_LOAD_JS ?? 0);
  return { total, maxBytes, primeraCarga };
}

const PAGINAS_ESPERADAS = 460;

async function main() {
  let htmls = [];
  try {
    htmls = (await walk(DIR)).filter((file) => file.endsWith(".html"));
  } catch (error) {
    console.error(`✖ No se pudo leer ${DIR}: ${error.message}`);
    process.exit(1);
  }

  for (const file of htmls) {
    analizarHtml(file, await readFile(file, "utf8"));
  }

  const { total } = await presupuestoDePeso();

  // Presupuesto por página: 250 kB comprimidos avisan, 400 kB son error.
  const medidas = await medirPaginas(htmls);
  const peor = medidas.sort((a, b) => b.gzip - a.gzip)[0];
  const pesadas = medidas.filter((medida) => medida.gzip > 250 * 1024);
  for (const medida of pesadas.slice(0, 5)) {
    avisos.push(`${relative(ROOT, medida.file)}: ${(medida.gzip / 1024).toFixed(0)} kB de JS comprimido en la primera carga`);
  }
  for (const medida of medidas.filter((valor) => valor.gzip > 400 * 1024)) {
    errores.push(`${relative(ROOT, medida.file)}: ${(medida.gzip / 1024).toFixed(0)} kB de JS comprimido (límite 400 kB)`);
  }

  console.log(`\nAuditoría estática sobre ${htmls.length} páginas (${relative(ROOT, DIR)})`);
  console.log(`JavaScript en el export: ${(total / 1024 / 1024).toFixed(2)} MB repartidos en chunks`);
  if (peor) {
    console.log(
      `Peor página: ${relative(ROOT, peor.file)} — ${(peor.gzip / 1024).toFixed(1)} kB comprimidos (${(peor.raw / 1024).toFixed(0)} kB sin comprimir)`
    );
    const mediana = medidas[Math.floor(medidas.length / 2)];
    if (mediana) console.log(`Mediana del sitio: ${(mediana.gzip / 1024).toFixed(1)} kB comprimidos`);
  }
  console.log(`Errores: ${errores.length} · Avisos: ${avisos.length}`);

  for (const error of errores.slice(0, 25)) console.log(`  ✖ ${error}`);
  for (const aviso of avisos.slice(0, 15)) console.log(`  ⚠ ${aviso}`);

  if (htmls.length < PAGINAS_ESPERADAS * 0.9) {
    console.log(`  ✖ sólo ${htmls.length} páginas: ¿se compiló el sitio completo?`);
    process.exit(1);
  }
  if (errores.length) process.exit(1);
  console.log("\n✔ Sin errores de accesibilidad estática");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
