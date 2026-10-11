/**
 * La llave de cuatro dígitos: identidad seudónima sin datos personales.
 *
 * El campus no pide nombre, ni correo, ni teléfono. Lo único que se le pide a
 * quien quiere una identidad estable es **lo que ya recuerda**: los últimos
 * cuatro dígitos de su móvil. Esos cuatro dígitos se usan en memoria para
 * derivar un token con PBKDF2-SHA256 y una semilla propia del dispositivo, y no
 * se guardan en ninguna parte: lo que queda en el navegador es el token.
 *
 * Honestidad, escrita también en la interfaz: cuatro dígitos **no son un
 * secreto**. Diez mil combinaciones se recorren en minutos, así que esto no
 * protege un tesoro: sirve para que cada persona reconozca su identidad y para
 * que dos personas no compartan token por accidente. No uses aquí el PIN de tu
 * banco. Lo que protege de verdad es lo que no existe: no hay ninguna base de
 * datos con tu móvil.
 */

export const LLAVE_DIGITOS = 4;

/** Recomendación OWASP para PBKDF2-SHA256 (2023 o posterior). */
export const PBKDF2_ITERACIONES = 210_000;

/** Sal de dominio: separa este uso de cualquier otro del mismo PBKDF2. */
export const PBKDF2_SAL = "secure-t/llave/v1";

/** 120 bits en base32: 24 caracteres, legibles y sin ambigüedades. */
export const LONGITUD_TOKEN = 24;

/** Alfabeto de Crockford: sin I, L, O ni U (no se confunden al dictarlos). */
const ALFABETO = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Deja la entrada en cuatro dígitos, o `null` si no hay al menos cuatro.
 * Si alguien escribe su número completo, el resto se descarta **antes** de
 * tocar la criptografía: al token sólo llegan los cuatro últimos.
 */
export function normalizarLlave(entrada: string): string | null {
  if (typeof entrada !== "string") return null;
  const digitos = entrada.replace(/\D+/g, "");
  if (digitos.length < LLAVE_DIGITOS) return null;
  return digitos.slice(-LLAVE_DIGITOS);
}

export function esLlaveValida(entrada: string): boolean {
  return normalizarLlave(entrada) !== null;
}

/** Semilla aleatoria del dispositivo (16 bytes en hexadecimal). */
export function semillaDeDispositivo(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Base32 (Crockford) sobre los bytes dados. */
export function base32(datos: Uint8Array, longitud = LONGITUD_TOKEN): string {
  let bits = 0;
  let valor = 0;
  let salida = "";
  for (const byte of datos) {
    valor = (valor << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      salida += ALFABETO[(valor >>> (bits - 5)) & 31];
      bits -= 5;
      if (salida.length === longitud) return salida;
    }
  }
  if (bits > 0 && salida.length < longitud) salida += ALFABETO[(valor << (5 - bits)) & 31];
  return salida.slice(0, longitud);
}

/** Presenta el token en grupos de cuatro para poder dictarlo sin errores. */
export function formatearToken(bruto: string): string {
  const grupos = bruto.toUpperCase().match(/.{1,4}/g) ?? [];
  return `ST-${grupos.join("-")}`;
}

/**
 * Deriva el token de la llave de cuatro dígitos.
 *
 * `iteraciones` sólo se baja en las pruebas: en el producto son 210 000, que es
 * lo que hace que recorrer las diez mil combinaciones cueste un rato en lugar
 * de un parpadeo (y aun así, ver la nota de honestidad de arriba).
 */
export async function derivarToken(
  llave: string,
  semilla: string,
  iteraciones = PBKDF2_ITERACIONES
): Promise<string> {
  const cuatro = normalizarLlave(llave);
  if (!cuatro) throw new Error("La llave necesita al menos cuatro dígitos.");
  if (!semilla) throw new Error("Falta la semilla del dispositivo.");
  const codificador = new TextEncoder();
  const base = await crypto.subtle.importKey("raw", codificador.encode(cuatro), "PBKDF2", false, [
    "deriveBits"
  ]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: codificador.encode(`${PBKDF2_SAL}|${semilla}`),
      iterations: iteraciones,
      hash: "SHA-256"
    },
    base,
    120
  );
  return formatearToken(base32(new Uint8Array(bits)));
}

/** ¿Este token nació de una llave de cuatro dígitos? */
export function esTokenDeLlave(token: string): boolean {
  return typeof token === "string" && token.startsWith("ST-");
}
