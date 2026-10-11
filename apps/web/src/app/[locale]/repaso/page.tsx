import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { ReviewSession } from "@/components/review-session";

export default async function RepasoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = translator(locale);
  return (
    <div className="wrap section">
      <p className="eyebrow">{t("nav.review")}</p>
      <h1>{t("review.title")}</h1>
      <p className="lead">{t("review.lead")}</p>
      <div className="mt-8">
        <ReviewSession locale={locale} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("review.title"), description: t("review.lead") };
}
