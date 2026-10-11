import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { CampusIndex } from "@/components/campus-index";

export default async function ProgramasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CampusIndex locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("campus.title"), description: t("campus.lead") };
}
