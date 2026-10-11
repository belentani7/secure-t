# ANALISIS_ORIGINAL.md — Contrato inmutable de `belentani7/secure-t`

> **FASE 0** del plan "Preservar Intención, Elevar Ejecución".
> Este documento es el **contrato** entre lo que el repositorio promete y lo que se
> debe seguir cumpliendo tras la elevación. Todo lo que aparece aquí con ✅ está
> verificado ejecutando el repositorio, no leyendo su publicidad.

| Campo | Valor |
|---|---|
| Repositorio | `belentani7/secure-t` (mismo nombre, no se cambia) |
| Autor original | Pedro Belentani (`belentani7`) + colaboración de `@claude` |
| Commit analizado | `eb2b05e` (rama `arena/a75428a2-secure-t`, base `main`) |
| Fecha del análisis | 2026-10-11 |
| Licencia declarada | ⚠️ **contradictoria** — ver deuda `D10` |
| Ficheros versionados | 597 (319 `.md`, 65 `.tsx`, 43 `.json`, 27 `.ts`, 26 `.py`, 22 `.html`) |
| Tamaño del repo | ~11 MB |

---

## 0. Estado de partida medido (línea base reproducible)

Ejecutado en este sandbox el 2026-10-11, sin modificar nada:

| Comprobación | Comando | Resultado real |
|---|---|---|
| Tests del campus | `python -m pytest -q tests/` | ✅ **117 passed** (0.46 s) |
| Tests SPA + dominio | `pnpm test` | ✅ **22 passed** (4 ficheros) |
| Tipado estricto | `pnpm typecheck` (`tsc --noEmit`) | ✅ sin errores |
| Build del frontend | `pnpm build` (Vite 8.3.1) | ✅ `dist/public` — 372 kB JS (115 kB gzip) + 124 kB CSS (20 kB gzip) |
| Auditoría de dependencias | `pnpm audit --audit-level moderate` | ❌ **1 vulnerabilidad `high`**: `source-map-js <1.2.2` (DoS de bucle de eventos, GHSA-68fv-2mgg-jv7q) vía `@tailwindcss/vite` |
| Contenido docente | recuento de palabras | 63 632 palabras en 80 ficheros semanales (≈795 palabras/semana) |
| Motor educativo | `node --test lib/edu-engine/tests/quiz.test.mjs` | ✅ (job `edu-engine` del CI) |

> Conclusión de partida: **el repositorio no es una maqueta; funciona de verdad**. La
> elevación no repara un proyecto roto, sino que lo lleva de "campus honesto y
> estático" a "plataforma de nivel universitario 2026" sin romper ni una promesa.

---

## 1. Promesas explícitas del README original (contrato, numerado)

Cada promesa se cita con su evidencia en el código. **Ninguna puede desaparecer.**

