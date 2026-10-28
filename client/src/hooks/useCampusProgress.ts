import { useCallback, useEffect, useState } from "react";
import {
  CAMPUS_PROGRESS_KEY,
  parseProgress,
  serializeProgress,
  toggleProgress,
  type ProgressState,
} from "../lib/progress";

function readLocal(): ProgressState {
  if (typeof window === "undefined") return {};
  try {
    return parseProgress(window.localStorage.getItem(CAMPUS_PROGRESS_KEY));
  } catch {
    return {};
  }
}

export function useCampusProgress() {
  const [state, setState] = useState<ProgressState>(readLocal);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CAMPUS_PROGRESS_KEY) setState(parseProgress(event.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: ProgressState) => {
    setState(next);
    try {
      window.localStorage.setItem(CAMPUS_PROGRESS_KEY, serializeProgress(next));
    } catch {
      /* storage blocked: keep the session state */
    }
  }, []);

  const toggle = useCallback(
    (slug: string, item: string, done: boolean) => {
      save(toggleProgress(state, slug, item, done));
    },
    [save, state],
  );

  return { state, save, toggle };
}
