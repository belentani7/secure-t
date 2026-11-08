import { Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation, type Lang } from "@/lib/i18n";

const LINKS = [
  { href: "/campus", key: "header.campus" },
  { href: "/progress", key: "header.progress" },
  { href: "/mentor", key: "header.mentor" },
];

export default function SiteHeader() {
  const [location] = useLocation();
  const { t, lang, setLang, langs } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071016]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[#b8f36b] text-[#071016] shadow-[0_6px_24px_rgba(184,243,107,.18)]">
            <Shield className="size-5" strokeWidth={2.5} />
          </span>
          <span>
            <span className="block font-display text-lg font-bold tracking-[-.04em] text-[#f3f7f3]">
              secure<span className="text-[#b8f36b]">T</span>
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[.26em] text-white/40">
              {t("app.tagline")}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="order-3 w-full overflow-x-auto sm:order-none sm:w-auto">
          <ul className="flex items-center gap-1 text-sm">
            {LINKS.map(link => {
              const active =
                location === link.href || location.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex rounded-lg px-3 py-2 font-semibold transition ${active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/75 transition hover:border-white/30 focus:ring-2 focus:ring-[#b8f36b]/30 outline-none"
            aria-label={t("language")}
          >
            {langs.map(l => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
          <Link
            href="/record"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-white/30 hover:text-white"
          >
            {t("header.student_portal")}
          </Link>
        </div>
      </div>
    </header>
  );
}
