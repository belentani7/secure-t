// Notifications domain contract.
// Pure and environment-agnostic: no DOM, no timers, no storage. The browser
// layer (client/src/lib/task-notifications.ts) and any future server dispatcher
// build on these types and the shouldNotify policy.

export type TaskState =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type TaskKind = "lab" | "assessment" | "ai" | "voice" | "system";

export interface TaskEvent {
  /** Stable identifier of the task across state transitions. */
  id: string;
  kind: TaskKind;
  state: TaskState;
  /** Human label, e.g. "Triage a suspicious PowerShell alert". */
  label: string;
  /** ISO timestamp of this transition. */
  at: string;
  /** Optional extra line shown in the notification body. */
  detail?: string;
}

export interface NotificationPreferences {
  /** Master switch. When false nothing is dispatched. */
  enabled: boolean;
  /** Play a sound alongside the browser notification. */
  sound: boolean;
  /** 0..1 playback gain for the chime. */
  volume: number;
  /** Only notify for these task kinds. Empty set means "all kinds". */
  kinds: TaskKind[];
  /** Notify on failure/cancellation too, not just success. */
  includeFailures: boolean;
}

export const defaultPreferences: NotificationPreferences = {
  enabled: true,
  sound: true,
  volume: 0.5,
  kinds: [],
  includeFailures: true,
};

export const TERMINAL_STATES: readonly TaskState[] = [
  "completed",
  "failed",
  "cancelled",
];

export function isTerminalState(state: TaskState): boolean {
  return TERMINAL_STATES.includes(state);
}

export function clampVolume(value: number): number {
  if (Number.isNaN(value)) return defaultPreferences.volume;
  return Math.min(1, Math.max(0, value));
}

export interface NotificationDecision {
  notify: boolean;
  reason:
    | "not_terminal"
    | "disabled"
    | "kind_filtered"
    | "failure_suppressed"
    | "already_notified"
    | "dispatch";
}

/**
 * Decide whether a task transition deserves a user-facing notification.
 * Non-blocking by design: callers act on the result, they never wait on it.
 *
 * @param alreadyNotified set of `${id}:${state}` keys already dispatched.
 */
export function shouldNotify(
  event: TaskEvent,
  prefs: NotificationPreferences,
  alreadyNotified: ReadonlySet<string> = new Set()
): NotificationDecision {
  if (!isTerminalState(event.state))
    return { notify: false, reason: "not_terminal" };
  if (!prefs.enabled) return { notify: false, reason: "disabled" };
  if (prefs.kinds.length > 0 && !prefs.kinds.includes(event.kind))
    return { notify: false, reason: "kind_filtered" };
  if (event.state !== "completed" && !prefs.includeFailures)
    return { notify: false, reason: "failure_suppressed" };
  if (alreadyNotified.has(notificationKey(event)))
    return { notify: false, reason: "already_notified" };
  return { notify: true, reason: "dispatch" };
}

export function notificationKey(
  event: Pick<TaskEvent, "id" | "state">
): string {
  return `${event.id}:${event.state}`;
}

export interface NotificationContent {
  title: string;
  body: string;
  tone: "success" | "error" | "neutral";
}

const KIND_LABEL: Record<TaskKind, string> = {
  lab: "Laboratorio",
  assessment: "Evaluación",
  ai: "Asistente IA",
  voice: "Voz",
  system: "Sistema",
};

/** Build the copy shown in the OS notification. Spanish, matches product voice. */
export function describeTask(event: TaskEvent): NotificationContent {
  const scope = KIND_LABEL[event.kind];
  if (event.state === "completed")
    return {
      title: `${scope} completado`,
      body: event.detail
        ? `${event.label} — ${event.detail}`
        : `${event.label} ha terminado.`,
      tone: "success",
    };
  if (event.state === "failed")
    return {
      title: `${scope} con errores`,
      body: event.detail
        ? `${event.label} — ${event.detail}`
        : `${event.label} ha fallado.`,
      tone: "error",
    };
  return {
    title: `${scope} cancelado`,
    body: `${event.label} se ha cancelado.`,
    tone: "neutral",
  };
}
