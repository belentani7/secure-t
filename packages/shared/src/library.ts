/**
 * Biblioteca de recursos abiertos del campus.
 *
 * Aquí sólo entra lo que se puede **enlazar y citar con la conciencia tranquila**:
 * canales de sus autores, plataformas con capa gratuita real, documentación
 * oficial de los estándares que el campus enseña y laboratorios que se pueden
 * montar en casa sin licencia de pago.
 *
 * Lo que **no** entra, y hay un test que lo impide: espejos de cursos de pago,
 * copias sin permiso ni agregadores que redistribuyen material ajeno. El campus
 * explica cómo se hace seguridad; no se construye sobre material robado, porque
 * robar el trabajo de otro es exactamente lo contrario de lo que aquí se enseña
 * (y ya se enseña en la semana 1 de ofensiva: permiso por escrito).
 *
 * La estructura vive aquí (datos comprobables por test); el texto de la interfaz
 * vive en los diccionarios (`library.*`). Cada recurso lleva su idioma real para
 * poder marcar `lang` en la página (WCAG 3.1.2) y para que quien estudia sepa si
 * le hace falta inglés antes de hacer clic.
 */

import type { TranslationKey } from "./i18n";

export type LibraryKind = "canal" | "curso" | "plataforma" | "documento" | "laboratorio" | "ctf";
export type LibraryCost = "abierto" | "registro";
export type LibraryLevel = "inicial" | "intermedio" | "avanzado";
export type LibraryLang = "pt" | "es" | "en" | "ca" | "multi";

export const LIBRARY_KINDS: readonly LibraryKind[] = [
  "canal",
  "curso",
  "plataforma",
  "documento",
  "laboratorio",
  "ctf"
] as const;
export const LIBRARY_COSTS: readonly LibraryCost[] = ["abierto", "registro"] as const;
export const LIBRARY_LEVELS: readonly LibraryLevel[] = ["inicial", "intermedio", "avanzado"] as const;
export const LIBRARY_LANGS: readonly LibraryLang[] = ["pt", "es", "en", "ca", "multi"] as const;

export interface LibraryResource {
  /** Identificador estable, corto y sin acentos. */
  id: string;
  /** Nombre propio del recurso (no se traduce: es un nombre). */
  name: string;
  /** Autor, organización o institución responsable. */
  org: string;
  kind: LibraryKind;
  url: string;
  /** Idioma en el que está el contenido de verdad, no el de la interfaz. */
  lang: LibraryLang;
  cost: LibraryCost;
  level: LibraryLevel;
  /** Programas del campus con los que encaja (slugs reales, comprobados por test). */
  courses: readonly string[];
  /** Etiquetas de tema: alimentan el buscador, no se muestran como filtro. */
  tags: readonly string[];
  /** Una línea honesta, en el idioma del recurso: qué aporta y qué no. */
  note: string;
}

