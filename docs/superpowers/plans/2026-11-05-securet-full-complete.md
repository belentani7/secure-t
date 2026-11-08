# secureT — Full Complete: Advanced Design, Functional, Multilingual

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir secureT en un producto completo: diseño avanzado (craft-floor), totalmente funcional, multilingüe (9 idiomas) y con más contenido que su README.

**Architecture:** Capa de i18n (proveedor + hook + archivos JSON por idioma) sobre el existente Vite+React 19+Tailwind 4. Pulido de UI por página siguiendo craft-floor (sin eyebrow, sin sección numérica, tracking ≤ -0.04em, radius 12-16px, contraste ≥4.5:1). Añadir contenido funcional real (labs, mentoría, portal del estudiante) en las páginas existentes. Todo verificado con typecheck + tests + build + seguridad.

**Tech Stack:** Vite + React 19 + TypeScript + Tailwind 4 + wouter + lucide-react + sonner. Tests: vitest. i18n: JSON + useTranslation hook (stdlib, sin dependencias nuevas).

**Spec:** PRODUCT.md + DESIGN.md (este repo).

## Global Constraints
- i18n: 9 idiomas (es, en, ca, fr, it, pt, de, nl, ja); es por defecto; persistencia en localStorage.
- No nuevas dependencias de npm para i18n (hook propio).
- craft-floor bans: no eyebrow/kicker, no sección numérica, no gradient text, no glass como decoración, tracking floor -0.04em, card radius 12-16px.
- Todo el copy traducido; placeholders honestos (no inventar datos de negocio).
- Verificación verde: `tsc --noEmit` exit 0, `vitest run` 54/54, `vite build` exit 0, `gitleaks` no leaks, `guard.py` limpio.

## Review Focus
- Traducción incompleta en algún componente → se rendería inglés por defecto (fallback explícito).
- Ruta cambiada sin actualizar SiteHeader → enlace roto.
- Nuevo texto en inglés sin agregar a JSON → se escapa del i18n.
- Cambio de diseño que rompe contraste en fondo oscuro → verificación visual por página.
- Archivo JSON de idioma mal formado → fallo en tiempo de ejecución al cambiar idioma.

---

### Task 1: i18n infraestructura (hook, provider, JSON base)

**Files:**
- Create: `client/src/lib/i18n.ts`
- Create: `client/src/locales/en.json`
- Create: `client/src/locales/es.json`
- Create: `client/src/locales/ca.json`
- Modify: `client/src/App.tsx` (envolver con I18nProvider)
- Test: `client/src/lib/__tests__/i18n.test.ts`

**Interfaces:**
- Consumes: nada (nueva capa).
- Produces: `useTranslation()` → `{ t, lang, setLang }`; `I18nProvider` componente.

- [ ] **Step 1: Write failing test** `i18n.test.ts` que verifica `t("header.title")` devuelve `"secureT"` en inglés y `"secureT"` en español (misma clave, distinto archivo).
- [ ] **Step 2: Run test** → FAIL (módulo no existe).
- [ ] **Step 3: Implement `i18n.ts`** con `createI18n(locales)` que devuelve provider + hook; soporte `ns` opcional; fallback a `en` si falta clave; `setLang` guarda en localStorage.
- [ ] **Step 4: Create `en.json` y `es.json`** con claves base: `app.name`, `header.campus`, `header.progress`, `header.mentor`, `header.student_portal`, `home.hero.title`, `home.hero.subtitle`, `home.btn.explore`, `home.btn.campus`, `footer.copyright`.
- [ ] **Step 5: Modify `App.tsx`** envolver `Router` dentro de `I18nProvider`.
- [ ] **Step 6: Run test** → PASS.
- [ ] **Step 7: Run `tsc --noEmit`** → exit 0.
- [ ] **Step 8: Commit**

### Task 2: i18n en SiteHeader y navegación

**Files:**
- Modify: `client/src/components/SiteHeader.tsx`
- Modify: `client/src/locales/en.json`, `es.json`, `ca.json`, `fr.json`, `it.json`, `pt.json`, `de.json`, `nl.json`, `ja.json`

**Interfaces:**
- Consumes: `useTranslation()` de `i18n.ts`.
- Produces: header con labels traducidos y selector de idioma.

- [ ] **Step 1: Write failing test** `SiteHeader.test.tsx` que renderiza con `es` y verifica que aparezca "Campus" traducido.
- [ ] **Step 2: Run test** → FAIL.
- [ ] **Step 3: Implement `SiteHeader.tsx`** con `useTranslation`; todas las etiquetas vía `t()`; añadir selector de idioma (9 opciones) en el área derecha del header.
- [ ] **Step 4: Agregar claves a los 9 JSON** de idioma.
- [ ] **Step 5: Run test** → PASS.
- [ ] **Step 6: Run `tsc --noEmit`** → exit 0.
- [ ] **Step 7: Commit**

### Task 3: i18n en Home (landing, modo Persuade)

**Files:**
- Modify: `client/src/pages/Home.tsx`
- Modify: `client/src/locales/*.json` (9 archivos)

**Interfaces:**
- Consumes: `useTranslation()`.
- Produces: Home completamente traducido (hero, programas, método, catálogo, comunidad).

- [ ] **Step 1: Escribir claves faltantes** en `en.json` y propagar a los otros 8 JSON.
- [ ] **Step 2: Reemplazar copy hardcodeado** en `Home.tsx` por `t("home.xxx")`.
- [ ] **Step 3: Run `tsc --noEmit`** → exit 0.
- [ ] **Step 4: Run `vitest run`** → 54/54.
- [ ] **Step 5: Commit**

