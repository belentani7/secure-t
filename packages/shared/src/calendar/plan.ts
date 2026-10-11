import type { Locale } from "../i18n";
import { addDays, isValidISO, startOfWeek, todayISO, weekdayOf, type ISODate } from "./dates";
import { holidaysBetween, type ResolvedHoliday } from "./holidays";
import { buildIcs, type IcsEvent } from "./ics";
import { findCalendar } from "./countries";

/**
 * Planificador académico.
 *
 * Traduce un programa de N semanas a fechas reales teniendo en cuenta:
 *  · los festivos oficiales del país (y de la región) del estudiante,
 *  · su disponibilidad semanal,
 *  · las ventanas de descanso razonables (verano/austral e invierno),
 *  · el máximo de semanas consecutivas antes de un respiro.
 *
 * Nada de esto necesita red ni servidor: promesa P6 (privacidad por diseño).
 */

export type SessionKind = "class" | "practice" | "lab" | "project" | "exam";
export type MilestoneKey = "start" | "case1" | "half" | "lab" | "project" | "exam" | "rest" | "break";

export const MILESTONE_LABELS: Record<MilestoneKey, Record<Locale, string>> = {
  start: { pt: "Início do programa", es: "Inicio del programa", en: "Programme start", ca: "Inici del programa" },
  case1: { pt: "Primeiro caso real", es: "Primer caso real", en: "First real case", ca: "Primer cas real" },
  half: { pt: "Metade do programa", es: "Mitad del programa", en: "Halfway point", ca: "Meitat del programa" },
  lab: { pt: "Laboratório integrador", es: "Laboratorio integrador", en: "Integrating lab", ca: "Laboratori integrador" },
  project: { pt: "Projeto final", es: "Proyecto final", en: "Final project", ca: "Projecte final" },
  exam: { pt: "Exame e defesa", es: "Examen y defensa", en: "Exam and defence", ca: "Examen i defensa" },
  rest: { pt: "Semana de descanso", es: "Semana de descanso", en: "Rest week", ca: "Setmana de descans" },
  break: { pt: "Férias letivas", es: "Vacaciones lectivas", en: "Academic break", ca: "Vacances lectives" }
};

export function milestoneLabel(key: MilestoneKey, locale: Locale): string {
  return MILESTONE_LABELS[key][locale] ?? MILESTONE_LABELS[key].es;
}

export interface PlannedSession {
  date: ISODate;
  weekday: number;
  minutes: number;
  kind: SessionKind;
  /** Día original cuando la sesión se movió por coincidir con un festivo. */
  movedFrom?: ISODate;
}

export interface PlannedWeek {
  index: number;
  start: ISODate;
  end: ISODate;
  minutes: number;
  sessions: PlannedSession[];
  holidays: ResolvedHoliday[];
  /** Dos o más festivos en la misma semana: el estudiante tendrá menos días. */
  shortWeek: boolean;
  restWeek: boolean;
  milestone?: { key: MilestoneKey; label: string };
}

export interface StudyPlanInput {
  courseSlug: string;
  courseTitle: string;
  weeks: number;
  startDate: ISODate;
  calendarCode: string;
  region?: string;
  locale?: Locale;
  sessionsPerWeek?: number;
  minutesPerSession?: number;
  sessionWeekdays?: number[];
  /** Hora local de cada sesión para el .ics (formato `HH:MM`). */
  sessionStartTime?: string;
  skipHolidays?: boolean;
}

export interface StudyPlan {
  kind: "course";
  courseSlug: string;
  courseTitle: string;
  weeks: number;
  startDate: ISODate;
  endDate: ISODate;
  calendarCode: string;
  calendarCountry: string;
  region?: string;
  locale: Locale;
  sessionsPerWeek: number;
  minutesPerSession: number;
  totalHours: number;
  totalSessions: number;
  holidays: ResolvedHoliday[];
  weeksPlan: PlannedWeek[];
  warnings: string[];
  generatedAt: string;
}

