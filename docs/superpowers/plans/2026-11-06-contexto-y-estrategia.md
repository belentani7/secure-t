# secure-t — Contexto verificado y plan de ejecución (v3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar `secure-t` con gates reproducibles en verde (JS y Python), un solo sistema i18n en la SPA, traducciones honestas y craft-floor medido, sin destruir el trabajo sin commitear ni debilitar tests.

**Architecture:** Se estabiliza primero el pipeline y se convierten las auditorías (i18n, copy hardcoded, contraste) en herramientas versionadas. Después se cierra el test rojo sin tocar su contrato, se restauran los tests debilitados, se migra Portal al provider global y se aplica craft-floor con reglas completas de `DESIGN.md`. La traducción de los 6 idiomas que hoy son inglés copiado se trata como fase propia con revisión humana, no como "propagar claves".

**Tech Stack:** Vite 8.3.5 + React 19.3 + TypeScript 5.6 + Tailwind 4.3 + wouter 3.12 + vitest 5.0.5 + pytest 9.2.0 + Python 3.12.10 + Playwright MCP.

**Spec:** `PRODUCT.md`, `DESIGN.md`, `ESTADO-APLICACION.md`, `docs/superpowers/plans/2026-11-05-securet-full-complete.md`.

## Global Constraints

- Un proyecto a la vez: solo `secure-t`.
- Sin `commit`, `push`, `reset --hard`, `clean`, ramas ni PR sin autorización explícita.
- Sin cambios en el entorno global del harness (`AgentStorage\config\opencode`) dentro de este plan; van aparte y con aprobación (Task 0.5).
- No modificar tests para poner verde sin justificar que el test estaba mal.
- No reformatear archivos ajenos: hay 95 entradas sin commitear que son trabajo previo del usuario.
- **Alcance i18n por superficie** (hoy hay 4 sistemas):
  - SPA React (`client/src/locales`): **9 idiomas**.
  - Portal (`Portal.tsx`): debe migrar al sistema SPA.
  - Landing estática (`ui/institutional.js` + `index.html`): **3 idiomas (pt/es/en)**.
  - `ui/i18n.js`: **3 idiomas**, verificar si sigue en uso antes de tocarlo.
- **Política de traducción:** no se inventan traducciones. Nivel A = claves completas en `es`/`en` y las demás sin regresiones; Nivel B = 289 claves × 7 idiomas traducidas y revisadas. El plan no declara "9 idiomas completos" hasta Nivel B.
- craft-floor completo de `DESIGN.md`: sin eyebrow/kicker, sin sección numérica decorativa, sin gradient text, **sin glass/blur decorativo**, **sin border-left/right coloreado >1px**, **sin hard offset shadows**, tracking ≥ -0.04em, radius 12-16px cards / 18px contenedor, contraste ≥ 4.5:1.
- Antes de commit: `python C:\Users\USER\Documents\AgentStorage\tools\guard.py --staged .` en verde.
- Ninguna afirmación de "hecho" sin comando ejecutado y exit code citado.

## Baseline verificado (2026-11-06)

| Gate | Comando | Resultado real |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Vitest | `npx vitest run` | 12 files, 56/56, exit 0, 2.32s |
| Build | `npx vite build` | exit 0, 1970 módulos, 2.86s, main 121.82 kB gzip |
| Pytest (global) | `python -m pytest -q tests/` | exit 2, 9 errores de colección |
| Pytest (venv limpio) | `pytest 9.2.0 + pytest-asyncio 1.4.1.post1` | exit 1, **1 failed, 167 passed, 29.98s** |
| Aserciones del test rojo | `check_landing_assertions.py` | **2 de 30 fallan**: 6 `<section>` y `<script>` inline |
| Dry-run del fix de landing | `dryrun_fix.py` sobre copia temporal | **32/32 OK**, 5 `<section>`, `init.js` de 5.899 bytes |
| Sitio estático | `python scripts/build_site.py --destination <tmp>` | exit 0, 308 ficheros, 2.69 MB |
| Seguridad de plataforma | `node scripts/verify-platform-security.mjs` | exit 0, `PASS` |
| Secretos | `guard.py --path secure-t` | exit 0, árbol limpio |
| i18n paridad de claves | `check_translations.py` | 9 locales, 289 claves, 0 vacías |
| i18n traducción real | `check_translations.py` | **251/289 idénticas a `en` en ca/de/fr/pt; 252 en it/nl; 249 en ja (86-87%)** |
| i18n claves usadas | `audit_i18n.py` | **2 claves inexistentes** en `Home.tsx:51,59` |
| Árbol git | `git status --porcelain` | **95 entradas: 59 M, 36 ??** (incluye este plan) |
| Diff sin artefactos | `git diff --stat -- . ':(exclude)site-dist'` | 18 files changed, **716 insertions, 357 deletions** |

