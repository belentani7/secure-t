import { ArrowUpRight, Check, Code2, LifeBuoy, ServerCog, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

import SiteHeader from "../components/SiteHeader";
import { useTranslation } from "@/lib/i18n";

const services = [
  {
    id: "base",
    icon: Code2,
    name: "services.base",
    price: "0 €",
    period: "services.once",
    description: "services.base.description",
    featured: false,
  },
  {
    id: "support",
    icon: LifeBuoy,
    name: "services.support",
    price: "89 €",
    period: "services.monthly",
    description: "services.support.description",
    featured: false,
  },
  {
    id: "managed",
    icon: ServerCog,
    name: "services.managed",
    price: "149 €",
    period: "services.monthly",
    description: "services.managed.description",
    featured: true,
  },
  {
    id: "consulting",
    icon: ShieldCheck,
    name: "services.consulting",
    price: "89 €",
    period: "services.hourly",
    description: "services.consulting.description",
    featured: false,
  },
] as const;

export default function Services() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#071016] text-[#f3f7f3]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#b8f36b]">
            {t("services.eyebrow")}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-[-.04em] sm:text-6xl">
            {t("services.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            {t("services.subtitle")}
          </p>
        </header>

        <section aria-label={t("services.catalogue")} className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ id, icon: Icon, name, price, period, description, featured }) => (
            <article
              key={id}
              className={`flex min-h-[20rem] flex-col rounded-2xl border p-6 ${featured ? "border-[#b8f36b]/50 bg-[#14221c]" : "border-white/10 bg-[#101920]"}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-[#b8f36b]/10 text-[#b8f36b]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {featured && <span className="rounded-full bg-[#b8f36b]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#b8f36b]">{t("services.recommended")}</span>}
              </div>
              <h2 className="mt-7 font-display text-xl font-bold">{t(name)}</h2>
              <p className="mt-3 min-h-16 text-sm leading-relaxed text-white/60">{t(description)}</p>
              <p className="mt-auto pt-7">
                <strong className="font-display text-3xl font-bold tracking-[-.04em]">{price}</strong>
                <span className="ml-2 text-sm text-white/50">{t(period)}</span>
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-[#101920] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-xl font-bold">{t("services.policy.title")}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65">{t("services.policy.body")}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/45">{t("services.proposal_note")}</p>
          </div>
          <a
            href="https://github.com/belentani7/secure-t"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#b8f36b] px-5 py-3 text-sm font-bold text-[#071016] transition hover:bg-[#d0ff9a]"
          >
            {t("services.repository")}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </section>

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-white/45">
          <Check className="mt-0.5 size-4 shrink-0 text-[#b8f36b]" aria-hidden="true" />
          {t("services.manual")}
        </p>

        <div className="mt-8">
          <Link href="/campus" className="text-sm font-semibold text-[#b8f36b] underline-offset-4 hover:underline">
            {t("services.back_to_campus")} →
          </Link>
        </div>
      </main>
    </div>
  );
}