/** Reparto de días de estudio razonable según la carga elegida. */
export function defaultSessionWeekdays(sessionsPerWeek: number): number[] {
  const table: Record<number, number[]> = {
    1: [3],
    2: [2, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6],
    7: [0, 1, 2, 3, 4, 5, 6]
  };
  return table[Math.min(7, Math.max(1, Math.round(sessionsPerWeek)))] ?? table[3];
}

function dateOnWeekday(weekStart: ISODate, weekday: number): ISODate {
  const base = weekdayOf(weekStart);
  const delta = (weekday - base + 7) % 7;
  return addDays(weekStart, delta);
}

function sessionsForWeek(
  weekStart: ISODate,
  weekEnd: ISODate,
  weekdays: number[],
  minutes: number,
  holidayDates: Set<ISODate>,
  kind: SessionKind,
  skipHolidays: boolean
): { sessions: PlannedSession[]; lost: number } {
  const sessions: PlannedSession[] = [];
  const used = new Set<ISODate>();
  let lost = 0;

  for (const weekday of weekdays) {
    const planned = dateOnWeekday(weekStart, weekday);
    // La primera semana puede empezar a mitad: sólo cuentan los días del tramo.
    if (planned < weekStart || planned > weekEnd) continue;
    if (!skipHolidays || !holidayDates.has(planned)) {
      used.add(planned);
      sessions.push({ date: planned, weekday, minutes, kind });
      continue;
    }
    // Festivo: la sesión se mueve al siguiente día libre **dentro de la semana**.
    let candidate = addDays(planned, 1);
    let moved = false;
    while (candidate <= weekEnd) {
      if (!holidayDates.has(candidate) && !used.has(candidate)) {
        used.add(candidate);
        sessions.push({ date: candidate, weekday: weekdayOf(candidate), minutes, kind, movedFrom: planned });
        moved = true;
        break;
      }
      candidate = addDays(candidate, 1);
    }
    if (!moved) lost += 1;
  }

  return { sessions: sessions.sort((a, b) => (a.date < b.date ? -1 : 1)), lost };
}

function milestoneFor(index: number, weeks: number): MilestoneKey | undefined {
  if (index === 1) return "start";
  if (index === 5 && weeks > 8) return "case1";
  if (index === Math.ceil(weeks / 2) && weeks > 10) return "half";
  if (index === weeks - 3 && weeks >= 8) return "lab";
  if (index === weeks - 1) return "project";
  if (index === weeks) return "exam";
  return undefined;
}

function kindFor(index: number, weeks: number, sessionIndex: number): SessionKind {
  if (index === weeks) return "exam";
  if (index === weeks - 1) return "project";
  return (["class", "practice", "lab"] as const)[sessionIndex % 3] ?? "class";
}

