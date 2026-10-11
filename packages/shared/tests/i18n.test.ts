import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_LABELS,
  auditDictionaries,
  dictionaries,
  isLocale,
  translate,
  translationKeys,
  translator
} from "../src/index";

describe("i18n PT/ES/EN/CA", () => {
  it("mantiene los cuatro idiomas en paridad exacta de claves", () => {
    const report = auditDictionaries();
    expect(report.missing).toEqual({ pt: [], es: [], en: [], ca: [] });
    expect(report.empty).toEqual({ pt: [], es: [], en: [], ca: [] });
    expect(report.duplicates).toEqual([]);
    expect(report.ok).toBe(true);
  });

  it("cubre todo el producto con un diccionario real (no esqueleto)", () => {
    expect(translationKeys.length).toBeGreaterThan(120);
    for (const locale of LOCALES) {
      expect(Object.keys(dictionaries[locale]).length).toBe(translationKeys.length);
    }
  });

  it("no deja ninguna traducción igual al marcador de clave", () => {
    for (const locale of LOCALES) {
      for (const key of translationKeys) {
        expect(dictionaries[locale][key]).not.toBe(key);
      }
    }
  });

  it("usa el portugués como idioma por defecto del ecosistema", () => {
    expect(DEFAULT_LOCALE).toBe("pt");
    expect(LOCALES).toEqual(["pt", "es", "en", "ca"]);
    expect(LOCALE_LABELS.ca.hreflang).toBe("ca-ES");
  });

  it("interpola variables y deja intactas las que faltan", () => {
    expect(translate("es", "campus.weekOf", { n: 7, total: 20 })).toBe("Semana 7 de 20");
    expect(translate("en", "campus.weekOf", { n: 3 })).toBe("Week 3 of {total}");
    expect(translator("ca")("nav.campus")).toBe("Campus");
  });

  it("valida identificadores de idioma y cae al diccionario por defecto", () => {
    expect(isLocale("ca")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(translate("en", "status.planned")).toBe("PLANNED");
  });

  it("declara honestamente el estado del proyecto en los cuatro idiomas", () => {
    for (const locale of LOCALES) {
      expect(dictionaries[locale]["credential.phase2"]).toContain("2");
      expect(dictionaries[locale]["status.planned"]).toMatch(/PLAN|PLANIFI|PLANE/);
    }
  });
});
