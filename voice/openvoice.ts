import type { VoiceProvider, VoiceRequest } from "./provider";

/** OpenVoice adapter contract. The model runs outside the web process and is enabled only when configured. */
export function openVoiceProvider(baseUrl = process.env.OPENVOICE_URL): VoiceProvider {
  return {
    id: "openvoice",
    languages: ["es", "pt", "en"],
    async synthesize(request: VoiceRequest) {
      if (!request.consent) throw new Error("voice_consent_required");
      if (!baseUrl) throw new Error("openvoice_provider_not_configured");
      const text = (request.text ?? "").trim();
      if (text.length < 1) throw new Error("openvoice_text_required");
      if (text.length > 2000) throw new Error("openvoice_text_too_long");
      const ctl = new AbortController();
      const to = setTimeout(() => ctl.abort(), 15000);
      try {
        const response = await fetch(`${baseUrl.replace(/\/$/, "")}/synthesize`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, language: request.language, voice: request.voice }), signal: ctl.signal });
        if (!response.ok) throw new Error(`openvoice_${response.status}`);
        const data = await response.json() as { audioUrl?: unknown };
        if (typeof data.audioUrl !== "string" || data.audioUrl.length === 0) throw new Error("openvoice_empty_audio");
        return { audioUrl: data.audioUrl, provider: "openvoice" };
      } finally {
        clearTimeout(to);
      }
    },
  };
}