export function buildStudyPlan(input: StudyPlanInput): StudyPlan {
  const locale: Locale = input.locale ?? "es";
  const sessionsPerWeek = Math.min(7, Math.max(1, input.sessionsPerWeek ?? 3));
  const minutesPerSession = Math.max(15, input.minutesPerSession ?? 90);
  const weekdays: number[] = (input.sessionWeekdays?.length ? input.sessionWeekdays : defaultSessionWeekdays(sessionsPerWeek)).slice().sort((a, b) => a - b);
  const skipHolidays = input.skipHolidays ?? true;
  const startDate = isValidISO(input.startDate) ? input.startDate : todayISO();
  const found = findCalendar(input.calendarCode, input.region);

  const holidays = holidaysBetween(input.calendarCode, startDate, addDays(startDate, input.weeks * 7), {
    region: input.region,
    includeOptional: false
  });

  const weeksPlan: PlannedWeek[] = [];
  const warnings: string[] = [];
  let totalSessions = 0;
  let cursor = startDate;
  // La primera semana termina el domingo de esa misma semana; a partir de ahí
  // todas las semanas van de lunes a domingo, sin solaparse nunca.
  const firstWeekEnd = addDays(startOfWeek(startDate), 6);

  for (let index = 1; index <= input.weeks; index += 1) {
    const weekStart = cursor;
    const weekEnd = index === 1 ? firstWeekEnd : addDays(weekStart, 6);
    const weekHolidays = holidays.filter((holiday) => holiday.date >= weekStart && holiday.date <= weekEnd);
    const holidayDates = new Set(weekHolidays.map((holiday) => holiday.date));
    const kind = kindFor(index, input.weeks, 0);
    const { sessions, lost } = sessionsForWeek(weekStart, weekEnd, weekdays, minutesPerSession, holidayDates, kind, skipHolidays);

    // Cada sesión de la semana recibe su tipo (clase → práctica → laboratorio).
    const typed = sessions.map((session, sessionIndex) => ({ ...session, kind: kindFor(index, input.weeks, sessionIndex) }));
    if (lost > 0) warnings.push(`sessionsMoved:${index}:${lost}`);
    if (index === input.weeks && skipHolidays && holidayDates.size > 0) warnings.push(`examWeekHoliday:${index}`);

    const milestoneKey = milestoneFor(index, input.weeks);
    weeksPlan.push({
      index,
      start: weekStart,
      end: weekEnd,
      minutes: typed.reduce((sum, session) => sum + session.minutes, 0),
      sessions: typed,
      holidays: weekHolidays,
      shortWeek: weekHolidays.length >= 2,
      restWeek: false,
      ...(milestoneKey ? { milestone: { key: milestoneKey, label: milestoneLabel(milestoneKey, locale) } } : {})
    });
    totalSessions += typed.length;
    cursor = addDays(weekEnd, 1);
  }

  const endDate = weeksPlan.at(-1)?.end ?? startDate;
  return {
    kind: "course",
    courseSlug: input.courseSlug,
    courseTitle: input.courseTitle,
    weeks: input.weeks,
    startDate: weeksPlan[0]?.start ?? startDate,
    endDate,
    calendarCode: input.calendarCode,
    calendarCountry: found?.calendar.country ?? input.calendarCode,
    ...(input.region ? { region: input.region } : {}),
    locale,
    sessionsPerWeek,
    minutesPerSession,
    totalHours: Math.round((totalSessions * minutesPerSession) / 60),
    totalSessions,
    holidays,
    weeksPlan,
    warnings,
    generatedAt: new Date().toISOString()
  };
}

/** Ventanas de descanso por defecto según el hemisferio del calendario. */
export function defaultBreakWindows(calendarCode: string, options: { northernHemisphere?: boolean } = {}) {
  const southern = ["BR", "AR", "CL", "PE", "UY"].includes(calendarCode.toUpperCase());
  const northern = options.northernHemisphere ?? !southern;
  if (northern) {
    return [
      { key: "summer" as const, from: "07-15", to: "08-31" },
      { key: "winter" as const, from: "12-23", to: "01-06" }
    ];
  }
  return [
    { key: "summer" as const, from: "12-20", to: "02-05" },
    { key: "winter" as const, from: "07-10", to: "07-31" }
  ];
}

interface BreakWindow {
  key: "summer" | "winter";
  from: string;
  to: string;
}

function intersectsBreak(start: ISODate, end: ISODate, windows: BreakWindow[]): BreakWindow | undefined {
  const years = [Number(start.slice(0, 4)) - 1, Number(start.slice(0, 4)), Number(end.slice(0, 4))];
  for (const window of windows) {
    for (const year of years) {
      const fromDate = `${year}-${window.from}`;
      const toDateRaw = `${window.to < window.from ? year + 1 : year}-${window.to}`;
      if (start <= toDateRaw && end >= fromDate) return window;
    }
  }
  return undefined;
}

export interface ProgramPlanInput {
  courses: { slug: string; title: string; weeks: number }[];
  startDate: ISODate;
  calendarCode: string;
  region?: string;
  locale?: Locale;
  sessionsPerWeek?: number;
  minutesPerSession?: number;
  sessionStartTime?: string;
  /** Respiro obligatorio tras N semanas consecutivas (0 desactiva). */
  maxConsecutiveWeeks?: number;
  breakWindows?: BreakWindow[];
}

