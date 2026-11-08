import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Map as MapIcon,
  Search,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Link } from "wouter";

import SiteHeader from "../components/SiteHeader";
import { CAMPUS_PROGRAMS } from "../data/campus.generated";
import { useCampusProgress } from "../hooks/useCampusProgress";
import { campusItems, courseProgress, isDone } from "../lib/progress";
import { useTranslation } from "@/lib/i18n";

const TOOLS = [
  {
    icon: Terminal,
    title: "campus.tools.soc_workstation.title",
    text: "campus.tools.soc_workstation.text",
    href: "campus/full/workstation/",
    action: "campus.tools.soc_workstation.action",
  },
  {
    icon: Activity,
    title: "campus.tools.mission_control.title",
    text: "campus.tools.mission_control.text",
    href: "campus/full/workstation/mission.html",
    action: "campus.tools.mission_control.action",
  },
  {
    icon: MapIcon,
    title: "campus.tools.observatory.title",
    text: "campus.tools.observatory.text",
    href: "campus/full/observatorio/",
    action: "campus.tools.observatory.action",
  },
  {
    icon: Activity,
    title: "campus.tools.triage_lab.title",
    text: "campus.tools.triage_lab.text",
    href: "campus/full/academia/triage.html",
    action: "campus.tools.triage_lab.action",
  },
  {
    icon: ShieldCheck,
    title: "campus.tools.threat_model.title",
    text: "campus.tools.threat_model.text",
    href: "campus/full/academia/threat-studio.html",
    action: "campus.tools.threat_model.action",
  },
  {
    icon: ShieldCheck,
    title: "campus.tools.open_threats.title",
    text: "campus.tools.open_threats.text",
    href: "campus/full/amenazas.html",
    action: "campus.tools.open_threats.action",
  },
  {
    icon: Search,
    title: "campus.tools.search.title",
    text: "campus.tools.search.text",
    href: "campus/full/buscar.html",
    action: "campus.tools.search.action",
  },
  {
    icon: GraduationCap,
    title: "campus.tools.academy.title",
    text: "campus.tools.academy.text",
    href: "campus/full/academia/",
    action: "campus.tools.academy.action",
  },
] as const;

