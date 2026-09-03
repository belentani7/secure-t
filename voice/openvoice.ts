import type { VoiceProvider, VoiceRequest } from "./provider";

/** OpenVoice adapter contract. The model runs outside the web process and is enabled only when configured. */
export function openVoiceProvider(baseUrl = process.env.OPENVOICE_URL): VoiceProvider {
  return {
    id: "openvoice",
    languages: ["es", "pt", "en"],
    async synthesize(request: VoiceRequest) {
      if (!request.consent) throw new Error("voice_consent_required");
      if (!baseUrl) throw new Error("openvoice_provider_not_configured");
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/synthesize`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: request.text, language: request.language, voice: request.voice }) });
      if (!response.ok) throw new Error(`openvoice_${response.status}`);
      const data = await response.json() as { audioUrl?: string };
      if (!data.audioUrl) throw new Error("openvoice_empty_audio");
      return { audioUrl: data.audioUrl, provider: "openvoice" };
    },
  };
}
