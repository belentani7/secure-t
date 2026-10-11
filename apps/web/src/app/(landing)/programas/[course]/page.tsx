import { notFound } from "next/navigation";
import { allCourses, courseBySlug, readQuiz } from "@/lib/content";
import { CourseView } from "@/components/course-view";
import { QuizPlay } from "@/components/quiz-play";

export function generateStaticParams() {
  return allCourses().map((course) => ({ course: course.slug }));
}

export default async function CoursePt({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const entry = courseBySlug(course);
  if (!entry) notFound();
  return (
    <>
      <CourseView locale="pt" slug={course} />
      <div className="wrap section pt-0">
        <QuizPlay locale="pt" slug={course} title={entry.title} items={readQuiz(course)} />
      </div>
    </>
  );
}
