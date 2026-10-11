# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Versionado: [SemVer](https://semver.org/lang/es/).
Los commits siguen Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).

## [1.4.0] — 2026-10-11

Los cinco años: el campus pasa de tener cuatro programas sueltos a tener una malla completa, una biblioteca de
recursos abiertos verificada por test y un laboratorio de IA con instrumentos que hacen trabajo de verdad. Nada de
esto se declara terminado donde no lo está: la página del plan dice, en la misma tabla, cuántas semanas están escritas
y cuántas faltan.

### Añadido
- **Currículo de cinco años, 200 semanas en 10 franjas de 20** (`packages/shared/src/curriculum-5y.ts`): los cuatro
  programas publicados son las cuatro primeras franjas (`CAMPUS_WEEKS_PUBLISHED = 80`); las seis restantes
  —especialidad en defensa, especialidad en ofensiva, arquitectura y nube, dirección de seguridad (CISO), proyecto
  final y docencia— quedan declaradas con su modo, sus competencias y sus recursos. `validateCurriculum()` demuestra
  que la cobertura 1..200 no tiene huecos ni solapes y `phaseAt(semana)` responde qué se estudia cada semana del
  quinquenio.
- **Página del plan** (`/plano` y `/es|en|ca/plano`) con las cinco años desplegados, leyenda por modo de estudio,
  enlace al programa de cada franja y aviso explícito de lo que aún no tiene texto.
- **Biblioteca abierta de 79 recursos** (`packages/shared/src/library.ts`) y su página (`/biblioteca`): 27 canales,
  8 plataformas de práctica, 6 cursos abiertos, 7 laboratorios, 2 CTF y 29 documentos oficiales y de comunidad, con
  filtro por tipo, idioma del contenido, nivel, acceso y programa. `DOMINIOS_PROHIBIDOS` y un test impiden que entre un espejo o un
  agregador de cursos de pago.
- **Laboratorio de IA** (`packages/shared/src/lab.ts` y `/laboratorio`): cinco instrumentos deterministas que se
  ejecutan en el dispositivo —auditoría de prompt contra OWASP LLM01/ATLAS/CWE con evidencia y mitigación, redacción
  de datos personales con dígitos verificadores (CPF/CNPJ) y Luhn, auditoría de fundamento frase a frase, presupuesto
  de contexto sobre modelos abiertos y evaluación ponderada de salvaguardas— más exportación del expediente en
  Markdown. Ningún instrumento promete de más: cada uno publica su límite y su referencia normativa.
- **Herramientas del tutor de sólo lectura** (`packages/shared/src/tutor-tools.ts`): `listar_programas`,
  `resumen_semana`, `recomendar_biblioteca`, `ruta_itinerario` y `plan_estudio` se ejecutan en cada pregunta y viajan
  en el campo `tools` del contrato del agente; la consola las muestra («Qué hizo el tutor») con su resumen y sus
  elementos citados. Sin red, sin escritura y sin datos personales.
- **Claves de interfaz en los cuatro idiomas**: 285 → **471** claves, con paridad exacta auditada por test.

### Cambiado
- El mapa del sitio pasa de 7 a 13 secciones y el menú, el pie y la matriz de accesibilidad incorporan las tres rutas
  nuevas (21 rutas × escritorio y móvil en axe).
- El agente devuelve `tools` además de `answer`, `sources`, `followUps` y `audit`; en modo proveedor externo las
  herramientas se ejecutan igual, de modo que el material extra nunca depende del modelo.

### Corregido
- Enlaces internos del plan con `Link`/`localePath` (el `basePath` lo añade Next): `audit:site` vuelve a 0 avisos.
- Vocabulario de Brasil en las claves nuevas: «arquivo» y «anônimo», no «ficheiro» ni «anónimo»
  (`tests/portugues-brasil.test.ts` lo vigila).

## [1.3.0] — 2026-10-11

