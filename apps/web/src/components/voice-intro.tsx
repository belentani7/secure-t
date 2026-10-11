"use client";

import { useEffect, useRef, useState } from "react";
import { translator, type Locale } from "@secure-t/shared";
import { currentToken } from "@/lib/progress-store";
import { recordVoiceListened } from "@/lib/xapi-store";
import { asset } from "@/lib/site";

/**
 * Voz humanizada de bienvenida.
 *
 * Reproduce el MP3 publicado (`voice/<idioma>/welcome.mp3`). Si el archivo no
 * está disponible —o el navegador bloquea el audio— usa la síntesis del
 * sistema con el mismo guion: el estudiante nunca se queda sin poder escuchar.
 *
 * Nota de rendimiento: este componente **no** importa `@secure-t/agent`. El
 * guion y la ruta del audio se resuelven aquí para que la portada no arrastre
 * el catálogo de docentes ni el material del campus al cargar la página.
 */

const WELCOME: Record<Locale, string> = {
  pt: "Bem-vindo ao campus secure T. Quatro programas de vinte semanas, gratuitos e sem registo. O agente AURUM responde com o material do campus e diz quando não sabe.",
  es: "Bienvenido al campus secure T. Cuatro programas de veinte semanas, gratuitos y sin registro. El agente AURUM responde con el material del campus y dice cuándo no sabe.",
  en: "Welcome to the secure T campus. Four twenty-week programmes, free and with no sign-up. The AURUM agent answers from campus material and says when it does not know.",
  ca: "Benvingut al campus secure T. Quatre programes de vint setmanes, gratuïts i sense registre. L'agent AURUM respon amb el material del campus i diu quan no ho sap."
};

const BCP47: Record<Locale, string> = { pt: "pt-PT", es: "es-ES", en: "en-GB", ca: "ca-ES" };

export function VoiceIntro({ locale, assetName = "welcome" }: { locale: Locale; assetName?: string }) {
  const t = translator(locale);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"mp3" | "system" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakWithSystem = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(WELCOME[locale]);
    utterance.lang = BCP47[locale];
    utterance.rate = 0.98;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    setMode("system");
    window.speechSynthesis.speak(utterance);
  };

  /** Bienvenida escuchada: queda en el registro xAPI como experiencia del curso. */
  const anotar = () => {
    recordVoiceListened(
      { token: currentToken(), locale, slug: "campus", title: t("campus.title") },
      { name: "Bienvenida" }
    );
  };

  const play = () => {
    if (playing) {
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
      setPlaying(false);
      return;
    }
    const audio = new Audio(asset(`/voice/${locale}/${assetName}.mp3`));
    audioRef.current = audio;
    audio.onended = () => setPlaying(false);
    audio.onerror = () => speakWithSystem();
    setMode("mp3");
    setPlaying(true);
    anotar();
    void audio.play().catch(() => speakWithSystem());
  };

  return (
    <button type="button" className="btn btn-ghost" onClick={play} aria-pressed={playing}>
      <span aria-hidden="true">{playing ? "■" : "▶"}</span>
      {playing ? t("week.stop") : t("week.listen")}
      {mode === "system" && playing ? <span className="mono text-[0.7rem]">{t("week.noTranscript")}</span> : null}
    </button>
  );
}