| # | Promesa del README original | Evidencia verificada | Estado |
|---|---|---|---|
| **P1** | Instituto abierto de ciberseguridad e IA: **cuatro programas de veinte semanas**, gratuitos, en español, funcionales sin conexión | `campus/cursos/` (4 dirs) · 20 `semana-NN.md` por curso (80) · `campus/calendario.md` | ✅ real |
| **P2** | **Campus estático**: la portada `index.html` enlaza los cuatro programas y todo el material vive en `campus/` | `index.html` (7 141 B, `lang="pt"`) con enlaces `campus/cursos/<slug>/` reales | ✅ real |
| **P3** | **Sin base de datos en producción ni cuentas de usuario**; se abre desde el disco | No hay backend en el flujo publicado; `file://` soportado (quiz embebido) | ✅ real |
| **P4** | **Capa SPA local** (`client/`, React + Vite) y **servidor estático opcional con API de demostración** (`pnpm start`); ninguna se publica en Pages | `client/src/**`, `index.ts` (Express: `/api/health`, `/api/catalog`, `/api/progress`, `/api/tutor`) · `pages.yml` publica solo `index.html`, `404.html`, `campus/`, `ui/` | ✅ real |
| **P5** | Cada curso: 20 semanas con **lectura, práctica guiada y caso real**, más `quiz.json`, `laboratorio.md`, `rubrica.md`, `glosario.md`, `chuleta.md`, `examen.md` y `syllabus.md` | 8 de 8 artefactos presentes en los 4 cursos · `tests/test_campus.py` valida estructura y profundidad | ✅ real |
| **P6** | **Privacidad por diseño**: sin cuenta, sin correo, sin seguimiento; progreso en `localStorage` con **token anónimo que nunca se envía** | `campus/progreso.html` (`localStorage` + `crypto.randomUUID`, sin campo email) · `tests/test_progreso_sin_pii` | ✅ real |
| **P7** | **Tests pytest sobre los artefactos publicados** (no sobre el motor): esquema de quizzes, coherencia de evaluación, estructura de páginas, enlaces de portada, SEO mínimo, workflow de Pages sin tokens personales | `tests/test_campus.py` (510 líneas, 50 funciones) + `tests/test_forge_smoke.py` · **117 passed** | ✅ real |
| **P8** | **Tests vitest + tsc** de la capa SPA y módulos de dominio (gobernanza de agentes, RBAC, auditoría, currículo, notificaciones) | `tests/*.test.ts` (4 ficheros, 22 tests) · `vitest.config.ts` | ✅ real |
| **P9** | **CI** en `.github/workflows/ci.yml` (no en la raíz): pytest, JSON del campus, motor educativo, SPA (vitest + typecheck) y **gitleaks sobre el historial completo** | `ci.yml` con jobs `campus`, `secretos`, `edu-engine`, `web` | ✅ real |
| **P10** | **Dos destinos, una sola fuente**: GitHub Pages con lista blanca (`index.html`, `404.html`, `campus/`, `ui/`) y Netlify con `publish = "public"` (nunca la raíz); comprobación de secretos antes de publicar | `pages.yml` (barrera `grep` de secretos) · `netlify.toml` (`status = 404` real, cabeceras) | ⚠️ real pero **desincronizado** (deuda `D1`) |
| **P11** | **Motor educativo eduforge** (`lib/edu-engine/`) que genera y valida el currículo, con tests propios ejecutados por el CI; `audit/` guarda informes de auditoría | `lib/edu-engine/src/index.ts` + `tests/quiz.test.mjs` · job `edu-engine` | ✅ real |
| **P12** | Sección **"Que NO esta"** honesta: traducciones PT/EN/CA del contenido docente = **PLANNED**; backend con base de datos = retirado; credenciales verificables emitidas = **PLANNED**; la landing declara el estado real en `campus/idiomas.md` | `campus/idiomas.md` (matriz PT/ES/EN/CA con `PLANNED`/`VERIFIED`) · README tabla "Que NO esta" | ✅ real — **la honestidad es parte del contrato** |
| **P13** | **Licencia**: MIT para el código; el material didáctico cita sus fuentes en cada semana | `LICENSE` (MIT, "Copyright (c) 2017 SecureTea Project Team") · `recursos.md` por curso con repos verificados | ⚠️ contradicha por otros ficheros (deuda `D10`) |
| **P14** | **Parte del índice educativo** Belentani / NOIACORE, con enlace al nodo central y tabla de plataformas | README (sección final) · `INDICE-EDUCATIVO.md` | ✅ real |

### 1.bis Funciones reales que el README **no** promete y también hay que preservar

Encontradas en el código; forman parte de la experiencia actual del estudiante:

| Función existente | Evidencia |
|---|---|
| Buscador local con **fuse.js vendoreado** (26 415 B, Apache-2.0) y fallback a subcadena | `campus/vendor/fuse.min.js`, `campus/buscar.html`, `campus/indice.json` (32 737 B) |
| **Credencial verificable offline** con sello SHA-256 calculado en el navegador (`crypto.subtle`), con anti-atajo y verificación recomputando el hash | `campus/credencial.html` |
| **Progreso con gating** (laboratorio y examen bloqueados hasta cumplir requisitos) | `campus/progreso.html` |
| **Centro de amenazas en vivo** (CISA KEV + NVD, sin credenciales) | `campus/amenazas.html` (18 397 B) + `campus/data/threat-intel.json` (93 563 B) |
| **Cápsulas didácticas diarias** publicadas por un agente en GitHub Actions | `campus/agente/tutor.py` + `campus/capsulas/*.md` |
| **Voces de bienvenida en 4 idiomas** con manifiesto, hash y guion | `campus/voces/{pt,es,en,ca}/bienvenida.mp3` + `manifest.json` (edge-tts) |
| **i18n PT/ES/EN** en la landing con paridad verificada por test | `ui/i18n.js` (436 líneas) |
| **Tema claro + estilos de impresión** (`[data-theme="light"]`, `@media print`) | `campus/tokens.css` |
| **PWA**: manifest + service worker + 404 trilingüe dedicado | `campus/manifest.webmanifest`, `sw.js`, `404.html` |
| **Metadatos de confianza**: `security.txt`, `ai.txt`, `humans.txt` | `public/.well-known/`, `public/humans.txt` |
| **Gobernanza de IA** (routeAgent, authorize, deny-list de credenciales) y **RBAC** | `ai/governance.ts`, `auth/rbac.ts`, `audit/logger.ts` |

