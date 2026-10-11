import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALE_LABELS, LOCALES, OG_LOCALES, alternateLanguages, isLocale, type Locale } from "@secure-t/shared";
import { SiteChrome } from "@/components/site-chrome";
import { SITE } from "@/lib/site";
import "../globals.css";

/**
 * Layout de cada idioma. Es un layout raíz propio (route group implícito) para
 * que el atributo `lang` del documento sea correcto sin depender de JavaScript:
 * lo que lee un lector de pantalla o un buscador es lo que está en el HTML.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const titles: Record<Locale, string> = {
    pt: "secure T — Instituto aberto de cibersegurança e IA",
    es: "secure T — Instituto abierto de ciberseguridad e IA",
    en: "secure T — Open institute of cybersecurity and AI",
    ca: "secure T — Institut obert de ciberseguretat i IA"
  };
  const descriptions: Record<Locale, string> = {
    pt: "Instituto aberto de cibersegurança e inteligência artificial: quatro programas de vinte semanas, gratuitos, sem registo e funcionais sem conexão.",
    es: "Instituto abierto de ciberseguridad e inteligencia artificial: cuatro programas de veinte semanas, gratuitos, sin registro y funcionales sin conexión.",
    en: "Open institute of cybersecurity and artificial intelligence: four twenty-week programmes, free, with no sign-up and working offline.",
    ca: "Institut obert de ciberseguretat i intel·ligència artificial: quatre programes de vint setmanes, gratuïts, sense registre i funcionals sense connexió."
  };
  return {
    // Sin `metadataBase` Next deja `canonical` y `hreflang` como rutas
    // relativas, y Lighthouse lo rechaza: el enlace tiene que ser absoluto.
    metadataBase: new URL(SITE.pagesUrl),
    title: { default: titles[locale], template: "%s · secure T" },
    description: descriptions[locale],
    alternates: {
      canonical: `${SITE.basePath}/${locale}`,
      languages: alternateLanguages(SITE.basePath)
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: OG_LOCALES[locale],
      title: titles[locale],
      url: `/${locale}`
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={LOCALE_LABELS[locale].htmlLang} data-contrast="normal" suppressHydrationWarning>
      <body>
        <SiteChrome locale={locale}>{children}</SiteChrome>
      </body>
    </html>
  );
}
