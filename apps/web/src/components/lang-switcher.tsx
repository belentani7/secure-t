"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_LABELS, LOCALES, translator, type Locale } from "@secure-t/shared";
import { SITE } from "@/lib/site";

/**
 * Cambia de idioma conservando la página en la que está el estudiante.
 * Se guarda la preferencia en el dispositivo (nada viaja a un servidor).
 */
export function LangSwitcher({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const pathname = usePathname() ?? "/";

  const targetFor = (target: Locale) => {
    const withoutBase = SITE.basePath && pathname.startsWith(SITE.basePath) ? pathname.slice(SITE.basePath.length) : pathname;
    const segments = withoutBase.split("/").filter(Boolean);
    if (segments.length && (LOCALES as readonly string[]).includes(segments[0]!)) segments.shift();
    const rest = segments.length ? `/${segments.join("/")}` : "";
    return `/${target}${rest}`;
  };

  const remember = (target: Locale) => {
    try {
      localStorage.setItem("secure-t-locale", target);
    } catch {
      /* modo privado: simplemente no se recuerda */
    }
  };

  return (
    <div role="group" aria-label={t("a11y.lang")} className="flex items-center gap-1">
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={targetFor(code)}
            hrefLang={LOCALE_LABELS[code].hreflang}
            lang={code}
            aria-current={active ? "true" : undefined}
            onClick={() => remember(code)}
            className={`mono rounded-full border px-2 py-1 text-[0.7rem] uppercase no-underline transition ${
              active
                ? "border-[var(--color-gold)] bg-[rgb(212_175_55_/_14%)] text-[var(--color-gold-bright)]"
                : "border-[var(--aurum-line)] text-[var(--aurum-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
            }`}
            title={LOCALE_LABELS[code].native}
          >
            {code}
          </Link>
        );
      })}
    </div>
  );
}
