import { ProgressBoard } from "@/components/progress-board";
import { allCourses } from "@/lib/content";

export default function ProgressoPt() {
  const courses = allCourses().map((course) => ({ slug: course.slug, title: course.title, weeks: course.weeks.length }));
  return (
    <div className="wrap section">
      <h1>O meu progresso</h1>
      <ProgressBoard locale="pt" courses={courses} />
    </div>
  );
}
