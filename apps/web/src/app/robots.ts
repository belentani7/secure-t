import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Se genera en tiempo de build también en la exportación estática.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = SITE.pagesUrl.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // El cuaderno del estudiante no se indexa nunca: es suyo y sólo suyo.
      { userAgent: "*", disallow: ["/progreso", "/credencial"] }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
