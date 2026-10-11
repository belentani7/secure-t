"use client";

import Link from "next/link";
import {
  CURRICULUM_5Y,
  TOTAL_WEEKS,
  TOTAL_YEARS,
  curriculumStats,
  phasesOfYear,
  translator,
  type Locale,
  type PlanPhase,
  type TranslationKey
} from "@secure-t/shared";
import { localePath } from "@/lib/site";

/**
 * Plan de cinco años, doscientas semanas, diez franjas de veinte.
 *
 * La página no vende: dice qué franjas ya tienen texto publicado —las cuatro
 * primeras, que son los programas del campus— y cuáles siguen por escribir, con
 * el modo de estudio y los recursos abiertos que las sostienen. Un plan honesto
 * es más útil que un índice que finge estar terminado.
 */

const MODO_CLASE: Record<PlanPhase["mode"], string> = {
  programa: "border-[var(--color-gold)]",
  laboratorio: "border-[var(--color-azure)]",
  proyecto: "border-[var(--aurum-line-strong)]"
};

function Franja({ fase, locale, t }: { fase: PlanPhase; locale: Locale; t: ReturnType<typeof translator> }) {
  const publicada = fase.published > 0;
  return (
    <article className={`aurum-glass border-l-2 p-5 ${MODO_CLASE[fase.mode]}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="gold-text text-base font-semibold">
          {t(`plan.phase.${fase.id}.title` as TranslationKey)}
        </h3>
        <span className="mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--aurum-muted)]">
          {t("plan.semester", { n: fase.semester })} · {fase.from}–{fase.to}
        </span>
      </header>
      <p className="mt-2 text-sm text-[var(--aurum-muted)]">{t(`plan.phase.${fase.id}.detail` as TranslationKey)}</p>
      <p className="mono mt-3 text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-gold-bright)]">
        {publicada
          ? t("plan.published", { count: fase.published })
          : t("plan.pending")}
        {" · "}
        {t(`plan.mode.${fase.mode}` as TranslationKey)}
      </p>
      <p className="mono mt-1 text-[0.68rem] text-[var(--aurum-muted)]">{t("plan.aligns")}: {fase.aligns.join(" · ")}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {fase.course ? (
          <Link className="text-[var(--color-gold)] underline underline-offset-4" href={localePath(locale, `/programas/${fase.course}`)}>
            {t("plan.goCampus")}
          </Link>
        ) : null}
        <Link
          className="text-[var(--color-gold)] underline underline-offset-4"
          href={
            fase.course
              ? `${localePath(locale, "/biblioteca")}?curso=${fase.course}`
              : localePath(locale, "/biblioteca")
          }
        >
          {t("plan.goLibrary")}
        </Link>
      </div>
    </article>
  );
}

export function PlanView({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const stats = curriculumStats();

  return (
    <div className="wrap section">
      <p className="eyebrow">{t("nav.plan")}</p>
      <h1>{t("plan.title")}</h1>
      <p className="lead">{t("plan.lead")}</p>
      <p className="mono mt-3 text-xs text-[var(--aurum-muted)]">
        {t("plan.total", { weeks: TOTAL_WEEKS, years: TOTAL_YEARS, semesters: CURRICULUM_5Y.length })} ·{" "}
        {t("plan.published", { count: stats.publishedWeeks })}
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-[var(--aurum-muted)]">
        {(["programa", "laboratorio", "proyecto"] as const).map((modo) => (
          <span key={modo} className="mono">
            <span aria-hidden="true" className={`mr-2 inline-block h-2 w-2 rounded-full border ${MODO_CLASE[modo]}`} />
            {t(`plan.mode.${modo}` as TranslationKey)}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm text-[var(--aurum-muted)]">{t("plan.legend")}</p>
      <p className="mt-2 text-sm text-[var(--color-gold-bright)]">{t("plan.honesty")}</p>

      <div className="mt-10 grid gap-10">
        {[1, 2, 3, 4, 5].map((ano) => {
          const fases = phasesOfYear(ano);
          return (
            <section key={ano} aria-labelledby={`ano-${ano}`}>
              <h2 id={`ano-${ano}`} className="gold-text text-xl font-semibold">
                {t(`plan.year.${ano}.title` as TranslationKey)}
              </h2>
              <p className="mono mt-1 text-[0.68rem] uppercase tracking-[0.12em] text-[var(--aurum-muted)]">
                {t("plan.year", { n: ano })} · {fases.length} {t("plan.weeks")}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {fases.map((fase) => (
                  <Franja key={fase.id} fase={fase} locale={locale} t={t} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
