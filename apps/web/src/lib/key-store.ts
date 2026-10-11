"use client";

/**
 * Lo único que se guarda cuando alguien usa su llave de cuatro dígitos.
 *
 * `estadoDeLlave` no acepta la llave **a propósito**: sus cuatro dígitos se usan
 * en memoria para derivar el token y se olvidan. Si algún día alguien quiere
 * "guardar la llave para no volver a escribirla", este fichero es el sitio
 * equivocado: aquí sólo entran la semilla del dispositivo y el token derivado.
 */

const STORAGE_KEY = "secure-t-llave-v1";

export interface LlaveGuardada {
  v: 1;
  /** Semilla aleatoria del dispositivo: sin ella no se re-deriva el mismo token. */
  semilla: string;
  /** Token seudónimo derivado (PBKDF2-SHA256). Nunca contiene la llave. */
  token: string;
}

export function estadoDeLlave(semilla: string, token: string): LlaveGuardada {
  return { v: 1, semilla, token };
}

export function leerLlave(): LlaveGuardada | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) return null;
    const datos = JSON.parse(bruto) as Partial<LlaveGuardada>;
    if (datos?.v !== 1 || typeof datos.semilla !== "string" || typeof datos.token !== "string") return null;
    return { v: 1, semilla: datos.semilla, token: datos.token };
  } catch {
    return null;
  }
}

export function guardarLlave(estado: LlaveGuardada): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch {
    /* modo privado: la llave vive mientras dure la pestaña */
  }
}

/** Vuelve al token aleatorio: se olvida la semilla y el token derivado. */
export function olvidarLlave(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sin almacenamiento no hay nada que olvidar */
  }
}
