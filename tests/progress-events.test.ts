import { describe, expect, it } from "vitest";
import { completedProgressEvents } from "../client/src/lib/progress-events";

const programs = [{
  slug: "seguridad",
  title: "Seguridad digital",
  weeks: [{ number: 1, title: "Introducción" }, { number: 2, title: "Análisis" }],
}];

describe("real browser campus completion events", () => {
  it("does not replay past completions when a page loads", () => {
    const state = { "seguridad/semana-01": true };
    expect(completedProgressEvents(state, state, programs)).toEqual([]);
  });
  it("does not notify for unrecognized keys or unchecked items", () => {
    expect(completedProgressEvents({}, { "other/quiz": true, "seguridad/semana-01": false }, programs)).toEqual([]);
  });
  it("creates an event for each actual newly checked course item", () => {
    const events = completedProgressEvents(
      { "seguridad/semana-01": true },
      { "seguridad/semana-01": true, "seguridad/semana-02": true, "seguridad/examen": true },
      programs,
      "2026-11-23T20:00:00.000Z"
    );
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({ label: "Seguridad digital · Análisis", kind: "lab", state: "completed" });
    expect(events[1]).toMatchObject({ kind: "assessment", at: "2026-11-23T20:00:00.000Z" });
  });
});
