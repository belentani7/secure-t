# Informe de elevación — `belentani7/secure-t`

- **Rama**: `arena/a75428a2-secure-t` (21 commits sobre `main` @ `eb2b05e`)
- **Pull request**: [#3](https://github.com/belentani7/secure-t/pull/3) — abierto
- **Evidencia de CI**: ejecución completa sobre el commit `0aec835` — **8 comprobaciones de trabajo en verde y las dos
  suites de workflow (`CI` y `Calidad`) en verde** (sobre el commit de código `1a43b1b` el conjunto fue idéntico)
- **Fecha**: 2026-10-11
- **Alcance de este informe**: el ciclo de endurecimiento (seguridad de la cadena de suministro y escaneo real de
  secretos) sobre el campus ya elevado. Todo lo que aquí se afirma tiene su comando o su URL; lo que no se ha podido
  comprobar figura como `NOT VERIFIED`, `FAILED` o `BLOCKED`.

---

## 1. EXECUTIVE RESULT

El repositorio queda con **una única comprobación de seguridad que antes no existía de verdad**: el escaneo de
secretos del historial completo, con binario fijado por SHA-256, control negativo de eficacia y un veredicto
explícito («el historial contiene exactamente los hallazgos conocidos y documentados», no «no encontró nada»).

Consecuencia inmediata y principal: **aparece una clave de API real del autor original en el historial** (ver
`SECURITY FINDINGS` F-1). No se ha ocultado, no se ha borrado y no se ha aceptado en silencio: la CI la publica como
aviso en **cada** ejecución.

| Área | Estado | Evidencia |
|---|---|---|
| CI del repositorio | **Verde completa** | checks con conclusión `success`: campus, secretos, edu-engine, web, cobertura, accesibilidad estática, axe (32 pruebas) y Lighthouse ≥ 95 + CWV; las dos suites de workflow (`CI`, `Calidad`) en verde. Sólo Sourcery aparece como `skipped` (revisión de terceros, no forma parte de las puertas) |
| Escaneo de secretos | **Real y verificable** | binario oficial `gitleaks 8.24.3` (MIT) verificado por SHA-256, `--config .gitleaks.toml`, control negativo, veredicto por conjunto conocido |
| Cadena de suministro | **Fijada y al día** | 7 acciones de GitHub fijadas por commit (todas en Node 24), `pnpm audit:deps` como puerta obligatoria, SBOM CycloneDX 1.5 con 778 componentes |
| Campus AURUM | **Verificado** | 476 páginas exportadas, `_site` con 3.216 ficheros, `audit:site` = 0 errores y 0 avisos |
| Estándares abiertos | **Aplicados con test** | QTI 1.2 y 2.1, SCORM 2004, IMS CC 1.3, EPUB 3.3, xAPI 1.0.3, Open Badges 2.0 y 3.0 (VC-JWT), schema.org, RFC 9116 |
| Idiomas del contenido docente | **PLANNED** (PT/EN/CA) | sólo la interfaz está traducida; el material de las semanas, no |
| Rotación de la clave filtrada | **BLOCKED** | requiere al propietario; aquí sólo se documenta y se vigila |

---

## 2. ARCHITECTURE

### 2.1 Mapa

```
/                        campus clásico (HTML+JS sin build)  ← se publica en la raíz de Pages
/app                     campus AURUM (Next.js 16 SSR → export estático) ← se publica en /app
  /{pt,es,en,ca}         portada y páginas por idioma
  /programas/[course]    cuatro programas, 20 semanas cada uno
  /programas/[course]/semana/[week]
  /agente  /calendario  /progreso  /credencial  /amenazas  /repaso  /estandares  /privacidad
packages/shared          i18n, badges (OB 2.0 + OB 3.0 VC-JWT), xAPI, SM-2, calendario, BM25…
packages/agent           agente IA con deny-list, anti-SSRF, modo examen, citas y auditoría
packages/ui              design system (tokens negros/dorados) + Storybook
tools/                   contenido, paquetes interoperables, programas imprimibles, SBOM, ensamblado, auditorías
.github/workflows/       ci.yml · quality.yml · pages.yml
```

### 2.2 Cadena de publicación (una sola fuente de verdad)

`campus/` (fuente) → `pnpm content:all` (**contenido + programas imprimibles + paquetes interoperables + SBOM**) →
`apps/web` (export estático con `basePath=/app`) → `tools/build-site.mjs` (ensambla `_site`: campus clásico en la
raíz + AURUM en `/app`) → `actions/upload-pages-artifact` → `actions/deploy-pages` (OIDC, sin tokens personales).

`pnpm check:drift` compara el **material** (`sourceDigest`), no la fecha de generación: la comprobación dejó de ser
un falso fallo por reloj y sigue detectando contenido editado a mano.

### 2.3 Decisiones de ingeniería que sostienen el resto

| Decisión | Motivo |
|---|---|
| Static export + `localStorage` | cumplir «máximo anonimato»: sin cuentas, sin cookies, sin servidor de progreso |
| SSR con export estático del mismo código | promesa de Next.js con SSR real sin renunciar a Pages (decisión del usuario: `next_ssr`) |
| HTML sin JavaScript útil | el campus clásico funciona sin JS; el progreso degrada a lectura |
| Paquetes como artefactos versionados | el material sale del sitio (EPUB/SCORM/CC/QTI/xAPI) y se verifica con contratos |
| Contrato de tests inmutable | las 14 promesas y los 12 casos críticos del repositorio original siguen cubiertos |

---

## 3. SECURITY FINDINGS

### F-1 · Clave de API real en el historial — **ABIERTO (requiere al propietario)**

- **Qué**: `fix_weeks.py`, línea 3: `API_KEY = "sk-e2d84b…"` (clave de DeepSeek, 32 hex) usada contra
  `https://api.deepseek.com/v1/chat/completions`.
- **Dónde y cuándo**: introducida en el commit `732eba5` (2026-09-25); retirada del código en `e54358a`
  (2026-09-30, «ahora se lee de DEEPSEEK_API_KEY»); el fichero se borró en `cfcf0d0` (2026-09-30). **Sigue en el
  historial**: 10+ commits (todos anteriores a `eb2b05e`) y en ninguna rama actual. Confirmado con
  `git rev-list --all` + `git grep`: aparece sólo en `fix_weeks.py`.
- **Impacto**: cualquiera puede leer la clave en el historial de un repositorio público y consumir la cuota del
  propietario del proyecto. Severidad **alta** (CWE-798: credenciales embebidas en el código).
- **Qué hace la CI**: la publica como `::warning` en cada ejecución del trabajo `secretos`, y queda fuera de la lista
  blanca a propósito: aceptarla no la borra.
- **Remedio (propietario)**: 1) rotar/revocar la clave en DeepSeek; 2) si se quiere limpiar el historial, reescribirlo
  (`git filter-repo`/BFG + `push --force`) — es una **acción destructiva que este trabajo no ejecuta sin
  autorización explícita**; 3) opcional: activar *secret scanning* y *push protection* en el repositorio.

