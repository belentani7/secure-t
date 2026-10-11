import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { ThreatsView } from "@/components/threats-view";
import { readThreatIntel } from "@/lib/content";

export default async function AmenazasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="wrap section">
      <ThreatsView locale={locale} intel={readThreatIntel()} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("threats.title"), description: t("threats.lead") };
}
