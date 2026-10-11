import { translator, type Locale } from "@secure-t/shared";
import { META_HEADERS } from "@/lib/security-headers";
import { MotionRhythm } from "./motion-rhythm";
import { ScrollableFocus } from "./scrollable-focus";
import { OfflineRegister } from "./offline-register";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * Estructura común: enlace de salto, cabecera, contenido y pie.
 * Se usa desde los dos layouts raíz (portada en PT y rutas por idioma) para que
 * la experiencia sea idéntica sin duplicar marcado.
 */

const PREFERENCES_SCRIPT = `
(function () {
  try {
    var contrast = localStorage.getItem("secure-t-contrast");
    if (contrast === "high" || contrast === "normal") {
      document.documentElement.setAttribute("data-contrast", contrast);
    }
    var lang = localStorage.getItem("secure-t-locale");
    if (lang && ["pt", "es", "en", "ca"].indexOf(lang) !== -1) {
      document.documentElement.setAttribute("data-preferred-locale", lang);
    }
  } catch (error) {
    /* sin almacenamiento: se usa el valor por defecto */
  }
})();
`;

export function SiteChrome({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = translator(locale);
  return (
    <>
      {/* Política de seguridad también como metadatos: GitHub Pages no permite
          cabeceras propias, así que el sitio estático no se queda sin CSP. */}
      {META_HEADERS.map((meta) => (
        <meta key={meta.httpEquiv} httpEquiv={meta.httpEquiv} content={meta.content} />
      ))}
      <ScrollableFocus />
      <MotionRhythm />
      <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
      <a className="skip-link" href="#main">
        {t("a11y.skip")}
      </a>
      <SiteHeader locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
      <OfflineRegister />
    </>
  );
}