Fase docente: el campus deja de tener promesas sueltas y pasa a tener material. Las ocho primeras semanas de los
cuatro programas quedan escritas en portugués de Brasil, las semanas 5-8 de tres programas dejan de ser borradores y
el escáner de secretos gana un control que impide que un ejemplo didáctico se lea como una credencial.

### Añadido
- **32 de 80 semanas en portugués de Brasil** (`campus/cursos/*/i18n/pt/semana-*.md`): las semanas 1-8 de
  `ciber-ofensiva`, `ciber-defensiva`, `ia-aplicada-segura` y `gobernanza-compliance`, traducidas una por una
  (16.950 palabras medidas por `pnpm locales`). Cada traducción conserva el contrato del curso: objetivos,
  referencias reales (NIST, ATT&CK, OWASP, ISO, LGPD/RGPD), caso real y ejercicio con evidencia.
- **Semanas 5-8 completas** en `ciber-defensiva`, `ia-aplicada-segura` y `gobernanza-compliance`: pasan de tres
  secciones genéricas a una semana entera con lectura, caso real, laboratorio y criterios de aceptación.
- **`tests/test_material_sin_secretos.py`**: réplica exacta de la regla `curl-auth-user` de gitleaks 8.24.3
  (patrón y `allowlists`) sobre los 157 ficheros Markdown del campus, parametrizada por fichero (157 comprobaciones).
- **Nuevo contrato de traducción**: cada semana traducida del disco se sirve traducida, con el título real del
  fichero y su `translationSource` (`tests/content-i18n.test.ts`, 6 comprobaciones en total).

### Corregido
- **Falso positivo del escáner de secretos** en `campus/cursos/ciber-ofensiva/semana-08.md`: el comentario con la
  palabra `curl` quedaba a cinco líneas del `-u` de `ffuf` y la regla `curl-auth-user` leía la URL de laboratorio
  como un `usuario:clave`. El ejemplo pasa a `ffuf --url` y `.gitleaks.toml` documenta la exclusión acotada al
  dominio de laboratorio, en los tres objetivos que gitleaks admite. El historial no se reescribe.
- **Estructura del motor** en las semanas reescritas: `Objetivo de la semana`, `Lectura principal` y
  `Práctica guiada` donde el contrato las exige (`test_profundidad_inyectada`), sin perder las referencias.

### Notas de verificación
- vitest **275/275** (24 ficheros) · pytest **274/274** (25 ficheros) · `pnpm locales` 4/4 programas · 32/80 semanas.
- CI de `705e944`: 8/8 en verde, incluidos `secretos` (con control negativo), `axe · WCAG 2.2 AA` y
  `Lighthouse ≥ 95 y CWV`. El fallo de `f0d03a7` en `secretos` se investigó, se corrigió y se documentó (§5.4 del
  informe).

## [1.2.0] — 2026-10-11

Fase de producto: el campus abre en portugués de Brasil, con cristal negro vivo, identidad sin datos personales y
una estructura abierta con itinerarios. La traducción del material es incremental y su cobertura se mide.

### Añadido
- **Portugués de Brasil por defecto** (PT > ES > EN > CA): `pt-BR` en `lang`, `hreflang`, `x-default`, Open Graph,
  manifiesto PWA y voces. `LOCALE_LABELS`, `OG_LOCALES`, `SPEECH_LOCALES` y `alternateLanguages()` son la fuente
  única; el diccionario portugués se reescribió en pt-BR (arquivo, registro, anônimo, baixar, salvar, baralho,
  revisão, LGPD junto al RGPD) y un test impide que vuelvan las formas de Portugal.
- **Cristal negro vivo con luz dorada líquida**: `.aurum-glass`, `.aurum-luz` y `.aurum-filo`, con el brillo del
  botón por detrás del texto. Todo lo animado vive en `prefers-reduced-motion: no-preference`: con movimiento
  reducido la composición es la misma, congelada.
