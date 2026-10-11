import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { ProgressBoard } from "@/components/progress-board";
import { allCourses } from "@/lib/content";

export default async function ProgresoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = translator(locale);
  const courses = allCourses().map((course) => ({ slug: course.slug, title: course.title, weeks: course.weeks.length }));

  return (
    <div className="wrap section">
      <p className="eyebrow">{t("progress.anonymous")}</p>
      <h1>{t("progress.title")}</h1>
      <p className="lead">{t("progress.lead")}</p>
      <div className="mt-8">
        <ProgressBoard locale={locale} courses={courses} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("progress.title"), description: t("progress.lead") };
}
