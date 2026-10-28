# Secure T — Premium Release Report

**Fecha:** 2026-10-27
**Alcance aprobado:** release más completo/seguro posible dentro de lo verificable.
**Repo:** `C:\Proyectos\_audit\repos\secure-t` (clon de `belentani7/secure-t`)
**Superpowers:** clonado en `C:\Proyectos\_audit\repos\superpowers` (v7.0.1) e instalado
en OpenCode en `C:\Users\USER\.config\opencode\node_modules\superpowers`.

## Resultado

Todas las comprobaciones disponibles en este equipo pasan. El bundle inicial de la
SPA bajó un 24,5% (gzip) al separar las rutas secundarias. El servidor Express ahora
sirve una CSP estricta y cabeceras de privacidad, verificado contra el build real.

## Cambios

### Reproducibilidad
- `pnpm-workspace.yaml`: `packages: ["."]`. Sin esto, pnpm 10/11 aborta con
  `packages field missing or empty`.
- `pnpm install --frozen-lockfile` ya funciona sin flags y sin reescribir el lockfile.

### Rendimiento
- `client/src/App.tsx`: `React.lazy` + `Suspense` para `Portal` y `Notifications`.
  `Home` sigue eager para no penalizar el LCP. Fallback `role="status"`.
- `client/index.html`: fuentes con `preconnect` + `display=swap` en el HTML;
  se eliminó el `@import` duplicado de `index.css`.

### Catálogo premium
- `client/src/lib/course-search.ts`: `COURSE_LEVELS`, `CourseLevel` y
  `filterCourseCatalogByLevel()` (puro, copia en "All levels", no muta).
- `client/src/pages/Home.tsx`: chips de nivel con `aria-pressed`, contadores,
  búsqueda `type="search"`, limpiar con botón/Escape y empty-state honesto según
  búsqueda + nivel.
- Se conservan literalmente los contratos de honestidad que validan los tests
  (`APPLICATIONS COMING SOON`, `Open demo student portal`,
  `Sample progress — not your record`, etc.).

### Accesibilidad
- `App.tsx`: skip link global + `#main` con `tabIndex={-1}`.
- Menú móvil: `aria-expanded`, `aria-controls="mobile-menu"`, cierre con Escape.
- `Portal.tsx`: `aria-pressed` en idiomas, `aria-label` en búsqueda y
  `document.documentElement.lang` sincronizado con el idioma elegido.
- `index.css`: `prefers-reduced-motion`, `::selection`, `min-height: 100dvh`.
- `client/index.html`: se quitó `maximum-scale=1`; `noscript` con ruta al campus.

### Seguridad
- `index.ts`: CSP estricta (`default-src 'self'`, `script-src 'self'`,
  `object-src 'none'`, `frame-ancestors 'none'`, allowlist solo para fuentes de
  Google), `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin`.
- Assets con caché inmutable 1 año; `index.html` con `no-cache`.
- `tests/api-security.test.mjs`: nuevo test que falla si la CSP o las cabeceras
  se debilitan.

### Copy / navegación
- Se retiró el pill flotante sin estilos de `client/index.html`; "Security
  concepts" pasa al footer de la app con `import.meta.env.BASE_URL`.

## Evidencia ejecutada

| Comprobación | Comando | Resultado |
|---|---|---|
| Instalación reproducible | `pnpm install --frozen-lockfile` | exit 0, lockfile intacto |
| TypeScript | `tsc --noEmit` | `TSC_EXIT=0` |
| Tests unitarios/contratos | `vitest run` | 9 archivos, **43/43 PASS** |
| API + CSP reales | `node --test tests/api-security.test.mjs` | **4/4 PASS** (`API_EXIT=0`) |
| Build producción | `vite build` | `BUILD_EXIT=0` |
| Dependencias | `pnpm audit --prod` | `No known vulnerabilities found` |
| Smoke del servidor | `GET /` en `dist/public` | 200, título correcto, CSP aplicada |
| Diff limpio | `git diff --stat` | 9 archivos, +199/−44 |

### Bundle (antes → después)

| Artefacto | Antes | Después |
|---|---|---|
| JS inicial | 372,50 kB / 115,89 kB gzip | **281,42 kB / 88,91 kB gzip** |
| CSS | 123,83 kB / 20,05 kB gzip | 125,25 kB / 20,28 kB gzip |
| Portal (lazy) | inline en el inicial | 10,70 kB / 3,70 kB gzip |
| Notifications (lazy) | inline en el inicial | 35,87 kB / 12,60 kB gzip |

## No verificado en este equipo (y por qué)

1. **pytest / build_site (campus estático):** el lanzador `py` apunta a
   `C:\Users\USER\AppData\Local\Programs\Python\Python314\python.exe`, que no
   existe. `python` no está en PATH. No se instaló software de sistema sin
   autorización.
   Comando para CI/equipo con Python:
   `python -m pytest -q tests/ && python scripts/build_site.py`
2. **E2E de navegador** (`tests/browser-*.cjs`, Playwright): Playwright no está
   instalado en el repo/equipo. Requiere `pnpm add -D playwright && npx playwright install`.
3. **Campus estático:** no se modificó para no romper un pipeline que no podemos
   ejecutar aquí (i18n, SEO, service worker, Python).

## Honestidad del producto

No se añadió autenticación real, persistencia productiva, acreditación ni
credenciales verificables. Los CTAs de admisión siguen en "coming soon" y el
portal sigue marcado como demostración. Este release es una mejora verificable
del vertical slice, no una promesa de producción.

## Nota operativa para OpenCode

El plugin de Superpowers se instaló en la configuración global y **requiere
reiniciar OpenCode** para cargarse. Después del reinicio se puede comprobar con
"Tell me about your superpowers". No se hizo commit (no fue solicitado).
