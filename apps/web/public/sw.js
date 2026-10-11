/* secure T · service worker
 *
 * Estrategia: primero el caché. El campus se puede usar entero sin conexión,
 * que es una promesa del proyecto desde su primera versión (P3 del contrato).
 * No se cachea nada que pueda contener datos del estudiante: el expediente vive
 * en `localStorage` y nunca cruza la red.
 */

const VERSION = "secure-t-v1";
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
  "/content/catalog.json",
  "/credencial",
  "/pt/credencial",
  "/amenazas",
  "/pt/amenazas",
  "/content/catalog.json",
  "/content/knowledge.json",
  "/manifest.webmanifest"
];

const CACHEABLE_PREFIXES = ["/content/", "/campus/", "/voice/", "/_next/static/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) =>
        Promise.all(
          SHELL.map((path) =>
            cache.add(new Request(path, { cache: "reload" })).catch(() => undefined)
          )
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

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // El endpoint del agente jamás se cachea: cada pregunta es una pregunta.
  if (url.pathname.endsWith("/api/agent")) return;

  const isStatic = CACHEABLE_PREFIXES.some((prefix) => url.pathname.includes(prefix)) || url.pathname.startsWith("/_next/");

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        event.waitUntil(
          fetch(request)
            .then((response) => {
              if (response.ok) return caches.open(VERSION).then((cache) => cache.put(request, response.clone()));
              return undefined;
            })
            .catch(() => undefined)
        );
        return cached;
      }
      return fetch(request)
        .then((response) => {
          if (response.ok && isStatic) {
            const copy = response.clone();
            event.waitUntil(caches.open(VERSION).then((cache) => cache.put(request, copy)));
          }
          return response;
        })
        .catch(() => caches.match("/pt") || caches.match("/"));
    })
  );
});
