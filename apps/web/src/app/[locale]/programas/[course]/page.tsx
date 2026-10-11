import { notFound } from "next/navigation";
import { LOCALES, isLocale, translator } from "@secure-t/shared";
import { CourseView } from "@/components/course-view";
import { QuizPlay } from "@/components/quiz-play";
import { readQuiz } from "@/lib/content";
import { allCourses, courseBySlug } from "@/lib/content";

export function generateStaticParams() {
  const courses = allCourses();
  return LOCALES.flatMap((locale) => courses.map((course) => ({ locale, course: course.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; course: string }> }) {
  const { locale, course } = await params;
  if (!isLocale(locale)) return {};
  const entry = courseBySlug(course);
  if (!entry) return {};
  return { title: entry.title, description: entry.summary };
}

export default async function CoursePage({ params }: { params: Promise<{ locale: string; course: string }> }) {
  const { locale, course } = await params;
  if (!isLocale(locale)) notFound();
  const entry = courseBySlug(course);
  if (!entry) notFound();
  const t = translator(locale);
  const quiz = readQuiz(course);

  return (
    <>
      <CourseView locale={locale} slug={course} />
      <div className="wrap section pt-0">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <QuizPlay locale={locale} slug={course} title={entry.title} items={quiz} />
          <section className="card" aria-labelledby="lab-title">
            <h2 id="lab-title" className="card-title">
              {t("campus.lab")} · {t("campus.project")}
            </h2>
            <p className="muted m-0 text-[0.95rem]">{t("eval.body")}</p>
            <ul className="mono mt-3 space-y-1 text-[0.78rem] text-[var(--aurum-muted)]">
              <li>{t("campus.rubric")} 30 % · P1</li>
              <li>{t("campus.rubric")} 30 % · P2</li>
              <li>{t("campus.rubric")} 40 % · P3</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
