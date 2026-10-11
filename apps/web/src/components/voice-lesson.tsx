"use client";

import { useEffect, useRef, useState } from "react";
import { lecturerFor } from "@secure-t/agent";
import { translator, type Locale } from "@secure-t/shared";
import { currentToken } from "@/lib/progress-store";
import { recordVoiceListened } from "@/lib/xapi-store";
import { asset } from "@/lib/site";

/**
 * Agente de clase con voz humanizada.
 *
 * Reproduce la lectura grabada del docente del programa
 * (`/voice/<idioma>/<curso>.mp3`); si aún no existe —el material de voz se
 * publica por lotes— lee el texto de la semana con la voz del sistema, de modo
 * que escuchar siempre funcione y nunca se prometa voz que no está.
 */
export function VoiceLesson({
  locale,
  slug,
  week,
  title = "",
  text = ""
}: {
  locale: Locale;
  slug: string;
  week: number;
  title?: string;
  text?: string;
}) {
  const t = translator(locale);
  const [playing, setPlaying] = useState(false);
  const [source, setSource] = useState<"recorded" | "system" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lecturer = lecturerFor(slug);

  /** Deja constancia en el registro xAPI de que la lección se ha escuchado. */
  const anotar = () => {
    recordVoiceListened(
      { token: currentToken(), locale, slug, title: title || slug },
      { week, name: lecturer ? `Semana ${week} · ${lecturer.name}` : `Semana ${week}` }
    );
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const stop = () => {
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setPlaying(false);
      return;
    }
    const body = text || (lecturer ? `${lecturer.label[locale]}. ${lecturer.script[locale]}` : t("week.noTranscript"));
    const utterance = new SpeechSynthesisUtterance(body.slice(0, 1200));
    utterance.lang = locale === "pt" ? "pt-PT" : locale === "es" ? "es-ES" : locale === "ca" ? "ca-ES" : "en-GB";
    utterance.rate = 0.97;
    utterance.pitch = 1.02;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    setSource("system");
    anotar();
    window.speechSynthesis.speak(utterance);
  };

  const toggle = () => {
    if (playing) {
      stop();
      return;
    }
    const audio = new Audio(asset(`/voice/${locale}/${slug}.mp3`));
    audioRef.current = audio;
    audio.onended = () => setPlaying(false);
    audio.onerror = () => speak();
    setPlaying(true);
    setSource("recorded");
    anotar();
    void audio.play().catch(() => speak());
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" className="btn btn-ghost" onClick={toggle} aria-pressed={playing}>
        <span aria-hidden="true">{playing ? "■" : "🔊"}</span>
        {playing ? t("week.stop") : t("week.speak")}
        <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">{locale.toUpperCase()}</span>
      </button>
      {week > 0 && source ? (
        <span className="mono text-[0.68rem] text-[var(--aurum-muted)]">
          {source === "recorded" ? t("week.transcript") : t("week.noTranscript")}
        </span>
      ) : null}
    </div>
  );
}
