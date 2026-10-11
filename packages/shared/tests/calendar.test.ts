import { describe, expect, it } from "vitest";
import {
  addDays,
  buildProgramPlan,
  buildStudyPlan,
  easterSunday,
  foldLine,
  holidayOn,
  holidaysFor,
  isValidISO,
  nthWeekday,
  programPlanToIcs,
  startOfWeek,
  studyPlanToIcs,
  weekdayOf
} from "../src/index";

describe("aritmética de fechas", () => {
  it("calcula la Pascua gregoriana (2024-2030, valores verificados)", () => {
    expect(easterSunday(2024)).toBe("2024-03-31");
    expect(easterSunday(2025)).toBe("2025-04-20");
    expect(easterSunday(2026)).toBe("2026-04-05");
    expect(easterSunday(2027)).toBe("2027-03-28");
    expect(easterSunday(2028)).toBe("2028-04-16");
    expect(easterSunday(2029)).toBe("2029-04-01");
    expect(easterSunday(2030)).toBe("2030-04-21");
  });

  it("resuelve enésimos y últimos días de la semana", () => {
    expect(nthWeekday(2026, 11, 4, 4)).toBe("2026-11-26"); // Acción de gracias
    expect(nthWeekday(2026, 1, 1, 3)).toBe("2026-01-19"); // MLK
    expect(weekdayOf("2026-11-26")).toBe(4);
  });

  it("valida fechas ISO y falla con las imposibles", () => {
    expect(isValidISO("2026-02-28")).toBe(true);
    expect(isValidISO("2026-02-30")).toBe(false);
    expect(isValidISO("2026-2-3")).toBe(false);
    expect(isValidISO("hola")).toBe(false);
  });

  it("alinea semanas al lunes y suma días sin desviarse", () => {
    expect(startOfWeek("2026-01-07")).toBe("2026-01-05");
    expect(startOfWeek("2026-01-05")).toBe("2026-01-05");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("festivos por país", () => {
  it("España: traslada a lunes los festivos que caen en domingo", () => {
    const holidays = holidaysFor("ES", 2026);
    const dates = holidays.map((holiday) => holiday.date);
    expect(dates).toContain("2026-01-01");
    expect(dates).toContain("2026-04-03"); // Viernes Santo
    expect(dates).toContain("2026-01-06");
    // 2026-11-01 y 2026-12-06 caen en domingo → pasan al lunes
    expect(dates).toContain("2026-11-02");
    expect(dates).toContain("2026-12-07");
    expect(dates).not.toContain("2026-11-01");
    const moved = holidayOn("ES", "2026-11-02");
    expect(moved?.movedFrom).toBe("2026-11-01");
    expect(moved?.shiftReason).toBe("sundayToMonday");
  });

  it("Cataluña añade sus festivos propios sin duplicar los estatales", () => {
    const catalonia = holidaysFor("ES", 2026, { region: "CA" }).map((holiday) => holiday.date);
    expect(catalonia).toContain("2026-06-24"); // Sant Joan
    expect(catalonia).toContain("2026-09-11"); // Diada
    expect(catalonia).toContain("2026-12-26"); // Sant Esteve
    const unique = new Set(catalonia);
    expect(unique.size).toBe(catalonia.length);
  });

  it("Estados Unidos: sábado se observa el viernes y domingo el lunes", () => {
    const holidays = holidaysFor("US", 2026);
    const independence = holidays.find((holiday) => holiday.key === "us.independence");
    expect(independence?.date).toBe("2026-07-03"); // 4 de julio de 2026 = sábado
    expect(independence?.movedFrom).toBe("2026-07-04");
    expect(holidays.find((holiday) => holiday.key === "us.thanksgiving")?.date).toBe("2026-11-26");
    expect(holidays.find((holiday) => holiday.key === "us.mlk")?.date).toBe("2026-01-19");
  });

  it("Reino Unido: Boxing Day en sábado pasa al lunes siguiente", () => {
    const holidays = holidaysFor("GB", 2026);
    const boxing = holidays.find((holiday) => holiday.key === "gb.boxing-day");
    expect(boxing?.date).toBe("2026-12-28");
    expect(boxing?.movedFrom).toBe("2026-12-26");
    expect(holidays.find((holiday) => holiday.key === "gb.christmas")?.date).toBe("2026-12-25");
  });

  it("Portugal y Brasil: no trasladan y no inventan", () => {
    expect(holidaysFor("PT", 2026).map((holiday) => holiday.date)).toContain("2026-11-01"); // domingo, se queda
    const brasil = holidaysFor("BR", 2026);
    expect(brasil.map((holiday) => holiday.date)).toContain("2026-11-20"); // Conciência Negra
    expect(holidaysFor("BR", 2023).map((holiday) => holiday.date)).not.toContain("2023-11-20");
    // Carnaval es punto facultativo: sólo aparece si se pide explícitamente.
    expect(holidaysFor("BR", 2026).some((holiday) => holiday.key === "br.carnaval")).toBe(false);
    expect(holidaysFor("BR", 2026, { includeOptional: true }).some((holiday) => holiday.key === "br.carnaval")).toBe(true);
  });

  it("ordena los festivos y no repite fechas dentro del mismo calendario", () => {
    for (const code of ["ES", "PT", "BR", "GB", "US", "FR", "DE", "IT", "MX", "AR", "CO", "CL", "PE", "UY"]) {
      const holidays = holidaysFor(code, 2026);
      const dates = holidays.map((holiday) => holiday.date);
      expect(dates).toEqual([...dates].sort());
      expect(new Set(dates).size).toBe(dates.length);
    }
  });
});

describe("plan de estudio", () => {
  const base = {
    courseSlug: "ciber-defensiva",
    courseTitle: "Operar como SOC",
    weeks: 20,
    startDate: "2026-01-07",
    calendarCode: "ES",
    region: "CA",
    locale: "es" as const,
    sessionsPerWeek: 3,
    minutesPerSession: 90
  };

  it("produce 20 semanas sin solaparse y con la semana 1 recortada al día de inicio", () => {
    const plan = buildStudyPlan(base);
    expect(plan.weeksPlan).toHaveLength(20);
    expect(plan.startDate).toBe("2026-01-07");
    expect(plan.weeksPlan[0].end).toBe("2026-01-11"); // domingo de esa semana
    for (let index = 1; index < plan.weeksPlan.length; index += 1) {
      expect(plan.weeksPlan[index].start > plan.weeksPlan[index - 1].end).toBe(true);
      expect(weekdayOf(plan.weeksPlan[index].start)).toBe(1); // lunes
    }
    expect(plan.weeksPlan[19].sessions.every((session) => session.kind === "exam")).toBe(true);
    expect(plan.weeksPlan[19].milestone?.key).toBe("exam");
  });

  it("mueve las sesiones que caen en festivo dentro de la misma semana", () => {
    const plan = buildStudyPlan(base);
    const easterWeek = plan.weeksPlan.find((week) => week.holidays.some((holiday) => holiday.key === "es.viernes-santo"));
    expect(easterWeek).toBeDefined();
    const moved = easterWeek!.sessions.find((session) => session.movedFrom);
    expect(moved?.movedFrom).toBe("2026-04-03");
    expect(moved!.date > "2026-04-03").toBe(true);
    expect(moved!.date <= easterWeek!.end).toBe(true);
  });

  it("no coloca ninguna sesión en festivo ni en la semana de vacaciones", () => {
    const plan = buildStudyPlan(base);
    for (const week of plan.weeksPlan) {
      const holidays = new Set(week.holidays.map((holiday) => holiday.date));
      for (const session of week.sessions) expect(holidays.has(session.date)).toBe(false);
    }
  });

  it("calcula horas y sesiones de forma coherente", () => {
    const plan = buildStudyPlan(base);
    expect(plan.totalSessions).toBe(plan.weeksPlan.reduce((sum, week) => sum + week.sessions.length, 0));
    expect(plan.totalHours).toBe(Math.round((plan.totalSessions * 90) / 60));
    expect(plan.totalHours).toBeGreaterThan(80);
  });

  it("marca las semanas cortas cuando hay dos o más festivos", () => {
    const plan = buildStudyPlan(base);
    const short = plan.weeksPlan.filter((week) => week.shortWeek);
    expect(short.every((week) => week.holidays.length >= 2)).toBe(true);
  });

  it("respeta los días elegidos y admite otro reparto", () => {
    const plan = buildStudyPlan({ ...base, sessionsPerWeek: 2, sessionWeekdays: [2, 4] });
    for (const week of plan.weeksPlan.slice(1)) {
      for (const session of week.sessions) expect([2, 4]).toContain(session.weekday);
    }
  });
});

describe("exportación .ics", () => {
  it("genera un calendario válido con CRLF y líneas plegadas a 75 octetos", () => {
    const plan = buildStudyPlan({
      courseSlug: "gobernanza-compliance",
      courseTitle: "Gobernanza y Compliance Digital con un título deliberadamente largo para forzar el plegado de líneas",
      weeks: 20,
      startDate: "2026-02-02",
      calendarCode: "ES",
      locale: "es"
    });
    const ics = studyPlanToIcs(plan, { now: new Date("2026-01-01T00:00:00Z") });
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("BEGIN:VEVENT");
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe((ics.match(/END:VEVENT/g) ?? []).length);
    const lines = ics.split("\r\n");
    expect(lines.length).toBeGreaterThan(40);
    for (const line of lines) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    // Los acentos no se parten por la mitad aunque la línea se pliegue:
    // al desplegar las continuaciones, el título vuelve a estar entero.
    expect(ics.replace(/\r\n /g, "")).toContain("título deliberadamente largo para forzar el plegado");
    expect(ics).toContain("Fiesta del Trabajo");
  });

  it("pliega sin romper caracteres multibyte", () => {
    const line = `SUMMARY:${"Gestión de incidentes con telemetría, evidencias y trazabilidad —".repeat(3)}`;
    const folded = foldLine(line);
    expect(folded).toContain("\r\n ");
    for (const part of folded.split("\r\n")) expect(new TextEncoder().encode(part).length).toBeLessThanOrEqual(75);
    expect(folded.replace(/\r\n /g, "")).toBe(line);
  });

  it("exporta el itinerario completo de cuatro programas", () => {
    const program = buildProgramPlan({
      courses: [
        { slug: "ciber-defensiva", title: "Defensiva", weeks: 20 },
        { slug: "gobernanza-compliance", title: "Gobernanza", weeks: 20 },
        { slug: "ciber-ofensiva", title: "Ofensiva", weeks: 20 },
        { slug: "ia-aplicada-segura", title: "IA segura", weeks: 20 }
      ],
      startDate: "2026-01-05",
      calendarCode: "ES",
      region: "CA",
      locale: "es"
    });
    expect(program.totalWeeks).toBe(80);
    expect(program.breaks.length).toBeGreaterThan(0);
    expect(program.endDate > "2027-06-01").toBe(true);
    const ics = programPlanToIcs(program, { now: new Date("2026-01-01T00:00:00Z") });
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBeGreaterThan(200);
  });

  it("inserta vacaciones de verano e invierno y descansos por carga", () => {
    const program = buildProgramPlan({
      courses: [{ slug: "ciber-ofensiva", title: "Ofensiva", weeks: 20 }],
      startDate: "2026-06-01",
      calendarCode: "ES",
      locale: "es",
      maxConsecutiveWeeks: 8
    });
    const summerBreak = program.breaks.find((pause) => pause.reason === "break");
    expect(summerBreak).toBeDefined();
    expect(program.breaks.some((pause) => pause.reason === "rest")).toBe(true);
    // Las vacaciones se colocan dentro de la ventana de verano.
    expect(summerBreak!.start.slice(5) >= "07-10").toBe(true);
  });

  it("usa el calendario austral para los países del hemisferio sur", () => {
    const program = buildProgramPlan({
      courses: [{ slug: "ciber-defensiva", title: "Defensiva", weeks: 20 }],
      startDate: "2026-03-02",
      calendarCode: "BR",
      locale: "pt",
      maxConsecutiveWeeks: 0
    });
    const winterBreak = program.breaks.find((pause) => pause.label.includes("winter"));
    expect(winterBreak).toBeDefined();
    expect(winterBreak!.start.slice(5) >= "07-05").toBe(true);
    expect(winterBreak!.start.slice(5) <= "08-10").toBe(true);
  });
});
