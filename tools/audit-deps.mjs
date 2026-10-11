#!/usr/bin/env node
/**
 * Auditoría de dependencias con lista blanca explícita.
 *
 * `pnpm audit` por sí solo no sirve como puerta de CI: o falla para siempre por
 * avisos sin parche publicado, o se ignora. Aquí cada aviso que se acepta está
 * escrito con su motivo, y **cualquier aviso nuevo rompe la construcción**. Si
 * un aviso aceptado cambia, se ve en el propio mensaje de error.
 *
 *   node tools/audit-deps.mjs [--json]
 *
 * Sin red no hay auditoría posible (el registro es la fuente de verdad), así que
 * la falta de red se trata como fallo, nunca como éxito silencioso.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Avisos aceptados: sin parche disponible y sin superficie real en este uso. */
const ACEPTADAS = [
  {
    ghsa: "GHSA-hp3w-g68c-fv3c",
    motivo:
      "sprintf-js no tiene versión parcheada (el aviso figura como «patched: <0.0.0»). " +
      "Entra sólo por la CLI de Lighthouse (@lhci/cli → js-yaml → argparse) y argparse " +
      "da formato a sus propios textos, nunca a cadenas de terceros. Herramienta de " +
      "desarrollo: no forma parte del sitio publicado."
  }
];

/** Sobrescrituras que deben seguir en pie; si alguien las quita, esto lo dice. */
const SOBRESCRITURAS_EXIGIDAS = ["tmp@<0.2.6", "basic-ftp@<6.2.1", "source-map-js@<1.2.2", "@puppeteer/browsers@<3.2.4"];

function leerAuditoria() {
  try {
    const salida = execFileSync("pnpm", ["audit", "--json"], {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"]
    });
    return JSON.parse(salida);
  } catch (error) {
    // `pnpm audit` sale con código 1 cuando encuentra avisos, y ahí la salida
    // JSON sigue siendo válida: se recoge del propio error.
    const salida = error && typeof error === "object" && "stdout" in error ? String(error.stdout) : "";
    if (salida.trim().startsWith("{")) return JSON.parse(salida);
    throw new Error(
      `No se pudo ejecutar «pnpm audit» (¿sin red o sin lockfile?). Sin datos no hay verificación: ${error instanceof Error ? error.message : error}`
    );
  }
}

const raiz = resolve(fileURLToPath(import.meta.url), "..", "..");
const paquete = JSON.parse(readFileSync(resolve(raiz, "package.json"), "utf8"));
const sobrescrituras = Object.keys(paquete.pnpm?.overrides ?? {});

const faltan = SOBRESCRITURAS_EXIGIDAS.filter((clave) => !sobrescrituras.includes(clave));
if (faltan.length) {
  console.error(`✖ Faltan sobrescrituras de seguridad en package.json: ${faltan.join(", ")}`);
  process.exit(1);
}

const informe = leerAuditoria();
const avisos = Object.values(informe.advisories ?? {});
const aceptados = [];
const nuevos = [];

for (const aviso of avisos) {
  const url = String(aviso.url ?? "");
  const aceptada = ACEPTADAS.find((entrada) => url.includes(entrada.ghsa));
  const rutas = (aviso.findings ?? []).flatMap((hallazgo) => hallazgo.paths ?? []);
  const ficha = {
    modulo: aviso.module_name,
    severidad: aviso.severity,
    titulo: aviso.title,
    vulnerable: aviso.vulnerable_versions,
    parcheado: aviso.patched_versions,
    rutas,
    ...(aceptada ? { motivo: aceptada.motivo } : {})
  };
  (aceptada ? aceptados : nuevos).push(ficha);
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ aceptados, nuevos }, null, 2));
} else {
  console.log(`Auditoría de dependencias: ${avisos.length} aviso(s) en el árbol.`);
  for (const aviso of aceptados) {
    console.log(`· Aceptado [${aviso.severidad}] ${aviso.modulo}: ${aviso.motivo}`);
  }
  for (const aviso of nuevos) {
    console.error(`✖ [${aviso.severidad}] ${aviso.modulo} ${aviso.vulnerable} → ${aviso.parcheado}`);
    console.error(`  ${aviso.titulo}`);
    console.error(`  ${aviso.rutas.slice(0, 3).join(" · ")}`);
  }
}

if (nuevos.length) {
  console.error(
    `\n${nuevos.length} aviso(s) sin justificar. Arregla la dependencia (sobrescritura, actualización) o añádelos a ACEPTADAS con su motivo.`
  );
  process.exit(1);
}

console.log("✔ Sin avisos nuevos sin justificar.");