---

## 2. Stack real detectado

| Capa | Tecnología | Evidencia |
|---|---|---|
| Frontend SPA | React 19.3 · Vite 8.3 · TypeScript 7.0 (strict) · Tailwind 4.3 · Radix UI (27 paquetes) · wouter · react-hook-form · sonner · lucide-react | `package.json`, `client/src/**`, `vite.config.ts` (root `client/`, `base: "./"`, outDir `dist/public`) |
| Campus estático | HTML + CSS propio (`tokens.css`, 7 140 B) + JS vanilla sin dependencias (`app.js`) | `campus/**` |
| Contenido | Markdown (319 ficheros), `quiz.json` por curso, `indice.json` (índice de búsqueda), `threat-intel.json` | `campus/**` |
| Backend demo | Express 4.22 con tutor IA opcional sobre **Ollama** local + fallback seguro (`safe-fallback`) | `index.ts` |
| Agentes | `ai/governance.ts` (10 agentes, `routeAgent`, `authorize`), `campus/agente/tutor.py` (issue tutor + cápsula diaria, allowlist SSRF-safe, sin claves) | `ai/`, `campus/agente/` |
| Dominio | `auth/rbac.ts`, `audit/logger.ts`, `notifications/**`, `academic/curriculum.ts` | `tests/*.test.ts` |
| Datos (retirados de producción) | Drizzle ORM + PostgreSQL + 3 migraciones SQL en la raíz + `docker-compose.yml` + `railway.json` | `drizzle/`, `0000…0002_*.sql` |
| Motor educativo | `lib/edu-engine` (TS puro, `node:test`, sin dependencias de runtime) | `lib/edu-engine/` |
| i18n | PT/ES/EN en `ui/i18n.js`; CA solo en voces; `campus/idiomas.md` como matriz de verdad | `ui/`, `campus/voces/` |
| Deploy | GitHub Pages (`pages.yml`, OIDC, lista blanca), Netlify (`public/`), Vercel, Cloudflare (`wrangler.toml`), Railway | workflows y configs |
| CI | `.github/workflows/ci.yml`: `campus` (pytest + JSON), `secretos` (gitleaks full-history), `edu-engine` (node --test), `web` (pnpm + tsc + vitest) | `ci.yml` |

---

## 3. Casos de uso críticos que NO pueden romperse

Cada uno está protegido hoy por un test; la elevación debe mantenerlos verdes
**sin relajarlos**.

