# Requisitos de plataforma — secure T

> Documento **generado** por `pnpm requirements` desde `packages/shared/src/requirements.ts`.
> No se edita a mano: el código es la fuente y `tests/requirements.test.ts` falla si este documento se separa de él.

Este es el contrato que la plataforma firma consigo misma. Cada requisito lleva identificador, nivel, norma de
origen, **evidencia ejecutable** y estado. Las reglas son duras y se aplican por test:

1. Toda evidencia citada **existe** (fichero, script declarado o marca dentro del workflow).
2. `VERIFIED` exige evidencia ejecutable (una prueba o un script, no un documento).
3. `CI` exige evidencia de la integración continua.
4. Todo lo que no está en verde **obliga a escribir el motivo**.

## El listón

| Área | Objetivo | Aspiración declarada |
|---|---|---|
| Accesibilidad | WCAG 2.2 AA | WCAG 2.2 AAA en texto de lectura y en modo de alto contraste |
| Seguridad de aplicación | OWASP ASVS 5.0 nivel 2 | nivel 3 donde aplique |
| Lighthouse | rendimiento ≥ 95 · accesibilidad 100 · buenas prácticas ≥ 95 · SEO 100 | — |
| Core Web Vitals (p75) | LCP ≤ 2500 ms · INP ≤ 200 ms · CLS ≤ 0.1 | — |
| Cobertura de lo crítico | ≥ 80 % | — |
| JavaScript por página (comprimido) | ≤ 250 kB | límite duro 400 kB |
| Pruebas automatizadas | ≥ 600 | — |
| Datos personales almacenados | 0 | no hay objetivo distinto de cero |
| Vulnerabilidades críticas abiertas | 0 | — |

## Resumen

- **Total**: 90 requisitos en 12 dominios — 65 MUST, 19 SHOULD, 6 MAY
- **En verde**: 73 de 90 (81,1 %) — comprobados aquí o por la CI
- **Obligatorios sin cerrar**: 2

### Por estado

| Estado | Cuántos | Qué significa |
|---|---|---|
| VERIFIED | 63 | comprobado aquí, con evidencia ejecutable |
| CI | 10 | comprobado por la integración continua del repositorio |
| PARTIAL | 7 | cubierto en parte; se dice qué falta |
| PLANNED | 6 | decidido y aún sin construir |
| BLOCKED | 1 | depende de una decisión o un acceso que no están en mis manos |
| NOT_VERIFIED | 1 | sin comprobación: no se afirma |
| ACCEPTED | 0 | cumplido parcialmente y aceptado a conciencia, con el motivo escrito |
| OUT_OF_SCOPE | 2 | fuera de alcance por decisión de arquitectura, declarado en voz alta |

### Por dominio

| Dominio | Requisitos | En verde |
|---|---|---|
| Producto y experiencia | 9 | 7 de 9 |
| Currículo y contenido | 7 | 6 de 7 |
| Pedagogía y evaluación | 5 | 4 de 5 |
| Accesibilidad | 10 | 8 de 10 |
| Rendimiento | 5 | 5 de 5 |
| Seguridad | 11 | 7 de 11 |
| Privacidad y datos personales | 7 | 6 de 7 |
| Datos del estudiante | 4 | 3 de 4 |
| Inteligencia artificial responsable | 7 | 5 de 7 |
| Interoperabilidad y estándares | 10 | 8 de 10 |
| Calidad de ingeniería | 8 | 8 de 8 |
| Operación y despliegue | 7 | 6 de 7 |

### Producto y experiencia

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `PRD-01` | MUST | **Arquitectura de la información verificable**. Toda ruta publicada existe, es alcanzable desde la navegación o el pie y el export no tiene enlaces internos rotos. | WCAG 2.4.4 (propósito del enlace) · ISO/IEC 25010 (usabilidad) | `pnpm audit:site` · workflow `.github/workflows/quality.yml` (marca: «Accesibilidad y peso sin navegador») | CI |
| `PRD-02` | MUST | **Un solo sistema de diseño**. Colores, tipografía, espaciado y foco salen de tokens declarados una vez; ningún componente inventa valores. | ISO/IEC 25010 (mantenibilidad) · propia | `packages/ui/tests/tokens.test.ts` · `packages/ui/src/tokens.ts` | VERIFIED |
| `PRD-03` | MUST | **Cuatro idiomas con paridad de claves**. pt-BR, es, en y ca publican exactamente las mismas claves de interfaz; el `<html lang>` es correcto por ruta. | ISO/IEC 40500 · WCAG 3.1.1 (idioma de la página) | `packages/shared/tests/i18n.test.ts` · `tests/contracts.test.ts` | VERIFIED |
| `PRD-04` | MUST | **El portugués de Brasil abre la casa**. El defecto y el primer idioma es pt-BR: rutas sin prefijo, `lang="pt-BR"` y contenido portugués antes que ningún otro. | Decisión de producto (2026-10-11) · ABNT NBR 6023 (referencias) | `tests/portugues-brasil.test.ts` · `pnpm locales` | PARTIAL |
| `PRD-05` | SHOULD | **Decisiones acotadas por ley de Hick y Miller**. La navegación ofrece seis destinos primarios y pliega el resto; ninguna vista acumula más filtros visibles de los que la memoria de trabajo sostiene. | Hick (1952) · Miller (1956) | `packages/ui/tests/psychology.test.ts` · `tests/contracts.test.ts` | VERIFIED |
| `PRD-06` | MUST | **El contenido no depende de JavaScript**. Leer, navegar y descargar funciona sin JS; ningún efecto oculta contenido cuando el script no llega. | Progressive enhancement · WCAG 2.1.1 | `packages/ui/tests/psychology.test.ts` · `pnpm audit:site` | VERIFIED |
| `PRD-07` | SHOULD | **Presupuesto de peso por página**. Ninguna página supera el presupuesto de JavaScript comprimido de la casa. | Presupuesto propio: aviso > 250 kB, error > 400 kB | `pnpm audit:site` | PARTIAL |
| `PRD-08` | MUST | **Búsqueda propia, sin servicios externos**. La búsqueda del campus funciona con un índice propio (BM25) construido en el build: sin servicio, sin red y sin datos personales. | Propia · ISO/IEC 25010 (funcionalidad) | `packages/shared/tests/search.test.ts` · `packages/shared/src/search.ts` | VERIFIED |
| `PRD-09` | SHOULD | **Experiencia medida y publicada**. Las decisiones de color, tipografía, distancia y movimiento están declaradas como tokens con fuente citada y se publican en `/experiencia`. | Zhou et al. (2025, JCR) · WCAG 2.3.3 · propia | `packages/ui/tests/psychology.test.ts` · `docs/PSICOLOGIA-Y-EXPERIENCIA.md` | VERIFIED |

