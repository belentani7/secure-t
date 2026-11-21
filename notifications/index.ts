// Pure domain contract for task-completion notifications.
// No DOM, no storage: the browser dispatch layer lives in
// client/src/lib/task-notifications.ts and consumes this module.

export type TaskState = "queued" | "running" | "completed" | "failed" | "cancelled";
export type TaskKind = "lab" | "assessment" | "ai" | "voice" | "system";

export type TaskEvent = {
  id: string;
  kind: TaskKind;
  state: TaskState;
  label: string;
  at: string;
  detail?: string;
};

export type NotificationPreferences = {
  enabled: boolean;
  sound: boolean;
  volume: number;
  kinds: TaskKind[];
  includeFailures: boolean;
};

export const defaultPreferences: NotificationPreferences = {
  enabled: true,
  sound: true,
  volume: 0.7,
  kinds: [],
  includeFailures: true,
};

export function isTerminalState(state: TaskState): boolean {
  return state === "completed" || state === "failed" || state === "cancelled";
}

/** Keep volume inside 0..1; an unparseable value falls back to the default. */
export function clampVolume(volume: number): number {
  if (Number.isNaN(volume)) return defaultPreferences.volume;
  return Math.min(1, Math.max(0, volume));
}

/** De-dup key: the same terminal transition never notifies twice. */
export function notificationKey(event: TaskEvent): string {
  return `${event.id}:${event.state}`;
}

export function shouldNotify(
  event: TaskEvent,
  prefs: NotificationPreferences,
  seen?: ReadonlySet<string>
): { notify: boolean; reason: string } {
  if (!prefs.enabled) return { notify: false, reason: "disabled" };
  if (!isTerminalState(event.state)) return { notify: false, reason: "not_terminal" };
  if (prefs.kinds.length > 0 && !prefs.kinds.includes(event.kind)) {
    return { notify: false, reason: "kind_filtered" };
  }
  if (event.state === "failed" && !prefs.includeFailures) {
    return { notify: false, reason: "failure_suppressed" };
  }
  if (seen?.has(notificationKey(event))) {
    return { notify: false, reason: "already_notified" };
  }
  return { notify: true, reason: "ok" };
}

export function describeTask(event: TaskEvent): {
  title: string;
  body: string;
  tone: "success" | "error" | "neutral";
} {
  switch (event.state) {
    case "completed":
      return {
        title: "Tarea completada",
        body: event.detail ?? `${event.label} — evidencia registrada.`,
        tone: "success",
      };
    case "failed":
      return {
        title: "Tarea fallida",
        body: event.detail ?? `${event.label} — revisa los registros del entorno.`,
        tone: "error",
      };
    case "cancelled":
      return {
        title: `${event.label} cancelado`,
        body: event.detail ?? "La ejecución se detuvo antes de finalizar.",
        tone: "neutral",
      };
    default:
      return {
        title: "Tarea en curso",
        body: event.label,
        tone: "neutral",
      };
  }
}
