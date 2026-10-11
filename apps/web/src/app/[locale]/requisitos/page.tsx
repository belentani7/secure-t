import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { RequirementsView } from "@/components/requirements-view";

export default async function RequisitosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <RequirementsView locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("req.title"), description: t("req.lead") };
}
