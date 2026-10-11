import { notFound } from "next/navigation";
import { isLocale } from "@secure-t/shared";
import { Landing } from "@/components/landing";

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Landing locale={locale} />;
}
