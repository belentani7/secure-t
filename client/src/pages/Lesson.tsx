import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Flame, Languages, Target, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { curriculum, findLesson } from "../../../academic/curriculum.ts";
import { buildQuizFromLessons, computeStreak, getProgress, grade, MemoryStore, nextLesson, normalizeLessonPlan, pickCongrats, recordAnswer, TutorAgent, type Progress, type Question } from "../../../education/edu-engine/src/index.ts";

const store = new MemoryStore<Progress>("secure-t-progress");
const tutor = new TutorAgent();

export default function Lesson({ lessonId }: { lessonId?: string }) {
  const [, navigate] = useLocation();
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [progress, setProgress] = useState<Progress>(() => getProgress(store));
  const booted = useRef(false);

  const resolvedId = useMemo(() => {
    if (lessonId) return lessonId;
    if (typeof window === "undefined") return undefined;
    const m = window.location.hash.replace(/^#\/?/, "").match(/(?:^|\/)lesson\/([^/?#]+)/i);
    return m ? decodeURIComponent(m[1]) : undefined;
  }, [lessonId]);

  const found = useMemo(() => (resolvedId ? findLesson(resolvedId) : undefined), [resolvedId]);
  const lesson = found?.lesson;
  const plan = useMemo(() => (found ? normalizeLessonPlan(found.course) : null), [found]);
  const next = useMemo(() => (plan && lesson ? nextLesson(plan, lesson.id) : undefined), [plan, lesson]);
  const streak = useMemo(() => computeStreak(progress), [progress]);
  const quiz = useMemo(
    () =>
      buildQuizFromLessons(curriculum.flatMap((c) => c.lessons), {
        count: 3,
        focusIds: lesson ? [lesson.id] : undefined,
        seed: lesson?.id ?? "demo",
      }),
    [lesson],
  );

  useEffect(() => {
    setPicked({});
    setCorrectCount(0);
  }, [resolvedId]);

  useEffect(() => {
    if (!booted.current) {
      booted.current = true;
      tutor.welcome("", lang);
    }
  }, [lang]);

  const answer = (q: Question, idx: number) => {
    if (picked[q.id] !== undefined) return;
    setPicked((p) => ({ ...p, [q.id]: idx }));
    const ok = grade(idx, q);
    setProgress(recordAnswer(store, lesson?.id ?? "demo", ok));
    if (ok) {
      setCorrectCount((c) => c + 1);
      tutor.celebrate(lang);
    } else {
      tutor.encourage(lang);
    }
  };

  const answeredCount = Object.keys(picked).length;
  const finished = quiz.length > 0 && answeredCount >= quiz.length;
  const congrats = finished ? pickCongrats(correctCount, quiz.length, streak, lang) : undefined;

  if (!lesson || !found) {
    return (
      <main className="min-h-screen bg-[#0b1117] px-5 py-8 text-[#ecf2f4] sm:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow !text-[#b8f36b]">secure T · lesson hub</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Elige una lección</h1>
          <p className="mt-3 text-sm text-white/50">Vista demo conectada al motor educativo compartido (@edu/engine).</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {curriculum.map((c) => (
              <div key={c.code} className="rounded-2xl border border-white/10 bg-[#111922] p-5">
                <p className="eyebrow !text-white/35">{c.code} · Year {c.year} · {c.credits} credits</p>
                <h2 className="mt-2 font-display text-lg font-bold">{c.title}</h2>
                <div className="mt-4 space-y-2">
                  {c.lessons.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => navigate(`/lesson/${l.id}`)}
                      className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left text-sm font-bold text-white/70 hover:bg-[#b8f36b] hover:text-[#0b1117]"
                    >
                      <BookOpen className="size-4 shrink-0" />
                      {l.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/")} className="mt-8 flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white">
            <ArrowLeft className="size-4" /> Volver al campus
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b1117] px-5 py-8 text-[#ecf2f4] sm:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-7">
          <div>
            <p className="eyebrow !text-[#b8f36b]">{found.course.code} · {found.course.title}</p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{lesson.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase text-white/50">{lesson.type}</span>
              <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold text-white/50"><Clock className="size-3" /> {lesson.minutes} min</span>
              <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold text-[#b8f36b]"><Flame className="size-3" /> racha {streak}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 p-1">
            <Languages className="ml-2 size-4 text-[#b8f36b]" />
            {(["pt-BR", "es", "en"] as const).map((x) => (
              <button key={x} onClick={() => setLang(x)} className={`rounded-lg px-3 py-2 text-xs font-bold ${lang === x ? "bg-[#b8f36b] text-[#0b1117]" : "text-white/50"}`}>{x === "pt-BR" ? "PT-BR" : x.toUpperCase()}</button>
            ))}
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#111922] p-6">
          <div className="flex items-center gap-3">
            <Target className="size-4 text-[#b8f36b]" />
            <p className="eyebrow !text-[#b8f36b]">Objective</p>
          </div>
          <p className="mt-3 text-sm font-bold">{lesson.objective}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">{lesson.content}</p>
          {lesson.evidencePrompt && <p className="mt-4 rounded-xl bg-white/5 p-4 text-xs text-white/45">Evidencia: {lesson.evidencePrompt}</p>}
        </section>

        <section className="mt-8">
          <p className="eyebrow !text-[#b8f36b]">Quick check · generado por @edu/engine</p>
          <div className="mt-4 space-y-4">
            {quiz.map((q) => {
              const pick = picked[q.id];
              const answered = pick !== undefined;
              return (
                <div key={q.id} className="rounded-2xl border border-white/10 bg-[#111922] p-5">
                  <p className="text-sm font-bold">{q.prompt}</p>
                  <div className="mt-4 grid gap-2">
                    {q.options.map((opt, i) => {
                      const isAnswer = i === q.answer;
                      const isPick = i === pick;
                      const state = answered ? (isAnswer ? "ok" : isPick ? "bad" : "dim") : "idle";
                      return (
                        <button
                          key={i}
                          disabled={answered}
                          onClick={() => answer(q, i)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                            state === "ok"
                              ? "border-[#b8f36b] bg-[#b8f36b]/10 text-[#b8f36b]"
                              : state === "bad"
                                ? "border-red-400/40 bg-red-400/10 text-red-300"
                                : state === "dim"
                                  ? "border-white/5 text-white/25"
                                  : "border-white/10 text-white/70 hover:border-white/30"
                          }`}
                        >
                          <span>{opt}</span>
                          {state === "ok" && <CheckCircle2 className="size-4 shrink-0" />}
                          {state === "bad" && <XCircle className="size-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {answered && <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/45">{q.explanation}</p>}
                </div>
              );
            })}
          </div>
          {finished && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#b8f36b]/30 bg-[#b8f36b]/10 p-6">
              <div>
                <p className="font-display text-xl font-bold text-[#b8f36b]">{congrats}</p>
                <p className="mt-2 text-xs text-white/50">Progreso guardado en localStorage (secure-t-progress) · racha {streak} días.</p>
              </div>
              <button onClick={() => tutor.celebrate(lang)} className="rounded-xl bg-[#b8f36b] px-4 py-3 text-xs font-bold text-[#0b1117]">Repetir voz</button>
            </div>
          )}
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white"><ArrowLeft className="size-4" /> Campus</button>
            {next && (
              <button onClick={() => navigate(`/lesson/${next.id}`)} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-bold hover:bg-white/20">
                Siguiente: {next.title} <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
