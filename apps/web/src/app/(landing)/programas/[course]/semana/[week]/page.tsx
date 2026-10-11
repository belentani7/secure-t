import { notFound } from "next/navigation";
import { WeekView } from "@/components/week-view";
import { allCourses, readWeek } from "@/lib/content";

export function generateStaticParams() {
  return allCourses().flatMap((course) =>
    Array.from({ length: course.weeks.length }, (_, index) => ({ course: course.slug, week: String(index + 1) }))
  );
}

export default async function WeekPt({ params }: { params: Promise<{ course: string; week: string }> }) {
  const { course, week } = await params;
  const parsed = Number.parseInt(week, 10);
  if (!Number.isInteger(parsed) || !readWeek(course, parsed)) notFound();
  return <WeekView locale="pt" slug={course} week={parsed} />;
}
