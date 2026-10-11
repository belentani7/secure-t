#!/usr/bin/env node
/**
 * Fabrica los **paquetes interoperables** del campus desde la fuente única.
 *
 * Un campus que solo vive en su propia web no sirve a un profesor que ya tiene
 * Moodle, ni a un estudiante que lee en un e-reader, ni a una empresa que exige
 * un expediente en un formato conocido. Esto genera, para cada programa:
 *
 *   · `<curso>.epub`            — EPUB 3.3 (W3C/IDPF): libro completo, con las
 *                                20 semanas, navegación y metadatos de
 *                                accesibilidad de EPUB Accessibility 1.1.
 *   · `<curso>-scorm2004.zip`   — SCORM 2004 4th Edition (ADL): importable en
 *                                Moodle, Canvas, Blackboard o Docebo; cada
 *                                semana es un SCO que informa al LMS.
 *   · `<curso>.imscc`           — Common Cartridge 1.3 (1EdTech/IMS): cartucho
 *                                con webcontent y la evaluación en QTI 1.2.
 *   · `<curso>-qti12.xml`       — QTI 1.2 (IMS) suelto, por si se quiere
 *                                importar solo el cuestionario.
 *   · `<curso>-xapi.json`       — plantillas de declaraciones xAPI 1.0.3 (ADL,
 *                                IEEE 9274.1.1) para conectar con cualquier LRS.
 *
 * Nada se escribe a mano: todo sale del Markdown real de `campus/`. Los
 * paquetes son **deterministas** (misma entrada → mismos bytes) para poder
 * publicar su huella SHA-256 y comprobarlos con `pnpm test`.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { badgeSvg, firstHeading, renderMarkdown, splitSections } from "@secure-t/shared";
import { createZip } from "./lib/zip";
import { toXhtml, xhtmlDocument, xmlAttribute, xmlEscape } from "./lib/xml";

export interface PackageFile {
  path: string;
  bytes: number;
  sha256: string;
}

export interface PackageCourse {
  slug: string;
  title: string;
  language: string;
  weeks: {
    index: number;
    title: string;
    html: string;
    sections: string[];
  }[];
  quiz: { pregunta: string; opciones: string[]; correcta: number; explicacion: string }[];
  summary: string;
}

export interface BuildOptions {
  repoRoot?: string;
  outDir?: string;
  now?: Date;
  baseUrl?: string;
}

const GENERATED_MARKER = "Generado desde campus/ · secure T";

function findRepoRoot(start: string): string {
  let current = resolve(start);
  for (let depth = 0; depth < 6; depth += 1) {
    if (existsSync(join(current, "campus", "cursos"))) return current;
    const parent = resolve(current, "..");
    if (parent === current) break;
    current = parent;
  }
  throw new Error("No se encontró campus/cursos");
}

function readCourses(root: string): PackageCourse[] {
  const base = join(root, "campus", "cursos");
  const slugs = readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  return slugs.map((slug) => {
    const dir = join(base, slug);
    const leer = (name: string) => (existsSync(join(dir, name)) ? readFileSync(join(dir, name), "utf8") : "");

    const weeks = readdirSync(dir)
      .filter((name) => /^semana-\d+\.md$/.test(name))
      .map((name) => {
        const index = Number.parseInt(name.replace(/\D+/g, ""), 10);
        const markdown = readFileSync(join(dir, name), "utf8");
        const title = (firstHeading(markdown) ?? `Semana ${index}`).replace(/^Semana\s+\d+\s*[:·-]\s*/i, "").trim();
        return {
          index,
          title,
          html: toXhtml(renderMarkdown(markdown, { headingIds: true, headingOffset: 1 })),
          sections: splitSections(markdown, 2).map((section) => section.title)
        };
      })
      .sort((a, b) => a.index - b.index);

    const syllabus = leer("syllabus.md");
    const summary = syllabus
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 60 && !line.startsWith("#")) ?? weeks[0]?.title ?? slug;

    return {
      slug,
      title: (firstHeading(syllabus) ?? slug).replace(/^#\s*/, "").trim(),
      language: "es",
      weeks,
      quiz: JSON.parse(leer("quiz.json") || "[]"),
      summary: summary.slice(0, 300)
    };
  });
}

/* ------------------------------------------------------------------ EPUB 3.3 */

