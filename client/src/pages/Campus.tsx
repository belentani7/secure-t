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

const TOOLS = [
  {
    icon: Terminal,
    title: "SOC workstation",
    text: "Abrir la estación de trabajo defensiva con casos, evidencia y triage guiado.",
    href: "campus/full/workstation/",
    action: "Operar",
  },
  {
    icon: Activity,
    title: "Mission Control",
    text: "Simulación de misión con reloj, decisiones reversibles y registro de evidencia.",
    href: "campus/full/workstation/mission.html",
    action: "Entrar",
  },
  {
    icon: MapIcon,
    title: "Observatorio cyber",
    text: "Explorar señales, amenazas y fuentes abiertas con criterios de verificación.",
    href: "campus/full/observatorio/",
    action: "Observar",
  },
  {
    icon: Activity,
    title: "SOC Decision Lab",
    text: "Seis incidentes sintéticos con evidencia, decisión, feedback y registro descargable.",
    href: "campus/full/academia/triage.html",
    action: "Decidir",
  },
  {
    icon: ShieldCheck,
    title: "Threat Modeling Studio",
    text: "Cinco modelos de amenaza con activos, fronteras, riesgo y control defendible.",
    href: "campus/full/academia/threat-studio.html",
    action: "Modelar",
  },
  {
    icon: ShieldCheck,
    title: "Amenazas abiertas",
    text: "Panel de amenazas con contexto, severidad y límites de atribución.",
    href: "campus/full/amenazas.html",
    action: "Revisar",
  },
  {
    icon: Search,
    title: "Buscador del campus",
    text: "Buscar semanas, glosarios, recursos y cápsulas por tema.",
    href: "campus/full/buscar.html",
    action: "Buscar",
  },
  {
    icon: GraduationCap,
    title: "Academia de 5 años",
    text: "El plan largo: 10 semestres, 60 disciplinas y caderno de evidencias.",
    href: "campus/full/academia/",
    action: "Ver plan",
  },
] as const;

