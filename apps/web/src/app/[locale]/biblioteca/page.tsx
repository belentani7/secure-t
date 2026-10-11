import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { LibraryView } from "@/components/library-view";

export default async function BibliotecaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LibraryView locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("library.title"), description: t("library.lead") };
}
