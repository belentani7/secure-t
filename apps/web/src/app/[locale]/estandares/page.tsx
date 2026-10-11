import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { StandardsView } from "@/components/standards-view";
import { readPackages } from "@/lib/content";

export default async function EstandaresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <StandardsView locale={locale} index={readPackages()} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("standards.title"), description: t("standards.lead") };
}