- `PRD-04` (PARTIAL) — El defecto y la interfaz están en pt-BR; del material docente hay 32 de 80 semanas escritas. La cifra exacta se publica con `pnpm locales` y la página del plan.
- `PRD-07` (PARTIAL) — Cinco páginas del agente están en 258,2 kB comprimidos: 8,2 kB por encima del objetivo y lejos del límite duro de 400 kB. La mediana del sitio es 242,5 kB. La auditoría avisa en lugar de relajar el umbral, y cada aviso se explica: el marco de Next.js pesa 233 kB en todas las páginas y el resto es el diccionario de la interfaz (los cuatro idiomas viajan con el cliente) más la consola del agente (24,7 kB, sólo en esa página).

### Currículo y contenido

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `CNT-01` | MUST | **Malla de cinco años sin huecos ni solapes**. El plan cubre 200 semanas en 10 franjas de 20; `validateCurriculum()` demuestra la cobertura 1..200. | Propia (malla declarada) · EQF nivel 6-7 (referencia de complejidad) | `tests/curriculum.test.ts` · `pnpm plan` | VERIFIED |
| `CNT-02` | MUST | **Ochenta semanas publicadas con estructura completa**. Cada semana tiene lectura, práctica guiada, caso real, glosario, chuleta, laboratorio, rúbrica y examen coherentes. | Propia · IMS Common Cartridge 1.3 (estructura) | `tests/test_campus.py` · `tests/syllabus-contract.test.ts` | VERIFIED |
| `CNT-03` | SHOULD | **Las seis franjas restantes, escritas**. Las franjas 5 a 10 (especialidades, arquitectura, CISO, capstone y docencia) deben tener material, no sólo descripción. | Propia | `docs/PLAN-QUINQUENAL.md` · `pnpm plan` | PLANNED |
| `CNT-04` | MUST | **Biblioteca de recursos abiertos con procedencia**. Cada recurso cita autor, tipo, idioma, nivel y acceso, y la ficha no se publica sin esos campos. | UNESCO OER (recomendación de recursos educativos abiertos) · propia | `packages/shared/tests/library.test.ts` · `pnpm locales` | VERIFIED |
| `CNT-05` | MUST | **Ni espejos ni cursos de pago**. La biblioteca no enlaza agregadores ni copias no autorizadas: una lista de dominios prohibidos y un test lo impiden. | Derechos de autor (convenio de Berna) · propia | `packages/shared/tests/library.test.ts` · `packages/shared/src/library.ts` | VERIFIED |
| `CNT-06` | MUST | **Material sin secretos ni credenciales**. Ningún fichero del campus contiene claves, tokens ni credenciales; los ejemplos usan dominios de laboratorio reservados. | CWE-798 · NIST SSDF PS.1 | `tests/test_material_sin_secretos.py` · workflow `.github/workflows/ci.yml` (marca: «secretos») | CI |
| `CNT-07` | SHOULD | **Viaje de datos internacional**. El material cita derechos de datos de la UE (RGPD), de Brasil (LGPD) y de Estados Unidos, según el país del estudiante. | RGPD · LGPD (Lei 13.709/2018) | `campus/cursos/gobernanza-compliance/semana-01.md` · `tests/test_campus.py` | VERIFIED |

- `CNT-03` (PLANNED) — Declaradas franja por franja con su modo y sus recursos, con `PLANNED` visible en `/plano`. Escribir 120 semanas es el siguiente incremento de contenido; no se anuncia como disponible.

### Pedagogía y evaluación

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `PED-01` | MUST | **Evaluación con rúbrica y defensa**. La nota pesa 30 % P1 + 30 % P2 + 40 % P3 y no hay aprobado sin proyecto, defensa y entregables. | Propia · taxonomía de Bloom (niveles de logro) | `tests/test_campus.py` | VERIFIED |
| `PED-02` | MUST | **Repaso espaciado tipo SM-2**. El mazo de repaso programa intervalos según el algoritmo SM-2 y respeta las tarjetas suspendidas. | SM-2 (Wozniak, SuperMemo) · efecto de espaciado (Ebbinghaus) | `packages/shared/tests/review.test.ts` | VERIFIED |
| `PED-03` | MUST | **Progreso en formato xAPI, sin servidor**. Los enunciados de actividad se generan conforme a xAPI 1.0.3 y se exportan desde el propio dispositivo del estudiante. | ADL xAPI 1.0.3 · IEEE 9274.1.1-2023 | `packages/shared/tests/xapi.test.ts` · `tests/packages-contract.test.ts` | VERIFIED |
| `PED-04` | MAY | **Voz natural en las clases y en el tutor**. Explicaciones y tutor con voz humanizada; el audio se genera a petición y nunca se guarda. | Propia · WCAG 1.2 (alternativas a multimedia) | `apps/web/src/components/voice-lesson.tsx` · `docs/VOICE_ARCHITECTURE.md` | PARTIAL |
| `PED-05` | SHOULD | **Cada semana con autoevaluación**. Cada semana lleva preguntas con retroalimentación explicada, no sólo la respuesta correcta. | Propia · retroalimentación formativa (Hattie y Timperley, 2007) | `tests/test_campus.py` | VERIFIED |

