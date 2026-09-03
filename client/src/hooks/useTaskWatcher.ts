import { useEffect, useRef } from "react";

import {
  isTerminalState,
  type TaskEvent,
  type TaskState,
} from "@notifications";

type NotifyFn = (event: TaskEvent) => void;

/**
 * Watches a list of tasks and fires `notify` once, when a task first crosses
 * into a terminal state (completed / failed / cancelled). Re-renders with the
 * same terminal state do not re-notify; the dispatch layer also de-dups.
 */
export function useTaskWatcher(tasks: TaskEvent[], notify: NotifyFn): void {
  const seen = useRef(new Map<string, TaskState>());

  useEffect(() => {
    for (const task of tasks) {
      const prev = seen.current.get(task.id);
      if (prev === task.state) continue;
      seen.current.set(task.id, task.state);
      if (!prev && isTerminalState(task.state)) {
        // Task appeared already finished (e.g. hydrated from history) — skip.
        continue;
      }
      if (isTerminalState(task.state)) notify(task);
    }
  }, [tasks, notify]);
}