- **Llave de cuatro dígitos** (`packages/shared/src/identity.ts`): identidad seudónima derivada con PBKDF2-SHA256
  (210.000 iteraciones) a partir de los cuatro últimos dígitos del móvil y una semilla del dispositivo. El PIN no se
  guarda —el almacén sólo admite semilla y token— y la interfaz dice en voz alta que cuatro dígitos no son un
  secreto. Siete pruebas, incluida la que comprueba sobre el código que el panel no persiste nada.
- **Itinerarios abiertos** (`packages/shared/src/tracks.ts`, `/itinerarios`): cuatro caminos con prerrequisitos sin
  ciclos y competencias acreditadas. Son el orden recomendado, nunca un requisito para entrar.
- **Traducción incremental del material**: `campus/cursos/<slug>/i18n/<idioma>/`. Si la traducción no existe, la
  página sirve el español marcado con `lang="es"` y un distintivo visible (WCAG 2.2, 3.1.2). `pnpm locales` publica
  la cobertura real y el README la repite bajo vigilancia de test. Primer contenido: 4/4 títulos de programa y la
  semana 1 completa del programa ofensivo en pt-BR.
- **Firma del autor en el back** (`tools/firma.ts`), con la dedicatoria completa fuera del front y un test que lo
  demuestra.
- **Contenido docente con su idioma real** en la lección, el índice del campus y los itinerarios.

### Cambiado
- El contrato de accesibilidad lee la etiqueta de idioma de la fuente única (`LOCALE_LABELS`) en vez de fijarla a
  mano: fue lo que cazó la CI cuando el portugués pasó a `pt-BR`.
- `campus/idiomas.md` y el README dicen la cobertura exacta del material, idioma a idioma.

## [1.1.0] — 2026-10-11

Capa de estándares oficiales sobre el campus: lo que el repositorio afirma se puede verificar con una herramienta
externa, y lo que no está se dice en voz alta. Nada se marca conforme sin un test que lo demuestre.

### Añadido
- **QTI 2.1**: además del XML suelto de QTI 1.2 (legado), cada programa publica un paquete de contenido
  (`<curso>-qti21.zip`) con `imsmanifest.xml`, el `assessmentTest` y sus seis ítems, que es lo que importan las
  plataformas actuales. Seis pruebas nuevas contrastan la respuesta correcta contra `campus/cursos/*/quiz.json`.
- **Open Badges 3.0 en VC-JWT**: la credencial del estudiante se firma también como JWT (RFC 7519) con los claims
  `iss`/`sub`/`jti`/`nbf`, se descarga con un botón propio y el verificador acepta tanto el sobre de OB 2.0 como un
  VC-JWT. Cuatro pruebas nuevas cubren firma, manipulación de la carga útil, clave ajena y formato inválido.

- **Paquetes interoperables** (`pnpm packages`, `tools/build-packages.ts`): EPUB 3.3 + Accessibility 1.1, SCORM 2004
  4th Edition con SCO en XHTML y API `cmi.*`, IMS Common Cartridge 1.3, IMS QTI 1.2 y plantillas xAPI 1.0.3 para los
  cuatro programas. Escritor ZIP propio (`tools/lib/zip.ts`) y validador XML estricto (`tools/lib/xml.ts`), con
  huellas SHA-256 publicadas en `index.json`. 22 tests de contrato.
- **Credenciales abiertas** (`packages/shared/src/badges.ts`): aserción Open Badges 2.0 firmada con **JWS RS256**
  desde el navegador, `kid` derivado por SHA-256 de la clave pública, verificador que acepta fichero o texto pegado
  y explica el motivo del rechazo, y vista Open Badges 3.0. 14 tests.
- **xAPI 1.0.3** (`packages/shared/src/xapi.ts` + `apps/web/src/lib/xapi-store.ts`): declaraciones con UUID derivado,
  duraciones ISO 8601 y actor anónimo; registro local que **nunca** se envía a un LRS y exportación JSON-LD desde
  `/progreso`. Enganchado a la checklist, al cuestionario, a la voz y a la emisión de credenciales.
- **Datos estructurados** (`packages/shared/src/seo.ts`): `Organization`, `WebSite`, `Course` con temario semana a
  semana, `ItemList` y `BreadcrumbList`, sin valoraciones inventadas. 11 tests.
