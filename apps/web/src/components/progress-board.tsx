"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { completionOf, translator, type Locale } from "@secure-t/shared";
import {
  downloadText,
  exportProgress,
  importProgress,
  resetProgress,
  useProgress
} from "@/lib/progress-store";
import { clearStatements, countStatements, exportStatements } from "@/lib/xapi-store";
import { localePath } from "@/lib/site";

interface CourseInput {
  slug: string;
  title: string;
  weeks: number;
}

/**
 * Expediente del estudiante: matriz de avance, importar/exportar firmado y
 * reinicio. Todo ocurre en el dispositivo; el token anónimo es lo único que
 * identifica el expediente (promesa P6 del contrato original).
 */
export function ProgressBoard({ locale, courses }: { locale: Locale; courses: CourseInput[] }) {
  const t = translator(locale);
  const record = useProgress();
  const [message, setMessage] = useState<string | null>(null);
  const [declaraciones, setDeclaraciones] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // El recuento es del dispositivo: no hay servidor que pueda contarlo por ti.
  useEffect(() => setDeclaraciones(countStatements()), []);

  const reports = courses.map((course) => ({
    course,
    report: completionOf(record, course.slug, course.weeks),
    doneWeeks: new Set(record.courses[course.slug]?.weeks ?? []),
    quiz: record.courses[course.slug]?.quiz
  }));
  const global = reports.length
    ? Math.round(reports.reduce((sum, entry) => sum + entry.report.percent, 0) / reports.length)
    : 0;

  const doExport = async () => {
    const { filename, json } = await exportProgress();
    downloadText(filename, json);
    setMessage(t("progress.saved"));
  };

  const doImport = async (file: File) => {
    const result = await importProgress(await file.text());
    setMessage(result.ok ? t("progress.saved") : `${t("progress.invalid")}${result.reason ? ` (${result.reason})` : ""}`);
  };

  return (
    <div className="space-y-6">
      <section className="card" aria-labelledby="global-progress">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="global-progress" className="card-title m-0">
            {t("progress.title")}
          </h2>
          <p className="mono text-[0.78rem] text-[var(--aurum-muted)]">
            {t("progress.token")}: <span className="text-[var(--color-gold-bright)]">{record.token.slice(0, 8)}…</span>
          </p>
        </div>
        <div className="progress mt-3" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={global} aria-label={t("progress.completed")}>
          <span style={{ width: `${global}%` }} />
        </div>
        <p className="mono mt-2 text-[0.75rem] text-[var(--aurum-muted)]">
          {global}% · {t("progress.anonymous")} · {t("progress.saved")} {new Date(record.updatedAt ?? record.createdAt).toLocaleDateString(locale)}
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map(({ course, report, doneWeeks, quiz }) => (
          <section key={course.slug} className="card" aria-labelledby={`progress-${course.slug}`}>
            <div className="flex items-baseline justify-between gap-2">
              <h3 id={`progress-${course.slug}`} className="card-title m-0">
                <Link href={localePath(locale, `/programas/${course.slug}`)}>{course.title}</Link>
              </h3>
              <span className="mono text-[0.78rem] text-[var(--color-gold-bright)]">{report.percent}%</span>
            </div>
            <p className="progress mt-2">
              <span style={{ width: `${report.percent}%` }} />
            </p>
            <ul className="mt-3 grid grid-cols-5 gap-1">
              {Array.from({ length: course.weeks }, (_, index) => index + 1).map((week) => {
                const done = doneWeeks.has(week);
                return (
                  <li
                    key={week}
                    className={`mono rounded border px-1 py-0.5 text-center text-[0.68rem] ${
                      done
                        ? "border-[var(--color-gold)] bg-[rgb(212_175_55_/_14%)] text-[var(--color-gold-bright)]"
                        : "border-[var(--aurum-line)] text-[var(--aurum-muted)]"
                    }`}
                  >
                    <span aria-hidden="true">{done ? "●" : "○"}</span> {week}
                    <span className="sr-only">
                      {t("campus.weekOf")} {week}: {done ? t("week.done") : t("week.markDone")}
                    </span>
                  </li>
                );
              })}
            </ul>
            <ul className="mono mt-3 flex flex-wrap gap-3 text-[0.72rem] text-[var(--aurum-muted)]">
              <li>
                {t("campus.quiz")}: {quiz ? `${quiz.score}/${quiz.total}` : "—"}
              </li>
              <li>
                {t("campus.lab")}: {report.labDone ? "✓" : "—"}
              </li>
              <li>
                {t("campus.project")}: {report.projectDone ? "✓" : "—"}
              </li>
              <li>
                {t("campus.exam")}: {report.examDone ? "✓" : "—"}
              </li>
              <li>
                {t("credential.title")}: {report.ready ? t("credential.valid") : t("credential.incomplete")}
              </li>
            </ul>
          </section>
        ))}
      </div>

      <section className="card" aria-labelledby="xapi-log">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="xapi-log" className="card-title m-0">
            {t("xapi.title")}
          </h2>
          <span className="mono text-[0.78rem] text-[var(--color-gold-bright)]">
            {declaraciones ?? "—"} {declaraciones === 1 ? "declaración" : "declaraciones"}
          </span>
        </div>
        <p className="muted mt-2 text-[0.92rem]">{t("xapi.lead")}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              const { filename, json } = exportStatements();
              downloadText(filename, json, "application/ld+json");
              setMessage(t("xapi.export"));
            }}
          >
            {t("xapi.export")}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (window.confirm(`${t("xapi.clear")}?`)) {
                clearStatements();
                setDeclaraciones(0);
                setMessage(t("xapi.clear"));
              }
            }}
          >
            {t("xapi.clear")}
          </button>
          <Link className="btn btn-ghost btn-sm" href={localePath(locale, "/privacidad")}>
            {t("nav.privacy")}
          </Link>
          <Link className="btn btn-ghost btn-sm" href={localePath(locale, "/estandares")}>
            {t("standards.title")}
          </Link>
        </div>
        <p className="mono mt-3 text-[0.72rem] text-[var(--aurum-muted)]">{t("xapi.note")}</p>
      </section>

      <section className="card flex flex-wrap items-center gap-3" aria-labelledby="data-tools">
        <h2 id="data-tools" className="card-title m-0 w-full">
          {t("progress.export")}
        </h2>
        <button type="button" className="btn btn-sm" onClick={() => void doExport()}>
          {t("progress.export")}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
          {t("progress.import")}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (window.confirm(`${t("progress.reset")}?`)) {
              resetProgress();
              setDeclaraciones(countStatements());
              setMessage(t("progress.saved"));
            }
          }}
        >
          {t("progress.reset")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="sr-only"
          aria-label={t("progress.import")}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void doImport(file);
            event.target.value = "";
          }}
        />
        {message ? (
          <p className="mono text-[0.75rem] text-[var(--color-mint)]" role="status">
            {message}
          </p>
        ) : null}
        <p className="mono w-full text-[0.72rem] text-[var(--aurum-muted)]">{t("progress.anonymous")}</p>
      </section>
    </div>
  );
}
