import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { PrivacyView } from "@/components/privacy-view";

export default async function PrivacidadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PrivacyView locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("privacy.title"), description: t("privacy.lead") };
}
