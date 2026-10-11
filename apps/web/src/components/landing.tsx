import Link from "next/link";
import { CALENDARS, jsonLdScript, organizationJsonLd, websiteJsonLd, translator, type Locale } from "@secure-t/shared";
import { allCourses, readCatalog } from "@/lib/content";
import { SITE, localePath } from "@/lib/site";
import { VoiceIntro } from "./voice-intro";

/**
 * Portada AURUM. Se renderiza en el servidor y se exporta como HTML estático:
 * funciona sin JavaScript y sin conexión (promesa P3 del contrato original).
 */
export function Landing({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const catalog = readCatalog();
  const courses = allCourses();
  const totalHours = courses.reduce((sum, course) => sum + course.hours, 0);

  const baseUrl = SITE.pagesUrl.replace(/\/$/, "");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd(baseUrl)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd(baseUrl, ["pt", "es", "en", "ca"])) }}
      />
      <section className="wrap section">
        <p className="eyebrow">{t("hero.eyebrow")}</p>
        <h1 className="fade-up max-w-[20ch]">
          <span className="gold-text">{t("hero.title")}</span>
        </h1>
        <p className="lead">{t("hero.lead")}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="btn" href={localePath(locale, "/programas")}>
            {t("hero.cta.campus")}
          </Link>
          <Link className="btn btn-ghost" href={localePath(locale, "/agente")}>
            {t("hero.cta.agent")}
          </Link>
          <VoiceIntro locale={locale} />
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: catalog.totals.courses, label: t("hero.stat.courses") },
            { value: catalog.totals.weeks, label: t("hero.stat.weeks") },
            { value: `${totalHours} h`, label: t("hero.stat.hours") },
            { value: "0 €", label: t("hero.stat.price") }
          ].map((stat) => (
            <div key={stat.label} className="card">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="m-0">
                <span className="gold-text block text-3xl font-semibold">{stat.value}</span>
                <span className="mono text-[0.72rem] uppercase tracking-[0.12em] text-[var(--aurum-muted)]">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <hr className="hairline" />

      <section className="wrap section" aria-labelledby="pillars">
        <h2 id="pillars">{t("pillars.title")}</h2>
        <p className="lead">{t("pillars.lead")}</p>
        <div className="grid-3 mt-7">
          {courses.map((course) => (
            <article key={course.slug} className="card flex flex-col">
              <span className="badge">
                {course.weeks.length} {t("campus.weeks")} · {course.quizCount} quiz
              </span>
              <h3 className="card-title mt-3">{course.title}</h3>
              <p className="muted text-[0.95rem]">{course.summary}</p>
              <ul className="mono mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.75rem] text-[var(--aurum-muted)]">
                {course.weeks.slice(0, 4).map((week) => (
                  <li key={week.index}>S{week.index}</li>
                ))}
                <li>… S{course.weeks.length}</li>
              </ul>
              <div className="mt-auto pt-4">
                <Link className="btn btn-sm" href={localePath(locale, `/programas/${course.slug}`)}>
                  {t("campus.open")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="hairline" />

      <section className="wrap section grid gap-8 lg:grid-cols-2" aria-labelledby="agent-spotlight">
        <div>
          <h2 id="agent-spotlight">{t("agent.title")}</h2>
          <p className="lead">{t("agent.lead")}</p>
          <ul className="mt-5 space-y-3">
            {[
              { title: t("agent.sources"), body: t("agent.guardrail") },
              { title: t("nav.calendar"), body: t("calendar.lead") },
              { title: t("agent.privacy"), body: t("agent.offlineNotice") }
            ].map((item) => (
              <li key={item.title} className="maintenance-note">
                <p className="mb-1 font-semibold text-[var(--color-gold-bright)]">{item.title}</p>
                <p className="muted m-0 text-[0.95rem]">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn btn-azure" href={localePath(locale, "/agente")}>
              {t("hero.cta.agent")}
            </Link>
            <Link className="btn btn-ghost" href={localePath(locale, "/calendario")}>
              {t("calendar.generate")}
            </Link>
          </div>
        </div>
        <div className="card">
          <p className="eyebrow">{t("calendar.title")}</p>
          <p className="mono text-[0.8rem] text-[var(--aurum-muted)]">
            {CALENDARS.length - 1} países · {CALENDARS.reduce((sum, calendar) => sum + (calendar.regions?.length ?? 0), 0)} regiones
          </p>
          <div tabIndex={0} className="table-wrap mt-4">
            <table>
              <caption className="sr-only">{t("calendar.title")}</caption>
              <thead>
                <tr>
                  <th scope="col">{t("calendar.country")}</th>
                  <th scope="col">{t("calendar.holiday")}</th>
                </tr>
              </thead>
              <tbody>
                {CALENDARS.filter((calendar) => calendar.code !== "INTL")
                  .slice(0, 8)
                  .map((calendar) => (
                    <tr key={calendar.code}>
                      <td>
                        {calendar.country} <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">{calendar.code}</span>
                      </td>
                      <td className="mono text-[0.8rem]">{calendar.holidays.length}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="mono mt-3 text-[0.72rem] text-[var(--aurum-muted)]">{t("calendar.note")}</p>
        </div>
      </section>

      <hr className="hairline" />

      <section className="wrap section" aria-labelledby="about">
        <h2 id="about">{t("about.title")}</h2>
        <div className="grid-2 mt-5">
          <p className="muted">{t("about.p1")}</p>
          <p className="muted">{t("about.p2")}</p>
        </div>
        <div className="card mt-6">
          <p className="eyebrow">{t("eval.title")}</p>
          <p className="m-0">{t("eval.body")}</p>
        </div>
        <p className="mono mt-4 text-[0.8rem] text-[var(--aurum-muted)]">
          {t("about.p3")} · {t("status.planned")} ≠ {t("status.verified")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn btn-ghost" href={`${SITE.basePath}${SITE.classicCampus}`}>
            {t("campus.classic")}
          </a>
          <a className="btn btn-ghost" href={SITE.repo} rel="noopener noreferrer" target="_blank">
            {t("footer.source")}
          </a>
        </div>
      </section>
    </>
  );
}
