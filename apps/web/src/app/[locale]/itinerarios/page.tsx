import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { TracksView } from "@/components/tracks-view";

export default async function ItinerariosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <TracksView locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("tracks.title"), description: t("tracks.lead") };
}
