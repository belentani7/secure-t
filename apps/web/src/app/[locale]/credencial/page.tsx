import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { CredentialView } from "@/components/credential-view";
import { allCourses } from "@/lib/content";

export default async function CredencialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = translator(locale);
  const courses = allCourses().map((course) => ({ slug: course.slug, title: course.title, weeks: course.weeks.length }));

  return (
    <div className="wrap section">
      <CredentialView locale={locale} courses={courses} />
      <p className="mono mt-6 text-[0.72rem] text-[var(--aurum-muted)]">{t("credential.phase2")}</p>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("credential.title"), description: t("credential.lead") };
}