- **Repaso espaciado SM-2** (`/repaso`): algoritmo con monotonía difícil < bien < fácil comprobada, sesión de repaso
  con 29 claves i18n por idioma y precache del service worker. 14 tests.
- **Programas imprimibles** (`pnpm syllabus`): HTML A4 autocontenido por curso, LaTeX, índice con SHA-256 y pruebas
  de contrato (9).
- **Privacidad y seguridad**: aviso RGPD en los cuatro idiomas (`/privacidad`), `security.txt` conforme a RFC 9116,
  política CSP única consumida por `next.config.ts`, `public/_headers` y metadatos, y **RFC 9457** en los errores de
  la API del agente (`application/problem+json`, cabecera `Allow`).
- **SBOM CycloneDX 1.5** (`pnpm sbom`): 790 componentes del lockfile con hash SHA-512 y licencia tomada del paquete
  instalado (`NOASSERTION` cuando no la declara), número de serie derivado del contenido y salida reproducible.
- **`docs/ESTANDARES.md`** y ADR-0011/0012, con la tabla de conformidad y sus límites explícitos.
- **Contratos nuevos**: `tests/contracts.test.ts` (35 tests: security.txt, equivalencia de cabeceras, SBOM, página de
  estándares, rutas por idioma y voz publicada) y `tests/agent-api.test.ts` (8: errores RFC 9457, límites y
  ausencia de cookies). El workflow de integración verifica que paquetes, programas y SBOM están al día.

### Seguridad

- **Clave real en el historial (hallazgo abierto, no aceptado en silencio)**: al escanear el historial **completo**
  —hasta ahora no se hacía: la acción de gitleaks sólo miraba el rango del último envío— aparece una clave de API de
  DeepSeek en `fix_weeks.py` (commit `732eba5`), un script del autor original que ya no existe en el árbol. El
  veredicto del trabajo `secretos` la publica como **aviso en cada ejecución** en vez de darla por buena, y queda
  como riesgo residual: rotar la clave en el proveedor es cosa del propietario, y borrarla del historial exige
  reescribirlo (acción destructiva que no se hace sin autorización).
- **El veredicto del escaneo es un conjunto conocido, no una ausencia de hallazgos**: `secretos` exige que el
  historial completo contenga exactamente los hallazgos documentados; cualquier otro —incluido uno nuevo en
  cualquier rama— falla el trabajo. La lista blanca sólo acota dos falsos positivos verificados (un UUID de ejemplo y
  la palabra «RS256-signed»), con la regla y el texto exactos, nunca el fichero entero.

### Cambiado

- `pnpm content:all` reúne contenido, programas imprimibles, paquetes y SBOM; Docker, Pages y calidad lo usan.
- `pnpm audit:site` fija `--base /app` y `build:pages` aplica el prefijo del despliegue: la auditoría vuelve a dar
  **0 errores y 0 avisos** sobre 476 páginas.
- La auditoría del agente compara marcas de tiempo con tolerancia (evita un fallo intermitente de milisegundos).

### Corregido

- **La CI del repositorio nunca se ejecutaba**: `ci.yml` tenía un YAML inválido (un paso con dos puntos sin
  comillas), así que GitHub no lanzaba ninguno de sus cuatro trabajos —pytest del campus, gitleaks, motor educativo
  y web— y el repositorio llevaba desde entonces sin esa red. Corregido y validado con el analizador de YAML.
- **La URL publicada del sitio**: el flujo de Pages, el 404 y el contrato de pytest usaban
  `secure-t-university`, un nombre que ya no existe (su URL responde 404); la API de Pages del repositorio devuelve
  `https://belentani7.github.io/secure-t/`. Ahora los metadatos (canónico, hreflang, JSON-LD), los enlaces del 404 y
  el contrato apuntan a la URL real.
