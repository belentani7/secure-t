#!/usr/bin/env node
/**
 * Servidor estático mínimo para probar el export tal y como se publica.
 *
 * Reproduce lo que hace GitHub Pages: sirve ficheros de `_site` (o del
 * directorio que se le indique), resuelve `/app/…` y devuelve el 404 del sitio
 * cuando la ruta no existe. Sin dependencias: sólo `node:http`.
 *
 *   node tools/serve-static.mjs --port 4173 [--root _site]
 */

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const args = process.argv.slice(2);
const port = Number(args[args.indexOf("--port") + 1]) || 4173;
const rootIndex = args.indexOf("--root");
const root = resolve(rootIndex === -1 ? "_site" : args[rootIndex + 1] ?? "_site");

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".ics": "text/calendar; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

async function resolver(pathname) {
  const limpio = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const candidatos = [];
  if (limpio.endsWith("/")) candidatos.push(join(root, limpio, "index.html"));
  else {
    candidatos.push(join(root, limpio), join(root, `${limpio}.html`), join(root, limpio, "index.html"));
  }
  for (const candidato of candidatos) {
    try {
      const info = await stat(candidato);
      if (info.isFile()) return candidato;
    } catch {
      continue;
    }
  }
  return null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const file = await resolver(url.pathname);

  if (!file) {
    const notFound = join(root, "404.html");
    try {
      const info = await stat(notFound);
      if (info.isFile()) {
        response.writeHead(404, { "content-type": TIPOS[".html"] });
        createReadStream(notFound).pipe(response);
        return;
      }
    } catch {
      /* sin 404 personalizado */
    }
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("404");
    return;
  }

  response.writeHead(200, {
    "content-type": TIPOS[extname(file)] ?? "application/octet-stream",
    "cache-control": "public, max-age=0, must-revalidate"
  });
  createReadStream(file).pipe(response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`static: http://0.0.0.0:${port} (root: ${root})`);
});