const EPUB_CSS = `@charset "utf-8";
body { font-family: serif; line-height: 1.5; margin: 1.2em; }
h1, h2, h3 { font-family: sans-serif; line-height: 1.2; }
h1 { font-size: 1.6em; border-bottom: 2px solid #8a6d1f; padding-bottom: .2em; }
h2 { font-size: 1.25em; margin-top: 1.6em; }
h3 { font-size: 1.05em; }
code, pre { font-family: monospace; font-size: .92em; }
pre { border-left: 3px solid #8a6d1f; padding-left: .6em; overflow-wrap: break-word; white-space: pre-wrap; }
blockquote { border-left: 3px solid #8a6d1f; margin-left: 0; padding-left: .8em; font-style: italic; }
table { border-collapse: collapse; width: 100%; font-size: .9em; }
th, td { border: 1px solid #999; padding: .25em .4em; text-align: left; }
.img { text-align: center; }
`;

/** Metadatos de accesibilidad obligatorios en EPUB Accessibility 1.1. */
function accessibilityMeta(): string {
  const features = ["structuralNavigation", "tableOfContents", "readingOrder", "alternativeText", "longDescription"];
  return [
    '<meta property="schema:accessMode">textual</meta>',
    '<meta property="schema:accessMode">visual</meta>',
    '<meta property="schema:accessModeSufficient">textual</meta>',
    ...features.map((feature) => `<meta property="schema:accessibilityFeature">${feature}</meta>`),
    '<meta property="schema:accessibilityHazard">none</meta>',
    '<meta property="schema:accessibilitySummary">Texto completo en español, navegación por capítulos y contraste suficiente; sin audio ni vídeo, por lo que no hay riesgo de parpadeo.</meta>',
    '<link rel="dcterms:conformsTo" href="https://www.w3.org/TR/epub-a11y-11/" />'
  ].join("\n    ");
}

