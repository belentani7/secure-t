import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { CalendarBuilder } from "@/components/calendar-builder";
import { allCourses } from "@/lib/content";

export default async function CalendarioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = translator(locale);
  const courses = allCourses().map((course) => ({ slug: course.slug, title: course.title, weeks: course.weeks.length }));

  return (
    <div className="wrap section">
      <p className="eyebrow">{t("calendar.generate")}</p>
      <h1>{t("calendar.title")}</h1>
      <p className="lead">{t("calendar.lead")}</p>
      <div className="mt-8">
        <CalendarBuilder locale={locale} courses={courses} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("calendar.title"), description: t("calendar.lead") };
}
