import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, CheckCircle2, FileSearch, GraduationCap, Languages, LockKeyhole, Search, ShieldCheck, Users, X, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

type PortalSection = "record" | "credentials" | "research" | "faculty" | "admin" | "settings";

const lessons = [
  { titleKey: "portal.record.linux_ops", courseKey: "portal.record.linux_course", state: "completed", evidenceKey: "portal.record.validated" },
  { titleKey: "portal.record.network_capture", courseKey: "portal.record.network_course", state: "completed", evidenceKey: "portal.record.reviewed" },
  { titleKey: "portal.record.triage_alert", courseKey: "portal.record.detection_course", state: "in_review", evidenceKey: "portal.record.awaiting_faculty" },
] as const;

export default function Portal({ section }: { section: PortalSection }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const searchResult = useMemo(() =>
    query
      ? t("portal.toast.demo_search", { query })
      : t("portal.research.empty"),
    [query, t]
  );

  return (
    <main className="min-h-screen bg-[#0b1117] px-5 py-8 text-[#ecf2f4] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p role="status" className="mb-5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/70">
          {t("portal.demo_mode")}
        </p>

        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-7">
          <div>
            <p className="eyebrow !text-[#b8f36b]">{t("portal.eyebrow")}</p>
            <h1 className="mt-3 font-display text-4xl font-bold">{t(`portal.${section}`)}</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/50">
              {t(`portal.section.${section}`)}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 p-1">
            <Languages className="ml-2 size-4 text-[#b8f36b]" />
            <div className="flex gap-1">
              <button
                type="button"
                aria-pressed={false}
                disabled
                className="rounded-lg px-3 py-2 text-xs font-bold text-white/30"
              >
                {t("portal.lang.es")}
              </button>
              <button
                type="button"
                aria-pressed={false}
                disabled
                className="rounded-lg px-3 py-2 text-xs font-bold text-white/30"
              >
                {t("portal.lang.pt")}
              </button>
              <button
                type="button"
                aria-pressed={false}
                disabled
                className="rounded-lg px-3 py-2 text-xs font-bold text-white/30"
              >
                {t("portal.lang.en")}
              </button>
            </div>
          </div>
        </header>

        {/* RECORD SECTION */}
        {section === "record" && (
          <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-2xl border border-white/10 bg-[#111922] p-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="text-[#b8f36b]" />
                <h2 className="font-display text-xl font-bold">{t("portal.record.program")}</h2>
              </div>
              <div className="mt-7 space-y-4">
                {lessons.map((l, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <b className="text-sm">{t(l.titleKey)}</b>
                      <p className="mt-1 text-xs text-white/40">{t(l.courseKey)}</p>
                    </div>
                    <span className="rounded-full bg-[#b8f36b]/10 px-3 py-1 text-[10px] font-bold text-[#b8f36b]">
                      {t(l.evidenceKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#111922] p-6">
              <p className="eyebrow !text-white/40">{t("portal.record.mastery")}</p>
              {[
                [t("portal.record.linux"), 91],
                [t("portal.record.networking"), 82],
                [t("portal.record.cryptography"), 51],
              ].map(([x, v], i) => (
                <div key={i} className="mt-6">
                  <div className="flex justify-between text-sm">
                    <b>{x}</b>
                    <span className="font-mono text-[#b8f36b]">{v}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#b8f36b]" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREDENTIALS SECTION */}
        {section === "credentials" && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-[#b8f36b]/30 bg-[#b8f36b]/5 p-6">
              <Award className="text-[#b8f36b]" />
              <h2 className="mt-6 font-display text-2xl font-bold">{t("portal.credentials.soc_foundations")}</h2>
              <p className="mt-2 text-sm text-white/50">{t("portal.credentials.visual_example")}</p>
              <button
                onClick={() => toast(t("portal.toast.demo_view"), { description: t("portal.toast.no_issuance") })}
                className="mt-7 rounded-xl bg-[#b8f36b] px-4 py-3 text-sm font-bold text-[#0b1117]"
              >
                {t("portal.credentials.view_verification")}
              </button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#111922] p-6">
              <LockKeyhole className="text-white/40" />
              <h2 className="mt-6 font-display text-2xl font-bold">{t("portal.credentials.bachelor")}</h2>
              <p className="mt-2 text-sm text-white/45">{t("portal.credentials.not_issued")}</p>
            </div>
          </div>
        )}

        {/* RESEARCH SECTION */}
        {section === "research" && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#111922] p-6">
            <div className="flex gap-3">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t("portal.search.placeholder")}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#b8f36b]"
              />
              <button
                type="button"
                aria-label={t("portal.search.aria")}
                onClick={() => toast(t("portal.toast.search_not_connected"), { description: searchResult })}
                className="rounded-xl bg-[#b8f36b] px-4 text-[#0b1117]"
              >
                <Search className="size-4" />
              </button>
            </div>
            <p className="mt-8 text-sm text-white/50">{searchResult}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                { key: "portal.research.owasp", icon: FileSearch },
                { key: "portal.research.nist", icon: FileSearch },
                { key: "portal.research.curriculum", icon: FileSearch },
              ].map(({ key, icon: Icon }) => (
                <div key={key} className="rounded-xl border border-white/10 p-4">
                  <Icon className="size-4 text-[#6be7f3]" />
                  <b className="mt-4 block text-sm">{t(key)}</b>
                  <small className="mt-2 block text-white/35">{t("portal.research.illustrative")}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FACULTY SECTION */}
        {section === "faculty" && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              { key: "portal.faculty.evidence_queue", icon: FileSearch },
              { key: "portal.faculty.active_learners", icon: Users },
              { key: "portal.faculty.rubrics_calibrated", icon: CheckCircle2 },
            ].map(({ key, icon: Icon }) => (
              <div key={key} className="rounded-2xl border border-white/10 bg-[#111922] p-6">
                <Icon className="text-[#b8f36b]" />
                <p className="mt-8 font-mono text-4xl">—</p>
                <p className="mt-2 text-sm text-white/45">{t(key)}</p>
              </div>
            ))}
          </div>
        )}

        {/* ADMIN SECTION */}
        {section === "admin" && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "portal.admin.users_roles",
              "portal.admin.ai_agents",
              "portal.admin.audit_events",
              "portal.admin.system_health",
              "portal.admin.curriculum_publishing",
              "portal.admin.feature_flags",
            ].map((key) => (
              <button
                key={key}
                onClick={() => toast(t(key), { description: t("portal.toast.protected_workspace") })}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111922] p-5 text-left hover:border-[#b8f36b]/50"
              >
                <ShieldCheck className="text-[#b8f36b]" />
                <div>
                  <b>{t(key)}</b>
                  <p className="mt-1 text-xs text-white/40">{t("portal.admin.toast.access_denied")}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* SETTINGS SECTION */}
        {section === "settings" && (
          <div className="mt-8 max-w-2xl space-y-4">
            {[
              "portal.settings.browser_notifications",
              "portal.settings.completion_sound",
              "portal.settings.ai_voice",
              "portal.settings.quiet_hours",
              "portal.settings.privacy_export",
            ].map((key) => (
              <div key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111922] p-5">
                <div>
                  <b>{t(key)}</b>
                  <p className="mt-1 text-xs text-white/40">{t("portal.settings.prototype")}</p>
                </div>
                <div className="size-5 rounded-full border-2 border-[#b8f36b] bg-[#b8f36b]/20" />
              </div>
            ))}
          </div>
        )}

        <a href="/" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#b8f36b]">
          <ChevronLeft className="size-4" />
          {t("portal.back_to_campus")}
        </a>
      </div>
    </main>
  );
}
