import { campusItems, type ProgressState } from "./progress";
import type { TaskEvent } from "../../../notifications/index";

type CampusEventProgram = {
  slug: string;
  title: string;
  weeks: readonly { number: number; title: string }[];
};

/** Create events only for a genuine false-to-true transition in the real curriculum. */
export function completedProgressEvents(
  previous: ProgressState,
  current: ProgressState,
  programs: readonly CampusEventProgram[],
  at = new Date().toISOString(),
): TaskEvent[] {
  const events: TaskEvent[] = [];
  for (const program of programs) {
    for (const item of campusItems(program.weeks.length)) {
      const id = program.slug + "/" + item;
      if (previous[id] === true || current[id] !== true) continue;
      const week = program.weeks.find(entry =>
        "semana-" + String(entry.number).padStart(2, "0") === item
      );
      events.push({
        id: "campus-progress-" + id,
        kind: item === "quiz" || item === "examen" ? "assessment" : "lab",
        label: program.title + " · " + (week?.title || item),
        detail: program.title + " · " + (week?.title || item),
        state: "completed",
        at,
      });
    }
  }
  return events;
}