- `PED-04` (PARTIAL) — Publicadas en español y portugués; faltan en y ca. El texto equivalente siempre está visible, así que la falta de voz no bloquea el estudio.

### Accesibilidad

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `A11Y-01` | MUST | **WCAG 2.2 AA en las rutas principales**. 23 rutas auditadas con axe en escritorio y móvil, con las etiquetas wcag2a, wcag2aa, wcag21aa y wcag22aa. | W3C WCAG 2.2 · EN 301 549 v3.2.1 (referencia) | `e2e/a11y.spec.ts` · workflow `.github/workflows/quality.yml` (marca: «axe · WCAG 2.2 AA») | CI |
| `A11Y-02` | MUST | **Todo par texto/fondo ≥ 4,5:1**. Cada combinación que aparece en la interfaz se calcula con la fórmula de luminancia de WCAG y se exige por test. | WCAG 2.2 SC 1.4.3 (AA) | `packages/ui/tests/tokens.test.ts` · `packages/ui/src/tokens.ts` | VERIFIED |
| `A11Y-03` | MUST | **Foco visible y navegación por teclado**. Anillo de foco propio, enlace de salto al contenido y orden de tabulación comprobado en el navegador. | WCAG 2.2 SC 2.4.7 y 2.4.1 | `e2e/a11y.spec.ts` · workflow `.github/workflows/quality.yml` (marca: «axe · WCAG 2.2 AA») | CI |
| `A11Y-04` | MUST | **Objetivos táctiles grandes**. 44 px de casa (guía de plataforma y AAA) frente a los 24 px legales de AA, con 8 px de separación entre objetivos. | WCAG 2.2 SC 2.5.8 (AA, 24 px) · SC 2.5.5 (AAA, 44 px) | `packages/ui/tests/psychology.test.ts` | VERIFIED |
| `A11Y-05` | MUST | **Movimiento respetuoso y desactivable**. Sin parallax ni desplazamientos grandes; todo lo animado vive tras `prefers-reduced-motion: no-preference` y la preferencia se escucha en caliente. | WCAG 2.2 SC 2.3.3 (analizada) · guía vestibular del W3C | `packages/ui/tests/psychology.test.ts` · `apps/web/src/components/motion-rhythm.tsx` | VERIFIED |
| `A11Y-06` | MUST | **Idioma correcto en cada ruta**. `<html lang="pt-BR">` (no `pt`) donde corresponde, comprobado ruta por ruta en el navegador. | WCAG 2.2 SC 3.1.1 | `e2e/a11y.spec.ts` · `tests/portugues-brasil.test.ts` · workflow `.github/workflows/quality.yml` (marca: «axe · WCAG 2.2 AA») | CI |
| `A11Y-07` | MUST | **Nada depende sólo del color**. Los estados llevan etiqueta textual además del color; ningún dato se distingue únicamente por el tono. | WCAG 2.2 SC 1.4.1 | `packages/ui/tests/tokens.test.ts` | VERIFIED |
| `A11Y-08` | SHOULD | **AAA donde se lee de verdad**. El texto largo y el modo de alto contraste alcanzan 7:1. | WCAG 2.2 SC 1.4.6 (AAA) | `packages/ui/tests/tokens.test.ts` | PARTIAL |
| `A11Y-09` | MUST | **Material exportado accesible**. El EPUB cumple EPUB 3.3 y EPUB Accessibility 1.1: navegación, `epub:type`, orden de lectura y metadatos de accesibilidad. | EPUB 3.3 · EPUB Accessibility 1.1 (W3C) | `tests/packages-contract.test.ts` · `pnpm packages` | VERIFIED |
| `A11Y-10` | SHOULD | **Declaración de accesibilidad publicada**. El sitio dice en sus cuatro idiomas qué se cumple, con qué se verifica y qué queda fuera, sin adornos. | EN 301 549 (documentación) · WCAG-EM 1.0 (referencia de método) | `apps/web/src/components/standards-view.tsx` · `tests/contracts.test.ts` | PARTIAL |

- `A11Y-08` (PARTIAL) — El modo de alto contraste llega a AAA sobre el fondo principal; el resto del sitio se compromete con AA y no se declara AAA. Extenderlo a toda la paleta es trabajo pendiente.
- `A11Y-10` (PARTIAL) — Declaración publicada y verificada por test; no hay auditoría externa ni usuario real en la muestra, y tampoco se dice lo contrario.

