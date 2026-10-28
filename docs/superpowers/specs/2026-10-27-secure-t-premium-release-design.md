# Secure T — Premium Release Design

**Fecha:** 2026-10-27
**Estado:** aprobado por el usuario ("lo más completo, exigente, bonito y seguro")
**Autor:** opencode + superpowers

## Intent

Convertir el vertical slice actual de Secure T en un release premium verificable:
instalación reproducible, carga inicial más rápida, navegación y catálogo
accesibles, y una revisión de seguridad/calidad con evidencia ejecutable.

No se afirma acreditación universitaria, persistencia productiva ni servicios
externos que el repositorio todavía no tiene. La honestidad del producto
(CTAs de demostración, ausencia de cuentas reales) es un requisito, no un
detalle.

## Goals

1. `pnpm install --frozen-lockfile` funciona sin flags y sin reescribir el lockfile.
2. La SPA reduce su bundle inicial separando rutas secundarias (`Portal`, `Notifications`).
3. El catálogo de cursos permite filtrar por nivel, además de buscar por texto.
4. Navegación móvil, skip link y controles cumplen patrones accesibles
   (`aria-expanded`, `aria-controls`, `aria-pressed`, foco visible, Escape).
5. El shell de la SPA tiene metadatos correctos (título, descripción, OG/Twitter,
   theme-color, canonical) y respeta `prefers-reduced-motion`.
6. Todas las comprobaciones disponibles en Windows pasan: `tsc`, `vitest`,
   `node --test tests/api-security.test.mjs`, `vite build` y `pnpm audit`.
7. Se documenta con evidencia lo que no se pudo ejecutar (pytest: Python roto).

## Non-goals

- Reescribir el campus estático generado por Python ni el motor `eduforge`.
- Conectar OIDC/Keycloak, PostgreSQL, Redis, S3/MinIO, OpenVoice o VAPID.
- Añadir un backend nuevo o persistencia considerada productiva.
- Publicar credenciales, secretos o datos personales.

## Anti-goals

- Un rediseño que rompa los tests de honestidad del producto.
- Convertir demos en promesas de producción.
- Añadir dependencias pesadas solo para "parecer premium".
- Cambios no verificables en el pipeline Python desde un entorno sin Python.

## Approaches considered

**A. Rediseño completo del campus estático + SPA (rechazado).**
Máximo impacto visual, pero el pipeline estático depende de Python, que no está
operativo aquí; no podríamos verificar pytest/build_site. Riesgo alto de romper
SEO, i18n y tests de contenido.

**B. Hardening + UX premium focalizado (elegido).**
Arreglar reproducibilidad, rendimiento inicial, accesibilidad y catálogo en la
SPA, que sí podemos verificar de extremo a extremo. Mantiene intactas las
garantías de honestidad y el campus público.

**C. Solo documentación/auditoría (rechazado).**
Bajo riesgo, pero no entrega el "build premium" que pidió el usuario.

## Decided parts

- **Filtro de nivel:** función pura en `client/src/lib/course-search.ts`,
  consumida por `Home.tsx`. Tests en `tests/course-level-filter.test.ts`.
- **Rutas secundarias perezosas:** `React.lazy` + `Suspense` en `App.tsx`
  solo para `Portal` y `Notifications`; `Home` queda eager para no penalizar LCP.
- **Shell accesible:** skip link global en `App.tsx`, `id="main"` con
  `tabIndex={-1}`; el `main` de Home conserva su landmark.
- **Metadatos:** `client/index.html` con OG/Twitter/canonical/theme-color y
  `viewport` sin `maximum-scale=1`; fuentes con `preconnect` + `display=swap`.
- **Movimiento:** bloque `@media (prefers-reduced-motion: reduce)` en
  `client/src/index.css`.
- **Enlace "Conceptos":** retirar el pill flotante sin estilos de `index.html`
  y exponerlo como enlace de footer dentro de la app.
- **Reproducibilidad:** `pnpm-workspace.yaml` declara `packages: ["."]`.

## Left to the builder

- Copy exacto de nuevas etiquetas (inglés consistente con Home).
- Tamaño/espaciado de los chips de filtro dentro del sistema CHROMA existente.
- Si en el futuro se habilita CSP estricta, hacerlo con un plugin de build y
  self-hosting de fuentes; no se añade una CSP parcial que rompa dev o el campus.