export function buildEpub(course: PackageCourse, meta: { generatedAt: string; identifier: string; modified: string }): Buffer {
  const entry = (name: string, data: string, store = false) => ({ name, data, ...(store ? { store: true } : {}) });

  const container = `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`;

  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="${course.language}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:schema="http://schema.org/">
    <dc:identifier id="pub-id">${xmlEscape(meta.identifier)}</dc:identifier>
    <dc:title>${xmlEscape(course.title)}</dc:title>
    <dc:language>${course.language}</dc:language>
    <dc:creator>secure T · belentani7/secure-t</dc:creator>
    <dc:publisher>secure T</dc:publisher>
    <dc:description>${xmlEscape(course.summary)}</dc:description>
    <dc:rights>Material didáctico del repositorio original; código bajo licencia MIT.</dc:rights>
    <dc:subject>Ciberseguridad</dc:subject>
    <dc:subject>Inteligencia artificial</dc:subject>
    <meta property="dcterms:modified">${meta.modified}</meta>
    <meta name="generator" content="${GENERATED_MARKER}" />
    ${accessibilityMeta()}
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
    <item id="css" href="estilo.css" media-type="text/css" />
    <item id="indice" href="indice.xhtml" media-type="application/xhtml+xml" />
${course.weeks.map((week) => `    <item id="semana-${week.index}" href="semana-${pad(week.index)}.xhtml" media-type="application/xhtml+xml" />`).join("\n")}
  </manifest>
  <spine>
    <itemref idref="indice" />
${course.weeks.map((week) => `    <itemref idref="semana-${week.index}" />`).join("\n")}
  </spine>
</package>
`;

  const nav = xhtmlDocument({
    lang: course.language,
    title: `Índice · ${course.title}`,
    stylesheet: "estilo.css",
    epubType: { type: "toc", value: "toc" },
    body: `  <nav epub:type="toc" id="toc">
    <h1>${xmlEscape(course.title)}</h1>
    <ol>
      <li><a href="indice.xhtml">Presentación</a></li>
${course.weeks.map((week) => `      <li><a href="semana-${pad(week.index)}.xhtml">Semana ${week.index}: ${xmlEscape(week.title)}</a></li>`).join("\n")}
    </ol>
  </nav>`
  });
  // `epub:type` en el documento de navegación va en <body> o en <nav>, no en <html>.
  const navLimpio = nav.replace(/\s*epub:type="toc"/, "").replace('<nav id="toc">', '<nav id="toc" epub:type="toc">');

  const indice = xhtmlDocument({
    lang: course.language,
    title: "Presentación",
    stylesheet: "estilo.css",
    body: `  <section epub:type="preface">
    <h1>${xmlEscape(course.title)}</h1>
    <p>${xmlEscape(course.summary)}</p>
    <p><strong>${course.weeks.length} semanas.</strong> Este libro contiene el programa completo del campus secure T, generado desde el material real del repositorio. Se puede leer sin conexión y sin cuenta.</p>
    <p>Todas las semanas incluyen objetivos, contenido, caso real y práctica guiada. La evaluación y la rúbrica están descritas en el campus: 30 % P1, 30 % P2 y 40 % P3, con proyecto y defensa final.</p>
  </section>`
  }).replace("<body", '<body epub:type="preface"').replace(' epub:type="preface" epub:type="preface"', ' epub:type="preface"');

  const weeks = course.weeks.map((week) => ({
    name: `OEBPS/semana-${pad(week.index)}.xhtml`,
    data: xhtmlDocument({
      lang: course.language,
      title: `Semana ${week.index}: ${week.title}`,
      stylesheet: "estilo.css",
      body: `  <section>
    <p class="kicker">Semana ${week.index} de ${course.weeks.length}</p>
${week.html}
  </section>`
    })
  }));

  return createZip([
    entry("mimetype", "application/epub+zip", true),
    entry("META-INF/container.xml", container),
    entry("OEBPS/package.opf", opf),
    entry("OEBPS/estilo.css", EPUB_CSS),
    entry("OEBPS/nav.xhtml", navLimpio),
    entry("OEBPS/indice.xhtml", indice),
    ...weeks
  ]);
}

/* --------------------------------------------------------- SCORM 2004 4th Ed. */

/**
 * Envoltorio SCORM 2004: busca la API en el marco padre, informa del estado de
 * finalización y del tiempo de sesión, y no rompe si no hay LMS (se abre en
 * local y sigue funcionando). Nombres del modelo de datos según SCORM 2004 4th
 * Edition: `cmi.completion_status`, `cmi.location`, `cmi.session_time`,
 * `cmi.success_status` y `cmi.suspend_data`.
 */
/**
 * Envoltorio SCORM 2004 en **XHTML**.
 *
 * SCORM 2004 4th Edition exige contenido basado en XHTML para las SCO: un
 * visor estricto rechaza HTML5 permisivo. Además de la forma, el envoltorio
 * hace lo que exige el estándar en tiempo de ejecución: busca la API
 * (`API_1484_11`) en la jerarquía de marcos, inicializa la sesión, informa de
 * `cmi.completion_status`, `cmi.success_status`, `cmi.location` y
 * `cmi.session_time`, hace `LMSCommit` y termina con `LMSTerminate`. Si no hay
 * LMS —se abre el fichero desde el disco— el campus sigue funcionando y lo dice.
 */
export function scormWrapper(identifier: string, title: string): string {
  const cuerpo = `<div class="barra">
  <strong>${xmlEscape(title)}</strong>
  <button type="button" id="completar">Marcar como completada</button>
  <span class="estado" id="estado">LMS: buscando…</span>
</div>
<div class="contenido" id="contenido"></div>
<script type="text/javascript">
//<![CDATA[
(function () {
  var SCO = { identifier: "${identifier}", start: Date.now(), api: null, initialised: false };

  function findAPI(win) {
    var intentos = 0;
    while (win && !win.API_1484_11 && win.parent && win.parent !== win && intentos < 12) {
      intentos += 1;
      win = win.parent;
    }
    return win.API_1484_11 || null;
  }

  function fmtDuration(ms) {
    var total = Math.max(0, Math.round(ms / 1000));
    var h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
    return "PT" + h + "H" + m + "M" + s + "S";
  }

  function estado(texto) {
    var nodo = document.getElementById("estado");
    if (nodo) { nodo.textContent = texto; }
  }

  try {
    SCO.api = findAPI(window);
    if (SCO.api) {
      SCO.initialised = SCO.api.LMSInitialize("") === "true";
      SCO.api.LMSSetValue("cmi.location", "inicio");
      SCO.api.LMSCommit("");
      estado("LMS conectado");
    } else {
      estado("Sin LMS: modo local");
    }
  } catch (error) {
    estado("Sin LMS: modo local");
  }

  var boton = document.getElementById("completar");
  if (boton) {
    boton.addEventListener("click", function () {
      if (!SCO.api || !SCO.initialised) {
        estado("Guardado solo en este dispositivo");
        return;
      }
      try {
        SCO.api.LMSSetValue("cmi.completion_status", "completed");
        SCO.api.LMSSetValue("cmi.success_status", "passed");
        SCO.api.LMSSetValue("cmi.location", "semana-completada");
        SCO.api.LMSSetValue("cmi.session_time", fmtDuration(Date.now() - SCO.start));
        SCO.api.LMSCommit("");
        estado("Guardado en el LMS");
      } catch (error) {
        estado("El LMS rechazó el guardado");
      }
    });
  }

  window.addEventListener("beforeunload", function () {
    if (SCO.api && SCO.initialised) {
      try {
        SCO.api.LMSSetValue("cmi.session_time", fmtDuration(Date.now() - SCO.start));
        SCO.api.LMSCommit("");
        SCO.api.LMSTerminate("");
      } catch (error) {
        /* el LMS ya cerró la sesión */
      }
    }
  });
})();
//]]>
</script>`;

  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">
<head>
<meta charset="utf-8" />
<title>${xmlEscape(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" type="text/css" href="estilo.css" />
</head>
<body>
<main>
${cuerpo}
</main>
</body>
</html>
`;
}