export interface ProgramPlanCourse {
  slug: string;
  title: string;
  startDate: ISODate;
  endDate: ISODate;
  weeks: PlannedWeek[];
  totalHours: number;
}

export interface ProgramPlanBreak {
  reason: MilestoneKey;
  start: ISODate;
  end: ISODate;
  label: string;
}

export interface ProgramPlan {
  kind: "program";
  startDate: ISODate;
  endDate: ISODate;
  calendarCode: string;
  calendarCountry: string;
  locale: Locale;
  courses: ProgramPlanCourse[];
  breaks: ProgramPlanBreak[];
  totalHours: number;
  totalWeeks: number;
  warnings: string[];
  generatedAt: string;
}

/**
 * Secuencia varios programas seguidos respetando vacaciones y descansos.
 * Es lo que convierte «20 semanas» en un calendario real para un país concreto.
 */
export function buildProgramPlan(input: ProgramPlanInput): ProgramPlan {
  const locale: Locale = input.locale ?? "es";
  const sessionsPerWeek = Math.min(7, Math.max(1, input.sessionsPerWeek ?? 3));
  const minutesPerSession = Math.max(15, input.minutesPerSession ?? 90);
  const weekdays: number[] = defaultSessionWeekdays(sessionsPerWeek);
  const startDate = isValidISO(input.startDate) ? input.startDate : todayISO();
  const windows = (input.breakWindows ?? defaultBreakWindows(input.calendarCode)) as BreakWindow[];
  const restAfter = input.maxConsecutiveWeeks ?? 16;
  const found = findCalendar(input.calendarCode, input.region);

  const courses: ProgramPlanCourse[] = [];
  const breaks: ProgramPlanBreak[] = [];
  const warnings: string[] = [];
  let cursor = startDate;
  let consecutive = 0;
  let guard = 0;
  let truncated = false;

  for (const course of input.courses) {
    const weeks: PlannedWeek[] = [];
    let index = 1;

    while (index <= course.weeks && !truncated) {
      guard += 1;
      if (guard > 3000) {
        warnings.push("planGuard");
        truncated = true;
        break;
      }

      const weekStart = cursor;
      const weekEnd = index === 1 ? addDays(startOfWeek(cursor), 6) : addDays(weekStart, 6);
      const window = intersectsBreak(weekStart, weekEnd, windows);

      if (window) {
        breaks.push({
          reason: "break",
          start: weekStart,
          end: weekEnd,
          label: `${milestoneLabel("break", locale)} (${window.key})`
        });
        cursor = addDays(weekEnd, 1);
        continue;
      }

      const weekHolidays = holidaysBetween(input.calendarCode, weekStart, weekEnd, {
        region: input.region,
        includeOptional: false
      });
      const holidayDates = new Set(weekHolidays.map((holiday) => holiday.date));
      const { sessions, lost } = sessionsForWeek(weekStart, weekEnd, weekdays, minutesPerSession, holidayDates, "class", true);
      const typed = sessions.map((session, sessionIndex) => ({ ...session, kind: kindFor(index, course.weeks, sessionIndex) }));
      if (lost > 0) warnings.push(`sessionsMoved:${course.slug}:${index}:${lost}`);

      const milestoneKey = milestoneFor(index, course.weeks);
      weeks.push({
        index,
        start: weekStart,
        end: weekEnd,
        minutes: typed.reduce((sum, session) => sum + session.minutes, 0),
        sessions: typed,
        holidays: weekHolidays,
        shortWeek: weekHolidays.length >= 2,
        restWeek: false,
        ...(milestoneKey ? { milestone: { key: milestoneKey, label: milestoneLabel(milestoneKey, locale) } } : {})
      });

      index += 1;
      consecutive += 1;
      cursor = addDays(weekEnd, 1);

      if (restAfter > 0 && consecutive >= restAfter) {
        breaks.push({
          reason: "rest",
          start: cursor,
          end: addDays(cursor, 6),
          label: milestoneLabel("rest", locale)
        });
        cursor = addDays(cursor, 7);
        consecutive = 0;
      }
    }

    courses.push({
      slug: course.slug,
      title: course.title,
      startDate: weeks[0]?.start ?? cursor,
      endDate: weeks.at(-1)?.end ?? cursor,
      weeks,
      totalHours: Math.round((weeks.reduce((sum, week) => sum + week.sessions.length, 0) * minutesPerSession) / 60)
    });
  }

  const endDate = courses.at(-1)?.endDate ?? startDate;
  return {
    kind: "program",
    startDate: courses[0]?.startDate ?? startDate,
    endDate,
    calendarCode: input.calendarCode,
    calendarCountry: found?.calendar.country ?? input.calendarCode,
    locale,
    courses,
    breaks,
    totalHours: courses.reduce((sum, course) => sum + course.totalHours, 0),
    totalWeeks: courses.reduce((sum, course) => sum + course.weeks.length, 0),
    warnings,
    generatedAt: new Date().toISOString()
  };
}

