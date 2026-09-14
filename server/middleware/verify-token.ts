/**
 * Middleware de Verificación de Token (Servidor)
 * Stateless: NO consulta BD, NO guarda sesiones
 * Solo valida: formato, expiración, permisos
 *
 * ADVERTENCIA HONESTA: el token es un identificador anónimo generado en el
 * cliente (sin HMAC/firma). Demuestra posesión de un UUID con formato válido,
 * NO autentica identidad. No conceder privilegios (roles, faculty, admin)
 * basándose solo en este token. Ver server/security/rbac.ts.
 */

import type { Request, Response, NextFunction } from "express";

export interface TokenVerificationResult {
  valid: boolean;
  uuid?: string;
  permissions: string[];
  isExpired: boolean;
  errorCode?: string;
}

/**
 * Parsear y validar token desde header Authorization
 * Formato esperado: "Bearer secure-t_UUID_TIMESTAMP"
 */
export function verifyTokenFromHeader(
  authHeader?: string
): TokenVerificationResult {
  if (!authHeader) {
    return {
      valid: false,
      permissions: [],
      isExpired: false,
      errorCode: "MISSING_AUTH",
    };
  }

  const match = authHeader.match(/^Bearer\s+(secure-t_[^_]+_\d+)$/);
  if (!match) {
    return {
      valid: false,
      permissions: [],
      isExpired: false,
      errorCode: "INVALID_FORMAT",
    };
  }

  const token = match[1];
  return verifyToken(token);
}

/**
 * Validar token string directamente
 * Formato: "secure-t_UUID_TIMESTAMP"
 */
export function verifyToken(token: string): TokenVerificationResult {
  const parts = token.split("_");

  // Validar estructura
  if (parts.length !== 3 || parts[0] !== "secure-t") {
    return {
      valid: false,
      permissions: [],
      isExpired: false,
      errorCode: "INVALID_FORMAT",
    };
  }

  const [, uuid, timestampStr] = parts;
  const timestamp = parseInt(timestampStr, 10);

  // Validar timestamp
  if (isNaN(timestamp)) {
    return {
      valid: false,
      permissions: [],
      isExpired: false,
      errorCode: "INVALID_TIMESTAMP",
    };
  }

  // Validar UUID (debe ser v4)
  if (!isValidUUID(uuid)) {
    return {
      valid: false,
      permissions: [],
      isExpired: false,
      errorCode: "INVALID_UUID",
    };
  }

  // Calcular edad del token
  const now = Date.now();
  const age = now - timestamp;
  const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 año

  // Rechazar timestamps futuros (reloj manipulado o token forjado con fecha lejana)
  if (age < 0) {
    return {
      valid: false,
      uuid,
      permissions: [],
      isExpired: false,
      errorCode: "INVALID_TIMESTAMP",
    };
  }

  if (age > maxAge) {
    return {
      valid: false,
      uuid,
      permissions: [],
      isExpired: true,
      errorCode: "TOKEN_EXPIRED",
    };
  }

  // Token válido → asignar permisos básicos
  // Nota: Los permisos NO se basan en datos almacenados (stateless)
  // Todos los tokens válidos tienen acceso a: view, download, export
  return {
    valid: true,
    uuid,
    permissions: ["view_content", "download_materials", "export_data"],
    isExpired: false,
  };
}

/**
 * Validar UUID v4
 */
function isValidUUID(uuid: string): boolean {
  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(uuid);
}

/**
 * Express Middleware: verificar token en Authorization header
 * Rechaza con 401 si es inválido o expirado
 */
export function requireValidToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const verification = verifyTokenFromHeader(authHeader);

  if (!verification.valid) {
    const statusCode = verification.isExpired ? 401 : 400;
    const message =
      verification.errorCode === "TOKEN_EXPIRED"
        ? "Token expired. Generate a new one."
        : "Invalid or missing authentication token";

    res.status(statusCode).json({
      error: message,
      code: verification.errorCode,
    });
    return;
  }

  // Adjuntar info del token al request para rutas posteriores
  (req as any).tokenUUID = verification.uuid;
  (req as any).permissions = verification.permissions;

  next();
}

/**
 * Middleware: log anónimo de acceso
 * Registra SOLO: timestamp, endpoint, UUID (sin detalles personales)
 */
export function anonymousAuditLog(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  // Interceptar response para loguear después
  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    const uuid = (req as any).tokenUUID || "anonymous";

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        uuid, // UUID anónimo (no nombre, no email)
        method: req.method,
        endpoint: req.path,
        status: res.statusCode,
        duration_ms: duration,
        // NO loguear: IP, User-Agent, query params, body
      })
    );

    // Llamar al send original
    return originalSend.call(this, data);
  };

  next();
}

/**
 * Verificar que el usuario tiene un permiso específico
 */
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const permissions = (req as any).permissions || [];

    if (!permissions.includes(permission)) {
      res.status(403).json({
        error: `Permission denied: requires '${permission}'`,
        code: "INSUFFICIENT_PERMISSIONS",
      });
      return;
    }

    next();
  };
}
