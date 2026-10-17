import { describe, expect, it } from "vitest";

import {
  clampVolume,
  defaultPreferences,
  describeTask,
  isTerminalState,
  notificationKey,
  shouldNotify,
  type TaskEvent,
} from "../notifications";

const event = (over: Partial<TaskEvent> = {}): TaskEvent => ({
  id: "t1",
  kind: "lab",
  state: "completed",
  label: "Triage alert",
  at: "2026-09-03T00:00:00.000Z",
  ...over,
});

describe("notifications policy", () => {
  it("marks terminal states", () => {
    expect(isTerminalState("completed")).toBe(true);
    expect(isTerminalState("failed")).toBe(true);
    expect(isTerminalState("running")).toBe(false);
  });

  it("notifies on a fresh completed task", () => {
    expect(shouldNotify(event(), defaultPreferences).notify).toBe(true);
  });

  it("does not notify for non-terminal transitions", () => {
    expect(
      shouldNotify(event({ state: "running" }), defaultPreferences).reason
    ).toBe("not_terminal");
  });

  it("respects the master switch", () => {
    expect(
      shouldNotify(event(), { ...defaultPreferences, enabled: false }).reason
    ).toBe("disabled");
  });

  it("filters by task kind when kinds is non-empty", () => {
    const prefs = { ...defaultPreferences, kinds: ["assessment" as const] };
    expect(shouldNotify(event({ kind: "lab" }), prefs).reason).toBe(
      "kind_filtered"
    );
    expect(shouldNotify(event({ kind: "assessment" }), prefs).notify).toBe(
      true
    );
  });

  it("suppresses failures when includeFailures is off", () => {
    const prefs = { ...defaultPreferences, includeFailures: false };
    expect(shouldNotify(event({ state: "failed" }), prefs).reason).toBe(
      "failure_suppressed"
    );
    expect(shouldNotify(event({ state: "completed" }), prefs).notify).toBe(
      true
    );
  });

  it("de-dups on id + state", () => {
    const seen = new Set([notificationKey(event())]);
    expect(shouldNotify(event(), defaultPreferences, seen).reason).toBe(
      "already_notified"
    );
  });

  it("clamps volume into 0..1", () => {
    expect(clampVolume(2)).toBe(1);
    expect(clampVolume(-1)).toBe(0);
    expect(clampVolume(Number.NaN)).toBe(defaultPreferences.volume);
  });

  it("builds Spanish copy per outcome", () => {
    expect(describeTask(event()).tone).toBe("success");
    expect(describeTask(event({ state: "failed" })).tone).toBe("error");
    expect(describeTask(event({ state: "cancelled" })).title).toContain(
      "cancelado"
    );
  });
});
