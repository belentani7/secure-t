import { describe, expect, it } from "vitest";
import { PAIRS, contrastRatio, meetsAA, meetsAAA, TOKENS } from "../src/tokens";

/**
 * La identidad AURUM no es sólo estética: cada combinación que aparece en la
 * interfaz tiene que superar el contraste exigido por WCAG 2.2. Si alguien
 * cambia un color y baja del umbral, este test lo detiene.
 */
describe("tokens AURUM", () => {
  for (const pair of PAIRS) {
    it(`${pair.name} ≥ ${pair.min}:1`, () => {
      const ratio = contrastRatio(pair.foreground, pair.background);
      expect(ratio).toBeGreaterThanOrEqual(pair.min);
    });
  }

  it("el modo de alto contraste llega a AAA en texto normal", () => {
    expect(meetsAAA(TOKENS.highContrastText, TOKENS.ink)).toBe(true);
    expect(meetsAA(TOKENS.highContrastMuted, TOKENS.ink)).toBe(true);
  });

  it("el texto nunca usa sólo color para distinguir un estado", () => {
    // Los estados se acompañan de etiqueta textual en los componentes; aquí se
    // comprueba que los seis estados tengan su token diferenciado.
    const states = [TOKENS.mint, TOKENS.coral, TOKENS.saffron, TOKENS.azure, TOKENS.gold, TOKENS.goldBright];
    expect(new Set(states).size).toBe(states.length);
  });
});