### F-2 · La CI no se ejecutaba — **CORREGIDO y verificado**

`.github/workflows/ci.yml` era YAML inválido (un `name:` con `": "` sin comillas), así que GitHub no lanzaba
**ninguno** de sus trabajos. Corregido; desde entonces se ejecutan los 10 checks.

### F-3 · Dependencias: dos universos, uno de ellos sin auditar — **PARCIAL / NOT VERIFIED**

- **Espacio de trabajo pnpm** (raíz, `apps/web`, `packages/*`): `pnpm audit` pasó de **11 avisos a 1**, aceptado con
  motivo y sin parche publicado (`sprintf-js`, moderado, sólo herramienta de desarrollo vía `@lhci/cli`).
  `pnpm audit:deps` es puerta de CI y falla ante avisos nuevos o si falta una sobrescritura.
- **Manifiestos legados fuera del espacio de trabajo** (`secure-t-app/`, `Cybersecurity-Course-Document-Overview/`,
  `cybersecurity_course/`): **no** los cubre `pnpm audit`. Medido a mano (lockfile resuelto en `/tmp`, nunca en el
  repositorio): `secure-t-app/package.json` → **17 avisos** (2 críticos, 1 alto, 8 moderados, 6 bajos); con
  `--omit=dev` → **6 bajos**. Los críticos y el alto son **herramientas de desarrollo** (`vitest`, `tinypool`,
  `vite`); en producción sólo quedan bajos vía `katex`/`mermaid`/`streamdown`.