- **La comprobación de contenido generado** fallaba en cada ejecución por comparar un `git diff` sobre ficheros que
  llevan `generatedAt`: ahora compara el material (`sourceDigest`) e ignora la fecha, que no identifica a la fuente.
- **gitleaks**: el escaneo de secretos encontró tres «claves» que son falsos positivos verificados uno a uno (dos
  identificadores anónimos de prueba y una frase de la interfaz en inglés). Los identificadores se generan ahora en
  ejecución —ningún literal en el repositorio— y `.gitleaks.toml` acota la lista blanca a esa regla y a ese texto:
  cualquier otro hallazgo, también en el historial, sigue rompiendo la construcción.
- **El escaneo de secretos ya no depende de una acción de terceros**: se descarga el binario oficial de gitleaks
  8.24.3 —licencia MIT, verificada su **SHA-256** contra el `checksums.txt` de la misma release— y se ejecuta a mano
  con `--config .gitleaks.toml`. La acción anterior (`gitleaks/gitleaks-action`) ignoraba la lista blanca y no era
  inspeccionable desde fuera; con el binario fijado se sabe exactamente qué versión escanea y con qué configuración.
  Además se añade un **control negativo** en el propio trabajo: si el escaneo no ve los tres falsos positivos cuando
  la lista blanca no está, la CI falla. Sin ese control, un «verde» no probaría nada.
- **La lista blanca de gitleaks no se aplicaba**: la forma global (`[[allowlists]]` con `targetRules`) no suprimía
  nada cuando la configuración extiende la del motor —medido en la propia CI: «control=4, final=4»—. Ahora las
  exclusiones viajan **dentro de la regla** (`[[rules.allowlists]]` sobre `generic-api-key`), que es la ruta que
  `extend()` fusiona de verdad, y el control negativo recorta el fichero en la marca `# ===SIN-LISTA-BLANCA===` para
  comprobar que sin ellas el escaneo sí ve los tres falsos positivos.
- **Acciones de los workflows al día** (todas fijadas por commit y con sus entradas comprobadas antes de subir):
  `checkout` v4.4.0 → **v7.0.1**, `setup-node` v4 → **v7.1.0**, `setup-python` v5 → **v7.0.0**,
  `pnpm/action-setup` v4 → **v6.1.0**, `upload-artifact` v4 → **v7.0.2**, `upload-pages-artifact` v3 → **v5.0.0**
  y `deploy-pages` v4 → **v5.0.1**. Con ellas desaparecen los avisos de obsolescencia de Node 20 en todos los trabajos.
- **Cadena de suministro**: de 11 avisos de dependencias a 1 (aceptado con motivo, sin parche publicado), acciones de
  los workflows fijadas por commit, Dependabot para npm/pip/actions y `pnpm audit:deps` como puerta obligatoria de CI.

- **Accesibilidad con navegador** (axe, WCAG 2.2 AA): dos regiones de navegación compartían etiqueta
  (`landmark-unique`), los enlaces dentro de texto sólo se distinguían por color (`link-in-text-block`; ahora se
  subrayan desde una regla única de la hoja de estilos) y las zonas con desplazamiento no eran alcanzables con el
  teclado (`scrollable-region-focusable`).
- Hidratación: la instantánea de servidor del expediente estaba memoizada, así que React ya no avisa por
  `getServerSnapshot` inestable en las páginas con progreso.
- El servidor estático de pruebas sirve el export con su prefijo (`--base /app`): axe y Lighthouse reciben el sitio
  real y no un 404 en cada ruta.
- `security.txt` ya no anuncia una clave PGP inexistente y su `Policy` apunta a una página real.
- **Consola limpia y metadatos correctos**: la CSP del sitio estático ya no incluye `frame-ancestors` (un `<meta>`
  no puede aplicarla y el navegador lo denuncia en la consola), `canonical` y `hreflang` son absolutos en las cuatro
  lenguas (Lighthouse exige enlaces completos), el logotipo de la cabecera se nombra con su propio texto visible y el
  sitio publica por fin un icono.