/** Inserta el cuerpo real de la semana en la SCO (XHTML, sin scripts). */
function conContenido(pagina: string, html: string): string {
  return pagina.replace('<div class="contenido" id="contenido"></div>', `<div class="contenido" id="contenido">${html}</div>`);
}

export function scormManifest(course: PackageCourse, meta: { generatedAt: string }): string {
  const resourceId = (index: number) => `res-semana-${pad(index)}`;
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest identifier="secure-t-${course.slug}" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
    http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
    http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
    http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
    http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
    <adlcp:location>metadata.xml</adlcp:location>
  </metadata>
  <organizations default="org-${course.slug}">
    <organization identifier="org-${course.slug}" structure="hierarchical">
      <title>${xmlEscape(course.title)}</title>
      <item identifier="item-presentacion" identifierref="res-presentacion">
        <title>Presentación del programa</title>
        <adlcp:completionThreshold completedByMeasure="false" />
      </item>
${course.weeks
  .map(
    (week) => `      <item identifier="item-semana-${pad(week.index)}" identifierref="${resourceId(week.index)}">
        <title>Semana ${week.index}: ${xmlEscape(week.title)}</title>
        <adlcp:completionThreshold completedByMeasure="false" />
        <imsss:sequencing>
          <imsss:sequencingRules>
            <imsss:preConditionRule>
              <imsss:ruleConditions conditionCombination="any">
                <imsss:ruleCondition referencedObjective="primary" operator="not" condition="completed" measureThreshold="0.7" />
              </imsss:ruleConditions>
              <imsss:ruleAction action="skip" />
            </imsss:preConditionRule>
          </imsss:sequencingRules>
        </imsss:sequencing>
      </item>`
  )
  .join("\n")}
    </organization>
  </organizations>
  <resources>
    <resource identifier="res-presentacion" type="webcontent" adlcp:scormType="sco" href="sco/presentacion.html">
      <file href="sco/presentacion.html" />
      <file href="sco/estilo.css" />
    </resource>
${course.weeks
  .map(
    (week) => `    <resource identifier="${resourceId(week.index)}" type="webcontent" adlcp:scormType="sco" href="sco/semana-${pad(week.index)}.html">
      <file href="sco/semana-${pad(week.index)}.html" />
      <file href="sco/estilo.css" />
    </resource>`
  )
  .join("\n")}
  </resources>
</manifest>
`;
}

export function buildScorm(course: PackageCourse, meta: { generatedAt: string }): Buffer {
  const metadata = `<?xml version="1.0" encoding="utf-8"?>
<lom xmlns="http://ltsc.ieee.org/xsd/LOM" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ltsc.ieee.org/xsd/LOM lom.xsd">
  <general>
    <identifier><catalog>secure-t</catalog><entry>${course.slug}</entry></identifier>
    <title><string language="es">${xmlEscape(course.title)}</string></title>
    <description><string language="es">${xmlEscape(course.summary)}</string></description>
    <keyword><string language="es">ciberseguridad</string></keyword>
    <keyword><string language="es">inteligencia artificial</string></keyword>
  </general>
  <lifeCycle>
    <version><string language="es">1.0.0</string></version>
    <status><source>LOMv1.0</source><value>final</value></status>
  </lifeCycle>
  <metaMetadata>
    <identifier><catalog>secure-t</catalog><entry>${course.slug}</entry></identifier>
    <contribute>
      <role><source>LOMv1.0</source><value>creator</value></role>
      <date><dateTime>${meta.generatedAt}</dateTime></date>
    </contribute>
  </metaMetadata>
  <rights>
    <description><string language="es">Material del repositorio original; código bajo licencia MIT.</string></description>
  </rights>
  <educational>
    <interactivityType><source>LOMv1.0</source><value>mixed</value></interactivityType>
    <learningResourceType><source>LOMv1.0</source><value>course</value></learningResourceType>
    <interactivityLevel><source>LOMv1.0</source><value>high</value></interactivityLevel>
    <typicalAgeRange><string language="es">17-</string></typicalAgeRange>
    <language>es</language>
  </educational>
</lom>
`;

  const presentacion = conContenido(
    scormWrapper("res-presentacion", course.title),
    `<h1>${xmlEscape(course.title)}</h1>
<p>${xmlEscape(course.summary)}</p>
<p><strong>${course.weeks.length} semanas.</strong> Cada semana es una SCO independiente: el LMS guarda el avance y el tiempo de estudio.</p>
<h2>Plan</h2>
<ol>
${course.weeks.map((week) => `<li>Semana ${week.index}: ${xmlEscape(week.title)}</li>`).join("\n")}
</ol>`
  );

  const scos = course.weeks.map((week) => ({
    name: `sco/semana-${pad(week.index)}.html`,
    data: conContenido(
      scormWrapper(`res-semana-${pad(week.index)}`, `Semana ${week.index}: ${week.title}`),
      `<h1>Semana ${week.index}: ${xmlEscape(week.title)}</h1>\n${week.html}`
    )
  }));

  return createZip([
    { name: "imsmanifest.xml", data: scormManifest(course, meta) },
    { name: "metadata.xml", data: metadata },
    { name: "sco/estilo.css", data: EPUB_CSS },
    { name: "sco/presentacion.html", data: presentacion },
    ...scos
  ]);
}

/* --------------------------------------------- Common Cartridge 1.3 + QTI 1.2 */

export function qti12(course: PackageCourse, meta: { assessmentId: string }): string {
  const items = course.quiz
    .map((pregunta, indice) => {
      const itemId = `${course.slug}-pregunta-${indice + 1}`;
      return `    <item ident="${xmlAttribute(itemId)}" title="${xmlAttribute(pregunta.pregunta.slice(0, 120))}">
      <itemmetadata>
        <qtimetadata>
          <qtimetadatafield><fieldlabel>qmd_itemtype</fieldlabel><fieldentry>Multiple Choice</fieldentry></qtimetadatafield>
          <qtimetadatafield><fieldlabel>qmd_status</fieldlabel><fieldentry>Final</fieldentry></qtimetadatafield>
        </qtimetadata>
      </itemmetadata>
      <presentation>
        <material><mattext texttype="text/plain">${xmlEscape(pregunta.pregunta)}</mattext></material>
        <response_lid ident="respuesta" rcardinality="Single">
          <render_choice>
${pregunta.opciones
  .map(
    (opcion, posicion) =>
      `            <response_label ident="opcion-${posicion + 1}"><material><mattext texttype="text/plain">${xmlEscape(
        opcion
      )}</mattext></material></response_label>`
  )
  .join("\n")}
          </render_choice>
        </response_lid>
      </presentation>
      <resprocessing>
        <outcomes><decvar varname="SCORE" vartype="Decimal" defaultval="0" minvalue="0" maxvalue="1" /></outcomes>
        <respcondition continue="No">
          <conditionvar><varequal respident="respuesta">opcion-${pregunta.correcta + 1}</varequal></conditionvar>
          <setvar varname="SCORE" action="Set">1</setvar>
          <displayfeedback feedbacktype="Response" linkrefid="correcta" />
        </respcondition>
        <respcondition continue="No">
          <conditionvar><not><varequal respident="respuesta">opcion-${pregunta.correcta + 1}</varequal></not></conditionvar>
          <displayfeedback feedbacktype="Response" linkrefid="incorrecta" />
        </respcondition>
      </resprocessing>
      <itemfeedback ident="correcta" view="All"><flow_mat><material><mattext texttype="text/plain">Correcto. ${xmlEscape(
        pregunta.explicacion
      )}</mattext></material></flow_mat></itemfeedback>
      <itemfeedback ident="incorrecta" view="All"><flow_mat><material><mattext texttype="text/plain">Revisa la semana. ${xmlEscape(
        pregunta.explicacion
      )}</mattext></material></flow_mat></itemfeedback>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 ims_qtiasiv1p2p1.xsd">
  <assessment ident="${xmlAttribute(meta.assessmentId)}" title="${xmlAttribute(`Evaluación · ${course.title}`)}">
    <qtimetadata>
      <qtimetadatafield><fieldlabel>cc_maxattempts</fieldlabel><fieldentry>unlimited</fieldentry></qtimetadatafield>
      <qtimetadatafield><fieldlabel>qmd_assessmenttype</fieldlabel><fieldentry>Quiz</fieldentry></qtimetadatafield>
    </qtimetadata>
    <objectives><material><mattext texttype="text/plain">Comprobar la comprensión de las ${course.weeks.length} semanas.</mattext></material></objectives>
    <section ident="seccion-1" title="Cuestionario">
${items}
    </section>
  </assessment>
</questestinterop>
`;
}

export function ccManifest(course: PackageCourse, meta: { generatedAt: string }): string {
  const resourceId = (index: number) => `res-semana-${pad(index)}`;
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest identifier="secure-t-cc-${course.slug}" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imsccv1p3/imscp_v1p1"
  xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p3/LOM/manifest"
  xmlns:lomimscc="http://ltsc.ieee.org/xsd/imsccv1p3/LOM"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p3/imscp_v1p1 imscc_v1p3_imscp.xsd
    http://ltsc.ieee.org/xsd/imsccv1p3/LOM/manifest imscc_v1p3_lommanifest.xsd">
  <metadata>
    <schema>IMS Common Cartridge</schema>
    <schemaversion>1.3.0</schemaversion>
    <lomimscc:lom>
      <lomimscc:general>
        <lomimscc:title><lomimscc:string language="es">${xmlEscape(course.title)}</lomimscc:string></lomimscc:title>
        <lomimscc:description><lomimscc:string language="es">${xmlEscape(
          course.summary
        )}</lomimscc:string></lomimscc:description>
        <lomimscc:keyword><lomimscc:string language="es">ciberseguridad</lomimscc:string></lomimscc:keyword>
      </lomimscc:general>
      <lomimscc:lifeCycle>
        <lomimscc:version><lomimscc:string language="es">1.0.0</lomimscc:string></lomimscc:version>
      </lomimscc:lifeCycle>
      <lomimscc:rights>
        <lomimscc:description><lomimscc:string language="es">Material del repositorio original; código MIT.</lomimscc:string></lomimscc:description>
      </lomimscc:rights>
    </lomimscc:lom>
  </metadata>
  <organizations default="org-${course.slug}">
    <organization identifier="org-${course.slug}" structure="rooted-hierarchy">
      <item identifier="root">
        <item identifier="item-presentacion" identifierref="res-presentacion"><title>Presentación</title></item>
${course.weeks
  .map(
    (week) =>
      `        <item identifier="item-semana-${pad(week.index)}" identifierref="${resourceId(week.index)}"><title>Semana ${
        week.index
      }: ${xmlEscape(week.title)}</title></item>`
  )
  .join("\n")}
        <item identifier="item-evaluacion" identifierref="res-evaluacion"><title>Evaluación</title></item>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res-presentacion" type="webcontent" href="presentacion.html">
      <file href="presentacion.html" />
      <file href="estilo.css" />
      <file href="imsmanifest.xml" />
    </resource>
${course.weeks
  .map(
    (week) => `    <resource identifier="${resourceId(week.index)}" type="webcontent" href="semana-${pad(week.index)}.html">
      <file href="semana-${pad(week.index)}.html" />
      <file href="estilo.css" />
    </resource>`
  )
  .join("\n")}
    <resource identifier="res-evaluacion" type="imsqti_xmlv1p2" href="${course.slug}-qti12.xml">
      <file href="${course.slug}-qti12.xml" />
      <dependency identifierref="res-presentacion" />
    </resource>
  </resources>
</manifest>
`;
}