- **Dependabot del repositorio**: GitHub informa de **7 avisos en `main`** (3 críticos, 1 alto, 3 moderados). El
  detalle **no se ha podido leer**: `gh api repos/belentani7/secure-t/dependabot/alerts` responde `403` →
  `NOT VERIFIED`. La cifra es coherente con el árbol legado medido arriba.
- **Recomendación**: decidir el futuro de los directorios legados (no se publican en Pages) o añadirlos a la
  vigilancia de Dependabot; mientras existan, conviven dos universos de dependencias con criterios distintos.

### F-4 · Falsos positivos del escaneo de secretos — **CORREGIDO con evidencia**

Tres hallazgos del historial reciente son falsos positivos verificados uno a uno: dos identificadores anónimos de
pruebas (UUID de ejemplo, hoy generados con `crypto.randomUUID()`: ningún literal en el árbol) y la palabra
`RS256-signed` dentro de una cadena de traducción (es el nombre del algoritmo de firma).

- Primero se probó la forma global documentada (`[[allowlists]]` + `targetRules`): **no suprimía nada** —medido en
  CI con el diagnóstico del veredicto: `control=4, final=4`—, ni con objetivo «secreto», ni «coincidencia», ni
  «línea».
- La solución que funciona es la que gitleaks fusiona de verdad: la lista blanca **dentro de la regla**
  (`[[rules.allowlists]]` sobre `generic-api-key`, que `extend()` añade a la regla del motor). Acota la regla y el
  texto exacto, nunca el fichero entero: un secreto real en esos mismos ficheros seguiría rompiendo la CI.

### F-5 · Cadena de suministro — **ENDURECIDA**

| Control | Estado |
|---|---|
| Acciones de GitHub fijadas por commit | 7 acciones, todas en versiones Node 24 (`checkout` v7.0.1, `setup-node` v7.1.0, `setup-python` v7.0.0, `pnpm/action-setup` v6.1.0, `upload-artifact` v7.0.2, `upload-pages-artifact` v5.0.0, `deploy-pages` v5.0.1) |
| Escáner de secretos | binario oficial en lugar de acción de terceros: versión + **SHA-256** verificado contra el `checksums.txt` de la release, sin EULA intermedio |
| Permisos de CI | `permissions: contents: read` en los tres workflows; Pages usa OIDC (`id-token: write`, `pages: write`) y `GITHUB_TOKEN` |
| SBOM | CycloneDX 1.5, 778 componentes con SHA-512 y licencia declarada (472) o `NOASSERTION` (306) |
| Sobrescrituras | 6 `pnpm.overrides` documentadas en `DEPENDENCIAS.md` §7, con la única excepción aceptada y su motivo |
| Cabeceras | CSP única consumida por `next.config.ts`, `public/_headers` y metadatos; `frame-ancestors` sólo como cabecera real (en `<meta>` es ignorada: se declara y se documenta, no se finge) |

### F-6 · Controles OWASP / NIST (lectura honesta)

| Referencia | Qué se aplica | Estado |
|---|---|---|
| OWASP Top 10 A05 (configuración) | CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `security.txt` (RFC 9116) | aplicado y auditado |
| OWASP Top 10 A06 (componentes vulnerables) | `pnpm audit:deps` + Dependabot + SBOM | aplicado en el espacio de trabajo; legado sin auditar (F-3) |
| OWASP Top 10 A09 (registro y monitorización) | CI como registro de cada cambio; auditoría del agente IA en cliente | aplicado; **sin servidor** no hay monitorización central (`PLANNED` por diseño de anonimato) |
| OWASP API Top 10 (API1/API4/API6) | API del agente: `application/problem+json` (RFC 9457), sin cookies, límites de tamaño, deny-list y anti-SSRF con tests | aplicado por contrato |
| NIST SSDF (PW/PS) | acciones fijadas por SHA, escaneo de secretos en cada push y PR, SBOM, revisión por PR | aplicado |
| CWE-798 / CWE-1104 | F-1 y F-3 | abierto / parcial |

---

## 4. IMPLEMENTATION LEDGER

