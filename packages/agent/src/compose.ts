import { normalize, tokenize, type Locale } from "@secure-t/shared";
import type { AgentSource } from "./contract";
import type { AgentId } from "./governance";
import { PERSONAS } from "./personas";

/**
 * Redacción local de la respuesta (modo sin conexión).
 *
 * Método: **extractivo y verificable**. Se eligen las frases del material que
 * contienen los términos de la pregunta y se citan con su número de fuente.
 * No se genera texto nuevo que pueda inventar hechos: por eso este modo
 * funciona sin red y sin modelo, y aun así responde con rigor.
 */

interface Messages {
  noSources: string;
  extractiveNotice: string;
  offeredSources: string;
  denied: string;
  examMode: string;
  steps: string;
  followUp: { openWeek: string; quiz: string; lab: string; rubric: string; calendar: string; glossary: string; search: string };
}

export const AGENT_MESSAGES: Record<Locale, Messages> = {
  pt: {
    noSources: "Não encontrei material suficiente no campus para responder com rigor. Reformula a pergunta ou abre a semana correspondente.",
    extractiveNotice: "A resposta é literal do material do campus: cada frase vem citada e pode ser verificada na fonte.",
    offeredSources: "Fontes no campus",
    denied: "Não posso emitir credenciais, alterar notas finais nem aceder a dados privados: essa decisão é humana e está fora do meu alcance por desenho.",
    examMode: "Estou em modo avaliação: não proponho tarefas avaliáveis nem lanço laboratórios.",
    steps: "Próximos passos verificáveis",
    followUp: {
      openWeek: "Abrir a semana {week} do programa {course}",
      quiz: "Fazer o quiz do programa para fixar o conceito",
      lab: "Passar pelo laboratório e reproduzir o caso num ambiente legal",
      rubric: "Ler a rúbrica e escrever a evidência antes de avançar",
      calendar: "Gerar o meu calendário de estudo para este país",
      glossary: "Consultar o glossário do programa",
      search: "Procurar este termo em todo o campus"
    }
  },
  es: {
    noSources: "No he encontrado material suficiente en el campus para responder con rigor. Reformula la pregunta o abre la semana correspondiente.",
    extractiveNotice: "La respuesta es literal del material del campus: cada frase va citada y se puede verificar en la fuente.",
    offeredSources: "Fuentes en el campus",
    denied: "No puedo emitir credenciales, cambiar notas finales ni acceder a datos privados: esa decisión es humana y está fuera de mi alcance por diseño.",
    examMode: "Estoy en modo evaluación: no propongo tareas evaluables ni lanzo laboratorios.",
    steps: "Siguientes pasos verificables",
    followUp: {
      openWeek: "Abrir la semana {week} del programa {course}",
      quiz: "Hacer el quiz del programa para fijar el concepto",
      lab: "Pasar por el laboratorio y reproducir el caso en un entorno legal",
      rubric: "Leer la rúbrica y escribir la evidencia antes de avanzar",
      calendar: "Generar mi calendario de estudio para este país",
      glossary: "Consultar el glosario del programa",
      search: "Buscar este término en todo el campus"
    }
  },
  en: {
    noSources: "I could not find enough campus material to answer rigorously. Rephrase the question or open the matching week.",
    extractiveNotice: "The answer is literal from the campus material: every sentence is cited and can be verified at the source.",
    offeredSources: "Campus sources",
    denied: "I cannot issue credentials, change final grades or access private data: that decision is human and is out of my reach by design.",
    examMode: "This is assessment mode: I do not propose gradable work or launch labs.",
    steps: "Verifiable next steps",
    followUp: {
      openWeek: "Open week {week} of programme {course}",
      quiz: "Take the programme quiz to lock the concept in",
      lab: "Go through the lab and reproduce the case in a legal environment",
      rubric: "Read the rubric and write the evidence before moving on",
      calendar: "Generate my study calendar for this country",
      glossary: "Check the programme glossary",
      search: "Search this term across the whole campus"
    }
  },
  ca: {
    noSources: "No he trobat prou material al campus per respondre amb rigor. Reformula la pregunta o obre la setmana corresponent.",
    extractiveNotice: "La resposta és literal del material del campus: cada frase va citada i es pot verificar a la font.",
    offeredSources: "Fonts al campus",
    denied: "No puc emetre credencials, canviar notes finals ni accedir a dades privades: aquesta decisió és humana i queda fora del meu abast per disseny.",
    examMode: "Estic en mode avaluació: no proposo tasques avaluables ni llanço laboratoris.",
    steps: "Passos següents verificables",
    followUp: {
      openWeek: "Obrir la setmana {week} del programa {course}",
      quiz: "Fer el qüestionari del programa per fixar el concepte",
      lab: "Passar pel laboratori i reproduir el cas en un entorn legal",
      rubric: "Llegir la rúbrica i escriure l'evidència abans d'avançar",
      calendar: "Generar el meu calendari d'estudi per a aquest país",
      glossary: "Consultar el glossari del programa",
      search: "Cercar aquest terme a tot el campus"
    }
  }
};

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÚÑÜÇÀÈÌÒÙ·"«(])/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 30);
}