export function buildCommonCartridge(course: PackageCourse, meta: { generatedAt: string }): Buffer {
  // Common Cartridge admite HTML, pero se entrega XHTML: el mismo fichero vale
  // para un visor estricto y evita sorpresas al reimportar.
  const page = (title: string, body: string) => `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">
<head>
<meta charset="utf-8" />
<title>${xmlEscape(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" type="text/css" href="estilo.css" />
</head>
<body>
<main>
${body}
</main>
</body>
</html>
`;

  if (course.quiz.length === 0) throw new Error(`${course.slug}: el cartucho necesita quiz.json`);

  return createZip([
    { name: "imsmanifest.xml", data: ccManifest(course, meta) },
    { name: "estilo.css", data: EPUB_CSS },
    {
      name: "presentacion.html",
      data: page(
        course.title,
        `<h1>${xmlEscape(course.title)}</h1><p>${xmlEscape(course.summary)}</p><p><strong>${course.weeks.length} semanas</strong> de material abierto.</p>`
      )
    },
    ...course.weeks.map((week) => ({
      name: `semana-${pad(week.index)}.html`,
      data: page(`Semana ${week.index}`, `<h1>Semana ${week.index}: ${xmlEscape(week.title)}</h1>\n${week.html}`)
    })),
    { name: `${course.slug}-qti12.xml`, data: qti12(course, { assessmentId: `${course.slug}-quiz` }) }
  ]);
}