export default function Campus() {
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
        Skip to content
      </a>
      <SiteHeader />

      <main id="campus-main">
        <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-8 lg:pb-24 lg:pt-24">
          <div>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[.94] tracking-[-.045em] sm:text-7xl">
              The whole campus,
              <br />
              <span className="text-[#b8f36b]">in the open.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/55">
              Four original programs, twenty weeks each, with readings, guided
              labs, quizzes, glossaries and evidence-based assessment. No
              account, no tracking, no paywall.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#programs"
                className="inline-flex items-center gap-2 rounded-xl bg-[#b8f36b] px-5 py-3.5 text-sm font-bold text-[#071016] transition hover:bg-[#d0ff9a]"
              >
                Browse programs <ArrowUpRight className="size-4" />
              </a>
              <Link
                href="/progress"
                className="rounded-xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5"
              >
                Continue where you left off
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 text-sm">
            <div>
              <dt className="text-white/45">Original programs</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-white">
                {CAMPUS_PROGRAMS.length}
              </dd>
            </div>
            <div>
              <dt className="text-white/45">Weeks of material</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-white">
                {totalWeeks}
              </dd>
            </div>
            <div>
              <dt className="text-white/45">Guided hours</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-white">
                {totalHours}
              </dd>
            </div>
            <div>
              <dt className="text-white/45">Your local progress</dt>
              <dd className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-[#b8f36b]">
                  {globalPercent}%
                </span>
                <span className="text-white/40">
                  {completedItems}/{totalItems}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <nav
          aria-label="Campus sections"
          className="border-y border-white/10 bg-white/[.02]"
        >
          <ul className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-3 text-sm text-white/55 lg:px-8">
            <li>
              <a href="#programs" className="hover:text-white">
                Programs
              </a>
            </li>
            <li>
              <a href="#tools" className="hover:text-white">
                Tools
              </a>
            </li>
            <li>
              <a href="#sources" className="hover:text-white">
                Sources
              </a>
            </li>
            <li>
              <a href="#evidence" className="hover:text-white">
                Evidence model
              </a>
            </li>
          </ul>
        </nav>

        <section id="programs" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-[-.04em] sm:text-5xl">
              Four disciplines. One body of evidence.
            </h2>
            <p className="mt-4 text-white/55">
              Each program runs twenty weeks. The public course page is the
              complete reader: lessons, quiz, lab, rubric, glossary and final
              assessment. Mark your progress locally and it stays on this
              device.
            </p>
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
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                        {program.description}
                      </p>

                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-semibold text-white/75">
                            You will be able to
                          </h4>
                          <ul className="mt-3 space-y-2 text-sm text-white/55">
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
                            Assessment
                          </h4>
                          <ul className="mt-3 space-y-2 text-sm text-white/55">
                            {program.assessment.map(item => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <details className="group mt-8 border-t border-white/10 pt-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white/80">
                          <span>
                            See all {program.weeks.length} weeks
                          </span>
                          <span className="text-[#b8f36b] group-open:hidden">
                            Open
                          </span>
                          <span className="hidden text-[#b8f36b] group-open:inline">
                            Close
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
                                <span className="font-mono text-xs text-white/35">
                                  W{String(week.number).padStart(2, "0")}
                                </span>
                                <div>
                                  <a
                                    href={`${program.links.course}#semana-${week.number}`}
                                    className="text-sm font-semibold text-white/80 underline-offset-4 hover:text-[#b8f36b] hover:underline"
                                  >
                                    {week.title}
                                  </a>
                                  <p className="mt-1 max-w-3xl text-xs leading-relaxed text-white/40">
                                    {week.objective}
                                  </p>
                                </div>
                                <span
                                  className={`text-xs ${
                                    done ? "text-[#b8f36b]" : "text-white/25"
                                  }`}
                                >
                                  {done ? "Completed" : "Not started"}
                                </span>
                              </li>
                            );
                          })}
                        </ol>
                      </details>
                    </div>

                    <aside className="self-start border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                      <p className="text-sm text-white/45">
                        {program.hours} guided hours · {program.language}
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
                        <p className="mt-2 text-xs text-white/40">
                          {progress.done}/{progress.total} items ·{" "}
                          {progress.percent}%
                        </p>
                      </div>
                      <div className="mt-5 flex flex-col gap-2 text-sm">
                        <a
                          href={program.links.course}
                          className="inline-flex items-center gap-2 font-semibold text-[#b8f36b] hover:underline"
                        >
                          Open the course <ArrowUpRight className="size-4" />
                        </a>
                        <a
                          href={`${program.links.course}#quiz`}
                          className="text-white/60 hover:text-white"
                        >
                          Quiz formativo
                        </a>
                        <a
                          href={`${program.links.course}#rubrica`}
                          className="text-white/60 hover:text-white"
                        >
                          Rúbrica de evaluación
                        </a>
                        <a
                          href={`${program.links.course}#glosario`}
                          className="text-white/60 hover:text-white"
                        >
                          Glosario
                        </a>
                        <a
                          href={`${program.links.course}#examen`}
                          className="text-white/60 hover:text-white"
                        >
                          Examen final
                        </a>
                        <Link
                          href="/progress"
                          className="mt-2 text-white/60 hover:text-white"
                        >
                          Marcar progreso
                        </Link>
                      </div>
                      <div className="mt-6 border-t border-white/10 pt-4">
                        <p className="flex items-center gap-2 text-xs font-semibold text-white/60">
                          <FlaskConical className="size-4 text-[#49dce8]" />{" "}
                          {program.lab.title}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-white/40">
                          {program.lab.intro}
                        </p>
                        <a
                          href={`${program.links.course}#laboratorio`}
                          className="mt-3 inline-flex text-xs font-semibold text-[#49dce8] hover:underline"
                        >
                          Abrir laboratorio
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
                Practice with the real tools.
              </h2>
              <p className="mt-4 text-white/55">
                The campus ships offline-first instruments for triage,
                observation, search and evidence. They use synthetic data and
                never touch a real network.
              </p>
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
                          {tool.title}
                        </span>
                        <span className="mt-1 block text-sm text-white/45">
                          {tool.text}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/50 group-hover:text-[#b8f36b]">
                        {tool.action} <ArrowUpRight className="size-4" />
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
                Open sources, verified.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Every program links to repositories, standards and APIs that
                were checked when the material was written. No dead links, no
                invented citations.
              </p>
              <a
                href="campus/full/buscar.html"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#b8f36b] hover:underline"
              >
                Search the whole library <ArrowUpRight className="size-4" />
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
                You pass by demonstrating.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Assessment follows a 30 / 30 / 40 model: weekly participation,
                formative quizzes and a final project with evidence. The campus
                records what you can defend, not just a percentage.
              </p>
            </div>
            <div className="grid gap-4 text-sm text-white/60 sm:grid-cols-3">
              <div className="border-t border-[#b8f36b]/40 pt-3">
                <p className="font-mono text-2xl text-[#b8f36b]">30%</p>
                <p className="mt-1">Weekly exercises</p>
              </div>
              <div className="border-t border-[#49dce8]/40 pt-3">
                <p className="font-mono text-2xl text-[#49dce8]">30%</p>
                <p className="mt-1">Formative quizzes</p>
              </div>
              <div className="border-t border-[#ff8377]/40 pt-3">
                <p className="font-mono text-2xl text-[#ff8377]">40%</p>
                <p className="mt-1">Final evidence</p>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-7xl px-5 text-xs leading-relaxed text-white/35 lg:px-8">
            Secure T is an open study campus. It does not claim official
            accreditation, university degree validity or industry certification.
            Progress is stored only in your browser.
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="flex items-center gap-2 text-white/55">
            <GraduationCap className="size-4 text-[#b8f36b]" /> Secure T
            campus
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/progress" className="hover:text-white">
              Progress
            </Link>
            <Link href="/mentor" className="hover:text-white">
              Mentor
            </Link>
            <a href="campus/full/progreso.html" className="hover:text-white">
              Campus progress
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
