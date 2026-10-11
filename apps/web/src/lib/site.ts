import { LOCALES, SPEECH_LOCALES, alternateLanguages, type Locale, type TranslationKey } from "@secure-t/shared";

/** Datos del sitio y utilidades de rutas (con soporte de `basePath`). */

export const SITE = {
  name: "secure T",
  tagline: "Instituto abierto de ciberseguridad e inteligencia artificial",
  repo: "https://github.com/belentani7/secure-t",
  pagesUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://belentani7.github.io/secure-t/",
  classicCampus: "/campus/",
  classicLanding: "/index.html",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  agentMode: (process.env.NEXT_PUBLIC_AGENT_MODE ?? "local") as "local" | "server"
} as const;

/** Prefija un recurso estático (Next sólo prefija los enlaces gestionados). */
export function asset(pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE.basePath}${clean}`;
}

/**
 * Ruta localizada: `/pt/campus`, `/es/campus`…
 *
 * Sin `basePath`: `next/link` y `next/navigation` ya lo añaden al generar el
 * HTML. Los enlaces crudos (`<a>`), las descargas y los `fetch` sí lo necesitan,
 * y para eso está `asset()`.
 */
export function localePath(locale: Locale, pathname: string): string {
  const clean = pathname === "/" ? "" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${clean}`;
}

/** Ruta absoluta con `basePath`, para metadatos, descargas y `fetch`. */
export function absolutePath(pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE.basePath}${clean}`;
}

/** Canónico de una ruta localizada (con `basePath`: los metadatos no lo añaden). */
export function canonicalPath(locale: Locale, pathname = "/"): string {
  return absolutePath(localePath(locale, pathname));
}

/** Alternativas `hreflang` para una misma página en los cuatro idiomas (con `x-default`). */
export function alternates(pathname: string): Record<string, string> {
  return alternateLanguages(SITE.basePath, pathname);
}

export interface NavItem {
  key: TranslationKey;
  path: string;
  /**
   * Destino primario: los seis que caben en la memoria de trabajo (ley de
   * Miller) y que aparecen siempre en la cabecera. El resto vive en «más».
   */
  primary?: boolean;
  external?: boolean;
}

export const NAV: NavItem[] = [
  { key: "nav.campus", path: "/programas", primary: true },
  { key: "nav.tracks", path: "/itinerarios", primary: true },
  { key: "nav.library", path: "/biblioteca", primary: true },
  { key: "nav.plan", path: "/plano", primary: true },
  { key: "nav.lab", path: "/laboratorio", primary: true },
  { key: "nav.agent", path: "/agente", primary: true },
  { key: "nav.experience", path: "/experiencia" },
  { key: "nav.calendar", path: "/calendario" },
  { key: "nav.review", path: "/repaso" },
  { key: "nav.progress", path: "/progreso" },
  { key: "nav.credential", path: "/credencial" },
  { key: "nav.threats", path: "/amenazas" },
  { key: "standards.title", path: "/estandares" },
  { key: "nav.privacy", path: "/privacidad" }
];

export const PROGRAM_ORDER = ["ciber-defensiva", "gobernanza-compliance", "ciber-ofensiva", "ia-aplicada-segura"] as const;

export const HUMAN_LOCALES: Record<Locale, string> = SPEECH_LOCALES;
