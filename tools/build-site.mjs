#!/usr/bin/env node
/**
 * Ensambla el sitio completo en `_site/` con la misma lista blanca que usa el
 * workflow de Pages: nada de tests, nada de scripts y nada de material de
 * trabajo queda accesible por URL.
 *
 * Estructura:
 *   _site/index.html, _site/404.html      portada y error del campus clásico
 *   _site/campus/, _site/ui/              campus clásico y sus estilos/i18n
 *   _site/public/                         datos abiertos y .well-known
 *   _site/app/                            campus AURUM (export estático)
 *
 * Uso:
 *   node tools/build-site.mjs               # clásico + AURUM (compila la web)
 *   node tools/build-site.mjs --clasico     # sólo el campus clásico
 *   node tools/build-site.mjs --sin-web     # reutiliza un build previo de apps/web/out
 */

import { cp, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { join, relative } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const OUT = join(ROOT, "_site");
const args = new Set(process.argv.slice(2));

const WHITELIST = ["index.html", "404.html"];
const WHITELIST_DIRS = ["campus", "ui", "public"];

const PATTERNS_DE_SECRETOS = [
  /sk-[A-Za-z0-9]{20,}/,
  /ghp_[A-Za-z0-9]{30,}/,
  /AKIA[0-9A-Z]{16}/,
  /BEGIN [A-Z ]*PRIVATE KEY/
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

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

async function barreraDeSecretos(dir) {
  const files = await walk(dir);
  const textFiles = files.filter((file) => /\.(html|js|json|css|txt|xml|svg|md|mjs|ts)$/.test(file));
  const sospechosos = [];
  for (const file of textFiles) {
    const content = await (await import("node:fs/promises")).readFile(file, "utf8");
    if (PATTERNS_DE_SECRETOS.some((pattern) => pattern.test(content))) {
      sospechosos.push(relative(ROOT, file));
    }
  }
  if (sospechosos.length) {
    console.error("✖ Posible secreto en el sitio:", sospechosos.join(", "));
    process.exit(1);
  }
  console.log(`✔ Barrera anti-secretos: ${textFiles.length} ficheros de texto revisados`);
}

async function copiarClasico() {
  for (const file of WHITELIST) {
    const source = join(ROOT, file);
    if (await exists(source)) await cp(source, join(OUT, file));
  }
  for (const dir of WHITELIST_DIRS) {
    const source = join(ROOT, dir);
    if (!(await exists(source))) continue;
    if (dir === "public") {
      await mkdir(join(OUT, "public"), { recursive: true });
      await cp(source, join(OUT, "public"), { recursive: true });
    } else {
      await cp(source, join(OUT, dir), { recursive: true });
    }
  }
  console.log("✔ Campus clásico copiado (index.html, 404.html, campus/, ui/, public/)");
}

async function compilarAurum() {
  console.log("… compilando el campus AURUM como export estático (basePath /app)");
  await run("pnpm", ["--filter", "@secure-t/web", "build:pages"], {
    cwd: ROOT,
    env: { ...process.env, NEXT_OUTPUT: "export", NEXT_PUBLIC_BASE_PATH: "/app" },
    maxBuffer: 32 * 1024 * 1024
  });
}

async function copiarAurum() {
  const out = join(ROOT, "apps", "web", "out");
  if (!(await exists(out))) {
    console.error("✖ No existe apps/web/out: compila antes (pnpm --filter @secure-t/web build:pages)");
    process.exit(1);
  }
  await cp(out, join(OUT, "app"), { recursive: true });
  const files = await walk(join(OUT, "app"));
  console.log(`✔ Campus AURUM copiado en /app (${files.length} ficheros)`);
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await copiarClasico();

  if (!args.has("--clasico")) {
    if (!args.has("--sin-web")) await compilarAurum();
    await copiarAurum();
  }

  await writeFile(join(OUT, ".nojekyll"), "", "utf8");
  await barreraDeSecretos(OUT);

  const total = (await walk(OUT)).length;
  console.log(`\n✔ _site listo: ${total} ficheros`);
  console.log("  · raíz: campus clásico (index.html, campus/, ui/, public/)");
  console.log("  · /app: campus AURUM (SSR convertido a estático, cuatro idiomas)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// La firma del back, en el log de la compilacion: nunca en el HTML publicado.
console.log("\n  ->  A Pedro, para T.  -  el conocimiento pertenece a quien lo busca.\n");
