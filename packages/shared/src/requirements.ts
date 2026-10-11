/**
 * Requisitos de plataforma, en código y con evidencia.
 *
 * Este fichero responde a una pregunta que ninguna plataforma seria debería
 * esquivar: **¿qué exige esta plataforma de sí misma, con qué norma y cómo se
 * comprueba?** Aquí no hay aspiraciones: hay requisitos con identificador, un
 * nivel (MUST / SHOULD / MAY según RFC 2119 y RFC 8174), la norma o la fuente de
 * la que salen, la **evidencia ejecutable** que los sostiene y un estado.
 *
 * Reglas de la casa, verificadas por `tests/requirements.test.ts`:
 *
 *  1. Todo requisito cita al menos una evidencia, y esa evidencia **existe**: un
 *     test que está en el árbol, un fichero que existe, un script declarado en
 *     `package.json` o un trabajo de workflow con su marca textual.
 *  2. `VERIFIED` exige evidencia **ejecutable** (test o script): un fichero que
 *     existe no demuestra un comportamiento.
 *  3. `CI` exige evidencia de workflow o de una ejecución concreta.
 *  4. Todo lo que no esté en verde (`PARTIAL`, `PLANNED`, `BLOCKED`,
 *     `NOT_VERIFIED`, `ACCEPTED`, `OUT_OF_SCOPE`) **obliga a explicar el motivo**.
 *     Sin excusa escrita no se admite el estado.
 *  5. El listón (`TARGETS`) es público y numérico: un objetivo que no se puede
 *     medir no es un objetivo, es una intención.
 *
 * El documento `docs/REQUISITOS.md` y la página `/requisitos` se generan desde
 * aquí (`pnpm requirements`): si alguien cambia un estado y no regenera, el test
 * de deriva lo caza.
 */

/* ------------------------------------------------------------------- niveles */

export const LEVELS = ["MUST", "SHOULD", "MAY"] as const;
export type Level = (typeof LEVELS)[number];

/** Significado, en la línea de RFC 2119 / RFC 8174. */
export const LEVEL_MEANING: Record<Level, string> = {
  MUST: "obligatorio: sin esto la plataforma no se declara entregada",
  SHOULD: "recomendado: se aparta sólo con motivo escrito",
  MAY: "opcional: se hace si aporta y no daña nada"
} as const;

/* ------------------------------------------------------------------ estados */

export const STATUSES = [
  "VERIFIED",
  "CI",
  "PARTIAL",
  "PLANNED",
  "BLOCKED",
  "NOT_VERIFIED",
  "ACCEPTED",
  "OUT_OF_SCOPE"
] as const;
export type RequirementStatus = (typeof STATUSES)[number];

/** Los estados que exigen una explicación escrita; el test lo obliga. */
export const STATUSES_NEEDING_NOTE: RequirementStatus[] = ["PARTIAL", "PLANNED", "BLOCKED", "NOT_VERIFIED", "ACCEPTED", "OUT_OF_SCOPE"];

export const STATUS_MEANING: Record<RequirementStatus, string> = {
  VERIFIED: "comprobado aquí, con evidencia ejecutable",
  CI: "comprobado por la integración continua del repositorio",
  PARTIAL: "cubierto en parte; se dice qué falta",
  PLANNED: "decidido y aún sin construir",
  BLOCKED: "depende de una decisión o un acceso que no están en mis manos",
  NOT_VERIFIED: "sin comprobación: no se afirma",
  ACCEPTED: "cumplido parcialmente y aceptado a conciencia, con el motivo escrito",
  OUT_OF_SCOPE: "fuera de alcance por decisión de arquitectura, declarado en voz alta"
} as const;

/* ------------------------------------------------------------------ dominios */

export const DOMAINS = {
  producto: "Producto y experiencia",
  contenido: "Currículo y contenido",
  pedagogia: "Pedagogía y evaluación",
  accesibilidad: "Accesibilidad",
  rendimiento: "Rendimiento",
  seguridad: "Seguridad",
  privacidad: "Privacidad y datos personales",
  datos: "Datos del estudiante",
  ia: "Inteligencia artificial responsable",
  interoperabilidad: "Interoperabilidad y estándares",
  calidad: "Calidad de ingeniería",
  operacion: "Operación y despliegue"
} as const;
export type DomainId = keyof typeof DOMAINS;

/* ----------------------------------------------------------------- evidencia */

/**
 * La evidencia tiene que ser comprobable. Cada tipo se verifica de una forma
 * distinta y el test lo hace:
 *
 *  - `test`: el fichero de pruebas existe (y se ejecuta en `pnpm test` / `pytest`).
 *  - `file`: el fichero existe (muestra la decisión, no el comportamiento).
 *  - `script`: el script está declarado en `package.json` (algo que se ejecuta).
 *  - `workflow`: el workflow existe **y contiene** la marca textual del trabajo.
 *  - `ci`: ejecución concreta de la CI, citada por su identificador.
 */
export type Evidence =
  | { kind: "test"; ref: string }
  | { kind: "file"; ref: string }
  | { kind: "script"; ref: string }
  | { kind: "workflow"; ref: string; marker: string }
  | { kind: "ci"; ref: string };

export interface Requirement {
  id: string;
  domain: DomainId;
  level: Level;
  title: string;
  statement: string;
  source: string;
  evidence: Evidence[];
  status: RequirementStatus;
  note?: string;
}

/** Azúcar para escribir el registro sin repetir la forma del objeto. */
const req = (
  id: string,
  domain: DomainId,
  level: Level,
  title: string,
  statement: string,
  source: string,
  evidence: Evidence[],
  status: RequirementStatus,
  note?: string
): Requirement => ({ id, domain, level, title, statement, source, evidence, status, ...(note ? { note } : {}) });

const test = (ref: string): Evidence => ({ kind: "test", ref });
const file = (ref: string): Evidence => ({ kind: "file", ref });
const script = (ref: string): Evidence => ({ kind: "script", ref });
const workflow = (ref: string, marker: string): Evidence => ({ kind: "workflow", ref, marker });
const ci = (ref: string): Evidence => ({ kind: "ci", ref });

/* ------------------------------------------------------------------- listón */

/**
 * El listón. Son cifras, no adjetivos: cada una se comprueba en algún sitio del
 * repositorio y el conjunto se publica en `/requisitos`.
 */
