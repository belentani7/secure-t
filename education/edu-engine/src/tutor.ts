export type TutorLang = "pt" | "es" | "en" | "ca";

export const TUTOR_LOCALES: Record<string, string> = {
  pt: "pt-BR",
  es: "es-ES",
  ca: "ca-ES",
  en: "en-US",
};

export interface TutorMessage {
  text: string;
  lang: string;
}

const WELCOME: Record<TutorLang, (name: string) => string> = {
  es: (n) => `Hola ${n || "estudiante"}, estoy aquí para acompañarte en esta lección.`,
  pt: (n) => `Olá ${n || "aluno"}, estou aqui para te acompanhar nesta lição.`,
  en: (n) => `Hi ${n || "student"}, I'm here to support you through this lesson.`,
  ca: (n) => `Hola ${n || "estudiant"}, soc aquí per acompanyar-te en aquesta lliçó.`,
};

const CELEBRATE: Record<TutorLang, string[]> = {
  es: ["¡Excelente! Has acertado.", "¡Muy bien! Continúa así.", "¡Correcto! Tu evidencia se acumula."],
  pt: ["Excelente! Você acertou.", "Muito bem! Continue assim.", "Correto! Sua evidência se acumula."],
  en: ["Excellent! You got it right.", "Well done! Keep going.", "Correct! Your evidence is piling up."],
  ca: ["Excel·lent! Ho has encertat.", "Molt bé! Continua així.", "Correcte! La teva evidència s'acumula."],
};

const ENCOURAGE: Record<TutorLang, string[]> = {
  es: ["No pasa nada, vuelve a intentarlo.", "Casi lo tienes. Revisa la explicación y repite."],
  pt: ["Tudo bem, tente de novo.", "Quase lá. Revise a explicação e repita."],
  en: ["No worries, try again.", "Almost there. Review the explanation and retry."],
  ca: ["No passa res, torna-ho a provar.", "Quasi ho tens. Revisa l'explicació i torna-ho a intentar."],
};

export class TutorAgent {
  private queue: TutorMessage[] = [];
  private speaking = false;
  private index = 0;
  readonly locales: Record<string, string> = { ...TUTOR_LOCALES };

  voiceAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  say(text: string, lang: string | TutorLang = "pt"): void {
    this.queue.push({ text, lang: this.resolveLang(lang) });
    this.drain();
  }

  welcome(name: string, lang: string | TutorLang = "pt"): void {
    this.say(WELCOME[this.normalize(lang)](name), lang);
  }

  celebrate(lang: string | TutorLang = "pt"): void {
    const arr = CELEBRATE[this.normalize(lang)];
    this.say(arr[this.index % arr.length], lang);
    this.index += 1;
  }

  encourage(lang: string | TutorLang = "pt"): void {
    const arr = ENCOURAGE[this.normalize(lang)];
    this.say(arr[this.index % arr.length], lang);
    this.index += 1;
  }

  stop(): void {
    if (this.voiceAvailable()) window.speechSynthesis.cancel();
    this.queue = [];
    this.speaking = false;
  }

  private normalize(lang: string): TutorLang {
    const l = lang.toLowerCase();
    if (l.startsWith("pt")) return "pt";
    if (l === "ca" || l === "ca-es") return "ca";
    if (l === "en") return "en";
    if (l.startsWith("es")) return "es";
    return "pt";
  }

  private resolveLang(lang: string): string {
    return this.locales[this.normalize(lang)] ?? this.locales.pt;
  }

  private drain(): void {
    if (this.speaking || !this.queue.length) return;
    if (!this.voiceAvailable()) {
      this.queue = [];
      return;
    }
    const next = this.queue.shift();
    if (!next) return;
    const u = new SpeechSynthesisUtterance(next.text);
    u.lang = this.resolveLang(next.lang);
    u.rate = 0.96;
    this.speaking = true;
    u.onend = () => {
      this.speaking = false;
      this.drain();
    };
    u.onerror = () => {
      this.speaking = false;
      this.drain();
    };
    window.speechSynthesis.speak(u);
  }
}