### Rendimiento

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `PERF-01` | MUST | **Lighthouse ≥ 95 y accesibilidad 100**. Seis URL × tres pasadas con presupuesto de rendimiento, accesibilidad, buenas prácticas y SEO. | Lighthouse (umbral > 90) · presupuesto de la casa en 95 | workflow `.github/workflows/quality.yml` (marca: «Lighthouse ≥ 95 y Core Web Vitals») | CI |
| `PERF-02` | MUST | **Core Web Vitals por debajo del umbral**. LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 medidos en la CI. | Core Web Vitals (Google) · umbral del percentil 75 | workflow `.github/workflows/quality.yml` (marca: «Lighthouse ≥ 95 y Core Web Vitals») | CI |
| `PERF-03` | MUST | **Export estático autosuficiente**. El sitio se ensambla y se sirve sin proceso en el servidor: HTML, CSS y recursos propios. | Propia · W3C HTML | `pnpm site` · `tests/requirements.test.ts` | VERIFIED |
| `PERF-04` | MUST | **Sin peticiones a terceros**. Tipografías del sistema, sin CDN, sin analítica externa y sin imágenes remotas: el navegador sólo habla con el propio sitio. | Propia (privacidad y rendimiento) · CSP de la casa | `tests/contracts.test.ts` · `packages/ui/tests/psychology.test.ts` | VERIFIED |
| `PERF-05` | SHOULD | **Comprime y cachea en el borde**. El servicio estático sirve brotli/gzip y cabeceras de caché; las cabeceras de seguridad viajan en el HTML además de en el servidor. | RFC 9110 (caché) · OWASP Secure Headers | `tests/requirements.test.ts` · `tools/serve-static.mjs` | VERIFIED |


### Seguridad

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `SEC-01` | MUST | **Escaneo de secretos con control negativo**. Gitleaks sobre el historial completo, con binario fijado por SHA-256 y con un control que falla si el escáner no encuentra nada. | NIST SSDF PS.1 · CWE-798 | workflow `.github/workflows/ci.yml` (marca: «secretos») · CI 38146258189 | CI |
| `SEC-02` | MUST | **CSP y cabeceras restrictivas**. Política sin comodines y sin `unsafe-inline` en scripts; Referrer-Policy, X-Content-Type-Options, Permissions-Policy y COOP. | OWASP ASVS V14 · OWASP Secure Headers | `tests/contracts.test.ts` · `apps/web/src/lib/security-headers.ts` | VERIFIED |
| `SEC-03` | MUST | **Dependencias auditadas con motivo escrito**. Cada aviso aceptado lleva su razón en `DEPENDENCIAS.md`; el test falla si hay un aviso sin justificar. | NIST SSDF PW.4 · OWASP A06:2021 | `pnpm audit:deps` · `DEPENDENCIAS.md` | VERIFIED |
| `SEC-04` | MUST | **Cero vulnerabilidades críticas abiertas**. Ninguna alerta crítica de Dependabot puede quedar sin resolver ni sin excepción documentada. | OWASP A06:2021 · NIST SSDF RV.1 | `pnpm audit:deps` · CI 38146258189 | BLOCKED |
| `SEC-05` | SHOULD | **ASVS 5.0 nivel 2 en la superficie web**. Controles aplicables de ASVS 5.0 (autenticación no aplica: no hay cuentas) revisados y documentados. | OWASP ASVS 5.0 | `SECURITY.md` · `tests/agent-api.test.ts` | PARTIAL |
| `SEC-06` | MUST | **El agente resiste inyección y exfiltración**. Deny-list, control de SSRF, sin escritura de ficheros y con el progreso del estudiante fuera del contexto del modelo. | OWASP LLM Top 10 2025 (LLM01, LLM05, LLM06) · MITRE ATLAS | `packages/agent/tests/agent.test.ts` · `tests/ai-governance.test.ts` | VERIFIED |
| `SEC-07` | MUST | **Errores según RFC 9457**. La API del agente responde `application/problem+json` con tipo, título, estado y detalle; sin filtrar trazas internas. | RFC 9457 · OWASP API Security Top 10 2023 (API8) | `tests/agent-api.test.ts` · `CONTRATO_API.md` | VERIFIED |
| `SEC-08` | MUST | **SBOM en cada entrega**. Se genera un SBOM CycloneDX con los componentes del árbol y sus licencias declaradas; los que no acreditan licencia se cuentan y se publican. | CycloneDX 1.5 · elementos mínimos del NTIA | `pnpm sbom` · `tests/contracts.test.ts` | VERIFIED |
| `SEC-09` | SHOULD | **Cadena de suministro con atestaciones**. Procedencia de la construcción (SLSA) firmada y verificable para los artefactos publicados. | SLSA v1.0 · NIST SSDF PW.6 | `docs/decisions/ADR-0012-estandares-interoperables.md` | PLANNED |
| `SEC-10` | MUST | **Vulnerabilidades de contenido con reporte**. `security.txt` con contacto, idioma, caducidad y política de divulgación, sirviéndose desde el sitio publicado. | RFC 9116 | `tests/contracts.test.ts` · `apps/web/public/.well-known/security.txt` | VERIFIED |
| `SEC-11` | MAY | **Recursos de terceros con integridad**. Todo recurso externo habría de llevar SRI; la casa resuelve el problema por la vía de no tener recursos externos. | OWASP ASVS 14.2 | `tests/contracts.test.ts` | OUT_OF_SCOPE |

- `SEC-04` (BLOCKED) — GitHub reporta 7 alertas en la rama por defecto (3 críticas, 1 alta, 3 moderadas) y la API de Dependabot no es accesible desde este entorno (403). Corregirlas es decisión del propietario; se declara en el riesgo residual en lugar de decir que el repositorio está limpio.
- `SEC-05` (PARTIAL) — Revisión propia y documentada contra ASVS 2 y 3 donde aplica; no hay verificación externa ni ASVS 4 (no hay superficie con cuentas: por diseño no existe sesión de usuario).
- `SEC-09` (PLANNED) — El proyecto no firma la procedencia de sus artefactos: se auditan acciones fijadas por SHA y un SBOM, pero eso no es una atestación SLSA y no se declara como tal.
- `SEC-11` (OUT_OF_SCOPE) — No hay recursos de terceros (fuentes del sistema, sin CDN, sin analítica). El apartado queda declarado para cuando deje de ser cierto.