export const TARGETS = {
  /** WCAG 2.2 AA en todas las rutas auditadas; AAA donde el texto se lee de verdad. */
  wcag: { required: "WCAG 2.2 AA", stretch: "WCAG 2.2 AAA en texto de lectura y en modo de alto contraste" },
  /** OWASP ASVS 5.0: nivel 2 como objetivo de la superficie web, 3 donde aplique. */
  asvs: { target: 2, stretch: 3 },
  /** Lighthouse: umbral de la casa por encima del 90 de «bueno». */
  lighthouse: { performance: 95, accessibility: 100, bestPractices: 95, seo: 100 },
  /** Core Web Vitals en el percentil 75, umbrales de Google. */
  cwv: { lcpMs: 2500, inpMs: 200, cls: 0.1 },
  /** Cobertura de los módulos críticos. */
  coverage: 80,
  /** Presupuesto de JavaScript por página, comprimido (la auditoría avisa >250 kB, falla >400 kB). */
  jsBudgetKb: { target: 250, hard: 400 },
  /**
   * Suelo de pruebas **ejecutadas** (vitest + pytest) que la plataforma no baja.
   * La parametrización de pytest multiplica los casos escritos, así que el suelo
   * de casos declarados en el árbol es otro número, también comprobado.
   */
  testsFloor: 600,
  /** Suelo de casos escritos en el árbol (contables sin ejecutar la suite completa). */
  declaredCasesFloor: 380,
  /** Datos personales almacenados. No es una cifra pequeña: es cero. */
  pii: 0,
  /** Vulnerabilidades críticas abiertas permitidas. Ninguna. */
  criticalVulnerabilities: 0
} as const;

/* ---------------------------------------------------------------- requisitos */

