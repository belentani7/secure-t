# ESTÁNDARES.md — qué cumple el campus, norma por norma

Este documento es la respuesta larga a una pregunta corta: **¿qué normas aplica este campus y cómo se
comprueba?** Está escrito con la misma regla que el resto del repositorio: nada se declara conforme sin una
prueba ejecutable que lo demuestre, y lo que aún no está se marca como PLANIFICADO en lugar de aparentarse.

Última revisión: **2026-10-11** · Página correspondiente del campus: `/es/estandares` (y `/pt`, `/en`, `/ca`).

---

## 1. Resumen

| Norma | Estado | Evidencia ejecutable |
|---|---|---|
| EPUB 3.3 + EPUB Accessibility 1.1 | APLICADA | `tests/packages-contract.test.ts` |
| SCORM 2004 4th Edition (ADL) | APLICADA | `tests/packages-contract.test.ts` |
| IMS Common Cartridge 1.3 | APLICADA | `tests/packages-contract.test.ts` |
| IMS QTI 1.2 (ASI) | APLICADA | `tests/packages-contract.test.ts` |
| IMS QTI 2.1 (paquete de contenido) | APLICADA | `tests/packages-contract.test.ts` |
| xAPI 1.0.3 (ADL / IEEE 9274.1.1-2023) | APLICADA | `packages/shared/tests/xapi.test.ts` |
| Open Badges 2.0 (1EdTech) | APLICADA | `packages/shared/tests/badges.test.ts` |
| Open Badges 3.0 / W3C VC (VC-JWT firmada) | APLICADA | `packages/shared/tests/badges.test.ts` |
| RFC 7519 — JWT (claims `iss`/`sub`/`jti`/`nbf` de la VC-JWT) | APLICADA | `packages/shared/tests/badges.test.ts` |
| schema.org — Course, CourseInstance, Syllabus | APLICADA | `packages/shared/tests/seo.test.ts` |
| WCAG 2.2 AA | APLICADA | `packages/ui/tests/tokens.test.ts`, `tools/audit-site.mjs`, `.github/workflows/quality.yml` |
| RGPD (UE) 2016/679 — minimización y transparencia | APLICADA | `apps/web/src/components/privacy-view.tsx`, `tests/contracts.test.ts` |
| RFC 9116 — security.txt | APLICADA | `tests/contracts.test.ts` |
| CycloneDX 1.5 — SBOM | APLICADA | `tools/build-sbom.mjs`, `tests/contracts.test.ts` |
| RFC 5545 — iCalendar | APLICADA | `packages/shared/tests/calendar.test.ts` |
| RFC 7515 / RFC 8017 — JWS, RSASSA-PKCS1-v1_5 | APLICADA | `packages/shared/tests/badges.test.ts` |
| RFC 9457 — Problem Details (`application/problem+json`) | APLICADA | `apps/web/src/app/api/agent/route.ts`, `tests/agent-api.test.ts` |
| OCF/APPNOTE.TXT — escritor y lector ZIP propio | APLICADA | `tools/lib/zip.ts`, `tests/packages-contract.test.ts` |
| LTI 1.3 (1EdTech) | **PLANIFICADO** | — |
| Revocación en línea y registro público de credenciales | **PLANIFICADO** | — |
| CSV de Open Badges (`OpenBadges/validator`) | **PLANIFICADO** | — |
| WCAG 2.2 AAA | **NO PRETENDIDA** | el campus se compromete con AA |
| Códigos de conducta y acreditación de programas (no somos entidad acreditadora) | **FUERA DE ALCANCE** | `README.md`, `LICENSE` |

---

## 2. Paquetes interoperables

El mismo material que se lee en el campus se publica en los formatos que usan las plataformas del sector,
generados desde la **fuente única** (`campus/`) por `pnpm packages`:

