/**
 * Aritmética de fechas en UTC, sin dependencias ni zonas horarias ocultas.
 * Trabajar en UTC evita que un navegador en Madrid y otro en São Paulo
 * calculen semanas distintas para el mismo día.
 */

export type ISODate = string;

const DAY_MS = 86_400_000;

export function fromISO(iso: ISODate): Date {
  const [y = 1970, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(date: Date): ISODate {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: ISODate, days: number): ISODate {
  return toISO(new Date(fromISO(iso).getTime() + days * DAY_MS));
}

export function diffDays(a: ISODate, b: ISODate): number {
  return Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / DAY_MS);
}

/** 0 = domingo … 6 = sábado (igual que `Date.getUTCDay`). */
export function weekdayOf(iso: ISODate): number {
  return fromISO(iso).getUTCDay();
}

export function yearOf(iso: ISODate): number {
  return fromISO(iso).getUTCFullYear();
}

/** Lunes de la semana ISO que contiene `iso`. */
export function startOfWeek(iso: ISODate): ISODate {
  const day = weekdayOf(iso);
  const delta = day === 0 ? -6 : 1 - day;
  return addDays(iso, delta);
}

export function todayISO(now: Date = new Date()): ISODate {
  return toISO(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

export function isValidISO(value: unknown): value is ISODate {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y = 0, m = 0, d = 0] = value.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  return toISO(fromISO(value)) === value;
}

/**
 * Domingo de Pascua (calendario gregoriano) — algoritmo de Meeus/Jones/Butcher.
 * Verificado para 2024–2030 en `tests/calendar.test.ts`.
 */
export function easterSunday(year: number): ISODate {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Enésimo `weekday` (0-6) de un mes, contando desde el principio (n ≥ 1). */
export function nthWeekday(year: number, month: number, weekday: number, n: number): ISODate {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return toISO(new Date(Date.UTC(year, month - 1, 1 + offset + (n - 1) * 7)));
}

/** Último `weekday` (0-6) de un mes. */
export function lastWeekday(year: number, month: number, weekday: number): ISODate {
  const last = new Date(Date.UTC(year, month, 0));
  const offset = (last.getUTCDay() - weekday + 7) % 7;
  return toISO(new Date(Date.UTC(year, month, 0 - offset)));
}

/** Etiqueta corta localizada tipo "lun 9 feb". */
export function formatShort(iso: ISODate, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(fromISO(iso));
  } catch {
    return iso;
  }
}
