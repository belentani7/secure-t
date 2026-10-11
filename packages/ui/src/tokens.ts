/**
 * Tokens de AURUM en TypeScript, para poder **comprobar** el contraste.
 *
 * El diseño es una promesa de accesibilidad: si un par de colores baja de
 * 4.5:1, el test falla y hay que cambiarlo. No es una opinión de diseño, es una
 * comprobación aritmética según WCAG 2.2.
 */

export const TOKENS = {
  ink: "#07070a",
  inkSoft: "#0d0d12",
  inkRaised: "#14141b",
  gold: "#d4af37",
  goldBright: "#f2d477",
  goldDeep: "#8a6d1f",
  azure: "#5aa9ff",
  mint: "#4ee0a8",
  coral: "#ff6b6b",
  saffron: "#ffb52e",
  text: "#f5f2e8",
  muted: "#a9a49a",
  highContrastText: "#fffef9",
  highContrastMuted: "#ded9cd"
} as const;

export interface TokenPair {
  name: string;
  foreground: string;
  background: string;
  min: number;
}

/** Pares que aparecen de verdad en la interfaz. */
export const PAIRS: TokenPair[] = [
  { name: "texto sobre tinta", foreground: TOKENS.text, background: TOKENS.ink, min: 4.5 },
  { name: "texto atenuado sobre tinta", foreground: TOKENS.muted, background: TOKENS.ink, min: 4.5 },
  { name: "dorado brillante sobre tinta", foreground: TOKENS.goldBright, background: TOKENS.ink, min: 4.5 },
  { name: "dorado sobre tinta", foreground: TOKENS.gold, background: TOKENS.ink, min: 4.5 },
  { name: "azul sobre tinta", foreground: TOKENS.azure, background: TOKENS.ink, min: 4.5 },
  { name: "menta sobre tinta", foreground: TOKENS.mint, background: TOKENS.ink, min: 4.5 },
  { name: "coral sobre tinta", foreground: TOKENS.coral, background: TOKENS.ink, min: 4.5 },
  { name: "azafrán sobre tinta", foreground: TOKENS.saffron, background: TOKENS.ink, min: 4.5 },
  { name: "texto sobre superficie elevada", foreground: TOKENS.text, background: TOKENS.inkRaised, min: 4.5 },
  { name: "texto AAA sobre tinta", foreground: TOKENS.highContrastText, background: TOKENS.ink, min: 7 }
];

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const light = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (light + 0.05) / (dark + 0.05);
}

export function meetsAA(foreground: string, background: string, large = false): boolean {
  return contrastRatio(foreground, background) >= (large ? 3 : 4.5);
}

export function meetsAAA(foreground: string, background: string): boolean {
  return contrastRatio(foreground, background) >= 7;
}