| Formato | Fichero | Detalles verificados |
|---|---|---|
| EPUB 3.3 + Accessibility 1.1 | `<curso>.epub` | `mimetype` en el byte 38 y sin comprimir, `container.xml`, paquete OPF con `dcterms:modified`, navegación con `toc` y `landmarks`, metadatos `schema:accessMode`, `schema:accessibilityFeature`, `schema:accessibilityHazard`, `schema:accessibilitySummary` |
| SCORM 2004 4th Ed. | `<curso>-scorm2004.zip` | `imsmanifest.xml` con organización jerárquica, 1 SCO de presentación + 20 semanas, `adlcp:scormType="sco"`, `imsss:sequencing` con reglas de flujo, SCO en XHTML transitorio accediendo a la API `LMSInitialize`/`cmi.*` |
| IMS Common Cartridge 1.3 | `<curso>.imscc` | `imsmanifest.xml`, `webcontent` por semana, evaluación como `imsqti_xmlv1p2`, `<lomimscc:lom>` con metadatos |
| IMS QTI 1.2 | `<curso>-qti12.xml` | `questestinterop`, `response_lid` de una respuesta, `resprocessing` con puntuación 100 y `itemfeedback` correcto/incorrecto contrastado con `campus/cursos/*/quiz.json` |
| IMS QTI 2.1 | `<curso>-qti21.zip` | Paquete de contenido: `imsmanifest.xml` (IMS Content Packaging 1.1.4, `type="imsqti_test_xmlv2p1"`), `assessmentTest` con `submissionMode="individual"`, seis `assessmentItem` con `responseDeclaration` de una respuesta, `choiceInteraction` y `responseProcessing` `match_correct`; la correcta se contrasta con `campus/cursos/*/quiz.json` |
| xAPI 1.0.3 | `<curso>-xapi.json` | Plantillas de declaración con verbos del vocabulario de ADL, actividad con `activityType`, duración ISO 8601, actor anónimo con `account` |
| Insignia SVG | `/badges/<curso>.svg` | Emblema accesible (`role="img"`, `title`, `desc`), sin texto incrustado que dependa del idioma |

Los XHTML generados se validan con un comprobador propio (`tools/lib/xml.ts`) que **rechaza HTML permisivo**:
toda etiqueta no autocerrada debe cerrarse, `&` debe ir escapado y las extensiones CDATA se respetan.

`apps/web/public/packages/index.json` publica el tamaño y el **SHA-256 de cada fichero**, para que cualquiera
pueda comprobar que lo descargado es lo generado.

## 3. Credenciales abiertas

- **Forma**: `Assertion`, `BadgeClass` e `Issuer` conformes con Open Badges 2.0, con `@context`
  (`https://w3id.org/openbadges/v2`), `recipient` anónimo por token (`identity` con hash), evidencia por
  semanas completadas y `verification` con la clave pública.
- **Firma**: **JWS compacto con RS256** (RFC 7515 · RFC 8017). La clave RSA de 2048 bits se genera **en el
  dispositivo** con `crypto.subtle`, la privada nunca sale del navegador y se guarda en `localStorage` si el
  estudiante quiere poder emitir más credenciales.
- **Verificación sin servidor**: la insignia incluye la clave pública en JWK con un `kid` **derivado por
  SHA-256 de la propia clave** (no aleatorio), de modo que el verificador puede comprobar la firma y detectar
  la manipulación de la clave. El verificador acepta fichero o texto pegado y devuelve el motivo exacto del
  rechazo (`firma_no_valida`, `jws_mal_formado`, `clave_manipulada`, `forma:…`).
- **Vista Open Badges 3.0**: `toOpenBadges3()` emite el mismo dato con `@context` de OB 3.0 y
  `type: ["AchievementCredential"]`, sin duplicar la lógica.
- **PLANIFICADO y dicho en voz alta**: no hay registro público de emisiones ni revocación en línea. Una
  credencial emitida se puede verificar, pero no se puede «desemitir». Es una limitación real de un campus sin
  servidor, y está documentada aquí y en la página de estándares en lugar de insinuarse lo contrario.

## 4. Datos de actividad (xAPI)

- Cada acción del estudiante (semana completada, respuesta, cuestionario superado, audio escuchado,
  credencial emitida) se anota como **declaración xAPI 1.0.3** con UUID derivado (RFC 9562), `timestamp`
  ISO 8601, `result` con `completion`, `success`, `score` y `duration`.