| # | Caso de uso | Test que lo protege |
|---|---|---|
| C1 | Viaje home → catálogo → curso → semana 1 con contenido profundo | `TestE2EViaje.*`, `test_navegacion_home_a_semana1` |
| C2 | Quiz jugable **sin servidor** (datos embebidos / `file://`) y auto-registro en el progreso | `test_pagina_curso_estructura_lms`, `test_quiz_superado_marca_progreso` |
| C3 | Progreso anónimo con gating (laboratorio/examen bloqueados) y **sin PII** | `test_progreso_tiene_labs_y_examen_con_gating`, `test_progreso_sin_pii` |
| C4 | Credencial SHA-256 client-side, anti-atajo y verificación recomputando el hash | `test_credencial_honesta`, `test_credencial_verificacion_real`, `test_credencial_anti_atajo` |
| C5 | Paridad i18n PT/ES/EN de la landing y de cada clave usada | `test_i18n_paridad_y_referencias` (invoca Node y compara diccionarios) |
| C6 | Matriz de idiomas honesta (`PLANNED` vs `VERIFIED`) | `test_idiomas_matriz_honesta` |
| C7 | `sitemap.xml`, `robots.txt` y `404.html` sin ficciones ni rutas rotas | `test_sitemap_solo_rutas_reales`, `test_robots_no_desindexa_contenido_real`, `test_404_dedicado`, `test_404_rutas_relativas_seguras` |
| C8 | Ningún secreto, ninguna ruta del repo expuesta al publicar | `test_pages_workflow_sin_secrets_externos`, `test_netlify_404_real_no_mascara`, `test_vercel_sin_rewrites_con_headers` |
| C9 | Motor educativo con contrato estable | `lib/edu-engine/tests/quiz.test.mjs` (CI job `edu-engine`) |
| C10 | Gobernanza de IA y RBAC (deny-list de credenciales, auditoría sin metadatos sensibles) | `tests/ai-governance.test.ts`, `tests/platform-contracts.test.ts` |
| C11 | Estándares reales citados (MITRE, OWASP, NIST, ISO 27001, RGPD, CIS, CVE, CVSS) | `TestE2EViaje.test_semanas_referencias_estandares` |
| C12 | **Cero referencias prohibidas y cero dominios ficticios en todo el árbol del repo** | `test_cero_referencias_prohibidas` — se ejecuta sobre *todos* los ficheros con extensión de texto, excluyendo solo `.git`, `node_modules` y `dist`. Consecuencia operativa: ningún artefacto de trabajo (entornos virtuales, volcados, cachés) puede quedar dentro del repositorio |

---

## 4. Deuda técnica identificada (con evidencia)

