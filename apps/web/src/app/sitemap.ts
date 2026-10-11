import type { MetadataRoute } from "next";
import { LOCALES } from "@secure-t/shared";
import { allCourses } from "@/lib/content";
import { SITE } from "@/lib/site";

// Se genera en tiempo de build también en la exportación estática.
export const dynamic = "force-static";

const SECTIONS = ["", "/programas", "/agente", "/calendario", "/progreso", "/credencial", "/amenazas"];

/** Mapa del sitio: sólo rutas que existen de verdad, en los cuatro idiomas. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.pagesUrl.replace(/\/$/, "");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const section of SECTIONS) {
      entries.push({
        url: `${base}/${locale}${section}`,
        lastModified: now,
        changeFrequency: section === "" ? "weekly" : "monthly",
        priority: section === "" ? 1 : 0.7
      });
    }
    for (const course of allCourses()) {
      entries.push({
        url: `${base}/${locale}/programas/${course.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6
      });
      for (const week of course.weeks) {
        entries.push({
          url: `${base}/${locale}/programas/${course.slug}/semana/${week.index}`,
          lastModified: now,
          changeFrequency: "yearly",
          priority: 0.4
        });
      }
    }
  }

  // Portada en portugués (idioma por defecto) con URL limpia.
  entries.unshift({ url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 });
  return entries;
}
