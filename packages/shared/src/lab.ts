/**
 * Laboratorio de IA: instrumentos, no adornos.
 *
 * El campus promete un módulo de inteligencia artificial que sea **una
 * herramienta completa**. Aquí está la parte que se puede comprobar: cinco
 * instrumentos deterministas, sin red, sin cuentas y sin telemetría, que
 * ejecutan en el dispositivo del alumno lo que el programa de IA aplicada
 * enseña a hacer a mano.
 *
 *   1. `auditPrompt`       — audita un prompt contra reglas de inyección
 *                            (OWASP LLM01) y explica qué se disparó y por qué.
 *   2. `redactSensitive`   — encuentra y tapa datos personales y credenciales
 *                            antes de pegar nada en un modelo (LGPD/RGPD).
 *   3. `auditGrounding`    — mide si una respuesta está sostenida por las
 *                            fuentes citadas o si se lo ha inventado.
 *   4. `estimateContext`   — presupuesta la ventana de contexto y el coste de
 *                            las citas antes de enviar nada.
 *   5. `assessGuardrails`  — evalúa un diseño contra la lista de salvaguardas
 *                            del campus y produce un expediente exportable.
 *
 * Reglas de la casa que este fichero respeta y hace respetar:
 *  - Nada sale del dispositivo: no hay `fetch`, ni claves, ni servicios.
 *  - Cada resultado lleva su evidencia y su límite declarado. Un detector de
 *    patrones no es un verificador de veracidad, y aquí se dice.
 *  - Las reglas son datos (`INJECTION_RULES`, `PII_PATTERNS`, `GUARDRAIL_ITEMS`),
 *    de modo que un test puede recorrerlas y exigir que cada una explique su
 *    mitigación y su referencia.
 */

import type { KnowledgeChunk } from "./knowledge";
import type { TranslationKey } from "./i18n";

/* -------------------------------------------------------------------------- */
/* 1 · Auditoría de prompt (OWASP LLM01 · MITRE ATLAS · CWE)                   */
/* -------------------------------------------------------------------------- */

export type LabSeverity = "info" | "bajo" | "medio" | "alto" | "critico";

export interface InjectionRule {
  id: string;
  /** Etiqueta clave de i18n que se muestra al alumno. */
  label: TranslationKey;
  severity: LabSeverity;
  /** Referencias externas: el alumno puede ir a la fuente y comprobarla. */
  owasp: string;
  atlas: string;
  cwe: string;
  /** Expresión regular; se aplica sin distinguir mayúsculas ni acentos. */
  pattern: RegExp;
  /** Mitigación concreta que el campus recomienda para ese patrón. */
  mitigation: TranslationKey;
}