### Evidencia de navegador (Playwright, `localhost:5199`)

- Home renderiza literalmente el botón **`home.applications`** y el texto **`home.guide_coming`**.
- Home mezcla español e inglés: nav en ES, "Student portal", tarjetas de programa en inglés, "3 of 3 courses shown", "Sample progress — not your record".
- Mentor: H1 real **"Astra, your Mentor socrático."**
- Portal (`/record`): interfaz casi completa en inglés con `ES` seleccionado; título de pestaña en inglés.
- Consola: 1 error, `favicon.ico` 404. Sin errores de React.
- Capturas: `C:\Users\USER\AppData\Local\Temp\opencode\home-baseline.png` y `portal-baseline.png`.

## Decisiones resueltas (con experimento)

| Decisión | Evidencia | Resolución |
|---|---|---|
| ¿Actualizar `pytest-asyncio` o desactivarlo? | venv aislado: `pytest 9.2.0` + `pytest-asyncio 1.4.1.post1` → 0 errores de colección; `0.23.3` → 9 errores | **Actualizar y fijar** en `requirements-dev.txt` |
| ¿Añadir `home.applications` a 9 JSON? | `header.applications` ya existe traducida en los 9 | **Reutilizar `header.applications`** |
| ¿Añadir `home.guide_coming`? | `home.method.desc` ya dice "Academic guide coming soon" y se renderiza encima | **Eliminar el párrafo duplicado** |
| ¿Portal necesita `t()`? | `Portal.tsx:5-7` tiene `copy` de 3 idiomas y fuerza `lang="en"` al desmontar | **Migrar Portal al i18n global** |
| ¿`white/45` cumple contraste? | Sobre `#0b171d` **4.48:1**, sobre `#101d24` **4.46:1**, sobre `#0b1322` **4.50:1 exacto** | **Mínimo `/50`** en texto informativo |
| ¿El test de 5 secciones está mal? | Fallan 2 aserciones: 6 `<section>` y `<script>` inline | **Integrar el easter egg y extraer el script**; no tocar el test |
| ¿El widget Sonic funciona hoy? | `sonic-lock.js` define `window.SonicLock` en L202 y carga con `defer`; el init inline corre durante el parseo (L190) | **Bug real**: `SonicLock` es `undefined`; extraer el init con `defer` lo arregla |
| ¿El test de render necesita jsdom? | `vitest.config.ts` fija `environment: "node"`; no hay `jsdom` ni testing-library | **Añadir `jsdom` + testing-library** con `// @vitest-environment jsdom`, o degradar a aserción estática |
| ¿La paridad de claves es suficiente? | 251/289 valores son idénticos a `en` en 6 idiomas | **No**: añadir control de valores sin traducir + fase de traducción |

## Hallazgos

### P0 — Gates y tests
1. `quality:check` es inejecutable con el entorno global por `pytest-asyncio 0.23.3`.
2. `tests/test_institutional_landing.py` falla en **2** puntos: 6 `<section>` (L11) y `<script>` inline en `index.html:190` (L12). Las otras 28 aserciones pasan.
3. El widget Sonic Lock **nunca se inicializa**: `defer` en `sonic-lock.js` (L20) define `window.SonicLock` después de que corra el init inline (L190).
4. `index.html:155` usa `aria-labelledby="sonic-title"` pero no existe ningún `id="sonic-title"`.
5. **Dos tests fueron debilitados en el trabajo sin commitear**:
   - `admissions-availability.test.ts`: `expect(home).toContain('Applications coming soon')` → `toContain('home.applications')`; verde con la clave inexistente.
   - `demo-cta-semantic.test.ts`: `'Academic guide coming soon'` → `'home.guide_coming'`; verde con la clave inexistente.