### Privacidad y datos personales

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `PRV-01` | MUST | **Cero datos personales almacenados**. El progreso, el repaso y la credencial no guardan nombre, correo, teléfono ni el número del que se derivó la llave. | RGPD art. 5(1)(c) (minimización) · LGPD art. 6 | `tests/test_campus.py` · `tests/identity.test.ts` | VERIFIED |
| `PRV-02` | MUST | **Identidad derivada, nunca almacenada**. La llave del estudiante sale de los cuatro dígitos que él elige y se usa como identificador derivado; el número no se guarda ni se envía. | RGPD arts. 25 y 32 · privacidad por diseño | `tests/identity.test.ts` · `packages/shared/src/identity.ts` | VERIFIED |
| `PRV-03` | MUST | **Sin cookies ni rastreadores**. No hay cookies, ni analítica de terceros, ni píxeles: el CSP y el aviso de privacidad lo fijan y el test lo comprueba. | Directiva ePrivacy art. 5(3) · RGPD art. 13 | `tests/contracts.test.ts` · `apps/web/src/components/privacy-view.tsx` | VERIFIED |
| `PRV-04` | MUST | **Aviso de privacidad claro, en cuatro idiomas**. Explica qué se guarda (nada personal), dónde (en el dispositivo) y cómo borrarlo, en pt-BR, es, en y ca. | RGPD arts. 12-14 | `tests/content-i18n.test.ts` · `apps/web/src/components/privacy-view.tsx` | VERIFIED |
| `PRV-05` | SHOULD | **Derechos ejercibles sin intermediario**. Exportar y borrar el progreso se hace desde la propia página, sin solicitud ni espera. | RGPD arts. 15 y 17 | `packages/shared/tests/progress.test.ts` · `apps/web/src/components/progress-board.tsx` | VERIFIED |
| `PRV-06` | MAY | **Cifrado en reposo del almacenamiento local**. El almacén del navegador podría cifrarse con la llave derivada del estudiante. | RGPD art. 32 (medidas técnicas) | `apps/web/src/lib/progress-store.ts` | NOT_VERIFIED |
| `PRV-07` | MUST | **El agente no recibe el expediente del estudiante**. Lo que el tutor recibe es la pregunta y el contexto público del campus; el progreso no sale del dispositivo. | RGPD art. 5(1)(c) · NIST AI RMF (privacidad) | `tests/ai-governance.test.ts` · `packages/agent/tests/agent.test.ts` | VERIFIED |

- `PRV-06` (NOT_VERIFIED) — No está cifrado en reposo. Lo que se guarda son identificadores derivados de cursos y semanas, sin dato personal que proteger, y por eso no se ha añadido: si algún día entra cualquier dato personal, esto pasa a MUST y hay que cifrarlo o no guardarlo.

### Datos del estudiante

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `DAT-01` | MUST | **Esquema de datos versionado**. El almacén local lleva versión y las migraciones se aplican sin perder progreso. | Propia (evolución de esquema) · ISO/IEC 25010 (fiabilidad) | `packages/shared/tests/progress.test.ts` | VERIFIED |
| `DAT-02` | MUST | **Datos corruptos no rompen el campus**. Un almacén ilegible se descarta y se reconstruye: el campus nunca se queda en blanco por JSON inválido. | CWE-20 (validación de entrada) | `packages/shared/tests/progress.test.ts` | VERIFIED |
| `DAT-03` | SHOULD | **Copia de seguridad del propio progreso**. Exportar e importar el progreso en un fichero legible, sin servicio intermedio. | Propia · RGPD art. 20 (portabilidad) | `packages/shared/tests/progress.test.ts` · `apps/web/src/components/progress-board.tsx` | VERIFIED |
| `DAT-04` | MAY | **Base de datos y servidor de aplicación**. El campus no guarda nada en servidor: no hay base de datos que operar. | Decisión de arquitectura (ADR-0001 · sitio estático) | `docs/ARCHITECTURE.md` · `docs/decisions/ADR-0001-dos-campus.md` | OUT_OF_SCOPE |

- `DAT-04` (OUT_OF_SCOPE) — Decisión de arquitectura, no carencia: la ausencia de servidor es lo que hace creíble la promesa de anonimato. Si cambia, cambia con ADR y con esta tabla.