/** Eventos de calendario del plan de un curso (sesiones + festivos + hitos). */
export function studyPlanToIcsEvents(plan: StudyPlan, options: { sessionStartTime?: string } = {}): IcsEvent[] {
  const events: IcsEvent[] = [];
  for (const week of plan.weeksPlan) {
    for (const [index, session] of week.sessions.entries()) {
      events.push({
        uid: `secure-t-${plan.courseSlug}-w${week.index}-s${index + 1}@secure-t`,
        start: session.date,
        time: options.sessionStartTime ?? "18:30",
        minutes: session.minutes,
        summary: `secure T · ${plan.courseTitle} · ${plan.locale === "es" ? `Semana ${week.index}` : `W${week.index}`} (${session.kind})`,
        description: week.milestone ? week.milestone.label : undefined,
        location: "Campus secure T (online)"
      });
    }
    for (const holiday of week.holidays) {
      events.push({
        uid: `holiday-${holiday.key}-${holiday.date}@secure-t`,
        start: holiday.date,
        summary: `${holiday.name}${holiday.movedFrom ? ` (${holiday.movedFrom})` : ""}`
      });
    }
  }
  return events;
}

export function studyPlanToIcs(plan: StudyPlan, options: { sessionStartTime?: string; now?: Date } = {}): string {
  return buildIcs(studyPlanToIcsEvents(plan, options), {
    name: `secure T · ${plan.courseTitle}`,
    description: `Plan de ${plan.weeks} semanas · ${plan.calendarCountry}`,
    ...(options.now ? { now: options.now } : {})
  });
}

export function programPlanToIcs(plan: ProgramPlan, options: { sessionStartTime?: string; now?: Date } = {}): string {
  const events: IcsEvent[] = [];
  for (const course of plan.courses) {
    for (const week of course.weeks) {
      for (const [index, session] of week.sessions.entries()) {
        events.push({
          uid: `secure-t-program-${course.slug}-w${week.index}-s${index + 1}@secure-t`,
          start: session.date,
          time: options.sessionStartTime ?? "18:30",
          minutes: session.minutes,
          summary: `secure T · ${course.title} · W${week.index} (${session.kind})`,
          description: week.milestone?.label,
          location: "Campus secure T (online)"
        });
      }
    }
  }
  for (const pause of plan.breaks) {
    events.push({
      uid: `break-${pause.reason}-${pause.start}@secure-t`,
      start: pause.start,
      summary: pause.label,
      description: `${pause.start} → ${pause.end}`
    });
  }
  return buildIcs(events, {
    name: "secure T · Itinerario completo",
    description: `${plan.totalWeeks} semanas · ${plan.calendarCountry}`,
    ...(options.now ? { now: options.now } : {})
  });
}