6. El CI no ejecuta pytest, `build_site.py`, `guard.py` ni auditorías i18n.

### P0 — i18n
7. `t("home.applications")` y `t("home.guide_coming")` se renderizan en crudo (confirmado en DOM).
8. **251 de 289 claves (87%) son byte a byte el inglés** en `ca/de/fr/pt`; 252 en `it/nl`; 249 en `ja`. La paridad de claves oculta que el producto no está traducido.
9. `Portal.tsx` mantiene un i18n paralelo `es/pt/en` y pinta `pt-BR`.
10. El provider global nunca actualiza `document.documentElement.lang`.
11. `client/index.html` declara `lang="en"` con la SPA en español; el `index.html` estático declara `lang="pt"` con título en español.
12. `App.tsx` deja fuera del i18n "Loading secure T…" y "Skip to content"; el skip link aparece duplicado con `SiteHeader`.

### P1 — craft-floor y accesibilidad
13. Home: `tracking-[-.05em]` en L58, L59 y L65; eyebrow `home.cohort`; secuencia 01/02/03; `.eyebrow` en el logo.
14. Home incumple reglas que el plan v2 omitía: `blur-[120px]` ×2 y `backdrop-blur-xl` (L46-48), contenedores `rounded-[1.75rem]`/`[2rem]` frente al token de 18px.
15. 46 usos de `text-white/35`, `/40`, `/42`, `/45` y `placeholder:/30`; `/30` = 2.65:1, `/35` = 3.20:1, `/40` = 3.82:1, `/42` = 4.06:1.
16. `App.tsx` fija `defaultTheme="light"` mientras `DESIGN.md` dice dark por defecto.

### P2 — Reproducibilidad y configuración
17. `pnpm` local 12.16.1 frente a `pnpm@11.25.0` fijado y usado en CI.
18. El repo **no tiene directorio `tools/`**; los scripts de auditoría viven hoy en `C:\Users\USER\AppData\Local\Temp\opencode\`.
19. `AGENTS.md` ordena `python tools/websearch.py` (relativo a `AgentStorage`), pero el archivo no existe; el sustituto real es `C:\Users\USER\Documents\AgentStorage\tools\nvidia_search.py`.
20. `opencode.jsonc` apunta a `C:\Proyectos\_audit\repos\impeccable\.opencode\skills`, inexistente; `impeccable` vive en `C:\Users\USER\.agents\skills\impeccable`.
21. `python` puede resolver a otro intérprete según el shell: en esta sesión resuelve a Python 3.12.10, pero el plan debe fijar el intérprete con un preflight.
22. `ESTADO-APLICACION.md` y `PRODUCT.md` están desactualizados.

## Review Focus

- **Traducción real**: el test de paridad debe fallar cuando un valor es idéntico a `en`, con allowlist (marcas, códigos, cognados). Sin esto, el gate es teatro.
- **Portal**: es el archivo más grande y de una sola línea; migrarlo sin perder el aviso `role="status"` ni la navegación de secciones.
- **Sonic Lock**: el orden `defer` es el contrato; si el init se adelanta, el widget queda muerto otra vez.
- **Tests debilitados**: restaurarlos exige leer los JSON y comprobar el valor traducido, no el nombre de la clave.
- **Contraste**: auditar todos los pares, no una lista elegida; `#0b1322` deja `/45` en el límite exacto.
- **Commit**: `git diff` ignora los archivos sin trackear (`client/src/locales/`, `i18n.tsx`, tests); usar `git diff HEAD` o `git add -N`.
- **Fallback**: `t()` devuelve la clave y cae a `es` en silencio; hacerlo observable en desarrollo.

---

## Fase 0 — Reproducibilidad

### Task 0.1: Entorno Python fijado y verde

**Files:**
- Create: `requirements-dev.txt`
- Modify: `package.json` (`quality:check`)
- Test: preflight de intérprete

