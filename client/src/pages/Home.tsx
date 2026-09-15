import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Code2, ChevronDown, Globe2, GraduationCap, Menu, Network, Play, Search, Shield, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

type Lang = "pt-BR" | "es" | "en";

const COPY: Record<Lang, {
  nav: { programs: string; method: string; community: string; portal: string; apply: string };
  hero: {
    badge: string; title1: string; accent: string; title2: string; lead: string;
    explore: string; portal: string; traits: [string, string][];
  };
  cockpit: {
    eyebrow: string; title: string; noAccount: string; create: string; step: string;
    lesson: string; course: string; pct: string; labs: string; hours: string;
    mentor: string; next: string;
  };
  programs: { eyebrow: string; title1: string; title2: string; lead: string; pathways: { kicker: string; title: string; description: string; courses: string }[] };
  method: { eyebrow: string; title1: string; accent: string; lead: string; guide: string; steps: [string, string, string, string][] };
  catalogue: { eyebrow: string; title: string; search: string; go: string; open: string; courses: { code: string; lesson: string; title: string; meta: string; color: string }[] };
  community: { kicker: string; title: string; lead: string; cta: string };
  footer: { learning: string; rights: string; privacy: string };
}> = {
  "pt-BR": {
    nav: { programs: "Programas", method: "Como funciona", community: "Comunidade", portal: "Portal do aluno", apply: "Inscrever-se" },
    hero: {
      badge: "TURMA 01 · INSCRIÇÕES ABERTAS",
      title1: "Aprenda a ", accent: "proteger", title2: "o que importa.",
      lead: "Uma universidade moderna para cibersegurança, idiomas e desenvolvimento full-stack. Pratique em sistemas reais. Pense com evidências. Construa uma carreira com sinal.",
      explore: "Explorar programas", portal: "Abrir portal do aluno",
      traits: [["01", "mentalidade universitária"], ["02", "labs com evidências"], ["03", "apoio humano + IA"]],
    },
    cockpit: {
      eyebrow: "sua cabine de aprendizado", title: "Comece aqui.", noAccount: "Ainda sem conta —", create: "crie sua matrícula local",
      step: "PRIMEIRO PASSO SUGERIDO", lesson: "Risco é uma decisão", course: "Fundamentos de Cibersegurança · CY-101 · demo",
      pct: "0%", labs: "labs ainda · demo", hours: "este dispositivo · demo",
      mentor: "Astra, sua mentora", next: "Sua próxima melhor ação está pronta.",
    },
    programs: {
      eyebrow: "Escolha sua direção", title1: "Três disciplinas.", title2: "Um campus conectado.",
      lead: "Comece de onde você está. Combine habilidades entre disciplinas. Forme-se com um conjunto de trabalhos que você consegue defender.",
      pathways: [
        { kicker: "04 ANOS · 240 ECTS", title: "Cibersegurança", description: "Dos primeiros princípios à resposta a incidentes. Construa o julgamento, a profundidade técnica e a prática de evidências que as equipes reais precisam.", courses: "12 cursos · 8 labs" },
        { kicker: "IDIOMAS · GLOBAL", title: "Idiomas e cultura", description: "Aprenda o idioma das equipes onde você quer entrar. Pratique comunicação, vocabulário técnico e colaboração intercultural.", courses: "6 idiomas · prática ao vivo" },
        { kicker: "FULL STACK · POR PROJETOS", title: "Desenvolvimento full-stack", description: "Projete, publique e defenda aplicações de nível de produção com um currículo baseado em sistemas reais, não em exercícios de brinquedo.", courses: "10 cursos · 14 projetos" },
      ],
    },
    method: {
      eyebrow: "O método secure T", title1: "Não conteúdo.", accent: "Capacidade.",
      lead: "Nosso modelo de aprendizagem gira em torno do trabalho em si: entenda o sistema, pratique a decisão, explique a evidência.",
      guide: "Ler o guia acadêmico",
      steps: [
        ["01 / CONSTRUIR", "Aprenda o modelo mental", "Aulas curtas, linguagem clara e um currículo que conecta teoria a sistemas.", "text-[#b8f36b]"],
        ["02 / QUEBRAR", "Pratique em labs seguros", "Trabalhe em cenários isolados onde a curiosidade é incentivada e os erros são recuperáveis.", "text-[#49dce8]"],
        ["03 / PROVAR", "Envie sua evidência", "Construa um registro de decisões, artefatos e reflexões — não apenas uma porcentagem.", "text-[#ff8377]"],
        ["04 / CRESCER", "Receba feedback humano", "Mentores e colegas ajudam a calibrar seu pensamento. A IA recomenda; as pessoas continuam responsáveis.", "text-[#bda2ff]"],
      ],
    },
    catalogue: {
      eyebrow: "Explore o catálogo", title: "Cursos com um ponto de vista.", search: "Buscar cursos", go: "Ir", open: "Abrir primeira aula",
      courses: [
        { code: "CY-101", lesson: "cy-101-1", title: "Fundamentos de Cibersegurança", meta: "8 semanas · Iniciante · demo", color: "lime" },
        { code: "WEB-201", lesson: "web-201-1", title: "Segurança de Aplicações Web", meta: "10 semanas · Intermediário · demo", color: "cyan" },
        { code: "SOC-301", lesson: "soc-301-1", title: "Engenharia de Detecção", meta: "12 semanas · Avançado · demo", color: "violet" },
      ],
    },
    community: {
      kicker: "SEU PRÓXIMO CAPÍTULO COMEÇA AQUI", title: "Construa um futuro que vale a pena defender.",
      lead: "Entre numa turma de pessoas curiosas aprendendo a tornar a tecnologia mais confiável.", cta: "Criar meu perfil",
    },
    footer: { learning: "Aprendendo em público.", rights: "© 2026 secureT", privacy: "Privacidade e configurações" },
  },
  es: {
    nav: { programs: "Programas", method: "Cómo funciona", community: "Comunidad", portal: "Portal del estudiante", apply: "Inscribirse" },
    hero: {
      badge: "COHORTE 01 · INSCRIPCIONES ABIERTAS",
      title1: "Aprende a ", accent: "proteger", title2: "lo que importa.",
      lead: "Una universidad moderna para ciberseguridad, idiomas y desarrollo full-stack. Practica en sistemas reales. Piensa con evidencias. Construye una carrera con señal.",
      explore: "Explorar programas", portal: "Abrir portal del estudiante",
      traits: [["01", "mentalidad universitaria"], ["02", "labs con evidencias"], ["03", "apoyo humano + IA"]],
    },
    cockpit: {
      eyebrow: "tu cabina de aprendizaje", title: "Empieza aquí.", noAccount: "Sin cuenta todavía —", create: "crea tu matrícula local",
      step: "PRIMER PASO SUGERIDO", lesson: "El riesgo es una decisión", course: "Fundamentos de Ciberseguridad · CY-101 · demo",
      pct: "0%", labs: "labs aún · demo", hours: "este dispositivo · demo",
      mentor: "Astra, tu mentora", next: "Tu próxima mejor acción está lista.",
    },
    programs: {
      eyebrow: "Elige tu dirección", title1: "Tres disciplinas.", title2: "Un campus conectado.",
      lead: "Empieza donde estás. Combina habilidades entre disciplinas. Gráduate con un cuerpo de trabajo que puedas defender.",
      pathways: [
        { kicker: "04 AÑOS · 240 ECTS", title: "Ciberseguridad", description: "De los primeros principios a la respuesta a incidentes. Construye el criterio, la profundidad técnica y la práctica de evidencias que necesitan los equipos reales.", courses: "12 cursos · 8 labs" },
        { kicker: "IDIOMAS · GLOBAL", title: "Idiomas y cultura", description: "Aprende el idioma de los equipos a los que quieres unirte. Practica comunicación, vocabulario técnico y colaboración intercultural.", courses: "6 idiomas · práctica en vivo" },
        { kicker: "FULL STACK · POR PROYECTOS", title: "Desarrollo full-stack", description: "Diseña, publica y defiende aplicaciones de nivel producción con un currículo basado en sistemas reales, no en ejercicios de juguete.", courses: "10 cursos · 14 proyectos" },
      ],
    },
    method: {
      eyebrow: "El método secure T", title1: "No contenido.", accent: "Capacidad.",
      lead: "Nuestro modelo de aprendizaje gira en torno al trabajo: entiende el sistema, practica la decisión, explica la evidencia.",
      guide: "Leer la guía académica",
      steps: [
        ["01 / CONSTRUIR", "Aprende el modelo mental", "Lecciones cortas, lenguaje claro y un currículo que conecta la teoría con sistemas.", "text-[#b8f36b]"],
        ["02 / ROMPER", "Practica en labs seguros", "Trabaja en escenarios aislados donde se fomenta la curiosidad y los errores son recuperables.", "text-[#49dce8]"],
        ["03 / PROBAR", "Entrega tu evidencia", "Construye un registro de decisiones, artefactos y reflexiones — no solo un porcentaje.", "text-[#ff8377]"],
        ["04 / CRECER", "Recibe feedback humano", "Mentores y pares ayudan a calibrar tu pensamiento. La IA recomienda; las personas siguen siendo responsables.", "text-[#bda2ff]"],
      ],
    },
    catalogue: {
      eyebrow: "Explora el catálogo", title: "Cursos con un punto de vista.", search: "Buscar cursos", go: "Ir", open: "Abrir primera lección",
      courses: [
        { code: "CY-101", lesson: "cy-101-1", title: "Fundamentos de Ciberseguridad", meta: "8 semanas · Principiante · demo", color: "lime" },
        { code: "WEB-201", lesson: "web-201-1", title: "Seguridad de Aplicaciones Web", meta: "10 semanas · Intermedio · demo", color: "cyan" },
        { code: "SOC-301", lesson: "soc-301-1", title: "Ingeniería de Detección", meta: "12 semanas · Avanzado · demo", color: "violet" },
      ],
    },
    community: {
      kicker: "TU PRÓXIMO CAPÍTULO EMPIEZA AQUÍ", title: "Construye un futuro que merezca defenderse.",
      lead: "Únete a una cohorte de personas curiosas que aprenden a hacer la tecnología más confiable.", cta: "Crear mi perfil",
    },
    footer: { learning: "Aprendiendo en público.", rights: "© 2026 secureT", privacy: "Privacidad y ajustes" },
  },
  en: {
    nav: { programs: "Programs", method: "How it works", community: "Community", portal: "Student portal", apply: "Apply now" },
    hero: {
      badge: "COHORT 01 · APPLICATIONS OPEN",
      title1: "Learn to ", accent: "secure", title2: "what matters.",
      lead: "A modern university for cybersecurity, languages and full-stack development. Practice on real systems. Think in evidence. Build a career with signal.",
      explore: "Explore programs", portal: "Open student portal",
      traits: [["01", "university mindset"], ["02", "evidence-led labs"], ["03", "human + AI support"]],
    },
    cockpit: {
      eyebrow: "your learning cockpit", title: "Start here.", noAccount: "No account yet —", create: "create your local enrollment",
      step: "SUGGESTED FIRST STEP", lesson: "Risk is a decision", course: "Cybersecurity Fundamentals · CY-101 · demo",
      pct: "0%", labs: "labs yet · demo", hours: "this device · demo",
      mentor: "Astra, your mentor", next: "Your next best action is ready.",
    },
    programs: {
      eyebrow: "Choose your direction", title1: "Three disciplines.", title2: "One connected campus.",
      lead: "Start where you are. Stack skills across disciplines. Graduate with a body of work you can defend.",
      pathways: [
        { kicker: "04 YEARS · 240 ECTS", title: "Cybersecurity", description: "From first principles to incident response. Build the judgment, technical depth and evidence practice that real security teams need.", courses: "12 courses · 8 labs" },
        { kicker: "LANGUAGES · GLOBAL", title: "Languages & culture", description: "Learn the language of the teams you want to join. Practice communication, technical vocabulary and cross-cultural collaboration.", courses: "6 languages · live practice" },
        { kicker: "FULL STACK · PROJECT BASED", title: "Full-stack development", description: "Design, ship and defend production-grade applications with a curriculum built around real systems, not toy exercises.", courses: "10 courses · 14 projects" },
      ],
    },
    method: {
      eyebrow: "The secure T method", title1: "Not content.", accent: "Capability.",
      lead: "Our learning model is designed around the work itself: understand the system, practice the decision, explain the evidence.",
      guide: "Read the academic guide",
      steps: [
        ["01 / BUILD", "Learn the mental model", "Short lessons, clear language and a curriculum that connects theory to systems.", "text-[#b8f36b]"],
        ["02 / BREAK", "Practice in safe labs", "Work on isolated scenarios where curiosity is encouraged and mistakes are recoverable.", "text-[#49dce8]"],
        ["03 / PROVE", "Submit your evidence", "Build a record of decisions, artifacts and reflections—not just a percentage.", "text-[#ff8377]"],
        ["04 / GROW", "Get human feedback", "Mentors and peers help you calibrate your thinking. AI recommends; people stay accountable.", "text-[#bda2ff]"],
      ],
    },
    catalogue: {
      eyebrow: "Explore the catalogue", title: "Courses with a point of view.", search: "Search courses", go: "Go", open: "Open first lesson",
      courses: [
        { code: "CY-101", lesson: "cy-101-1", title: "Cybersecurity Fundamentals", meta: "8 weeks · Beginner · demo", color: "lime" },
        { code: "WEB-201", lesson: "web-201-1", title: "Web Application Security", meta: "10 weeks · Intermediate · demo", color: "cyan" },
        { code: "SOC-301", lesson: "soc-301-1", title: "Detection Engineering", meta: "12 weeks · Advanced · demo", color: "violet" },
      ],
    },
    community: {
      kicker: "YOUR NEXT CHAPTER STARTS HERE", title: "Build a future worth defending.",
      lead: "Join a cohort of curious people learning to make technology more trustworthy.", cta: "Create your profile",
    },
    footer: { learning: "Learning in public.", rights: "© 2026 secureT", privacy: "Privacy & settings" },
  },
};

