import { describe, it, expect } from "vitest";
import { createI18n } from "../i18n";

describe("createI18n", () => {
  const locales = {
    en: { hello: "Hello", bye: "Goodbye" },
    es: { hello: "Hola", bye: "Adiós" },
  };

  it("returns I18nProvider and useTranslation", () => {
    const i18n = createI18n(locales as Record<string, Record<string, string>>);
    expect(typeof i18n.I18nProvider).toBe("function");
    expect(typeof i18n.useTranslation).toBe("function");
  });

  it("accepts locale records with string values", () => {
    const locales = {
      en: { a: "1", b: "2" },
      es: { a: "uno", b: "dos" },
    };
    const i18n = createI18n(locales as Record<string, Record<string, string>>);
    expect(i18n).toHaveProperty("I18nProvider");
    expect(i18n).toHaveProperty("useTranslation");
  });
});
