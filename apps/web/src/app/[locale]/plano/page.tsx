import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { PlanView } from "@/components/plan-view";

export default async function PlanoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PlanView locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("plan.title"), description: t("plan.lead") };
}