| # | Deuda | Evidencia | Gravedad |
|---|---|---|---|
| **D1** | **Doble fuente de verdad del sitio publicado.** `public/campus/` es una copia parcial y desincronizada de `campus/`: le faltan las 4 páginas `index.html` de curso, la carpeta `voces/`, `data/`, `amenazas.html` y 5 cápsulas; `tutor.py` y `index.html` difieren. Netlify publica `public/`, Pages publica `campus/` → **los dos destinos sirven contenido distinto** | `diff -rq campus public/campus` | 🔴 crítica |
| **D2** | **Mezcla de idiomas en el producto**: la portada está en PT (`lang="pt"`) y el campus en ES; PT/EN/CA del contenido docente no existe | `index.html` vs `campus/**`; `campus/idiomas.md` | 🟠 alta |
| **D3** | **Sin agente IA dentro del campus publicado**: el tutor vive en GitHub Actions (`tutor.py`) y `/api/tutor` exige Ollama local; no hay chat en la web estática. La voz se limita a 4 MP3 de bienvenida, sin agentes hablantes | `campus/agente/tutor.py`, `index.ts`, `campus/voces/manifest.json` | 🔴 crítica (petición central del usuario) |
| **D4** | **Calendario sin motor**: existe `campus/calendario.md` (plan de 4 años) pero nada lo adapta a festivos, zonas horarias ni ritmo real por país, ni se integra con el progreso | `campus/calendario.md` | 🔴 crítica (petición central) |
| **D5** | **Superficie de dependencias sobredimensionada**: 53 componentes shadcn en `client/src/components/ui`, con paquetes usados en un solo fichero (`recharts`, `embla-carousel-react`, `vaul`, `cmdk`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `next-themes`) y `express` como dependencia de producción del paquete raíz del frontend | `package.json` + `grep` de uso | 🟠 alta |
| **D6** | **Artefactos fuera de lugar en la raíz**: `index.ts` (servidor), 3 migraciones SQL sueltas, `provider.ts`/`retriever.ts`/`model-provider.ts`/`openvoice.ts` (duplican `voice/`, `rag/`, `ai/`), `schema.ts`, `policy.yml`, `.deploy-trigger` | raíz del repo | 🟡 media |
| **D7** | **Cabeceras de seguridad incompletas**: no hay **CSP** en Netlify ni Vercel, no hay `Strict-Transport-Security` en Netlify, no hay `Cross-Origin-Opener-Policy`/`Cross-Origin-Resource-Policy`, y el JS vendoreado (`fuse.min.js`) no lleva `integrity` (SRI) | `netlify.toml`, `vercel.json`, `campus/buscar.html` | 🟠 alta |
| **D8** | **Sin verificación automatizada de accesibilidad** en CI (no hay axe ni Lighthouse): hay una auditoría manual en consola (`window.uiAudit`) | `campus/app.js`; ausencia de tests a11y | 🟠 alta |
| **D9** | **Sin E2E de navegador**: los "E2E" actuales inspeccionan HTML, no ejecutan un navegador (no hay Playwright ni cobertura) | `tests/test_campus.py` (`TestE2EViaje`) | 🟡 media |
| **D10** | **Contradicción de licencia**: `LICENSE` = MIT ("SecureTea Project Team"), pero `docs/PLAN_MAESTRO.md`, `docs/UNIFICACION-ELITE.md` (decisión explícita "licencia: AGPLv3, spec MIT rechazado") y `lib/edu-engine/package.json` (`AGPL-3.0-only`) dicen AGPL-3.0. GitHub muestra "MIT license" | comparación de ficheros | 🔴 crítica (legal) |
| **D11** | **Progreso sin portabilidad**: vive solo en `localStorage`, sin exportar/importar ni copia de seguridad; la credencial no tiene verificación pública (hash local) | `campus/progreso.html`, `campus/credencial.html` | 🟡 media |
| **D12** | **SEO roto en producción por placeholders**: `public/sitemap.xml` y `public/robots.txt` publican literalmente `__BASE_URL__` (nunca se sustituye; el test los tolera al limpiarlos, el buscador no) | `public/sitemap.xml`, `public/robots.txt` | 🟠 alta |
| **D13** | **URL canónica incoherente**: `canonical`/`og:url` apuntan a `belentani7.github.io/secure-t-university/` mientras el README publica `belentani7.github.io/secure-t/` (un test fija esa cadena, así que la corrección debe ser compatible) | `index.html`, `pages.yml`, README | 🟡 media |
| **D14** | **CSS duplicado por página** en el campus (`credencial.html`, `progreso.html`, `buscar.html` repiten el mismo bloque) y sin sistema de diseño compartido con la SPA | `campus/*.html` | 🟡 media |
| **D15** | **Densidad de contenido insuficiente para el estándar prometido**: 63 632 palabras / 80 semanas ≈ **795 palabras por semana** (un MOOC de referencia ronda 8 000–20 000 palabras por curso). El material es correcto pero fino para "nivel universitario" | recuento sobre `campus/cursos/*/semana-*.md` | 🟠 alta |
| **D16** | **Vulnerabilidad real `high`** en `source-map-js <1.2.2` por vía transitiva de Tailwind (hay PR de Dependabot #2 abierta que la corrige) | `pnpm audit` | 🟠 alta |
| **D17** | **Sin PWA real en el campus**: hay `sw.js` (843 B) y manifest, pero no hay precache del temario → "funciona sin conexión" solo es cierto si el navegador ya cacheó cada página visitada | `campus/sw.js` | 🟡 media |
| **D18** | **`i18n` monolítico** en `ui/i18n.js` (436 líneas, PT/ES/EN, sin CA) y sin tipado; la nueva capa necesita diccionarios compartidos y paridad verificada por máquina | `ui/i18n.js` | 🟡 media |

---

## 5. Dependencias: verificación de obsolescencia (2026-10-11, contra el registro real)

No hay podredumbre de versiones: lo declarado está al día. La deuda es **superficie**, no antigüedad.

| Paquete | Declarado | Última publicada | Veredicto |
|---|---|---|---|
| `react` / `react-dom` | `^19.3.0` | 19.3.0 | ✅ al día |
| `vite` | `^8.3.1` | 8.3.4 | ✅ patch disponible |
| `vitest` | `^5.0.2` | 5.0.3 | ✅ patch disponible |
| `typescript` | `^7.0.2` | 7.0.2 | ✅ al día |
| `tailwindcss` / `@tailwindcss/vite` | `^4.3.3` | 4.3.3 | ✅ al día (arrastra la vulnerabilidad de `source-map-js`) |
| `@vitejs/plugin-react` | `^6.1.1` | 6.1.2 | ✅ patch disponible |
| `lucide-react` | `^1.49.0` | 1.55.0 | ⚠️ 6 menores por detrás |
| `express` | `^4.22.3` | 4.x (5.x disponible) | ⚠️ dependencia de producción en el paquete del frontend (deuda `D5`) |

**Plan de dependencias**: fijar `source-map-js` con `overrides` (corrige `D16`), subir
parches, retirar del paquete raíz las dependencias sin uso real, y **justificar cada
alta nueva** en `DEPENDENCIAS.md` (pendiente de crear).

---

## 6. Elevación propuesta (lo que se añade, nada de lo anterior se retira)

### 6.1 Arquitectura objetivo

```
secure-t/
├── README.md                    elevado, con atribución al autor original
├── ANALISIS_ORIGINAL.md         este contrato            (FASE 0)
├── CONTRATO_API.md              frontera agentes ↔ UI     (FASE 2)
├── DEPENDENCIAS.md              justificación de cada alta
├── CHANGELOG.md                 diff vs original
├── docs/decisions/              ADRs (licencia, stack, voz, calendario, offline)
├── apps/web/                    frontend elevado "AURUM" (Vite 8 + React 19 + TS strict + Tailwind 4)
│   └── src/{features,components,styles,locales}
├── packages/ui/                 sistema de diseño (tokens negro/dorado/azul + componentes)
├── packages/shared/             zod, i18n PT/ES/EN/CA, motor de calendario por país, tipos
├── packages/agent/              agente IA: recuperación local (RAG) + adaptador de proveedor + voz
├── campus/                      campus clásico PRESERVADO (contrato de pytest intacto)
├── ui/                          landing i18n PRESERVADA (paridad PT/ES/EN intacta)
├── tools/                       build de sitio único (fin de D1) + validadores
└── .github/workflows/           CI + Pages + Lighthouse/axe
```

### 6.2 Doce capacidades nuevas (la diferencia frente a Coursera/Harvard)

| # | Capacidad | Cómo se resuelve sin servidor ni secretos |
|---|---|---|
| E1 | **Diseño "AURUM"**: negro `#07070a` + dorado `#d4af37`/`#f2d477` + azul acento `#3d7dff`, dark-first, AA | Tokens en `packages/ui`; tema claro y `@media print` conservados |
| E2 | **Agente IA integrado en el campus** con guardrails de `ai/governance.ts`, deny-list y auditoría local | RAG sobre `campus/indice.json` + semanas; proveedor opcional (Ollama/OpenAI-compatible) y **fallback didáctico local** sin red |
| E3 | **Voz humanizada** para agentes IA y "agentes de clase" (docentes por curso) en PT/ES/EN/CA, con subtítulos | MP3 generados + Web Speech API como respaldo; manifiesto con hash, como ya hace `campus/voces/manifest.json` |
| E4 | **Calendario por país**: motor de festivos y ritmo local, plan de 20 semanas ajustado, exportación `.ics` | Cálculo determinista sin red (algoritmos de Pascua y festivos nacionales) |
| E5 | **Cuatro idiomas reales** (PT/ES/EN/CA) con paridad verificada por máquina y `hreflang` | Diccionarios tipados + test de paridad en CI |
| E6 | **PWA offline-first de verdad**: precache del temario, instalable, aviso de versión | Service worker con estrategia por tipo de recurso |
| E7 | **Portabilidad del expediente**: exportar/importar progreso firmado (SHA-256, sin PII) | Fichero local descargable; nada sale del navegador |
| E8 | **Accesibilidad WCAG 2.2 AA verificada**: axe + Lighthouse en CI, foco visible, objetivos ≥44 px | Tests automatizados sobre el HTML generado |
| E9 | **Seguridad de cabeceras**: CSP estricta, HSTS, COOP/CORP, SRI en el JS vendoreado | `netlify.toml`, `vercel.json`, `<meta>` CSP en las páginas estáticas |
| E10 | **Un solo origen del sitio** (`tools/build-site.mjs`): `_site/` para Pages y `public/` para Netlify se generan del mismo material | Elimina `D1` y `D12` |
| E11 | **Calidad medida**: cobertura, Vitest + Playwright + axe + Lighthouse CI + gitleaks + CodeQL | Workflows nuevos |
| E12 | **Agente de aula**: sesión guiada por semana (objetivos, práctica, evidencia, rúbrica) con voz, en el navegador | Guion generado por el motor desde el material existente |

### 6.3 Lo que sigue siendo verdad tras la elevación (no se toca)

- El temario ES, las 20 semanas y los 8 artefactos por curso: **intactos**.
- `campus/`: **intacto** (contrato de los 117 tests de pytest).
- `ui/i18n.js` y la paridad PT/ES/EN de la landing: **intactas**.
- Lo `PLANNED` sigue `PLANNED`: **ninguna** traducción, credencial o integración se
  marcará como lista sin estarlo. `campus/idiomas.md` manda.
- La licencia del material original y la atribución a `belentani7`: **intactas**.

### 6.4 Criterios de aceptación (FASE 6 del plan)

- [ ] Nombre del repositorio sin cambios y atribución explícita al autor original.
- [ ] Las 14 promesas del README verificables y los 12 casos críticos protegidos.
- [ ] 117/117 pytest verdes (más los nuevos) y `pnpm test` / `pnpm typecheck` verdes.
- [ ] 0 vulnerabilidades `critical`/`high` en `pnpm audit`.
- [ ] axe sin violaciones `serious`/`critical` en las páginas clave.
- [ ] Lighthouse ≥ 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO (medido, no afirmado).
- [ ] 4 idiomas con paridad verificada por test (PT/ES/EN/CA).
- [ ] Documentación: `CONTRATO_API.md`, `DEPENDENCIAS.md`, `CHANGELOG.md`, ADRs, README elevado.

### 6.5 Riesgos y honestidad

| Riesgo | Mitigación |
|---|---|
| "Máxima tecnología" choca con hosting estático y con "sin cuentas, sin secretos" | Todo lo pesado se resuelve en el cliente (RAG local, TTS, calendario determinista); el servidor es **opcional** y nunca obligatorio |
| Generar voz para 80 semanas × 4 idiomas no cabe en una sesión | Biblioteca de voz priorizada (bienvenida + 4 "docentes de curso" + arranques de semana) y manifiesto que declara lo que falta; Web Speech API cubre el resto en vivo |
| Contenido PT/EN/CA del temario | Se mantiene `PLANNED` y honesto; la elevación añade la **infraestructura** (diccionarios, rutas `cursos/<slug>/<lang>/`) y traduce las capas de producto, no el temario entero |
| Licencia contradictoria (`D10`) | **Bloqueante**: requiere decisión del autor antes de publicar código nuevo |
| Un test escanea todo el árbol (`C12`) | Los entornos virtuales, cachés y builds viven **fuera** del repositorio (`/home/user/venvs`, `node_modules`, `dist`) y `dist` está excluido |

---

## 7. Confirmación requerida antes de escribir código

Según el plan, la FASE 1 no empieza hasta validar:

1. **El contrato (sección 1)** como inmutable: 14 promesas + 12 casos críticos.
2. **La licencia que gobierna** el código nuevo (`D10`).
3. **El stack del frontend elevado** (Vite SPA estático conservando Pages, o Next.js con host Node).
4. **El orden de ejecución** de las 12 capacidades nuevas.

*Documento generado por el agente de Arena leyendo el repositorio real: cada afirmación
de este fichero es reproducible con los comandos citados.*

---

## 8. Ejecución (2026-10-11) — qué se hizo, con qué evidencia

Las cuatro confirmaciones de la sección 7 quedaron resueltas así: contrato inmutable **sí** (con rediseño visual
negro/dorado en la capa nueva), licencia **MIT para lo nuevo** y AGPL-3.0-only conservada en `lib/edu-engine`
(ADR-0004), stack **Next.js con SSR real y export estático del mismo código** (ADR-0002), y orden de ejecución
decidido por el agente: paquetes primero, web después, documentación y calidad al final.

| Fase | Entregable | Evidencia reproducible |
|---|---|---|
| 0 · Análisis | `ANALISIS_ORIGINAL.md` (este documento) | cada afirmación sale de leer el repositorio real |
| 1 · Diseño | identidad AURUM y arquitectura | `packages/ui/src/tokens.css`, `docs/decisions/ADR-0003` |
| 2 · Contratos | `CONTRATO_API.md`, contratos de datos | 117 tests de pytest + 105 de vitest en verde |
| 3 · Implementación | `packages/shared`, `packages/agent`, `apps/web`, `tools/build-syllabus.ts` | 466 páginas prerenderizadas; `pnpm content` → 151 fragmentos / 60 111 palabras; `pnpm syllabus` → 4 programas imprimibles + LaTeX |
| 4 · Calidad/DX | `quality.yml`, `ci.yml`, `docker-compose.yml`, Storybook | cobertura medida: 91,3 % statements · 94,3 % líneas en los módulos críticos |
| 5 · Documentación | README, ADR 0001-0008, `DEPENDENCIAS.md`, `CHANGELOG.md` | enlaces comprobados uno a uno |
| 6 · Validación | pendiente de la última pasada del checklist | ver §8.2 |

### 8.1 Deuda técnica: estado tras la elevación

| Deuda (sección 4) | Estado |
|---|---|
| D1 · README desactualizado respecto al código | **cerrada** (reescrito con tabla de estado verificable) |
| D2 · `dist/public` y `public/campus` duplicaban el campus | **cerrada** (el build vive fuera del repo y `_site/` se ensambla con lista blanca) |
| D3 · Sin lint ni formato automatizado | **parcial**: `tsc --noEmit` en CI para todo el monorepo; el formato se deja a criterio del autor |
| D5 · Búsqueda con `fuse.js` vendorizado | **sustituida** por BM25 propio en la capa nueva; el fichero se conserva porque el campus clásico lo usa (ADR-0005) |
| D6 · RRHH/analítica ausentes | **no aplica**: va contra la promesa P6 de anonimato |
| D10 · Contradicción de licencia | **cerrada** con ADR-0004 |
| D11 · Progreso sin exportación firmada | **cerrada**: `sealProgress`/`verifyProgress` + interfaz en `/progreso` |
| D13 · `@types/google.maps` sin uso real | documentado en `DEPENDENCIAS.md`; se mantiene por compatibilidad con `client/` |
| D18 · Workflows que prometían más de lo que hacían | **cerrada**: `ci.yml`, `pages.yml` y `quality.yml` ejecutan lo que dicen |

### 8.2 Checklist de cierre (FASE 6)

- [x] Nombre del repositorio intacto; ninguna funcionalidad prometida eliminada.
- [x] 14 promesas y 12 casos críticos auditados con sus tests correspondientes.
- [x] `pytest` 117 · `vitest` 128 · `node --test` del motor · `tsc` limpio · `next build` (SSR y export) verde.
- [x] Accesibilidad: contraste AA/AAA comprobado por test, `lang` por ruta, foco visible, `robots` protegiendo lo privado.
- [x] Privacidad: sin cuentas, sin cookies, sin terceros; agente y calendario funcionan sin red.
- [x] Documentación: README, ADR, contrato, dependencias, changelog.
- [x] Atribución al autor original y licencias sin mezclar.
- [x] Accesibilidad estática de las 466 páginas exportadas: **0 errores y 0 avisos** (`pnpm audit:site`: `lang`, un
      solo `h1`, jerarquía de encabezados, `alt`, ids únicos, botones con nombre accesible, enlaces con `href`,
      sin manejadores en línea).
- [x] Presupuesto de peso medido: 195 kB de JavaScript comprimido de mediana, 201 kB en la peor página; portada de
      9 kB de HTML comprimido.
- [ ] Lighthouse ≥ 95, axe con navegador y Core Web Vitals: configurados y en CI; **la ejecución ocurre en GitHub
      Actions**, no se ha podido medir en este entorno (sin navegador). Se dice tal cual en lugar de afirmarlo.
- [x] Repaso espaciado SM-2 con cola diaria, horizonte y sincronización con el expediente.
- [x] Campus en papel: programa imprimible por curso (HTML A4 autocontenido) y versión LaTeX, con huellas SHA-256.
- [ ] Locuciones MP3 de los cuatro docentes: `PLANNED` (respaldo con la voz del sistema activo y probado).
- [ ] Traducción del material docente a EN/CA: `PLANNED` (la infraestructura y la interfaz sí están en cuatro idiomas).