/* ---------------------------------------------------------------- xAPI 1.0.3 */

/**
 * Plantillas de declaraciones xAPI (ADL, IEEE 9274.1.1-2023).
 *
 * No se envía nada a ningún LRS: se entregan **plantillas conformes** para que
 * un centro pueda conectar su propio LRS. El actor es anónimo (una cuenta
 * `secure-t:<token>`), no hay correo ni nombre, y el verbo es un IRI del
 * vocabulario de ADL.
 */
export function xapiTemplates(course: PackageCourse, meta: { baseUrl: string; toca: string }): string {
  const base = meta.baseUrl.replace(/\/$/, "");
  const iri = (slug: string) => `${base}/programas/${slug}`;
  const actor = { objectType: "Agent", account: { homePage: `${base}/`, name: "secure-t:ANONIMO" }, name: "Estudiante anónimo" };
  const declaracion = (verbo: string, nombreVerbo: string, extra: Record<string, unknown> = {}) => ({
    id: deterministicUuid(`${course.slug}:${nombreVerbo}`),
    actor,
    verb: { id: `http://adlnet.gov/expapi/verbs/${verbo}`, display: { "es-ES": nombreVerbo } },
    object: {
      id: iri(course.slug),
      objectType: "Activity",
      definition: {
        type: "http://adlnet.gov/expapi/activities/course",
        name: { "es-ES": course.title },
        description: { "es-ES": course.summary },
        moreInfo: iri(course.slug)
      }
    },
    context: {
      registration: deterministicUuid(`${course.slug}:registration`),
      contextActivities: {
        category: [{ id: "https://w3id.org/xapi/cmi5/context/categories/cmi5" }],
        grouping: [{ id: base, objectType: "Activity" }]
      },
      language: "es-ES"
    },
    timestamp: meta.toca,
    version: "1.0.3",
    ...extra
  });

  return `${JSON.stringify(
    {
      "@context": "https://w3id.org/xapi/recipes/context/cmi5.jsonld",
      name: `Plantillas xAPI · ${course.title}`,
      generated: meta.toca,
      note: "Plantillas para conectar con un LRS propio. El campus no envía datos a ningún servidor.",
      statements: [
        declaracion("initialized", "inició", { object: { id: `${iri(course.slug)}/semana/1`, objectType: "Activity" } }),
        declaracion("progressed", "avanzó", {
          object: { id: `${iri(course.slug)}/semana/1`, objectType: "Activity" },
          result: { progress: 0.05, duration: "PT90M" }
        }),
        declaracion("completed", "completó", {
          object: { id: `${iri(course.slug)}/semana/1`, objectType: "Activity" },
          result: { completion: true, success: true, duration: "PT1H30M" }
        }),
        declaracion("passed", "superó", {
          object: { id: `${iri(course.slug)}/evaluacion`, objectType: "Activity" },
          result: { success: true, score: { scaled: 0.83, raw: 5, min: 0, max: 6 }, duration: "PT15M" }
        }),
        declaracion("earned", "obtuvo", {
          object: {
            id: `${base}/credencial/${course.slug}`,
            objectType: "Activity",
            definition: { type: "http://activitystrea.ms/schema/1.0/badge", name: { "es-ES": "Credencial de aprovechamiento" } }
          }
        })
      ]
    },
    null,
    2
  )}\n`;
}