/** Normaliza para que las reglas también encuentren «ínyección» escrito raro. */
export function labNormalize(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export const INJECTION_RULES: readonly InjectionRule[] = [
  {
    id: "override",
    label: "lab.rule.override",
    severity: "critico",
    owasp: "LLM01 Prompt Injection",
    atlas: "AML.T0051",
    cwe: "CWE-1427",
    pattern: /\b(ignore|ignora|desconsidere|olvide|obvia)\b[^!?]{0,60}\b(previous|above|anterior(es)?|anteriors|system|sistema|instruccion(es)?|instrucoes|rules?|regras?)\b/,
    mitigation: "lab.mitigation.override"
  },
  {
    id: "role-hijack",
    label: "lab.rule.role",
    severity: "alto",
    owasp: "LLM01 Prompt Injection",
    atlas: "AML.T0051.001",
    cwe: "CWE-74",
    pattern: /\b(act as|actua como|atue como|you are now|ahora eres|voce (e|eh) agora)\b[^!?]{0,60}\b(dan|unrestricted|sin restricciones|sem restricoes|hacker|administrador|root|developer mode|modo desarrollador)\b/,
    mitigation: "lab.mitigation.role"
  },
  {
    id: "delimiter",
    label: "lab.rule.delimiter",
    severity: "medio",
    owasp: "LLM01 Prompt Injection",
    atlas: "AML.T0051",
    cwe: "CWE-74",
    pattern: /(<\/?(system|assistant|tool|developer|sistema)>|\[INST\]|\[\/INST\]|###\s*(system|instruction)|<\|(im_start|im_end|endoftext)\|>)/,
    mitigation: "lab.mitigation.delimiter"
  },
  {
    id: "exfiltration",
    label: "lab.rule.exfil",
    severity: "critico",
    owasp: "LLM02 Insecure Output Handling · LLM06 Excessive Agency",
    atlas: "AML.T0057",
    cwe: "CWE-200",
    pattern: /\b(reveal|revela|revele|revelan|mostrar|muestra|muestre|dime|filtrar|exfiltrar|print)\b[^!?]{0,60}\b(system prompt|prompt del sistema|prompt de sistema|instrucciones internas|nome do modelo|api key|clave de api|chave da api|credenciales?|credenciais?|\.env|environment variables?)\b/,
    mitigation: "lab.mitigation.exfil"
  },
  {
    id: "encoding",
    label: "lab.rule.encoding",
    severity: "alto",
    owasp: "LLM01 Prompt Injection",
    atlas: "AML.T0051",
    cwe: "CWE-693",
    pattern: /\b(base64|rot13|hex|hexadecimal|unicode escape|zero-?width|homoglifo|homoglyph|leetspeak|morse)\b[^!?]{0,60}\b(decode|decodifica|descodifica|traduce|convierte|oculta|esconde)\b|\b(decode|decodifica|descodifica|traduce|convierte|oculta|esconde)\b[^!?]{0,60}\b(base64|rot13|hex|hexadecimal|zero-?width|homoglifo|homoglyph|leetspeak|morse)\b/,
    mitigation: "lab.mitigation.encoding"
  },
  {
    id: "guardrail-bypass",
    label: "lab.rule.bypass",
    severity: "alto",
    owasp: "LLM01 Prompt Injection",
    atlas: "AML.T0054",
    cwe: "CWE-693",
    pattern: /\b(bypass|elude|evita|salta|desactiva|disable)\b[^!?]{0,60}\b(filtros?|guardarrail(es)?|guardrails?|salvaguardas?|seguridad|politica de seguridad|policy|moderacion|moderacao)\b/,
    mitigation: "lab.mitigation.bypass"
  },
  {
    id: "urgent-authority",
    label: "lab.rule.authority",
    severity: "medio",
    owasp: "LLM01 Prompt Injection · LLM09 Misinformation",
    atlas: "AML.T0051",
    cwe: "CWE-290",
    pattern: /\b(soy (el|la) (ceo|cto|ciso|administrador)|urgente|tengo permiso|estoy autorizado|sou o (ceo|cto|ciso)|tenho permissao)\b[^!?]{0,60}\b(ignora|salta|acelera|revela|without|sin)\b/,
    mitigation: "lab.mitigation.authority"
  },
  {
    id: "tool-abuse",
    label: "lab.rule.tool",
    severity: "critico",
    owasp: "LLM06 Excessive Agency · LLM08 Vector and Embedding Weaknesses",
    atlas: "AML.T0053",
    cwe: "CWE-78",
    pattern: /\b(curl|wget|bash|powershell|rm\s+-rf|chmod|sudo|eval|exec)\b[^!?]{0,60}(https?:\/\/|\||;|\$\(|`)/,
    mitigation: "lab.mitigation.tool"
  }
] as const;

export interface LabFinding {
  id: string;
  label: TranslationKey;
  severity: LabSeverity;
  /** Fragmento exacto que disparó la regla: la prueba, no la sospecha. */
  evidence: string;
  owasp: string;
  atlas: string;
  cwe: string;
  mitigation: TranslationKey;
}

export interface PromptAudit {
  chars: number;
  severities: Record<LabSeverity, number>;
  verdict: LabSeverity | "limpio";
  findings: LabFinding[];
  /** Límite declarado: esto es un detector de patrones, no un verificador. */
  limits: "lab.limit.patterns";
}

const ORDEN: readonly LabSeverity[] = ["info", "bajo", "medio", "alto", "critico"];

function severidadDeHallazgos(hallazgos: LabFinding[]): LabSeverity | "limpio" {
  if (hallazgos.length === 0) return "limpio";
  let maxima: LabSeverity = "info";
  for (const hallazgo of hallazgos) {
    if (ORDEN.indexOf(hallazgo.severity) > ORDEN.indexOf(maxima)) maxima = hallazgo.severity;
  }
  return maxima;
}

/** Audita un texto contra las reglas y devuelve cada hallazgo con su evidencia. */
export function auditPrompt(texto: string): PromptAudit {
  const normalizado = labNormalize(texto);
  const findings: LabFinding[] = [];
  for (const regla of INJECTION_RULES) {
    const coincidencia = regla.pattern.exec(normalizado);
    if (!coincidencia) continue;
    findings.push({
      id: regla.id,
      label: regla.label,
      severity: regla.severity,
      evidence: coincidencia[0].slice(0, 160).trim(),
      owasp: regla.owasp,
      atlas: regla.atlas,
      cwe: regla.cwe,
      mitigation: regla.mitigation
    });
  }
  const severities = Object.fromEntries(ORDEN.map((nivel) => [nivel, 0])) as Record<LabSeverity, number>;
  for (const hallazgo of findings) severities[hallazgo.severity] += 1;
  return {
    chars: texto.length,
    severities,
    verdict: severidadDeHallazgos(findings),
    findings,
    limits: "lab.limit.patterns"
  };
}

/* -------------------------------------------------------------------------- */
/* 2 · Redacción de datos personales y credenciales (LGPD · RGPD · ASVS 14.2)  */
/* -------------------------------------------------------------------------- */

export type PiiCategory =
  | "email"
  | "telefono"
  | "documento"
  | "tarjeta"
  | "iban"
  | "ip"
  | "credencial"
  | "jwt"
  | "ruta-interna";

export interface PiiPattern {
  category: PiiCategory;
  /** Etiqueta que se muestra al alumno. */
  label: TranslationKey;
  pattern: RegExp;
  /** Referencia normativa o de catálogo que justifica tratarlo así. */
  reference: string;
  /** Comprobación adicional (por ejemplo, dígitos verificadores del CPF). */
  validate?: (valor: string) => boolean;
}

export const PII_PATTERNS: readonly PiiPattern[] = [
  {
    category: "email",
    label: "lab.pii.email",
    pattern: /[\w.+-]+@[\w-]+\.[\w.-]{2,}/g,
    reference: "RGPD art. 4(1) · LGPD art. 5(I)"
  },
  {
    category: "iban",
    label: "lab.pii.iban",
    pattern: /\b[A-Z]{2}\d{2}[\s]?[\dA-Z]{4}[\s]?(?:[\dA-Z]{4}[\s]?){2,7}[\dA-Z]{1,4}\b/g,
    reference: "RGPD art. 4(1) · ISO 13616"
  },
  {
    category: "documento",
    label: "lab.pii.document",
    pattern: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b|\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g,
    reference: "LGPD art. 5(I) · RGPD considerando 30",
    validate: (valor) => {
      const digitos = valor.replace(/\D/g, "");
      // 111.111.111-11 pasa la aritmética y no es un documento válido: la
      // Receita Federal rechaza los repetidos, y aquí se rechazan igual.
      if (/^(\d)\1+$/.test(digitos)) return false;
      if (digitos.length === 11) {
        // CPF: dos dígitos verificadores calculados sobre los nueve primeros.
        const calcular = (fatia: number) => {
          let soma = 0;
          for (let i = 0; i < fatia; i += 1) soma += Number(digitos[i]) * (fatia + 1 - i);
          const resto = (soma * 10) % 11;
          return resto === 10 ? 0 : resto;
        };
        return calcular(9) === Number(digitos[9]) && calcular(10) === Number(digitos[10]);
      }
      if (digitos.length === 14) {
        // CNPJ: validación módulo 11 con pesos 2..9.
        const pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const digito = (quantidade: number) => {
          let soma = 0;
          for (let i = 0; i < quantidade; i += 1) soma += Number(digitos[i]) * pesos[pesos.length - quantidade + i];
          const resto = soma % 11;
          return resto < 2 ? 0 : 11 - resto;
        };
        return digito(12) === Number(digitos[12]) && digito(13) === Number(digitos[13]);
      }
      return false;
    }
  },
  {
    category: "tarjeta",
    label: "lab.pii.card",
    pattern: /\b(?:\d[ -]?){12,18}\d\b/g,
    reference: "PCI DSS 4.0 req. 3.3",
    validate: (valor) => {
      const digitos = valor.replace(/\D/g, "");
      if (digitos.length < 13 || digitos.length > 19) return false;
      // Algoritmo de Luhn: evita marcar cualquier número largo como tarjeta.
      let soma = 0;
      let duplicar = false;
      for (let i = digitos.length - 1; i >= 0; i -= 1) {
        let digito = Number(digitos[i]);
        if (duplicar) {
          digito *= 2;
          if (digito > 9) digito -= 9;
        }
        soma += digito;
        duplicar = !duplicar;
      }
      return soma % 10 === 0;
    }
  },
  {
    category: "ip",
    label: "lab.pii.ip",
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    reference: "RGPD considerando 30 (dato identificativo en línea)",
    validate: (valor) => valor.split(".").every((parte) => Number(parte) >= 0 && Number(parte) <= 255)
  },
  {
    category: "telefono",
    label: "lab.pii.phone",
    pattern: /(?<![\w.])(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{2,3}\)[\s.-]?)?(?:\d{2,4}[\s.-]?){2,3}\d{2,4}(?![\w])/g,
    reference: "RGPD art. 4(1) · LGPD art. 5(I)",
    validate: (valor) => {
      const digitos = valor.replace(/\D/g, "");
      // Un teléfono se escribe con separadores; sin ellos sería otro número.
      return digitos.length >= 9 && digitos.length <= 13 && /[ +().-]/.test(valor);
    }
  },
  {
    category: "credencial",
    label: "lab.pii.credential",
    pattern: /\b(?:sk|rk|pk|ghp|gho|glpat|xox[baprs]|AKIA)[-_A-Za-z0-9]{12,}\b|\b(?:api[_-]?key|senha|password|passwd|token)\s*[:=]\s*["']?[\w.+/=-]{8,}["']?/g,
    reference: "OWASP ASVS 14.2.1 · CWE-798"
  },
  {
    category: "jwt",
    label: "lab.pii.jwt",
    pattern: /\beyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}\b/g,
    reference: "OWASP ASVS 14.2.1 · RFC 7519"
  },
  {
    category: "ruta-interna",
    label: "lab.pii.path",
    pattern: /(?:\/home\/[\w.-]+|\/Users\/[\w.-]+|[A-Z]:\\Users\\[\w.-]+|\/etc\/(?:passwd|shadow)|\.env\b)/g,
    reference: "OWASP Top 10 A01 · CWE-200 (fuga de información por mensajes)"
  }
] as const;

export interface PiiHit {
  category: PiiCategory;
  label: TranslationKey;
  count: number;
  reference: string;
  /** Ejemplos enmascarados: se enseña el patrón sin volver a exponer el dato. */
  samples: string[];
}

export interface RedactionResult {
  originalChars: number;
  cleanChars: number;
  hits: PiiHit[];
  total: number;
  /** Texto seguro, listo para pegar en cualquier modelo. Determinista. */
  clean: string;
  byCategory: Record<PiiCategory, number>;
}

export const PII_CATEGORIES: readonly PiiCategory[] = PII_PATTERNS.map((patron) => patron.category);

function enmascarar(valor: string): string {
  if (valor.length <= 4) return "****";
  return `${valor.slice(0, 2)}${"*".repeat(Math.min(6, valor.length - 4))}${valor.slice(-2)}`;
}

/**
 * Tapa datos personales y credenciales. Devuelve el texto limpio y el inventario
 * de lo encontrado (categoría, cuántos y referencias), sin conservar los valores.
 */
export function redactSensitive(texto: string): RedactionResult {
  let limpio = texto;
  const hits: PiiHit[] = [];
  const byCategory = Object.fromEntries(PII_CATEGORIES.map((categoria) => [categoria, 0])) as Record<PiiCategory, number>;

  for (const patron of PII_PATTERNS) {
    const encontrados: string[] = [];
    limpio = limpio.replace(new RegExp(patron.pattern.source, patron.pattern.flags), (coincidencia) => {
      if (patron.validate && !patron.validate(coincidencia)) return coincidencia;
      encontrados.push(coincidencia);
      byCategory[patron.category] += 1;
      return `[${patron.category.toUpperCase()}·REDACTADO]`;
    });
    if (encontrados.length === 0) continue;
    hits.push({
      category: patron.category,
      label: patron.label,
      count: encontrados.length,
      reference: patron.reference,
      samples: encontrados.slice(0, 3).map(enmascarar)
    });
  }

  return {
    originalChars: texto.length,
    cleanChars: limpio.length,
    hits,
    total: hits.reduce((suma, hit) => suma + hit.count, 0),
    clean: limpio,
    byCategory
  };
}

/* -------------------------------------------------------------------------- */
/* 3 · Auditoría de fundamento (¿está la respuesta en las fuentes?)            */
/* -------------------------------------------------------------------------- */

export interface GroundingSentence {
  text: string;
  /** 0..1: proporción de palabras con contenido que aparecen en las fuentes. */
  coverage: number;
  supported: boolean;
  /** Mejor fuente por solapamiento, cuando existe. */
  source?: { title: string; url: string };
}

export interface GroundingReport {
  sentences: GroundingSentence[];
  supported: number;
  unsupported: number;
  /** Porcentaje de frases sostenidas, redondeado a un decimal. */
  supportRate: number;
  verdict: "sostenida" | "parcial" | "sin_fuentes" | "inventada";
  limits: "lab.limit.grounding";
}

const VACIAS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "your", "you", "are", "was", "were", "have", "has",
  "de", "la", "el", "los", "las", "una", "uno", "unos", "unas", "que", "con", "por", "para", "del", "al", "en",
  "es", "son", "como", "pero", "mas", "se", "su", "sus", "o", "y", "e", "a", "no", "si", "do", "da", "dos", "das",
  "um", "uma", "os", "as", "ao", "aos", "na", "no", "nas", "nos", "seu", "sua", "seus", "suas", "para", "com",
  "dels", "les", "els", "amb", "per", "una", "uns", "unes"
]);

function palabrasConContenido(texto: string): string[] {
  return labNormalize(texto)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((palabra) => palabra.length >= 3 && !VACIAS.has(palabra));
}

export function splitSentences(respuesta: string): string[] {
  return respuesta
    .split(/(?<=[.!?…])\s+|\n+/u)
    .map((frase) => frase.trim())
    .filter((frase) => frase.length >= 12);
}

/**
 * Comprueba frase a frase si la respuesta se apoya en los fragmentos citados.
 * No es un juez semántico: mide solapamiento de vocabulario y lo declara.
 */
export function auditGrounding(
  respuesta: string,
  fuentes: readonly Pick<KnowledgeChunk, "title" | "url" | "text">[],
  umbral = 0.5
): GroundingReport {
  const corpus = fuentes.map((fuente) => ({ title: fuente.title, url: fuente.url, palabras: new Set(palabrasConContenido(fuente.text)) }));
  const sentences: GroundingSentence[] = splitSentences(respuesta).map((frase) => {
    const palabras = palabrasConContenido(frase);
    let mejor: (typeof corpus)[number] | undefined;
    let mejorCobertura = 0;
    for (const fuente of corpus) {
      if (palabras.length === 0) break;
      const presentes = palabras.filter((palabra) => fuente.palabras.has(palabra)).length;
      const cobertura = presentes / palabras.length;
      if (cobertura > mejorCobertura) {
        mejorCobertura = cobertura;
        mejor = fuente;
      }
    }
    const coverage = palabras.length === 0 ? 0 : Number(mejorCobertura.toFixed(3));
    return {
      text: frase,
      coverage,
      supported: coverage >= umbral,
      ...(mejor && coverage > 0 ? { source: { title: mejor.title, url: mejor.url } } : {})
    };
  });

  const supported = sentences.filter((frase) => frase.supported).length;
  const unsupported = sentences.length - supported;
  const supportRate = sentences.length === 0 ? 0 : Number(((supported / sentences.length) * 100).toFixed(1));
  const verdict: GroundingReport["verdict"] =
    fuentes.length === 0 ? "sin_fuentes" : sentences.length === 0 ? "inventada" : supportRate >= 80 ? "sostenida" : supportRate >= 50 ? "parcial" : "inventada";

  return { sentences, supported, unsupported, supportRate, verdict, limits: "lab.limit.grounding" };
}

/* -------------------------------------------------------------------------- */
/* 4 · Presupuesto de contexto (ventana, tokens estimados, hueco para citas)   */
/* -------------------------------------------------------------------------- */

export interface ModelWindow {
  id: string;
  /** Etiqueta legible: el modelo y su tamaño. */
  label: string;
  /** Tokens de contexto declarados por el autor del modelo. */
  window: number;
  /** Licencia, para no recomendar cerrado sin decirlo. */
  license: string;
  /** URL de la documentación oficial: la cifra se puede comprobar. */
  docs: string;
}

/** Ventanas de modelos abiertos. Las cifras se citan con su fuente y se revisan. */
export const MODEL_WINDOWS: readonly ModelWindow[] = [
  { id: "llama-3.1-8b", label: "Llama 3.1 8B", window: 128_000, license: "Llama 3.1 Community", docs: "https://github.com/meta-llama/llama-models" },
  { id: "mistral-7b", label: "Mistral 7B v0.3", window: 32_768, license: "Apache-2.0", docs: "https://docs.mistral.ai/" },
  { id: "qwen2.5-7b", label: "Qwen2.5 7B", window: 131_072, license: "Apache-2.0", docs: "https://github.com/QwenLM/Qwen2.5" },
  { id: "gemma-2-9b", label: "Gemma 2 9B", window: 8_192, license: "Gemma Terms", docs: "https://ai.google.dev/gemma/docs/core" },
  { id: "phi-3.5-mini", label: "Phi-3.5 Mini", window: 128_000, license: "MIT", docs: "https://huggingface.co/microsoft/Phi-3.5-mini-instruct" }
] as const;

export interface ContextBudget {
  chars: number;
  words: number;
  /** Estimación declarada: caracteres/4 en alfabetos latinos. No es un tokenizador. */
  estimatedTokens: number;
  /** Tokens que el campus reserva para el prompt de sistema y las salvaguardas. */
  systemTokens: number;
  /** Tokens reservados para las citas de la respuesta. */
  answerTokens: number;
  fits: { model: string; label: string; leftover: number; ok: boolean }[];
  recommendation: "holgado" | "ajustado" | "excedido";
  limits: "lab.limit.tokens";
}

export interface ContextOptions {
  /** Tokens reservados para el prompt de sistema (por defecto 400). */
  systemTokens?: number;
  /** Tokens reservados para la respuesta (por defecto 800). */
  answerTokens?: number;
  /** Tokens por carácter (por defecto 0,25 → 4 caracteres por token). */
  tokensPerChar?: number;
}

export function estimateContext(texto: string, options: ContextOptions = {}): ContextBudget {
  const systemTokens = options.systemTokens ?? 400;
  const answerTokens = options.answerTokens ?? 800;
  const tokensPerChar = options.tokensPerChar ?? 0.25;
  const chars = texto.length;
  const words = texto.split(/\s+/).filter(Boolean).length;
  const estimatedTokens = Math.ceil(chars * tokensPerChar);
  const total = estimatedTokens + systemTokens + answerTokens;
  const fits = MODEL_WINDOWS.map((modelo) => ({
    model: modelo.id,
    label: modelo.label,
    leftover: modelo.window - total,
    ok: modelo.window >= total
  }));
  const holgados = fits.filter((f) => f.ok && f.leftover > 4_000).length;
  return {
    chars,
    words,
    estimatedTokens,
    systemTokens,
    answerTokens,
    fits,
    recommendation: fits.every((f) => !f.ok) ? "excedido" : holgados === MODEL_WINDOWS.length ? "holgado" : "ajustado",
    limits: "lab.limit.tokens"
  };
}

/* -------------------------------------------------------------------------- */
/* 5 · Salvaguardas (lista de verificación que produce expediente)             */
/* -------------------------------------------------------------------------- */

export interface GuardrailItem {
  id: string;
  label: TranslationKey;
  /** Por qué importa: se muestra siempre, no sólo cuando falla. */
  why: TranslationKey;
  reference: string;
  /** Gravedad de no tenerlo, para ordenar el informe final. */
  weight: 1 | 2 | 3;
}

export const GUARDRAIL_ITEMS: readonly GuardrailItem[] = [
  { id: "minimizacion", label: "lab.guard.minimize", why: "lab.guard.minimize.why", reference: "RGPD art. 5(1)(c) · LGPD art. 6(III)", weight: 3 },
  { id: "sin-datos", label: "lab.guard.nodata", why: "lab.guard.nodata.why", reference: "LGPD art. 12 · RGPD art. 25 (privacidad desde el diseño)", weight: 3 },
  { id: "salida-estructurada", label: "lab.guard.structured", why: "lab.guard.structured.why", reference: "OWASP LLM02 Insecure Output Handling · ASVS 1.2.6", weight: 2 },
  { id: "herramientas-lectura", label: "lab.guard.readonly", why: "lab.guard.readonly.why", reference: "OWASP LLM06 Excessive Agency · ASVS 4.2.1", weight: 3 },
  { id: "confirmacion-humana", label: "lab.guard.human", why: "lab.guard.human.why", reference: "OWASP LLM06 · EU AI Act art. 14 (supervisión humana)", weight: 3 },
  { id: "citas", label: "lab.guard.citations", why: "lab.guard.citations.why", reference: "OWASP LLM09 Misinformation · campus: regla de la cita", weight: 2 },
  { id: "inyeccion", label: "lab.guard.injection", why: "lab.guard.injection.why", reference: "OWASP LLM01 Prompt Injection · CWE-1427", weight: 3 },
  { id: "limites-tasa", label: "lab.guard.ratelimit", why: "lab.guard.ratelimit.why", reference: "OWASP API4:2023 Unrestricted Resource Consumption · ASVS 11.1.4", weight: 2 },
  { id: "auditoria", label: "lab.guard.audit", why: "lab.guard.audit.why", reference: "NIST AI RMF MEASURE 2.8 · EU AI Act art. 12 (registro de eventos)", weight: 2 },
  { id: "evaluacion", label: "lab.guard.evals", why: "lab.guard.evals.why", reference: "NIST AI RMF MEASURE 2.5 · ISO/IEC 42001 A.6", weight: 2 },
  { id: "tarjeta-modelo", label: "lab.guard.modelcard", why: "lab.guard.modelcard.why", reference: "Model Cards (Mitchell et al.) · EU AI Act art. 13 (transparencia)", weight: 1 },
  { id: "sesgo", label: "lab.guard.bias", why: "lab.guard.bias.why", reference: "NIST AI RMF FAIRNESS · LGPD art. 20 · EU AI Act art. 10", weight: 2 }
] as const;

export interface GuardrailAnswer {
  id: string;
  /** true = presente y comprobable; false = ausente o «confiamos en el modelo». */
  ok: boolean;
  /** Cómo se comprueba. Sin evidencia, la casilla no cuenta. */
  evidence?: string;
}

export interface GuardrailReport {
  total: number;
  ok: number;
  /** Puntuación ponderada 0..100: los controles graves pesan el triple. */
  score: number;
  blockers: { id: string; label: TranslationKey; reference: string }[];
  missing: { id: string; label: TranslationKey; why: TranslationKey; reference: string }[];
  ready: boolean;
  limits: "lab.limit.selfassessment";
}

export function assessGuardrails(answers: readonly GuardrailAnswer[]): GuardrailReport {
  const respondidas = new Map(answers.map((respuesta) => [respuesta.id, respuesta]));
  const missing: GuardrailReport["missing"] = [];
  const blockers: GuardrailReport["blockers"] = [];
  let pesoTotal = 0;
  let pesoOk = 0;

  for (const item of GUARDRAIL_ITEMS) {
    pesoTotal += item.weight;
    const respuesta = respondidas.get(item.id);
    // Sin evidencia escrita la casilla no cuenta: es la regla del campus.
    const vale = Boolean(respuesta?.ok) && Boolean(respuesta?.evidence && respuesta.evidence.trim().length >= 8);
    if (vale) {
      pesoOk += item.weight;
      continue;
    }
    missing.push({ id: item.id, label: item.label, why: item.why, reference: item.reference });
    if (item.weight === 3) blockers.push({ id: item.id, label: item.label, reference: item.reference });
  }

  const score = pesoTotal === 0 ? 0 : Math.round((pesoOk / pesoTotal) * 100);
  return { total: GUARDRAIL_ITEMS.length, ok: GUARDRAIL_ITEMS.length - missing.length, score, blockers, missing, ready: blockers.length === 0 && score >= 80, limits: "lab.limit.selfassessment" };
}

/* -------------------------------------------------------------------------- */
/* Instrumentos y expediente                                                   */
/* -------------------------------------------------------------------------- */

export type LabInstrumentId = "prompt" | "pii" | "grounding" | "context" | "guardrails";

export interface LabInstrument {
  id: LabInstrumentId;
  label: TranslationKey;
  lead: TranslationKey;
  /** Qué NO hace este instrumento: la parte honesta de la ficha. */
  limit: TranslationKey;
  /** Programa y semana del campus donde se estudia. */
  source: { course: string; week: number };
}

export const LAB_INSTRUMENTS: readonly LabInstrument[] = [
  { id: "prompt", label: "lab.prompt.label", lead: "lab.prompt.lead", limit: "lab.limit.patterns", source: { course: "ia-aplicada-segura", week: 10 } },
  { id: "pii", label: "lab.pii.label", lead: "lab.pii.lead", limit: "lab.limit.redaction", source: { course: "ia-aplicada-segura", week: 9 } },
  { id: "grounding", label: "lab.grounding.label", lead: "lab.grounding.lead", limit: "lab.limit.grounding", source: { course: "ia-aplicada-segura", week: 12 } },
  { id: "context", label: "lab.context.label", lead: "lab.context.lead", limit: "lab.limit.tokens", source: { course: "ia-aplicada-segura", week: 5 } },
  { id: "guardrails", label: "lab.guardrails.label", lead: "lab.guardrails.lead", limit: "lab.limit.selfassessment", source: { course: "ia-aplicada-segura", week: 14 } }
] as const;

export interface LabSession {
  prompt?: PromptAudit;
  pii?: RedactionResult;
  grounding?: GroundingReport;
  context?: ContextBudget;
  guardrails?: GuardrailReport;
}

/**
 * Convierte una sesión de laboratorio en un informe Markdown que el alumno
 * puede guardar o pegar en su expediente. Determinista: mismas entradas,
 * mismo informe, sin cabecera de fecha (la fecha la pone quien lo usa).
 */
export function labReport(session: LabSession, titulo: string): string {
  const lineas: string[] = [`# ${titulo}`, ""];
  if (session.prompt) {
    lineas.push("## Auditoría de prompt", "", `- Veredicto: **${session.prompt.verdict}**`, `- Hallazgos: ${session.prompt.findings.length}`);
    for (const hallazgo of session.prompt.findings) {
      lineas.push(`  - \`${hallazgo.id}\` (${hallazgo.severity}) · ${hallazgo.owasp} · ${hallazgo.atlas} · ${hallazgo.cwe}`, `    - evidencia: «${hallazgo.evidence}»`);
    }
    lineas.push("");
  }
  if (session.pii) {
    lineas.push("## Datos personales encontrados", "", `- Total: ${session.pii.total} en ${session.pii.hits.length} categorías`);
    for (const hit of session.pii.hits) lineas.push(`  - ${hit.category}: ${hit.count} · ${hit.reference}`);
    lineas.push("");
  }
  if (session.grounding) {
    lineas.push(
      "## Fundamento de la respuesta",
      "",
      `- Veredicto: **${session.grounding.verdict}**`,
      `- Frases sostenidas: ${session.grounding.supported}/${session.grounding.sentences.length} (${session.grounding.supportRate}%)`
    );
    for (const frase of session.grounding.sentences.filter((f) => !f.supported)) {
      lineas.push(`  - sin fuente (${Math.round(frase.coverage * 100)}% de cobertura): «${frase.text.slice(0, 140)}»`);
    }
    lineas.push("");
  }
  if (session.context) {
    lineas.push(
      "## Presupuesto de contexto",
      "",
      `- Estimación: ~${session.context.estimatedTokens} tokens (${session.context.chars} caracteres)`,
      `- Recomendación: **${session.context.recommendation}**`,
      ...session.context.fits.map((f) => `  - ${f.label}: ${f.ok ? `holgura de ${f.leftover} tokens` : `faltan ${Math.abs(f.leftover)} tokens`}`),
      ""
    );
  }
  if (session.guardrails) {
    lineas.push(
      "## Salvaguardas",
      "",
      `- Puntuación ponderada: ${session.guardrails.score}/100 · ${session.guardrails.ok}/${session.guardrails.total} controles`,
      `- Listo para producción: ${session.guardrails.ready ? "sí" : "no"}`,
      ...session.guardrails.missing.map((item) => `  - falta: \`${item.id}\` · ${item.reference}`),
      ""
    );
  }
  lineas.push("---", "", "_Generado en el dispositivo. Sin red, sin cuentas y sin telemetría._");
  return lineas.join("\n");
}

/** Búsqueda de un modelo concreto por identificador (para la interfaz). */
export function modelWindow(id: string): ModelWindow | undefined {
  return MODEL_WINDOWS.find((modelo) => modelo.id === id);
}

/**
 * Claves de i18n del laboratorio, derivadas de los propios registros.
 * Si alguien añade una regla, un patrón o un control sin traducirlo, el test de
 * paridad de diccionarios lo dice: la lista no se mantiene a mano.
 */
export const LAB_UI_KEYS: readonly TranslationKey[] = [
  "lab.title",
  "lab.lead",
  "lab.privacy",
  "lab.instrument",
  "lab.input",
  "lab.run",
  "lab.sample",
  "lab.export",
  "lab.copied",
  "lab.verdict",
  "lab.findings",
  "lab.none",
  "lab.limit",
  "lab.source",
  "lab.clean",
  "lab.ready",
  "lab.notReady",
  "lab.input.answer",
  "lab.input.sources",
  "lab.grounding.sentence",
  "lab.sample.prompt",
  "lab.sample.pii",
  "lab.sample.context",
  "lab.severity.info",
  "lab.severity.bajo",
  "lab.severity.medio",
  "lab.severity.alto",
  "lab.severity.critico",
  "lab.verdict.limpio",
  "lab.verdict.sostenida",
  "lab.verdict.parcial",
  "lab.verdict.inventada",
  "lab.verdict.sin_fuentes",
  "lab.verdict.holgado",
  "lab.verdict.ajustado",
  "lab.verdict.excedido",
  ...INJECTION_RULES.flatMap((regla) => [regla.label, regla.mitigation]),
  ...PII_PATTERNS.map((patron) => patron.label),
  ...GUARDRAIL_ITEMS.flatMap((item) => [item.label, item.why]),
  ...LAB_INSTRUMENTS.flatMap((instrumento) => [instrumento.label, instrumento.lead, instrumento.limit])
] as const;

