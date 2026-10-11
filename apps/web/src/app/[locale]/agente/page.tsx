import { notFound } from "next/navigation";
import { isLocale, translator } from "@secure-t/shared";
import { AgentConsole } from "@/components/agent-console";

export default async function AgentePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = translator(locale);
  return (
    <div className="wrap section">
      <p className="eyebrow">{t("agent.mode")}</p>
      <h1>{t("agent.title")}</h1>
      <p className="lead">{t("agent.lead")}</p>
      <div className="mt-8">
        <AgentConsole locale={locale} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(locale);
  return { title: t("agent.title"), description: t("agent.lead") };
}
