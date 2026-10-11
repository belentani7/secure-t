import type { Metadata, Viewport } from "next";
import { LOCALES, OG_LOCALES, alternateLanguages } from "@secure-t/shared";
import { SiteChrome } from "@/components/site-chrome";
import { SITE } from "@/lib/site";
import "../globals.css";

/**
 * Layout raíz de la portada en **portugués de Brasil** (idioma por defecto del
 * ecosistema: PT > ES > EN > CA). Es un layout raíz propio para que
 * `lang="pt-BR"` sea cierto sin necesidad de JavaScript, tal y como exige
 * WCAG 2.2 (3.1.1 Language of Page).
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE.pagesUrl),
  title: {
    default: "secure T — Instituto aberto de cibersegurança e IA",
    template: "%s · secure T"
  },
  description:
    "Instituto aberto de cibersegurança e inteligência artificial: quatro programas de vinte semanas, gratuitos, em quatro idiomas e funcionais sem conexão.",
  applicationName: SITE.name,
  authors: [{ name: "Pedro Belentani", url: "https://github.com/belentani7" }],
  keywords: [
    "cibersegurança",
    "cybersecurity",
    "inteligência artificial",
    "curso grátis",
    "SOC",
    "OWASP",
    "NIST",
    "ISO 27001",
    "ofensiva",
    "defensiva"
  ],
  alternates: {
    canonical: `${SITE.basePath}/`,
    languages: alternateLanguages(SITE.basePath)
  },
  openGraph: {
    type: "website",
    siteName: "secure T",
    locale: OG_LOCALES.pt,
    alternateLocale: (["es", "en", "ca"] as const).map((key) => OG_LOCALES[key]),
    title: "secure T — Instituto aberto de cibersegurança e IA",
    description: "Quatro programas de vinte semanas, gratuitos, sem registo e funcionais sem conexão.",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "secure T — Instituto aberto de cibersegurança e IA",
    description: "Formação universitária gratuita, em quatro idiomas e sem conexão."
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2307070a'/%3E%3Cpath d='M16 5l10 22H6z' fill='none' stroke='%23d4af37' stroke-width='2.4'/%3E%3Ccircle cx='16' cy='19' r='2.6' fill='%23f2d477'/%3E%3C/svg%3E"
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-contrast="normal" suppressHydrationWarning>
      <body>
        <SiteChrome locale="pt">{children}</SiteChrome>
      </body>
    </html>
  );
}
