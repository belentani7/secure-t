import { CalendarBuilder } from "@/components/calendar-builder";
import { allCourses } from "@/lib/content";

export default function CalendarioPt() {
  const courses = allCourses().map((course) => ({ slug: course.slug, title: course.title, weeks: course.weeks.length }));
  return (
    <div className="wrap section">
      <h1>Calendário por país</h1>
      <CalendarBuilder locale="pt" courses={courses} />
    </div>
  );
}