interface Scored {
  sentence: string;
  score: number;
  sourceIndex: number;
}

function scoreSentences(sources: AgentSource[], question: string): Scored[] {
  const terms = new Set(tokenize(question));
  const scored: Scored[] = [];
  sources.forEach((source, sourceIndex) => {
    for (const sentence of splitSentences(source.quote)) {
      const normalized = normalize(sentence);
      const tokens = tokenize(sentence);
      if (!tokens.length) continue;
      const overlap = tokens.filter((token) => terms.has(token)).length;
      const density = overlap / tokens.length;
      const score = overlap * 1.4 + density * 2 - sentence.length / 1200;
      scored.push({ sentence, score, sourceIndex });
    }
  });
  return scored.sort((a, b) => b.score - a.score);
}

function trimAnswer(answer: string, max: number): string {
  if (answer.length <= max) return answer;
  const slice = answer.slice(0, max);
  const lastBreak = Math.max(slice.lastIndexOf("\n"), slice.lastIndexOf(". "));
  return `${slice.slice(0, lastBreak > max * 0.5 ? lastBreak + 1 : max).trim()}…`;
}

export interface ComposeInput {
  question: string;
  locale: Locale;
  agent: AgentId;
  sources: AgentSource[];
  course?: string;
  courseTitle?: string;
  week?: number;
  examMode?: boolean;
  maxChars?: number;
}

export interface ComposedAnswer {
  answer: string;
  followUps: string[];
  notices: string[];
}

export function buildFollowUps(input: ComposeInput, messages: Messages): string[] {
  const followUps: string[] = [];
  const courseLabel = input.courseTitle ?? input.course ?? "";
  if (input.course && input.week) {
    followUps.push(messages.followUp.openWeek.replace("{week}", String(input.week)).replace("{course}", courseLabel));
  }
  if (input.course) {
    followUps.push(messages.followUp.quiz.replace("{course}", courseLabel));
    followUps.push(messages.followUp.rubric.replace("{course}", courseLabel));
    followUps.push(messages.followUp.lab);
  }
  followUps.push(messages.followUp.calendar);
  return [...new Set(followUps)].slice(0, 4);
}

/** Construye la respuesta sin red, citando el material literal. */
export function composeLocalAnswer(input: ComposeInput): ComposedAnswer {
  const messages = AGENT_MESSAGES[input.locale];
  const persona = PERSONAS[input.agent];
  const notices: string[] = [];

  if (!input.sources.length) {
    return {
      answer: `${persona.opening[input.locale]}\n\n${messages.noSources}`,
      followUps: [
        messages.followUp.search,
        ...(input.course ? [messages.followUp.glossary] : []),
        messages.followUp.calendar
      ],
      notices: [input.examMode ? messages.examMode : messages.noSources]
    };
  }

  const scored = scoreSentences(input.sources, input.question);
  const chosen: Scored[] = [];
  const seen = new Set<string>();
  for (const candidate of scored) {
    const fingerprint = normalize(candidate.sentence).slice(0, 60);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    chosen.push(candidate);
    if (chosen.length >= 5) break;
  }

  const paragraphs: string[] = [];
  let current: string[] = [];
  let currentLength = 0;
  for (const entry of chosen) {
    const sentence = `${entry.sentence} [${entry.sourceIndex + 1}]`;
    current.push(sentence);
    currentLength += sentence.length;
    if (currentLength > 320) {
      paragraphs.push(current.join(" "));
      current = [];
      currentLength = 0;
    }
  }
  if (current.length) paragraphs.push(current.join(" "));

  const header = persona.opening[input.locale];
  const body = paragraphs.length ? paragraphs.join("\n\n") : input.sources[0].quote;
  const steps = buildFollowUps(input, messages);
  const answer = [`${header}`, "", body, "", `${messages.steps}:`, ...steps.map((step) => `· ${step}`)].join("\n");

  notices.push(messages.extractiveNotice);
  if (input.examMode) notices.push(messages.examMode);

  return { answer: trimAnswer(answer, input.maxChars ?? 3200), followUps: steps, notices };
}

export function denialAnswer(locale: Locale, agent: AgentId): string {
  return `${PERSONAS[agent].opening[locale]}\n\n${AGENT_MESSAGES[locale].denied}`;
}
