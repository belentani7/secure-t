import Link from "next/link";
import { LOCALES, translator, type Locale } from "@secure-t/shared";
import { SITE, localePath } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = translator(locale);
  return (
    <footer className="no-print mt-16 border-t border-[var(--aurum-line)] py-10">
      <div className="wrap grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="gold-text text-lg font-semibold">secure T</p>
          <p className="muted text-sm">{t("about.p1")}</p>
          <p className="mono mt-3 text-[0.72rem] text-[var(--aurum-muted)]">
            {t("footer.honesty")}
          </p>
        </div>
        <nav aria-label={t("a11y.nav")}>
          <p className="mono mb-2 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">{t("nav.campus")}</p>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href={localePath(locale, "/programas")}>{t("campus.title")}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/agente")}>{t("nav.agent")}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/calendario")}>{t("nav.calendar")}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/progreso")}>{t("nav.progress")}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/credencial")}>{t("nav.credential")}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/repaso")}>{t("nav.review")}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/estandares")}>{t("standards.title")}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/privacidad")}>{t("nav.privacy")}</Link>
            </li>
          </ul>
        </nav>
        <div className="text-sm">
          <p className="mono mb-2 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">
            {t("footer.source")}
          </p>
          <ul className="space-y-1">
            <li>
              <a href={SITE.repo} rel="noopener noreferrer" target="_blank">
                github.com/belentani7/secure-t
              </a>
            </li>
            <li>
              <a href={`${SITE.basePath}${SITE.classicCampus}`}>{t("campus.classic")}</a>
            </li>
            <li className="muted">{t("footer.license")}</li>
          </ul>
          <p className="mt-3 flex gap-2" aria-label={t("nav.language")}>
            {LOCALES.map((code) => (
              <Link key={code} href={`/${code}`} hrefLang={code} className="mono text-[0.72rem] uppercase">
                {code}
              </Link>
            ))}
          </p>
        </div>
      </div>
      <div className="wrap mt-8 border-t border-[var(--aurum-line)] pt-4">
        <p className="mono text-[0.72rem] text-[var(--aurum-muted)]">{t("footer.attribution")}</p>
      </div>
    </footer>
  );
}
