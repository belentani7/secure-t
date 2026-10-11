import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { ExperienceView } from "@/components/experience-view";

export default async function ExperienciaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ExperienceView locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("experience.title"), description: t("experience.lead") };
}
