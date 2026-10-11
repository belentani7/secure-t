import { notFound } from "next/navigation";
import { LOCALES, isLocale } from "@secure-t/shared";
import { WeekView } from "@/components/week-view";
import { allCourses, readWeek } from "@/lib/content";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    allCourses().flatMap((course) =>
      Array.from({ length: course.weeks.length }, (_, index) => ({
        locale,
        course: course.slug,
        week: String(index + 1)
      }))
    )
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; course: string; week: string }> }) {
  const { locale, course, week } = await params;
  if (!isLocale(locale)) return {};
  const content = readWeek(course, Number(week), locale);
  if (!content) return {};
  return { title: content.title, description: content.sections[0]?.title };
}

export default async function WeekPage({ params }: { params: Promise<{ locale: string; course: string; week: string }> }) {
  const { locale, course, week } = await params;
  if (!isLocale(locale)) notFound();
  const parsed = Number.parseInt(week, 10);
  if (!Number.isInteger(parsed)) notFound();
  return <WeekView locale={locale} slug={course} week={parsed} />;
}