/* ------------------------------------------------------------------ orquesta */

/**
 * UUID derivado del nombre (RFC 9562 §5.5, versión 5).
 *
 * Los paquetes tienen que ser **deterministas**: si el mismo material diera un
 * fichero distinto en cada compilación, no se podría publicar su huella SHA-256
 * ni detectar cambios reales. Con `randomUUID()` el paquete xAPI cambiaba en
 * cada build; con un UUID derivado, no.
 */
function deterministicUuid(seed: string): string {
  const bytes = createHash("sha256").update(seed).digest().subarray(0, 16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x50; // versión 5
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variante RFC 4122
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function buildPackages(options: BuildOptions = {}): { files: PackageFile[]; outDir: string } {
  const root = options.repoRoot ?? findRepoRoot(process.cwd());
  const outDir = options.outDir ?? join(root, "apps", "web", "public", "packages");
  const ahora = options.now ?? new Date();
  const generatedAt = ahora.toISOString();
  const modified = generatedAt.slice(0, 19) + "Z";
  const baseUrl = options.baseUrl ?? "https://belentani7.github.io/secure-t/app";

  const courses = readCourses(root);
  const files: PackageFile[] = [];
  const assets: PackageFile[] = [];
  mkdirSync(outDir, { recursive: true });

  const escribir = (name: string, data: Buffer | string) => {
    const buffer = typeof data === "string" ? Buffer.from(data, "utf8") : data;
    writeFileSync(join(outDir, name), buffer);
    files.push({ path: name, bytes: buffer.byteLength, sha256: sha256(buffer) });
  };

  for (const course of courses) {
    escribir(`${course.slug}.epub`, buildEpub(course, { generatedAt, identifier: `urn:uuid:secure-t-${course.slug}`, modified }));
    escribir(`${course.slug}-scorm2004.zip`, buildScorm(course, { generatedAt }));
    escribir(`${course.slug}.imscc`, buildCommonCartridge(course, { generatedAt }));
    escribir(`${course.slug}-qti12.xml`, qti12(course, { assessmentId: `${course.slug}-quiz` }));
    escribir(`${course.slug}-xapi.json`, xapiTemplates(course, { baseUrl, toca: generatedAt }));
  }

  // Insignias SVG: son la imagen que referencia cada BadgeClass de Open Badges.
  const badgeDir = join(root, "apps", "web", "public", "badges");
  mkdirSync(badgeDir, { recursive: true });
  for (const course of courses) {
    const svg = badgeSvg({ title: course.title, slug: course.slug });
    writeFileSync(join(badgeDir, `${course.slug}.svg`), svg, "utf8");
    assets.push({
      path: `badges/${course.slug}.svg`,
      bytes: Buffer.byteLength(svg, "utf8"),
      sha256: createHash("sha256").update(svg).digest("hex")
    });
  }

  escribir(
    "index.json",
    JSON.stringify(
      {
        generatedAt,
        standards: {
          epub: "EPUB 3.3 (W3C) + EPUB Accessibility 1.1",
          scorm: "SCORM 2004 4th Edition (ADL)",
          commonCartridge: "IMS Common Cartridge 1.3",
          qti: "IMS QTI 1.2",
          xapi: "xAPI 1.0.3 (ADL, IEEE 9274.1.1-2023)"
        },
        courses: courses.map((course) => ({
          slug: course.slug,
          title: course.title,
          weeks: course.weeks.length,
          quizItems: course.quiz.length
        })),
        files,
        assets
      },
      null,
      2
    )
  );

  return { files, outDir };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { files, outDir } = buildPackages();
  console.log(`\nPaquetes interoperables en ${outDir}`);
  for (const file of files) {
    console.log(`  ${file.path.padEnd(40)} ${(file.bytes / 1024).toFixed(1).padStart(8)} kB  ${file.sha256.slice(0, 12)}`);
  }
  const total = files.reduce((sum, file) => sum + file.bytes, 0);
  console.log(`\n${files.length} ficheros · ${(total / 1024).toFixed(0)} kB`);
}
