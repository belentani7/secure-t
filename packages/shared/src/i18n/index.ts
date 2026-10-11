import { ca } from "./ca";
import { en } from "./en";
import { es } from "./es";
import { pt, type Dict, type TranslationKey } from "./pt";

export type Locale = "pt" | "es" | "en" | "ca";

/** Orden oficial del ecosistema Belentani / NOIACORE: PT > ES > EN > CA. */
export const LOCALES: readonly Locale[] = ["pt", "es", "en", "ca"] as const;
export const DEFAULT_LOCALE: Locale = "pt";

/**
 * Etiquetas BCP-47 que se publican en el HTML (`lang`) y en `hreflang`.
 * El portugués del proyecto es **de Brasil** (`pt-BR`): es el idioma por defecto
 * del ecosistema (PT > ES > EN > CA) y así queda declarado, no supuesto.
 */
export const LOCALE_LABELS: Record<Locale, { name: string; native: string; htmlLang: string; hreflang: string }> = {
  pt: { name: "Portuguese (Brazil)", native: "Português (Brasil)", htmlLang: "pt-BR", hreflang: "pt-BR" },
  es: { name: "Spanish", native: "Español", htmlLang: "es", hreflang: "es-ES" },
  en: { name: "English", native: "English", htmlLang: "en", hreflang: "en" },
  ca: { name: "Catalan", native: "Català", htmlLang: "ca", hreflang: "ca-ES" }
};

/** `og:locale` usa guiones bajos y no admite una región ausente. */
export const OG_LOCALES: Record<Locale, string> = {
  pt: "pt_BR",
  es: "es_ES",
  en: "en_US",
  ca: "ca_ES"
};

/** BCP-47 para la síntesis de voz del navegador: sin ella, el portugués de
 *  Brasil se leería con acento de Portugal. */
export const SPEECH_LOCALES: Record<Locale, string> = {
  pt: "pt-BR",
  es: "es-ES",
  en: "en-GB",
  ca: "ca-ES"
};

/**
 * Alternativas `hreflang` de una página, con `x-default` apuntando al idioma por
 * defecto: sin esa entrada los buscadores eligen por su cuenta.
 */
export function alternateLanguages(basePath: string, pathname = ""): Record<string, string> {
  const limpio = pathname && pathname !== "/" ? pathname : "";
  const mapa: Record<string, string> = {};
  for (const locale of LOCALES) {
    mapa[LOCALE_LABELS[locale].hreflang] = `${basePath}/${locale}${limpio}`;
  }
  mapa["x-default"] = `${basePath}/${DEFAULT_LOCALE}${limpio}`;
  return mapa;
}

export const dictionaries: Record<Locale, Dict> = { pt, es, en, ca };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Traduce una clave. Admite interpolación `{nombre}`.
 * Si el idioma no define la clave (no puede pasar: el tipo `Dict` lo impide),
 * cae al idioma por defecto y, en último término, devuelve la propia clave.
 */
export function translate(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  const raw = dict[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : `{${name}}`
  );
}

/** Traductor ligado a un idioma: `const t = translator("es"); t("nav.campus")`. */
export function translator(locale: Locale) {
  return (key: TranslationKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
}

/** Todas las claves del producto, ordenadas: la fuente de verdad de la paridad. */
export const translationKeys = Object.keys(pt).sort() as TranslationKey[];

/**
 * Comprueba la paridad real de los cuatro diccionarios. Se usa en tests y en CI:
 * una traducción incompleta rompe la build, no se publica a medias.
 */
export function auditDictionaries(): {
  ok: boolean;
  missing: Record<Locale, TranslationKey[]>;
  empty: Record<Locale, TranslationKey[]>;
  duplicates: TranslationKey[];
} {
  const reference = new Set(translationKeys);
  const missing = {} as Record<Locale, TranslationKey[]>;
  const empty = {} as Record<Locale, TranslationKey[]>;
  for (const locale of LOCALES) {
    const keys = Object.keys(dictionaries[locale]) as TranslationKey[];
    const set = new Set(keys);
    missing[locale] = [...reference].filter((key) => !set.has(key));
    empty[locale] = keys.filter((key) => !dictionaries[locale][key].trim());
  }
  // Claves presentes en varios idiomas pero no en el de referencia (sobrantes).
  const sobrantes = LOCALES.flatMap((locale) =>
    (Object.keys(dictionaries[locale]) as TranslationKey[]).filter((key) => !reference.has(key))
  );
  return { ok: LOCALES.every((l) => missing[l].length === 0 && empty[l].length === 0) && sobrantes.length === 0, missing, empty, duplicates: sobrantes };
}

export type { Dict, TranslationKey };
export { pt, es, en, ca };
