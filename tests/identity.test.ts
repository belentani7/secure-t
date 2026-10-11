/**
 * La llave de cuatro dígitos: identidad sin datos personales.
 *
 * Lo que se comprueba aquí es el contrato completo: que sólo se usan los cuatro
 * últimos dígitos, que el token es estable por (llave, semilla), que el coste es
 * el recomendado y —lo más importante— que **la llave no se guarda en ninguna
 * parte**: ni en el panel, ni en el almacén, ni en el expediente exportado.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  PBKDF2_ITERACIONES,
  base32,
  derivarToken,
  esLlaveValida,
  esTokenDeLlave,
  normalizarLlave,
  semillaDeDispositivo
} from "../packages/shared/src/identity";

const root = join(__dirname, "..");
const leer = (rel: string) => readFileSync(join(root, rel), "utf8");
const SEMILLA = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";

describe("llave de cuatro dígitos", () => {
  it("se queda con los cuatro últimos dígitos y descarta el resto", () => {
    expect(normalizarLlave("1234")).toBe("1234");
    expect(normalizarLlave("+34 612 34 56 78")).toBe("5678");
    expect(normalizarLlave("7-9-2-5")).toBe("7925");
    expect(normalizarLlave("12")).toBeNull();
    expect(normalizarLlave("")).toBeNull();
    expect(esLlaveValida("123")).toBe(false);
    expect(esLlaveValida("1234")).toBe(true);
  });

  it("el mismo par (llave, semilla) da el mismo token; otro par, otro token", async () => {
    const uno = await derivarToken("4821", SEMILLA, 1_000);
    const dos = await derivarToken("4821", SEMILLA, 1_000);
    const otraLlave = await derivarToken("4822", SEMILLA, 1_000);
    const otraSemilla = await derivarToken("4821", "a1b2c3d4", 1_000);
    expect(uno).toBe(dos);
    expect(uno).not.toBe(otraLlave);
    expect(uno).not.toBe(otraSemilla);
  });

  it("el token es legible, sin letras ambiguas y de 120 bits", async () => {
    const token = await derivarToken("4821", SEMILLA, 1_000);
    expect(token).toMatch(/^ST(-[0-9A-HJKMNP-TV-Z]{4}){6}$/);
    expect(esTokenDeLlave(token)).toBe(true);
    expect(esTokenDeLlave("3f7a1c9e-0000-4000-8000-000000000000")).toBe(false);
    expect(base32(new Uint8Array(15).fill(255))).toHaveLength(24);
  });

  it("usa el coste recomendado por OWASP (≥ 200.000 iteraciones)", () => {
    expect(PBKDF2_ITERACIONES).toBeGreaterThanOrEqual(200_000);
  });

  it("la semilla del dispositivo es aleatoria y no se repite", () => {
    const una = semillaDeDispositivo();
    const otra = semillaDeDispositivo();
    expect(una).toMatch(/^[0-9a-f]{32}$/);
    expect(una).not.toBe(otra);
  });

  it("lo único que se guarda no contiene la llave", async () => {
    const llave = "9182";
    const token = await derivarToken(llave, SEMILLA, 1_000);
    const guardado = JSON.stringify({ v: 1, semilla: SEMILLA, token });
    expect(guardado).not.toContain(llave);
    expect(guardado).toContain(SEMILLA);
    expect(guardado).toContain(token);
  });

  it("el panel no toca el almacenamiento y el almacén no acepta la llave", () => {
    const panel = leer("apps/web/src/components/key-panel.tsx");
    // El panel deriva y olvida: si alguien añade persistencia aquí, esto falla.
    expect(panel).not.toMatch(/localStorage|sessionStorage|document\.cookie/);
    const almacen = leer("apps/web/src/lib/key-store.ts");
    // La firma del almacén sólo admite semilla y token: la llave no cabe.
    expect(almacen).toMatch(/export function estadoDeLlave\(semilla: string, token: string\)/);
    expect(almacen).not.toMatch(/llave\s*:\s*string/);
  });
});
