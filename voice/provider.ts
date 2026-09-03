export type VoiceLanguage = "es" | "pt" | "en";
export type VoiceRequest = { text: string; language: VoiceLanguage; voice?: string; consent: boolean };
export type VoiceProvider = { id: string; languages: VoiceLanguage[]; synthesize(request: VoiceRequest): Promise<{ audioUrl: string; provider: string }> };
export function browserFallbackProvider(): VoiceProvider { return { id: "browser-fallback", languages: ["es", "pt", "en"], async synthesize(request) { if (!request.consent) throw new Error("voice_consent_required"); return { audioUrl: "browser://speech-synthesis", provider: "browser-fallback" }; } }; }
