/**
 * La firma es del back y sólo del back.
 *
 * El proyecto es un regalo de Pedro a su amor, T.: eso está escrito en el código
 * que compila y publica el campus (`tools/firma.ts`). En el front no aparece
 * nunca — allí vive la idea sin nombres (dos claves de diccionario). Este
 * contrato lo comprueba, para que un día nadie publique los nombres sin querer.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { FIRMA, selloDeBack } from "../tools/firma";

const root = join(__dirname, "..");
const leer = (rel: string) => readFileSync(join(root, rel), "utf8");
const FIRMA_COMPLETA = "A Pedro, para T.";

/** Todo lo que puede acabar delante de una persona: la app y sus paquetes. */
const RAIZ_FRONT = ["apps/web/src", "packages"];
const EXTENSIONES = /\.(ts|tsx|js|mjs|css|json|md)$/;
const IGNORAR = /node_modules|\.next|dist|build/;

function ficheros(dir: string, salida: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (IGNORAR.test(ruta)) continue;
    if (statSync(ruta).isDirectory()) ficheros(ruta, salida);
    else if (EXTENSIONES.test(ruta)) salida.push(ruta);
  }
  return salida;
}

describe("firma del autor (sólo en el back)", () => {
  it("está escrita, con nombre y destinataria, en el código del back", () => {
    expect(FIRMA.de).toBe("Pedro");
    expect(FIRMA.para).toBe("T");
    expect(FIRMA.dedicacao).toBe(FIRMA_COMPLETA);
    expect(selloDeBack()).toContain(FIRMA_COMPLETA);
    expect(leer("tools/firma.ts")).toContain(FIRMA_COMPLETA);
  });

  it("no aparece en ninguna parte del front", () => {
    const culpables: string[] = [];
    for (const carpeta of RAIZ_FRONT) {
      for (const fichero of ficheros(join(root, carpeta))) {
        if (readFileSync(fichero, "utf8").includes(FIRMA_COMPLETA)) {
          culpables.push(relative(root, fichero));
        }
      }
    }
    expect(culpables).toEqual([]);
  });

  it("la historia sí llega al front, sin nombres, en los cuatro idiomas", () => {
    for (const locale of ["pt", "es", "en", "ca"]) {
      const diccionario = leer(`packages/shared/src/i18n/${locale}.ts`);
      expect(diccionario).toContain('"about.love"');
      expect(diccionario).toContain('"footer.love"');
      expect(diccionario).not.toContain(FIRMA_COMPLETA);
    }
  });
});
