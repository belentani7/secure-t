import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Command,
  Compass,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  MessageSquareText,
  Mic,
  Network,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type View = "overview" | "program" | "labs" | "community" | "faculty";

type Course = {
  code: string;
  title: string;
  meta: string;
  progress: number;
  status: "En curso" | "Siguiente" | "Bloqueado";
  color: string;
  icon: typeof ShieldCheck;
};

const courses: Course[] = [
  { code: "CY-101", title: "Fundamentos de Ciberseguridad", meta: "Semana 4 · 8 módulos", progress: 72, status: "En curso", color: "lime", icon: ShieldCheck },
  { code: "CS-110", title: "Programación para Defensa", meta: "Python · 6 laboratorios", progress: 48, status: "En curso", color: "cyan", icon: Code2 },
  { code: "NET-201", title: "Redes y Protocolos", meta: "Próximo · 12 semanas", progress: 0, status: "Siguiente", color: "violet", icon: Network },
];

const tracks = [
  { name: "Blue Team & SOC", description: "Detecta, investiga y responde a amenazas reales.", modules: "12 módulos", accent: "lime", icon: Activity },
  { name: "Offensive Security", description: "Piensa como adversario. Construye como profesional.", modules: "14 módulos", accent: "cyan", icon: Target },
  { name: "Cloud & DevSecOps", description: "Protege sistemas modernos desde el commit hasta producción.", modules: "10 módulos", accent: "violet", icon: Command },
];

const nav: { label: string; view: View; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", view: "overview", icon: LayoutDashboard },
  { label: "Mi programa", view: "program", icon: GraduationCap },
  { label: "Cyber Labs", view: "labs", icon: FlaskConical },
  { label: "Comunidad", view: "community", icon: Users },
  { label: "Facultad", view: "faculty", icon: Library },
];

function speak(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
    toast("Voz del tutor activada", { description: "La capa de voz está lista para conectar con el modelo conversacional." });
  } else toast("El navegador no expone síntesis de voz", { description: "Puedes continuar con el tutor escrito." });
}