**Interfaces:**
- Consumes: Python 3.12.10; `pytest 9.2.0`; `pytest-asyncio 1.4.1.post1` (verificado en venv).
- Produces: `python -m pytest -q tests/` sin flags ni errores de colección.

- [ ] **Step 1: Preflight** `python -c "import sys,pytest;print(sys.version);print(pytest.__version__)"` → debe imprimir 3.12.x y 9.2.0. Si no, usar `.venv\Scripts\python.exe` en todos los comandos.
- [ ] **Step 2: Crear `requirements-dev.txt`**

```text
pytest==9.2.0
pytest-asyncio==1.4.1.post1
```

- [ ] **Step 3: Crear venv e instalar** `python -m venv .venv` + `.\.venv\Scripts\python -m pip install -r requirements-dev.txt`.
- [ ] **Step 4: Verificar** `.\.venv\Scripts\python -m pytest -q tests/` → `1 failed, 167 passed` (el fallo se corrige en Task 1.1).
- [ ] **Step 5: Alinear `quality:check`** para usar `.venv\Scripts\python` en Windows y `python` en CI.

### Task 0.2: Alinear pnpm

**Files:**
- Modify: `package.json` (`packageManager`) o documentar en `README.md`

- [ ] **Step 1: Comprobar** `pnpm --version` (12.16.1) frente al pin 11.25.0.
- [ ] **Step 2: Probar** `corepack pnpm --version`; si devuelve 11.25.0, usar corepack y no tocar el pin.
- [ ] **Step 3: Verificar** `pnpm install --frozen-lockfile` → exit 0.

### Task 0.3: Auditorías versionadas en `tools/`

**Files:**
- Create: `tools/i18n_audit.py`
- Create: `tools/i18n_hardcoded.py`
- Create: `tools/contrast_audit.py`
- Create: `tools/README.md`

**Interfaces:**
- `i18n_audit.py`: falla por (a) paridad rota, (b) clave literal `t("...")` inexistente, (c) valor idéntico a `en` fuera de la allowlist. Avisa (no falla) por claves sin uso literal, porque hay 15 `t(variable)`.
- `i18n_hardcoded.py`: detecta copy visible sin `t()` en `pages/` y `components/` (excluye `components/ui/`).
- `contrast_audit.py`: extrae pares `text-*`/`bg-*` y calcula WCAG 2.x; falla por debajo de 4.5:1.

- [ ] **Step 1: Portar los scripts temporales** (`audit_i18n.py`, `audit_hardcoded.py` ya validados) con `ROOT = Path(__file__).resolve().parents[1]`.
- [ ] **Step 2: Escribir `contrast_audit.py`** con la fórmula WCAG y salida por archivo/línea.
- [ ] **Step 3: Smoke test** de cada script: exit 1 esperado con el estado actual.
- [ ] **Step 4: Documentar contratos** en `tools/README.md`.

### Task 0.4: CI con los gates reales

**Files:**
- Modify: `.github/workflows/deploy-ci.yml`

- [ ] **Step 1: Añadir job `python-quality`** con Python 3.12, `pip install -r requirements-dev.txt`, `python -m pytest -q tests/`, `python scripts/build_site.py --destination _site`, `python tools/i18n_audit.py`.
- [ ] **Step 2: Añadir escaneo de secretos** con gitleaks.
- [ ] **Step 3: Validar el YAML** con `python -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-ci.yml'))"`.

### Task 0.5: Configuración global del harness (fuera del repo, requiere aprobación)

**Files:**
- Modify: `C:\Users\USER\Documents\AgentStorage\config\opencode\AGENTS.md`
- Modify: `C:\Users\USER\Documents\AgentStorage\config\opencode\opencode.jsonc`

- [ ] **Step 1: Pedir autorización explícita.** Estos archivos afectan a todas las sesiones y no los cubre `git diff` ni `guard.py --staged`.
- [ ] **Step 2: Corregir** la ruta del buscador a `C:\Users\USER\Documents\AgentStorage\tools\nvidia_search.py` (ruta absoluta) y la entrada `skills.paths`.
- [ ] **Step 3: Verificar** ejecutando el buscador desde `AgentStorage` y comprobando `Test-Path` de la ruta de skills.