### Inteligencia artificial responsable

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `AI-01` | MUST | **El tutor cita y no inventa**. Cada respuesta viaja con sus fuentes del campus; sin fuente, no hay afirmación. | NIST AI RMF (MEASURE) · OWASP LLM09 (desinformación) | `packages/agent/tests/agent.test.ts` · `tests/agent-api.test.ts` | VERIFIED |
| `AI-02` | MUST | **Modo examen activo**. Con el modo examen puesto, el tutor acompaña sin dar la respuesta de la evaluación. | Propia (integridad académica) · NIST AI RMF (GOVERN) | `packages/agent/tests/agent.test.ts` | VERIFIED |
| `AI-03` | MUST | **Gobernanza de IA publicada**. Doce controles ponderados con evidencia y referencia normativa, evaluables por el propio estudiante en `/laboratorio`. | NIST AI RMF 1.0 · Reglamento (UE) 2024/1689 (transparencia) | `tests/ai-governance.test.ts` · `docs/AI_GOVERNANCE.md` | VERIFIED |
| `AI-04` | MUST | **Herramientas del tutor de sólo lectura**. El tutor puede consultar el campus (programas, semanas, biblioteca, itinerarios, plan) y no puede escribir nada. | OWASP LLM06 (exceso de agencia) | `tests/contracts.test.ts` · `packages/shared/src/tutor-tools.ts` | VERIFIED |
| `AI-05` | MUST | **Proveedor externo, sólo con permiso explícito**. Si se activa un proveedor externo, la clave vive en el servidor, no viaja al navegador y hay aviso visible; por defecto el agente es local. | OWASP LLM Top 10 · propia | `tests/agent-api.test.ts` · `CONTRATO_API.md` | VERIFIED |
| `AI-06` | SHOULD | **Evaluación de sesgo y red-teaming periódico**. El tutor debería pasar pruebas adversarias de sesgo y de contenido dañino con cadencia fija. | NIST AI RMF (MEASURE 2.6) · OWASP LLM01 | `docs/AI_AGENTS.md` | PLANNED |
| `AI-07` | MAY | **Voz generada sin salir del dispositivo cuando no hay red**. La síntesis del navegador es el respaldo del audio generado; la voz no se usa para identificar al estudiante. | Propia · WCAG 1.2.1 | `docs/VOICE_ARCHITECTURE.md` · `apps/web/src/components/voice-intro.tsx` | PARTIAL |

- `AI-06` (PLANNED) — Hay pruebas de inyección y de fuga en cada push, pero no un ciclo de red-teaming con casos sesgados y su informe. Se anota como pendiente en lugar de sugerirlo hecho.
- `AI-07` (PARTIAL) — El respaldo local existe y está documentado; falta medir la calidad percibida de la voz del navegador frente a la generada, así que no se afirma nada sobre ella.

### Interoperabilidad y estándares

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `INT-01` | MUST | **EPUB 3.3 accesible**. El curso se exporta a EPUB 3.3 con navegación, orden de lectura y metadatos de accesibilidad. | EPUB 3.3 · EPUB Accessibility 1.1 | `tests/packages-contract.test.ts` · `pnpm packages` | VERIFIED |
| `INT-02` | MUST | **SCORM 2004 4ª edición**. Paquete SCORM con manifiesto y seguimiento conforme a la especificación de ADL. | ADL SCORM 2004 4th Edition | `tests/packages-contract.test.ts` | VERIFIED |
| `INT-03` | MUST | **IMS Common Cartridge 1.3**. Paquete con manifiesto, organización de recursos y metadatos. | 1EdTech IMS Common Cartridge 1.3 | `tests/packages-contract.test.ts` | VERIFIED |
| `INT-04` | MUST | **QTI 1.2 (ASI) y QTI 2.1**. La evaluación se exporta en las dos generaciones de QTI: 1.2 para lo que aún vive en producción y 2.1 para lo que viene. | 1EdTech IMS QTI 1.2 y 2.1 | `tests/packages-contract.test.ts` | VERIFIED |
| `INT-05` | MUST | **Credenciales abiertas firmadas**. Open Badges 2.0 y 3.0 (como credencial verificable VC-JWT) firmadas con RS256 y verificables sin servidor. | 1EdTech Open Badges 2.0 y 3.0 · W3C Verifiable Credentials | `packages/shared/tests/badges.test.ts` | VERIFIED |
| `INT-06` | MUST | **xAPI 1.0.3**. Enunciados y actividades con vocabulario propio y validación del esquema. | ADL xAPI 1.0.3 · IEEE 9274.1.1-2023 | `packages/shared/tests/xapi.test.ts` | VERIFIED |
| `INT-07` | MUST | **Datos estructurados de los cursos**. Cada curso publica `Course`/`CourseInstance` en JSON-LD, válido y coherente con la página. | schema.org · Google Search Central (datos estructurados) | `packages/shared/tests/seo.test.ts` | VERIFIED |
| `INT-08` | MUST | **Calendario en iCalendar**. El calendario por país se exporta en un .ics plegado a 75 octetos y con zona correcta. | RFC 5545 (iCalendar), §3.1 (plegado de líneas) | `packages/shared/tests/calendar.test.ts` | VERIFIED |
| `INT-09` | SHOULD | **LTI 1.3 para incrustar el campus**. Permitir que una institución incruste lecciones con LTI 1.3 y devuelva notas por Assignment and Grade Services. | 1EdTech LTI 1.3 + AGS | `docs/ESTANDARES.md` | PLANNED |
| `INT-10` | SHOULD | **Revocación de credenciales consultable**. Quien verifica una insignia debería poder comprobar si sigue vigente. | 1EdTech OB (lista de revocación) | `docs/ESTANDARES.md` | PLANNED |

- `INT-09` (PLANNED) — Declarado como planificado en `ESTANDARES.md` y en `/estandares`. No hay implementación: el campus es estático y sin cuentas, y LTI exige registro de plataformas.
- `INT-10` (PLANNED) — Sin registro central por diseño de anonimato; la insignia se firma y se verifica en el navegador. Es una tensión real entre anonimato y revocación y está documentada como tal, no resuelta a la ligera.