export const REQUIREMENTS: Requirement[] = [
  /* ---------------------------------------------------------------- producto */
  req(
    "PRD-01",
    "producto",
    "MUST",
    "Arquitectura de la información verificable",
    "Toda ruta publicada existe, es alcanzable desde la navegación o el pie y el export no tiene enlaces internos rotos.",
    "WCAG 2.4.4 (propósito del enlace) · ISO/IEC 25010 (usabilidad)",
    [script("audit:site"), workflow(".github/workflows/quality.yml", "Accesibilidad y peso sin navegador")],
    "CI",
    "La auditoría del export se ejecuta en cada push sobre las 501 páginas; localmente da 0 errores."
  ),
  req(
    "PRD-02",
    "producto",
    "MUST",
    "Un solo sistema de diseño",
    "Colores, tipografía, espaciado y foco salen de tokens declarados una vez; ningún componente inventa valores.",
    "ISO/IEC 25010 (mantenibilidad) · propia",
    [test("packages/ui/tests/tokens.test.ts"), file("packages/ui/src/tokens.ts")],
    "VERIFIED"
  ),
  req(
    "PRD-03",
    "producto",
    "MUST",
    "Cuatro idiomas con paridad de claves",
    "pt-BR, es, en y ca publican exactamente las mismas claves de interfaz; el `<html lang>` es correcto por ruta.",
    "ISO/IEC 40500 · WCAG 3.1.1 (idioma de la página)",
    [test("packages/shared/tests/i18n.test.ts"), test("tests/contracts.test.ts")],
    "VERIFIED"
  ),
  req(
    "PRD-04",
    "producto",
    "MUST",
    "El portugués de Brasil abre la casa",
    "El defecto y el primer idioma es pt-BR: rutas sin prefijo, `lang=\"pt-BR\"` y contenido portugués antes que ningún otro.",
    "Decisión de producto (2026-10-11) · ABNT NBR 6023 (referencias)",
    [test("tests/portugues-brasil.test.ts"), script("locales")],
    "PARTIAL",
    "El defecto y la interfaz están en pt-BR; del material docente hay 32 de 80 semanas escritas. La cifra exacta se publica con `pnpm locales` y la página del plan."
  ),
  req(
    "PRD-05",
    "producto",
    "SHOULD",
    "Decisiones acotadas por ley de Hick y Miller",
    "La navegación ofrece seis destinos primarios y pliega el resto; ninguna vista acumula más filtros visibles de los que la memoria de trabajo sostiene.",
    "Hick (1952) · Miller (1956)",
    [test("packages/ui/tests/psychology.test.ts"), test("tests/contracts.test.ts")],
    "VERIFIED"
  ),
  req(
    "PRD-06",
    "producto",
    "MUST",
    "El contenido no depende de JavaScript",
    "Leer, navegar y descargar funciona sin JS; ningún efecto oculta contenido cuando el script no llega.",
    "Progressive enhancement · WCAG 2.1.1",
    [test("packages/ui/tests/psychology.test.ts"), script("audit:site")],
    "VERIFIED"
  ),
  req(
    "PRD-07",
    "producto",
    "SHOULD",
    "Presupuesto de peso por página",
    "Ninguna página supera el presupuesto de JavaScript comprimido de la casa.",
    `Presupuesto propio: aviso > ${TARGETS.jsBudgetKb.target} kB, error > ${TARGETS.jsBudgetKb.hard} kB`,
    [script("audit:site")],
    "PARTIAL",
    "Cinco páginas del agente están en 258,2 kB comprimidos: 8,2 kB por encima del objetivo y lejos del límite duro de 400 kB. La mediana del sitio es 242,5 kB. La auditoría avisa en lugar de relajar el umbral, y cada aviso se explica: el marco de Next.js pesa 233 kB en todas las páginas y el resto es el diccionario de la interfaz (los cuatro idiomas viajan con el cliente) más la consola del agente (24,7 kB, sólo en esa página)."
  ),
  req(
    "PRD-08",
    "producto",
    "MUST",
    "Búsqueda propia, sin servicios externos",
    "La búsqueda del campus funciona con un índice propio (BM25) construido en el build: sin servicio, sin red y sin datos personales.",
    "Propia · ISO/IEC 25010 (funcionalidad)",
    [test("packages/shared/tests/search.test.ts"), file("packages/shared/src/search.ts")],
    "VERIFIED"
  ),
  req(
    "PRD-09",
    "producto",
    "SHOULD",
    "Experiencia medida y publicada",
    "Las decisiones de color, tipografía, distancia y movimiento están declaradas como tokens con fuente citada y se publican en `/experiencia`.",
    "Zhou et al. (2025, JCR) · WCAG 2.3.3 · propia",
    [test("packages/ui/tests/psychology.test.ts"), file("docs/PSICOLOGIA-Y-EXPERIENCIA.md")],
    "VERIFIED"
  ),

  /* --------------------------------------------------------------- contenido */
  req(
    "CNT-01",
    "contenido",
    "MUST",
    "Malla de cinco años sin huecos ni solapes",
    "El plan cubre 200 semanas en 10 franjas de 20; `validateCurriculum()` demuestra la cobertura 1..200.",
    "Propia (malla declarada) · EQF nivel 6-7 (referencia de complejidad)",
    [test("tests/curriculum.test.ts"), script("plan")],
    "VERIFIED"
  ),
  req(
    "CNT-02",
    "contenido",
    "MUST",
    "Ochenta semanas publicadas con estructura completa",
    "Cada semana tiene lectura, práctica guiada, caso real, glosario, chuleta, laboratorio, rúbrica y examen coherentes.",
    "Propia · IMS Common Cartridge 1.3 (estructura)",
    [test("tests/test_campus.py"), test("tests/syllabus-contract.test.ts")],
    "VERIFIED"
  ),
  req(
    "CNT-03",
    "contenido",
    "SHOULD",
    "Las seis franjas restantes, escritas",
    "Las franjas 5 a 10 (especialidades, arquitectura, CISO, capstone y docencia) deben tener material, no sólo descripción.",
    "Propia",
    [file("docs/PLAN-QUINQUENAL.md"), script("plan")],
    "PLANNED",
    "Declaradas franja por franja con su modo y sus recursos, con `PLANNED` visible en `/plano`. Escribir 120 semanas es el siguiente incremento de contenido; no se anuncia como disponible."
  ),
  req(
    "CNT-04",
    "contenido",
    "MUST",
    "Biblioteca de recursos abiertos con procedencia",
    "Cada recurso cita autor, tipo, idioma, nivel y acceso, y la ficha no se publica sin esos campos.",
    "UNESCO OER (recomendación de recursos educativos abiertos) · propia",
    [test("packages/shared/tests/library.test.ts"), script("locales")],
    "VERIFIED"
  ),
  req(
    "CNT-05",
    "contenido",
    "MUST",
    "Ni espejos ni cursos de pago",
    "La biblioteca no enlaza agregadores ni copias no autorizadas: una lista de dominios prohibidos y un test lo impiden.",
    "Derechos de autor (convenio de Berna) · propia",
    [test("packages/shared/tests/library.test.ts"), file("packages/shared/src/library.ts")],
    "VERIFIED"
  ),
  req(
    "CNT-06",
    "contenido",
    "MUST",
    "Material sin secretos ni credenciales",
    "Ningún fichero del campus contiene claves, tokens ni credenciales; los ejemplos usan dominios de laboratorio reservados.",
    "CWE-798 · NIST SSDF PS.1",
    [test("tests/test_material_sin_secretos.py"), workflow(".github/workflows/ci.yml", "secretos")],
    "CI"
  ),
  req(
    "CNT-07",
    "contenido",
    "SHOULD",
    "Viaje de datos internacional",
    "El material cita derechos de datos de la UE (RGPD), de Brasil (LGPD) y de Estados Unidos, según el país del estudiante.",
    "RGPD · LGPD (Lei 13.709/2018)",
    [file("campus/cursos/gobernanza-compliance/semana-01.md"), test("tests/test_campus.py")],
    "VERIFIED"
  ),

  /* -------------------------------------------------------------- pedagogía */
  req(
    "PED-01",
    "pedagogia",
    "MUST",
    "Evaluación con rúbrica y defensa",
    "La nota pesa 30 % P1 + 30 % P2 + 40 % P3 y no hay aprobado sin proyecto, defensa y entregables.",
    "Propia · taxonomía de Bloom (niveles de logro)",
    [test("tests/test_campus.py")],
    "VERIFIED"
  ),
  req(
    "PED-02",
    "pedagogia",
    "MUST",
    "Repaso espaciado tipo SM-2",
    "El mazo de repaso programa intervalos según el algoritmo SM-2 y respeta las tarjetas suspendidas.",
    "SM-2 (Wozniak, SuperMemo) · efecto de espaciado (Ebbinghaus)",
    [test("packages/shared/tests/review.test.ts")],
    "VERIFIED"
  ),
  req(
    "PED-03",
    "pedagogia",
    "MUST",
    "Progreso en formato xAPI, sin servidor",
    "Los enunciados de actividad se generan conforme a xAPI 1.0.3 y se exportan desde el propio dispositivo del estudiante.",
    "ADL xAPI 1.0.3 · IEEE 9274.1.1-2023",
    [test("packages/shared/tests/xapi.test.ts"), test("tests/packages-contract.test.ts")],
    "VERIFIED"
  ),
  req(
    "PED-04",
    "pedagogia",
    "MAY",
    "Voz natural en las clases y en el tutor",
    "Explicaciones y tutor con voz humanizada; el audio se genera a petición y nunca se guarda.",
    "Propia · WCAG 1.2 (alternativas a multimedia)",
    [file("apps/web/src/components/voice-lesson.tsx"), file("docs/VOICE_ARCHITECTURE.md")],
    "PARTIAL",
    "Publicadas en español y portugués; faltan en y ca. El texto equivalente siempre está visible, así que la falta de voz no bloquea el estudio."
  ),
  req(
    "PED-05",
    "pedagogia",
    "SHOULD",
    "Cada semana con autoevaluación",
    "Cada semana lleva preguntas con retroalimentación explicada, no sólo la respuesta correcta.",
    "Propia · retroalimentación formativa (Hattie y Timperley, 2007)",
    [test("tests/test_campus.py")],
    "VERIFIED"
  ),

  /* ------------------------------------------------------------ accesibilidad */
  req(
    "A11Y-01",
    "accesibilidad",
    "MUST",
    "WCAG 2.2 AA en las rutas principales",
    "23 rutas auditadas con axe en escritorio y móvil, con las etiquetas wcag2a, wcag2aa, wcag21aa y wcag22aa.",
    "W3C WCAG 2.2 · EN 301 549 v3.2.1 (referencia)",
    [test("e2e/a11y.spec.ts"), workflow(".github/workflows/quality.yml", "axe · WCAG 2.2 AA")],
    "CI"
  ),
  req(
    "A11Y-02",
    "accesibilidad",
    "MUST",
    "Todo par texto/fondo ≥ 4,5:1",
    "Cada combinación que aparece en la interfaz se calcula con la fórmula de luminancia de WCAG y se exige por test.",
    "WCAG 2.2 SC 1.4.3 (AA)",
    [test("packages/ui/tests/tokens.test.ts"), file("packages/ui/src/tokens.ts")],
    "VERIFIED"
  ),
  req(
    "A11Y-03",
    "accesibilidad",
    "MUST",
    "Foco visible y navegación por teclado",
    "Anillo de foco propio, enlace de salto al contenido y orden de tabulación comprobado en el navegador.",
    "WCAG 2.2 SC 2.4.7 y 2.4.1",
    [test("e2e/a11y.spec.ts"), workflow(".github/workflows/quality.yml", "axe · WCAG 2.2 AA")],
    "CI"
  ),
  req(
    "A11Y-04",
    "accesibilidad",
    "MUST",
    "Objetivos táctiles grandes",
    "44 px de casa (guía de plataforma y AAA) frente a los 24 px legales de AA, con 8 px de separación entre objetivos.",
    "WCAG 2.2 SC 2.5.8 (AA, 24 px) · SC 2.5.5 (AAA, 44 px)",
    [test("packages/ui/tests/psychology.test.ts")],
    "VERIFIED"
  ),
  req(
    "A11Y-05",
    "accesibilidad",
    "MUST",
    "Movimiento respetuoso y desactivable",
    "Sin parallax ni desplazamientos grandes; todo lo animado vive tras `prefers-reduced-motion: no-preference` y la preferencia se escucha en caliente.",
    "WCAG 2.2 SC 2.3.3 (analizada) · guía vestibular del W3C",
    [test("packages/ui/tests/psychology.test.ts"), file("apps/web/src/components/motion-rhythm.tsx")],
    "VERIFIED"
  ),
  req(
    "A11Y-06",
    "accesibilidad",
    "MUST",
    "Idioma correcto en cada ruta",
    "`<html lang=\"pt-BR\">` (no `pt`) donde corresponde, comprobado ruta por ruta en el navegador.",
    "WCAG 2.2 SC 3.1.1",
    [test("e2e/a11y.spec.ts"), test("tests/portugues-brasil.test.ts"), workflow(".github/workflows/quality.yml", "axe · WCAG 2.2 AA")],
    "CI"
  ),
  req(
    "A11Y-07",
    "accesibilidad",
    "MUST",
    "Nada depende sólo del color",
    "Los estados llevan etiqueta textual además del color; ningún dato se distingue únicamente por el tono.",
    "WCAG 2.2 SC 1.4.1",
    [test("packages/ui/tests/tokens.test.ts")],
    "VERIFIED"
  ),
  req(
    "A11Y-08",
    "accesibilidad",
    "SHOULD",
    "AAA donde se lee de verdad",
    "El texto largo y el modo de alto contraste alcanzan 7:1.",
    "WCAG 2.2 SC 1.4.6 (AAA)",
    [test("packages/ui/tests/tokens.test.ts")],
    "PARTIAL",
    "El modo de alto contraste llega a AAA sobre el fondo principal; el resto del sitio se compromete con AA y no se declara AAA. Extenderlo a toda la paleta es trabajo pendiente."
  ),
  req(
    "A11Y-09",
    "accesibilidad",
    "MUST",
    "Material exportado accesible",
    "El EPUB cumple EPUB 3.3 y EPUB Accessibility 1.1: navegación, `epub:type`, orden de lectura y metadatos de accesibilidad.",
    "EPUB 3.3 · EPUB Accessibility 1.1 (W3C)",
    [test("tests/packages-contract.test.ts"), script("packages")],
    "VERIFIED"
  ),
  req(
    "A11Y-10",
    "accesibilidad",
    "SHOULD",
    "Declaración de accesibilidad publicada",
    "El sitio dice en sus cuatro idiomas qué se cumple, con qué se verifica y qué queda fuera, sin adornos.",
    "EN 301 549 (documentación) · WCAG-EM 1.0 (referencia de método)",
    [file("apps/web/src/components/standards-view.tsx"), test("tests/contracts.test.ts")],
    "PARTIAL",
    "Declaración publicada y verificada por test; no hay auditoría externa ni usuario real en la muestra, y tampoco se dice lo contrario."
  ),

  /* ------------------------------------------------------------- rendimiento */
  req(
    "PERF-01",
    "rendimiento",
    "MUST",
    "Lighthouse ≥ 95 y accesibilidad 100",
    "Seis URL × tres pasadas con presupuesto de rendimiento, accesibilidad, buenas prácticas y SEO.",
    "Lighthouse (umbral > 90) · presupuesto de la casa en 95",
    [workflow(".github/workflows/quality.yml", "Lighthouse ≥ 95 y Core Web Vitals")],
    "CI"
  ),
  req(
    "PERF-02",
    "rendimiento",
    "MUST",
    "Core Web Vitals por debajo del umbral",
    "LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 medidos en la CI.",
    "Core Web Vitals (Google) · umbral del percentil 75",
    [workflow(".github/workflows/quality.yml", "Lighthouse ≥ 95 y Core Web Vitals")],
    "CI"
  ),
  req(
    "PERF-03",
    "rendimiento",
    "MUST",
    "Export estático autosuficiente",
    "El sitio se ensambla y se sirve sin proceso en el servidor: HTML, CSS y recursos propios.",
    "Propia · W3C HTML",
    [script("site"), test("tests/requirements.test.ts")],
    "VERIFIED"
  ),
  req(
    "PERF-04",
    "rendimiento",
    "MUST",
    "Sin peticiones a terceros",
    "Tipografías del sistema, sin CDN, sin analítica externa y sin imágenes remotas: el navegador sólo habla con el propio sitio.",
    "Propia (privacidad y rendimiento) · CSP de la casa",
    [test("tests/contracts.test.ts"), test("packages/ui/tests/psychology.test.ts")],
    "VERIFIED"
  ),
  req(
    "PERF-05",
    "rendimiento",
    "SHOULD",
    "Comprime y cachea en el borde",
    "El servicio estático sirve brotli/gzip y cabeceras de caché; las cabeceras de seguridad viajan en el HTML además de en el servidor.",
    "RFC 9110 (caché) · OWASP Secure Headers",
    [test("tests/requirements.test.ts"), file("tools/serve-static.mjs")],
    "VERIFIED"
  ),

  /* ---------------------------------------------------------------- seguridad */
  req(
    "SEC-01",
    "seguridad",
    "MUST",
    "Escaneo de secretos con control negativo",
    "Gitleaks sobre el historial completo, con binario fijado por SHA-256 y con un control que falla si el escáner no encuentra nada.",
    "NIST SSDF PS.1 · CWE-798",
    [workflow(".github/workflows/ci.yml", "secretos"), ci("38146258189")],
    "CI"
  ),
  req(
    "SEC-02",
    "seguridad",
    "MUST",
    "CSP y cabeceras restrictivas",
    "Política sin comodines y sin `unsafe-inline` en scripts; Referrer-Policy, X-Content-Type-Options, Permissions-Policy y COOP.",
    "OWASP ASVS V14 · OWASP Secure Headers",
    [test("tests/contracts.test.ts"), file("apps/web/src/lib/security-headers.ts")],
    "VERIFIED"
  ),
  req(
    "SEC-03",
    "seguridad",
    "MUST",
    "Dependencias auditadas con motivo escrito",
    "Cada aviso aceptado lleva su razón en `DEPENDENCIAS.md`; el test falla si hay un aviso sin justificar.",
    "NIST SSDF PW.4 · OWASP A06:2021",
    [script("audit:deps"), file("DEPENDENCIAS.md")],
    "VERIFIED"
  ),
  req(
    "SEC-04",
    "seguridad",
    "MUST",
    "Cero vulnerabilidades críticas abiertas",
    "Ninguna alerta crítica de Dependabot puede quedar sin resolver ni sin excepción documentada.",
    "OWASP A06:2021 · NIST SSDF RV.1",
    [script("audit:deps"), ci("38146258189")],
    "BLOCKED",
    "GitHub reporta 7 alertas en la rama por defecto (3 críticas, 1 alta, 3 moderadas) y la API de Dependabot no es accesible desde este entorno (403). Corregirlas es decisión del propietario; se declara en el riesgo residual en lugar de decir que el repositorio está limpio."
  ),
  req(
    "SEC-05",
    "seguridad",
    "SHOULD",
    "ASVS 5.0 nivel 2 en la superficie web",
    "Controles aplicables de ASVS 5.0 (autenticación no aplica: no hay cuentas) revisados y documentados.",
    "OWASP ASVS 5.0",
    [file("SECURITY.md"), test("tests/agent-api.test.ts")],
    "PARTIAL",
    "Revisión propia y documentada contra ASVS 2 y 3 donde aplica; no hay verificación externa ni ASVS 4 (no hay superficie con cuentas: por diseño no existe sesión de usuario)."
  ),
  req(
    "SEC-06",
    "seguridad",
    "MUST",
    "El agente resiste inyección y exfiltración",
    "Deny-list, control de SSRF, sin escritura de ficheros y con el progreso del estudiante fuera del contexto del modelo.",
    "OWASP LLM Top 10 2025 (LLM01, LLM05, LLM06) · MITRE ATLAS",
    [test("packages/agent/tests/agent.test.ts"), test("tests/ai-governance.test.ts")],
    "VERIFIED"
  ),
  req(
    "SEC-07",
    "seguridad",
    "MUST",
    "Errores según RFC 9457",
    "La API del agente responde `application/problem+json` con tipo, título, estado y detalle; sin filtrar trazas internas.",
    "RFC 9457 · OWASP API Security Top 10 2023 (API8)",
    [test("tests/agent-api.test.ts"), file("CONTRATO_API.md")],
    "VERIFIED"
  ),
  req(
    "SEC-08",
    "seguridad",
    "MUST",
    "SBOM en cada entrega",
    "Se genera un SBOM CycloneDX con los componentes del árbol y sus licencias declaradas; los que no acreditan licencia se cuentan y se publican.",
    "CycloneDX 1.5 · elementos mínimos del NTIA",
    [script("sbom"), test("tests/contracts.test.ts")],
    "VERIFIED"
  ),
  req(
    "SEC-09",
    "seguridad",
    "SHOULD",
    "Cadena de suministro con atestaciones",
    "Procedencia de la construcción (SLSA) firmada y verificable para los artefactos publicados.",
    "SLSA v1.0 · NIST SSDF PW.6",
    [file("docs/decisions/ADR-0012-estandares-interoperables.md")],
    "PLANNED",
    "El proyecto no firma la procedencia de sus artefactos: se auditan acciones fijadas por SHA y un SBOM, pero eso no es una atestación SLSA y no se declara como tal."
  ),
  req(
    "SEC-10",
    "seguridad",
    "MUST",
    "Vulnerabilidades de contenido con reporte",
    "`security.txt` con contacto, idioma, caducidad y política de divulgación, sirviéndose desde el sitio publicado.",
    "RFC 9116",
    [test("tests/contracts.test.ts"), file("apps/web/public/.well-known/security.txt")],
    "VERIFIED"
  ),
  req(
    "SEC-11",
    "seguridad",
    "MAY",
    "Recursos de terceros con integridad",
    "Todo recurso externo habría de llevar SRI; la casa resuelve el problema por la vía de no tener recursos externos.",
    "OWASP ASVS 14.2",
    [test("tests/contracts.test.ts")],
    "OUT_OF_SCOPE",
    "No hay recursos de terceros (fuentes del sistema, sin CDN, sin analítica). El apartado queda declarado para cuando deje de ser cierto."
  ),

  /* --------------------------------------------------------------- privacidad */
  req(
    "PRV-01",
    "privacidad",
    "MUST",
    "Cero datos personales almacenados",
    "El progreso, el repaso y la credencial no guardan nombre, correo, teléfono ni el número del que se derivó la llave.",
    "RGPD art. 5(1)(c) (minimización) · LGPD art. 6",
    [test("tests/test_campus.py"), test("tests/identity.test.ts")],
    "VERIFIED"
  ),
  req(
    "PRV-02",
    "privacidad",
    "MUST",
    "Identidad derivada, nunca almacenada",
    "La llave del estudiante sale de los cuatro dígitos que él elige y se usa como identificador derivado; el número no se guarda ni se envía.",
    "RGPD arts. 25 y 32 · privacidad por diseño",
    [test("tests/identity.test.ts"), file("packages/shared/src/identity.ts")],
    "VERIFIED"
  ),
  req(
    "PRV-03",
    "privacidad",
    "MUST",
    "Sin cookies ni rastreadores",
    "No hay cookies, ni analítica de terceros, ni píxeles: el CSP y el aviso de privacidad lo fijan y el test lo comprueba.",
    "Directiva ePrivacy art. 5(3) · RGPD art. 13",
    [test("tests/contracts.test.ts"), file("apps/web/src/components/privacy-view.tsx")],
    "VERIFIED"
  ),
  req(
    "PRV-04",
    "privacidad",
    "MUST",
    "Aviso de privacidad claro, en cuatro idiomas",
    "Explica qué se guarda (nada personal), dónde (en el dispositivo) y cómo borrarlo, en pt-BR, es, en y ca.",
    "RGPD arts. 12-14",
    [test("tests/content-i18n.test.ts"), file("apps/web/src/components/privacy-view.tsx")],
    "VERIFIED"
  ),
  req(
    "PRV-05",
    "privacidad",
    "SHOULD",
    "Derechos ejercibles sin intermediario",
    "Exportar y borrar el progreso se hace desde la propia página, sin solicitud ni espera.",
    "RGPD arts. 15 y 17",
    [test("packages/shared/tests/progress.test.ts"), file("apps/web/src/components/progress-board.tsx")],
    "VERIFIED"
  ),
  req(
    "PRV-06",
    "privacidad",
    "MAY",
    "Cifrado en reposo del almacenamiento local",
    "El almacén del navegador podría cifrarse con la llave derivada del estudiante.",
    "RGPD art. 32 (medidas técnicas)",
    [file("apps/web/src/lib/progress-store.ts")],
    "NOT_VERIFIED",
    "No está cifrado en reposo. Lo que se guarda son identificadores derivados de cursos y semanas, sin dato personal que proteger, y por eso no se ha añadido: si algún día entra cualquier dato personal, esto pasa a MUST y hay que cifrarlo o no guardarlo."
  ),
  req(
    "PRV-07",
    "privacidad",
    "MUST",
    "El agente no recibe el expediente del estudiante",
    "Lo que el tutor recibe es la pregunta y el contexto público del campus; el progreso no sale del dispositivo.",
    "RGPD art. 5(1)(c) · NIST AI RMF (privacidad)",
    [test("tests/ai-governance.test.ts"), test("packages/agent/tests/agent.test.ts")],
    "VERIFIED"
  ),

  /* -------------------------------------------------------------------- datos */
  req(
    "DAT-01",
    "datos",
    "MUST",
    "Esquema de datos versionado",
    "El almacén local lleva versión y las migraciones se aplican sin perder progreso.",
    "Propia (evolución de esquema) · ISO/IEC 25010 (fiabilidad)",
    [test("packages/shared/tests/progress.test.ts")],
    "VERIFIED"
  ),
  req(
    "DAT-02",
    "datos",
    "MUST",
    "Datos corruptos no rompen el campus",
    "Un almacén ilegible se descarta y se reconstruye: el campus nunca se queda en blanco por JSON inválido.",
    "CWE-20 (validación de entrada)",
    [test("packages/shared/tests/progress.test.ts")],
    "VERIFIED"
  ),
  req(
    "DAT-03",
    "datos",
    "SHOULD",
    "Copia de seguridad del propio progreso",
    "Exportar e importar el progreso en un fichero legible, sin servicio intermedio.",
    "Propia · RGPD art. 20 (portabilidad)",
    [test("packages/shared/tests/progress.test.ts"), file("apps/web/src/components/progress-board.tsx")],
    "VERIFIED"
  ),
  req(
    "DAT-04",
    "datos",
    "MAY",
    "Base de datos y servidor de aplicación",
    "El campus no guarda nada en servidor: no hay base de datos que operar.",
    "Decisión de arquitectura (ADR-0001 · sitio estático)",
    [file("docs/ARCHITECTURE.md"), file("docs/decisions/ADR-0001-dos-campus.md")],
    "OUT_OF_SCOPE",
    "Decisión de arquitectura, no carencia: la ausencia de servidor es lo que hace creíble la promesa de anonimato. Si cambia, cambia con ADR y con esta tabla."
  ),

  /* ----------------------------------------------------------------------- ia */
  req(
    "AI-01",
    "ia",
    "MUST",
    "El tutor cita y no inventa",
    "Cada respuesta viaja con sus fuentes del campus; sin fuente, no hay afirmación.",
    "NIST AI RMF (MEASURE) · OWASP LLM09 (desinformación)",
    [test("packages/agent/tests/agent.test.ts"), test("tests/agent-api.test.ts")],
    "VERIFIED"
  ),
  req(
    "AI-02",
    "ia",
    "MUST",
    "Modo examen activo",
    "Con el modo examen puesto, el tutor acompaña sin dar la respuesta de la evaluación.",
    "Propia (integridad académica) · NIST AI RMF (GOVERN)",
    [test("packages/agent/tests/agent.test.ts")],
    "VERIFIED"
  ),
  req(
    "AI-03",
    "ia",
    "MUST",
    "Gobernanza de IA publicada",
    "Doce controles ponderados con evidencia y referencia normativa, evaluables por el propio estudiante en `/laboratorio`.",
    "NIST AI RMF 1.0 · Reglamento (UE) 2024/1689 (transparencia)",
    [test("tests/ai-governance.test.ts"), file("docs/AI_GOVERNANCE.md")],
    "VERIFIED"
  ),
  req(
    "AI-04",
    "ia",
    "MUST",
    "Herramientas del tutor de sólo lectura",
    "El tutor puede consultar el campus (programas, semanas, biblioteca, itinerarios, plan) y no puede escribir nada.",
    "OWASP LLM06 (exceso de agencia)",
    [test("tests/contracts.test.ts"), file("packages/shared/src/tutor-tools.ts")],
    "VERIFIED"
  ),
  req(
    "AI-05",
    "ia",
    "MUST",
    "Proveedor externo, sólo con permiso explícito",
    "Si se activa un proveedor externo, la clave vive en el servidor, no viaja al navegador y hay aviso visible; por defecto el agente es local.",
    "OWASP LLM Top 10 · propia",
    [test("tests/agent-api.test.ts"), file("CONTRATO_API.md")],
    "VERIFIED"
  ),
  req(
    "AI-06",
    "ia",
    "SHOULD",
    "Evaluación de sesgo y red-teaming periódico",
    "El tutor debería pasar pruebas adversarias de sesgo y de contenido dañino con cadencia fija.",
    "NIST AI RMF (MEASURE 2.6) · OWASP LLM01",
    [file("docs/AI_AGENTS.md")],
    "PLANNED",
    "Hay pruebas de inyección y de fuga en cada push, pero no un ciclo de red-teaming con casos sesgados y su informe. Se anota como pendiente en lugar de sugerirlo hecho."
  ),
  req(
    "AI-07",
    "ia",
    "MAY",
    "Voz generada sin salir del dispositivo cuando no hay red",
    "La síntesis del navegador es el respaldo del audio generado; la voz no se usa para identificar al estudiante.",
    "Propia · WCAG 1.2.1",
    [file("docs/VOICE_ARCHITECTURE.md"), file("apps/web/src/components/voice-intro.tsx")],
    "PARTIAL",
    "El respaldo local existe y está documentado; falta medir la calidad percibida de la voz del navegador frente a la generada, así que no se afirma nada sobre ella."
  ),

  /* -------------------------------------------------------- interoperabilidad */
  req(
    "INT-01",
    "interoperabilidad",
    "MUST",
    "EPUB 3.3 accesible",
    "El curso se exporta a EPUB 3.3 con navegación, orden de lectura y metadatos de accesibilidad.",
    "EPUB 3.3 · EPUB Accessibility 1.1",
    [test("tests/packages-contract.test.ts"), script("packages")],
    "VERIFIED"
  ),
  req(
    "INT-02",
    "interoperabilidad",
    "MUST",
    "SCORM 2004 4ª edición",
    "Paquete SCORM con manifiesto y seguimiento conforme a la especificación de ADL.",
    "ADL SCORM 2004 4th Edition",
    [test("tests/packages-contract.test.ts")],
    "VERIFIED"
  ),
  req(
    "INT-03",
    "interoperabilidad",
    "MUST",
    "IMS Common Cartridge 1.3",
    "Paquete con manifiesto, organización de recursos y metadatos.",
    "1EdTech IMS Common Cartridge 1.3",
    [test("tests/packages-contract.test.ts")],
    "VERIFIED"
  ),
  req(
    "INT-04",
    "interoperabilidad",
    "MUST",
    "QTI 1.2 (ASI) y QTI 2.1",
    "La evaluación se exporta en las dos generaciones de QTI: 1.2 para lo que aún vive en producción y 2.1 para lo que viene.",
    "1EdTech IMS QTI 1.2 y 2.1",
    [test("tests/packages-contract.test.ts")],
    "VERIFIED"
  ),
  req(
    "INT-05",
    "interoperabilidad",
    "MUST",
    "Credenciales abiertas firmadas",
    "Open Badges 2.0 y 3.0 (como credencial verificable VC-JWT) firmadas con RS256 y verificables sin servidor.",
    "1EdTech Open Badges 2.0 y 3.0 · W3C Verifiable Credentials",
    [test("packages/shared/tests/badges.test.ts")],
    "VERIFIED"
  ),
  req(
    "INT-06",
    "interoperabilidad",
    "MUST",
    "xAPI 1.0.3",
    "Enunciados y actividades con vocabulario propio y validación del esquema.",
    "ADL xAPI 1.0.3 · IEEE 9274.1.1-2023",
    [test("packages/shared/tests/xapi.test.ts")],
    "VERIFIED"
  ),
  req(
    "INT-07",
    "interoperabilidad",
    "MUST",
    "Datos estructurados de los cursos",
    "Cada curso publica `Course`/`CourseInstance` en JSON-LD, válido y coherente con la página.",
    "schema.org · Google Search Central (datos estructurados)",
    [test("packages/shared/tests/seo.test.ts")],
    "VERIFIED"
  ),
  req(
    "INT-08",
    "interoperabilidad",
    "MUST",
    "Calendario en iCalendar",
    "El calendario por país se exporta en un .ics plegado a 75 octetos y con zona correcta.",
    "RFC 5545 (iCalendar), §3.1 (plegado de líneas)",
    [test("packages/shared/tests/calendar.test.ts")],
    "VERIFIED"
  ),
  req(
    "INT-09",
    "interoperabilidad",
    "SHOULD",
    "LTI 1.3 para incrustar el campus",
    "Permitir que una institución incruste lecciones con LTI 1.3 y devuelva notas por Assignment and Grade Services.",
    "1EdTech LTI 1.3 + AGS",
    [file("docs/ESTANDARES.md")],
    "PLANNED",
    "Declarado como planificado en `ESTANDARES.md` y en `/estandares`. No hay implementación: el campus es estático y sin cuentas, y LTI exige registro de plataformas."
  ),
  req(
    "INT-10",
    "interoperabilidad",
    "SHOULD",
    "Revocación de credenciales consultable",
    "Quien verifica una insignia debería poder comprobar si sigue vigente.",
    "1EdTech OB (lista de revocación)",
    [file("docs/ESTANDARES.md")],
    "PLANNED",
    "Sin registro central por diseño de anonimato; la insignia se firma y se verifica en el navegador. Es una tensión real entre anonimato y revocación y está documentada como tal, no resuelta a la ligera."
  ),

  /* ----------------------------------------------------------------- calidad */
  req(
    "CAL-01",
    "calidad",
    "MUST",
    "Suites automatizadas con suelo",
    "Las dos suites (TypeScript y Python) se ejecutan en cada push y ninguna baja del suelo declarado.",
    `Propia · ISO/IEC 25010 (fiabilidad). Suelo: ${TARGETS.testsFloor} pruebas`,
    [script("test"), script("site"), test("tests/requirements.test.ts")],
    "VERIFIED"
  ),
  req(
    "CAL-02",
    "calidad",
    "MUST",
    "Cobertura ≥ 80 % en lo crítico",
    "Cobertura medida con umbral por debajo del cual la integración continua falla.",
    "Propia (umbral) · ISO/IEC 25010",
    [workflow(".github/workflows/quality.yml", "Cobertura de los módulos críticos"), script("test:coverage")],
    "CI"
  ),
  req(
    "CAL-03",
    "calidad",
    "MUST",
    "Contenido generado sin deriva",
    "Los artefactos generados llevan huella y un test falla si el contenido y el generador se separan.",
    "NIST SSDF PW.6 (reproducibilidad)",
    [script("check:drift"), test("tests/contracts.test.ts")],
    "VERIFIED"
  ),
  req(
    "CAL-04",
    "calidad",
    "MUST",
    "Documentos generados que no mienten",
    "El plan quinquenal y esta tabla de requisitos se generan desde el código y un test detecta cualquier deriva.",
    "Propia",
    [test("tests/plan-quinquenal.test.ts"), test("tests/requirements.test.ts")],
    "VERIFIED"
  ),
  req(
    "CAL-05",
    "calidad",
    "SHOULD",
    "Decisiones con alternativas escritas",
    "Toda decisión de arquitectura con más de una opción razonable deja su ADR, con la descartada y su motivo.",
    "Documentación de arquitectura · ISO/IEC 42010 (referencia)",
    [test("tests/contracts.test.ts"), file("docs/DECISIONS.md")],
    "VERIFIED"
  ),
  req(
    "CAL-06",
    "calidad",
    "MUST",
    "Licencia clara y atribución",
    "Código nuevo MIT; el motor educativo conserva AGPL-3.0-only con su contradicción documentada; los recursos de terceros se atribuyen.",
    "SPDX · convenio de Berna · AGPL-3.0-only",
    [test("tests/contracts.test.ts"), file("NOTICE-ATRIBUCIONES.md")],
    "VERIFIED"
  ),
  req(
    "CAL-08",
    "calidad",
    "MUST",
    "Sin restos de herramientas en el árbol",
    "El repositorio no versiona copias de seguridad ni parches a medias (`.orig`, `.rej`, `.bak`, `*~`): un resto así se cuela en la cobertura, ensucia el diff y nadie sabe si falta algo.",
    "Higiene de repositorio · propia",
    [test("tests/requirements.test.ts")],
    "VERIFIED",
    "Un fichero `index.ts.orig` de cero bytes llevaba versionado desde un ciclo anterior; se detectó al revisar la cobertura (aparecía con 0 %) y se elimina en este ciclo, con prueba que impide que vuelva."
  ),
  req(
    "CAL-07",
    "calidad",
    "SHOULD",
    "Versionado y changelog al día",
    "SemVer con changelog Keep a Changelog en el que la última versión coincide con la del manifiesto.",
    "SemVer 2.0.0 · Keep a Changelog 1.1.0",
    [test("tests/requirements.test.ts"), file("CHANGELOG.md")],
    "VERIFIED"
  ),

  /* --------------------------------------------------------------- operación */
  req(
    "OPS-01",
    "operacion",
    "MUST",
    "Publicación automática y reproducible",
    "La rama principal se publica en GitHub Pages desde el flujo de trabajo, sin pasos manuales ocultos.",
    "GitHub Pages · NIST SSDF PW.6",
    [workflow(".github/workflows/pages.yml", "github-pages"), file("docs/DEPLOYMENT.md")],
    "CI"
  ),
  req(
    "OPS-02",
    "operacion",
    "MUST",
    "Verificación del export antes de publicar",
    "Un servidor propio reproduce el entorno publicado y las auditorías se ejecutan contra él.",
    "Propia (verificación) · RFC 9110 (semántica HTTP)",
    [file("tools/serve-static.mjs"), test("tests/requirements.test.ts")],
    "VERIFIED"
  ),
  req(
    "OPS-03",
    "operacion",
    "MUST",
    "Funciona sin conexión",
    "Un service worker cachea el campus y permite seguir estudiando sin red, con versión de caché explícita.",
    "W3C Service Workers · PWA",
    [file("apps/web/public/sw.js"), test("tests/requirements.test.ts")],
    "VERIFIED"
  ),
  req(
    "OPS-04",
    "operacion",
    "MUST",
    "Despliegue alternativo documentado",
    "Existe `docker-compose.yml` y `Dockerfile` para reconstruir el sitio en cualquier máquina, sin depender de Pages.",
    "OCI (contenedores) · propia",
    [test("tests/requirements.test.ts"), file("docker-compose.yml")],
    "VERIFIED"
  ),
  req(
    "OPS-05",
    "operacion",
    "SHOULD",
    "Observabilidad sin datos personales",
    "El diagnóstico se hace con auditorías locales y con los artefactos de la CI; no hay telemetría del estudiante.",
    "NIST SSDF (RV) · RGPD art. 5(1)(c)",
    [script("audit:site"), file("tools/audit-site.mjs")],
    "VERIFIED"
  ),
  req(
    "OPS-06",
    "operacion",
    "MAY",
    "Monitorización de disponibilidad externa",
    "Comprobación periódica de que el sitio publicado responde.",
    "Práctica SRE (disponibilidad)",
    [file("docs/DEPLOYMENT.md")],
    "PLANNED",
    "No hay monitor externo: el compromiso se limita a que la publicación sea automática y reproducible. Añadirlo es barato; hoy no está y no se dice que esté."
  ),
  req(
    "OPS-07",
    "operacion",
    "MUST",
    "Secretos no residentes en el repositorio",
    "Ninguna clave del proyecto vive en el árbol; el escaneo del historial y la barrera del ensamblado lo comprueban antes de publicar.",
    "NIST SSDF PS.1 · CWE-798",
    [script("site"), workflow(".github/workflows/ci.yml", "secretos")],
    "VERIFIED"
  )
];

