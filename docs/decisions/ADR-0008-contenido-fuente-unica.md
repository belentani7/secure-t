# ADR-0008 · Contenido como fuente única y digest de integridad

- **Estado:** aceptado (2026-10-11)
- **Contexto:** la web nueva necesita títulos, resúmenes, palabras y fragmentos; copiarlos a mano garantizaría
  desincronización con `campus/`.
- **Decisión:** `tools/build-content.ts` lee `campus/` y `conceptos/conceptos.json` y **genera** `catalog.json`,
  `knowledge.json` y `digest.txt` (SHA-256 del material). La web nunca escribe contenido: sólo lo lee.
- **Por qué:** una sola fuente de verdad, verificable: si el material cambia, el digest cambia y el workflow lo
  delata. Los tests comparan el recuento de fragmentos y palabras.
- **Alternativas descartadas:** base de datos de contenido (infraestructura innecesaria); CMS (idem, y rompe el
  funcionamiento sin conexión).
- **Consecuencias:** `pnpm content` es el primer paso de cualquier build; sin los ficheros generados la web avisa
  con un error explícito en lugar de mostrar una página vacía.
