import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Se genera en tiempo de build también en la exportación estática.
export const dynamic = "force-static";

/** Manifiesto PWA: instalable y utilizable sin conexión (promesa P3). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "secure T — Instituto aberto de ciberseguridade e IA",
    short_name: "secure T",
    description:
      "Quatro programas de vinte semanas de ciberseguridade e IA, gratuitos, sem registo e funcionais sem conexão.",
    start_url: `${SITE.basePath}/`,
    scope: `${SITE.basePath}/`,
    display: "standalone",
    background_color: "#07070a",
    theme_color: "#07070a",
    lang: "pt",
    dir: "ltr",
    categories: ["education", "security", "productivity"],
    icons: [
      {
        src:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='96' fill='%2307070a'/%3E%3Cpath d='M256 72l168 352H88z' fill='none' stroke='%23d4af37' stroke-width='34'/%3E%3Ccircle cx='256' cy='300' r='44' fill='%23f2d477'/%3E%3C/svg%3E",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