### Calidad de ingeniería

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `CAL-01` | MUST | **Suites automatizadas con suelo**. Las dos suites (TypeScript y Python) se ejecutan en cada push y ninguna baja del suelo declarado. | Propia · ISO/IEC 25010 (fiabilidad). Suelo: 600 pruebas | `pnpm test` · `pnpm site` · `tests/requirements.test.ts` | VERIFIED |
| `CAL-02` | MUST | **Cobertura ≥ 80 % en lo crítico**. Cobertura medida con umbral por debajo del cual la integración continua falla. | Propia (umbral) · ISO/IEC 25010 | workflow `.github/workflows/quality.yml` (marca: «Cobertura de los módulos críticos») · `pnpm test:coverage` | CI |
| `CAL-03` | MUST | **Contenido generado sin deriva**. Los artefactos generados llevan huella y un test falla si el contenido y el generador se separan. | NIST SSDF PW.6 (reproducibilidad) | `pnpm check:drift` · `tests/contracts.test.ts` | VERIFIED |
| `CAL-04` | MUST | **Documentos generados que no mienten**. El plan quinquenal y esta tabla de requisitos se generan desde el código y un test detecta cualquier deriva. | Propia | `tests/plan-quinquenal.test.ts` · `tests/requirements.test.ts` | VERIFIED |
| `CAL-05` | SHOULD | **Decisiones con alternativas escritas**. Toda decisión de arquitectura con más de una opción razonable deja su ADR, con la descartada y su motivo. | Documentación de arquitectura · ISO/IEC 42010 (referencia) | `tests/contracts.test.ts` · `docs/DECISIONS.md` | VERIFIED |
| `CAL-06` | MUST | **Licencia clara y atribución**. Código nuevo MIT; el motor educativo conserva AGPL-3.0-only con su contradicción documentada; los recursos de terceros se atribuyen. | SPDX · convenio de Berna · AGPL-3.0-only | `tests/contracts.test.ts` · `NOTICE-ATRIBUCIONES.md` | VERIFIED |
| `CAL-08` | MUST | **Sin restos de herramientas en el árbol**. El repositorio no versiona copias de seguridad ni parches a medias (`.orig`, `.rej`, `.bak`, `*~`): un resto así se cuela en la cobertura, ensucia el diff y nadie sabe si falta algo. | Higiene de repositorio · propia | `tests/requirements.test.ts` | VERIFIED |
| `CAL-07` | SHOULD | **Versionado y changelog al día**. SemVer con changelog Keep a Changelog en el que la última versión coincide con la del manifiesto. | SemVer 2.0.0 · Keep a Changelog 1.1.0 | `tests/requirements.test.ts` · `CHANGELOG.md` | VERIFIED |


### Operación y despliegue

| ID | Nivel | Requisito | Norma o fuente | Evidencia | Estado |
|---|---|---|---|---|---|
| `OPS-01` | MUST | **Publicación automática y reproducible**. La rama principal se publica en GitHub Pages desde el flujo de trabajo, sin pasos manuales ocultos. | GitHub Pages · NIST SSDF PW.6 | workflow `.github/workflows/pages.yml` (marca: «github-pages») · `docs/DEPLOYMENT.md` | CI |
| `OPS-02` | MUST | **Verificación del export antes de publicar**. Un servidor propio reproduce el entorno publicado y las auditorías se ejecutan contra él. | Propia (verificación) · RFC 9110 (semántica HTTP) | `tools/serve-static.mjs` · `tests/requirements.test.ts` | VERIFIED |
| `OPS-03` | MUST | **Funciona sin conexión**. Un service worker cachea el campus y permite seguir estudiando sin red, con versión de caché explícita. | W3C Service Workers · PWA | `apps/web/public/sw.js` · `tests/requirements.test.ts` | VERIFIED |
| `OPS-04` | MUST | **Despliegue alternativo documentado**. Existe `docker-compose.yml` y `Dockerfile` para reconstruir el sitio en cualquier máquina, sin depender de Pages. | OCI (contenedores) · propia | `tests/requirements.test.ts` · `docker-compose.yml` | VERIFIED |
| `OPS-05` | SHOULD | **Observabilidad sin datos personales**. El diagnóstico se hace con auditorías locales y con los artefactos de la CI; no hay telemetría del estudiante. | NIST SSDF (RV) · RGPD art. 5(1)(c) | `pnpm audit:site` · `tools/audit-site.mjs` | VERIFIED |
| `OPS-06` | MAY | **Monitorización de disponibilidad externa**. Comprobación periódica de que el sitio publicado responde. | Práctica SRE (disponibilidad) | `docs/DEPLOYMENT.md` | PLANNED |
| `OPS-07` | MUST | **Secretos no residentes en el repositorio**. Ninguna clave del proyecto vive en el árbol; el escaneo del historial y la barrera del ensamblado lo comprueban antes de publicar. | NIST SSDF PS.1 · CWE-798 | `pnpm site` · workflow `.github/workflows/ci.yml` (marca: «secretos») | VERIFIED |

- `OPS-06` (PLANNED) — No hay monitor externo: el compromiso se limita a que la publicación sea automática y reproducible. Añadirlo es barato; hoy no está y no se dice que esté.

## Lo que no está en verde

De 90 requisitos, 17 no están cerrados. Se listan aquí en lugar de dejarlos
escondidos en la tabla: son el trabajo que queda y la parte incómoda de este documento.