### Task 4: i18n en Campus, Progress, Mentor, Portal, Notifications

**Files:**
- Modify: `client/src/pages/Campus.tsx`, `Progress.tsx`, `Mentor.tsx`, `Portal.tsx`, `Notifications.tsx`
- Modify: `client/src/locales/*.json` (9 archivos)

**Interfaces:**
- Consumes: `useTranslation()`.
- Produces: cada página con copy traducido y selector de idioma consistente.

- [ ] **Step 1: `Campus.tsx`** → `t()` en todo el copy visible.
- [ ] **Step 2: `Progress.tsx`** → `t()` en todo el copy visible.
- [ ] **Step 3: `Mentor.tsx`** → `t()` en todo el copy visible.
- [ ] **Step 4: `Portal.tsx`** → `t()` en todas las secciones (record, credentials, research, faculty, admin, settings).
- [ ] **Step 5: `Notifications.tsx`** → `t()` en todo el copy visible.
- [ ] **Step 6: Propagar claves a los 9 JSON.**
- [ ] **Step 7: Run `tsc --noEmit`** → exit 0.
- [ ] **Step 8: Run `vitest run`** → 54/54.
- [ ] **Step 9: Commit**

### Task 5: Pulido de diseño por craft-floor (Home)

**Files:**
- Modify: `client/src/pages/Home.tsx`
- Modify: `client/src/index.css` (si se requieren tokens nuevos)

**Interfaces:**
- Consumes: nada (refactor visual).
- Produces: Home sin eyebrow, sin sección numérica, tracking ≤ -0.04em, card radius 12-16px, contraste ≥4.5:1.

- [ ] **Step 1: Eliminar eyebrow/kicker** en todas las secciones de Home.
- [ ] **Step 2: Eliminar sección numérica** (01/02/03) salvo que la secuencia lleve información.
- [ ] **Step 3: Ajustar tracking** a -0.02/-0.03em donde sea -0.04em o más estrecho.
- [ ] **Step 4: Verificar card radius** 12-16px; pills solo controles pequeños.
- [ ] **Step 5: Verificar contraste** cuerpo ≥4.5:1, grande ≥3:1 en fondo oscuro.
- [ ] **Step 6: Run `tsc --noEmit`** → exit 0.
- [ ] **Step 7: Run `vite build`** → exit 0.
- [ ] **Step 8: Commit**

### Task 6: Pulido de diseño por craft-floor (Campus, Progress, Mentor, Portal, Notifications)

**Files:**
- Modify: `client/src/pages/Campus.tsx`, `Progress.tsx`, `Mentor.tsx`, `Portal.tsx`, `Notifications.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: todas las páginas cumplen craft-floor (sin eyebrow, sin sección numérica, radius, contraste, estados hover/disabled/loading/error/empty).

- [ ] **Step 1-5: Aplicar craft-floor** a cada página (eliminar eyebrow, sección numérica, ajustar tracking/radius/contraste, añadir estados vacíos y error reales).
- [ ] **Step 6: Run `tsc --noEmit`** → exit 0.
- [ ] **Step 7: Run `vitest run`** → 54/54.
- [ ] **Step 8: Run `vite build`** → exit 0.
- [ ] **Step 9: Commit**

### Task 7: Más contenido funcional más allá del README

**Files:**
- Modify: `client/src/pages/Campus.tsx` (labs reales con progreso)
- Modify: `client/src/pages/Mentor.tsx` (retroalimentación humana + recomendación IA)
- Modify: `client/src/pages/Portal.tsx` (contenido real por sección)
- Create: `client/src/lib/labs.ts` (datos de laboratorios)
- Modify: `client/src/locales/*.json` (9 archivos)

**Interfaces:**
- Consumes: `useTranslation()`.
- Produces: Campus con labs filtrables, Mentor con flujo de retroalimentación, Portal con contenido por sección.

- [ ] **Step 1: Crear `labs.ts`** con lista de labs (título, descripción, dificultad, progreso, enlace).
- [ ] **Step 2: `Campus.tsx`** → integrar labs como sección filtrable junto a cursos.
- [ ] **Step 3: `Mentor.tsx`** → añadir flujo de "pedir retroalimentación" con estados vacío/cargando/error.
- [ ] **Step 4: `Portal.tsx`** → contenido real por sección (record: historial; credentials: certificados; research: proyectos; faculty: equipo; admin: panel; settings: preferencias).
- [ ] **Step 5: Propagar claves a los 9 JSON.**
- [ ] **Step 6: Run `tsc --noEmit`** → exit 0.
- [ ] **Step 7: Run `vitest run`** → 54/54.
- [ ] **Step 8: Run `vite build`** → exit 0.
- [ ] **Step 9: Commit**

### Task 8: Verificación final y seguridad

**Files:**
- Test: `client/src/lib/__tests__/i18n.test.ts`, `client/src/components/__tests__/SiteHeader.test.tsx`

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: informe de verificación verde.

- [ ] **Step 1: Run `tsc --noEmit`** → exit 0.
- [ ] **Step 2: Run `vitest run`** → 54/54 passing.
- [ ] **Step 3: Run `vite build`** → exit 0.
- [ ] **Step 4: Run `gitleaks dir .`** → no leaks found.
- [ ] **Step 5: Run `guard.py --path .`** → árbol limpio.
- [ ] **Step 6: Commit final**
