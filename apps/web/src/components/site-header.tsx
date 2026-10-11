import Link from "next/link";
import { translator, type Locale } from "@secure-t/shared";
import { NAV, localePath } from "@/lib/site";
import { ContrastToggle } from "./contrast-toggle";
import { LangSwitcher } from "./lang-switcher";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = translator(locale);
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--aurum-line)] bg-[color-mix(in_srgb,var(--color-ink)_88%,transparent)] backdrop-blur-md">
      <div className="wrap flex min-h-[68px] flex-wrap items-center gap-x-4 gap-y-2 py-2">
        <Link
          href={localePath(locale, "/")}
          className="flex items-center gap-2 text-[var(--aurum-text)] no-underline"
        >
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg border border-[var(--aurum-line-strong)] bg-[rgb(212_175_55_/_8%)] text-[0.95rem]">
            ▲
          </span>
          <span className="flex flex-col leading-none">
            <strong className="gold-text text-[1.05rem] font-semibold tracking-wide">secure T</strong>
            <span className="mono text-[0.68rem] tracking-[0.14em] text-[var(--aurum-muted)] uppercase">campus AURUM</span>
          </span>
        </Link>

        <nav aria-label={t("a11y.nav")} className="order-3 w-full md:order-2 md:w-auto md:flex-1">
          <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 md:justify-center">
            {NAV.map((item) => (
              <li key={item.key}>
                {item.external ? (
                  <a className="btn btn-ghost btn-sm" href={item.path}>
                    {t(item.key)}
                  </a>
                ) : (
                  <Link className="btn btn-ghost btn-sm" href={localePath(locale, item.path)}>
                    {t(item.key)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-2 ml-auto flex items-center gap-2 md:order-3 md:ml-0">
          <ContrastToggle locale={locale} />
          <LangSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