| Entrega | Ubicación | Cómo se comprueba |
|---|---|---|
| Campus AURUM (4 idiomas, 4 programas × 20 semanas, 13 rutas) | `apps/web/src/app/**` | 476 páginas exportadas; `audit:site` 0/0; axe 32 pruebas en CI |
| Paquetes interoperables (EPUB 3.3, SCORM 2004 4.ª ed., IMS CC 1.3, QTI 1.2 y 2.1, plantillas xAPI) | `tools/build-packages.ts` → `apps/web/public/packages/` | `tests/packages-contract.test.ts` (27) |
| Credenciales: Open Badges 2.0 y **OB 3.0 en VC-JWT** | `packages/shared/src/badges.ts` | tests de firma, manipulación, clave ajena y formato inválido |
| Contenido de datos estructurados schema.org | `apps/web/src/lib/schema.ts` | contratos de página de estándares |
| `security.txt` (RFC 9116), CSP y aviso RGPD en 4 idiomas | `apps/web/public/.well-known/`, `src/lib/security-headers.ts`, `/privacidad` | `tests/contracts.test.ts` (35) |
| Agente IA con garantías | `packages/agent`, `/api/agent` | `tests/agent-api.test.ts` (8) |
| Programas imprimibles (HTML A4, LaTeX, índice con SHA-256) | `tools/build-syllabus.ts` → `apps/web/public/plan/` | contrato de 9 pruebas |
| SBOM CycloneDX + auditoría de dependencias | `tools/build-sbom.mjs`, `tools/audit-deps.mjs` | `pnpm audit:deps` en CI |
| Sincronía contenido↔sitio | `tools/check-drift.mjs` | `pnpm check:drift` en CI (`sourceDigest bb57edf59758…`) |
| Escaneo de secretos real | `.github/workflows/ci.yml` + `.gitleaks.toml` | control negativo + veredicto (ver §5) |
| Documentación exigida | `README.md`, `ANALISIS_ORIGINAL.md`, `CONTRATO_API.md`, `DEPENDENCIAS.md`, `CHANGELOG.md`, `docs/decisions/` (12 ADR), `docs/ESTANDARES.md` | `tests/contracts.test.ts` |

Métricas del material: **74.450 líneas** versionadas de código, datos y documentación; **3.216 ficheros** en `_site`.

---

## 5. TEST EVIDENCE

### 5.1 Ejecutado en este entorno (reproducible con los comandos indicados)

| Prueba | Comando | Resultado |
|---|---|---|
| Contrato del campus clásico | `python -m pytest -q tests/` | **117 passed** |
| Paquetes y contratos (vitest) | `pnpm test` | **243 passed** en 19 ficheros |
| Tipos (raíz y web) | `pnpm typecheck` + `pnpm --filter @secure-t/web typecheck` | sin errores |
| Cobertura de módulos críticos | `pnpm test:coverage` | **92,55 %** sentencias · **81,5 %** ramas · 95,47 % líneas (umbral 80 %) |
| Sincronía del contenido generado | `pnpm check:drift` | ✔ `sourceDigest bb57edf59758…` |
| Auditoría de dependencias | `pnpm audit:deps` | ✔ 1 aviso aceptado y documentado, 0 sin justificar |
| Export estático y ensamblado | `pnpm content:all` · `web:build` · `build:pages` · `node tools/build-site.mjs` | ✔ 476 páginas, `_site` 3.216 ficheros |
| Auditoría del sitio (sin navegador) | `pnpm audit:site` | **0 errores · 0 avisos**; JS 0,82 MB; peor página 204,2 kB comprimidos |
| Accesibilidad estática | incluida en `audit:site` | ✔ sin errores (lang, `h1` único, jerarquía, `alt`, ids, nombres accesibles) |

### 5.2 Solo verificable en CI (este entorno no tiene navegador)

| Prueba | Resultado sobre `1a43b1b` (y `0aec835` para Lighthouse/axe) |
|---|---|
| Lighthouse (6 URLs × 3 pasadas, presupuesto ≥ 95 y CWV) | **success** (en `0aec835` y en `1a43b1b`) |
| axe / WCAG 2.2 AA (Playwright) | **success** — `32 passed (52.2s)` |
| Cobertura como umbral de CI | **success** |
| Escaneo de secretos | **success** — control negativo encontrado ≥ 3 hallazgos; veredicto con 1 aviso aceptado |