- **PRD-04 — El portugués de Brasil abre la casa** (`PARTIAL`) — El defecto y la interfaz están en pt-BR; del material docente hay 32 de 80 semanas escritas. La cifra exacta se publica con `pnpm locales` y la página del plan.
- **PRD-07 — Presupuesto de peso por página** (`PARTIAL`) — Cinco páginas del agente están en 258,2 kB comprimidos: 8,2 kB por encima del objetivo y lejos del límite duro de 400 kB. La mediana del sitio es 242,5 kB. La auditoría avisa en lugar de relajar el umbral, y cada aviso se explica: el marco de Next.js pesa 233 kB en todas las páginas y el resto es el diccionario de la interfaz (los cuatro idiomas viajan con el cliente) más la consola del agente (24,7 kB, sólo en esa página).
- **CNT-03 — Las seis franjas restantes, escritas** (`PLANNED`) — Declaradas franja por franja con su modo y sus recursos, con `PLANNED` visible en `/plano`. Escribir 120 semanas es el siguiente incremento de contenido; no se anuncia como disponible.
- **PED-04 — Voz natural en las clases y en el tutor** (`PARTIAL`) — Publicadas en español y portugués; faltan en y ca. El texto equivalente siempre está visible, así que la falta de voz no bloquea el estudio.
- **A11Y-08 — AAA donde se lee de verdad** (`PARTIAL`) — El modo de alto contraste llega a AAA sobre el fondo principal; el resto del sitio se compromete con AA y no se declara AAA. Extenderlo a toda la paleta es trabajo pendiente.
- **A11Y-10 — Declaración de accesibilidad publicada** (`PARTIAL`) — Declaración publicada y verificada por test; no hay auditoría externa ni usuario real en la muestra, y tampoco se dice lo contrario.
- **SEC-04 — Cero vulnerabilidades críticas abiertas** (`BLOCKED`) — GitHub reporta 7 alertas en la rama por defecto (3 críticas, 1 alta, 3 moderadas) y la API de Dependabot no es accesible desde este entorno (403). Corregirlas es decisión del propietario; se declara en el riesgo residual en lugar de decir que el repositorio está limpio.
- **SEC-05 — ASVS 5.0 nivel 2 en la superficie web** (`PARTIAL`) — Revisión propia y documentada contra ASVS 2 y 3 donde aplica; no hay verificación externa ni ASVS 4 (no hay superficie con cuentas: por diseño no existe sesión de usuario).
- **SEC-09 — Cadena de suministro con atestaciones** (`PLANNED`) — El proyecto no firma la procedencia de sus artefactos: se auditan acciones fijadas por SHA y un SBOM, pero eso no es una atestación SLSA y no se declara como tal.
- **SEC-11 — Recursos de terceros con integridad** (`OUT_OF_SCOPE`) — No hay recursos de terceros (fuentes del sistema, sin CDN, sin analítica). El apartado queda declarado para cuando deje de ser cierto.
- **PRV-06 — Cifrado en reposo del almacenamiento local** (`NOT_VERIFIED`) — No está cifrado en reposo. Lo que se guarda son identificadores derivados de cursos y semanas, sin dato personal que proteger, y por eso no se ha añadido: si algún día entra cualquier dato personal, esto pasa a MUST y hay que cifrarlo o no guardarlo.
- **DAT-04 — Base de datos y servidor de aplicación** (`OUT_OF_SCOPE`) — Decisión de arquitectura, no carencia: la ausencia de servidor es lo que hace creíble la promesa de anonimato. Si cambia, cambia con ADR y con esta tabla.
- **AI-06 — Evaluación de sesgo y red-teaming periódico** (`PLANNED`) — Hay pruebas de inyección y de fuga en cada push, pero no un ciclo de red-teaming con casos sesgados y su informe. Se anota como pendiente en lugar de sugerirlo hecho.
- **AI-07 — Voz generada sin salir del dispositivo cuando no hay red** (`PARTIAL`) — El respaldo local existe y está documentado; falta medir la calidad percibida de la voz del navegador frente a la generada, así que no se afirma nada sobre ella.
- **INT-09 — LTI 1.3 para incrustar el campus** (`PLANNED`) — Declarado como planificado en `ESTANDARES.md` y en `/estandares`. No hay implementación: el campus es estático y sin cuentas, y LTI exige registro de plataformas.
- **INT-10 — Revocación de credenciales consultable** (`PLANNED`) — Sin registro central por diseño de anonimato; la insignia se firma y se verifica en el navegador. Es una tensión real entre anonimato y revocación y está documentada como tal, no resuelta a la ligera.
- **OPS-06 — Monitorización de disponibilidad externa** (`PLANNED`) — No hay monitor externo: el compromiso se limita a que la publicación sea automática y reproducible. Añadirlo es barato; hoy no está y no se dice que esté.

### Obligatorios sin cerrar (lo que de verdad bloquea)

- **PRD-04** (PARTIAL) — El portugués de Brasil abre la casa: El defecto y la interfaz están en pt-BR; del material docente hay 32 de 80 semanas escritas. La cifra exacta se publica con `pnpm locales` y la página del plan.
- **SEC-04** (BLOCKED) — Cero vulnerabilidades críticas abiertas: GitHub reporta 7 alertas en la rama por defecto (3 críticas, 1 alta, 3 moderadas) y la API de Dependabot no es accesible desde este entorno (403). Corregirlas es decisión del propietario; se declara en el riesgo residual en lugar de decir que el repositorio está limpio.

## Cómo se verifica

```bash
pnpm requirements        # regenera este documento desde el código
pnpm test                # incluye tests/requirements.test.ts (evidencia + deriva de este documento)
python -m pytest -q tests/
pnpm audit:site          # accesibilidad estática y peso del export
pnpm e2e                 # axe · WCAG 2.2 AA en navegador (en CI)
```

Niveles según RFC 2119 y RFC 8174:

- **MUST** — obligatorio: sin esto la plataforma no se declara entregada
- **SHOULD** — recomendado: se aparta sólo con motivo escrito
- **MAY** — opcional: se hace si aporta y no daña nada

_Última generación: el documento cambia sólo cuando cambia el código. Fichero fuente: `packages/shared/src/requirements.ts`._
