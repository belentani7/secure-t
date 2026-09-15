/**
 * Middleware de Verificación de Token (Servidor)
 * Stateless: NO consulta BD, NO guarda sesiones
 * Solo valida: formato, expiración, permisos
 *
 * ADVERTENCIA HONESTA: el token es un identificador anónimo firmado con HMAC
 * (TOKEN_SECRET). Demuestra posesión de un UUID v4 con firma válida emitida por
 * el servidor; NO autentica una identidad verificada con documento. No conceder
 * privilegios institucionales (roles, faculty, admin) basándose solo en este token.
 * Ver server/security/rbac.ts.
 */

import type { Request, Response, NextFunction } from "express";
import { verifySignedToken } from "../auth/token.js";

export interface TokenVerificationResult {
  valid: boolean;
  uuid?: string;
  permissions: string[];
  isExpired: boolean;
  errorCode?: string;
}

/**
 * Parsear y validar token desde header Authorization
 * Formato esperado: "Bearer secure-t_UUID_TIMESTAMP_SIGNATURE"
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

  const match = authHeader.match(/^Bearer\s+(secure-t_[A-Za-z0-9_-]+)$/);
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
 * Validar token firmado (HMAC). Un token sin firma válida NUNCA es aceptado.
 */
export function verifyToken(token: string): TokenVerificationResult {
  const r = verifySignedToken(token);

  if (!r.valid) {
    return {
      valid: false,
      uuid: r.uuid,
      permissions: [],
      isExpired: r.isExpired,
      errorCode: r.errorCode,
    };
  }

  // Token válido (firma correcta, no expirado) → permisos básicos anónimos.
  return {
    valid: true,
    uuid: r.uuid,
    permissions: ["view_content", "download_materials", "export_data"],
    isExpired: false,
  };
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
    // Autenticación fallida => 401 (semántica correcta), independientemente del matiz.
    res.status(401).json({
      error: "Invalid or missing authentication token",
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
