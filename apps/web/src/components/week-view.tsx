import Link from "next/link";
import { notFound } from "next/navigation";
import { toPlainText, translator, type Locale } from "@secure-t/shared";
import { courseBySlug, readWeek } from "@/lib/content";
import { SITE, localePath } from "@/lib/site";
import { TeachingBadge, TeachingText } from "./teaching-text";
import { MarkWeekDone } from "./week-checklist";
import { VoiceLesson } from "./voice-lesson";

/**
 * Lección de una semana. El HTML viene del renderizador seguro propio
 * (`renderMarkdown`), que escapa primero y sólo emite las etiquetas permitidas:
 * no hay `dangerouslySetInnerHTML` con contenido sin sanear.
 */
export function WeekView({ locale, slug, week }: { locale: Locale; slug: string; week: number }) {
  const t = translator(locale);
  const course = courseBySlug(slug);
  const content = readWeek(slug, week, locale);
  if (!course || !content) notFound();

  const previous = week > 1 ? week - 1 : null;
  const next = week < course.weeks.length ? week + 1 : null;
  const summary = course.weeks.find((entry) => entry.index === week);
  const objectives = content.sections.find((section) => /objetiv|objective/i.test(section.title));

  return (
    <div className="wrap section">
      <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
        <Link href={localePath(locale, "/programas")}>{t("campus.title")}</Link> /{" "}
        <Link href={localePath(locale, `/programas/${slug}`)}>{course.title}</Link> / {t("campus.weekOf")} {week}
      </p>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">
            {t("campus.weekOf")} {week} · {course.weeks.length}
          </p>
          <h1 className="mt-1 max-w-[24ch]">
            <TeachingText locale={locale}>{content.title}</TeachingText>
            {content.translated ? null : <span className="ml-3 align-middle"><TeachingBadge locale={locale} /></span>}
          </h1>
          <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
            {content.words.toLocaleString(locale)} {t("campus.words")} · {summary?.hash ?? ""} ·{" "}
            {t("week.minutes")} ≈ {Math.max(45, Math.round(content.words / 150) * 5)} min
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MarkWeekDone locale={locale} slug={slug} week={week} title={course.title} total={course.weeks.length} />
          <VoiceLesson locale={locale} slug={slug} week={week} title={course.title} text={toPlainText(content.markdown).slice(0, 1400)} />
        </div>
      </div>

      {objectives ? (
        <aside className="maintenance-note mt-6" aria-labelledby="objectives">
          <h2 id="objectives" className="card-title">
            {t("week.objectives")}
          </h2>
          <div
            lang={content.sourceLocale}
            className="prose"
            dangerouslySetInnerHTML={{ __html: `<p>${objectives.body.replace(/\n- /g, "<br>• ")}</p>` }}
          />
        </aside>
      ) : null}

      {/* El idioma del texto es el que es: si aún no hay traducción, `lang="es"` lo dice. */}
      <article
        lang={content.sourceLocale}
        className="prose mt-8"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--aurum-line)] pt-5" aria-label={t("campus.plan")}>
        {previous ? (
          <Link className="btn btn-ghost" href={localePath(locale, `/programas/${slug}/semana/${previous}`)}>
            ← {t("campus.weekOf")} {previous}
          </Link>
        ) : (
          <span />
        )}
        <Link className="btn btn-ghost" href={localePath(locale, `/programas/${slug}`)}>
          {t("campus.materials")}
        </Link>
        {next ? (
          <Link className="btn" href={localePath(locale, `/programas/${slug}/semana/${next}`)}>
            {t("campus.weekOf")} {next} →
          </Link>
        ) : (
          <Link className="btn" href={localePath(locale, "/credencial")}>
            {t("credential.title")} →
          </Link>
        )}
      </nav>

      <p className="mono mt-6 text-[0.72rem] text-[var(--aurum-muted)]">
        {t("footer.honesty")} ·{" "}
        <a href={`${SITE.basePath}/campus/cursos/${slug}/semana-${String(week).padStart(2, "0")}.md`}>Markdown</a> ·{" "}
        <a href={`${SITE.basePath}/campus/cursos/${slug}/index.html`}>{t("campus.classic")}</a>
      </p>
    </div>
  );
}
