// Browser dispatch layer for task-completion notifications.
// Wraps the Notification API + a WebAudio chime. Every call is guarded and
// non-blocking: a missing API, a denied permission or an autoplay block never
// throws into the caller.

import {
  clampVolume,
  defaultPreferences,
  describeTask,
  notificationKey,
  shouldNotify,
  type NotificationPreferences,
  type TaskEvent,
} from "@notifications";

const STORAGE_KEY = "secure-t.notifications.preferences";

export type PermissionState = "unsupported" | "default" | "granted" | "denied";

export function isSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getPermission(): PermissionState {
  if (!isSupported()) return "unsupported";
  return Notification.permission as PermissionState;
}

export async function requestPermission(): Promise<PermissionState> {
  if (!isSupported()) return "unsupported";
  if (Notification.permission !== "default")
    return Notification.permission as PermissionState;
  try {
    return (await Notification.requestPermission()) as PermissionState;
  } catch {
    return getPermission();
  }
}

export function loadPreferences(): NotificationPreferences {
  if (typeof localStorage === "undefined") return { ...defaultPreferences };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultPreferences };
    const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
    return {
      ...defaultPreferences,
      ...parsed,
      volume: clampVolume(Number(parsed.volume ?? defaultPreferences.volume)),
      kinds: Array.isArray(parsed.kinds)
        ? parsed.kinds
        : defaultPreferences.kinds,
    };
  } catch {
    return { ...defaultPreferences };
  }
}

export function savePreferences(prefs: NotificationPreferences): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* storage full or blocked — preferences stay in memory only */
  }
}

// --- sound -----------------------------------------------------------------

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  return audioCtx;
}

/** Short two-note chime for success, single low note for failure. */
export function playChime(
  tone: "success" | "error" | "neutral",
  volume: number
): void {
  const ac = ctx();
  if (!ac) return;
  try {
    if (ac.state === "suspended") void ac.resume();
    const gain = clampVolume(volume) * 0.2;
    const notes =
      tone === "success" ? [660, 990] : tone === "error" ? [300, 220] : [520];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const start = ac.currentTime + i * 0.14;
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(gain, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      osc.connect(g).connect(ac.destination);
      osc.start(start);
      osc.stop(start + 0.32);
    });
  } catch {
    /* audio blocked — silent */
  }
}

// --- dispatch --------------------------------------------------------------

const dispatched = new Set<string>();

export interface DispatchResult {
  notified: boolean;
  reason: string;
}

/**
 * Show a browser notification + play the chime for a terminal task transition.
 * De-duplicates on `${id}:${state}` for the lifetime of the page.
 */
export function notifyTask(
  event: TaskEvent,
  prefs: NotificationPreferences
): DispatchResult {
  const decision = shouldNotify(event, prefs, dispatched);
  if (!decision.notify) return { notified: false, reason: decision.reason };

  dispatched.add(notificationKey(event));
  const content = describeTask(event);

  if (prefs.sound) playChime(content.tone, prefs.volume);

  if (isSupported() && Notification.permission === "granted") {
    try {
      const n = new Notification(content.title, {
        body: content.body,
        tag: `secure-t-task-${event.id}`,
        renotify: false,
      } as NotificationOptions);
      n.onclick = () => {
        window.focus();
        n.close();
      };
    } catch {
      return { notified: false, reason: "notification_construct_failed" };
    }
    return { notified: true, reason: "dispatch" };
  }

  return {
    notified: prefs.sound,
    reason: prefs.sound ? "sound_only" : "no_permission",
  };
}

/** Fire a sample notification so the user can verify permission + sound. */
export function testNotification(
  prefs: NotificationPreferences
): DispatchResult {
  const sample: TaskEvent = {
    id: `test-${Date.now()}`,
    kind: "system",
    state: "completed",
    label: "Notificación de prueba",
    at: new Date().toISOString(),
    detail: "Así se verá cuando una tarea termine",
  };
  return notifyTask(sample, prefs);
}

/** Testing/HMR aid: clear the page-lifetime de-dup set. */
export function resetDispatchCache(): void {
  dispatched.clear();
}