export const LIBRARY: readonly LibraryResource[] = [
  /* ────────────────────────────────────────── canales, en inglés */
  {
    id: "ippsec",
    name: "IppSec",
    org: "IppSec (Hack The Box)",
    kind: "canal",
    url: "https://www.youtube.com/@ippsec",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-ofensiva"],
    tags: ["explotacion", "enumeracion", "metodologia"],
    note: "The reference channel for Hack The Box: watch how he reads enumeration output, not which flags he runs."
  },
  {
    id: "liveoverflow",
    name: "LiveOverflow",
    org: "Fabian Faessler",
    kind: "canal",
    url: "https://www.youtube.com/@LiveOverflow",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-ofensiva"],
    tags: ["explotacion", "web", "fundamentos"],
    note: "Vulnerabilities explained from the why, not from the tool: binary exploitation, web bugs and CTF reasoning."
  },
  {
    id: "john-hammond",
    name: "John Hammond",
    org: "John Hammond",
    kind: "canal",
    url: "https://www.youtube.com/@_JohnHammond",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["ctf", "malware", "carrera"],
    note: "CTF walkthroughs, malware teardowns and honest career advice; a good weekly habit once you have the basics."
  },
  {
    id: "networkchuck",
    name: "NetworkChuck",
    org: "Chuck Keith",
    kind: "canal",
    url: "https://www.youtube.com/@NetworkChuck",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva"],
    tags: ["redes", "linux", "on-ramp"],
    note: "The on-ramp: it gets you into a terminal and a home lab. Graduate from it once you can read documentation alone."
  },
  {
    id: "the-cyber-mentor",
    name: "The Cyber Mentor",
    org: "Heath Adams / TCM Security",
    kind: "canal",
    url: "https://www.youtube.com/@TCMSecurityAcademy",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "gobernanza-compliance"],
    tags: ["explotacion", "active-directory", "informe"],
    note: "Practical pentest work: Active Directory, reporting and the boring parts of an engagement that nobody films."
  },
  {
    id: "hackersploit",
    name: "HackerSploit",
    org: "Alexis Ahmed",
    kind: "canal",
    url: "https://www.youtube.com/@HackerSploit",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["redes", "hardening", "pentest"],
    note: "Long-form courses on pentesting, network security and hardening, organised in playlists you can follow in order."
  },
  {
    id: "13cubed",
    name: "13Cubed",
    org: "Richard Davis",
    kind: "canal",
    url: "https://www.youtube.com/@13Cubed",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-defensiva"],
    tags: ["forense", "dfir", "windows"],
    note: "Digital forensics and incident response with real rigour: artefacts, timelines and tooling explained end to end."
  },
  {
    id: "professor-messer",
    name: "Professor Messer",
    org: "James Messer",
    kind: "canal",
    url: "https://www.youtube.com/@professormesser",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva", "gobernanza-compliance"],
    tags: ["certificaciones", "fundamentos"],
    note: "Complete, free exam courses for entry-level certifications: useful as a vocabulary map for the first months."
  },
  {
    id: "david-bombal",
    name: "David Bombal",
    org: "David Bombal",
    kind: "canal",
    url: "https://www.youtube.com/@davidbombal",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva"],
    tags: ["redes", "entrevistas", "certificaciones"],
    note: "Networking, certifications and interviews with practitioners: good for seeing how the industry talks about itself."
  },
  {
    id: "simply-cyber",
    name: "Simply Cyber",
    org: "Gerald Auger",
    kind: "canal",
    url: "https://www.youtube.com/@SimplyCyber",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["gobernanza-compliance"],
    tags: ["carrera", "riesgo"],
    note: "Daily threat briefings and career guidance, including the parts about risk and compliance that engineers usually skip."
  },
  {
    id: "sans-offensive",
    name: "SANS Offensive Operations",
    org: "SANS Institute",
    kind: "canal",
    url: "https://www.youtube.com/@SANSOffensiveOperations",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-ofensiva"],
    tags: ["red-team", "tradecraft"],
    note: "Conference-grade talks on red team tradecraft. Not a course: you need a foundation first to get value from it."
  },
  {
    id: "defcon",
    name: "DEF CON",
    org: "DEF CON Communications",
    kind: "canal",
    url: "https://www.youtube.com/@DEFCONConference",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["conferencia", "comunidad", "investigacion"],
    note: "Decades of conference talks: the fastest way to see what the offensive and defensive communities are arguing about."
  },

  /* ────────────────────────────────────────── canales, en español */
  {
    id: "s4vitar",
    name: "s4vitar",
    org: "S4viOnLive",
    kind: "canal",
    url: "https://www.youtube.com/@s4vitar",
    lang: "es",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-ofensiva"],
    tags: ["red-team", "explotacion", "directos"],
    note: "Maratones en español a un ritmo brutal. No intentes seguirlo en directo: es material de referencia para pausar."
  },
  {
    id: "the-good-hacker",
    name: "The Good Hacker",
    org: "The Good Hacker",
    kind: "canal",
    url: "https://www.youtube.com/@TheGoodHacker",
    lang: "es",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["explotacion", "practica"],
    note: "Pentesting explicado paso a paso en español, con el contexto legal y metodológico que suele faltar en YouTube."
  },
  {
    id: "contandobits",
    name: "Contando Bits",
    org: "Kike Gandia",
    kind: "canal",
    url: "https://www.youtube.com/@ContandoBits",
    lang: "es",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva", "ciber-ofensiva"],
    tags: ["redes", "fundamentos", "reconocimiento"],
    note: "Conceptos técnicos desde cero, en español y sin humo: útil para el bloque de fundamentos y de reconocimiento."
  },
  {
    id: "hackavis",
    name: "hackavis",
    org: "hackavis",
    kind: "canal",
    url: "https://www.youtube.com/@hackavis",
    lang: "es",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-defensiva"],
    tags: ["forense", "apt", "threat-hunting"],
    note: "Forense digital y caza de amenazas explicado con casos: el complemento natural del bloque de respuesta e incidentes."
  },
  {
    id: "shell-dredd",
    name: "ShellDredd",
    org: "ShellDredd",
    kind: "canal",
    url: "https://www.youtube.com/@ShellDredd",
    lang: "es",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva", "ia-aplicada-segura"],
    tags: ["fundamentos", "linux", "programacion"],
    note: "Seguridad y programación contadas de forma didáctica; buen sitio para repasar Linux si vienes de otra carrera."
  },
  {
    id: "rootedcon",
    name: "RootedCON",
    org: "RootedCON",
    kind: "canal",
    url: "https://www.youtube.com/@RootedCON",
    lang: "es",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-ofensiva", "gobernanza-compliance"],
    tags: ["conferencia", "comunidad"],
    note: "Las charlas de la conferencia de referencia en español: investigación real, contada por quien la hizo."
  },
  {
    id: "xerosec",
    name: "XeroSec",
    org: "David (XeroSec)",
    kind: "canal",
    url: "https://www.youtube.com/@xerosec",
    lang: "es",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["practica", "tryhackme", "certificaciones"],
    note: "Walkthroughs en español de TryHackMe y Hack The Box, con consejos de certificaciones de entrada al Red Team."
  },

  /* ────────────────────────────────────────── canales, en portugués de Brasil */
  {
    id: "mente-binaria",
    name: "Mente Binária",
    org: "Mente Binária (ONG)",
    kind: "canal",
    url: "https://www.youtube.com/@mentebinaria",
    lang: "pt",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-defensiva", "ciber-ofensiva"],
    tags: ["fundamentos", "engenharia", "comunidade"],
    note: "Canal da ONG brasileira com cursos, entrevistas e conteúdo técnico em português; referência para quem estuda em pt-BR."
  },
  {
    id: "seginfobrasil",
    name: "SegInfo Brasil",
    org: "Marcos Cavinato / SegInfoBrasil",
    kind: "canal",
    url: "https://www.seginfobrasil.com.br/",
    lang: "pt",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva"],
    tags: ["redes", "seguranca-de-redes", "fundamentos"],
    note: "Séries gratuitas de segurança em redes em português (firewalls, IDS/IPS, segmentação) com instrutor certificado CISSP/CCSP."
  },
  {
    id: "hackaflag",
    name: "Hackaflag",
    org: "Hackaflag",
    kind: "canal",
    url: "https://hackaflag.com.br/",
    lang: "pt",
    cost: "registro",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["ctf", "pratica", "brasil"],
    note: "O maior campeonato de invasão de sistemas da América Latina: aprender atacando dentro das regras, em português."
  },
  {
    id: "curso-em-video",
    name: "Curso em Vídeo",
    org: "Gustavo Guanabara",
    kind: "canal",
    url: "https://www.youtube.com/@CursoemVideo",
    lang: "pt",
    cost: "abierto",
    level: "inicial",
    courses: ["ia-aplicada-segura"],
    tags: ["programacao", "fundamentos", "python"],
    note: "A porta de entrada em programação em português de Brasil: quem não escreveu uma linha de código ainda começa aqui."
  },
  {
    id: "diolinux",
    name: "Diolinux",
    org: "Diolinux",
    kind: "canal",
    url: "https://www.youtube.com/@Diolinux",
    lang: "pt",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva"],
    tags: ["linux", "seguranca", "ferramentas"],
    note: "Linux e software livre em português: base prática para hardening e administração sem a qual a defesa não se sustenta."
  },

  /* ────────────────────────────────────────── plataformas de práctica */
  {
    id: "portswigger-academy",
    name: "PortSwigger Web Security Academy",
    org: "PortSwigger",
    kind: "plataforma",
    url: "https://portswigger.net/web-security",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["web", "owasp", "practica-guiada"],
    note: "The labs that go with the OWASP Top 10, hosted and free: the single best web-security practice on the internet."
  },
  {
    id: "tryhackme",
    name: "TryHackMe",
    org: "TryHackMe",
    kind: "plataforma",
    url: "https://tryhackme.com/",
    lang: "en",
    cost: "registro",
    level: "inicial",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["practica-guiada", "rutas", "principiantes"],
    note: "Guided rooms that assume nothing; a good chunk is free. Check what is behind the paywall before committing."
  },
  {
    id: "hack-the-box",
    name: "Hack The Box",
    org: "Hack The Box",
    kind: "plataforma",
    url: "https://www.hackthebox.com/",
    lang: "en",
    cost: "registro",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["practica-guiada", "maquinas", "explotacion"],
    note: "Real machines to root, with a free tier and retired boxes that everyone has already written about: excellent practice."
  },
  {
    id: "overthewire",
    name: "OverTheWire",
    org: "OverTheWire",
    kind: "plataforma",
    url: "https://overthewire.org/wargames/",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva", "ciber-ofensiva"],
    tags: ["linux", "fundamentos", "practica-guiada"],
    note: "Wargames from Bandit up: the fastest, kindest way to make the Linux command line stop being intimidating."
  },
  {
    id: "picoctf",
    name: "picoCTF",
    org: "Carnegie Mellon University",
    kind: "ctf",
    url: "https://picoctf.org/",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-ofensiva"],
    tags: ["ctf", "principiantes", "universidad"],
    note: "A beginner-friendly CTF from a university, with past challenges and write-ups: the first competition that does not crush you."
  },
  {
    id: "ctftime",
    name: "CTFtime",
    org: "CTFtime",
    kind: "ctf",
    url: "https://ctftime.org/",
    lang: "multi",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["ctf", "calendario", "comunidad"],
    note: "The global CTF calendar and archive: pick one competition a month, write down what you learned, repeat."
  },
  {
    id: "owasp-juice-shop",
    name: "OWASP Juice Shop",
    org: "OWASP",
    kind: "laboratorio",
    url: "https://owasp.org/www-project-juice-shop/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["web", "owasp", "laboratorio"],
    note: "A deliberately vulnerable shop you run locally: it covers the whole OWASP Top 10 with progress tracking."
  },
  {
    id: "vulnhub",
    name: "VulnHub",
    org: "VulnHub",
    kind: "laboratorio",
    url: "https://www.vulnhub.com/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["maquinas", "laboratorio", "explotacion"],
    note: "Downloadable vulnerable machines, including the classic Metasploitable: practice with no external scope to worry about."
  },
  {
    id: "detectionlab",
    name: "DetectionLab",
    org: "Chris Long",
    kind: "laboratorio",
    url: "https://detectionlab.org/",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-defensiva"],
    tags: ["laboratorio", "telemetria", "windows"],
    note: "A ready-made detection lab (Windows domain, logs, SIEM) so you can practise detection without building it by hand."
  },
  {
    id: "atomic-red-team",
    name: "Atomic Red Team",
    org: "Red Canary",
    kind: "laboratorio",
    url: "https://github.com/redcanaryco/atomic-red-team",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["ciber-defensiva"],
    tags: ["telemetria", "detecao", "mitre"],
    note: "Small tests mapped to ATT&CK techniques: the honest way to prove whether your detection rules actually fire."
  },
  {
    id: "sigma",
    name: "Sigma",
    org: "SigmaHQ",
    kind: "laboratorio",
    url: "https://github.com/SigmaHQ/sigma",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-defensiva"],
    tags: ["detecao", "regras", "siem"],
    note: "The open rule format the campus uses for detection: read other people's rules before writing your own."
  },
  {
    id: "wazuh",
    name: "Wazuh",
    org: "Wazuh",
    kind: "laboratorio",
    url: "https://documentation.wazuh.com/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-defensiva"],
    tags: ["siem", "telemetria", "laboratorio"],
    note: "Free SIEM/XDR that runs on a laptop: what the week-2 lab is built on, with documentation you can actually follow."
  },

  /* ────────────────────────────────────────── documentación y estándares */
  {
    id: "mitre-attack",
    name: "MITRE ATT&CK",
    org: "MITRE",
    kind: "documento",
    url: "https://attack.mitre.org/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["mitre", "amenazas", "taxonomia"],
    note: "The shared vocabulary of adversary behaviour: every threat you write down should have a technique ID behind it."
  },
  {
    id: "owasp-top10",
    name: "OWASP Top 10",
    org: "OWASP Foundation",
    kind: "documento",
    url: "https://owasp.org/Top10/",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-ofensiva", "ia-aplicada-segura"],
    tags: ["web", "owasp", "riesgos"],
    note: "Ten families of web risk, with the data behind them: read the categories, not just the list of names."
  },
  {
    id: "owasp-cheatsheets",
    name: "OWASP Cheat Sheet Series",
    org: "OWASP Foundation",
    kind: "documento",
    url: "https://cheatsheetseries.owasp.org/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["defensa", "implementacao", "web"],
    note: "Short, opinionated recipes for defending each family of bug: the fix side of everything the offensive weeks break."
  },
  {
    id: "owasp-llm-top10",
    name: "OWASP Top 10 for LLM Applications",
    org: "OWASP Foundation (GenAI)",
    kind: "documento",
    url: "https://genai.owasp.org/llm-top-10/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ia-aplicada-segura"],
    tags: ["ia", "llm", "riesgos"],
    note: "The list the AI weeks are organised around: prompt injection, excessive agency, model theft and friends."
  },
  {
    id: "mitre-atlas",
    name: "MITRE ATLAS",
    org: "MITRE",
    kind: "documento",
    url: "https://atlas.mitre.org/",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["ia-aplicada-segura"],
    tags: ["ia", "adversarial", "taxonomia"],
    note: "ATT&CK for machine-learning systems: the catalogue of real attacks against AI, each with references."
  },
  {
    id: "nist-ai-rmf",
    name: "NIST AI Risk Management Framework",
    org: "NIST",
    kind: "documento",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ia-aplicada-segura", "gobernanza-compliance"],
    tags: ["ia", "riesgo", "gobernanza"],
    note: "The governance frame for AI systems: useful when a quiz answer has to survive a compliance review."
  },
  {
    id: "nist-csf",
    name: "NIST Cybersecurity Framework 2.0",
    org: "NIST",
    kind: "documento",
    url: "https://www.nist.gov/cyberframework",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["gobernanza-compliance", "ciber-defensiva"],
    tags: ["gobernanza", "funciones", "marco"],
    note: "Six functions (govern, identify, protect, detect, respond, recover) that turn a pile of controls into an argument."
  },
  {
    id: "nist-800-61",
    name: "NIST SP 800-61 (Incident Handling)",
    org: "NIST",
    kind: "documento",
    url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-defensiva"],
    tags: ["incidentes", "respuesta", "estandar"],
    note: "The incident-response lifecycle the campus teaches, straight from the source and free to download."
  },
  {
    id: "cis-benchmarks",
    name: "CIS Benchmarks",
    org: "Center for Internet Security",
    kind: "documento",
    url: "https://www.cisecurity.org/cis-benchmarks",
    lang: "en",
    cost: "registro",
    level: "intermedio",
    courses: ["ciber-defensiva"],
    tags: ["hardening", "checklist", "sistemas"],
    note: "Per-system hardening baselines with rationale per control: requires a free account to download the PDFs."
  },
  {
    id: "iso-27001",
    name: "ISO/IEC 27001",
    org: "ISO",
    kind: "documento",
    url: "https://www.iso.org/standard/27001",
    lang: "en",
    cost: "registro",
    level: "avanzado",
    courses: ["gobernanza-compliance"],
    tags: ["iso", "sgsI", "certificacion"],
    note: "The standard itself is paid, but the official overview is free: read that first and be sceptical of summaries."
  },
  {
    id: "rgpd",
    name: "RGPD (UE) 2016/679",
    org: "Unión Europea",
    kind: "documento",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    lang: "multi",
    cost: "abierto",
    level: "intermedio",
    courses: ["gobernanza-compliance"],
    tags: ["privacidad", "ley", "europa"],
    note: "The regulation in all official languages of the Union, Portuguese and Spanish included: cite the article, not the blog."
  },
  {
    id: "lgpd",
    name: "LGPD (Lei 13.709/2018)",
    org: "Presidência da República do Brasil",
    kind: "documento",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    lang: "pt",
    cost: "abierto",
    level: "intermedio",
    courses: ["gobernanza-compliance"],
    tags: ["privacidade", "lei", "brasil"],
    note: "A lei brasileira de proteção de dados no texto oficial: é a que vale para quem estuda deste lado do Atlântico."
  },
  {
    id: "cisa-kev",
    name: "CISA Known Exploited Vulnerabilities",
    org: "CISA",
    kind: "documento",
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["vulnerabilidades", "priorizacao", "kev"],
    note: "What is being exploited in the wild right now: the first list to check before quoting a CVSS score at anyone."
  },
  {
    id: "first-cvss",
    name: "CVSS 3.1 Calculator",
    org: "FIRST",
    kind: "documento",
    url: "https://www.first.org/cvss/calculator/3.1",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-ofensiva"],
    tags: ["vulnerabilidades", "severidad", "cvss"],
    note: "Score a finding the way the industry does, and read the vector string out loud so somebody can argue with you."
  },
  {
    id: "first-epss",
    name: "EPSS",
    org: "FIRST",
    kind: "documento",
    url: "https://www.first.org/epss/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["vulnerabilidades", "probabilidade", "epss"],
    note: "The probability a vulnerability will be exploited in the next 30 days: the number that stops severity from being theatre."
  },
  {
    id: "rfc-9116",
    name: "RFC 9116 — security.txt",
    org: "IETF",
    kind: "documento",
    url: "https://www.rfc-editor.org/rfc/rfc9116",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["gobernanza-compliance"],
    tags: ["divulgacao", "estandar", "web"],
    note: "How a site tells a researcher where to report a bug: short, boring, and the difference between a report and a lawsuit."
  },

  /* ────────────────────────────────────────── desarrollo (la otra mitad del oficio) */
  {
    id: "cs50",
    name: "CS50",
    org: "Harvard University",
    kind: "curso",
    url: "https://cs50.harvard.edu/x/",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ia-aplicada-segura"],
    tags: ["informatica", "fundamentos", "universidad"],
    note: "The famous introduction to computer science, free and with real problem sets: this is the bar the campus aims at."
  },
  {
    id: "the-odin-project",
    name: "The Odin Project",
    org: "The Odin Project",
    kind: "curso",
    url: "https://www.theodinproject.com/",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ia-aplicada-segura"],
    tags: ["desarrollo", "web", "practica"],
    note: "A full open web-development curriculum with projects you actually ship, no account and no upsell in the middle."
  },
  {
    id: "full-stack-open",
    name: "Full Stack Open",
    org: "University of Helsinki",
    kind: "curso",
    url: "https://fullstackopen.com/en/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ia-aplicada-segura"],
    tags: ["desarrollo", "web", "universidad"],
    note: "A university course on modern web development, free, with graded exercises: the closest thing to a real degree online."
  },
  {
    id: "mdn",
    name: "MDN Web Docs",
    org: "Mozilla",
    kind: "documento",
    url: "https://developer.mozilla.org/",
    lang: "multi",
    cost: "abierto",
    level: "inicial",
    courses: ["ia-aplicada-segura"],
    tags: ["desarrollo", "web", "referencia"],
    note: "The reference for HTML, CSS and JavaScript, available in several languages including Spanish and Brazilian Portuguese."
  },
  {
    id: "typescript-handbook",
    name: "TypeScript Handbook",
    org: "Microsoft",
    kind: "documento",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ia-aplicada-segura"],
    tags: ["desarrollo", "tipos", "referencia"],
    note: "The official handbook for the language this platform is written in: read it if you want to read the campus source."
  },
  {
    id: "freecodecamp",
    name: "freeCodeCamp",
    org: "freeCodeCamp.org",
    kind: "curso",
    url: "https://www.freecodecamp.org/learn",
    lang: "multi",
    cost: "abierto",
    level: "inicial",
    courses: ["ia-aplicada-segura"],
    tags: ["desarrollo", "certificaciones", "practica"],
    note: "Thousands of hours of coding curriculum, free, with certifications that cost nothing and mean something to employers."
  },
  {
    id: "exercism",
    name: "Exercism",
    org: "Exercism",
    kind: "plataforma",
    url: "https://exercism.org/",
    lang: "multi",
    cost: "abierto",
    level: "inicial",
    courses: ["ia-aplicada-segura"],
    tags: ["programacao", "practica", "mentoria"],
    note: "Exercises in dozens of languages with optional human mentoring: the fastest way to fix your own bad habits."
  },
  /* ───────────────────────────── más canales y plataformas, por área */
  {
    id: "hacktricks",
    name: "HackTricks",
    org: "Carlos Polop y colaboradores",
    kind: "documento",
    url: "https://book.hacktricks.wiki/",
    lang: "multi",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["ofensiva", "linux", "windows", "active-directory", "privesc"],
    note: "Enciclopedia abierta de técnicas de laboratorio, mantenida por la comunidad y enlazada a la fuente original de cada técnica."
  },
  {
    id: "gtfobins",
    name: "GTFOBins",
    org: "GTFOBins (proyecto abierto)",
    kind: "documento",
    url: "https://gtfobins.github.io/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["linux", "privesc", "suid", "laboratorio"],
    note: "Qué binario de Unix sirve para qué, con la advertencia de la casa: en producción se usa con permiso por escrito y en laboratorio propio."
  },
  {
    id: "lolbas",
    name: "LOLBAS",
    org: "LOLBAS Project",
    kind: "documento",
    url: "https://lolbas-project.github.io/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["windows", "living-off-the-land", "deteccion"],
    note: "Binarios firmados de Windows usados para vivir de la tierra: imprescindible para escribir detecciones que no dependan de malware."
  },
  {
    id: "cyberdefenders",
    name: "CyberDefenders",
    org: "CyberDefenders",
    kind: "laboratorio",
    url: "https://cyberdefenders.org/",
    lang: "en",
    cost: "registro",
    level: "intermedio",
    courses: ["ciber-defensiva"],
    tags: ["dfir", "forense", "retos", "telemetria"],
    note: "Retos de forense digital y respuesta a incidentes con imágenes y artefactos reales; cada reto exige un informe, no un acierto."
  },
  {
    id: "letsdefend",
    name: "LetsDefend",
    org: "LetsDefend",
    kind: "plataforma",
    url: "https://letsdefend.io/",
    lang: "en",
    cost: "registro",
    level: "inicial",
    courses: ["ciber-defensiva"],
    tags: ["soc", "triaje", "alertas", "telemetria"],
    note: "Cola de alertas simulada con capa gratuita: sirve para practicar triaje y para descubrir que el trabajo de SOC es decidir con datos incompletos."
  },
  {
    id: "kaggle-learn",
    name: "Kaggle Learn",
    org: "Kaggle (Google)",
    kind: "plataforma",
    url: "https://www.kaggle.com/learn",
    lang: "en",
    cost: "registro",
    level: "inicial",
    courses: ["ia-aplicada-segura"],
    tags: ["machine-learning", "datos", "practica", "cuadernos"],
    note: "Cursos cortos con cuadernos ejecutables y conjuntos de datos reales: el sitio donde el modelo se rompe de verdad y se ve por qué."
  },
  {
    id: "huggingface-course",
    name: "Hugging Face — Course",
    org: "Hugging Face",
    kind: "curso",
    url: "https://huggingface.co/learn",
    lang: "multi",
    cost: "abierto",
    level: "intermedio",
    courses: ["ia-aplicada-segura"],
    tags: ["llm", "transformers", "rag", "modelos"],
    note: "Curso abierto sobre transformers y despliegue de modelos; incluye capítulos sobre evaluación, sesgo y uso responsable."
  },
  {
    id: "mlops-zoomcamp",
    name: "MLOps Zoomcamp",
    org: "DataTalksClub",
    kind: "curso",
    url: "https://github.com/DataTalksClub/mlops-zoomcamp",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ia-aplicada-segura"],
    tags: ["mlops", "despliegue", "monitorizacion", "reproducibilidad"],
    note: "El ciclo de vida completo de un modelo en producción, con el énfasis donde importa: despliegue, monitorización y deriva."
  },
  {
    id: "owasp-ml-top10",
    name: "OWASP Machine Learning Security Top 10",
    org: "OWASP",
    kind: "documento",
    url: "https://owasp.org/www-project-machine-learning-security-top-10/",
    lang: "en",
    cost: "abierto",
    level: "intermedio",
    courses: ["ia-aplicada-segura"],
    tags: ["owasp", "machine-learning", "riesgos", "ataques"],
    note: "Los diez riesgos de los sistemas de aprendizaje automático con ejemplos de ataque: la lista que ordena las semanas 5 a 8 del programa."
  },
  {
    id: "nist-800-218",
    name: "NIST SP 800-218 · SSDF",
    org: "NIST",
    kind: "documento",
    url: "https://csrc.nist.gov/pubs/sp/800/218/final",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["gobernanza-compliance", "ia-aplicada-segura"],
    tags: ["ssdf", "desarrollo-seguro", "nist", "cadena-de-suministro"],
    note: "Marco de desarrollo seguro del software: el documento que convierte «hacemos código seguro» en prácticas con evidencia."
  },
  {
    id: "slsa",
    name: "SLSA",
    org: "OpenSSF",
    kind: "documento",
    url: "https://slsa.dev/",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["gobernanza-compliance", "ciber-defensiva"],
    tags: ["cadena-de-suministro", "build", "integridad", "slsa"],
    note: "Niveles de integridad de la cadena de suministro: por qué firmar el artefacto no basta si el proceso de construcción no es verificable."
  },
  {
    id: "anpd",
    name: "ANPD",
    org: "Autoridade Nacional de Proteção de Dados (Brasil)",
    kind: "documento",
    url: "https://www.gov.br/anpd/pt-br",
    lang: "pt",
    cost: "abierto",
    level: "intermedio",
    courses: ["gobernanza-compliance"],
    tags: ["lgpd", "privacidade", "autoridad", "brasil"],
    note: "La autoridad brasileña de protección de datos: guías y orientaciones en portugués para aplicar la LGPD sin intermediarios."
  },
  {
    id: "aepd",
    name: "AEPD",
    org: "Agencia Española de Protección de Datos",
    kind: "documento",
    url: "https://www.aepd.es/",
    lang: "es",
    cost: "abierto",
    level: "intermedio",
    courses: ["gobernanza-compliance"],
    tags: ["rgpd", "privacidad", "autoridad", "espana"],
    note: "Guías y resoluciones de la autoridad española: la interpretación del RGPD en castellano, con casos reales y sanciones."
  },
  {
    id: "enisa",
    name: "ENISA",
    org: "Agencia de la Unión Europea para la Ciberseguridad",
    kind: "documento",
    url: "https://www.enisa.europa.eu/",
    lang: "en",
    cost: "abierto",
    level: "avanzado",
    courses: ["gobernanza-compliance", "ciber-defensiva"],
    tags: ["europa", "amenazas", "informes", "politica"],
    note: "Informes de panorama de amenazas y metodologías europeas: la fuente que citan los reguladores cuando exigen prioridades."
  },
  {
    id: "guide-anonima",
    name: "Guia Anônima",
    org: "Guia Anônima",
    kind: "canal",
    url: "https://www.youtube.com/@GuiaAnonimaOficial",
    lang: "pt",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva"],
    tags: ["ofensiva", "laboratorio", "brasil", "fundamentos"],
    note: "Canal brasileño de fundamentos y laboratorio ofensivo; explica en portugués el porqué de cada ferramenta, no sólo el comando."
  },
  {
    id: "desec",
    name: "Desec Security",
    org: "Desec Security",
    kind: "canal",
    url: "https://www.youtube.com/@DesecSecurity",
    lang: "pt",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["pentest", "brasil", "laboratorio", "carreira"],
    note: "Pentest explicado en portugués con laboratorios propios; útil para quien empieza sin inglés y quiere llegar al certificado con criterio."
  },
  {
    id: "cavelab",
    name: "CaveLab",
    org: "CaveLab",
    kind: "canal",
    url: "https://www.youtube.com/@CaveLab",
    lang: "es",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-defensiva"],
    tags: ["blue-team", "deteccion", "espanol", "soc"],
    note: "Contenido en castellano centrado en defensa y detección: el lado que casi nunca aparece en los canales populares de ofensiva."
  },
  {
    id: "hackplayers",
    name: "Hackplayers",
    org: "Comunidad Hackplayers",
    kind: "plataforma",
    url: "https://www.hackplayers.com/",
    lang: "es",
    cost: "abierto",
    level: "intermedio",
    courses: ["ciber-ofensiva", "ciber-defensiva"],
    tags: ["espanol", "comunidad", "herramientas", "ctf"],
    note: "Comunidad en castellano con retos, talleres y herramientas propias; el sitio donde una duda se responde con un ejemplo reproducible."
  },
  {
    id: "cloud-security-alliance",
    name: "Cloud Security Alliance",
    org: "CSA",
    kind: "documento",
    url: "https://cloudsecurityalliance.org/",
    lang: "en",
    cost: "registro",
    level: "avanzado",
    courses: ["gobernanza-compliance"],
    tags: ["nube", "gobierno", "ccm", "arquitectura"],
    note: "Matriz de controles en la nube y guías de gobierno: la referencia para repartir responsabilidades entre proveedor y cliente sin ambigüedad."
  },
  {
    id: "roadmap-sh-security",
    name: "roadmap.sh — Cyber Security",
    org: "roadmap.sh (Kamran Ahmed)",
    kind: "documento",
    url: "https://roadmap.sh/cyber-security",
    lang: "en",
    cost: "abierto",
    level: "inicial",
    courses: ["ciber-defensiva", "ciber-ofensiva"],
    tags: ["ruta", "fundamentos", "orden", "estudio"],
    note: "Hoja de ruta visual de fundamentos: sirve para ordenar el estudio propio y para compararlo con la malla de cinco años del campus."
  }
] as const;

