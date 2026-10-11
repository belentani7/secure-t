import path from "node:path";
import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./src/lib/security-headers";

/**
 * Configuración de la web AURUM.
 *
 * Un solo código, dos despliegues:
 *  · `next build`                → servidor Node (SSR real: el agente usa /api/agent).
 *  · `next build` con NEXT_OUTPUT=export → export estático para GitHub Pages y
 *    Netlify, que es lo que mantiene viva la promesa P3 del contrato original
 *    (campus estático, sin cuotas, funcional sin conexión).
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isExport = process.env.NEXT_OUTPUT === "export";
const repoRoot = path.resolve(import.meta.dirname, "..", "..");

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  ...(isExport ? { output: "export" as const } : {}),
  // El material didáctico se sirve tal cual: es Markdown y MP3, no imágenes que optimizar.
  images: { unoptimized: true },
  // Los paquetes del monorepo son TypeScript sin build: Next los compila.
  transpilePackages: ["@secure-t/shared", "@secure-t/agent"],
  // El contenido vive en campus/ (raíz del repositorio): permitimos ese límite.
  turbopack: { root: repoRoot },
  // Orígenes admitidos en desarrollo (incluye el proxy de vista previa del sandbox).
  allowedDevOrigins: ["localhost", "127.0.0.1", "*.e2b.app", "*.arena.ai"],
  reactStrictMode: true,
  poweredByHeader: false,
  // Cabeceras de seguridad en el despliegue con servidor. En el sitio estático,
  // donde el alojamiento no las permite, se aplican como metadatos (ver ADR-0011).
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS.map(({ key, value }) => ({ key, value })) }
    ];
  }
};

export default nextConfig;
