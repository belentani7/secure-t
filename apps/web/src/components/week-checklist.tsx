"use client";

import { translator, type Locale } from "@secure-t/shared";
import { currentToken, toggleWeek, useProgress } from "@/lib/progress-store";
import { recordWeekToggle } from "@/lib/xapi-store";

/** Anota la marca en el expediente **y** en el registro xAPI: una sola acción. */
function marcar(ctx: { slug: string; title: string; locale: Locale }, week: number, done: boolean, total: number) {
  toggleWeek(ctx.slug, week, done);
  recordWeekToggle({ token: currentToken(), locale: ctx.locale, slug: ctx.slug, title: ctx.title }, week, done, total);
}

/** Marca de una sola semana, para la cabecera de la lección. */
export function MarkWeekDone({
  locale,
  slug,
  week,
  title = "",
  total = 20
}: {
  locale: Locale;
  slug: string;
  week: number;
  title?: string;
  total?: number;
}) {
  const t = translator(locale);
  const record = useProgress();
  const done = (record.courses[slug]?.weeks ?? []).includes(week);
  return (
    <button
      type="button"
      className={`btn btn-sm ${done ? "" : "btn-ghost"}`}
      onClick={() => marcar({ slug, title: title || slug, locale }, week, !done, total)}
      aria-pressed={done}
    >
      <span aria-hidden="true">{done ? "☑" : "☐"}</span>
      {done ? t("week.done") : t("week.markDone")}
    </button>
  );
}

/**
 * Casillas de la semana. Cada marca vive en el dispositivo del estudiante
 * (localStorage) y alimenta el expediente que luego firma la credencial.
 */
export function WeekChecklist({
  locale,
  slug,
  totalWeeks,
  title = "",
  compact = false
}: {
  locale: Locale;
  slug: string;
  totalWeeks: number;
  title?: string;
  compact?: boolean;
}) {
  const t = translator(locale);
  const record = useProgress();
  const course = record.courses[slug];
  const done = new Set(course?.weeks ?? []);
  const total = totalWeeks || 20;
  const percent = Math.round(([...done].filter((week) => week <= total).length / total) * 100);

  return (
    <section className={compact ? "" : "card"} aria-labelledby="checklist-title">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="checklist-title" className="card-title">
          {t("progress.title")}
        </h2>
        <span className="mono text-[0.78rem] text-[var(--color-gold-bright)]">{percent}%</span>
      </div>
      <div
        className="progress mt-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={t("progress.completed")}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <fieldset className="mt-4">
        <legend className="sr-only">{t("campus.plan")}</legend>
        <ul className="grid grid-cols-4 gap-1 sm:grid-cols-6">
          {Array.from({ length: total }, (_, index) => index + 1).map((week) => {
            const checked = done.has(week);
            return (
              <li key={week}>
                <label
                  className={`mono flex cursor-pointer items-center justify-center rounded-md border px-1 py-1 text-[0.7rem] transition ${
                    checked
                      ? "border-[var(--color-gold)] bg-[rgb(212_175_55_/_16%)] text-[var(--color-gold-bright)]"
                      : "border-[var(--aurum-line)] text-[var(--aurum-muted)] hover:border-[var(--color-gold)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(event) => marcar({ slug, title: title || slug, locale }, week, event.target.checked, total)}
                    aria-label={`${t("campus.weekOf")} ${week} · ${checked ? t("week.done") : t("week.markDone")}`}
                  />
                  S{String(week).padStart(2, "0")}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      <p className="mono mt-3 text-[0.72rem] text-[var(--aurum-muted)]">{t("progress.anonymous")}</p>
    </section>
  );
}