/** Recursos que encajan con un programa del campus. */
export function libraryForCourse(slug: string): LibraryResource[] {
  return LIBRARY.filter((recurso) => recurso.courses.includes(slug));
}

export interface LibraryFilter {
  query?: string;
  kinds?: readonly LibraryKind[];
  langs?: readonly LibraryLang[];
  costs?: readonly LibraryCost[];
  levels?: readonly LibraryLevel[];
  course?: string;
}

/** Filtro determinista que comparten la página y los tests. */
export function filterLibrary(filtro: LibraryFilter): LibraryResource[] {
  const q = (filtro.query ?? "").trim().toLowerCase();
  return LIBRARY.filter((recurso) => {
    if (filtro.kinds?.length && !filtro.kinds.includes(recurso.kind)) return false;
    if (filtro.langs?.length && !filtro.langs.includes(recurso.lang)) return false;
    if (filtro.costs?.length && !filtro.costs.includes(recurso.cost)) return false;
    if (filtro.levels?.length && !filtro.levels.includes(recurso.level)) return false;
    if (filtro.course && !recurso.courses.includes(filtro.course)) return false;
    if (!q) return true;
    const heno = [recurso.name, recurso.org, recurso.note, ...recurso.tags, ...recurso.courses]
      .join(" ")
      .toLowerCase();
    return heno.includes(q);
  });
}

