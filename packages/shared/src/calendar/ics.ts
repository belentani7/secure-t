import type { ISODate } from "./dates";

/**
 * Generador iCalendar (RFC 5545) sin dependencias.
 * Se usa para exportar el plan a Google/Apple/Outlook: el estudiante decide
 * si quiere su calendario fuera del campus, pero el campus nunca necesita red.
 */

export interface IcsEvent {
  uid: string;
  start: ISODate;
  /** Si se indica hora (`HH:MM`) el evento es puntual; si no, dura todo el día. */
  time?: string;
  minutes?: number;
  summary: string;
  description?: string;
  location?: string;
  /** Minutos de aviso previo (por defecto 30). */
  alarmMinutes?: number;
}

/** Escapa texto según RFC 5545 §3.3.11. */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Pliega líneas a 75 octetos según RFC 5545 §3.1.
 * Usa `TextEncoder` (isomorfo: navegador y Node) y nunca parte un carácter
 * multibyte, así que el .ics sigue siendo válido con acentos y emoji.
 */
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 74 && current.length) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  if (current.length) parts.push(current);
  return parts.map((part, index) => (index === 0 ? part : ` ${part}`)).join("\r\n");
}

function addMinutesToTime(time: string, minutes: number): string {
  const [h = 0, m = 0] = time.split(":").map(Number);
  const total = (h * 60 + m + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}${String(total % 60).padStart(2, "0")}00`;
}

function stamp(date = new Date()): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function buildIcs(events: IcsEvent[], options: { name: string; description?: string; now?: Date } = { name: "secure T" }): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//secure T//Campus//PT,ES,EN,CA//",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(options.name)}`
  ];
  if (options.description) lines.push(`X-WR-CALDESC:${escapeText(options.description)}`);
  const now = stamp(options.now);

  for (const event of events) {
    const compact = event.start.replace(/-/g, "");
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${escapeText(event.uid)}`);
    lines.push(`DTSTAMP:${now}`);
    if (event.time) {
      const [h = "00", m = "00"] = event.time.split(":");
      lines.push(`DTSTART:${compact}T${h.padStart(2, "0")}${m.padStart(2, "0")}00`);
      lines.push(`DTEND:${compact}T${addMinutesToTime(event.time, event.minutes ?? 60)}`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${compact}`);
      lines.push(`DTEND;VALUE=DATE:${event.start.replace(/-/g, "")}`);
    }
    lines.push(`SUMMARY:${escapeText(event.summary)}`);
    if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
    if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
    if (event.time) {
      lines.push("BEGIN:VALARM");
      lines.push(`TRIGGER:-PT${event.alarmMinutes ?? 30}M`);
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:${escapeText(event.summary)}`);
      lines.push("END:VALARM");
    }
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}
