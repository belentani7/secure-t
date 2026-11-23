import { campusItems, courseProgress, isDone, type ProgressState } from "./progress";

/** Accepts the generated curriculum shape without copying course data or inventing achievements. */
export type PortalProgram = {
  slug: string;
  title: string;
  description: string;
  weeks: readonly { number: number; title: string; objective: string }[];
  resources: readonly { label: string; url: string }[];
  links: { course: string };
};

export type SearchResult = {
  kind: "program" | "week" | "source";
  title: string;
  subtitle: string;
  href: string;
};

const fold = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();

const localUrl = (path: string) => "/" + path.replace(/^\/+/, "");

/**
 * Searches real course descriptions, individual learning weeks and curated
 * reference links. No remote search service, user tracking or fabricated data.
 */
export function searchCampusCatalog(
  programs: readonly PortalProgram[],
  query: string,
  maxResults = 40,
): SearchResult[] {
  const needle = fold(query.trim());
  if (!needle || maxResults <= 0) return [];
  const results: SearchResult[] = [];
  const add = (result: SearchResult) => {
    if (results.length < maxResults) results.push(result);
  };
  for (const program of programs) {
    if (results.length >= maxResults) break;
    if (fold(program.title + " " + program.description).includes(needle)) {
      add({ kind: "program", title: program.title, subtitle: program.description,
        href: localUrl(program.links.course) });
    }
    for (const week of program.weeks) {
      if (fold(week.title + " " + week.objective).includes(needle)) {
        add({ kind: "week", title: week.title, subtitle: program.title,
          href: localUrl(program.links.course) + "#semana-" + week.number });
      }
    }
    for (const resource of program.resources) {
      if (fold(resource.label + " " + program.title).includes(needle)
          && /^https:\/\//i.test(resource.url)) {
        add({ kind: "source", title: resource.label, subtitle: program.title,
          href: resource.url });
      }
    }
  }
  return results;
}

/** Browser-marked progress is self-reported, never proof of certification. */
export function realLearningRecord(programs: readonly PortalProgram[], state: ProgressState) {
  return programs.map(program => {
    const progress = courseProgress(state, program.slug, campusItems(program.weeks.length));
    const completedWeeks = program.weeks.filter(week =>
      isDone(state, program.slug, "semana-" + String(week.number).padStart(2, "0"))
    ).length;
    return {
      slug: program.slug,
      title: program.title,
      ...progress,
      completedWeeks,
      totalWeeks: program.weeks.length,
      href: localUrl(program.links.course),
    };
  });
}
