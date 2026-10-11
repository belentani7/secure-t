# Informe de elevación — `belentani7/secure-t`

- **Rama**: `arena/a75428a2-secure-t` (**44 commits** sobre `main` @ `eb2b05e` hasta `ee60819`; este propio informe se
  actualiza en el 45.º para no publicar una cifra que no pueda comprobarse)
- **Pull request**: [#3](https://github.com/belentani7/secure-t/pull/3) — abierto
- **Evidencia de CI**: ejecución completa sobre `7736d1f` — **8 comprobaciones de trabajo en verde (campus, secretos,
  edu-engine, web, cobertura, accesibilidad estática, axe con 21 rutas y Lighthouse ≥ 95 + CWV) y las dos
  suites de workflow (`CI` y `Calidad`) en verde** (el detalle, en §5.2). La CI también cazó, en `f0d03a7`, un
  falso positivo nuevo del escáner de secretos y el trabajo en rojo permaneció visible hasta corregirlo en `705e944`
- **Versión**: 1.4.1 (ciclo I: la experiencia como ingeniería — psicología aplicada y verificada, navegación en dos
  escalones, movimiento respetuoso y el guiño de Río de Janeiro en el propio HTML)
- **Fecha**: 2026-10-11
- **Alcance de este informe**: tres ciclos sobre el campus ya elevado. **(H) Producto completo**: la malla de
  cinco años (200 semanas) con lo escrito y lo pendiente en la misma página, la biblioteca abierta de 79 recursos con
  regla de procedencia verificada, y el laboratorio de IA con cinco instrumentos deterministas que además alimentan al
  tutor como herramientas de sólo lectura. **(1) Endurecimiento**… (1) **Endurecimiento**: seguridad de la cadena
  de suministro y escaneo real de secretos. (2) **Producto**: portugués de Brasil por defecto, cristal negro vivo con
  luz dorada líquida, identidad por llave de cuatro dígitos sin guardar nada, itinerarios abiertos y traducción
  incremental del material con la cobertura medida, no prometida. (3) **Docencia**: las ocho primeras semanas de los
  cuatro programas quedan escritas en portugués de Brasil (32/80, 16.950 palabras) y las semanas 5-8 de tres
  programas dejan de ser borradores. Todo lo que aquí se afirma tiene su comando o su URL; lo que no se ha podido
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
| CI del repositorio | **Verde completa en `7736d1f`** | checks con conclusión `success`: campus, secretos, edu-engine, web, cobertura, accesibilidad estática, axe (42 pruebas, 21 rutas × escritorio y móvil) y Lighthouse ≥ 95 + CWV; las dos suites de workflow (`CI`, `Calidad`) en verde. Sólo Sourcery aparece como `skipped` (revisión de terceros, no forma parte de las puertas) |
| Escaneo de secretos | **Real y verificable** | binario oficial `gitleaks 8.24.3` (MIT) verificado por SHA-256, `--config .gitleaks.toml`, control negativo, veredicto por conjunto conocido |
| Cadena de suministro | **Fijada y al día** | 7 acciones de GitHub fijadas por commit (todas en Node 24), `pnpm audit:deps` como puerta obligatoria, SBOM CycloneDX 1.5 con 778 componentes |
| Campus AURUM | **Verificado** | 496 páginas exportadas, `_site` con 3.375 ficheros, `audit:site` = 0 errores y 0 avisos |
| Estándares abiertos | **Aplicados con test** | QTI 1.2 y 2.1, SCORM 2004, IMS CC 1.3, EPUB 3.3, xAPI 1.0.3, Open Badges 2.0 y 3.0 (VC-JWT), schema.org, RFC 9116 |
| Idioma por defecto | **Portugués de Brasil** | `pt-BR` en `lang`, `hreflang`, `x-default`, Open Graph y voz; el vocabulario del diccionario y del contenido se vigila con test (`tests/portugues-brasil.test.ts`) |
| Idiomas del material docente | **Parcial y medido** | interfaz y agente completos en pt-BR/es/en/ca (471 claves, paridad con test); material: 32/80 semanas (las ocho primeras de los cuatro programas) y 4/4 títulos de programa en pt-BR. Lo mide `pnpm locales` y lo vigila `tests/content-i18n.test.ts` |
| Identidad sin datos personales | **Llave de cuatro dígitos** | `PBKDF2-SHA256` con 210.000 iteraciones y semilla del dispositivo; el PIN se usa en memoria y no se guarda (lo comprueba `tests/identity.test.ts`) |
| Front | **Cristal vivo con luz dorada líquida** | `.aurum-glass` y `.aurum-luz` en `globals.css`; todo lo animado vive en `prefers-reduced-motion: no-preference` |
| Currículo de cinco años | **200 semanas declaradas, 80 escritas** | `curriculum-5y.ts` + `validateCurriculum()` (cobertura 1..200 sin huecos ni solapes) y página `/plano` con el estado de cada franja |
| Biblioteca abierta | **79 recursos, sin espejos** | `/biblioteca`; `DOMINIOS_PROHIBIDOS` y `packages/shared/tests/library.test.ts` fallan si entra un agregador de cursos de pago |
| Laboratorio de IA | **Cinco instrumentos deterministas** | `/laboratorio`; `packages/shared/tests/lab.test.ts` (23 pruebas) exige límite declarado, referencia normativa y cero red |
| Tutor con herramientas | **Sólo lectura, en el contrato** | campo `tools` de la respuesta del agente; `resumen_semana`, `plan_estudio`… con datos del corpus, no del modelo |
| Estructura profesional abierta | **Itinerarios** | 4 itinerarios con prerrequisitos sin ciclos y competencias acreditadas (`/itinerarios` + 4 rutas de idioma) |
| Firma del autor | **Sólo en el back** | `tools/firma.ts` y el log de compilación; `tests/firma.test.ts` demuestra que no aparece en el front |
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
  /biblioteca           59 recursos abiertos (canales, cursos, laboratorios, documentación) con filtro local
  /plano                malla de cinco años: 200 semanas en 10 franjas, con lo escrito y lo pendiente
  /laboratorio          cinco instrumentos de IA deterministas (prompt, datos, fundamento, contexto, salvaguardas)
  /agente  /calendario  /progreso  /credencial  /amenazas  /repaso  /estandares  /privacidad
packages/shared          i18n, badges (OB 2.0 + OB 3.0 VC-JWT), xAPI, SM-2, calendario, BM25,
                         biblioteca abierta, currículo de cinco años, herramientas del tutor y laboratorio de IA
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
| Campus AURUM (4 idiomas, 4 programas × 20 semanas, 16 rutas) | `apps/web/src/app/**` | 496 páginas exportadas; `audit:site` 0/0; axe 42 pruebas en CI (21 rutas × 2) |
| Paquetes interoperables (EPUB 3.3, SCORM 2004 4.ª ed., IMS CC 1.3, QTI 1.2 y 2.1, plantillas xAPI) | `tools/build-packages.ts` → `apps/web/public/packages/` | `tests/packages-contract.test.ts` (27) |
| Credenciales: Open Badges 2.0 y **OB 3.0 en VC-JWT** | `packages/shared/src/badges.ts` | tests de firma, manipulación, clave ajena y formato inválido |
| Contenido de datos estructurados schema.org | `apps/web/src/lib/schema.ts` | contratos de página de estándares |
| `security.txt` (RFC 9116), CSP y aviso RGPD en 4 idiomas | `apps/web/public/.well-known/`, `src/lib/security-headers.ts`, `/privacidad` | `tests/contracts.test.ts` (35) |
| Agente IA con garantías | `packages/agent`, `/api/agent` | `tests/agent-api.test.ts` (8) |
| Programas imprimibles (HTML A4, LaTeX, índice con SHA-256) | `tools/build-syllabus.ts` → `apps/web/public/plan/` | contrato de 9 pruebas |
| SBOM CycloneDX + auditoría de dependencias | `tools/build-sbom.mjs`, `tools/audit-deps.mjs` | `pnpm audit:deps` en CI |
| Sincronía contenido↔sitio | `tools/check-drift.mjs` | `pnpm check:drift` en CI (`sourceDigest bb57edf59758…`) |
| Escaneo de secretos real | `.github/workflows/ci.yml` + `.gitleaks.toml` | control negativo + veredicto (ver §5) |
| Itinerarios abiertos (orden, prerrequisitos y competencias) | `packages/shared/src/tracks.ts`, `apps/web/src/app/**/itinerarios/` | `tests/tracks.test.ts` (8) |
| Llave de cuatro dígitos (identidad seudónima) | `packages/shared/src/identity.ts`, `/progreso`, `src/lib/key-store.ts` | `tests/identity.test.ts` (7) |
| Traducción incremental del material, con cobertura medida | `campus/cursos/*/i18n/<idioma>/`, `tools/report-locales.ts`, `/itinerarios` y fichas | `tests/content-i18n.test.ts` (5) |
| Idioma real del contenido sin traducir (WCAG 3.1.2) | `apps/web/src/components/teaching-text.tsx` | `tests/tracks.test.ts` y `lang` en el HTML exportado |
| Cristal negro vivo con luz dorada líquida | `apps/web/src/app/globals.css` (+ encabezado, portada y pie) | axe y Lighthouse en CI; movimiento reducido respetado por construcción |
| Malla de cinco años (10 franjas, 200 semanas) | `packages/shared/src/curriculum-5y.ts`, `/plano` | `packages/shared/tests/library.test.ts` (9) y contratos de ruta |
| Biblioteca abierta (79 recursos) y regla de procedencia | `packages/shared/src/library.ts`, `/biblioteca` | `packages/shared/tests/library.test.ts` + contratos |
| Laboratorio de IA (5 instrumentos) y herramientas del tutor | `packages/shared/src/lab.ts`, `tutor-tools.ts`, `/laboratorio`, consola | `packages/shared/tests/lab.test.ts` (23) y `tutor-tools.test.ts` (8) |
| Documentación exigida | `README.md`, `ANALISIS_ORIGINAL.md`, `CONTRATO_API.md`, `DEPENDENCIAS.md`, `CHANGELOG.md`, `docs/decisions/` (13 ADR), `docs/ESTANDARES.md` | `tests/contracts.test.ts` |

Métricas del material: **103663 líneas** versionadas de código, datos y documentación; **3.251 ficheros** en `_site`;
**496 páginas** auditadas.

---

## 5. TEST EVIDENCE

### 5.1 Ejecutado en este entorno (reproducible con los comandos indicados)

| Prueba | Comando | Resultado |
|---|---|---|
| Contrato del campus clásico | `python -m pytest -q tests/` | **274 passed** en 3 ficheros (`test_campus.py`, `test_forge_smoke.py` y el control de secretos del material, con 157 comprobaciones parametrizadas) |
| Paquetes y contratos (vitest) | `pnpm test` | **323 passed** en 27 ficheros (incluye llave de cuatro dígitos, itinerarios, traducciones, portugués de Brasil, firma del back, biblioteca, plan de cinco años, laboratorio y herramientas del tutor) |
| Tipos (raíz y web) | `pnpm typecheck` + `pnpm --filter @secure-t/web typecheck` | sin errores |
| Cobertura de módulos críticos | `pnpm test:coverage` | **92,55 %** sentencias · **81,5 %** ramas · 95,47 % líneas (umbral 80 %) |
| Sincronía del contenido generado | `pnpm check:drift` | ✔ `sourceDigest bb57edf59758…` |
| Auditoría de dependencias | `pnpm audit:deps` | ✔ 1 aviso aceptado y documentado, 0 sin justificar |
| Export estático y ensamblado | `pnpm content:all` · `web:build` · `node tools/build-site.mjs` | ✔ 496 páginas, `_site` 3.375 ficheros |
| Auditoría del sitio (sin navegador) | `pnpm audit:site` | **0 errores · 0 avisos**; mediana 221,0 kB; peor página 234,4 kB comprimidos |
| Accesibilidad estática | incluida en `audit:site` | ✔ sin errores (lang, `h1` único, jerarquía, `alt`, ids, nombres accesibles) |
| Cobertura real de traducciones | `pnpm locales` | pt: 4/4 títulos de programa, 32/80 semanas, **16.950 palabras**; en y ca: 0/80. El README publica estas mismas cifras y un test falla si miente |
| Falsos positivos del escáner en el material | `python -m pytest -q tests/test_material_sin_secretos.py` | **157 passed**: réplica exacta de la regla `curl-auth-user` de gitleaks 8.24.3 sobre los 157 ficheros Markdown del campus, con sus `allowlists` |
| Biblioteca, plan y laboratorio | `pnpm vitest run packages/shared/tests/library.test.ts packages/shared/tests/lab.test.ts packages/shared/tests/tutor-tools.test.ts` | **40 passed** (9 + 23 + 8) |
| Líneas versionadas | `git ls-files \| xargs wc -l` | **103.663** |

### 5.2 Solo verificable en CI (este entorno no tiene navegador)

| Prueba | Resultado sobre `c0440d3` |
|---|---|
| Lighthouse (6 URLs × 3 pasadas, presupuesto ≥ 95 y CWV) | **success** (en `0aec835` y en `1a43b1b`) |
| axe / WCAG 2.2 AA (Playwright) | **success** en `7736d1f` — **42 pruebas (21 rutas × escritorio y móvil)**, con `/biblioteca`, `/plano` y `/laboratorio` dentro de la matriz. En `705e944` eran 36 pruebas (16 rutas). En `4f79372` este check **falló**: el contrato de accesibilidad fijaba `lang="pt"` y la elevación a `pt-BR` lo rompió; se corrigió en `24ffab8` y el conjunto volvió a verde |
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

### 5.4 El falso positivo que encontró la propia CI (y cómo queda cerrado en tres capas)

El 2026-10-11 el trabajo `secretos` se puso en rojo sobre `f0d03a7` con dos hallazgos nuevos de la regla
`curl-auth-user` en `campus/cursos/ciber-ofensiva/semana-08.md:37` y su traducción. Diagnóstico reproducido en este
entorno: el comentario «comprobación rápida con **curl**» quedaba a cinco líneas del `-u` de `ffuf`, y la regla —que
busca `-u`/`--user` en una ventana de cinco líneas— leía la URL de laboratorio como un `usuario:clave`. Tres capas,
ninguna de ellas debilitar el escáner:

1. **El material se corrigió** en `e98b628`: el ejemplo usa `ffuf --url`, la forma larga. El disparador desaparece
   del árbol y el ejemplo queda más legible.
2. **El historial no se reescribe** (prohibido sin autorización), así que el hallazgo seguiría apareciendo por el
   commit antiguo: la exclusión viaja en `.gitleaks.toml` dentro de la propia regla (`[[rules]] id = "curl-auth-user"`)
   y acotada al dominio de laboratorio (`lab.ejemplo.test` / `lab.exemplo.test`) en los tres objetivos que gitleaks
   admite (secreto, coincidencia exacta y línea). Un `curl -u usuario:clave` real en esos mismos ficheros sigue
   rompiendo la CI.
3. **Un control local lo detecta antes de empujar**: `tests/test_material_sin_secretos.py` replica la regla de
   gitleaks 8.24.3 (patrón y `allowlists` incluidos) sobre el Markdown del campus. Su primera ejecución señaló los
   mismos ficheros y las mismas líneas que la CI: la réplica y el binario real coinciden.

Verificación de cierre: `secretos` pasó a **success** en `705e944`, con el control negativo intacto (sin lista
blanca el escaneo ve cinco hallazgos, tres de ellos falsos positivos documentados).

---

## 6. RESIDUAL RISK

| Riesgo | Estado | Nota |
|---|---|---|
| Clave de API real en el historial (F-1) | **ABIERTO / BLOCKED** | Rotación y eventual reescritura del historial: decisión del propietario |
| Manifiestos legados sin auditar (F-3) | **PARCIAL** | 17 avisos medidos, ninguno de producción por encima de «bajo»; Dependabot con 7 avisos sin detalle (API 403) |
| `sprintf-js` sin parche | **ACEPTADO** | Sólo desarrollo (`@lhci/cli` → `js-yaml` → `argparse`); sin versión corregida publicada |
| Cobertura de traducción del material | **PLANNED (parcial)** | 32 de 80 semanas (semanas 1-8 de los cuatro programas) y 4 de 4 títulos de programa en pt-BR; en y ca empiezan de cero. El pipeline, la cobertura medida y el marcado `lang` ya están: lo que falta es texto, y mientras falta se dice en pantalla |
| Credenciales sin registro público ni revocación | **PLANNED** | OB 2.0/3.0 se firman y verifican en el navegador; sin registro central por diseño de anonimato |
| xAPI local y exportable | **ACEPTADO** | «Local-first»: el estudiante exporta su historial; no hay LRS remoto |
| Voz humanizada | **PARCIAL** | Publicada en español y portugués; el resto, pendiente |
| Lighthouse/CWV | **VERIFICADO EN CI** | Depende de la ejecución con navegador; no reproducible en este entorno |
| Aviso cosmético de CI | **ABIERTO (menor)** | `upload-artifact` de Lighthouse avisa de que `.lighthouseci/` no existe al subir el artefacto: el check pasa, el artefacto no se publica |
| Superficie legada (`secure-t-app/`, etc.) | **DECISIÓN DEL PROPIETARIO** | Material que ya no se publica ni se toca sin autorización explícita |
| 120 semanas del plan sin material publicado | **DECLARADO** | La franjas 5.ª a 10.ª (especialidades, arquitectura, CISO, capstone y docencia) están descritas pero no escritas; la página `/plano` lo dice franja por franja y no se anuncia ninguna como disponible |
| Recursos de la biblioteca: enlaces de terceros | **ACEPTADO** | Se enlaza al autor y no se archiva copia (archivarla sería redistribuir material ajeno). Si un recurso cambia o desaparece, la ficha sigue siendo cierta en lo que declara (autor, idioma, tipo); los tests comprueban forma y procedencia, no disponibilidad remota |
| Límites de los instrumentos del laboratorio | **DECLARADO** | Detector de patrones, no verificador: cada instrumento publica su límite en los cuatro idiomas y el expediente lo repite. Un resultado «limpio» no certifica que el texto sea inocuo |
| Matriz axe del navegador | **VERIFICADO EN CI** | `success` en `497b898`: **23 rutas** declaradas (25 pruebas por navegador → 50 ejecuciones en escritorio y móvil), con `/experiencia` dentro. Antes: 21 rutas / 42 pruebas en `7736d1f`. No es reproducible en este entorno (sin Chromium): aquí sólo se ejecuta la auditoría estática, que da 0 errores |
| Estabilidad de la suite TS | **OBSERVADO (sin diagnóstico)** | Una ejecución de `pnpm test` falló una vez sin poder registrar qué prueba (la salida se filtró con un patrón que no capturó el nombre) y no se reprodujo en **cinco ejecuciones posteriores** (355/355 cada una). Se declara como observación: no hay causa identificada y no se descarta una condición de carrera en la lectura de artefactos generados |
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
- **Siguiente incremento (ya decidido, no incluido aquí)**: escribir el material de las franjas 5.ª a 10.ª del plan
  de cinco años (120 semanas) y traducir al pt-BR las semanas 9-20 de los cuatro programas; además, que el campus **consuma** los paquetes publicados
  (`xapi-store.ts` / `progress-store.ts` no referencian todavía `apps/web/public/packages/`), y añadir tests que
  comprueben que el progreso del campus exporta xAPI contra el propio sitio.

---

## 8. GIT EVIDENCE

- **Rama**: `arena/a75428a2-secure-t` (no se ha creado ni empujado ninguna otra). **Árbol de trabajo limpio**.
- **44 commits** desde `eb2b05e` hasta `ee60819`, en orden (del más antiguo al más reciente):

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
705e944 fix(seguridad): el falso positivo de `curl-auth-user` queda documentado y acotado
e98b628 fix(campus): el ejemplo del proxy ya no parece una credencial
f631097 feat(campus): las ocho primeras semanas de los cuatro programas, en portugués
f0d03a7 feat(campus): 20 semanas en portugués y el bloque 5-8 con estructura de motor
f354785 fix(ci,seguridad): la CI vuelve a ejecutarse, la URL publicada es la real y la cadena de suministro queda auditada
ff4c03f chore(ci): publicar los hallazgos de gitleaks como anotaciones del check
f67233c fix(seguridad): cierra los tres falsos positivos de gitleaks sin debilitar el escaneo
6c4327f fix(seguridad): aplicar la lista blanca de gitleaks (la acción no leía el fichero)
0391fe0 fix(seguridad): gitleaks propio, fijado por SHA-256 y con control negativo
99022bc fix(seguridad): el veredicto del escaneo es un conjunto conocido, no una ausencia
5b48cef fix(seguridad): la lista blanca viaja dentro de la regla (la forma global no se aplicaba)
33aa55e chore(ci): todas las acciones al día y sin avisos de Node 20
1a43b1b fix(tests): el contrato de Pages comprueba la política de fijado, no una versión
0aec835 docs(informe): informe de elevación con hallazgos, evidencia y riesgo residual
bda7627 docs(informe): cifras exactas de la CI y suites de terceros en cola
f5d43b9 feat(i18n): el portugués del campus es el de Brasil, y es el que abre la casa
7bcda24 feat(web): cristal negro vivo con luz dorada líquida
5650f20 feat(back): la firma del autor, y sólo en el back
4f79372 fix(i18n): el contenido portugués también es de Brasil, no sólo la etiqueta
24ffab8 fix(e2e): el idioma esperado sale de la fuente única, y es pt-BR
b1a340b feat(identidad): la llave de cuatro dígitos, sin guardar nada
4b61a34 feat(campus): itinerarios abiertos con prerrequisitos y competencias
c0440d3 feat(contenido): traducciones incrementales, con la verdad por delante
6e5c268 feat(producto): currículo de cinco años, biblioteca abierta y laboratorio de IA
7736d1f feat(biblioteca): veinte recursos más y documento generado del plan quinquenal
e81b449 docs(informe): evidencia de CI del ciclo 1.4.0 y actualización de cifras
a4773b1 docs(contrato): las herramientas del tutor entran en el contrato de la API
497b898 feat(experiencia): psicología aplicada verificable, dos escalones y el guiño de Río
cc124b1 docs(informe): la CI del ciclo 1.4.1 en verde y el estado real de la matriz axe
ee60819 docs(readme): la capa de experiencia entra en el README, con sus cifras al día
```

El commit `497b898` entrega el ciclo 1.4.1 completo y los dos siguientes son su documentación. La CI se ejecutó
sobre `497b898` y sobre `ee60819` y **las 8 comprobaciones de trabajo quedaron en verde en ambas** (`CI`: web,
edu-engine, secretos, campus — ejecuciones `38145327384` y `38146258189`; `Calidad`: axe · WCAG 2.2 AA,
Lighthouse ≥ 95 y CWV, Cobertura, Accesibilidad y peso sin navegador — ejecuciones `38145327370` y `38146258148`).

- **Ciclo I (1.4.1)**: `497b898` entrega la capa de psicología con sus veinte pruebas, el guiño de Río en
  SVG en línea, el ritmo de aparición progresivo, la navegación en dos escalones, las transiciones nativas y la
  página `/experiencia` en cuatro idiomas. La verificación local completa está en §9.3; el `pnpm audit:site` de este
  ciclo encontró y ayudó a cerrar cinco errores reales de `id` duplicado antes de llegar al árbol limpio.

- **Ciclo H (1.4.0)**: `6e5c268` entrega la malla de cinco años, la biblioteca y el
  laboratorio de IA con sus pruebas; `7736d1f` amplía la biblioteca a 79 recursos,
  añade `pnpm plan` y el documento generado `docs/PLAN-QUINQUENAL.md` con su test de
  coherencia. La CI de `7736d1f` cierra con **las 8 comprobaciones de trabajo en verde**
  y las dos suites de workflow (`CI` y `Calidad`) verdes, incluida la matriz axe de 21
  rutas y Lighthouse ≥ 95. Este informe se actualiza en el último commit de la rama,
  de modo que las cifras de arriba corresponden al estado verificado y no a una
  intención.

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

## 9. CICLO 1.4.1 — LA EXPERIENCIA COMO INGENIERÍA

La orden de este ciclo fue hacer de todo el sitio «una obra de arte impresionante» aplicando la psicología de la
percepción, **sin perder nada del contenido ni del código ya escrito**, e incluir un guiño a Río de Janeiro —el Cristo
Redentor y el Pan de Azúcar— como sombra discreta en el fondo de la portada, hecha en el propio HTML y animada. Lo
que sigue es lo que se hizo, con su comprobación.

### 9.1 Entregado

| Pieza | Fichero | Qué aporta |
|---|---|---|
| Tokens de psicología | `packages/ui/src/psychology.ts` (nuevo, 259 líneas) | Balance 60·30·10, escala modular 1,25, medida de lectura en `ch`, ritmo de 8 px, troceado de decisiones (Hick/Miller), tiempos y límites de movimiento, mínimos táctiles, bloque de Río. Cada número con su fuente y su límite. |
| Guiño de Río | `apps/web/src/components/rio-horizon.tsx` (nuevo, 179 líneas) | Corcovado con el Cristo y el Pan de Azúcar en SVG **en línea**: cero peticiones de red, `aria-hidden`, siluetas más oscuras que el fondo, bruma de 96 s, luces cada 7 s. `scope` por instancia para no repetir `id`s. |
| Ritmo de aparición | `apps/web/src/components/motion-rhythm.tsx` (nuevo, 95 líneas) | Mejora progresiva: `html[data-psy="on"]` sólo con JS y sin `prefers-reduced-motion`; desplazamiento de 12 px como máximo. |
| Navegación en dos escalones | `apps/web/src/components/site-header.tsx` | Seis destinos primarios y el resto en un `<details>` nativo (Hick y Miller), accesible por teclado y funcional sin JS. |
| Transiciones entre páginas | `apps/web/src/app/globals.css` (`@view-transition`) | Fundido de 220 ms con la plataforma, sin dependencias nuevas. |
| Página del método | `/experiencia` en los cuatro idiomas | Publica la tabla principio → cifra → fichero y enlaza la investigación completa. 5 páginas nuevas, 501 en el export. |
| Documentación | `docs/PSICOLOGIA-Y-EXPERIENCIA.md` | Trazabilidad completa y límites honestos. |
| Pruebas | `packages/ui/tests/psychology.test.ts` (20), `tests/contracts.test.ts` (+9) | Exigen los tokens **contra el CSS y los componentes reales**, no contra sí mismos; las últimas vigilan que el README siga contando la verdad. |

La cifra que resume el ciclo: **1.953 líneas añadidas en 27 ficheros**, 0 dependencias nuevas.

### 9.2 Decisiones y su porqué

1. **Ninguna librería de animación.** Se evaluaron Motion (~12 kB), GSAP core (~22-23 kB) y `@formkit/auto-animate`
   (no aplica al export estático). Se descartaron: la casa promete funcionar sin JS, sin conexión y con peso vigilado
   (`audit:site` avisa por encima de 250 kB), y las View Transitions nativas ya dan el fundido. Coste real medido de
   las constantes compartidas en el cliente: **0,4 kB comprimidos** (medido sobre el export, no estimado).
2. **El guiño es HTML, no imagen.** SVG en línea: no hay petición de red que contradiga el aviso de privacidad ni
   imagen que se rompa sin conexión. Es decoración, así que es invisible para lectores de pantalla y no contiene texto.
3. **El efecto nunca puede quitar contenido.** El reveal se activa *después* de comprobar el soporte y la preferencia,
   y vive detrás de `html[data-psy="on"]`: sin JavaScript no hay nada oculto. Hay un test que lo exige y la auditoría
   del export lo verifica sobre el HTML real.
4. **La accesibilidad manda sobre el guiño.** Con movimiento reducido la bruma se detiene; con alto contraste el
   horizonte desaparece. Ambas cosas están en el CSS y en las pruebas.
5. **Los `id` no se repiten.** La portada lleva el horizonte dos veces (pico-final), y el validador de la casa detectó
   los `id` duplicados: se resolvió con espacio de nombres por instancia en lugar de debilitar la comprobación.

### 9.3 Verificación de este ciclo (local, reproducible)

| Prueba | Comando | Resultado |
|---|---|---|
| Suite TS | `pnpm test` | **358 passed** en 29 ficheros (327 → 358; +31 nuevas) |
| Suite Python | `python -m pytest -q tests/` | **274 passed** |
| Tipos (raíz y web) | `pnpm typecheck` · `pnpm --filter @secure-t/web typecheck` | sin errores |
| Export estático | `pnpm site` | **`_site` 3.405 ficheros**; barrera anti-secretos: 3.368 ficheros revisados |
| Auditoría del export | `pnpm audit:site` | **501 páginas · 0 errores · 5 avisos** (los mismos de siempre: el agente en los cuatro idiomas + pt, 253,1 kB). Mediana 237,5 kB; peor página 253,1 kB. Accesibilidad estática sin errores |
| Cobertura de traducciones | `pnpm locales` | pt 4/4 títulos · 32/80 semanas · **16.950 palabras**; en y ca 0/80 (sin cambios) |
| Líneas versionadas | `git ls-files \| xargs wc -l` | **106.649** (103.663 en el ciclo anterior) |

El primer `pnpm audit:site` de este ciclo **falló con 5 errores** (`ids duplicados: rio-bruma, rio-filo, rio-lejos` en
las cinco portadas) y pasó a 0 al dar espacio de nombres a los degradados por instancia. Se documenta porque es la
prueba de que la auditoría trabaja: el fallo era real y lo encontró la herramienta, no una revisión a ojo.

### 9.4 Lo que este ciclo **no** prueba

- **No hay estudio con usuarios.** Las cifras aplicadas salen de literatura publicada y de normas, no de pruebas con
  personas reales sobre este campus. `NOT VERIFIED`: el efecto emocional («se siente mejor») es una hipótesis
  razonada, no un resultado medido aquí.
- **axe y Lighthouse siguen ejecutándose sólo en CI** (este entorno no tiene navegador). La matriz crece de 21 a
  **23 rutas** (25 pruebas por navegador → 50 ejecuciones en los dos perfiles) y su resultado **ya está confirmado
  sobre `497b898`**: los cuatro trabajos de `Calidad` y los cuatro de `CI`, en verde. El detalle por regla sólo se ve
  en las anotaciones del check cuando hay violaciones; aquí no las hay.
- **El contraste se verifica de forma estática** (auditoría del export y axe). El contraste percibido en pantallas
  reales, con brillo automático o modo nocturno del sistema, no se ha medido.
- **View Transitions** degrada con elegancia donde no existe soporte, pero no se ha medido la diferencia percibida.

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
pnpm audit:site               # 496 páginas: 0 errores y 0 avisos
```

Lighthouse y axe se ejecutan en CI (`.github/workflows/quality.yml`); este entorno no tiene navegador para repetirlos
en local.
