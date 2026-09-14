import { useEffect, useState } from "react";

const STORAGE_KEY = "secure-t_session_token";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 1 año, igual que el servidor

export interface AnonymousToken {
  value: string;
  uuid: string;
  createdAt: number;
}

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseToken(raw: string): AnonymousToken | null {
  const parts = raw.split("_");
  if (parts.length !== 3 || parts[0] !== "secure-t") return null;

  const [, uuid, timestampStr] = parts;
  const createdAt = parseInt(timestampStr, 10);
  if (Number.isNaN(createdAt) || !UUID_V4_REGEX.test(uuid)) return null;

  return { value: raw, uuid, createdAt };
}

function createToken(): AnonymousToken {
  const uuid = crypto.randomUUID();
  const createdAt = Date.now();
  return { value: `secure-t_${uuid}_${createdAt}`, uuid, createdAt };
}

function isExpired(token: AnonymousToken): boolean {
  const age = Date.now() - token.createdAt;
  if (age < 0) return true; // timestamp futuro: tratar como expirado
  return age > MAX_AGE_MS;
}

/**
 * Obtiene el token anónimo guardado en este navegador, o genera uno nuevo
 * si no existe o expiró. Nunca se envía al servidor un identificador
 * personal: solo un UUID v4 generado localmente.
 */
export function getOrCreateAnonymousToken(): AnonymousToken {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? parseToken(stored) : null;

  if (parsed && !isExpired(parsed)) return parsed;

  const fresh = createToken();
  localStorage.setItem(STORAGE_KEY, fresh.value);
  return fresh;
}

export function useAnonymousToken(): { token: AnonymousToken | null; isValid: boolean } {
  const [token, setToken] = useState<AnonymousToken | null>(null);

  useEffect(() => {
    setToken(getOrCreateAnonymousToken());
  }, []);

  return {
    token,
    isValid: token !== null && !isExpired(token),
  };
}