---

## Fase 1 — Rojo a verde y tests honestos

### Task 1.1: Integrar `#sonic-lore`, extraer el script y arreglar el widget

**Files:**
- Modify: `index.html:145-335`
- Create: `ui/sonic-lock/init.js`
- Modify: `ui/sonic-lock/sonic-lock.css`
- Test: `tests/test_institutional_landing.py` (no se toca)

**Interfaces:**
- Consumes: `window.SonicLock`, `window.MASTER_KEY_SEQUENCE`, `window.BELENTANI_SEQUENCE` definidos por `sonic-lock.js` (L202), cargado con `defer`.
- Produces: 5 `<section>`, 0 `<script>` inline, easter egg inicializado.

- [ ] **Step 1: Reproducir los 2 fallos** con `check_landing_assertions.py`.
- [ ] **Step 2: Convertir** `<section id="sonic-lore">` en `<aside id="sonic-lore">`.
- [ ] **Step 3: Extraer** el `<script>` de `index.html:190-335` a `ui/sonic-lock/init.js` y cargarlo con `defer` después de `sonic-lock.js`.
- [ ] **Step 4: Arreglar el ARIA** `aria-labelledby="sonic-title"`: añadir `id="sonic-title"` al `<h3>` del widget o eliminar el atributo.
- [ ] **Step 5: Mover estilos inline** del bloque a `ui/sonic-lock/sonic-lock.css`.
- [ ] **Step 6: Verificar** las 30 aserciones → 0 fallos (dry-run ya dio 32/32) y `build_site.py` → exit 0.
- [ ] **Step 7: Verificar en navegador** que al abrir `<details>` aparece `#sonic-lock-widget` (esto prueba el orden de carga).

### Task 1.2: Cerrar las claves i18n en crudo

**Files:**
- Modify: `client/src/pages/Home.tsx:51,59`
- Test: `tools/i18n_audit.py`

- [ ] **Step 1: Sustituir** `t("home.applications")` por `t("header.applications")`.
- [ ] **Step 2: Eliminar** el `<p>{t("home.guide_coming")}</p>` duplicado.
- [ ] **Step 3: Verificar** `python tools/i18n_audit.py` → 0 claves inexistentes; `npx vitest run` → verde.
- [ ] **Step 4: Verificar en navegador** el texto renderizado.

### Task 1.3: Restaurar los tests debilitados

**Files:**
- Modify: `tests/admissions-availability.test.ts`
- Modify: `tests/demo-cta-semantic.test.ts`
- Test: los mismos

- [ ] **Step 1: Leer los JSON** en el test y afirmar el valor de `header.applications` en `es` y `en` (no el nombre de la clave).
- [ ] **Step 2: Afirmar** que `home.method.desc` existe y no está vacío en los 9 locales.
- [ ] **Step 3: Confirmar** que el test falla si se elimina la clave del JSON.
- [ ] **Step 4: Verificar** `npx vitest run` → verde real.

---

## Fase 2 — i18n

### Task 2.1: Migrar Portal al i18n global

**Files:**
- Modify: `client/src/pages/Portal.tsx`
- Modify: `client/src/locales/*.json`
- Modify: `package.json`, `vitest.config.ts` (si se elige jsdom)
- Test: `tests/portal-i18n.test.tsx` (nuevo)

**Interfaces:**
- Consumes: `useTranslation()` de `@/lib/i18n`.
- Produces: Portal sin `copy` local, sin selector propio y sin mutar `document.documentElement.lang`.

- [ ] **Step 1: Decidir el gate**: jsdom + `@testing-library/react` (mejor) o aserción estática (sin dependencias). Recomendado jsdom.
- [ ] **Step 2: Instalar** `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` como `devDependencies` y usar `// @vitest-environment jsdom` en el archivo nuevo.
- [ ] **Step 3: Escribir el test** que renderiza Portal en `es` y exige "Expediente académico".
- [ ] **Step 4: Confirmar rojo.**
- [ ] **Step 5: Eliminar `copy`, el selector `ES/pt-BR/EN` y el `useEffect` que fuerza `lang`.**
- [ ] **Step 6: Añadir las claves `portal.*` que falten** a los 9 JSON.
- [ ] **Step 7: Verificar** `tsc`, `vitest`, `i18n_audit.py`.

