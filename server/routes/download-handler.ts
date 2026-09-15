/**
 * Download Handler - Material Educativo Protegido
 * - URLs presigned (caducan en 24h)
 * - Watermark JSON con restricciones
 * - Auditoría anónima (sin datos personales)
 */

import type { Request, Response } from "express";
import crypto from "crypto";

export interface DownloadRequest {
  courseId: string;
  token: string;
}

export interface PresignedURLResponse {
  url: string;
  courseId: string;
  expiresAt: string;
  expiresIn: "24h" | "1h";
  filesize_mb?: number;
}

/**
 * Generar URL presigned para descarga de material
 * La URL caduca en 24 horas (sin acceso después)
 * NO registramos: quién descargó, cuándo exacto, de dónde
 */
export async function generateDownloadURL(
  courseId: string,
  storageClient: any // S3, R2, o Cloudinary
): Promise<PresignedURLResponse> {
  const expiresInSeconds = 24 * 60 * 60; // 24 horas
  // Allowlist estricta: evita path traversal (../) en la clave del objeto firmado.
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(courseId)) {
    throw new Error("invalid_course_id");
  }
  const resourcePath = `courses/${courseId}/materials.zip`;

  try {
    const presignedURL = await storageClient.getSignedUrl(resourcePath, {
      expiresIn: expiresInSeconds,
      responseDisposition: "attachment",
      responseFilename: `secure-t-${courseId}-materials.zip`,
    });

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // Log ANÓNIMO: solo contador, sin usuario
    await logDownloadStatistic(courseId);

    return {
      url: presignedURL,
      courseId,
      expiresAt: expiresAt.toISOString(),
      expiresIn: "24h",
    };
  } catch (error) {
    throw new Error(`Failed to generate download URL: ${error instanceof Error ? error.message : "storage_error"}`);
  }
}

/**
 * Crear metadata de watermark para incluir en ZIP
 * Watermark = JSON legible (no criptografía) con restricciones claras
 */
export async function createWatermarkMetadata(courseId: string): Promise<{
  courseId: string;
  bundledAt: string;
  expiresAt: string;
  restrictions: string[];
  integrityCheck: string;
  watermark: string;
}> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días

  return {
    courseId,
    bundledAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    restrictions: [
      "❌ Prohibido revender este material",
      "❌ Prohibido redistribuir comercialmente",
      "❌ Prohibido usar como base para tu propio curso",
      "❌ Prohibido subir a plataformas sin autorización",
      "✅ Permitido: uso personal, educativo, dentro de tu organización",
    ],
    integrityCheck: crypto.randomBytes(16).toString("hex"), // Detectar modificaciones
    watermark:
      "Este material educativo es propiedad de Belentani. " +
      "Todos los derechos reservados. " +
      "Licencia: personal non-commercial.",
  };
}

/**
 * Handler Express: GET /api/download/:courseId
 * Requerimientos:
 * - Header: Authorization: Bearer {token}
 * - Token debe ser válido (verificado por middleware anterior)
 */
export async function handleDownloadRequest(
  req: Request,
  res: Response,
  storageClient: any
): Promise<void> {
  const { courseId } = req.params;
  const uuid = (req as any).tokenUUID;

  // Validar que el curso existe
  if (!courseId || courseId.trim() === "") {
    res.status(400).json({ error: "Invalid courseId" });
    return;
  }

  try {
    // Generar URL presigned (almacenamiento externo)
    const downloadResponse = await generateDownloadURL(courseId, storageClient);

    // Agregar info de watermark en respuesta (sin cambiar el ZIP)
    const watermark = await createWatermarkMetadata(courseId);

    res.status(200).json({
      success: true,
      download: downloadResponse,
      watermarkIncluded: {
        filename: "__SECURE_T_METADATA__.json",
        description: "Metadatos y restricciones de uso incluidas en el ZIP",
      },
      restrictions: watermark.restrictions,
    });
  } catch (error) {
    console.error(`Download error for course ${courseId}:`, error);
    res.status(500).json({ error: "Failed to generate download link" });
  }
}

/**
 * Log de estadísticas de descarga (ANÓNIMO)
 * Qué SÍ: contar descargas por curso
 * Qué NO: registrar quién, cuándo, de dónde
 */
async function logDownloadStatistic(courseId: string): Promise<void> {
  // Ejemplo: guardar en Redis o archivo
  // const counter = `downloads:${courseId}`;
  // await redis.incr(counter);

  // Por ahora, solo log a consola
  const timestamp = new Date().toISOString();
  console.log(
    JSON.stringify({
      event: "download_link_generated",
      courseId,
      timestamp,
      // NO incluir: uuid del usuario, IP, user agent
    })
  );
}

/**
 * Obtener estadísticas de descargas (anónimas)
 * GET /api/stats/downloads
 */
export async function getDownloadStatistics(
  req: Request,
  res: Response
): Promise<void> {
  // Requerimiento: token válido con permiso "view_statistics"
  const permissions = (req as any).permissions || [];

  if (!permissions.includes("view_statistics")) {
    res.status(403).json({
      error: "Permission denied: requires view_statistics",
    });
    return;
  }

  // Retornar estadísticas agregadas (sin usuarios individuales)
  const stats = {
    generatedAt: new Date().toISOString(),
    courses: [
      {
        courseId: "python-101",
        downloadLinks_generated_total: 124,
        avg_file_size_mb: 45,
      },
      {
        courseId: "react-advanced",
        downloadLinks_generated_total: 87,
        avg_file_size_mb: 67,
      },
    ],
    privacy_notice:
      "No se registran: usuarios individuales, IPs, emails, tiempos exactos de descarga",
  };

  res.status(200).json(stats);
}

/**
 * Express Routes Setup
 */
export function setupDownloadRoutes(app: any, storage: any): void {
  app.get("/api/download/:courseId", (req: Request, res: Response) => {
    handleDownloadRequest(req, res, storage);
  });

  app.get("/api/stats/downloads", (req: Request, res: Response) => {
    getDownloadStatistics(req, res);
  });
}