const PATHWAYS = [
  { icon: Shield, accent: "lime" },
  { icon: Globe2, accent: "cyan" },
  { icon: Code2, accent: "coral" },
];
const COURSES = [
  { icon: Shield, color: "lime" },
  { icon: Code2, color: "cyan" },
  { icon: Network, color: "violet" },
];

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }
function tone(accent: string) { return accent === "lime" ? "bg-[#b8f36b]/15 text-[#b8f36b]" : accent === "cyan" ? "bg-[#49dce8]/15 text-[#49dce8]" : "bg-[#ff8377]/15 text-[#ff8377]"; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const c = COPY[language];

  const discover = () => {
    const q = query.trim();
    if (q) { navigate(`/courses`); setQuery(""); }
    else scrollTo("programs");
  };

  return <div className="min-h-screen overflow-hidden bg-[#071016] text-[#f3f7f3]">
    <div className="pointer-events-none fixed inset-0 -z-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:72px_72px]" />
    <div className="pointer-events-none absolute left-[-10rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#b8f36b]/10 blur-[120px]" />
    <div className="pointer-events-none absolute right-[-12rem] top-[24rem] h-[30rem] w-[30rem] rounded-full bg-[#49dce8]/10 blur-[120px]" />
    <header className="relative z-20 border-b border-white/10 bg-[#071016]/80 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}><div className="grid size-9 place-items-center rounded-xl bg-[#b8f36b] text-[#071016] shadow-[0_0_28px_rgba(184,243,107,.2)]"><Shield className="size-5" strokeWidth={2.5} /></div><div><div className="font-display text-lg font-bold tracking-[-.04em]">secure<span className="text-[#b8f36b]">T</span></div><div className="eyebrow !text-[8px] !tracking-[.28em]">academy of applied security</div></div></Link>
      <nav className="hidden items-center gap-8 text-sm text-white/65 lg:flex"><button onClick={() => scrollTo("programs")} className="transition hover:text-white">{c.nav.programs}</button><button onClick={() => scrollTo("method")} className="transition hover:text-white">{c.nav.method}</button><button onClick={() => scrollTo("community")} className="transition hover:text-white">{c.nav.community}</button></nav>
      <div className="hidden items-center gap-3 lg:flex"><Link href="/record" className="rounded-xl px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white">{c.nav.portal}</Link><Link href="/enroll" className="rounded-xl bg-[#b8f36b] px-4 py-2 text-sm font-bold text-[#071016] transition hover:bg-[#d0ff9a] active:scale-[.98]">{c.nav.apply} <ArrowRight className="ml-1 inline size-4" /></Link></div>
      <button aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)} className="grid size-10 place-items-center rounded-xl border border-white/10 lg:hidden">{menuOpen ? <X /> : <Menu />}</button>
    </div>{menuOpen && <div className="border-t border-white/10 px-5 py-5 lg:hidden"><div className="grid gap-4 text-sm"><button onClick={() => { scrollTo("programs"); setMenuOpen(false); }} className="text-left text-white/75">{c.nav.programs}</button><button onClick={() => { scrollTo("method"); setMenuOpen(false); }} className="text-left text-white/75">{c.nav.method}</button><Link href="/record" className="text-white/75">{c.nav.portal}</Link><Link href="/enroll" className="rounded-xl bg-[#b8f36b] px-4 py-3 text-left font-bold text-[#071016]">{c.nav.apply}</Link></div></div>}</header>
    <main className="relative z-10">
      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24"><div><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b8f36b]/25 bg-[#b8f36b]/10 px-3 py-2 text-[11px] font-semibold tracking-[.13em] text-[#caff91]"><span className="size-1.5 rounded-full bg-[#b8f36b] shadow-[0_0_10px_#b8f36b]" /> {c.hero.badge}</div><h1 className="max-w-3xl font-display text-5xl font-bold leading-[.98] tracking-[-.065em] sm:text-7xl lg:text-[6.25rem]">{c.hero.title1}<span className="text-[#b8f36b]">{c.hero.accent}</span><br />{c.hero.title2}</h1><p className="mt-8 max-w-xl text-lg leading-relaxed text-white/58">{c.hero.lead}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={() => scrollTo("programs")} className="rounded-xl bg-[#b8f36b] px-5 py-3.5 text-sm font-bold text-[#071016] transition hover:bg-[#d0ff9a] active:scale-[.98]">{c.hero.explore} <ArrowRight className="ml-2 inline size-4" /></button><Link href="/record" className="rounded-xl border border-white/15 px-5 py-3.5 text-center text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5">{c.hero.portal}</Link></div><div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-xs text-white/45">{c.hero.traits.map(([n, label]) => <span key={n}><strong className="font-mono text-white">{n}</strong> {label}</span>)}</div></div>
        <div className="relative mx-auto w-full max-w-[30rem] lg:justify-self-end"><div className="absolute -inset-5 rounded-[2rem] border border-[#b8f36b]/10" /><div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#101d24] p-5 shadow-[0_25px_80px_rgba(0,0,0,.35)] sm:p-7"><div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="eyebrow !text-[#b8f36b]">{c.cockpit.eyebrow}</p><h2 className="mt-2 font-display text-xl font-bold">{c.cockpit.title}</h2><p className="mt-1 text-xs text-white/45">{c.cockpit.noAccount} <Link href="/enroll" className="font-bold text-[#b8f36b] hover:underline">{c.cockpit.create}</Link>.</p></div><div className="grid size-10 place-items-center rounded-full bg-[#b8f36b]/15 text-sm font-bold text-[#b8f36b]">ST</div></div><div className="mt-6 rounded-2xl border border-[#b8f36b]/25 bg-[#b8f36b]/[.07] p-5"><div className="flex items-start justify-between"><div><span className="rounded-full bg-[#b8f36b] px-2 py-1 text-[9px] font-black tracking-widest text-[#071016]">{c.cockpit.step}</span><h3 className="mt-4 font-display text-lg font-bold">{c.cockpit.lesson}</h3><p className="mt-1 text-xs text-white/45">{c.cockpit.course}</p></div><Link href="/lesson/cy-101-1" aria-label="Start first lesson"><Play className="mt-1 size-5 fill-[#b8f36b] text-[#b8f36b]" /></Link></div><div className="mt-5 flex items-center gap-3"><div className="h-1.5 flex-1 rounded-full bg-white/10"><div className="h-full w-[0%] rounded-full bg-[#b8f36b]" /></div><span className="font-mono text-[11px] text-[#b8f36b]">{c.cockpit.pct}</span></div></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/10 bg-white/[.035] p-4"><p className="font-mono text-2xl text-[#49dce8]">00</p><p className="mt-1 text-[11px] text-white/40">{c.cockpit.labs}</p></div><div className="rounded-xl border border-white/10 bg-white/[.035] p-4"><p className="font-mono text-2xl text-[#ff8377]">0h</p><p className="mt-1 text-[11px] text-white/40">{c.cockpit.hours}</p></div></div><div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5"><div className="grid size-8 place-items-center rounded-lg bg-[#49dce8]/15 text-[#49dce8]"><Sparkles className="size-4" /></div><p className="text-xs leading-relaxed text-white/55"><strong className="text-white">{c.cockpit.mentor}</strong><br />{c.cockpit.next}</p><ChevronDown className="ml-auto size-4 rotate-[-90deg] text-white/35" /></div></div></div>
      </section>
      <section id="programs" className="border-y border-white/10 bg-[#0b171d]/80 py-20 lg:py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="eyebrow !text-[#b8f36b]">{c.programs.eyebrow}</p><h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-[-.05em] sm:text-5xl">{c.programs.title1}<br /><span className="text-white/45">{c.programs.title2}</span></h2></div><p className="max-w-sm text-sm leading-relaxed text-white/48">{c.programs.lead}</p></div><div className="mt-12 grid gap-4 lg:grid-cols-3">{PATHWAYS.map(({ icon: Icon, accent }, i) => { const p = c.programs.pathways[i]; return <button key={p.title} onClick={() => navigate("/courses")} className="group rounded-2xl border border-white/10 bg-[#101d24] p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-white/25 hover:bg-[#13242c]"><div className={`grid size-11 place-items-center rounded-xl ${tone(accent)}`}><Icon className="size-5" /></div><p className="mt-8 text-[10px] font-mono tracking-[.18em] text-white/35">{p.kicker}</p><h3 className="mt-3 font-display text-2xl font-bold">{p.title}</h3><p className="mt-3 min-h-[72px] text-sm leading-relaxed text-white/48">{p.description}</p><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/40"><span>{p.courses}</span><ArrowRight className="size-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white" /></div></button>; })}</div></div></section>
      <section id="method" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-28"><div><p className="eyebrow !text-[#49dce8]">{c.method.eyebrow}</p><h2 className="mt-3 font-display text-4xl font-bold tracking-[-.05em] sm:text-5xl">{c.method.title1}<br /><span className="text-[#49dce8]">{c.method.accent}</span></h2><p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">{c.method.lead}</p><button onClick={() => navigate("/courses")} className="mt-8 text-sm font-bold text-[#b8f36b]">{c.method.guide} <ArrowRight className="ml-1 inline size-4" /></button></div><div className="grid gap-3 sm:grid-cols-2">{c.method.steps.map(([number, title, text, color], i) => <div key={number} className={`rounded-2xl border border-white/10 bg-white/[.035] p-6 ${i % 2 ? "sm:translate-y-8" : ""}`}><span className={`font-mono text-sm ${color}`}>{number}</span><h3 className="mt-12 font-display text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/45">{text}</p></div>)}</div></section>
      <section className="border-t border-white/10 py-20 lg:py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow !text-[#b8f36b]">{c.catalogue.eyebrow}</p><h2 className="mt-3 font-display text-4xl font-bold tracking-[-.05em]">{c.catalogue.title}</h2></div><div className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2"><Search className="size-4 text-white/35" /><input aria-label={c.catalogue.search} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && discover()} placeholder={c.catalogue.search} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/30" /><button onClick={discover} className="text-xs font-bold text-[#b8f36b]">{c.catalogue.go}</button></div></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{c.catalogue.courses.map((course, i) => { const Icon = COURSES[i].icon; return <Link key={course.code} href={`/lesson/${course.lesson}`} className="group rounded-2xl border border-white/10 bg-[#101d24] p-5 transition hover:-translate-y-1 hover:border-white/25"><div className="flex items-center justify-between"><div className={`grid size-10 place-items-center rounded-xl ${tone(course.color)}`}><Icon className="size-5" /></div><span className="font-mono text-[10px] text-white/35">{course.code}</span></div><h3 className="mt-8 font-display text-xl font-bold">{course.title}</h3><p className="mt-2 text-xs text-white/42">{course.meta}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#b8f36b]">{c.catalogue.open} <ArrowRight className="size-4" /></div></Link>; })}</div></div></section>
      <section id="community" className="mx-5 mb-20 overflow-hidden rounded-[1.75rem] border border-[#b8f36b]/20 bg-[#b8f36b] text-[#071016] lg:mx-auto lg:max-w-7xl"><div className="relative grid gap-10 px-7 py-12 sm:px-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-16 lg:py-14"><div className="absolute right-[-5rem] top-[-8rem] size-80 rounded-full border-[1.5rem] border-[#071016]/[.06]" /><div><p className="font-mono text-[10px] font-bold tracking-[.2em] text-[#071016]/60">{c.community.kicker}</p><h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-[-.05em] sm:text-5xl">{c.community.title}</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-[#071016]/65">{c.community.lead}</p></div><Link href="/enroll" className="relative flex items-center justify-center gap-2 rounded-xl bg-[#071016] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#13242c]">{c.community.cta} <ArrowRight className="size-4" /></Link></div></section>
    </main>
    <footer className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-2 text-white/60"><GraduationCap className="size-4 text-[#b8f36b]" /> secureT academy</div><div className="flex gap-5"><span>{c.footer.learning}</span><span>{c.footer.rights}</span></div><Link href="/settings" className="transition hover:text-white">{c.footer.privacy}</Link></div></footer>
  </div>;
}
