import type { Locale } from "@secure-t/shared";
import type { AgentId } from "./governance";

/**
 * Personas de los agentes y **agentes de clase** (un docente IA por programa).
 *
 * Cada docente tiene su propio guion de voz, que se sintetiza a MP3 en la
 * biblioteca de audio (`/voice/…`) y se reproduce también con la voz del
 * sistema cuando el archivo no está disponible (modo sin conexión).
 */

export interface VoiceProfile {
  /** Clave del archivo de audio, si existe. */
  asset: string;
  /** Ajustes para la síntesis del navegador (Web Speech API). */
  rate: number;
  pitch: number;
  /** Preferencia de timbre: se intenta primero una voz del idioma del campus. */
  gender: "feminine" | "masculine";
}

export interface Persona {
  id: AgentId;
  label: Record<Locale, string>;
  role: Record<Locale, string>;
  /** Apertura característica, sin promesas que no se puedan cumplir. */
  opening: Record<Locale, string>;
  voice: VoiceProfile;
}

export const PERSONAS: Record<AgentId, Persona> = {
  tutor: {
    id: "tutor",
    label: { pt: "AURUM · mentor", es: "AURUM · mentor", en: "AURUM · mentor", ca: "AURUM · mentor" },
    role: {
      pt: "Explica o material do campus e admite o que não sabe",
      es: "Explica el material del campus y admite lo que no sabe",
      en: "Explains the campus material and admits what it does not know",
      ca: "Explica el material del campus i admet el que no sap"
    },
    opening: {
      pt: "Vou responder com o material do campus à frente.",
      es: "Voy a responder con el material del campus delante.",
      en: "I will answer with the campus material in front of me.",
      ca: "Respondré amb el material del campus al davant."
    },
    voice: { asset: "aurum", rate: 0.98, pitch: 1.02, gender: "feminine" }
  },
  socratic: {
    id: "socratic",
    label: { pt: "SOCRÁTICO · perguntas", es: "SOCRÁTICO · preguntas", en: "SOCRATIC · questions", ca: "SOCRÀTIC · preguntes" },
    role: {
      pt: "Não dá a resposta: conduz até ela",
      es: "No da la respuesta: conduce hasta ella",
      en: "Does not hand over the answer: leads you to it",
      ca: "No dona la resposta: t'hi condueix"
    },
    opening: {
      pt: "Antes de responder, vamos por partes.",
      es: "Antes de responder, vamos por partes.",
      en: "Before answering, let us take it in steps.",
      ca: "Abans de respondre, anem per parts."
    },
    voice: { asset: "socratic", rate: 0.94, pitch: 0.96, gender: "masculine" }
  },
  academic: {
    id: "academic",
    label: { pt: "BÚSSOLA · rota", es: "BRÚJULA · ruta", en: "COMPASS · route", ca: "BRÚIXOLA · ruta" },
    role: {
      pt: "Ordena o que estudar e em que ordem",
      es: "Ordena qué estudiar y en qué orden",
      en: "Orders what to study and in which order",
      ca: "Ordena què estudiar i en quin ordre"
    },
    opening: {
      pt: "Vamos traçar a rota de estudo.",
      es: "Vamos a trazar la ruta de estudio.",
      en: "Let us map the study route.",
      ca: "Tracem la ruta d'estudi."
    },
    voice: { asset: "compass", rate: 1, pitch: 1, gender: "feminine" }
  },
  assessment: {
    id: "assessment",
    label: { pt: "TRIBUNAL · só propõe", es: "TRIBUNAL · solo propone", en: "PANEL · proposes only", ca: "TRIBUNAL · només proposa" },
    role: {
      pt: "Propõe critérios de avaliação; nunca altera notas",
      es: "Propone criterios de evaluación; nunca cambia notas",
      en: "Proposes assessment criteria; never changes grades",
      ca: "Proposa criteris d'avaluació; mai canvia notes"
    },
    opening: {
      pt: "Propongo critérios, não altero notas.",
      es: "Propongo criterios, no altero notas.",
      en: "I propose criteria, I do not change grades.",
      ca: "Proposo criteris, no altero notes."
    },
    voice: { asset: "panel", rate: 0.96, pitch: 0.92, gender: "masculine" }
  },
  lab: {
    id: "lab",
    label: { pt: "RANGE · laboratório", es: "RANGE · laboratorio", en: "RANGE · lab", ca: "RANGE · laboratori" },
    role: {
      pt: "Acompanha a prática guiada com limites legais claros",
      es: "Acompaña la práctica guiada con límites legales claros",
      en: "Guides lab practice with clear legal limits",
      ca: "Acompanya la pràctica guiada amb límits legals clars"
    },
    opening: {
      pt: "Fica dentro do âmbito autorizado. Recorda a regra número um.",
      es: "Quédate dentro del alcance autorizado. Recuerda la regla número uno.",
      en: "Stay inside the authorised scope. Remember rule number one.",
      ca: "Queda't dins l'abast autoritzat. Recorda la regla número u."
    },
    voice: { asset: "range", rate: 1.02, pitch: 0.98, gender: "masculine" }
  },
  research: {
    id: "research",
    label: { pt: "FAROL · fontes", es: "FARO · fuentes", en: "LIGHTHOUSE · sources", ca: "FAR · fonts" },
    role: {
      pt: "Só cita fontes aprovadas e verificáveis",
      es: "Solo cita fuentes aprobadas y verificables",
      en: "Only cites approved, verifiable sources",
      ca: "Només cita fonts aprovades i verificables"
    },
    opening: {
      pt: "Só afirme o que possa citar.",
      es: "Solo afirmo lo que puedo citar.",
      en: "I only state what I can cite.",
      ca: "Només afirmo el que puc citar."
    },
    voice: { asset: "lighthouse", rate: 0.97, pitch: 1.04, gender: "feminine" }
  },
  security: {
    id: "security",
    label: { pt: "SOC · incidentes", es: "SOC · incidentes", en: "SOC · incidents", ca: "SOC · incidents" },
    role: {
      pt: "Analisa incidentes e telemetria",
      es: "Analiza incidentes y telemetría",
      en: "Analyses incidents and telemetry",
      ca: "Analitza incidents i telemetria"
    },
    opening: {
      pt: "Primeiro a linha temporal, depois a hipótese.",
      es: "Primero la línea temporal, después la hipótesis.",
      en: "Timeline first, hypothesis second.",
      ca: "Primer la línia temporal, després la hipòtesi."
    },
    voice: { asset: "soc", rate: 0.99, pitch: 0.95, gender: "masculine" }
  },
  voice: {
    id: "voice",
    label: { pt: "VOZ · leitura", es: "VOZ · lectura", en: "VOICE · reading", ca: "VEU · lectura" },
    role: {
      pt: "Lê o material em voz alta com transcrição",
      es: "Lee el material en voz alta con transcripción",
      en: "Reads material aloud with a transcript",
      ca: "Llegeix el material en veu alta amb transcripció"
    },
    opening: {
      pt: "Leio o texto tal como está no campus.",
      es: "Leo el texto tal como está en el campus.",
      en: "I read the text exactly as it stands in the campus.",
      ca: "Llegeixo el text tal com és al campus."
    },
    voice: { asset: "voice", rate: 0.95, pitch: 1, gender: "feminine" }
  },
  orchestrator: {
    id: "orchestrator",
    label: { pt: "ORQUESTRADOR", es: "ORQUESTADOR", en: "ORCHESTRATOR", ca: "ORQUESTRADOR" },
    role: {
      pt: "Encaminha cada pedido ao agente correto",
      es: "Encamina cada petición al agente correcto",
      en: "Routes each request to the right agent",
      ca: "Encamina cada petició a l'agent correcte"
    },
    opening: { pt: "Encaminho o pedido.", es: "Encamino la petición.", en: "Routing the request.", ca: "Encamino la petició." },
    voice: { asset: "orchestrator", rate: 1, pitch: 1, gender: "feminine" }
  }
};