`NOT VERIFIED` por límite del entorno: Lighthouse y axe **no** se han podido ejecutar localmente (sin Chromium en el
sandbox). No se afirma su resultado más allá de lo que devuelve la CI, que sí los ejecuta y publica el detalle en las
anotaciones del check.

### 5.3 El veredicto del escaneo de secretos, paso a paso

1. **Instalación**: binario oficial `gitleaks 8.24.3`, descargado y verificado por SHA-256
   (`9991e0b2…` contra el `checksums.txt` de la release).
2. **Control negativo**: se recorta `.gitleaks.toml` en la marca `# ===SIN-LISTA-BLANCA===` y se escanea el
   historial completo **sin** exclusiones. Si no aparecen al menos tres hallazgos, el trabajo falla: un «verde»
   posterior no probaría nada.
3. **Escaneo con la lista blanca**: historial completo, informe SARIF publicado como artefacto.
4. **Veredicto**: el SARIF debe contener **exactamente** los hallazgos conocidos y documentados. Cualquier otro
   falla el trabajo con `::error` indicando archivo y línea; los aceptados se publican como `::warning`. Un
   diagnóstico avisa si la lista blanca no suprimió nada (`control=final`).

---

## 6. RESIDUAL RISK

| Riesgo | Estado | Nota |
|---|---|---|
| Clave de API real en el historial (F-1) | **ABIERTO / BLOCKED** | Rotación y eventual reescritura del historial: decisión del propietario |
| Manifiestos legados sin auditar (F-3) | **PARCIAL** | 17 avisos medidos, ninguno de producción por encima de «bajo»; Dependabot con 7 avisos sin detalle (API 403) |
| `sprintf-js` sin parche | **ACEPTADO** | Sólo desarrollo (`@lhci/cli` → `js-yaml` → `argparse`); sin versión corregida publicada |
| PT/EN/CA del contenido docente | **PLANNED** | La interfaz está traducida; el material de las semanas no, y se dice en voz alta |
| Credenciales sin registro público ni revocación | **PLANNED** | OB 2.0/3.0 se firman y verifican en el navegador; sin registro central por diseño de anonimato |
| xAPI local y exportable | **ACEPTADO** | «Local-first»: el estudiante exporta su historial; no hay LRS remoto |
| Voz humanizada | **PARCIAL** | Publicada en español y portugués; el resto, pendiente |
| Lighthouse/CWV | **VERIFICADO EN CI** | Depende de la ejecución con navegador; no reproducible en este entorno |
| Aviso cosmético de CI | **ABIERTO (menor)** | `upload-artifact` de Lighthouse avisa de que `.lighthouseci/` no existe al subir el artefacto: el check pasa, el artefacto no se publica |
| Superficie legada (`secure-t-app/`, etc.) | **DECISIÓN DEL PROPIETARIO** | Material que ya no se publica ni se toca sin autorización explícita |
| Integraciones de terceros en cola | **NOT VERIFIED** | Cada push despierta suites de aplicaciones instaladas en la cuenta original (Vercel, Netlify, Cloudflare, Railway, Render, SonarQube, Supabase, Cursor, Claude…): aparecen como `queued`, no aportan verificación a esta entrega y conviene revisarlas o retirarlas con el propietario |

---

## 7. RELEASE READINESS

- **Bloqueadores técnicos**: ninguno. `main` sigue publicando con Pages; la rama entrega el incremento entero por PR
  y sus 10 comprobaciones están en verde.
- **Antes de fusionar**: revisar el *diff* de los workflows (está explicado commit a commit) y decidir sobre F-1.
- **Acciones del propietario**:
  1. **Rotar la clave de DeepSeek** (F-1) y, si procede, reescribir el historial con autorización escrita.
  2. Decidir el destino de los directorios legados (F-3) o añadirlos a Dependabot.
  3. Fusionar el PR #3 y comprobar el despliegue de Pages (`https://belentani7.github.io/secure-t/`).
  4. Revisar los 7 avisos de Dependabot en `main` (3 críticos) — el detalle no es accesible por API desde aquí.
- **Siguiente incremento (ya decidido, no incluido aquí)**: que el campus **consuma** los paquetes publicados
  (`xapi-store.ts` / `progress-store.ts` no referencian todavía `apps/web/public/packages/`), y añadir tests que
  comprueben que el progreso del campus exporta xAPI contra el propio sitio.

