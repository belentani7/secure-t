# secure T · campus AURUM

Instituto abierto de ciberseguridad e inteligencia artificial: **cuatro programas de veinte semanas**, gratuitos,
en cuatro idiomas (PT · ES · EN · CA) y funcionales **sin conexión**. Sin cuentas, sin correo y sin seguimiento.

[![CI](https://github.com/belentani7/secure-t/actions/workflows/ci.yml/badge.svg)](https://github.com/belentani7/secure-t/actions/workflows/ci.yml)
[![Pages](https://github.com/belentani7/secure-t/actions/workflows/pages.yml/badge.svg)](https://github.com/belentani7/secure-t/actions/workflows/pages.yml)
[![Licencia: MIT](https://img.shields.io/badge/licencia-MIT-d4af37.svg)](LICENSE)
[![Contrato](https://img.shields.io/badge/contrato-ANALISIS__ORIGINAL.md-d4af37.svg)](ANALISIS_ORIGINAL.md)

En línea: <https://belentani7.github.io/secure-t/> · Campus AURUM: `/app/` · Campus clásico: `/campus/`

---

## Índice

1. [Qué es](#qué-es)
2. [Arranque en menos de cinco minutos](#arranque-en-menos-de-cinco-minutos)
3. [Arquitectura](#arquitectura)
4. [Los cuatro programas](#los-cuatro-programas)
5. [Agente AURUM](#agente-aurum)
6. [Voz humanizada](#voz-humanizada)
7. [Calendario por país](#calendario-por-país)
7.bis [Repaso espaciado](#repaso-espaciado-sm-2)
8. [Cuatro idiomas, con honestidad](#cuatro-idiomas-con-honestidad)
9. [Privacidad por diseño](#privacidad-por-diseño)
10. [Estándares y credenciales](#estándares-y-credenciales)
11. [Tests y verificación](#tests-y-verificación)
12. [CI y calidad](#ci-y-calidad)
13. [Despliegue](#despliegue)
14. [Estructura del repositorio](#estructura-del-repositorio)
15. [Decisiones (ADR)](#decisiones-adr)
16. [Licencia y atribución](#licencia-y-atribución)
17. [Estado real y hoja de ruta](#estado-real-y-hoja-de-ruta)

---

## Qué es

Un campus **estático**: la portada `index.html` enlaza los cuatro programas y todo el material vive en `campus/`.
No hay base de datos en producción, no hay cuentas de usuario y se puede abrir desde el disco. Sobre esa base
sólida, este repositorio añade el **campus AURUM**: una web con render en servidor, agente de IA con fuentes
citadas, voz humanizada, calendario por país y expediente anónimo verificable.

| Capa | Dónde | Qué promete | Cómo se despliega |
|---|---|---|---|
| Campus clásico | `campus/`, `index.html`, `ui/` | material completo, funciona sin JavaScript | GitHub Pages (raíz) |
| Campus AURUM | `apps/web/` | SSR + export estático, agente, voz, calendario, 4 idiomas | Pages (`/app/`) o cualquier Node |
| Paquetes | `packages/shared/`, `packages/agent/`, `packages/ui/` | i18n, calendario, búsqueda BM25, agente, diseño | se compilan con Next |
| SPA y API de demostración | `client/`, `index.ts` | React + Vite, `/api/tutor` con Ollama local | `pnpm start` (no se publica) |
| Motor educativo | `lib/edu-engine/` | generación y validación del currículo | `node --test tests/quiz.test.mjs` |

Nada de lo que el repositorio prometía antes se ha retirado. Lo nuevo se **suma**: el contrato original, con sus
14 promesas y sus 12 casos críticos, está auditado caso por caso en [ANALISIS_ORIGINAL.md](ANALISIS_ORIGINAL.md).

## Arranque en menos de cinco minutos

```bash
git clone https://github.com/belentani7/secure-t && cd secure-t

# 1. Material didáctico: índice de conocimiento y catálogo (sin red)
pnpm install
pnpm content:all                  # contenido + programas imprimibles + paquetes + SBOM
                                  # (4 cursos · 80 semanas · 151 fragmentos · 60 111 palabras)

# 2. Campus AURUM en modo desarrollo
pnpm web:dev                      # http://localhost:3000

# 3. Verificación completa
pnpm test                         # 233 tests vitest en 19 ficheros (shared + agent + web + contratos)
pnpm typecheck                    # tsc --noEmit, TypeScript estricto
python -m pytest -q tests/        # 117 tests del campus clásico
```

Sin registro, sin claves y sin servicios externos: el único paso que toca la red es `git clone`.

## Arquitectura

```
                    ┌──────────────────────────────────────────────┐
   campus/  ───────▶│ tools/build-content.ts                       │
   (fuente única)   │ catálogo + índice BM25 + digest de integridad│
                    └───────────────┬──────────────────────────────┘
                                    │  public/content/{catalog,knowledge}.json
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌──────────────────┐                                ┌────────────────────────┐
│ Campus clásico   │                                │ apps/web (AURUM)       │
│ HTML+CSS+JS puro │                                │ Next · SSR + export    │
│ offline, sin cuo-│                                │ PT/ES/EN/CA por ruta   │
│ tas, accesible   │                                │ agente, voz, calendario│
└──────────────────┘                                └───────────┬────────────┘
                                                                │
      ┌─────────────────────────────┬───────────────────────────┴──────────┐
      ▼                             ▼                                      ▼
@secure-t/shared            @secure-t/agent                        packages/ui
i18n 4 idiomas             9 agentes + deny-list                  tokens negro/dorado
calendario 15 países        RAG citado + auditoría                 componentes + Storybook
markdown seguro             proveedor opcional (allowlist)         accesibilidad AA
búsqueda BM25 propia        voz (MP3 o síntesis del navegador)
expediente SHA-256
```

Decisiones de arquitectura, con su porqué y sus alternativas descartadas: [`docs/decisions/`](docs/decisions/).

## Los cuatro programas

| Programa | Carpeta | Semanas | Foco |
|---|---|---|---|
| Ciberseguridad Ofensiva: Pensar como Atacante | `campus/cursos/ciber-ofensiva/` | 20 | reconocimiento, explotación ética, informe |
| Ciberseguridad Defensiva: Operar como SOC | `campus/cursos/ciber-defensiva/` | 20 | telemetría, detección, respuesta, mini-SOC |
| Inteligencia Artificial Aplicada y Segura | `campus/cursos/ia-aplicada-segura/` | 20 | modelos, datos, ataques a IA, despliegue |
| Gobernanza y Compliance Digital | `campus/cursos/gobernanza-compliance/` | 20 | ISO 27001, NIST, RGPD, auditoría |

Cada curso tiene veinte semanas con lectura, práctica guiada y caso real, más `quiz.json`, `laboratorio.md`,
`rubrica.md`, `glosario.md`, `chuleta.md`, `examen.md`, `syllabus.md` y `recursos.md`. La rúbrica es siempre
**30 % P1 + 30 % P2 + 40 % P3**, y el examen final exige proyecto, defensa y entregables: no se aprueba marcando
casillas.

## Agente AURUM

Nueve agentes con permisos distintos, deny-list global y **auditoría de cada respuesta**:

| Agente | Función | Permiso principal |
|---|---|---|
| AURUM · mentor | explica el material y admite lo que no sabe | `read_course` |
| Sócrates | pregunta en vez de dar la respuesta | `create_hint` |
| Archivo | organiza apuntes y rutas de repaso | `read_course` |
| Evaluador | propone pruebas y corrige con rúbrica | `propose_assessment` |
| Laboratorio | guía prácticas y valida evidencias | `read_lab` |
| Investigación | sólo fuentes aprobadas, con cita literal | `read_approved_sources` |
| Centinela | vigila el propio uso del agente | `read_lab_output` |
| VOZ | lee el material en voz alta con consentimiento | `synthesize_consented_text` |
| Orquestador | enruta la pregunta al agente correcto | `route_request` |

Garantías, verificadas por tests:

- **Deny-list global** por encima de los permisos: credenciales, datos personales, notas y exámenes en curso no se tocan
  (`engine: "guardrail"`, `authorization: "denied"`).
- **Modo examen** bloquea `start_lab` y `propose_assessment`.
- **Sin fuentes no se improvisa**: si la recuperación no alcanza el umbral, responde «No he encontrado material
  suficiente» en el idioma del estudiante y lo registra como `result: "failure"`.
- **Cada respuesta lleva `audit {authorization, result, action, at}`** sin metadatos sensibles.
- **Proveedor opcional con allowlist**: `SECURE_T_LLM_URL`, `SECURE_T_LLM_ALLOW_HOSTS`. Sin host permitido no se
  llama a la red (guardia anti-SSRF); si el proveedor falla, se usa la composición local y se avisa
  (`provider:fallback:<motivo>`).
- **Modo local por defecto**: el índice y la composición viajan con la página, así que el agente funciona sin
  conexión y la pregunta nunca sale del dispositivo.

Detalle del transporte y del contrato: [CONTRATO_API.md](CONTRATO_API.md).

## Voz humanizada

Cuatro docentes —**VEGA** (ofensiva), **SENTINELA** (defensiva), **ALTAR** (IA aplicada) y **CÓDICE** (gobernanza)—
con guion en los cuatro idiomas. La web reproduce `voice/<idioma>/<curso>.mp3`; si la locución todavía no está
publicada, lee el texto con la voz del sistema del propio dispositivo. Es decir: **escuchar siempre funciona**, y
nunca se dice que hay voz grabada si no existe.

## Calendario por país

Quince calendarios con fuente oficial citada (España por comunidades, Portugal, Brasil, Estados Unidos, Reino
Unido…), reglas de traslado reales (`sundayToMonday`, `usObserved`, `ukSubstitute`), cálculo determinista de Pascua
y exportación **`.ics` RFC 5545** más JSON. El plan de estudio evita festivos, avisa de las semanas cortas, marca
hitos y **obliga a descansar** tras dieciséis semanas seguidas. Todo se calcula en el dispositivo: sin API de
calendario, sin seguimiento.

## Repaso espaciado (SM-2)

Terminar una semana no es aprenderla. Cada una de las 80 semanas entra en un **mazo de repaso** que vuelve a
preguntar justo antes de que se olvide: algoritmo **SM-2** con facilidad ajustable (1,3 – 3,2), intervalos 1 → 6 →
intervalo × facilidad, penalización de fallos y cola de 14 días a la vista.

- Se funda con las semanas que ya has marcado como hechas (`/repaso`); la primera tarjeta vence hoy y el resto se
  reparte para que el mazo no caiga entero el primer día.
- La «respuesta» que se revela son los **apartados reales** de la semana, no contenido inventado.
- Un test de regresión garantiza que decir «difícil» nunca programa la tarjeta más lejos que decir «bien» en todo el
  rango real de intervalos y facilidades (el error clásico al implementar SM-2 a la ligera).
- Todo ocurre en el dispositivo: ni cuenta, ni servidor, ni saber qué has fallado.

## El campus en papel

`pnpm syllabus` compone, desde el mismo material, un **programa imprimible** por curso: HTML autocontenido (A4,
`@page`, sin JavaScript ni recursos externos, abre desde un pendrive) y un `.tex` listo para `pdflatex`. El índice
publica la huella SHA-256 de cada fichero para que dos copias se puedan comparar byte a byte.

| Fichero | Qué es |
|---|---|
| `plan/syllabus-<curso>.html` | programa completo: portada, plan de 20 semanas, objetivos, rúbrica, examen, glosario y recursos |
| `plan/syllabus.tex` | el mismo contenido para componer con LaTeX (80 `\subsection{Semana …}`) |
| `plan/indice.json` | manifiesto con tamaños y huellas, verificado por test |

## Cuatro idiomas, con honestidad

La interfaz, el agente y el calendario hablan **portugués de Brasil (primero), español, inglés y catalán** con
paridad auditada por tests (285 claves idénticas en los cuatro diccionarios). El campus abre en `pt-BR` porque el
portugués de esta casa es el de Brasil, no el de Portugal: etiquetas, `hreflang`, vocabulario y voces.

El **material docente** (las 80 semanas) está escrito en español. La traducción es incremental y sólo se publica
cuando existe de verdad: hoy hay 32 de 80 semanas en portugués de Brasil — **las ocho primeras semanas de los
cuatro programas**, traducidas a mano y una por una, no generadas en bloque. Esta tabla la genera `pnpm locales` leyendo el disco, y `tests/content-i18n.test.ts`
falla si el README dice otra cosa que lo que hay:

| Idioma | Programas con título | Semanas traducidas | Palabras traducidas |
| --- | --- | --- | --- |
| pt | 4/4 | 32/80 | 16950 |
| en | 0/4 | 0/80 | 0 |
| ca | 0/4 | 0/80 | 0 |

Mientras una semana no esté traducida, la página lo dice: sirve el texto en español, lo marca con `lang="es"`
(WCAG 2.2, 3.1.2 Language of Parts) y muestra un distintivo «em espanhol». Nada se anuncia como traducido sin
estarlo, y el recorrido no se rompe: el orden, los objetivos y las credenciales no dependen del idioma.

## Privacidad por diseño

- Sin cuenta, sin correo y sin seguimiento. El progreso vive en `localStorage` con un token anónimo
  (`crypto.randomUUID`) que nunca se envía a ningún sitio.
- El **expediente se puede exportar firmado** con SHA-256 (`crypto.subtle`) y verificarse en otro dispositivo.
- La credencial de aprovechamiento se emite **en el navegador**; se recalcula su hash para comprobarla. No hay
  cadena de bloques ni registro público: eso figura como `PLANNED`.
- `robots.txt` excluye `/progreso` y `/credencial`: el cuaderno del estudiante sólo es suyo.

## Estándares y credenciales

El campus no se queda en su propia web: publica el mismo material en los formatos que el sector usa de verdad, y
cada afirmación de conformidad tiene **un test que la respalda** ([`docs/ESTANDARES.md`](docs/ESTANDARES.md) es la
tabla completa, con lo aplicado y lo que sigue `PLANNED`).

| Qué | Dónde | Cómo se comprueba |
|---|---|---|
| EPUB 3.3 + Accessibility 1.1, SCORM 2004 4th Ed., Common Cartridge 1.3, QTI 1.2 y 2.1, plantillas xAPI | `apps/web/public/packages/` (25 ficheros, `/estandares` en el campus) | `tests/packages-contract.test.ts` (27 tests) |
| Insignia firmada **Open Badges 2.0** con JWS RS256, verificable sin servidor; vista **OB 3.0** | `/credencial` (la clave privada nunca sale del navegador) | `packages/shared/tests/badges.test.ts` (14 tests) |
| Registro de actividad **xAPI 1.0.3** en el dispositivo, con exportación a JSON-LD | `/progreso` | `packages/shared/tests/xapi.test.ts` (15) y `tests/contracts.test.ts` |
| Datos estructurados **schema.org** (Course, Syllabus, BreadcrumbList, Organization) | JSON-LD en las páginas de programa | `packages/shared/tests/seo.test.ts` (11) |
| **RFC 9457** en los errores de la API del agente (`application/problem+json`, `Allow`) | `/api/agent` | `tests/agent-api.test.ts` (8) |
| **SBOM CycloneDX 1.5** de las 790 dependencias, con hash SHA-512 y licencia declarada | `/sbom.cdx.json` | `tools/build-sbom.mjs` |
| **CSP** cerrada por defecto en tres consumidores (cabeceras de Next, `_headers`, metadatos) | `src/lib/security-headers.ts` | `tests/contracts.test.ts` (35) |
| **security.txt** (RFC 9116) con caducidad y alcance | `/.well-known/security.txt` | idem |
| Aviso de privacidad **RGPD** en PT/ES/EN/CA | `/privacidad` | idem |

Lo que **no** hay, y se dice: registro público de credenciales ni revocación en línea, LTI 1.3 y traducción docente
completa del material a EN/CA. Ver el apartado 8 de `docs/ESTANDARES.md`.

## Tests y verificación

```bash
pnpm test                       # 19 ficheros, 233 tests (vitest): shared, agente, web, contratos y estándares
python -m pytest -q tests/      # 117 tests del campus clásico (artefactos publicados)
cd lib/edu-engine && node --test tests/quiz.test.mjs   # motor educativo
pnpm typecheck && pnpm --filter @secure-t/web build
```

Los paquetes y herramientas nuevos añaden, entre otros, el contrato del mazo SM-2, el del material imprimible
(huellas, A4, autocontenido, determinista), el de los paquetes interoperables (EPUB, SCORM, Common Cartridge, QTI),
el de las credenciales firmadas, el del vocabulario xAPI, el de los datos estructurados, el de la API del agente
(RFC 9457) y el de la capa de estándares: `tests/contracts.test.ts` comprueba que **cada evidencia citada en
`docs/ESTANDARES.md` y en la página de estándares existe de verdad** y que `security.txt` no anuncia claves que no
estén publicadas.

`tests/test_campus.py` valida el esquema de los quizzes, la coherencia de la evaluación, la estructura de las
páginas de curso, los enlaces reales de la portada, el SEO mínimo, la honestidad de `idiomas.md` y que el workflow
de Pages no lleve tokens personales. Los paquetes nuevos añaden **93 tests**: calendario (Pascua 2024-2030,
traslados, ICS plegado a 75 octetos), paridad de idiomas, renderizador Markdown seguro, BM25, expediente firmado y
las garantías del agente (deny-list, SSRF, modo examen, citas, auditoría).

## CI y calidad

| Workflow | Qué comprueba |
|---|---|
| `ci.yml` | pytest, JSON del campus, gitleaks sobre el historial completo (binario fijado por SHA-256 y control negativo de la lista blanca), eduforge, vitest + tsc, build de la web |
| `pages.yml` | ensambla `_site` con lista blanca y barrera anti-secretos antes de publicar |
| `quality.yml` | auditoría estática sin navegador, axe/WCAG 2.2 AA, Lighthouse (≥ 95 en las cuatro categorías), cobertura ≥ 80 % |

El trabajo `secretos` no se conforma con «no hay hallazgos»: el veredicto es **«el historial completo contiene
exactamente los hallazgos conocidos y documentados»**, con un control negativo que demuestra que el escaneo sí ve los
falsos positivos cuando la lista blanca no está. Hoy queda **una exposición histórica aceptada y visible**: una clave
de API del autor original en `fix_weeks.py` (commit `732eba5`), un script que ya no existe en el árbol. Se publica como
aviso en cada ejecución; rotarla y limpiar el historial corresponde al propietario del repositorio.

Medido en este repositorio (no prometido: medido):

| Métrica | Valor | Cómo se obtiene |
|---|---|---|
| Cobertura de los módulos críticos | 91,3 % statements · 94,3 % líneas · 79,7 % ramas | `pnpm test:coverage` |
| Accesibilidad estática de 476 páginas | **0 errores, 0 avisos** (lang, un solo `h1`, jerarquía, `alt`, ids únicos, botones con nombre, enlaces con `href`) | `pnpm audit:site` |
| Componentes inventariados | 790, con SHA-512 de cada uno y 483 licencias declaradas | `/sbom.cdx.json` |
| JavaScript en la primera carga | 200 kB comprimidos de mediana · 204 kB en la peor página | `pnpm audit:site` |
| Peso de la portada en HTML | 9,0 kB comprimidos | `pnpm audit:site` |
| Contraste de la identidad | AA (4,5:1) en los 10 pares reales, AAA (7:1) en alto contraste | `packages/ui/tests/tokens.test.ts` |

Lighthouse, axe con navegador real y los Core Web Vitals se ejecutan en `quality.yml` sobre el export estático. Sus
presupuestos están escritos en `.lighthouserc.json` (LCP < 2,5 s · INP < 200 ms · CLS < 0,1). Este entorno de
construcción no tiene navegador, así que **no se afirma haberlos medido aquí**: lo que sí se midió es lo de la tabla.

## Despliegue

```bash
# GitHub Pages: campus clásico en la raíz + AURUM en /app
pnpm --filter @secure-t/web build:pages

# Cualquier servidor Node (SSR real, agente con /api/agent)
pnpm --filter @secure-t/web build && pnpm --filter @secure-t/web start

# Todo en local, con Ollama opcional para el proveedor LLM
docker compose up --build
```

## Estructura del repositorio

```
campus/            material clásico (intacto) + campus clásico navegable
client/            SPA React + Vite y API de demostración
apps/web/          campus AURUM (Next.js, SSR + export estático)
packages/shared/   i18n, calendario, markdown, búsqueda, conocimiento, progreso
packages/agent/    agentes, gobernanza, RAG, auditoría, voz
packages/ui/       sistema de diseño AURUM (negro/dorado) + Storybook
lib/edu-engine/    motor educativo (AGPL-3.0-only, se conserva)
tests/             contrato del campus clásico (pytest) y contratos vitest
tools/             generación de contenido, ensamblado del sitio, auditorías
docs/decisions/    ADR: cada decisión con su porqué
```

## Decisiones (ADR)

- [ADR-0001 · Un solo repositorio, dos campus](docs/decisions/ADR-0001-dos-campus.md)
- [ADR-0002 · Next.js con SSR y export estático del mismo código](docs/decisions/ADR-0002-next-ssr-y-export.md)
- [ADR-0003 · Identidad AURUM: negro y dorado](docs/decisions/ADR-0003-identidad-aurum.md)
- [ADR-0004 · Licencia MIT para lo nuevo, AGPL-3.0-only para edu-engine](docs/decisions/ADR-0004-licencia.md)
- [ADR-0005 · Búsqueda propia (BM25) en lugar de fuse.js](docs/decisions/ADR-0005-busqueda-propia.md)
- [ADR-0006 · Agente local por defecto, proveedor opcional con allowlist](docs/decisions/ADR-0006-transportes-del-agente.md)
- [ADR-0007 · Calendario determinista y offline](docs/decisions/ADR-0007-calendario-offline.md)
- [ADR-0008 · Contenido como fuente única y digest de integridad](docs/decisions/ADR-0008-contenido-fuente-unica.md)
- [ADR-0011 · Cabeceras de seguridad y CSP en un sitio también estático](docs/decisions/ADR-0011-cabeceras-y-csp.md)
- [ADR-0012 · Estándares abiertos: paquetes, credenciales, xAPI y SBOM](docs/decisions/ADR-0012-estandares-interoperables.md)

## Licencia y atribución

- Código nuevo de este repositorio: **MIT** (ver [LICENSE](LICENSE)).
- `lib/edu-engine/`: **AGPL-3.0-only**, se conserva tal cual.
- Material didáctico y datos: se mantienen bajo la licencia del repositorio original.
- El proyecto nació del trabajo de **Pedro Belentani** (<https://github.com/belentani7>), que sigue siendo el autor
  original; esta elevación no cambia el nombre del repositorio ni reclama autoría ajena.

## Estado real y hoja de ruta

Lo que está terminado se puede comprobar con un comando. Lo que no, dice `PLANNED`.

| Área | Estado | Comprobación |
|---|---|---|
| Campus clásico, 4×20 semanas | **VERIFIED** | `python -m pytest -q tests/` |
| i18n PT/ES/EN/CA (interfaz) | **VERIFIED** | `pnpm test` (paridad de claves) |
| Calendario + `.ics` | **VERIFIED** | tests de Pascua, traslados y plegado |
| Agente, gobernanza y auditoría | **VERIFIED** | 18 tests de garantías |
| Web AURUM (476 páginas estáticas) | **VERIFIED** | `pnpm --filter @secure-t/web build` |
| Repaso espaciado SM-2 | **VERIFIED** | `pnpm test` (14 casos del algoritmo) |
| Programas imprimibles (HTML A4 + LaTeX) | **VERIFIED** | `pnpm syllabus` y sus 9 tests de contrato |
| Paquetes interoperables (EPUB, SCORM, CC, QTI 1.2/2.1, xAPI) | **VERIFIED** | `pnpm packages` y 27 tests de contrato |
| Credenciales Open Badges 2.0/3.0 firmadas y verificables | **VERIFIED** | 14 tests de firma, manipulación y forma |
| SBOM CycloneDX y cabeceras de seguridad (CSP) | **VERIFIED** | `pnpm sbom` · `tests/contracts.test.ts` |
| Traducción del material docente (EN/CA) | `PLANNED` | `campus/idiomas.md` |
| Registro público de credenciales / cadena de bloques | `PLANNED` | `campus/credencial.html` |
| Revisión humana de evidencias | `PLANNED` | texto de la credencial |
| Locuciones MP3 de los cuatro docentes | **PARCIAL**: 6 locuciones publicadas (bienvenida + 4 programas en ES/PT); el resto, respaldo del navegador | `apps/web/public/voice/` |
| Registro público de emisiones y revocación de credenciales | `PLANNED` | `docs/ESTANDARES.md` |
| LTI 1.3 como herramienta externa en un LMS | `PLANNED` | `docs/ESTANDARES.md` |

La regla del proyecto es la del repositorio original, y no cambia: **REALITY > CLAIMS**.

El informe de la última elevación —estado, hallazgos de seguridad, evidencia de pruebas, riesgo residual y
readiness— está en [`docs/INFORME-ELEVACION.md`](docs/INFORME-ELEVACION.md).
