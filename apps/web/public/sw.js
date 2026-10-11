/* secure T · service worker
 *
 * Estrategia: primero el caché. El campus se puede usar entero sin conexión,
 * que es una promesa del proyecto desde su primera versión (P3 del contrato).
 * No se cachea nada que pueda contener datos del estudiante: el expediente vive
 * en `localStorage` y nunca cruza la red.
 *
 * El sitio se publica en una subcarpeta (`/app` en GitHub Pages), así que todas
 * las rutas se construyen a partir de la ubicación real del propio service
 * worker: cachear `/pt` cuando la web vive en `/app/pt` no guardaba nada.
 */

const VERSION = "secure-t-v2";
const BASE = self.location.pathname.replace(/\/sw\.js$/, "");

/** Ruta absoluta dentro del despliegue real. */
const ruta = (camino) => `${BASE}${camino}`;

const SHELL = [
  "/",
  "/pt",
  "/es",
  "/en",
  "/ca",
  "/programas",
  "/pt/programas",
  "/agente",
  "/pt/agente",
  "/calendario",
  "/pt/calendario",
  "/progreso",
  "/pt/progreso",
  "/repaso",
  "/pt/repaso",
  "/estandares",
  "/pt/estandares",
  "/privacidad",
  "/pt/privacidad",
  "/credencial",
  "/pt/credencial",
  "/amenazas",
  "/pt/amenazas",
  "/content/catalog.json",
  "/content/knowledge.json",
  "/manifest.webmanifest"
].map(ruta);

const PREFIJOS_CACHEABLES = ["/content/", "/campus/", "/voice/", "/_next/static/"].map(ruta);

const esRecursoEstatico = (pathname) =>
  PREFIJOS_CACHEABLES.some((prefijo) => pathname.startsWith(prefijo)) || pathname.includes("/_next/static/");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) =>
        Promise.all(
          SHELL.map((path) => cache.add(new Request(path, { cache: "reload" })).catch(() => undefined))
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

/** Última red de seguridad: la portada guardada, o un error de red honesto. */
async function respuestaSinRed() {
  const cache = await caches.open(VERSION);
  return (await cache.match(ruta("/pt"))) || (await cache.match(ruta("/"))) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // El endpoint del agente jamás se cachea: cada pregunta es una pregunta.
  if (url.pathname.endsWith("/api/agent")) return;

  const estatico = esRecursoEstatico(url.pathname);

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        event.waitUntil(
          fetch(request)
            .then((response) => {
              if (!response.ok) return undefined;
              return caches.open(VERSION).then((cache) => cache.put(request, response.clone()));
            })
            .catch(() => undefined)
        );
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (response.ok && estatico) {
            const copy = response.clone();
            event.waitUntil(caches.open(VERSION).then((cache) => cache.put(request, copy)));
          }
          return response;
        })
        .catch(() => respuestaSinRed());
    })
  );
});
