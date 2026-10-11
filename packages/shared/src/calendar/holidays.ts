import { addDays, easterSunday, lastWeekday, nthWeekday, toISO, weekdayOf, type ISODate } from "./dates";
import { findCalendar, type HolidayDef, type HolidayRule, type ShiftPolicy } from "./countries";

export interface ResolvedHoliday {
  key: string;
  name: string;
  date: ISODate;
  scope: "national" | "regional" | "optional";
  /** Fecha original cuando el festivo se trasladó (p. ej. domingo → lunes). */
  movedFrom?: ISODate;
  /** Motivo del traslado, para poder explicarlo en la interfaz. */
  shiftReason?: ShiftPolicy;
}

const DAY = 1;

export function resolveRule(rule: HolidayRule, year: number): ISODate {
  switch (rule.kind) {
    case "fixed":
      return `${year}-${String(rule.month).padStart(2, "0")}-${String(rule.day).padStart(2, "0")}`;
    case "easter":
      return addDays(easterSunday(year), rule.offset);
    case "nth":
      return nthWeekday(year, rule.month, rule.weekday, rule.n);
    case "lastNth":
      return lastWeekday(year, rule.month, rule.weekday);
  }
}

function applyShift(date: ISODate, policy: ShiftPolicy | undefined, taken: Set<ISODate>): { date: ISODate; moved: boolean } {
  if (!policy || policy === "none") return { date, moved: false };
  const day = weekdayOf(date);
  if (policy === "sundayToMonday") {
    if (day !== 0) return { date, moved: false };
    let candidate = addDays(date, DAY);
    while (taken.has(candidate)) candidate = addDays(candidate, DAY);
    return { date: candidate, moved: true };
  }
  if (policy === "usObserved") {
    if (day === 6) return { date: addDays(date, -DAY), moved: true };
    if (day === 0) return { date: addDays(date, DAY), moved: true };
    return { date, moved: false };
  }
  // ukSubstitute: fin de semana → siguiente día laborable que no sea festivo.
  if (day === 0 || day === 6) {
    let candidate = addDays(date, DAY);
    let guard = 0;
    while ((weekdayOf(candidate) === 0 || weekdayOf(candidate) === 6 || taken.has(candidate)) && guard < 10) {
      candidate = addDays(candidate, DAY);
      guard += 1;
    }
    return { date: candidate, moved: true };
  }
  return { date, moved: false };
}

function defsFor(code: string, region?: string): HolidayDef[] | undefined {
  const found = findCalendar(code, region);
  if (!found) return undefined;
  const regional = found.region ? found.region.holidays.map((h) => ({ ...h, scope: h.scope ?? ("regional" as const) })) : [];
  return [...found.calendar.holidays, ...regional];
}

/**
 * Festivos efectivos de un año, ya resueltos y con los traslados aplicados.
 * Determinista: dos dispositivos distintos obtienen exactamente la misma lista.
 */
export function holidaysFor(
  code: string,
  year: number,
  options: { region?: string; includeOptional?: boolean } = {}
): ResolvedHoliday[] {
  const defs = defsFor(code, options.region);
  if (!defs) return [];
  const includeOptional = options.includeOptional ?? false;
  const taken = new Set<ISODate>();
  const resolved: ResolvedHoliday[] = [];

  for (const def of defs) {
    if (def.scope === "optional" && !includeOptional) continue;
    if (def.since && year < def.since) continue;
    const base = resolveRule(def.rule, year);
    const { date, moved } = applyShift(base, def.shift, taken);
    taken.add(date);
    resolved.push({
      key: def.key,
      name: def.name,
      date,
      scope: def.scope ?? "national",
      ...(moved ? { movedFrom: base, shiftReason: def.shift } : {})
    });
  }

  return resolved.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.key.localeCompare(b.key)));
}

export function holidayOn(code: string, date: ISODate, options: { region?: string; includeOptional?: boolean } = {}): ResolvedHoliday | undefined {
  const year = Number(date.slice(0, 4));
  return holidaysFor(code, year, options).find((holiday) => holiday.date === date);
}

export function holidaysBetween(code: string, from: ISODate, to: ISODate, options: { region?: string; includeOptional?: boolean } = {}): ResolvedHoliday[] {
  const years = new Set([Number(from.slice(0, 4)), Number(to.slice(0, 4))]);
  if (years.size === 2) {
    const [a, b] = [...years].sort();
    for (let y = a + 1; y < b; y += 1) years.add(y);
  }
  return [...years]
    .flatMap((year) => holidaysFor(code, year, options))
    .filter((holiday) => holiday.date >= from && holiday.date <= to)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.key.localeCompare(b.key)));
}

/** Etiqueta legible: `2026-11-02 · Todos los Santos (trasladado de 2026-11-01)`. */
export function describeHoliday(holiday: ResolvedHoliday): string {
  const base = `${holiday.date} · ${holiday.name}`;
  return holiday.movedFrom ? `${base} (${toISO(new Date(holiday.movedFrom))})` : base;
}
