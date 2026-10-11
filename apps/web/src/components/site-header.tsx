import Link from "next/link";
import { translator, type Locale } from "@secure-t/shared";
import { NAV, localePath } from "@/lib/site";
import { ContrastToggle } from "./contrast-toggle";
import { LangSwitcher } from "./lang-switcher";

/**
 * Cabecera del campus.
 *
 * La navegación está partida en dos escalones a propósito (ley de Hick): seis
 * destinos primarios y el resto detrás de «más». Trece enlaces del mismo peso
 * obligan a leerlos todos antes de decidir; seis se eligen de un vistazo, y lo
 * demás sigue estando a un clic. El panel secundario es un `<details>` nativo:
 * funciona sin JavaScript, se abre con el teclado y no necesita gestión de foco.
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const primarios = NAV.filter((item) => item.primary);
  const secundarios = NAV.filter((item) => !item.primary);

  return (
    <header className="aurum-glass aurum-glass-strong aurum-glass-flat sticky top-0 z-40">
      <span aria-hidden="true" className="aurum-filo absolute inset-x-0 bottom-0 h-px" />
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
            {primarios.map((item) => (
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
            <li>
              <details className="nav-more">
                <summary className="btn btn-ghost btn-sm" aria-label={t("nav.moreLabel")}>
                  {t("nav.more")}
                  <span aria-hidden="true" className="nav-more__flecha">
                    ▾
                  </span>
                </summary>
                <ul className="nav-more__panel aurum-glass aurum-glass-strong">
                  {secundarios.map((item) => (
                    <li key={item.key}>
                      <Link className="btn btn-ghost btn-sm w-full justify-start" href={localePath(locale, item.path)}>
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
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