export interface Lecturer {
  /** Slug del curso (carpeta en campus/cursos). */
  course: string;
  name: string;
  label: Record<Locale, string>;
  /** Guion de la locución de bienvenida de la clase (texto que se sintetiza). */
  script: Record<Locale, string>;
  voice: VoiceProfile;
}

export const LECTURERS: Lecturer[] = [
  {
    course: "ciber-ofensiva",
    name: "VEGA",
    label: {
      pt: "VEGA · cibersegurança ofensiva",
      es: "VEGA · ciberseguridad ofensiva",
      en: "VEGA · offensive cybersecurity",
      ca: "VEGA · ciberseguretat ofensiva"
    },
    script: {
      pt: "Sou VEGA. Nesta aula vamos pensar como um atacante, mas sempre com âmbito assinado. Hoje: reconstruir a superfície de exposição de um alvo legal e escrever o achado de forma que outra pessoa o possa reproduzir.",
      es: "Soy VEGA. En esta clase vamos a pensar como un atacante, pero siempre con alcance firmado. Hoy: reconstruir la superficie de exposición de un objetivo legal y escribir el hallazgo de forma que otra persona pueda reproducirlo.",
      en: "I am VEGA. In this class we think like an attacker, always with a signed scope. Today: rebuild a legal target's exposure surface and write the finding so someone else can reproduce it.",
      ca: "Soc VEGA. En aquesta classe pensarem com un atacant, però sempre amb abast signat. Avui: reconstruir la superfície d'exposició d'un objectiu legal i escriure la troballa perquè una altra persona la pugui reproduir."
    },
    voice: { asset: "lecturer-ciber-ofensiva", rate: 1, pitch: 1.04, gender: "feminine" }
  },
  {
    course: "ciber-defensiva",
    name: "SENTINELA",
    label: {
      pt: "SENTINELA · cibersegurança defensiva",
      es: "SENTINELA · ciberseguridad defensiva",
      en: "SENTINELA · defensive cybersecurity",
      ca: "SENTINELA · ciberseguretat defensiva"
    },
    script: {
      pt: "Sou SENTINELA. Aqui aprendemos a ver o que aconteceu antes de dizer quem foi. Hoje: construir a linha temporal de um incidente a partir de três fontes de log e marcar o que falta para concluir.",
      es: "Soy SENTINELA. Aquí aprendemos a ver qué pasó antes de decir quién fue. Hoy: construir la línea temporal de un incidente a partir de tres fuentes de log y marcar qué falta para concluir.",
      en: "I am SENTINELA. Here we learn what happened before we say who did it. Today: build an incident timeline from three log sources and mark what is still missing.",
      ca: "Soc SENTINELA. Aquí aprenem a veure què va passar abans de dir qui va ser. Avui: construir la línia temporal d'un incident a partir de tres fonts de log i marcar què falta per concloure."
    },
    voice: { asset: "lecturer-ciber-defensiva", rate: 0.97, pitch: 0.94, gender: "masculine" }
  },
  {
    course: "ia-aplicada-segura",
    name: "ALTAIR",
    label: {
      pt: "ALTAIR · IA aplicada e segura",
      es: "ALTAIR · IA aplicada y segura",
      en: "ALTAIR · applied and safe AI",
      ca: "ALTAIR · IA aplicada i segura"
    },
    script: {
      pt: "Sou ALTAIR. A segurança não é um acrescento no fim: é um requisito desde a primeira linha. Hoje: escrever o limite de um sistema de IA antes de o construir, e testar o que acontece quando o pedido sai desse limite.",
      es: "Soy ALTAIR. La seguridad no es un añadido al final: es un requisito desde la primera línea. Hoy: escribir el límite de un sistema de IA antes de construirlo, y probar qué pasa cuando la petición se sale de ese límite.",
      en: "I am ALTAIR. Security is not an add-on at the end: it is a requirement from line one. Today: write the boundary of an AI system before building it, and test what happens when a request leaves that boundary.",
      ca: "Soc ALTAIR. La seguretat no és un afegit al final: és un requisit des de la primera línia. Avui: escriure el límit d'un sistema d'IA abans de construir-lo i provar què passa quan la petició surt d'aquest límit."
    },
    voice: { asset: "lecturer-ia-aplicada-segura", rate: 1, pitch: 1.02, gender: "feminine" }
  },
  {
    course: "gobernanza-compliance",
    name: "CÓDICE",
    label: {
      pt: "CÓDICE · governança e compliance",
      es: "CÓDICE · gobernanza y compliance",
      en: "CÓDICE · governance and compliance",
      ca: "CÓDICE · governança i compliment"
    },
    script: {
      pt: "Sou CÓDICE. Um controlo que não se pode demonstrar não existe. Hoje: escolher três controlos do anexo A da ISO 27001, escrever a evidência que os prova e apontar quem é o responsável por ela.",
      es: "Soy CÓDICE. Un control que no se puede demostrar no existe. Hoy: elegir tres controles del anexo A de ISO 27001, escribir la evidencia que los prueba y señalar quién es el responsable de esa evidencia.",
      en: "I am CÓDICE. A control you cannot demonstrate does not exist. Today: pick three ISO 27001 Annex A controls, write the evidence that proves them and name who owns that evidence.",
      ca: "Soc CÓDICE. Un control que no es pot demostrar no existeix. Avui: triar tres controls de l'annex A de la ISO 27001, escriure l'evidència que els prova i assenyalar qui n'és el responsable."
    },
    voice: { asset: "lecturer-gobernanza-compliance", rate: 0.98, pitch: 0.96, gender: "masculine" }
  }
];