- El service worker deriva sus rutas de la carpeta real del despliegue: publicado en `/app`, precargaba `/pt` y no
  guardaba nada, así que el modo sin conexión no llegaba a funcionar.
- Las utilidades del paquete compartido exigen `ArrayBuffer` explícito en las llamadas a WebCrypto (compatibilidad
  con TypeScript 7) y `PublicJwk` declara `kid`, en lugar de castings repartidos.

## [1.0.0] — 2026-10-11

Elevación del campus `belentani7/secure-t`: se conserva todo lo que el repositorio prometía (14 promesas, 12 casos
críticos auditados en `ANALISIS_ORIGINAL.md`) y se añade una capa nueva que va más allá de un campus de vídeo:
agente de IA con fuentes citadas, voz humanizada, calendario por país, cuatro idiomas con paridad verificada y
expediente anónimo firmado.

### Añadido

- **`packages/shared`** — i18n PT/ES/EN/CA con paridad auditada (179 claves), 15 calendarios con fuente oficial y
  reglas de traslado (Pascua determinista 2024-2030, `sundayToMonday`, `usObserved`, `ukSubstitute`), exportación
  `.ics` RFC 5545, renderizador Markdown seguro por construcción, búsqueda **BM25 propia**, índice de conocimiento y
  expediente anónimo con sello SHA-256 (`sealProgress`, `verifyProgress`, `credentialText`).
- **`packages/agent`** — nueve agentes con matriz de permisos, deny-list global, modo examen, recuperación con
  umbral (0.4) y citas literales, composición local sin red, transporte LLM opcional con **allowlist anti-SSRF**,
  auditoría saneada y docentes con voz (VEGA, SENTINELA, ALTAR, CÓDICE) en cuatro idiomas.
- **`apps/web`** (campus AURUM) — Next.js 16 con un solo código para **SSR real** y **export estático**:
  - 460 páginas prerenderizadas (4 idiomas × [4 programas + 80 semanas] + secciones), `sitemap.xml`, `robots.txt`,
    `manifest.webmanifest` y service worker con estrategia «primero el caché».
  - Portada AURUM negro/dorado con la métrica real del campus (programas, semanas, horas, 0 €).
  - Campus navegable: índice con buscador BM25 en el navegador, ficha de programa, lección de semana con checklist y
    agente de clase con voz, cuestionario corregido al momento.
  - Agente AURUM: consola con elección de agente, modo examen, fuentes citadas, auditoría visible, lectura en voz
    alta y transporte local por defecto.
  - Calendario: constructor de plan por país/región con descarga `.ics` y `.json`, aviso de semanas cortas, hitos y
    descansos obligatorios.
  - Progreso y credencial: expediente anónimo, importación/exportación firmada, credencial SHA-256 calculada en el
    navegador y verificador de hash.
  - Panel de amenazas: CISA KEV (1758 entradas, 20,9 % ligadas a ransomware) y críticos recientes del NVD, sin red.
- **Repaso espaciado (SM-2)** — `packages/shared/src/review.ts` + `/repaso`: mazo de 80 semanas, cola diaria,
  reprogramación por facilidad (1,3 – 3,2), previsualización del intervalo de cada nota, horizonte de 14 días y
  sincronización con las semanas ya completadas. Sin servidor: el mazo vive en el dispositivo.
- **Programas imprimibles** — `tools/build-syllabus.ts` (`pnpm syllabus`): un HTML A4 autocontenido por curso (sin
  JavaScript ni recursos externos, se abre desde un pendrive), un `.tex` para `pdflatex` y un manifiesto con la
  huella SHA-256 de cada fichero, verificado por test.
- **`tools/audit-site.mjs`** — auditoría estática de todo el export: `lang`, un solo `h1`, jerarquía de encabezados,
  `alt`, ids únicos, botones con nombre accesible, enlaces con `href`, ausencia de manejadores en línea y
  presupuesto de JavaScript comprimido por página.
- **`packages/ui`** — sistema de diseño AURUM (tokens negro/dorado/azul, tipografía, espaciado, contraste AAA) con
  Storybook y pruebas de accesibilidad.