### Task 2.2: Sincronizar `document.documentElement.lang`

**Files:**
- Modify: `client/src/lib/i18n.tsx`
- Modify: `client/index.html`
- Test: `client/src/lib/__tests__/i18n.test.ts`

- [ ] **Step 1: Añadir el test** que cambia a `ja` y exige `document.documentElement.lang === "ja"`.
- [ ] **Step 2: Implementar** el `useEffect` en el provider.
- [ ] **Step 3: Corregir** `client/index.html` a `lang="es"` y decidir el `lang` del estático (hoy `pt`).
- [ ] **Step 4: Verificar** el test y una recarga manual.

### Task 2.3: Copy restante en Home, Mentor, NotFound y App

**Files:**
- Modify: `client/src/pages/Home.tsx`, `Mentor.tsx`, `NotFound.tsx`
- Modify: `client/src/components/SiteHeader.tsx`, `client/src/App.tsx`
- Modify: `client/src/locales/*.json`

- [ ] **Step 1: Home**: "Student portal" → `header.student_portal`; nav y CTAs a claves existentes; "academy of applied security"; "university mindset / evidence-led labs / human + AI support"; "Web Application Security · Module 03"; "Astra, your mentor…".
- [ ] **Step 2: Mentor**: "Skip to content", "Astra, your Mentor socrático", "Campus", "Progress".
- [ ] **Step 3: NotFound**: 4 cadenas.
- [ ] **Step 4: App**: "Loading secure T…" y el skip link duplicado; eliminar el duplicado de `SiteHeader` o de `App`.
- [ ] **Step 5: Verificar** `tools/i18n_hardcoded.py` → 0 hallazgos reales en `pages/` y `components/` (sin `ui/`).

### Task 2.4: Traducción real (Nivel B)

**Files:**
- Modify: `client/src/locales/{ca,fr,it,pt,de,nl,ja}.json`

**Interfaces:**
- Consumes: `en.json` como fuente, glosario de producto (secureT, campus, lab, evidence, mentor).
- Produces: 0 valores idénticos a `en` fuera de la allowlist.

- [ ] **Step 1: Definir la allowlist** (marcas, códigos de curso, cognados legítimos) en `tools/i18n_audit.py`.
- [ ] **Step 2: Traducir por lotes** con revisión humana; no inventar contenido de negocio.
- [ ] **Step 3: Verificar** `i18n_audit.py` → 0 valores sin traducir fuera de la allowlist.
- [ ] **Step 4: Registrar** qué revisor valida cada idioma (trazabilidad).

---

## Fase 3 — craft-floor y accesibilidad

### Task 3.1: Home según `DESIGN.md` completo

**Files:**
- Modify: `client/src/pages/Home.tsx`, `client/src/index.css`, `client/src/App.tsx`

- [ ] **Step 1: Quitar** eyebrow `home.cohort` y `.eyebrow` del logo.
- [ ] **Step 2: Quitar** la secuencia 01/02/03 o justificarla como información.
- [ ] **Step 3: Corregir tracking** `-.05em` → `-.03em` en L58, L59 y L65.
- [ ] **Step 4: Eliminar glass/blur decorativo** (`blur-[120px]`, `backdrop-blur-xl`) o justificarlo por escrito.
- [ ] **Step 5: Alinear radius** de contenedores al token de 18px (`rounded-[1.75rem]`/`[2rem]`).
- [ ] **Step 6: Revisar jerarquía** del bloque "Tres disciplinas…" y del párrafo cyan de método.
- [ ] **Step 7: Corregir** `defaultTheme` a dark en `App.tsx`.
- [ ] **Step 8: Capturar después** y comparar con `home-baseline.png`.

### Task 3.2: Contraste medido y completo

**Files:**
- Modify: `client/src/pages/*.tsx`
- Test: `tools/contrast_audit.py`

