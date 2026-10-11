/**
 * El portugués del proyecto es **de Brasil**, y es el idioma por defecto.
 *
 * Este contrato existe porque «empezar en portugués» no basta: si el HTML se
 * declara sólo `lang="pt"`, un lector de pantalla puede leerlo con acento de
 * Portugal, y si `hreflang` declara la variante europea del portugués, el
 * buscador ofrece la versión equivocada. Aquí se comprueba la etiqueta BCP-47
 * en la fuente única (`LOCALE_LABELS`) y en el código que la publica.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_LABELS,
  OG_LOCALES,
  SPEECH_LOCALES,
  alternateLanguages,
  isLocale
} from "../packages/shared/src/i18n";

const root = join(__dirname, "..");
const leer = (rel: string) => readFileSync(join(root, rel), "utf8");

const CARPETAS = [
  "e2e",
  "apps/web/src",
  "packages/shared/src",
  "packages/agent/src",
  "packages/ui/src",
  "tools",
  "tests"
];
const EXTENSIONES = /\.(ts|tsx|mjs|js|json|css)$/;
const IGNORAR = /node_modules|\.next|dist|build/;

function ficherosFuente(dir: string, salida: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (IGNORAR.test(ruta)) continue;
    if (statSync(ruta).isDirectory()) ficherosFuente(ruta, salida);
    else if (EXTENSIONES.test(ruta)) salida.push(ruta);
  }
  return salida;
}

describe("portugués de Brasil como idioma por defecto", () => {
  it("es el primero de la lista y el idioma por defecto del ecosistema", () => {
    expect(DEFAULT_LOCALE).toBe("pt");
    expect(LOCALES[0]).toBe(DEFAULT_LOCALE);
    expect(isLocale(DEFAULT_LOCALE)).toBe(true);
  });

  it("se declara pt-BR en HTML, hreflang, Open Graph y voz", () => {
    expect(LOCALE_LABELS.pt.htmlLang).toBe("pt-BR");
    expect(LOCALE_LABELS.pt.hreflang).toBe("pt-BR");
    expect(OG_LOCALES.pt).toBe("pt_BR");
    expect(SPEECH_LOCALES.pt).toBe("pt-BR");
    expect(LOCALE_LABELS.pt.native).toContain("Brasil");
  });

  it("las alternativas hreflang llevan x-default al idioma por defecto", () => {
    const mapa = alternateLanguages("/app");
    expect(mapa["pt-BR"]).toBe("/app/pt");
    expect(mapa["x-default"]).toBe("/app/pt");
    expect(Object.keys(mapa)).toEqual(["pt-BR", "es-ES", "en", "ca-ES", "x-default"]);
    const conRuta = alternateLanguages("/app", "/programas");
    expect(conRuta["pt-BR"]).toBe("/app/pt/programas");
    expect(conRuta["x-default"]).toBe("/app/pt/programas");
  });

  it("la portada sin prefijo de idioma se sirve en pt-BR", () => {
    const layout = leer("apps/web/src/app/(landing)/layout.tsx");
    expect(layout).toMatch(/<html lang="pt-BR"/);
    expect(layout).toContain("alternateLanguages");
    const localeLayout = leer("apps/web/src/app/[locale]/layout.tsx");
    expect(localeLayout).toContain("LOCALE_LABELS[locale].htmlLang");
    expect(localeLayout).toContain("alternateLanguages");
  });

  it("ningún fichero de código etiqueta el portugués como europeo", () => {
    // El patrón se arma en ejecución para que este mismo fichero, que también
    // se escanea, no sea su propio falso positivo.
    const europeaGuion = ["pt", "PT"].join("-");
    const europeaBajo = ["pt", "PT"].join("_");
    const culpables: string[] = [];
    for (const carpeta of CARPETAS) {
      for (const fichero of ficherosFuente(join(root, carpeta))) {
        const texto = readFileSync(fichero, "utf8");
        // Las menciones históricas viven en la documentación; en el código no
        // debe quedar ninguna etiqueta europea del portugués.
        if (texto.includes(europeaGuion) || texto.includes(europeaBajo)) {
          culpables.push(relative(root, fichero));
        }
      }
    }
    expect(culpables).toEqual([]);
  });
});

/**
 * El vocabulario también delata el origen. Estas formas son de Portugal: si
 * alguna vuelve al diccionario portugués, el campus deja de estar en el idioma
 * de Brasil aunque la etiqueta siga diciendo `pt-BR`.
 */
const DE_PORTUGAL = [
  "ficheiro",
  "ecrã",
  "telemóvel",
  "registo",
  "anónimo",
  "eletrónico",
  "descarregar",
  "utilizador",
  "sítio",
  "ligações",
  "mazo",
  "tarjeta",
  "acrescento",
  "cábula",
  "repaso",
  "correio eletrónico",
  "âmbito assinado"
];

describe("portugués de Brasil: vocabulario, no solo la etiqueta", () => {
  it("el diccionario portugués no usa formas de Portugal", () => {
    // Sin comentarios: lo que se revisa es lo que lee una persona.
    const fuente = leer("packages/shared/src/i18n/pt.ts").replace(/\/\*[\s\S]*?\*\//g, "");
    const culpables = DE_PORTUGAL.filter((palabra) =>
      new RegExp(`(^|[^\\p{L}])${palabra}([^\\p{L}]|$)`, "iu").test(fuente)
    );
    expect(culpables).toEqual([]);
  });

  it("usa la ley brasileña al citar protección de datos", () => {
    const fuente = leer("packages/shared/src/i18n/pt.ts");
    expect(fuente).toContain("LGPD");
  });

  it("la historia de amor está dicha sin nombres y en el idioma de cada uno", () => {
    for (const locale of LOCALES) {
      const fuente = leer(`packages/shared/src/i18n/${locale}.ts`);
      expect(fuente).toContain('"about.love"');
      expect(fuente).toContain('"footer.love"');
    }
    // La firma completa (con nombres) vive sólo en el back: aquí no aparece.
    for (const locale of LOCALES) {
      expect(leer(`packages/shared/src/i18n/${locale}.ts`)).not.toContain("para T.");
    }
  });
});
