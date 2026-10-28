import { useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Link } from "wouter";

import SiteHeader from "../components/SiteHeader";
import { CAMPUS_PROGRAMS } from "../data/campus.generated";
import { useCampusProgress } from "../hooks/useCampusProgress";
import {
  CAMPUS_PROGRESS_KEY,
  campusItems,
  courseProgress,
  globalProgress,
  isExamUnlocked,
  parseProgress,
  serializeProgress,
} from "../lib/progress";

function itemLabel(item: string) {
  if (item.startsWith("semana-")) return `Semana ${Number(item.slice(7))}`;
  if (item === "quiz") return "Quiz formativo";
  if (item === "laboratorio") return "Laboratorio + evidencia";
  if (item === "proyecto") return "Proyecto final";
  return "Examen final";
}

export default function Progress() {
  const { state, save, toggle } = useCampusProgress();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const programs = CAMPUS_PROGRAMS.map(program => ({
    ...program,
    items: campusItems(program.weeks.length),
  }));
  const global = globalProgress(state, programs);

  const announce = (message: string) => {
    setError("");
    setStatus(message);
  };

  const exportJson = () => {
    const blob = new Blob([serializeProgress(state)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "secure-t-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
    announce("Progreso exportado como JSON.");
  };

  const importJson = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      const next = parseProgress(text);
      save(next);
      announce(`Progreso importado: ${Object.keys(next).length} elementos.`);
    } catch {
      setError("No se pudo leer el archivo. Debe ser un JSON válido.");
      setStatus("");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const reset = () => {
    if (!window.confirm("¿Borrar todo el progreso guardado en este navegador?")) {
      return;
    }
    save({});
    announce("Progreso local borrado.");
  };

  return (
    <div className="min-h-screen bg-[#071016] text-[#f3f7f3]">
      <a
        href="#progress-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#b8f36b] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#071016]"
      >
        Skip to content
      </a>
      <SiteHeader />

      <main id="progress-main" className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-[.98] tracking-[-.045em] sm:text-6xl">
              Your progress,
              <br />
              <span className="text-[#b8f36b]">on your device.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">
              No account, no email, no tracking. This page reads and writes the
              same local key as the static campus, so what you mark here appears
              there and the other way around.
            </p>
          </div>
          <div className="border-t border-white/10 pt-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm text-white/45">Global progress</p>
              <p className="font-mono text-sm text-[#b8f36b]">
                {global.done}/{global.total} · {global.percent}%
              </p>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuenow={global.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Global campus progress"
            >
              <div
                className="h-full rounded-full bg-[#b8f36b]"
                style={{ width: `${global.percent}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-white/35">
              Stored under <code className="font-mono">{CAMPUS_PROGRESS_KEY}</code>{" "}
              in localStorage. Never sent to a server.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5"
          >
            <Download className="size-4" /> Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5"
          >
            <Upload className="size-4" /> Import JSON
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-[#ff8377]/30 px-4 py-2.5 text-sm font-semibold text-[#ff8377] transition hover:bg-[#ff8377]/10"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={event => void importJson(event.target.files?.[0])}
          />
          <p
            role="status"
            aria-live="polite"
            className={`text-sm ${error ? "text-[#ff8377]" : "text-[#b8f36b]"}`}
          >
            {error || status}
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {programs.map(program => {
            const progress = courseProgress(state, program.slug, program.items);
            const examUnlocked = isExamUnlocked(
              state,
              program.slug,
              program.items,
            );
            return (
              <section
                key={program.slug}
                aria-labelledby={`${program.slug}-title`}
                className="border-t border-white/10 pt-6"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2
                      id={`${program.slug}-title`}
                      className="font-display text-2xl font-bold"
                    >
                      {program.title}
                    </h2>
                    <p className="mt-1 text-sm text-white/45">
                      {progress.done}/{progress.total} · {progress.percent}% ·{" "}
                      {program.hours} h
                    </p>
                  </div>
                  <a
                    href={program.links.course}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#b8f36b] hover:underline"
                  >
                    Open course <ArrowUpRight className="size-4" />
                  </a>
                </div>

                <div className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  {program.items.map(item => {
                    const id = `${program.slug}/${item}`;
                    const done = state[id] === true;
                    const locked = item === "examen" && !examUnlocked;
                    return (
                      <label
                        key={item}
                        className={`flex items-start gap-2.5 rounded-lg px-2 py-2 text-sm transition ${
                          locked
                            ? "text-white/30"
                            : "text-white/65 hover:bg-white/5"
                        }`}
                        title={
                          locked
                            ? "Se desbloquea al completar semanas, quiz y laboratorio"
                            : undefined
                        }
                      >
                        <input
                          type="checkbox"
                          checked={done}
                          disabled={locked}
                          onChange={event =>
                            toggle(program.slug, item, event.target.checked)
                          }
                          className="mt-0.5 size-4 accent-[#b8f36b]"
                        />
                        <span className="flex-1">{itemLabel(item)}</span>
                        {locked && <LockKeyhole className="size-3.5" />}
                        {done && !locked && (
                          <CheckCircle2 className="size-3.5 text-[#b8f36b]" />
                        )}
                      </label>
                    );
                  })}
                </div>
                {progress.complete && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-[#b8f36b]">
                    <ShieldCheck className="size-4" /> Programa completo en tu
                    registro local. La credencial real requiere revisión humana.
                  </p>
                )}
              </section>
            );
          })}
        </div>

        <p className="mt-14 max-w-3xl text-sm leading-relaxed text-white/40">
          Este registro es local y no constituye un expediente académico
          oficial. Para conservarlo, exporta el JSON antes de borrar los datos
          del navegador. Puedes importarlo en otro dispositivo.{" "}
          <Link href="/campus" className="text-[#b8f36b] hover:underline">
            Volver al campus
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
