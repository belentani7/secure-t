"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { translator, type Locale } from "@secure-t/shared";
import { currentToken, saveQuiz, useProgress } from "@/lib/progress-store";
import { recordQuizAnswer, recordQuizFinished } from "@/lib/xapi-store";
import type { QuizItem } from "@/lib/content";

/**
 * Cuestionario de la semana. Igual que el campus clásico: una pregunta se
 * corrige al responder, con explicación; el resultado se guarda en el
 * expediente anónimo y revierte en el progreso del curso.
 */
export function QuizPlay({
  locale,
  slug,
  items,
  title = "",
  week
}: {
  locale: Locale;
  slug: string;
  items: QuizItem[];
  title?: string;
  week?: number;
}) {
  const t = translator(locale);
  const record = useProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [index, setIndex] = useState(0);
  /** Momento en que se mostró la pregunta: da la duración real de cada respuesta. */
  const shownAt = useRef<number>(Date.now());
  const finished = useRef(false);
  useEffect(() => {
    shownAt.current = Date.now();
  }, [index]);

  const current = items[index];
  const chosen = current ? answers[index] : undefined;
  const correct = current && chosen === current.correcta;

  const score = useMemo(
    () => items.filter((item, position) => answers[position] === item.correcta).length,
    [answers, items]
  );
  const answered = Object.keys(answers).length;

  if (!items.length) {
    return <p className="muted">{t("search.empty")}</p>;
  }
  if (!current) return null;

  const previous = record.courses[slug]?.quiz;
  const best = Math.max(score, previous?.score ?? 0);

  const choose = (option: number) => {
    if (answers[index] !== undefined) return;
    const next = { ...answers, [index]: option };
    setAnswers(next);
    const hits = items.filter((item, position) => next[position] === item.correcta).length;
    saveQuiz(slug, hits, items.length);

    const ctx = { token: currentToken(), locale, slug, title: title || slug };
    const elapsedMs = Math.max(0, Date.now() - shownAt.current);
    recordQuizAnswer(ctx, {
      week,
      index,
      correct: option === current.correcta,
      score: hits,
      total: items.length,
      elapsedMs
    });

    // El cuestionario se cierra cuando se ha respondido a todo: ahí se decide
    // si consta como superado (umbral 70 %, el mismo que anuncia el programa).
    const contestadas = Object.keys(next).length;
    if (contestadas === items.length && !finished.current) {
      finished.current = true;
      const umbral = Math.ceil(items.length * 0.7);
      recordQuizFinished(ctx, { week, score: hits, total: items.length, threshold: umbral, elapsedMs });
    }
  };

  return (
    <section className="card" aria-labelledby="quiz-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="quiz-title" className="card-title">
          {t("campus.quiz")}
        </h2>
        <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
          {index + 1}/{items.length} · {score} ✓ · {t("progress.saved")} {best}/{items.length}
        </p>
      </div>

      <p className="mt-3 font-semibold">{current.pregunta}</p>
      <ul className="mt-3 space-y-2">
        {current.opciones.map((option, position) => {
          const isChosen = chosen === position;
          const isRight = position === current.correcta;
          const state = chosen === undefined ? "idle" : isRight ? "right" : isChosen ? "wrong" : "idle";
          return (
            <li key={option}>
              <button
                type="button"
                className={`btn btn-ghost w-full justify-start text-left ${state === "right" ? "quiz-right" : ""} ${
                  state === "wrong" ? "quiz-wrong" : ""
                }`}
                onClick={() => choose(position)}
                aria-pressed={isChosen}
                disabled={chosen !== undefined}
              >
                <span className="mono mr-2 text-[0.75rem] text-[var(--color-gold)]">{String.fromCharCode(65 + position)}</span>
                {option}
              </button>
            </li>
          );
        })}
      </ul>

      {chosen !== undefined ? (
        <p className="maintenance-note mt-3" role="status">
          <strong className={correct ? "text-[var(--color-mint)]" : "text-[var(--color-coral)]"}>
            {correct ? t("credential.valid") : t("common.error")}
          </strong>{" "}
          {current.explicacion}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>
          ← {t("week.prev")}
        </button>
        <span className="mono text-[0.72rem] text-[var(--aurum-muted)]">
          {answered}/{items.length} {t("calendar.sessions")}
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setIndex((value) => Math.min(items.length - 1, value + 1))}
          disabled={index === items.length - 1}
        >
          {t("week.next")} →
        </button>
      </div>
    </section>
  );
}
