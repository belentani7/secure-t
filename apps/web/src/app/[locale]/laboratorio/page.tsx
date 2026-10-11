import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { LabView } from "@/components/lab-view";

export default async function LaboratorioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LabView locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("lab.title"), description: t("lab.lead") };
}