export interface LibraryStats {
  total: number;
  byKind: Record<LibraryKind, number>;
  byLang: Record<LibraryLang, number>;
  domains: number;
  coursesCovered: number;
}

export function libraryStats(): LibraryStats {
  const byKind = Object.fromEntries(LIBRARY_KINDS.map((kind) => [kind, 0])) as Record<LibraryKind, number>;
  const byLang = Object.fromEntries(LIBRARY_LANGS.map((lang) => [lang, 0])) as Record<LibraryLang, number>;
  const dominios = new Set<string>();
  const cursos = new Set<string>();
  for (const recurso of LIBRARY) {
    byKind[recurso.kind] += 1;
    byLang[recurso.lang] += 1;
    try {
      dominios.add(new URL(recurso.url).hostname);
    } catch {
      /* Un URL inválido lo denuncia el test, no la interfaz. */
    }
    for (const curso of recurso.courses) cursos.add(curso);
  }
  return { total: LIBRARY.length, byKind, byLang, domains: dominios.size, coursesCovered: cursos.size };
}

/**
 * Dominios que **no** se enlazan ni se citan: espejos y agregadores que
 * redistribuyen cursos de pago sin autorización. El test de la biblioteca
 * comprueba que ningún recurso apunte aquí.
 */
export const DOMINIOS_PROHIBIDOS: readonly string[] = [
  "drivedepobre.com",
  "cursou.com",
  "cursosgratisonline.net"
] as const;