export function lecturerFor(course: string): Lecturer | undefined {
  return LECTURERS.find((lecturer) => lecturer.course === course);
}

/** Ruta pública del audio de una locución. */
export function voiceAssetPath(locale: Locale, asset: string): string {
  return `/voice/${locale}/${asset}.mp3`;
}

/** Texto que se lee cuando no hay MP3 disponible (síntesis del navegador). */
export function voiceFallbackText(locale: Locale, kind: "welcome" | "lecturer", course?: string): string {
  if (kind === "lecturer" && course) {
    const lecturer = lecturerFor(course);
    if (lecturer) return `${lecturer.label[locale]}. ${lecturer.script[locale]}`;
  }
  const welcome: Record<Locale, string> = {
    pt: "Bem-vindo ao campus secure T. Quatro programas de vinte semanas, gratuitos e sem registo. O agente AURUM responde com o material do campus e diz quando não sabe.",
    es: "Bienvenido al campus secure T. Cuatro programas de veinte semanas, gratuitos y sin registro. El agente AURUM responde con el material del campus y dice cuándo no sabe.",
    en: "Welcome to the secure T campus. Four twenty-week programmes, free and with no sign-up. The AURUM agent answers from campus material and says when it does not know.",
    ca: "Benvingut al campus secure T. Quatre programes de vint setmanes, gratuïts i sense registre. L'agent AURUM respon amb el material del campus i diu quan no ho sap."
  };
  return welcome[locale];
}