---

## 8. GIT EVIDENCE

- **Rama**: `arena/a75428a2-secure-t` (no se ha creado ni empujado ninguna otra). **Árbol de trabajo limpio**.
- **21 commits** desde `eb2b05e`, en orden (del más antiguo al más reciente):

```
853f218 feat(estandares): capa de conformidad verificable sobre el campus AURUM
e9c1a0f fix(ci): genera los artefactos antes de medir la cobertura y avisa si faltan
d67a238 fix(a11y): contenedores con scroll alcanzables por teclado y consola limpia
07badf9 fix(ci): servir el export con su prefijo para axe y Lighthouse
2e7cbd1 chore(ci): publica el motivo del fallo de Lighthouse y de axe como anotaciones
4a5fc64 fix(a11y): landmarks únicos, enlaces subrayados y Lighthouse sobre el sitio publicado
a544cb6 fix(a11y): nombre en los medidores, etiqueta en el input de importar y regiones con scroll
81a7615 fix(ci): rutas con barra final en el servidor estático y reporter de GitHub en Playwright
f3827a5 fix(ci): axe no espera a networkidle y Lighthouse publica sólo los fallos
2e00047 chore(ci): publica las auditorías SEO por debajo de 1 en la anotación del check
7374d07 fix(a11y,seo,offline): consola limpia, hreflang absoluto y service worker con la carpeta real
92ff620 feat(estandares): QTI 2.1 como paquete de contenido y la credencial en VC-JWT
f354785 fix(ci,seguridad): la CI vuelve a ejecutarse, la URL publicada es la real y la cadena de suministro queda auditada
ff4c03f chore(ci): publicar los hallazgos de gitleaks como anotaciones del check
f67233c fix(seguridad): cierra los tres falsos positivos de gitleaks sin debilitar el escaneo
6c4327f fix(seguridad): aplicar la lista blanca de gitleaks (la acción no leía el fichero)
0391fe0 fix(seguridad): gitleaks propio, fijado por SHA-256 y con control negativo
99022bc fix(seguridad): el veredicto del escaneo es un conjunto conocido, no una ausencia
5b48cef fix(seguridad): la lista blanca viaja dentro de la regla (la forma global no se aplicaba)
33aa55e chore(ci): todas las acciones al día y sin avisos de Node 20
1a43b1b fix(tests): el contrato de Pages comprueba la política de fijado, no una versión
```

- **Honestidad de la secuencia**: `33aa55e` se subió con un test de contrato en rojo (el contrato exigía literalmente
  `v4` de `actions/deploy-pages`). La CI lo detectó (`campus` ❌) y se corrigió en `1a43b1b`. Se documenta porque forma
  parte de la evidencia: la red de seguridad funciona.
- **Lo que NO se ha hecho** (y por qué): ni `push --force`, ni borrado de ramas, ni `reset` destructivo, ni rotación
  de secretos, ni reescritura del historial (autorización requerida). No se ha alterado la licencia raíz (MIT para el
  código nuevo) ni la identidad del propietario; `lib/edu-engine` conserva AGPL-3.0-only (contradicción documentada
  en ADR-0004).
- **URLs**: PR [#3](https://github.com/belentani7/secure-t/pull/3) · sitio
  [belentani7.github.io/secure-t/](https://belentani7.github.io/secure-t/) · checks de `0aec835` en
  `https://github.com/belentani7/secure-t/commit/0aec835/checks`.

---

## Anexo · Cómo reproducir la verificación

```bash
pnpm install --frozen-lockfile
pnpm content:all              # contenido + programas + paquetes interoperables + SBOM
pnpm typecheck && pnpm test   # tipos y 243 pruebas
pnpm test:coverage            # umbral de cobertura ≥ 80 % en ramas
python -m pytest -q tests/    # 117 pruebas del contrato del campus
pnpm check:drift              # contenido generado en sincronía (sourceDigest)
pnpm audit:deps               # avisos de dependencias justificados uno a uno
pnpm web:build && pnpm --filter @secure-t/web build:pages && node tools/build-site.mjs
pnpm audit:site               # 476 páginas: 0 errores y 0 avisos
```

Lighthouse y axe se ejecutan en CI (`.github/workflows/quality.yml`); este entorno no tiene navegador para repetirlos
en local.
