# ADR-0005 · Búsqueda propia (BM25) en lugar de fuse.js

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el campus clásico usa `fuse.js` vendorizado; el encargo pide independencia tecnológica y un agente
  que cite fragmentos.
- **Decisión:** `packages/shared/src/search.ts` implementa BM25 con tokenización y normalización propias
  (insensible a acentos para encontrar, sensible para resaltar). El `vendor/fuse.min.js` **se conserva** porque el
  campus clásico lo usa y un test exige su licencia.
- **Por qué:** se elimina una dependencia de terceros, se controla el ranking (título y título de sección pesan
  doble), se evita la carga de 70 kB en el navegador y el mismo índice sirve al buscador y al agente.
- **Alternativas descartadas:** mantener fuse.js en la capa nueva (duplicaba motores y empeoraba las citas);
  búsqueda por subcadenas (peor recuperación en cuatro idiomas).
- **Consecuencias:** los umbrales de recuperación (0.4 para citar, 0.2 para listar) están cubiertos por tests; el
  resaltado conserva los índices originales del texto para no romper tildes.
