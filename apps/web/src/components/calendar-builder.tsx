"use client";

import { useMemo, useState } from "react";
import {
  CALENDARS,
  buildProgramPlan,
  buildStudyPlan,
  formatShort,
  programPlanToIcs,
  studyPlanToIcs,
  translator,
  todayISO,
  type ISODate,
  type Locale
} from "@secure-t/shared";
import { downloadText } from "@/lib/progress-store";

interface CourseInput {
  slug: string;
  title: string;
  weeks: number;
}

/**
 * Calendario de estudio por país.
 *
 * El plan se calcula en el dispositivo: festivos reales del país y la región,
 * vacaciones típicas, descanso tras dieciséis semanas seguidas e hitos. Se
 * puede descargar en `.ics` (RFC 5545) para Google Calendar, Outlook o Apple
 * Calendar, y en JSON para quien quiera tratarlo con sus propias herramientas.
 */
export function CalendarBuilder({
  locale,
  courses,
  focusCourse
}: {
  locale: Locale;
  courses: CourseInput[];
  focusCourse?: string;
}) {
  const t = translator(locale);
  const [calendarCode, setCalendarCode] = useState("ES");
  const [region, setRegion] = useState("ES-CT");
  const [startDate, setStartDate] = useState<ISODate>(() => todayISO() as ISODate);
  const [sessions, setSessions] = useState(3);
  const [minutes, setMinutes] = useState(90);
  const [startTime, setStartTime] = useState("19:00");
  const [mode, setMode] = useState<"course" | "program">(focusCourse ? "course" : "program");

  const selected = CALENDARS.find((calendar) => calendar.code === calendarCode);
  const regions = selected?.regions ?? [];
  const effectiveRegion = regions.some((entry) => entry.code === region) ? region : (regions[0]?.code ?? "");

  const plan = useMemo(() => {
    const common = {
      startDate,
      calendarCode,
      ...(effectiveRegion ? { region: effectiveRegion } : {}),
      locale,
      sessionsPerWeek: sessions,
      minutesPerSession: minutes,
      sessionStartTime: startTime
    };
    if (mode === "course") {
      const course = courses.find((entry) => entry.slug === focusCourse) ?? courses[0];
      if (!course) return null;
      return buildStudyPlan({ ...common, courseSlug: course.slug, courseTitle: course.title, weeks: course.weeks });
    }
    return buildProgramPlan({ ...common, courses: courses.map(({ slug, title, weeks }) => ({ slug, title, weeks })) });
  }, [mode, focusCourse, courses, startDate, calendarCode, effectiveRegion, locale, sessions, minutes, startTime]);

  if (!plan) return null;
  const isProgram = plan.kind === "program";
  const weeks = isProgram ? plan.courses.flatMap((course) => course.weeks) : plan.weeksPlan;
  const holidayCount = new Set(weeks.flatMap((week) => week.holidays.map((holiday) => holiday.key))).size;

  const ics = () => (isProgram ? programPlanToIcs(plan, { sessionStartTime: startTime }) : studyPlanToIcs(plan, { sessionStartTime: startTime }));

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <form className="card space-y-4" aria-labelledby="calendar-form" onSubmit={(event) => event.preventDefault()}>
        <h2 id="calendar-form" className="card-title">
          {t("calendar.title")}
        </h2>

        <div className="field">
          <label htmlFor="cal-country">{t("calendar.country")}</label>
          <select
            id="cal-country"
            value={calendarCode}
            onChange={(event) => {
              setCalendarCode(event.target.value);
              const next = CALENDARS.find((entry) => entry.code === event.target.value);
              setRegion(next?.regions?.[0]?.code ?? "");
            }}
          >
            {CALENDARS.map((calendar) => (
              <option key={calendar.code} value={calendar.code}>
                {calendar.country} ({calendar.code})
              </option>
            ))}
          </select>
        </div>

        {regions.length ? (
          <div className="field">
            <label htmlFor="cal-region">{t("calendar.region")}</label>
            <select id="cal-region" value={effectiveRegion} onChange={(event) => setRegion(event.target.value)}>
              {regions.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="cal-start">{t("calendar.start")}</label>
          <input id="cal-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value as ISODate)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="field">
            <label htmlFor="cal-sessions">{t("calendar.sessions")}</label>
            <input
              id="cal-sessions"
              type="number"
              min={1}
              max={7}
              value={sessions}
              onChange={(event) => setSessions(Math.min(7, Math.max(1, Number(event.target.value) || 1)))}
            />
          </div>
          <div className="field">
            <label htmlFor="cal-minutes">{t("calendar.hours")}</label>
            <input
              id="cal-minutes"
              type="number"
              min={15}
              max={480}
              step={15}
              value={minutes}
              onChange={(event) => setMinutes(Math.max(15, Number(event.target.value) || 90))}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="cal-time">{t("calendar.sessionsPlanned")}</label>
          <input id="cal-time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
        </div>

        <fieldset className="field">
          <legend>{t("campus.title")}</legend>
          <label className="mono flex items-center gap-2 text-[0.8rem]">
            <input type="radio" checked={mode === "program"} onChange={() => setMode("program")} />
            {t("pillars.title")} ({courses.length}×20)
          </label>
          {focusCourse ? (
            <label className="mono flex items-center gap-2 text-[0.8rem]">
              <input type="radio" checked={mode === "course"} onChange={() => setMode("course")} />
              {courses.find((course) => course.slug === focusCourse)?.title}
            </label>
          ) : null}
        </fieldset>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-sm" onClick={() => downloadText(`secure-t-plan-${calendarCode}.ics`, ics(), "text/calendar")}>
            {t("common.download")} .ics
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => downloadText(`secure-t-plan-${calendarCode}.json`, JSON.stringify(plan, null, 2))}
          >
            .json
          </button>
        </div>

        <p className="mono text-[0.7rem] text-[var(--aurum-muted)]">
          {t("calendar.note")} {selected?.source ? `· ${selected.source.slice(0, 60)}…` : ""}
        </p>
      </form>

      <section aria-labelledby="calendar-result">
        <h2 id="calendar-result" className="sr-only">
          {t("calendar.export")}
        </h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: t("calendar.end"), value: formatShort(plan.endDate, locale) },
            { label: t("calendar.totalHours"), value: `${plan.totalHours} h` },
            { label: t("calendar.weekShort"), value: String(weeks.length) },
            { label: t("calendar.holiday"), value: String(holidayCount) }
          ].map((item) => (
            <div key={item.label} className="card">
              <dt className="mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--aurum-muted)]">{item.label}</dt>
              <dd className="m-0 text-lg text-[var(--color-gold-bright)]">{item.value}</dd>
            </div>
          ))}
        </dl>

        {plan.warnings.length ? (
          <ul className="maintenance-note mt-4">
            {plan.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}

        {isProgram && plan.breaks.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {plan.breaks.map((pause) => (
              <li key={`${pause.reason}-${pause.start}`} className="badge">
                {pause.label}: {formatShort(pause.start, locale)} → {formatShort(pause.end, locale)}
              </li>
            ))}
          </ul>
        ) : null}

        <div tabIndex={0} className="table-wrap mt-5 max-h-[60vh]">
          <table>
            <caption className="sr-only">{t("calendar.sessionsPlanned")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("calendar.weekShort")}</th>
                <th scope="col">{t("calendar.start")}</th>
                <th scope="col">{t("calendar.sessions")}</th>
                <th scope="col">{t("calendar.holiday")}</th>
                <th scope="col">{t("calendar.milestone")}</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={`${week.index}-${week.start}`} className={week.shortWeek ? "short-week" : undefined}>
                  <td className="mono">S{String(week.index).padStart(2, "0")}</td>
                  <td>
                    {formatShort(week.start, locale)} → {formatShort(week.end, locale)}
                  </td>
                  <td className="mono">
                    {week.sessions.length}×{Math.round((week.minutes / (week.sessions.length || 1) / 60) * 10) / 10}h
                  </td>
                  <td className="mono text-[0.78rem]">
                    {week.holidays.length ? week.holidays.map((holiday) => holiday.name).join(", ") : "—"}
                  </td>
                  <td className="mono text-[0.78rem]">{week.milestone?.label ?? (week.restWeek ? t("calendar.break") : "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
