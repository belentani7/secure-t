import Link from "next/link";
import { breadcrumbJsonLd, courseJsonLd, jsonLdScript, translator, type Locale } from "@secure-t/shared";
import { courseBySlug, printPlanTex, printPlanUrl } from "@/lib/content";
import { SITE, asset, localePath } from "@/lib/site";
import { WeekChecklist } from "./week-checklist";

const ARTIFACTS: Record<string, { file: string; label: string }> = {
  syllabus: { file: "syllabus.md", label: "Syllabus" },
  lab: { file: "laboratorio.md", label: "Laboratorio" },
  rubric: { file: "rubrica.md", label: "Rúbrica" },
  glossary: { file: "glosario.md", label: "Glosario" },
  cheatsheet: { file: "chuleta.md", label: "Chuleta" },
  exam: { file: "examen.md", label: "Examen final" },
  resources: { file: "recursos.md", label: "Recursos" }
};

export function CourseView({ locale, slug }: { locale: Locale; slug: string }) {
  const t = translator(locale);
  const course = courseBySlug(slug);
  if (!course) return null;
  const planHtml = printPlanUrl(slug);
  const planTex = printPlanTex();

  const baseUrl = SITE.pagesUrl.replace(/\/$/, "");
  const cursoLd = courseJsonLd({
    baseUrl,
    locale,
    slug: course.slug,
    title: course.title,
    description: course.summary,
    weeks: course.weeks.length,
    hours: course.hours,
    url: `/programas/${course.slug}`,
    image: `${baseUrl}/badges/${course.slug}.svg`,
    teaches: course.weeks.slice(0, 4).map((week) => week.title)
  });
  const migasLd = breadcrumbJsonLd([
    { name: translator("pt")("campus.title"), url: `${baseUrl}/programas` },
    { name: course.title, url: `${baseUrl}/programas/${course.slug}` }
  ]);

  return (
    <div className="wrap section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(cursoLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(migasLd) }} />
      <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
        <Link href={localePath(locale, "/programas")}>{t("campus.title")}</Link> / {course.slug}
      </p>
      <h1 className="mt-1">{course.title}</h1>
      <p className="lead">{course.summary}</p>
      <p className="mono text-[0.78rem] text-[var(--aurum-muted)]">
        {course.hours} h · {course.weeks.length} {t("campus.weeks")} · {course.quizCount} {t("quiz.items")} ·{" "}
        {course.words.toLocaleString(locale)} {t("campus.words")}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link className="btn" href={localePath(locale, `/programas/${course.slug}/semana/1`)}>
          {t("campus.start")}
        </Link>
        <Link className="btn btn-ghost" href={localePath(locale, "/calendario")}>
          {t("calendar.generate")}
        </Link>
        <Link className="btn btn-azure" href={localePath(locale, "/agente")}>
          {t("campus.classAgent")}
        </Link>
        <a className="btn btn-ghost" href={`${SITE.basePath}/campus/cursos/${course.slug}/index.html`}>
          {t("campus.classic")}
        </a>
        {planHtml ? (
          <a className="btn btn-ghost" href={asset(planHtml)} target="_blank" rel="noopener">
            {t("campus.print")}
          </a>
        ) : null}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="plan">
          <h2 id="plan">{t("campus.plan")}</h2>
          <ol className="timeline mt-4">
            {course.weeks.map((week) => (
              <li key={week.index}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="mono text-[0.78rem] text-[var(--color-gold)]">S{String(week.index).padStart(2, "0")}</span>
                  <Link className="font-semibold" href={localePath(locale, `/programas/${course.slug}/semana/${week.index}`)}>
                    {week.title}
                  </Link>
                  <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">
                    {week.words.toLocaleString(locale)} {t("campus.words")}
                  </span>
                </div>
                {week.sections.length ? (
                  <ul className="mono mt-1 flex flex-wrap gap-x-3 text-[0.74rem] text-[var(--aurum-muted)]">
                    {week.sections.slice(0, 4).map((section) => (
                      <li key={section}>{section}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-6">
          <section className="card" aria-labelledby="artifacts">
            <h2 id="artifacts" className="card-title">
              {t("campus.materials")}
            </h2>
            <ul className="space-y-2 text-sm">
              {course.artifacts.map((artifact) => (
                <li key={artifact.kind} className="flex items-center justify-between gap-3">
                  <a href={`${SITE.basePath}/campus/cursos/${course.slug}/${ARTIFACTS[artifact.kind]?.file ?? `${artifact.kind}.md`}`}>
                    {ARTIFACTS[artifact.kind]?.label ?? artifact.title}
                  </a>
                  <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">{artifact.words.toLocaleString(locale)}</span>
                </li>
              ))}
              <li>
                <a href={`${SITE.basePath}/campus/cursos/${course.slug}/quiz.json`}>quiz.json</a>
              </li>
              {planHtml ? (
                <li>
                  <a href={asset(planHtml)} target="_blank" rel="noopener">
                    {t("campus.print")} (A4)
                  </a>
                </li>
              ) : null}
              {planTex ? (
                <li>
                  <a href={asset(planTex)}>LaTeX</a>
                </li>
              ) : null}
            </ul>
          </section>
          <WeekChecklist locale={locale} slug={course.slug} title={course.title} totalWeeks={course.weeks.length} />
        </div>
      </div>
    </div>
  );
}
