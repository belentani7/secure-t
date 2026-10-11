import { CredentialView } from "@/components/credential-view";
import { allCourses } from "@/lib/content";

export default function CredencialPt() {
  const courses = allCourses().map((course) => ({ slug: course.slug, title: course.title, weeks: course.weeks.length }));
  return (
    <div className="wrap section">
      <CredentialView locale="pt" courses={courses} />
    </div>
  );
}
