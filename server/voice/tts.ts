/**
 * Text-to-Speech via Hugging Face + Kokoro
 * Generates natural speech in ES, PT, EN
 */

export interface TTSOptions {
  text: string;
  locale: "es" | "pt" | "en";
  speaker?: "af"; // Kokoro supports multiple speakers
}

/**
 * Generate speech using Hugging Face Inference API + Kokoro
 * Returns audio buffer (MP3)
 */
export async function generateSpeech(options: TTSOptions): Promise<Buffer> {
  const { text, locale } = options;
  const hfToken = process.env.HF_API_KEY;
  const model = process.env.HF_MODEL_TTS || "hexgrad/Kokoro-82M";

  if (!hfToken) {
    throw new Error("HF_API_KEY not configured");
  }

  if (!text || text.trim().length === 0) {
    throw new Error("Text is required");
  }

  // Kokoro API expects language codes
  const langMap: Record<string, string> = {
    es: "es",
    pt: "pt",
    en: "en",
  };

  const lang = langMap[locale] || "es";

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            language: lang,
            speaker: "af",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HF API error: ${response.status} - ${err}`);
    }

    // Response is audio/wav or audio/mp3
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error("TTS error:", error);
    throw error;
  }
}

/**
 * Safe wrapper: if TTS fails, return null (frontend falls back to browser TTS)
 */
export async function generateSpeechSafe(
  options: TTSOptions
): Promise<Buffer | null> {
  try {
    return await generateSpeech(options);
  } catch (error) {
    console.warn("TTS generation failed, will use browser fallback:", error);
    return null;
  }
}
