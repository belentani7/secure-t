import { useEffect, useState } from "react";

const STORAGE_KEY = "secure-t_session_token";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 1 año, igual que el servidor

export interface AnonymousToken {
  value: string;
  uuid: string;
  createdAt: number;
}

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Acepta token firmado (4 partes) y, por compatibilidad de parseo, el legado (3 partes).
function parseToken(raw: string): AnonymousToken | null {
  const parts = raw.split("_");
  if ((parts.length !== 3 && parts.length !== 4) || parts[0] !== "secure-t") return null;

  const [, uuid, timestampStr] = parts;
  const createdAt = parseInt(timestampStr, 10);
  if (Number.isNaN(createdAt) || !UUID_V4_REGEX.test(uuid)) return null;

  return { value: raw, uuid, createdAt };
}

function isSigned(raw: string): boolean {
  return raw.split("_").length === 4;
}

function createLocalToken(): AnonymousToken {
  const uuid = crypto.randomUUID();
  const createdAt = Date.now();
  return { value: `secure-t_${uuid}_${createdAt}`, uuid, createdAt };
}

function isExpired(token: AnonymousToken): boolean {
  const age = Date.now() - token.createdAt;
  if (age < 0) return true; // timestamp futuro: tratar como expirado
  return age > MAX_AGE_MS;
}

/** Pide al servidor un token FIRMADO (HMAC). Si no hay red/servidor, cae a token local de demo. */
async function requestSignedToken(): Promise<AnonymousToken> {
  try {
    const res = await fetch("/api/auth/token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    if (!res.ok) throw new Error(`auth_${res.status}`);
    const data = (await res.json()) as { token?: string };
    const parsed = data.token ? parseToken(data.token) : null;
    if (parsed && isSigned(parsed.value)) return parsed;
    throw new Error("auth_bad_token");
  } catch {
    return createLocalToken();
  }
}

/**
 * Obtiene el token anónimo guardado (firmado por el servidor) o solicita uno nuevo.
 * Nunca se envía un identificador personal: solo un UUID v4.
 */
export async function getOrCreateAnonymousToken(): Promise<AnonymousToken> {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const parsed = stored ? parseToken(stored) : null;

  // Reutiliza solo si está firmado y vigente; el token legado sin firma se re-emite.
  if (parsed && !isExpired(parsed) && isSigned(parsed.value)) return parsed;

  const fresh = await requestSignedToken();
  try {
    localStorage.setItem(STORAGE_KEY, fresh.value);
  } catch {
    /* storage bloqueado: seguimos con el token en memoria */
  }
  return fresh;
}

export function useAnonymousToken(): { token: AnonymousToken | null; isValid: boolean } {
  const [token, setToken] = useState<AnonymousToken | null>(null);

  useEffect(() => {
    let alive = true;
    getOrCreateAnonymousToken()
      .then((t) => {
        if (alive) setToken(t);
      })
      .catch(() => {
        /* sin token: la UI muestra el botón de generar */
      });
    return () => {
      alive = false;
    };
  }, []);

  return {
    token,
    isValid: token !== null && !isExpired(token),
  };
}
