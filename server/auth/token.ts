import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

/**
 * Tokens anónimos FIRMADOS (HMAC-SHA256).
 * Formato: secure-t_<uuidv4>_<createdAtMs>_<hex(sig)>
 * La firma cubre `${uuid}.${createdAt}` con TOKEN_SECRET.
 * Se usa hex (no base64url) porque `_` es el delimitador del token.
 * Sin secreto configurado cae a un fallback de desarrollo (avisado) para no romper la demo.
 */
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Fallback de desarrollo: valor efímero por proceso (no se commitea ningún literal).
// En producción define TOKEN_SECRET para que la firma sea estable entre instancias.
const DEV_FALLBACK = randomBytes(32).toString("hex");

let warned = false;
function getSecret(): string {
  const s = process.env.TOKEN_SECRET;
  if (typeof s === "string" && s.length >= 16) return s;
  if (!warned) {
    warned = true;
    console.warn("[auth] TOKEN_SECRET no configurado (>=16 chars). Usando fallback de desarrollo; define TOKEN_SECRET en produccion.");
  }
  return DEV_FALLBACK;
}

function sign(uuid: string, createdAt: number, secret: string): string {
  return createHmac("sha256", secret).update(`${uuid}.${createdAt}`).digest("hex");
}

export function issueAnonymousToken(uuid: string = randomUUID(), createdAt: number = Date.now()): string {
  return `secure-t_${uuid}_${createdAt}_${sign(uuid, createdAt, getSecret())}`;
}

export interface SignedTokenResult {
  valid: boolean;
  uuid?: string;
  isExpired: boolean;
  errorCode?: string;
}

export function verifySignedToken(token: string): SignedTokenResult {
  const parts = token.split("_");
  if (parts.length !== 4 || parts[0] !== "secure-t") {
    return { valid: false, isExpired: false, errorCode: "INVALID_FORMAT" };
  }
  const [, uuid, tsStr, sig] = parts;
  const createdAt = parseInt(tsStr, 10);
  if (!Number.isInteger(createdAt)) return { valid: false, isExpired: false, errorCode: "INVALID_TIMESTAMP" };
  if (!UUID_V4.test(uuid)) return { valid: false, isExpired: false, errorCode: "INVALID_UUID" };

  const expected = sign(uuid, createdAt, getSecret());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, uuid, isExpired: false, errorCode: "INVALID_SIGNATURE" };
  }

  const age = Date.now() - createdAt;
  if (age < 0) return { valid: false, uuid, isExpired: false, errorCode: "INVALID_TIMESTAMP" };
  if (age > MAX_AGE_MS) return { valid: false, uuid, isExpired: true, errorCode: "TOKEN_EXPIRED" };

  return { valid: true, uuid, isExpired: false };
}
