# ADR-0001 · Un solo repositorio, dos campus

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el repositorio recibido publica un campus clásico estático (`index.html`, `campus/`, `ui/`) con 117
  tests que lo vigilan; el encargo pide una web mucho más ambiciosa con SSR, agente y cuatro idiomas.
- **Decisión:** conviven dos campus en el mismo repositorio. El clásico **no se toca** y se sigue publicando en la
  raíz del sitio; el nuevo (AURUM) vive en `apps/web/` y se publica bajo `/app/`.
- **Por qué:** renombrar o mover el campus clásico rompería enlaces externos, la matriz de idiomas y el contrato de
  tests. Publicar AURUM en `/app/` permite evolucionar sin pisar rutas (`/campus/…`, `/ui/…` siguen existiendo).
- **Alternativas descartadas:** sustituir el campus clásico (rompe el contrato y los enlaces); publicar AURUM en la
  raíz (obligaría a mover `campus/` y `ui/`, con riesgo real de romper 117 tests).
- **Consecuencias:** los dos estilos visuales conviven; el README explica cuál es cuál y los ADR siguientes fijan la
  identidad del nuevo.
