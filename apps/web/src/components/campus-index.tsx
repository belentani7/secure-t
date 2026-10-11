import Link from "next/link";
import { jsonLdScript, programListJsonLd, translator, type Locale } from "@secure-t/shared";
import { allCourses, buildStamp, courseText, localeCoverage, readCatalog, translatedWeeks } from "@/lib/content";
import { SITE, asset, localePath } from "@/lib/site";
import { CampusSearch } from "./campus-search";
import { TeachingBadge, TeachingText } from "./teaching-text";

export function CampusIndex({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const catalog = readCatalog();
  const courses = allCourses();

  // Traducciones reales del programa: si no están, el texto se marca en español.
  const textos = new Map(courses.map((course) => [course.slug, courseText(course.slug, locale)]));
  const cobertura = localeCoverage().find((entrada) => entrada.lang === locale) ?? {
    lang: locale,
    courses: 0,
    weeks: 0,
    words: 0,
    detail: []
  };

  const lista = programListJsonLd({
    baseUrl: SITE.pagesUrl.replace(/\/$/, ""),
    locale,
    courses: courses.map((course) => ({ slug: course.slug, title: course.title, description: course.summary }))
  });

  return (
    <div className="wrap section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(lista) }} />
      <p className="eyebrow">{t("campus.title")}</p>
      <h1>{t("campus.title")}</h1>
      <p className="lead">{t("campus.lead")}</p>
      <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
        {catalog.totals.courses} programas · {catalog.totals.weeks} semanas · {catalog.totals.words.toLocaleString(locale)} {t(
          "campus.words"
        )}{" "}
        · build {buildStamp()} · digest {catalog.sourceDigest.slice(0, 12)}
      </p>

      {locale !== "es" ? (
        <p className="mono mt-2 text-[0.75rem] text-[var(--aurum-muted)]">
          {t("content.coverage")}: {cobertura.weeks}/{catalog.totals.weeks} {t("campus.weeks")} ·{" "}
          {cobertura.words.toLocaleString(locale)} {t("campus.words")}
        </p>
      ) : null}

      <div className="mt-8 grid-2">
        {courses.map((course) => (
          <article key={course.slug} className="card flex flex-col" id={course.slug}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="card-title m-0">
                <Link href={localePath(locale, `/programas/${course.slug}`)}>
                  <TeachingText locale={locale}>{textos.get(course.slug)?.title ?? course.title}</TeachingText>
                </Link>
              </h2>
              <span className="badge">
                {course.hours} h · {course.weeks.length} {t("campus.weeks")}
              </span>
              {locale === "es" ? null : translatedWeeks(course.slug, locale).length > 0 ? (
                <span className="badge">
                  {locale.toUpperCase()} {translatedWeeks(course.slug, locale).length}/{course.weeks.length}
                </span>
              ) : (
                <TeachingBadge locale={locale} />
              )}
            </div>
            <p className="muted mt-2 text-[0.95rem]"><TeachingText locale={locale}>{textos.get(course.slug)?.summary ?? course.summary}</TeachingText></p>
            <ol className="mono mt-3 grid grid-cols-2 gap-x-4 text-[0.78rem] text-[var(--aurum-muted)] sm:grid-cols-3">
              {course.weeks.map((week) => (
                <li key={week.index}>
                  <Link href={localePath(locale, `/programas/${course.slug}/semana/${week.index}`)}>
                    S{String(week.index).padStart(2, "0")} · {week.title.slice(0, 26)}
                  </Link>
                </li>
              ))}
            </ol>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <Link className="btn btn-sm" href={localePath(locale, `/programas/${course.slug}`)}>
                {t("campus.open")}
              </Link>
              <a className="btn btn-ghost btn-sm" href={asset(`/content/catalog.json`)} download>
                {t("campus.materials")} (JSON)
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <CampusSearch locale={locale} />
      </div>

      <p className="mono mt-6 text-[0.75rem] text-[var(--aurum-muted)]">
        {t("campus.offline")} · <a href={asset("/campus/")}>{t("nav.campus")} clásico</a> ·{" "}
        <a href={asset("/campus/indice.json")}>indice.json</a>
      </p>
    </div>
  );
}
