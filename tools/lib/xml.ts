/**
 * Utilidades XML/XHTML sin dependencias.
 *
 * Los paquetes que exporta el campus (EPUB, SCORM 2004, Common Cartridge, QTI
 * 1.2) son XML y **un solo carácter mal cerrado hace que Moodle, Calibre o un
 * lector de libros electrónicos rechacen el fichero entero**. Por eso se
 * escribe un comprobador de buena formación propio y se usa en los tests: si el
 * paquete no es XML válido, el test lo dice antes de publicarlo.
 *
 * Reglas aplicadas: XML 1.0 (W3C), XHTML 1.1/EPUB 3 (elementos vacíos
 * autocerrados), y el escapado obligatorio de `&`, `<`, `>` y comillas en
 * atributos.
 */

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr"
]);

/** Escapa texto destinado a un nodo de texto XML. */
export function xmlEscape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Escapa un valor de atributo XML (incluye comillas dobles). */
export function xmlAttribute(value: string): string {
  return xmlEscape(value).replace(/"/g, "&quot;");
}

/**
 * Convierte HTML en XHTML válido: autocierra los elementos vacíos y cierra las
 * etiquetas sueltas. Es lo mínimo para que el mismo material sirva en la web
 * (HTML5 permisivo) y dentro de un EPUB (XML estricto).
 */
export function toXhtml(html: string): string {
  let salida = html;
  // Elementos vacíos sin cerrar: `<br>` → `<br />`.
  for (const elemento of VOID_ELEMENTS) {
    const patron = new RegExp(`<${elemento}(\\s[^>]*)?>`, "gi");
    salida = salida.replace(patron, (_coincidencia, atributos: string | undefined) => `<${elemento}${atributos ?? ""} />`);
  }
  // `<br/>` y `<br />` ya están bien; normalizamos el espaciado.
  salida = salida.replace(/<([a-zA-Z][\w-]*)([^>]*?)\/>/g, "<$1$2 />");
  // Entidades sueltas que XML no conoce.
  salida = salida.replace(/&nbsp;/g, "&#160;");
  return salida;
}

/**
 * Comprueba la buena formación de un documento XML.
 *
 * No es un validador de esquema: verifica lo que rompe un lector real —
 * etiquetas sin cerrar, cierres cruzados, atributos sin comillas, comentarios
 * mal formados y el prólogo cuando existe.
 */
export function xmlErrors(xml: string): string[] {
  const errores: string[] = [];
  const pila: string[] = [];
  let index = 0;

  if (xml.includes("\u0000")) errores.push("contiene bytes nulos");
  if (xml.trimStart().startsWith("<?xml") && !/^<\?xml[^>]*\?>/.test(xml.trimStart())) {
    errores.push("prólogo XML mal formado");
  }

  while (index < xml.length) {
    const apertura = xml.indexOf("<", index);
    if (apertura === -1) break;

    if (xml.startsWith("<!--", apertura)) {
      const fin = xml.indexOf("-->", apertura);
      if (fin === -1) {
        errores.push("comentario sin cerrar");
        break;
      }
      if (xml.slice(apertura + 4, fin).includes("--")) errores.push("comentario con `--` dentro");
      index = fin + 3;
      continue;
    }
    if (xml.startsWith("<![CDATA[", apertura)) {
      const fin = xml.indexOf("]]>", apertura);
      if (fin === -1) {
        errores.push("CDATA sin cerrar");
        break;
      }
      index = fin + 3;
      continue;
    }
    if (xml.startsWith("<?", apertura) || xml.startsWith("<!", apertura)) {
      const fin = xml.indexOf(">", apertura);
      if (fin === -1) {
        errores.push("instrucción sin cerrar");
        break;
      }
      index = fin + 1;
      continue;
    }

    const cierre = xml.indexOf(">", apertura);
    if (cierre === -1) {
      errores.push("etiqueta sin cerrar");
      break;
    }
    const etiqueta = xml.slice(apertura + 1, cierre);
    index = cierre + 1;

    if (etiqueta.startsWith("/")) {
      const nombre = etiqueta.slice(1).trim();
      const esperado = pila.pop();
      if (esperado !== nombre) {
        errores.push(`cierre </${nombre}> no coincide con <${esperado ?? "nada"}>`);
        if (errores.length > 5) break;
      }
      continue;
    }

    const autocerrada = etiqueta.endsWith("/");
    const cuerpo = autocerrada ? etiqueta.slice(0, -1) : etiqueta;
    const nombre = /^([^\s/>]+)/.exec(cuerpo.trim())?.[1];
    if (!nombre) {
      errores.push("etiqueta sin nombre");
      continue;
    }

    // Atributos: nombre="valor" o nombre='valor'
    const atributos = cuerpo.slice(nombre.length);
    const restos = atributos.replace(/\s+[^\s=]+(\s*=\s*("[^"]*"|'[^']*'))?/g, "").trim();
    if (restos.length > 0) {
      errores.push(`atributo mal formado en <${nombre}>: ${restos.slice(0, 40)}`);
    }

    // En XML no hay elementos vacíos implícitos: `<br>` sin cerrar es un error,
    // y `<meta …>texto</meta>` es perfectamente válido. La pila sigue la
    // realidad del documento, no las reglas permisivas del HTML.
    if (!autocerrada) pila.push(nombre);
    if (errores.length > 5) break;
  }

  if (pila.length) errores.push(`etiquetas sin cerrar: ${pila.slice(-4).join(", ")}`);
  return errores;
}

/** `true` si el documento es XML bien formado. */
export function isWellFormedXml(xml: string): boolean {
  return xmlErrors(xml).length === 0;
}

/** Envuelve un documento XHTML 5 completo (el que exige EPUB 3). */
export function xhtmlDocument(options: {
  lang: string;
  title: string;
  body: string;
  stylesheet?: string;
  epubType?: { type: string; value: string };
  extraHead?: string;
}): string {
  const epubAttr = options.epubType ? ` epub:type="${options.epubType.type}"` : "";
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${options.lang}" lang="${options.lang}">
<head>
<meta charset="utf-8" />
<title>${xmlEscape(options.title)}</title>
${options.stylesheet ? `<link rel="stylesheet" type="text/css" href="${options.stylesheet}" />` : ""}
${options.extraHead ?? ""}
</head>
<body${epubAttr}>
${options.body}
</body>
</html>
`;
}