- [ ] **Step 1: Ejecutar** `contrast_audit.py` y listar todos los fallos (incluye `/30`, `/35`, `/40`, `/42`, `/45`).
- [ ] **Step 2: Decidir el fondo canónico**: `#071016` (implementado) o `#0b1322` (documentado); actualizar `DESIGN.md` o el código.
- [ ] **Step 3: Aplicar la regla** `/50` mínimo en texto informativo; `/60` para cuerpo.
- [ ] **Step 4: Verificar** 0 fallos reales y revisar visualmente las 5 páginas.

### Task 3.3: craft-floor en Campus, Progress, Mentor, Notifications

- [ ] **Step 1: Auditar** eyebrow/números/tracking/radius/blur/bordes/sombras por página.
- [ ] **Step 2: Aplicar** con la skill `impeccable`.
- [ ] **Step 3: Verificar** estados hover, disabled, loading, error, empty y `focus-visible`.
- [ ] **Step 4: Capturar** cada superficie y adjuntar al informe.

---

## Fase 4 — Entrega

### Task 4.1: Gate único reproducible

- [ ] `.\.venv\Scripts\python -m pytest -q tests/` → 168+ passed, 0 failed
- [ ] `npx tsc --noEmit` → exit 0
- [ ] `npx vitest run` → verde
- [ ] `npx vite build` → exit 0
- [ ] `python scripts/build_site.py --destination _site` → exit 0
- [ ] `node scripts/verify-platform-security.mjs` → exit 0
- [ ] `python tools/i18n_audit.py` → exit 0
- [ ] `python tools/contrast_audit.py` → exit 0
- [ ] `pnpm run quality:check` → exit 0 (gate real del repo)
- [ ] `guard.py --path .` → exit 0

### Task 4.2: Commits atómicos (requiere autorización)

**Files:** lista explícita por commit; **no** usar `git diff` a secas.

- [ ] **Step 1: Confirmar** el reparto:
  1. Gates y CI: `requirements-dev.txt`, `package.json`, `.github/workflows/deploy-ci.yml`, `tools/*`.
  2. Landing: `index.html`, `ui/sonic-lock/init.js`, `ui/sonic-lock/sonic-lock.css`, tests restaurados.
  3. i18n SPA: `client/src/lib/i18n.tsx`, `client/src/locales/**`, `Home.tsx`, `Mentor.tsx`, `NotFound.tsx`, `App.tsx`, `Portal.tsx`, tests.
  4. craft-floor: `client/src/pages/*.tsx`, `client/src/index.css`, `DESIGN.md`.
- [ ] **Step 2: Revisar** con `git status --porcelain` + `git diff HEAD` (incluye untracked con `git add -N`).
- [ ] **Step 3: Verificar el commit en aislamiento**: `git stash -u` no es seguro con trabajo del usuario; usar `git worktree add` del índice o construir desde un clon temporal.
- [ ] **Step 4: `guard.py --staged .`** → exit 0.
- [ ] **Step 5: Commit** solo con autorización explícita.

---

## Orden, dependencias y esfuerzo

| Orden | Task | Depende de | Esfuerzo | Riesgo |
|---|---|---|---|---|
| 1 | 0.1 entorno Python | — | 20 min | Bajo |
| 2 | 0.3 auditorías en `tools/` | — | 1,5 h | Bajo |
| 3 | 1.1 landing + widget | 0.1 | 1 h | Medio |
| 4 | 1.2 claves en crudo | 0.3 | 20 min | Bajo |
| 5 | 1.3 tests restaurados | 1.2 | 45 min | Bajo |
| 6 | 0.4 CI | 0.1, 0.3 | 45 min | Bajo |
| 7 | 2.2 `document.lang` | — | 30 min | Bajo |
| 8 | 2.3 copy restante | 0.3 | 2,5 h | Medio |
| 9 | 2.1 Portal | 2.2, 2.3 | 4 h | **Alto** |
| 10 | 3.2 contraste | 0.3 | 1,5 h | Medio |
| 11 | 3.1 Home craft-floor | 1.2, 3.2 | 2,5 h | Medio |
| 12 | 3.3 resto craft-floor | 3.1 | 3 h | Medio |
| 13 | 2.4 traducción real | 2.3 | 3-5 días con revisión | Alto |
| 14 | 4.1-4.2 cierre | todo | 1,5 h | Bajo |

