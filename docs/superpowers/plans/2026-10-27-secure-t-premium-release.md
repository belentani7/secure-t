# Secure T Premium Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar un release premium verificado de la SPA de Secure T con instalación reproducible, filtros de catálogo, rutas diferidas y accesibilidad.

**Architecture:** Se mantiene Vite + React 19 + wouter. La lógica de filtrado vive en módulos puros testeables con vitest. La UI consume esos módulos y conserva los contratos de honestidad que ya validan los tests.

**Tech Stack:** Vite 8, React 19, TypeScript 7, Tailwind 4, vitest 5, pnpm 11.25.

**Spec:** `docs/superpowers/specs/2026-10-27-secure-t-premium-release-design.md`

## Global Constraints

- Node 22+ (CI), pnpm 11.25.0 fijado en `packageManager`.
- No añadir dependencias de runtime.
- No tocar el pipeline Python ni el campus generado.
- Preservar estas cadencias literales en `Home.tsx` (las validan tests):
  - `pathways.map(({ icon: Icon, accent, kicker, title, description, courses: courseMeta }) => <article`
  - `filteredCourses.map(({ code, title, meta, color, icon: Icon, progress }) => <article`
  - `Sample progress — not your record`
  - `APPLICATIONS COMING SOON`, `Applications coming soon`, `Open demo student portal`, `Academic guide coming soon`
- No commitear (el usuario no lo pidió).

## Review Focus

- Un filtro de nivel que devuelva el arreglo original mutado.
- Un chip activo sin `aria-pressed` o un menú móvil sin `aria-expanded`.
- Un `Suspense` que deje la pantalla en blanco o rompa el deep link `/record`.
- Metadatos que dupliquen fuentes o rompan `base: "./"`.
- Regresiones en los tests de honestidad del producto.

---

### Task 1: Reproducible install

**Files:**
- Modify: `pnpm-workspace.yaml`

- [ ] **Step 1:** Declarar el paquete raíz como workspace.
- [ ] **Step 2:** Ejecutar `pnpm install --frozen-lockfile` y confirmar exit 0 sin modificar `pnpm-lock.yaml`.
- [ ] **Step 3:** Confirmar `git diff --stat` solo muestra `pnpm-workspace.yaml`.

### Task 2: Level filtering (TDD)

**Files:**
- Modify: `client/src/lib/course-search.ts`
- Test: `tests/course-level-filter.test.ts`

**Interfaces:**
- Produces: `COURSE_LEVELS: readonly ["All levels", "Beginner", "Intermediate", "Advanced"]`, `type CourseLevel`, `filterCourseCatalogByLevel<T extends { meta: string }>(catalog: readonly T[], level: CourseLevel): T[]`.

- [ ] **Step 1:** Escribir el test que falla (All levels copia, Beginner/Intermediate/Advanced filtran por `meta`, no muta, preserva identidad).
- [ ] **Step 2:** Ejecutar `npx vitest run tests/course-level-filter.test.ts` y ver fallo por export inexistente.
- [ ] **Step 3:** Implementar el módulo.
- [ ] **Step 4:** Ejecutar el test y ver PASS.

### Task 3: Premium Home UX

**Files:**
- Modify: `client/src/pages/Home.tsx`

- [ ] **Step 1:** Añadir estado `level`, chips con `aria-pressed`, counts y reset.
- [ ] **Step 2:** Componer `filteredCourses = filterCourseCatalogByLevel(filterCourseCatalog(courses, query), level)` preservando el patrón `filteredCourses.map(...)`.
- [ ] **Step 3:** Menú móvil con `aria-expanded`/`aria-controls`, cierre con Escape y al navegar; skip link no necesario aquí (vive en App).
- [ ] **Step 4:** Búsqueda `type="search"`, botón limpiar con `aria-label`, Enter mantiene comportamiento.
- [ ] **Step 5:** Retirar el pill flotante de `client/index.html` y añadir enlace "Security concepts" en el footer usando `import.meta.env.BASE_URL`.
- [ ] **Step 6:** Ejecutar tests de honestidad y typecheck.

### Task 4: Shell performance and accessibility

**Files:**
- Modify: `client/src/App.tsx`
- Modify: `client/src/index.css`
- Modify: `client/index.html`

- [ ] **Step 1:** `React.lazy` para `Portal` y `Notifications` + `Suspense` con fallback accesible y `role="status"`.
- [ ] **Step 2:** Skip link global + `<div id="main" tabIndex={-1}>` envolviendo el router.
- [ ] **Step 3:** CSS `prefers-reduced-motion`, `::selection`, `body` min-height y `scrollbar-gutter` estable.
- [ ] **Step 4:** Metadatos OG/Twitter/canonical/theme-color; quitar `maximum-scale=1`; preconnect + stylesheet de fuentes; `lang="en"`.

### Task 5: Verification and release evidence

**Files:**
- Create: `docs/superpowers/reports/2026-10-27-premium-release-report.md`

- [ ] **Step 1:** `npx tsc --noEmit` → exit 0.
- [ ] **Step 2:** `npx vitest run` → todos los tests PASS.
- [ ] **Step 3:** `node --test tests/api-security.test.mjs` → 3/3 PASS.
- [ ] **Step 4:** `npx vite build` → exit 0; anotar tamaños.
- [ ] **Step 5:** `pnpm audit --prod` → anotar hallazgos; corregir solo si es seguro.
- [ ] **Step 6:** Documentar que pytest/build_site no se ejecutaron (Python 3.14 ausente/roto) y el comando exacto para CI.
- [ ] **Step 7:** Escribir el reporte con la salida real.