- **Documentación** — `ANALISIS_ORIGINAL.md` (contrato y deuda), `CONTRATO_API.md`, `DEPENDENCIAS.md`, este
  changelog y ocho ADR en `docs/decisions/`.
- **Infraestructura** — `tools/build-content.ts` (fuente única → catálogo + índice + digest), `tools/build-site.mjs`
  (ensamblado con lista blanca para Pages), `docker-compose.yml` (web + Ollama opcional), workflows `ci.yml`
  (ampliado con la web), `pages.yml` (publica el campus clásico en la raíz y AURUM en `/app/`) y `quality.yml`
  (Lighthouse ≥ 95, axe/WCAG 2.2 AA, Core Web Vitals, cobertura ≥ 80 %).

### Cambiado

- `README.md` reescrito como puerta de entrada: badges, arranque en cinco minutos, arquitectura, tabla honesta de
  estado (`VERIFIED` / `PLANNED`) e índice de ADR.
- `ai/governance.ts` y `audit/logger.ts` pasan a reexportar los módulos canónicos de `packages/agent`, de modo que
  no existan dos implementaciones de la misma política.
- `tests/test_campus.py`: el escáner de referencias prohibidas ahora ignora directorios de artefactos (`.next`,
  `out`) y comprueba **todos** los ficheros de texto; no se ha relajado ninguna aserción.

### Corregido

- **SM-2**: la fórmula ingenua de «difícil» (intervalo × facilidad × 1,2) podía programar la tarjeta más lejos que
  decir «bien». Ahora «difícil» usa ×1,2 sobre el intervalo y un test recorre todo el rango real para asegurar la
  monotonía difícil < bien < fácil.
- **Programas imprimibles**: el escape de LaTeX se hacía por reglas sucesivas y volvía a escapar la salida de la
  primera (`\textbackslash{}` → `\textbackslash\{\}`), lo que impedía compilar; ahora es una pasada por carácter.
- **Enlaces con `basePath`**: en el export estático, `next/link` ya prefija `/app`; los enlaces crudos y los
  metadatos no lo hacían. Lo detectó la auditoría estática (aparecían rutas `/app/app/ca`).
- **Jerarquía de encabezados**: las 320 lecciones tenían dos `h1` (el de la página y el del material); el
  renderizador ahora desplaza un nivel el material incrustado.

- La primera semana del plan de estudio ya no solapa con la segunda (se recorta al domingo de su propia semana).
- `sessionsForWeek` recibía el fin de semana mal en la semana de examen; ahora calcula las fechas correctas.
- El plegado de líneas ICS respeta los 75 octetos en UTF-8 (medido en bytes, no en caracteres).
- El carnaval de Uruguay usaba la Pascua como desplazamiento duplicado; ahora son dos reglas explícitas.
- `highlight()` encuentra el término aunque en el texto lleve tilde y en la consulta no («telemetria» → «telemetría»).

### Seguridad

- Sin cuentas, sin cookies, sin analítica y sin llamadas a terceros en el camino del estudiante.
- Guardia anti-SSRF probada: sin host en la allowlist no se ejecuta `fetch` alguno.
- La auditoría nunca registra la clave del proveedor, el token anónimo ni el texto de la pregunta.
- `robots.txt` excluye `/progreso` y `/credencial`.

### Notas

- `PLANNED` (no hecho): traducción del material docente a EN/CA, locuciones MP3 de los cuatro docentes, registro
  público de credenciales y revisión humana de evidencias.
- El campus clásico (`campus/`, `index.html`, `ui/`) sigue publicado en la raíz con las mismas rutas: ninguna
  promesa anterior se ha retirado.

## [0.2.0] — anterior a esta elevación

Versión recibida del repositorio original: campus estático de cuatro cursos de veinte semanas, SPA de demostración,
motor educativo `lib/edu-engine`, CI con pytest + gitleaks + vitest, y páginas de progreso, credencial, búsqueda y
amenazas.