## Herramientas

| Herramienta | Uso | Criterio |
|---|---|---|
| `read`/`grep`/`glob` | Leer antes de editar | Cambio basado en archivo real |
| `shell` | Gates, git de solo lectura, Python | Exit code citado |
| Python 3.12.10 + `.venv` | pytest, `build_site.py`, auditorías | Scripts deterministas |
| `npx tsc/vitest/vite` | Gates JS/TS | exit 0 |
| Playwright MCP | DOM real, consola, capturas | 0 errores salvo favicon |
| `guard.py` + gitleaks | Secretos | exit 0 antes de commit |
| `agent_audit.py` | Cierre de sesión | Claims con evidencia |
| `nvidia_search.py` | Versiones/datos externos | Cita URL |

## Skills por fase

| Fase | Skill | Motivo |
|---|---|---|
| Todas | `using-agent-skills` | Enrutado |
| 0 | `context-engineering`, `constraint-driven-development` | Baseline y barra |
| 1 | `test-driven-development`, `debugging-and-error-recovery` | Rojo → verde y widget |
| 2 | `test-driven-development`, `api-and-interface-design` | Contrato de `useTranslation` |
| 3 | `impeccable`, `frontend-ui-engineering`, `performance-optimization` | craft-floor, a11y, blur/bundle |
| Cierre | `verification-before-completion`, `code-review-and-quality` | Evidencia |
| Riesgo | `doubt-driven-development` | Revisión adversarial (ya ejecutada) |
| Commit | `git-workflow-and-versioning`, `security-and-hardening` | Atomicidad y secretos |

## Rollback

- Cada task se revierte con `git checkout -- <archivo>` **solo con autorización**; no hay commit de referencia para el trabajo nuevo.
- `Portal.tsx` se migra al final de la Fase 2 y con test previo.
- `index.html`: el dry-run está en `C:\Users\USER\AppData\Local\Temp\opencode\index-fixed.html`; sirve de referencia.
- Los cambios de contraste se validan con capturas antes/después.

## Definition of Done

**Nivel A (esta iteración):**
- `pytest` sin flags: **168+ passed, 0 failed**.
- `index.html`: 5 `<section>`, 0 `<script>`/`<style>` inline, widget Sonic inicializado.
- 0 claves literales inexistentes; 0 tests que afirmen nombres de clave en vez de valores.
- Portal en el provider global; `documentElement.lang` correcto.
- 0 texto informativo por debajo de 4.5:1.
- CI ejecuta typecheck, vitest, build, pytest, build_site, i18n, contraste y secretos.
- `pnpm run quality:check` → exit 0.

**Nivel B (calidad de producto):**
- 289 claves × 7 idiomas traducidas y revisadas; `i18n_audit.py` sin valores idénticos a `en` fuera de allowlist.
- Capturas antes/después de las 6 superficies.

## Pendiente de autorización

1. Ejecutar la implementación (subagentes por task o sesión nativa).
2. Crear `.venv`, instalar `requirements-dev.txt`, añadir `jsdom`/testing-library.
3. Modificar la configuración global del harness (Task 0.5).
4. Commit y push.
5. Traducción Nivel B: quién revisa cada idioma.
6. Idioma por defecto de la landing estática (`pt` actual frente a `es` de la SPA).

## No verificado

- `build_site.py`, `guard.py`, `tsc` y `vite build`: verificados en esta sesión, no en un clon limpio.
- Lighthouse/performance y presupuesto de bundle: no ejecutado.
- Docker, base de datos y backend Express: no ejecutados.
- Despliegue real (Vercel/Pages/Netlify): no ejecutado.
- Compatibilidad de `pnpm 12.16.1` con el lockfile de 11.25.0: no probada con `--frozen-lockfile`.
- Widget Sonic tras extraer el script: no probado en navegador todavía; el dry-run solo valida el HTML.
