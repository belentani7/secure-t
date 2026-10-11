import Link from "next/link";
import {
  TRACKS,
  prerequisitesOf,
  trackDescriptionKey,
  trackHours,
  trackLevelKey,
  trackNameKey,
  trackWeeks,
  translator,
  type Locale
} from "@secure-t/shared";
import { allCourses } from "@/lib/content";
import { localePath } from "@/lib/site";
import { TeachingBadge, TeachingText } from "./teaching-text";

/**
 * Itinerarios abiertos: la estructura profesional (orden, prerrequisitos y
 * competencias) sin cerrar ninguna puerta. Se renderiza en el servidor y sale
 * como HTML estático, como el resto del campus.
 */
export function TracksView({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const courses = allCourses();
  const porSlug = new Map(courses.map((curso) => [curso.slug, curso]));
  const horas = Object.fromEntries(courses.map((curso) => [curso.slug, curso.hours]));
  const semanas = Object.fromEntries(courses.map((curso) => [curso.slug, curso.weeks.length]));

  return (
    <div className="space-y-6">
      <section className="wrap section relative isolate overflow-hidden">
        <span aria-hidden="true" className="aurum-luz" />
        <p className="eyebrow">{t("nav.tracks")}</p>
        <h1 className="max-w-[24ch]">
          <span className="gold-text">{t("tracks.title")}</span>
        </h1>
        <p className="lead">{t("tracks.lead")}</p>

        <div className="aurum-glass mt-6 p-5">
          <h2 className="card-title m-0">{t("tracks.howTo")}</h2>
          <p className="muted mt-2">{t("tracks.howToBody")}</p>
        </div>
      </section>

      <section className="wrap section pt-0" aria-label={t("tracks.title")}>
        <ul className="space-y-6">
          {TRACKS.map((track) => {
            const horasTrack = trackHours(track, horas);
            const semanasTrack = trackWeeks(track, semanas);
            return (
              <li key={track.id}>
                <article className="aurum-glass p-5" aria-labelledby={`track-${track.id}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 id={`track-${track.id}`} className="card-title m-0">
                      {t(trackNameKey(track.id))}
                    </h2>
                    <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
                      {t("tracks.level")}: {t(trackLevelKey(track.level))} · {horasTrack} {t("tracks.hours")} ·{" "}
                      {semanasTrack} {t("tracks.weeks")}
                    </p>
                  </div>
                  <p className="muted mt-2">{t(trackDescriptionKey(track.id))}</p>

                  <h3 className="mono mt-5 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">
                    {t("tracks.order")}
                  </h3>
                  <ol className="mt-2 space-y-2">
                    {track.courses.map((slug, indice) => {
                      const curso = porSlug.get(slug);
                      if (!curso) return null;
                      const antes = prerequisitesOf(slug);
                      return (
                        <li key={slug} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="mono text-[0.78rem] text-[var(--color-gold-bright)]">{indice + 1}.</span>
                          <Link href={localePath(locale, `/programas/${slug}`)} className="font-semibold">
                            <TeachingText locale={locale}>{curso.title}</TeachingText>
                          </Link>
                          <TeachingBadge locale={locale} />
                          <span className="mono text-[0.72rem] text-[var(--aurum-muted)]">
                            {curso.hours} {t("tracks.hours")} · {curso.weeks.length} {t("tracks.weeks")}
                          </span>
                          <span className="mono w-full text-[0.72rem] text-[var(--aurum-muted)]">
                            {antes.length === 0
                              ? t("tracks.prereqNone")
                              : `${t("tracks.prereq")}: ` +
                                antes
                                  .map((alternativa) => porSlug.get(alternativa)?.title ?? alternativa)
                                  .join(" · ")}
                          </span>
                        </li>
                      );
                    })}
                  </ol>

                  <h3 className="mono mt-5 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">
                    {t("tracks.skills")}
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {track.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full border border-[var(--aurum-line-strong)] px-3 py-1 text-[0.8rem]"
                      >
                        {t(skill)}
                      </li>
                    ))}
                  </ul>

                  <p className="muted mt-4 text-sm">{t("tracks.credential")}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
