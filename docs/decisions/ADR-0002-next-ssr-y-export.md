# ADR-0002 · Next.js con SSR y export estático del mismo código

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el encargo pide «máxima tecnología» y render en servidor; la promesa P3 del contrato original exige
  un campus que funcione sin conexión y sin cuotas.
- **Decisión:** un solo código Next.js 16 que se compila de dos maneras: `next build` (servidor Node con
  `/api/agent`) y `NEXT_OUTPUT=export` (sitio estático subido a GitHub Pages bajo `/app/`).
- **Por qué:** SSR real donde hay servidor y HTML estático donde no lo hay, sin bifurcar la base de código. El
  agente funciona en ambos modos porque el motor corre también en el navegador.
- **Alternativas descartadas:** sólo SPA (peor SEO y sin SSR); sólo estático (sin endpoint de agente ni metadatos
  dinámicos); Astro (menos capacidades de framework para el panel interactivo).
- **Consecuencias:** la ruta `/api/agent` no existe en la exportación estática; está documentado en el propio
  fichero y en `CONTRATO_API.md`. Los tests de `quality.yml` corren contra la exportación estática, que es lo que
  ve el estudiante sin servidor.
