import { useMemo, useState } from "react";
import { Award, BookOpen, ChevronLeft, Download, FileSearch, Languages, LockKeyhole, Search, Settings2, ShieldCheck } from "lucide-react";
import { CAMPUS_PROGRAMS } from "../data/campus.generated";
import { useCampusProgress } from "../hooks/useCampusProgress";
import { realLearningRecord, searchCampusCatalog } from "../lib/portal-data";
import { useTranslation, type Lang } from "@/lib/i18n";

type PortalSection = "record" | "credentials" | "research" | "faculty" | "admin" | "settings";

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "es", label: "Español" }, { code: "en", label: "English" },
  { code: "ca", label: "Català" }, { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" }, { code: "pt", label: "Português" },
  { code: "de", label: "Deutsch" }, { code: "nl", label: "Nederlands" },
  { code: "ja", label: "日本語" },
];

/**
 * Portal content comes from the same curriculum and browser progress as /campus.
 * It never renders sample student grades, fabricated certifications or fake research.
 */
export default function Portal({ section }: { section: PortalSection }) {
  const { t, lang, setLang } = useTranslation();
  const { state } = useCampusProgress();
  const [query, setQuery] = useState("");
  const records = useMemo(() => realLearningRecord(CAMPUS_PROGRAMS, state), [state]);
  const results = useMemo(() => searchCampusCatalog(CAMPUS_PROGRAMS, query), [query]);
  const completed = records.filter(item => item.complete);
  const spanish = lang === "es";
  const copy = spanish ? {
    source: "Datos reales del currículo y del progreso guardado en este navegador.",
    unverified: "El progreso se marca manualmente. No equivale a una evaluación ni a una certificación emitida.",
    download: "Exportar expediente personal (JSON)",
    resume: "Continuar aprendiendo",
    empty: "Todavía no hay ninguna actividad marcada como completada.",
    credential: "No hay credenciales verificadas emitidas por SECURE T.",
    achievement: "Programa completado según el registro local",
    course: "Abrir curso",
    weeks: "Semanas completadas",
    searchLabel: "Buscar contenido educativo",
    searchPlaceholder: "Buscar cursos, semanas y fuentes…",
    searchHelp: "La búsqueda consulta el currículo disponible, no un motor externo.",
    none: "No se encontraron coincidencias.",
    start: "Escribe un término para buscar.",
    restricted: "Área institucional no disponible públicamente",
    restrictedHelp: "Esta sección necesita autenticación, roles y servicios reales. No se muestran estudiantes, evaluaciones ni indicadores inventados.",
    settings: "Preferencias reales de esta sesión",
    language: "Idioma de la interfaz",
    notifications: "Configurar notificaciones del navegador",
    privacy: "Tus marcas de progreso se almacenan localmente. Puedes exportarlas o borrarlas desde Progreso.",
    progress: "Gestionar progreso y privacidad",
    searchKinds: { program: "Programa", week: "Semana", source: "Fuente" },
  } : {
    source: "Real curriculum and progress saved in this browser.",
    unverified: "Progress is self-reported. It is not an assessed or issued certification.",
    download: "Export personal learning record (JSON)",
    resume: "Continue learning",
    empty: "No activities have been marked completed yet.",
    credential: "SECURE T has not issued any verified credentials.",
    achievement: "Program completed according to local records",
    course: "Open course",
    weeks: "Completed weeks",
    searchLabel: "Search learning content",
    searchPlaceholder: "Search courses, weeks and sources…",
    searchHelp: "Search uses available curriculum, not a remote search engine.",
    none: "No matching content.",
    start: "Enter a search term.",
    restricted: "Institutional area not publicly available",
    restrictedHelp: "This section requires real authentication, roles and services. No fabricated student metrics or assessments are shown.",
    settings: "Working session preferences",
    language: "Interface language",
    notifications: "Configure browser notifications",
    privacy: "Progress checks are stored locally. Export or erase them on the Progress page.",
    progress: "Manage progress and privacy",
    searchKinds: { program: "Program", week: "Week", source: "Source" },
  };

  const exportRecord = () => {
    const payload = {
      format: "secure-t-personal-learning-record-v1",
      exportedAt: new Date().toISOString(),
      certification: "none; self-reported local progress only",
      records,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "secure-t-learning-record.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <main className="min-h-screen bg-[#0b1117] px-5 py-8 text-[#ecf2f4] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#b8f36b]">SECURE T · Campus</p>
            <h1 className="mt-3 font-display text-4xl font-bold">{t("portal." + section)}</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">{copy.source}</p>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm">
            <Languages aria-hidden="true" className="size-4 text-[#b8f36b]" />
            <span className="sr-only">{copy.language}</span>
            <select aria-label={copy.language} className="bg-[#0b1117] text-white" value={lang}
              onChange={event => setLang(event.target.value as Lang)}>
              {LANGUAGES.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}
            </select>
          </label>
        </header>

        {section === "record" && (
          <section className="mt-8 space-y-6" aria-label={t("portal.record")}>
            <p className="max-w-3xl text-sm text-white/60">{copy.unverified}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={exportRecord} className="inline-flex items-center gap-2 rounded-xl bg-[#b8f36b] px-4 py-3 text-sm font-bold text-[#071016]">
                <Download aria-hidden="true" className="size-4" />{copy.download}
              </button>
              <a href="/progress" className="rounded-xl border border-white/20 px-4 py-3 text-sm hover:border-white/60">{copy.resume}</a>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {records.map(item => (
                <article key={item.slug} className="rounded-2xl border border-white/10 bg-[#111922] p-6">
                  <BookOpen aria-hidden="true" className="size-5 text-[#b8f36b]" />
                  <h2 className="mt-3 font-display text-xl font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm text-white/65">{item.done}/{item.total} · {item.percent}% · {copy.weeks}: {item.completedWeeks}/{item.totalWeeks}</p>
                  <div role="progressbar" aria-label={item.title} aria-valuenow={item.percent} aria-valuemin={0} aria-valuemax={100}
                    className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-[#b8f36b]" style={{ width: item.percent + "%" }} />
                  </div>
                  <a href={item.href} className="mt-5 inline-flex font-semibold text-[#b8f36b] hover:underline">{copy.course}</a>
                </article>
              ))}
            </div>
          </section>
        )}

        {section === "credentials" && (
          <section className="mt-8 space-y-5" aria-label={t("portal.credentials")}>
            <div className="rounded-2xl border border-white/20 bg-[#111922] p-6">
              <LockKeyhole aria-hidden="true" className="size-6 text-[#b8f36b]" />
              <h2 className="mt-3 text-xl font-semibold">{copy.credential}</h2>
              <p className="mt-2 text-sm text-white/65">{copy.unverified}</p>
            </div>
            {completed.map(item => (
              <article key={item.slug} className="rounded-2xl border border-[#b8f36b]/25 p-5">
                <Award aria-hidden="true" className="size-5 text-[#b8f36b]" />
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-white/60">{copy.achievement}</p>
              </article>
            ))}
            {completed.length === 0 && <p className="text-white/60">{copy.empty}</p>}
            <a href="/progress" className="inline-flex font-semibold text-[#b8f36b] hover:underline">{copy.resume}</a>
          </section>
        )}

        {section === "research" && (
          <section className="mt-8" aria-label={t("portal.research")}>
            <label htmlFor="portal-research-query" className="mb-3 block text-sm font-semibold">{copy.searchLabel}</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 focus-within:border-[#b8f36b]">
              <Search aria-hidden="true" className="size-5 text-[#b8f36b]" />
              <input id="portal-research-query" type="search" value={query} onChange={event => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder} className="w-full bg-transparent py-4 text-white outline-none placeholder:text-white/40" />
            </div>
            <p className="mt-2 text-sm text-white/60">{copy.searchHelp}</p>
            <p role="status" aria-live="polite" className="mt-6 text-sm text-white/60">
              {!query.trim() ? copy.start : results.length ? String(results.length) + " resultados / results" : copy.none}
            </p>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {results.map((result, index) => (
                <li key={result.kind + result.href + index}>
                  <a href={result.href} target={result.kind === "source" ? "_blank" : undefined}
                    rel={result.kind === "source" ? "noopener noreferrer" : undefined}
                    className="block rounded-xl border border-white/10 bg-[#111922] p-5 hover:border-[#b8f36b]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b8f36b]">
                    <FileSearch aria-hidden="true" className="size-5 text-[#6be7f3]" />
                    <span className="mt-3 block text-xs font-semibold uppercase text-[#b8f36b]">{copy.searchKinds[result.kind]}</span>
                    <strong className="mt-1 block">{result.title}</strong>
                    <span className="mt-2 block text-sm text-white/60">{result.subtitle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(section === "faculty" || section === "admin") && (
          <section className="mt-8 max-w-2xl rounded-2xl border border-white/15 bg-[#111922] p-7">
            <ShieldCheck aria-hidden="true" className="size-7 text-[#b8f36b]" />
            <h2 className="mt-4 text-xl font-bold">{copy.restricted}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{copy.restrictedHelp}</p>
          </section>
        )}

        {section === "settings" && (
          <section className="mt-8 max-w-2xl space-y-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><Settings2 aria-hidden="true" className="size-5" />{copy.settings}</h2>
            <label htmlFor="portal-settings-language" className="block text-sm font-medium">{copy.language}</label>
            <select id="portal-settings-language" value={lang} onChange={event => setLang(event.target.value as Lang)}
              className="w-full rounded-xl border border-white/20 bg-[#111922] p-3 text-white">
              {LANGUAGES.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}
            </select>
            <p className="text-sm leading-relaxed text-white/65">{copy.privacy}</p>
            <button type="button" onClick={exportRecord} className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm hover:border-white/60">
              <Download aria-hidden="true" className="size-4" />{copy.download}
            </button>
            <a href="/progress" className="block font-semibold text-[#b8f36b] hover:underline">{copy.progress}</a>
            <a href="/notifications" className="block font-semibold text-[#b8f36b] hover:underline">{copy.notifications}</a>
          </section>
        )}
        <a href="/campus" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#b8f36b] hover:underline">
          <ChevronLeft aria-hidden="true" className="size-4" />{t("portal.back_to_campus")}
        </a>
      </div>
    </main>
  );
}