/** Etiquetas de tema admitidas (sin traducción: alimentan el buscador). */
export const LIBRARY_TAGS: readonly string[] = [
  "active-directory",
  "adversarial",
  "amenazas",
  "apt",
  "brasil",
  "calendario",
  "carrera",
  "certificaciones",
  "checklist",
  "comunidade",
  "comunidad",
  "conferencia",
  "certificacion",
  "ctf",
  "cvss",
  "defensa",
  "desarrollo",
  "detecao",
  "dfir",
  "directos",
  "divulgacao",
  "enumeracion",
  "epss",
  "estandar",
  "europa",
  "explotacion",
  "ferramentas",
  "forense",
  "fundamentos",
  "funciones",
  "gobernanza",
  "hardening",
  "ia",
  "implementacao",
  "incidentes",
  "informatica",
  "informe",
  "investigacion",
  "iso",
  "laboratorio",
  "kev",
  "lei",
  "ley",
  "linux",
  "llm",
  "maquinas",
  "malware",
  "marco",
  "mentoria",
  "metodologia",
  "mitre",
  "on-ramp",
  "owasp",
  "pentest",
  "practica",
  "practica-guiada",
  "pratica",
  "principiantes",
  "privacidad",
  "privacidade",
  "priorizacao",
  "probabilidade",
  "programacao",
  "programacion",
  "python",
  "red-team",
  "redes",
  "referencia",
  "regras",
  "reconocimiento",
  "respuesta",
  "riesgo",
  "riesgos",
  "rutas",
  "seguranca-de-redes",
  "seguranca",
  "engenharia",
  "entrevistas",
  "severidad",
  "sgsI",
  "siem",
  "sistemas",
  "taxonomia",
  "telemetria",
  "threat-hunting",
  "tipos",
  "tradecraft",
  "tryhackme",
  "universidad",
  "vulnerabilidades",
  "web",
  "windows",
  "alertas",
  "arquitectura",
  "ataques",
  "autoridad",
  "blue-team",
  "build",
  "cadena-de-suministro",
  "carreira",
  "ccm",
  "cuadernos",
  "datos",
  "desarrollo-seguro",
  "despliegue",
  "deteccion",
  "espana",
  "espanol",
  "estudio",
  "gobierno",
  "herramientas",
  "informes",
  "integridad",
  "lgpd",
  "living-off-the-land",
  "machine-learning",
  "mlops",
  "modelos",
  "monitorizacion",
  "nist",
  "nube",
  "ofensiva",
  "orden",
  "parcheo",
  "politica",
  "priorizacion",
  "privesc",
  "rag",
  "reglas",
  "reproducibilidad",
  "retos",
  "rgpd",
  "ruta",
  "sigma",
  "slsa",
  "soc",
  "ssdf",
  "suid",
  "transformers",
  "triaje"
] as const;

/** Claves de idioma de la interfaz que necesita la página de biblioteca. */
export const LIBRARY_UI_KEYS = [
  "library.title",
  "library.lead",
  "library.filter.kind",
  "library.filter.lang",
  "library.filter.cost",
  "library.filter.level",
  "library.filter.course",
  "library.filter.all",
  "library.results",
  "library.empty",
  "library.open",
  "library.newTab",
  "library.rule.title",
  "library.rule.body",
  "library.stats"
] as const satisfies readonly TranslationKey[];
