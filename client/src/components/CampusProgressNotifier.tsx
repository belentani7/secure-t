import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CAMPUS_PROGRAMS } from "@/data/campus.generated";
import { CAMPUS_PROGRESS_EVENT } from "@/hooks/useCampusProgress";
import { CAMPUS_PROGRESS_KEY, normalizeProgress, parseProgress, type ProgressState } from "@/lib/progress";
import { completedProgressEvents } from "@/lib/progress-events";
import { loadPreferences, notifyTask } from "@/lib/task-notifications";

function readProgress(): ProgressState {
  try {
    return parseProgress(window.localStorage.getItem(CAMPUS_PROGRESS_KEY));
  } catch {
    return {};
  }
}

/**
 * Mounted above the router, so actual study completions can be announced from
 * any SECURE T route, not merely from the notifications settings page.
 */
export default function CampusProgressNotifier() {
  const previous = useRef<ProgressState>({});

  useEffect(() => {
    previous.current = readProgress();
    const deliver = (next: ProgressState) => {
      const events = completedProgressEvents(previous.current, next, CAMPUS_PROGRAMS);
      previous.current = next;
      if (!events.length) return;
      const prefs = loadPreferences();
      if (!prefs.enabled) return;
      for (const event of events) {
        notifyTask(event, prefs);
        toast.success("Actividad completada", { description: event.label });
      }
    };

    const onLocal = (event: Event) => {
      const custom = event as CustomEvent<ProgressState>;
      deliver(normalizeProgress(custom.detail));
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === CAMPUS_PROGRESS_KEY) deliver(parseProgress(event.newValue));
    };

    window.addEventListener(CAMPUS_PROGRESS_EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CAMPUS_PROGRESS_EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}