- **Nada sale del dispositivo**: no hay LRS ni petición de red de ningún tipo (`tests/contracts.test.ts`
  comprueba que el módulo no usa `fetch`). El estudiante puede **exportar** las declaraciones en JSON-LD e
  importarlas en el LRS que elija.
- El actor es anónimo: `account.homePage` del campus + `account.name` = token del expediente. No hay correo,
  ni nombre, ni IP, ni identificador de sesión.

## 5. Datos estructurados

`organizationJsonLd`, `websiteJsonLd`, `courseJsonLd`, `programListJsonLd` y `breadcrumbJsonLd` publican la
identidad del campus, los programas con su temario semana a semana y la ruta de navegación. Decisiones de
honestidad aplicadas en `packages/shared/src/seo.ts`:

- **No** se publican `aggregateRating` ni `review` porque no hay valoraciones reales que respalden una nota.
- Se declara `accessibilityFeature` y `accessibilitySummary` con lo que el campus hace de verdad.
- El JSON se inserta escapando `<` para no poder cerrar la etiqueta `script`.

## 6. Seguridad del sitio distribuido

- **CSP cerrada por defecto** (`default-src 'self'`), sin fuentes externas, sin CDN, sin analítica,
  `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'none'`.
- Una sola política, tres consumidores: cabeceras de Next (`next.config.ts`), `public/_headers` (Netlify y
  Cloudflare Pages) y **metadatos** para la exportación estática. `tests/contracts.test.ts` compara las tres
  para que no se desincronicen.
- **Limitación declarada**: GitHub Pages no permite cabeceras propias. Allí la política va como
  `<meta http-equiv="Content-Security-Policy">` y `frame-ancestors` no puede expresarse (los metadatos no lo
  admiten). Ver ADR-0011.
- `security.txt` (RFC 9116) con caducidad, alcance explícito y lenguas preferidas — y **sin** anunciar claves
  PGP que no existen: el test falla si se declara `Encryption:` sin publicar la clave.
- SBOM CycloneDX 1.5 de las 790 dependencias del lockfile, con hash SHA-512 de cada paquete y licencia
  declarada cuando el propio paquete instalado la declara (`NOASSERTION` en el resto). Se publica en
  `/sbom.cdx.json`.

## 7. Accesibilidad y rendimiento

- Contraste calculado, no estimado: `packages/ui/tests/tokens.test.ts` verifica las ratios WCAG de la paleta
  AURUM sobre los fondos reales.
- `tools/audit-site.mjs` revisa las 466 páginas exportadas: `lang` por ruta, jerarquía de encabezados, texto
  alternativo, formularios etiquetados, enlaces con texto, contraste declarado y títulos/descripciones únicos.
- En CI: `axe-core` sobre las rutas principales (WCAG 2.2 AA) y Lighthouse con presupuesto ≥ 95 en las cuatro
  categorías. **Se afirma como «configurado en CI»**, no como «medido en este entorno», porque en este
  contenedor de trabajo no hay navegador.
- Rendimiento: presupuesto de peso por ruta, sin fuentes externas, service worker con precache mínimo, y
  `next export` sin JavaScript innecesario en las páginas de contenido.

## 8. Lo que este documento **no** afirma

1. No somos una entidad acreditadora: los certificados acreditan el recorrido del estudiante, no una
   titulación oficial (ver `README.md`, sección de honestidad).
2. No hay traducción docente completa a PT/EN/CA más allá de la interfaz: el material de las 80 semanas está en
   español y su traducción sigue PLANIFICADA.
3. No hay LTI 1.3: el campus **produce** paquetes que un LMS importa, pero no se conecta como herramienta
   externa.
4. No hay revocación de credenciales ni registro público.
5. No hay telemetría, ni cookies de terceros, ni cuentas: por diseño, y por eso algunas funciones «de
   plataforma» (foros, cohortes, tutoría con historial en servidor) no existen.
