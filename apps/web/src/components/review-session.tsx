"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  dueCards,
  formatShort,
  gradeCard,
  nextDue,
  reviewStats,
  syncWithProgress,
  todayISO,
  translator,
  type DeckCourse,
  type ISODate,
  type Locale,
  type ReviewCard,
  type ReviewGrade
} from "@secure-t/shared";
import { asset, localePath } from "@/lib/site";
import { useProgress } from "@/lib/progress-store";
import { resetDeck, startDeck, updateDeck, useDeck } from "@/lib/review-store";

const GRADE_ORDER: ReviewGrade[] = [0, 1, 2, 3];
const GRADE_KEYS = {
  0: "review.again",
  1: "review.hard",
  2: "review.good",
  3: "review.easy"
} as const;

interface CatalogWeek {
  index: number;
  title: string;
  sections: string[];
  words: number;
}

/**
 * Sesión de repaso espaciado.
 *
 * El mazo sale de las 80 semanas del campus y se reprograma con SM-2 según lo
 * que el estudiante recuerda. La respuesta que se muestra al revelar son las
 * secciones reales de la semana y su resumen: no hay contenido inventado ni
 * preguntas generadas, sólo el material del campus repreguntado en el momento
 * en que toca.
 */
export function ReviewSession({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const deck = useDeck();
  const progress = useProgress();
  const [catalog, setCatalog] = useState<{ weeks: Map<string, CatalogWeek>; courses: DeckCourse[] } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const today = todayISO() as ISODate;

  useEffect(() => {
    let cancelled = false;
    fetch(asset("/content/catalog.json"))
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("no-catalog"))))
      .then((data: { courses: { slug: string; title: string; weeks: CatalogWeek[] }[] }) => {
        if (cancelled) return;
        const weeks = new Map<string, CatalogWeek>();
        const courses: DeckCourse[] = data.courses.map((course) => {
          for (const week of course.weeks) weeks.set(`${course.slug}/semana-${week.index}`, week);
          return {
            slug: course.slug,
            title: course.title,
            weeks: course.weeks.map((week) => ({ index: week.index, title: week.title }))
          };
        });
        setCatalog({ weeks, courses });
      })
      .catch(() => setError(t("common.error")));
    return () => {
      cancelled = true;
    };
  }, [t]);

  // Las semanas terminadas entran en el mazo (mañana, no hoy).
  useEffect(() => {
    if (!deck || !catalog) return;
    const terminadas = Object.entries(progress.courses).flatMap(([course, entry]) =>
      entry.weeks.map((week) => ({ course, week }))
    );
    const sincronizado = syncWithProgress(deck, terminadas, today);
    if (sincronizado !== deck) updateDeck(sincronizado);
  }, [deck, catalog, progress, today]);

  const stats = useMemo(() => (deck ? reviewStats(deck, today) : null), [deck, today]);
  const cola = useMemo(() => (deck ? dueCards(deck, today, 12) : []), [deck, today]);
  const actual: ReviewCard | undefined = cola[0];

  const previsualizacion = useMemo(() => {
    if (!actual) return [];
    return GRADE_ORDER.map((grade) => {
      const despues = gradeCard(actual, grade, today);
      const dias = Math.round(
        (Date.parse(`${despues.due}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000
      );
      return { grade, dias };
    });
  }, [actual, today]);

  const detalle = actual ? catalog?.weeks.get(actual.id) : undefined;

  const calificar = (grade: ReviewGrade) => {
    if (!deck || !actual) return;
    const cards = { ...deck.cards, [actual.id]: gradeCard(actual, grade, today) };
    updateDeck({ ...deck, cards });
    setRevealed(false);
    setSessionDone((valor) => valor + 1);
  };

  if (error) return <p className="muted">{error}</p>;

  if (!deck) {
    return (
      <section className="card text-center" aria-labelledby="review-start">
        <h2 id="review-start" className="card-title">
          {t("review.title")}
        </h2>
        <p className="lead mx-auto max-w-[60ch]">{t("review.lead")}</p>
        <p className="mono text-[0.78rem] text-[var(--aurum-muted)]">
          {catalog ? `${catalog.courses.length} · ${catalog.weeks.size} ${t("campus.weeks")}` : t("common.loading")}
        </p>
        <button
          type="button"
          className="btn mt-4"
          disabled={!catalog}
          onClick={() => catalog && startDeck(catalog.courses, today)}
        >
          {t("review.start")}
        </button>
        <p className="mono mt-3 text-[0.72rem] text-[var(--aurum-muted)]">{t("progress.anonymous")}</p>
      </section>
    );
  }

  const proxima = nextDue(deck, today);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="card" aria-labelledby="review-card">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="review-card" className="card-title m-0">
            {t("review.title")}
          </h2>
          <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
            {sessionDone} {t("review.done")} · {cola.length} {t("review.due")}
          </p>
        </div>

        {actual ? (
          <>
            <p className="eyebrow mt-4">
              {catalog?.courses.find((course) => course.slug === actual.course)?.title ?? actual.course} ·{" "}
              {t("campus.weekOf")} {actual.week}
            </p>
            <h3 className="mt-1 text-[var(--step-2)]">{actual.title}</h3>

            {revealed ? (
              <div className="maintenance-note mt-4">
                <p className="mb-2 font-semibold text-[var(--color-gold-bright)]">{t("review.answer")}</p>
                <ul className="mono space-y-1 text-[0.82rem] text-[var(--aurum-muted)]">
                  {(detalle?.sections ?? []).map((section) => (
                    <li key={section}>· {section}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.9rem]">
                  {detalle ? `${detalle.words} ${t("campus.words")}` : ""}{" "}
                  <Link href={localePath(locale, `/programas/${actual.course}/semana/${actual.week}`)}>
                    {t("review.open")}
                  </Link>
                </p>
              </div>
            ) : (
              <p className="muted mt-4">{t("review.question")}</p>
            )}

            {revealed ? (
              <fieldset className="mt-5">
                <legend className="mono text-[0.78rem] text-[var(--aurum-muted)]">{t("review.grade")}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {previsualizacion.map(({ grade, dias }) => (
                    <button
                      key={grade}
                      type="button"
                      className={`btn btn-sm ${grade === 2 ? "" : "btn-ghost"}`}
                      onClick={() => calificar(grade)}
                      aria-label={`${t(GRADE_KEYS[grade])} — ${dias} ${dias === 1 ? t("review.day") : t("review.days")}`}
                    >
                      {t(GRADE_KEYS[grade])}
                      <span className="mono text-[0.68rem] text-[var(--aurum-muted)]">
                        {dias === 0 ? t("review.today") : `+${dias}${t("review.dayShort")}`}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              <button type="button" className="btn mt-4" onClick={() => setRevealed(true)}>
                {t("review.show")}
              </button>
            )}
          </>
        ) : (
          <div className="maintenance-note mt-4">
            <p className="m-0">{t("review.empty")}</p>
            {proxima ? (
              <p className="mono m-0 text-[0.8rem] text-[var(--color-gold-bright)]">
                {t("review.next")}: {formatShort(proxima, locale)}
              </p>
            ) : null}
          </div>
        )}
      </section>

      <aside className="space-y-4">
        {stats ? (
          <section className="card" aria-labelledby="review-stats">
            <h2 id="review-stats" className="card-title">
              {t("review.deck")}
            </h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="mono text-[0.68rem] uppercase text-[var(--aurum-muted)]">{t("review.due")}</dt>
                <dd className="m-0 text-xl text-[var(--color-gold-bright)]">{stats.dueToday}</dd>
              </div>
              <div>
                <dt className="mono text-[0.68rem] uppercase text-[var(--aurum-muted)]">{t("review.learned")}</dt>
                <dd className="m-0 text-xl text-[var(--color-mint)]">{stats.learned}</dd>
              </div>
              <div>
                <dt className="mono text-[0.68rem] uppercase text-[var(--aurum-muted)]">{t("review.total")}</dt>
                <dd className="m-0 text-xl">{stats.total}</dd>
              </div>
              <div>
                <dt className="mono text-[0.68rem] uppercase text-[var(--aurum-muted)]">{t("review.lapses")}</dt>
                <dd className="m-0 text-xl text-[var(--color-coral)]">{stats.lapses}</dd>
              </div>
            </dl>

            <h3 className="mono mt-5 text-[0.72rem] uppercase tracking-[0.12em] text-[var(--aurum-muted)]">
              {t("review.horizon")}
            </h3>
            <ol className="mt-2 flex items-end gap-1" aria-label={t("review.horizon")}>
              {stats.horizon.map((dia) => {
                const maximo = Math.max(...stats.horizon.map((entry) => entry.count), 1);
                const altura = Math.round((dia.count / maximo) * 44);
                return (
                  <li key={dia.date} className="flex flex-1 flex-col items-center gap-1">
                    <span
                      className="w-full rounded-t bg-[linear-gradient(180deg,var(--color-gold-bright),var(--color-gold-deep))]"
                      style={{ height: `${Math.max(2, altura)}px` }}
                      aria-hidden="true"
                    />
                    <span className="mono text-[0.6rem] text-[var(--aurum-muted)]">{dia.date.slice(8)}</span>
                    <span className="sr-only">
                      {formatShort(dia.date, locale)}: {dia.count}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        <section className="card">
          <h2 className="card-title">{t("review.howItWorks")}</h2>
          <p className="muted m-0 text-[0.9rem]">{t("review.sm2")}</p>
          <button
            type="button"
            className="btn btn-ghost btn-sm mt-3"
            onClick={() => {
              if (window.confirm(`${t("review.reset")}?`)) resetDeck();
            }}
          >
            {t("review.reset")}
          </button>
        </section>
      </aside>
    </div>
  );
}