function ProgressRing({ value }: { value: number }) {
  return (
    <div className="relative grid size-16 place-items-center rounded-full" style={{ background: `conic-gradient(#b8f36b ${value * 3.6}deg, rgba(255,255,255,.09) 0deg)` }}>
      <div className="grid size-12 place-items-center rounded-full bg-[#111922] text-sm font-bold">{value}%</div>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "tutor", text: "Hola, Alex. He revisado tu última práctica: estás listo para investigar tu primer incidente." },
  ]);
  const [completed, setCompleted] = useState<string[]>([]);

  const currentTitle = useMemo(() => nav.find((item) => item.view === view)?.label ?? "Overview", [view]);

  function selectView(next: View) {
    setView(next);
    setMobileOpen(false);
  }

  function sendMessage() {
    const clean = message.trim();
    if (!clean) return;
    setMessages((items) => [...items, { role: "student", text: clean }, { role: "tutor", text: "Buena pregunta. Vamos a separarla en evidencia, hipótesis y decisión. ¿Qué dato validarías primero?" }]);
    setMessage("");
  }

  function markComplete(id: string) {
    setCompleted((items) => items.includes(id) ? items : [...items, id]);
    toast("Hito registrado", { description: "Tu progreso queda listo para sincronizarse con tu expediente." });
  }

  return (
    <div className="min-h-screen bg-[#0b1117] text-[#ecf2f4] selection:bg-[#b8f36b] selection:text-[#0b1117]">
      <div className="flex min-h-screen">
        <aside className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-[274px] flex-col border-r border-white/10 bg-[#101820] px-5 py-6 transition-transform lg:static lg:translate-x-0`}>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#b8f36b] text-[#0b1117]"><ShieldCheck className="size-5" strokeWidth={2.5} /></div>
              <div><div className="font-display text-xl font-bold tracking-tight">secure <span className="text-[#b8f36b]">T</span></div><div className="eyebrow !text-white/40">Institute of Cybersecurity</div></div>
            </div>
            <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú"><X className="size-5" /></button>
          </div>
          <div className="mt-12 px-2"><p className="eyebrow !text-white/35">Campus personal</p><nav className="mt-4 space-y-1">{nav.map(({ label, view: itemView, icon: Icon }) => <button key={itemView} onClick={() => selectView(itemView)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${view === itemView ? "bg-[#b8f36b] text-[#0b1117]" : "text-white/55 hover:bg-white/5 hover:text-white"}`}><Icon className="size-[18px]" />{label}{itemView === "community" && <span className="ml-auto size-2 rounded-full bg-[#ff7d6b]" />}</button>)}</nav></div>
          <div className="mt-auto space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#16232c] p-4"><div className="flex items-center justify-between"><span className="eyebrow !text-white/40">Tu mentor IA</span><span className="flex size-2 rounded-full bg-[#b8f36b] shadow-[0_0_12px_#b8f36b]" /></div><p className="mt-3 text-sm leading-relaxed text-white/70">Siempre disponible. Nunca sustituye a tu faculty.</p><button onClick={() => setChatOpen(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 text-xs font-bold hover:bg-white/15"><Bot className="size-4 text-[#b8f36b]" /> Abrir tutor</button></div>
            <div className="flex items-center gap-3 border-t border-white/10 px-2 pt-5"><div className="grid size-9 place-items-center rounded-full bg-[#244457] text-sm font-bold">AM</div><div className="min-w-0"><p className="truncate text-sm font-bold">Alex Martín</p><p className="eyebrow !text-white/35">Cohort 01 · Year 1</p></div><ChevronRight className="ml-auto size-4 text-white/30" /></div>
          </div>
        </aside>
        {mobileOpen && <button className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" />}

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-8 lg:px-12"><div className="flex items-center gap-3"><button className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menú"><Menu className="size-5" /></button><div><p className="eyebrow !text-[#b8f36b]">Thursday · 03 September 2026</p><h1 className="mt-1 font-display text-xl font-bold sm:text-2xl">{currentTitle}</h1></div></div><div className="flex items-center gap-3"><button className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/45 sm:flex"><Search className="size-4" /> Search <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono">⌘ K</span></button><button onClick={() => toast("Notificaciones al día", { description: "No tienes alertas urgentes." })} className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5"><MessageSquareText className="size-4 text-white/60" /></button></div></header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
            {view === "overview" && <>
              <section className="grid gap-5 xl:grid-cols-[1.45fr_.8fr]">
                <div className="relative overflow-hidden rounded-3xl bg-[#b8f36b] p-7 text-[#0b1117] sm:p-10"><div className="absolute -right-16 -top-20 size-64 rounded-full border-[36px] border-[#a6e35e]/80" /><div className="absolute -bottom-32 right-24 size-80 rounded-full border-[1px] border-[#0b1117]/15" /><div className="relative max-w-xl"><p className="eyebrow !text-[#0b1117]/60">Good morning, Alex</p><h2 className="mt-5 font-display text-4xl font-bold leading-[.98] tracking-[-.04em] sm:text-6xl">Your next move is<br /><span className="text-[#33522a]">inside the evidence.</span></h2><p className="mt-6 max-w-md text-sm font-medium leading-relaxed text-[#0b1117]/70">Continúa donde lo dejaste. Hoy vas a cerrar el módulo de análisis de alertas y practicar con una nueva investigación.</p><button onClick={() => selectView("labs")} className="mt-8 flex items-center gap-2 rounded-xl bg-[#0b1117] px-5 py-3 text-sm font-bold text-white transition hover:translate-y-[-2px]">Continuar learning path <ArrowUpRight className="size-4" /></button></div></div>
                <div className="rounded-3xl border border-white/10 bg-[#111922] p-6"><div className="flex items-start justify-between"><div><p className="eyebrow !text-white/40">Weekly momentum</p><p className="mt-3 font-display text-4xl font-bold">4<span className="text-lg text-white/35">/5</span></p></div><Zap className="size-5 text-[#b8f36b]" fill="currentColor" /></div><div className="mt-8 flex items-end gap-2">{[38, 58, 44, 78, 94, 54, 18].map((height, i) => <div key={i} className="flex-1"><div className={`rounded-t-md ${i === 4 ? "bg-[#b8f36b]" : "bg-white/10"}`} style={{ height: `${height}px` }} /></div>)}</div><div className="mt-3 flex justify-between eyebrow !text-white/30"><span>MON</span><span>SUN</span></div><p className="mt-6 border-t border-white/10 pt-5 text-sm text-white/55"><span className="font-bold text-white">+18% vs last week.</span> Momentum creates mastery.</p></div>
              </section>
              <section className="mt-10"><div className="flex items-end justify-between"><div><p className="eyebrow !text-[#b8f36b]">Your curriculum</p><h2 className="mt-2 font-display text-2xl font-bold">In progress</h2></div><button onClick={() => selectView("program")} className="flex items-center gap-1 text-xs font-bold text-white/50 hover:text-white">View full program <ChevronRight className="size-4" /></button></div><div className="mt-5 grid gap-4 lg:grid-cols-3">{courses.map((course) => { const Icon = course.icon; return <button key={course.code} onClick={() => selectView(course.status === "Siguiente" ? "program" : "labs")} className="group rounded-2xl border border-white/10 bg-[#111922] p-5 text-left transition hover:-translate-y-1 hover:border-white/25"><div className="flex items-start justify-between"><div className={`grid size-11 place-items-center rounded-xl ${course.color === "lime" ? "bg-[#b8f36b]/15 text-[#b8f36b]" : course.color === "cyan" ? "bg-[#6be7f3]/15 text-[#6be7f3]" : "bg-[#bda2ff]/15 text-[#bda2ff]"}`}><Icon className="size-5" /></div><span className="eyebrow !text-white/35">{course.code}</span></div><h3 className="mt-6 font-display text-lg font-bold">{course.title}</h3><p className="mt-1 text-xs text-white/40">{course.meta}</p><div className="mt-6 flex items-center gap-3"><div className="h-1.5 flex-1 rounded-full bg-white/10"><div className={`h-full rounded-full ${course.color === "lime" ? "bg-[#b8f36b]" : course.color === "cyan" ? "bg-[#6be7f3]" : "bg-[#bda2ff]"}`} style={{ width: `${course.progress}%` }} /></div><span className="font-mono text-[11px] text-white/50">{course.progress}%</span></div><div className="mt-5 flex items-center justify-between"><span className={`text-xs font-bold ${course.status === "En curso" ? "text-[#b8f36b]" : "text-white/40"}`}>{course.status}</span><ChevronRight className="size-4 text-white/30 transition group-hover:translate-x-1" /></div></button> })}</div></section>
              <section className="mt-10 grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl border border-white/10 bg-[#111922] p-6"><div className="flex items-center justify-between"><div><p className="eyebrow !text-white/40">Next up</p><h2 className="mt-2 font-display text-xl font-bold">Triage a suspicious PowerShell alert</h2></div><ProgressRing value={72} /></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white/5 p-4"><Clock3 className="size-4 text-[#6be7f3]" /><p className="mt-3 text-sm font-bold">18 min</p><p className="mt-1 text-xs text-white/40">estimated</p></div><div className="rounded-xl bg-white/5 p-4"><FileCheck2 className="size-4 text-[#b8f36b]" /><p className="mt-3 text-sm font-bold">Lab 04</p><p className="mt-1 text-xs text-white/40">hands-on</p></div><div className="rounded-xl bg-white/5 p-4"><Award className="size-4 text-[#bda2ff]" /><p className="mt-3 text-sm font-bold">+120 XP</p><p className="mt-1 text-xs text-white/40">certificate path</p></div></div><button onClick={() => selectView("labs")} className="mt-6 flex items-center gap-2 text-sm font-bold text-[#b8f36b]">Launch lab <ArrowUpRight className="size-4" /></button></div><div className="rounded-2xl border border-white/10 bg-[#111922] p-6"><div className="flex items-center justify-between"><p className="eyebrow !text-white/40">Recognition</p><Award className="size-4 text-[#b8f36b]" /></div><h2 className="mt-3 font-display text-xl font-bold">Build evidence, not just badges.</h2><p className="mt-3 text-sm leading-relaxed text-white/50">Cada skill se demuestra con proyectos, revisiones y decisiones explicables.</p><div className="mt-6 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-[#b8f36b]/15 text-[#b8f36b]"><CheckCircle2 className="size-5" /></div><div><p className="text-sm font-bold">Foundations checkpoint</p><p className="text-xs text-white/40">2 of 3 artifacts completed</p></div></div></div></section>
            </>}

            {view === "program" && <section><div className="max-w-2xl"><p className="eyebrow !text-[#b8f36b]">Bachelor of Cybersecurity · 120 credits</p><h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">A four-year path<br /><span className="text-white/40">built for the real world.</span></h2><p className="mt-5 text-sm leading-relaxed text-white/55">Un itinerario basado en fundamentos, práctica deliberada y evidencia profesional. Avanzas por dominio, no por consumo de vídeos.</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{tracks.map(({ name, description, modules, accent, icon: Icon }) => <button key={name} onClick={() => toast("Track añadido a tu plan", { description: `${name} se sincronizará con tu expediente.` })} className="rounded-2xl border border-white/10 bg-[#111922] p-6 text-left transition hover:-translate-y-1 hover:border-white/25"><div className={`grid size-11 place-items-center rounded-xl ${accent === "lime" ? "bg-[#b8f36b]/15 text-[#b8f36b]" : accent === "cyan" ? "bg-[#6be7f3]/15 text-[#6be7f3]" : "bg-[#bda2ff]/15 text-[#bda2ff]"}`}><Icon className="size-5" /></div><h3 className="mt-6 font-display text-xl font-bold">{name}</h3><p className="mt-2 text-sm leading-relaxed text-white/50">{description}</p><div className="mt-6 flex items-center justify-between text-xs font-bold text-white/40"><span>{modules}</span><Plus className="size-4" /></div></button>)}</div><div className="mt-8 rounded-2xl border border-white/10 bg-[#111922] p-6"><div className="flex items-center justify-between"><div><p className="eyebrow !text-white/40">Year 1 · Foundations</p><h2 className="mt-2 font-display text-2xl font-bold">Your first semester</h2></div><span className="rounded-full bg-[#b8f36b]/10 px-3 py-1 text-xs font-bold text-[#b8f36b]">72% complete</span></div><div className="mt-6 divide-y divide-white/10">{["CY-101 · Fundamentos de Ciberseguridad", "CS-110 · Programación para Defensa", "MATH-120 · Discrete Thinking", "COM-105 · Comunicación profesional"].map((item, index) => <button key={item} onClick={() => markComplete(item)} className="flex w-full items-center gap-4 py-4 text-left hover:bg-white/[.03]"><div className={`grid size-8 place-items-center rounded-full ${completed.includes(item) || index < 2 ? "bg-[#b8f36b] text-[#0b1117]" : "border border-white/15 text-white/30"}`}>{completed.includes(item) || index < 2 ? <CheckCircle2 className="size-4" /> : index + 1}</div><span className="flex-1 text-sm font-bold">{item}</span><span className="hidden text-xs text-white/35 sm:block">3 credits</span><ChevronRight className="size-4 text-white/25" /></button>)}</div></div></section>}

            {view === "labs" && <section><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow !text-[#b8f36b]">Isolated environments · browser based</p><h2 className="mt-3 font-display text-4xl font-bold">Cyber Labs</h2><p className="mt-3 max-w-xl text-sm text-white/50">Practica sin miedo. Cada laboratorio está diseñado con objetivos, telemetría y una revisión final por evidencia.</p></div><button onClick={() => toast("Nuevo laboratorio en cola", { description: "La faculty revisará tu solicitud." })} className="flex items-center gap-2 rounded-xl bg-[#b8f36b] px-4 py-3 text-sm font-bold text-[#0b1117]"><Plus className="size-4" /> Proponer lab</button></div><div className="mt-8 grid gap-4 lg:grid-cols-2">{[{ id: "lab-04", title: "Triage a suspicious PowerShell alert", type: "SOC · BEGINNER", time: "18 min", status: "Ready", icon: Activity }, { id: "lab-07", title: "Threat model a public API", type: "APPSEC · INTERMEDIATE", time: "42 min", status: "In progress", icon: ShieldCheck }, { id: "lab-11", title: "Recover from a ransomware event", type: "IR · ADVANCED", time: "55 min", status: "Locked", icon: FileCheck2 }, { id: "lab-14", title: "Harden a cloud workload", type: "CLOUD · INTERMEDIATE", time: "35 min", status: "Locked", icon: Network }].map(({ id, title, type, time, status, icon: Icon }) => <button key={id} onClick={() => status === "Locked" ? toast("Lab bloqueado", { description: "Completa el módulo anterior para desbloquearlo." }) : markComplete(id)} className="group flex items-start gap-5 rounded-2xl border border-white/10 bg-[#111922] p-5 text-left transition hover:border-white/25"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/5 text-[#b8f36b]"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="eyebrow !text-white/35">{type}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status === "Ready" ? "bg-[#b8f36b]/10 text-[#b8f36b]" : status === "In progress" ? "bg-[#6be7f3]/10 text-[#6be7f3]" : "bg-white/5 text-white/30"}`}>{status}</span></div><h3 className="mt-3 font-display text-lg font-bold">{title}</h3><p className="mt-3 flex items-center gap-2 text-xs text-white/40"><Clock3 className="size-3" /> {time} · Evidence review included</p></div><ChevronRight className="mt-1 size-4 text-white/25 transition group-hover:translate-x-1" /></button>)}</div></section>}

            {(view === "community" || view === "faculty") && <section><p className="eyebrow !text-[#b8f36b]">{view === "community" ? "Cohort 01 · learning in public" : "Academic operations"}</p><h2 className="mt-3 font-display text-4xl font-bold">{view === "community" ? "The signal is stronger together." : "Faculty workspace"}</h2><div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-[#111922] p-6"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-[#bda2ff]/20 text-[#bda2ff]"><Users className="size-5" /></div><div><p className="text-sm font-bold">{view === "community" ? "SOC study room" : "Review queue"}</p><p className="text-xs text-white/40">{view === "community" ? "18 members online" : "12 submissions awaiting review"}</p></div></div><p className="mt-6 text-sm leading-relaxed text-white/55">{view === "community" ? "Comparte cómo explicaste tu hipótesis y recibe feedback de peers. La calidad nace de hacer visible el razonamiento." : "La faculty revisa evidencias, calibra rúbricas y mantiene el estándar académico del programa."}</p><button onClick={() => toast("Área preparada", { description: "La siguiente iteración conectará los datos reales de comunidad y evaluación." })} className="mt-6 flex items-center gap-2 text-sm font-bold text-[#b8f36b]">Open workspace <ArrowUpRight className="size-4" /></button></div><div className="rounded-2xl border border-white/10 bg-[#111922] p-6"><p className="eyebrow !text-white/40">Institutional standard</p><div className="mt-5 space-y-4"><div className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-[#b8f36b]" /><p className="text-sm text-white/60">Privacy-first records, least privilege and auditable decisions.</p></div><div className="flex gap-3"><Award className="size-5 shrink-0 text-[#6be7f3]" /><p className="text-sm text-white/60">Skills validated through projects, not passive attendance.</p></div><div className="flex gap-3"><Sparkles className="size-5 shrink-0 text-[#bda2ff]" /><p className="text-sm text-white/60">AI augments faculty and students; it never invents accreditation.</p></div></div></div></div></section>}
          </div>
        </main>

        {chatOpen && <aside className="fixed bottom-5 right-5 z-20 w-[min(380px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/15 bg-[#111922] shadow-2xl shadow-black/40"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div className="flex items-center gap-3"><div className="grid size-8 place-items-center rounded-lg bg-[#b8f36b] text-[#0b1117]"><Bot className="size-4" /></div><div><p className="text-sm font-bold">Astra · AI mentor</p><p className="text-[10px] text-[#b8f36b]">● Online · evidence-based</p></div></div><button onClick={() => setChatOpen(false)} aria-label="Cerrar tutor"><X className="size-4 text-white/40" /></button></div><div className="max-h-48 space-y-3 overflow-y-auto p-4">{messages.map((item, index) => <div key={index} className={`flex ${item.role === "student" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${item.role === "student" ? "bg-[#244457] text-white" : "bg-white/5 text-white/65"}`}>{item.text}</div></div>)}</div><div className="flex gap-2 border-t border-white/10 p-3"><button onClick={() => speak(messages[messages.length - 1]?.text ?? "Hola")} className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-[#b8f36b]" aria-label="Escuchar respuesta"><VolumeIcon /></button><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder="Ask Astra anything..." className="min-w-0 flex-1 bg-transparent px-1 text-xs outline-none placeholder:text-white/25" /><button onClick={sendMessage} className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#b8f36b] text-[#0b1117]" aria-label="Enviar mensaje"><ArrowUpRight className="size-4" /></button></div><button onClick={() => speak("Hola Alex. Estoy lista para ayudarte a investigar con rigor.")} className="flex w-full items-center justify-center gap-2 border-t border-white/10 py-2 text-[10px] font-bold text-white/40 hover:text-white"><Mic className="size-3" /> Voice mode · Astra</button></aside>}
        {!chatOpen && <button onClick={() => setChatOpen(true)} className="fixed bottom-5 right-5 z-20 grid size-14 place-items-center rounded-full bg-[#b8f36b] text-[#0b1117] shadow-xl" aria-label="Abrir tutor"><Bot className="size-6" /></button>}
      </div>
    </div>
  );
}

function VolumeIcon() { return <Play className="size-3.5" fill="currentColor" />; }