export default function Campus() {
  const { t } = useTranslation();
  const { state } = useCampusProgress();

  const totalWeeks = CAMPUS_PROGRAMS.reduce(
    (total, program) => total + program.weeks.length,
    0,
  );
  const totalHours = CAMPUS_PROGRAMS.reduce(
    (total, program) => total + program.hours,
    0,
  );
  const totalItems = CAMPUS_PROGRAMS.reduce(
    (total, program) => total + campusItems(program.weeks.length).length,
    0,
  );
  const completedItems = CAMPUS_PROGRAMS.reduce((total, program) => {
    const items = campusItems(program.weeks.length);
    return total + courseProgress(state, program.slug, items).done;
  }, 0);
  const globalPercent = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  const resources = [
    ...new Map(
      CAMPUS_PROGRAMS.flatMap(program =>
        program.resources.map(resource => [resource.url, resource]),
      ),
    ).values(),
  ].slice(0, 12);

  return (
    <div className="min-h-screen bg-[#071016] text-[#f3f7f3]">
      <a
        href="#campus-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#b8f36b] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#071016]"
      >
        {t("skip.content")}
      </a>
      <SiteHeader />

      <main id="campus-main">
        <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-8 lg:pb-24 lg:pt-24">
          <div>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[.94] tracking-[-.04em] sm:text-7xl">
              {t("campus.hero.title")}
              <br />
              <span className="text-[#b8f36b]">{t("campus.hero.sub")}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              {t("campus.intro")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#programs"
                className="inline-flex items-center gap-2 rounded-xl bg-[#b8f36b] px-5 py-3.5 text-sm font-bold text-[#071016] transition hover:bg-[#d0ff9a]"
              >
                {t("campus.browse_programs")} <ArrowUpRight className="size-4" />
              </a>
              <Link
                href="/progress"
                className="rounded-xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5"
              >
                {t("campus.continue_left_off")}
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 text-sm">
            <div>
              <dt className="text-white/60">{t("campus.stats.programs")}</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-white">
                {CAMPUS_PROGRAMS.length}
              </dd>
            </div>
            <div>
              <dt className="text-white/60">{t("campus.stats.weeks")}</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-white">
                {totalWeeks}
              </dd>
            </div>
            <div>
              <dt className="text-white/60">{t("campus.stats.hours")}</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-white">
                {totalHours}
              </dd>
            </div>
            <div>
              <dt className="text-white/60">{t("campus.stats.local_progress")}</dt>
              <dd className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-[#b8f36b]">
                  {globalPercent}%
                </span>
                <span className="text-white/50">
                  {completedItems}/{totalItems}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <nav
          aria-label={t("campus.nav.label")}
          className="border-y border-white/10"
        >
          <ul className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-3 text-sm text-white/70 lg:px-8">
            <li>
              <a href="#programs" className="hover:text-white">
                {t("campus.nav.programs")}
              </a>
            </li>
            <li>
              <a href="#tools" className="hover:text-white">
                {t("campus.nav.tools")}
              </a>
            </li>
            <li>
              <a href="#sources" className="hover:text-white">
                {t("campus.nav.sources")}
              </a>
            </li>
            <li>
              <a href="#evidence" className="hover:text-white">
                {t("campus.nav.evidence")}
              </a>
            </li>
          </ul>
        </nav>

        <section id="programs" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-[-.04em] sm:text-5xl">
              {t("campus.programs.heading")}
            </h2>
            <p className="mt-4 text-white/70">{t("campus.programs.sub")}</p>
          </div>

          <ol className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {CAMPUS_PROGRAMS.map((program, index) => {
              const items = campusItems(program.weeks.length);
              const progress = courseProgress(state, program.slug, items);
              return (
                <li key={program.slug} id={program.slug} className="scroll-mt-24 py-10">
                  <article className="grid gap-8 lg:grid-cols-[3rem_1fr_18rem]">
                    <p className="font-mono text-sm text-[#b8f36b]">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <div>
                      <h3 className="max-w-2xl font-display text-2xl font-bold leading-tight sm:text-3xl">
                        {program.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                        {program.description}
                      </p>

                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-semibold text-white/75">
                            {t("campus.objectives")}
                          </h4>
                          <ul className="mt-3 space-y-2 text-sm text-white/70">
                            {program.objectives.map(objective => (
                              <li key={objective} className="flex gap-2">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#49dce8]" />
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white/75">
                            {t("campus.assessment")}
                          </h4>
                          <ul className="mt-3 space-y-2 text-sm text-white/70">
                            {program.assessment.map(item => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <details className="group mt-8 border-t border-white/10 pt-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white/80">
                          <span>
                            {t("campus.see_weeks", { count: program.weeks.length })}
                          </span>
                          <span className="text-[#b8f36b] group-open:hidden">
                            {t("campus.open")}
                          </span>
                          <span className="hidden text-[#b8f36b] group-open:inline">
                            {t("campus.close")}
                          </span>
                        </summary>
                        <ol className="mt-4 divide-y divide-white/5">
                          {program.weeks.map(week => {
                            const id = `semana-${String(week.number).padStart(2, "0")}`;
                            const done = isDone(state, program.slug, id);
                            return (
                              <li
                                key={week.number}
                                className="grid gap-2 py-3 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline"
                              >
                                <span className="font-mono text-xs text-white/60">
                                  W{String(week.number).padStart(2, "0")}
                                </span>
                                <div>
                                  <a
                                    href={`${program.links.course}#semana-${week.number}`}
                                    className="text-sm font-semibold text-white/80 underline-offset-4 hover:text-[#b8f36b] hover:underline"
                                  >
                                    {week.title}
                                  </a>
                                  <p className="mt-1 max-w-3xl text-xs leading-relaxed text-white/60">
                                    {week.objective}
                                  </p>
                                </div>
                                <span
                                  className={`text-xs ${
                                    done ? "text-[#b8f36b]" : "text-white/25"
                                  }`}
                                >
                                  {done ? t("campus.done") : t("campus.not_started")}
                                </span>
                              </li>
                            );
                          })}
                        </ol>
                      </details>
                    </div>

                    <aside className="self-start border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                      <p className="text-sm text-white/60">
                        {program.hours} {t("campus.hours_label", { hours: program.hours, lang: program.language })}
                      </p>
                      <div className="mt-3">
                        <div
                          className="h-1.5 overflow-hidden rounded-full bg-white/10"
                          role="progressbar"
                          aria-valuenow={progress.percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${program.title} progress`}
                        >
                          <div
                            className="h-full rounded-full bg-[#b8f36b]"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-white/60">
                          {progress.done}/{progress.total} items ·{" "}
                          {progress.percent}%
                        </p>
                      </div>
                      <div className="mt-5 flex flex-col gap-2 text-sm">
                        <a
                          href={program.links.course}
                          className="inline-flex items-center gap-2 font-semibold text-[#b8f36b] hover:underline"
                        >
                          {t("campus.open_course")} <ArrowUpRight className="size-4" />
                        </a>
                        <a
                          href={`${program.links.course}#quiz`}
                          className="text-white/60 hover:text-white"
                        >
                          {t("campus.quiz")}
                        </a>
                        <a
                          href={`${program.links.course}#rubrica`}
                          className="text-white/60 hover:text-white"
                        >
                          {t("campus.rubric")}
                        </a>
                        <a
                          href={`${program.links.course}#glosario`}
                          className="text-white/60 hover:text-white"
                        >
                          {t("campus.glossary")}
                        </a>
                        <a
                          href={`${program.links.course}#examen`}
                          className="text-white/60 hover:text-white"
                        >
                          {t("campus.final_exam")}
                        </a>
                        <Link
                          href="/progress"
                          className="mt-2 text-white/60 hover:text-white"
                        >
                          {t("campus.mark_progress")}
                        </Link>
                      </div>
                      <div className="mt-6 border-t border-white/10 pt-4">
                        <p className="flex items-center gap-2 text-xs font-semibold text-white/60">
                          <FlaskConical className="size-4 text-[#49dce8]" />{" "}
                          {program.lab.title}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-white/60">
                          {program.lab.intro}
                        </p>
                        <a
                          href={`${program.links.course}#laboratorio`}
                          className="mt-3 inline-flex text-xs font-semibold text-[#49dce8] hover:underline"
                        >
                          {t("campus.open_lab")}
                        </a>
                      </div>
                    </aside>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          id="tools"
          className="border-y border-white/10 bg-[#0b171d]/70 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-display text-4xl font-bold tracking-[-.04em] sm:text-5xl">
                {t("campus.tools_heading")}
              </h2>
              <p className="mt-4 text-white/70">{t("campus.tools_sub")}</p>
            </div>
            <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {TOOLS.map(tool => {
                const Icon = tool.icon;
                return (
                  <li key={tool.href}>
                    <a
                      href={tool.href}
                      className="group flex flex-wrap items-center gap-4 py-5 transition hover:bg-white/[.02]"
                    >
                      <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-[#b8f36b]">
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-white/85">
                          {t(tool.title)}
                        </span>
                        <span className="mt-1 block text-sm text-white/60">
                          {t(tool.text)}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/70 group-hover:text-[#b8f36b]">
                        {t(tool.action)} <ArrowUpRight className="size-4" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="sources" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-[-.04em]">
                {t("campus.sources_heading")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                {t("campus.sources_sub")}
              </p>
              <a
                href="campus/full/buscar.html"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#b8f36b] hover:underline"
              >
                {t("campus.search_library")} <ArrowUpRight className="size-4" />
              </a>
            </div>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {resources.map(resource => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-baseline gap-2 text-sm text-white/65 hover:text-white"
                  >
                    <BookOpen className="size-4 shrink-0 text-[#49dce8]" />
                    <span className="group-hover:underline">
                      {resource.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="evidence"
          className="border-t border-white/10 bg-[#0b171d]/70 py-16 lg:py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1fr_1fr] lg:px-8">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">
                {t("campus.evidence_heading")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                {t("campus.evidence_sub")}
              </p>
            </div>
            <div className="grid gap-4 text-sm text-white/60 sm:grid-cols-3">
              <div className="border-t border-[#b8f36b]/40 pt-3">
                <p className="font-mono text-2xl text-[#b8f36b]">30%</p>
                <p className="mt-1">{t("campus.weekly_exercises")}</p>
              </div>
              <div className="border-t border-[#49dce8]/40 pt-3">
                <p className="font-mono text-2xl text-[#49dce8]">30%</p>
                <p className="mt-1">{t("campus.formative_quizzes")}</p>
              </div>
              <div className="border-t border-[#ff8377]/40 pt-3">
                <p className="font-mono text-2xl text-[#ff8377]">40%</p>
                <p className="mt-1">{t("campus.final_evidence")}</p>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-7xl px-5 text-xs leading-relaxed text-white/50 lg:px-8">
            {t("campus.disclaimer")}
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="flex items-center gap-2 text-white/70">
            <GraduationCap className="size-4 text-[#b8f36b]" /> {t("campus.footer_label")}
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/" className="hover:text-white">
              {t("footer.home")}
            </Link>
            <Link href="/progress" className="hover:text-white">
              {t("footer.progress")}
            </Link>
            <Link href="/mentor" className="hover:text-white">
              {t("footer.mentor")}
            </Link>
            <a href="campus/full/progreso.html" className="hover:text-white">
              {t("footer.campus_progress")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
