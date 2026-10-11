#!/usr/bin/env node
/**
 * Compila el campus AURUM como **export estático** para GitHub Pages.
 *
 * Por qué existe este script: el sitio estático no tiene servidor, así que la
 * ruta `src/app/api/agent/route.ts` no puede formar parte del build (Next la
 * rechaza en `output: export`). El agente no desaparece: en la versión estática
 * usa el motor que corre en el navegador, con el mismo contrato y la misma
 * auditoría. Ver ADR-0002.
 *
 * El script aparta la carpeta durante la compilación y la restaura siempre
 * (también si el build falla), para que el repositorio quede intacto.
 */

import { execFile } from "node:child_process";
import { rename, stat } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
/** Prefijo de GitHub Pages: el sitio se publica en /app, como en pages.yml. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/app";
const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const WEB = join(ROOT, "apps", "web");
const API = join(WEB, "src", "app", "api");
const API_APARTADA = join(WEB, ".api-oculta-en-export");

async function existe(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let apartada = false;
  if (await existe(API)) {
    if (await existe(API_APARTADA)) {
      throw new Error("Quedó una carpeta .api-oculta-en-export de un build anterior; revísala antes de continuar.");
    }
    await rename(API, API_APARTADA);
    apartada = true;
    console.log("· api/ apartada: el export estático no admite rutas de servidor");
  }

  try {
    await run("npx", ["next", "build"], {
      cwd: WEB,
      env: {
        ...process.env,
        NEXT_OUTPUT: "export",
        NEXT_PUBLIC_BASE_PATH: BASE,
        NEXT_TELEMETRY_DISABLED: "1"
      },
      maxBuffer: 32 * 1024 * 1024
    });
    console.log("✔ Export estático listo en apps/web/out");
  } finally {
    if (apartada) {
      await rename(API_APARTADA, API);
      console.log("· api/ restaurada (el repositorio queda como estaba)");
    }
  }
}

main().catch((error) => {
  console.error("✖ Falló el export estático:", error.message);
  process.exit(1);
});
