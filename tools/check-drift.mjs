#!/usr/bin/env node
/**
 * Comprueba que el contenido generado corresponde al material publicado.
 *
 * La comprobación anterior era `git diff --exit-code` sobre los ficheros
 * generados, y **fallaba siempre**: cada ejecución reescribe `generatedAt` con
 * la hora actual aunque el material no cambie. Lo que identifica a la fuente es
 * el `sourceDigest` (SHA-256 del material indexado), así que eso es lo que se
 * compara aquí, contra la versión que está en el último commit.
 *
 *   node tools/check-drift.mjs        # 0 = sincronizado, 1 = hay que regenerar
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(fileURLToPath(import.meta.url), "..", "..");
const FICHEROS = ["apps/web/public/content/catalog.json", "apps/web/public/content/knowledge.json"];

/** Campos que cambian en cada ejecución y no forman parte del material. */
const VOLATILES = new Set(["generatedAt"]);

function leerDeGit(ruta) {
  try {
    return JSON.parse(execFileSync("git", ["show", `HEAD:${ruta}`], { cwd: raiz, encoding: "utf8" }));
  } catch {
    return null;
  }
}

/** Compara dos documentos ignorando los campos volátiles de la raíz. */
function diferencias(actual, publicado, ruta = "") {
  const encontradas = [];
  const claves = new Set([...Object.keys(actual ?? {}), ...Object.keys(publicado ?? {})]);
  for (const clave of claves) {
    if (!ruta && VOLATILES.has(clave)) continue;
    const punto = ruta ? `${ruta}.${clave}` : clave;
    const a = actual?.[clave];
    const b = publicado?.[clave];
    if (a === b) continue;
    const sonObjetos = a && b && typeof a === "object" && typeof b === "object";
    if (sonObjetos) encontradas.push(...diferencias(a, b, punto));
    else encontradas.push(punto);
  }
  return encontradas;
}

const problemas = [];
for (const ruta of FICHEROS) {
  const absoluto = resolve(raiz, ruta);
  if (!existsSync(absoluto)) {
    problemas.push(`${ruta} no existe: ejecuta «pnpm content:all».`);
    continue;
  }
  const actual = JSON.parse(readFileSync(absoluto, "utf8"));
  const publicado = leerDeGit(ruta);
  if (!publicado) {
    problemas.push(`${ruta} no está en el último commit.`);
    continue;
  }
  const cambiados = diferencias(actual, publicado);
  if (cambiados.length) {
    problemas.push(`${ruta}: ${cambiados.length} campo(s) distintos (${cambiados.slice(0, 6).join(", ")})`);
  } else {
    console.log(`✔ ${ruta} coincide con el material publicado (sourceDigest ${String(actual.sourceDigest ?? "—").slice(0, 12)}…)`);
  }
}

if (problemas.length) {
  console.error("\n✖ El material cambió desde el último commit. Ejecuta «pnpm content:all» y commitea el resultado:");
  for (const problema of problemas) console.error(`  · ${problema}`);
  process.exit(1);
}

console.log("✔ Contenido generado en sincronía con el material publicado.");