/* ------------------------------------------------------------------ consultas */

export function byDomain(domain: DomainId): Requirement[] {
  return REQUIREMENTS.filter((r) => r.domain === domain);
}

export interface RequirementStats {
  total: number;
  byStatus: Record<RequirementStatus, number>;
  byLevel: Record<Level, number>;
  byDomain: Record<DomainId, number>;
  /** Los que no están ni verificados ni en verde por CI: la lista incómoda. */
  gaps: Requirement[];
  /** Porcentaje de requisitos en verde (VERIFIED + CI). */
  greenShare: number;
}

export function requirementStats(): RequirementStats {
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<RequirementStatus, number>;
  const byLevel = Object.fromEntries(LEVELS.map((l) => [l, 0])) as Record<Level, number>;
  const byDomain = Object.fromEntries(Object.keys(DOMAINS).map((d) => [d, 0])) as Record<DomainId, number>;

  for (const requirement of REQUIREMENTS) {
    byStatus[requirement.status] += 1;
    byLevel[requirement.level] += 1;
    byDomain[requirement.domain] += 1;
  }

  const green = byStatus.VERIFIED + byStatus.CI;
  return {
    total: REQUIREMENTS.length,
    byStatus,
    byLevel,
    byDomain,
    gaps: REQUIREMENTS.filter((r) => r.status !== "VERIFIED" && r.status !== "CI"),
    greenShare: Math.round((green / REQUIREMENTS.length) * 1000) / 10
  };
}

/** Requisitos obligatorios (MUST) que no están en verde: lo que de verdad bloquea. */
export function mustGaps(): Requirement[] {
  return REQUIREMENTS.filter((r) => r.level === "MUST" && r.status !== "VERIFIED" && r.status !== "CI");
}
