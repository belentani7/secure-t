/**
 * Política de seguridad aplicada por cabeceras (despliegue con servidor).
 * Está escrita una sola vez y se usa en los tres sitios que la necesitan:
 * `next.config.ts` (servidor), `public/_headers` (Netlify y Cloudflare Pages)
 * y los metadatos de la exportación estática.
 *
 * Criterio: **denegar por defecto**. Todo lo que no sea el propio origen está
 * bloqueado; no hay fuentes externas, ni CDN, ni analítica, así que la política
 * no necesita excepciones.
 *
 * Nota honesta: GitHub Pages **no permite enviar cabeceras** propias, así que en
 * ese despliegue la CSP va como `<meta http-equiv>` y `frame-ancestors` no
 * puede aplicarse (los metadatos no lo admiten). Está documentado en el ADR
 * de cabeceras de seguridad en lugar de darlo por hecho.
 */

export const CSP_DIRECTIVES = [
  "default-src 'self'",
  // Next inyecta el estado de hidratación en línea; no hay scripts de terceros.
  "script-src 'self' 'unsafe-inline'",
  // Tailwind y los estilos en línea de los componentes (medidores de progreso).
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
] as const;

export const CSP = CSP_DIRECTIVES.join("; ");

/**
 * Directivas que un `<meta http-equiv>` no puede aplicar. Chrome avisa de cada
 * una en la consola («directive is ignored when delivered via a <meta>
 * element»), y una consola con errores es, además de un defecto real, una
 * auditoría de Lighthouse en rojo.
 */
const NO_VALIDAS_EN_META = new Set(["frame-ancestors"]);

export const CSP_META = CSP_DIRECTIVES.filter(
  (directiva) => !NO_VALIDAS_EN_META.has(directiva.split(" ")[0] ?? "")
).join("; ");

/** Cabeceras comunes a todas las respuestas. */
export const SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "off" }
];

/**
 * Cabeceras que sí se pueden expresar como metadatos HTML (para el sitio
 * estático, donde el alojamiento no permite cabeceras).
 */
export const META_HEADERS: { httpEquiv: string; content: string }[] = [
  { httpEquiv: "Content-Security-Policy", content: CSP_META },
  { httpEquiv: "Referrer-Policy", content: "strict-origin-when-cross-origin" }
];
