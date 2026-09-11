import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildQuizFromLessons,
  computeStreak,
  getProgress,
  grade,
  MemoryStore,
  nextLesson,
  normalizeLessonPlan,
  pickCongrats,
  prevLesson,
  recordAnswer,
  sugerirSiguientePaso,
  TutorAgent,
} from "../src/index.ts";

const fakeLessons = [
  { id: "l1", title: "Permisos Unix", objective: "Modelar usuarios, grupos y chmod.", content: "Contenido A" },
  { id: "l2", title: "Capturas de red", objective: "Leer un handshake TCP.", content: "Contenido B" },
  { id: "l3", title: "Parsers seguros", objective: "Validar entradas no confiables.", content: "Contenido C" },
  { id: "l4", title: "Threat modeling", objective: "Priorizar riesgos y controles.", content: "Contenido D" },
  { id: "l5", title: "Respuesta a incidentes", objective: "Contener sin romper evidencia.", content: "Contenido E" },
];

test("grade devuelve true solo con el índice correcto", () => {
  const q = { id: "q1", prompt: "p", options: ["a", "b", "c"], answer: 1, explanation: "e" };
  assert.equal(grade(1, q), true);
  assert.equal(grade("1", q), true);
  assert.equal(grade(0, q), false);
  assert.equal(grade(2, q), false);
  assert.equal(grade("x", q), false);
});

test("buildQuizFromLessons genera preguntas válidas con distractores", () => {
  const quiz = buildQuizFromLessons(fakeLessons, { count: 3, focusIds: ["l1"], seed: "demo" });
  assert.equal(quiz.length, 3);
  for (const q of quiz) {
    assert.ok(q.options.length >= 2 && q.options.length <= 3);
    assert.ok(q.answer >= 0 && q.answer < q.options.length);
    assert.ok(q.options[q.answer].length > 0);
    assert.ok(q.prompt.includes("«"));
    assert.equal(q.options.filter((o) => o === q.options[q.answer]).length, 1);
    assert.equal(grade(q.answer, q), true);
  }
  const empty = buildQuizFromLessons([], { count: 3 });
  assert.equal(empty.length, 0);
});

test("pickCongrats cubre 3 niveles y 4 idiomas", () => {
  const esPerfect = pickCongrats(3, 3, 4, "es");
  assert.match(esPerfect, /3(\/| de )3/);
  assert.match(esPerfect, /4 días/);
  const esPartial = pickCongrats(2, 3, 0, "es");
  assert.match(esPartial, /2(\/| de )3/);
  const esEffort = pickCongrats(0, 3, 0, "es");
  assert.match(esEffort, /0(\/| de )3/);
  assert.match(pickCongrats(3, 3, 1, "pt-BR"), /Perfeito/);
  assert.match(pickCongrats(3, 3, 1, "pt"), /Perfeito/);
  assert.match(pickCongrats(3, 3, 1, "en"), /Perfect/);
  assert.match(pickCongrats(3, 3, 1, "ca"), /Perfecte/);
  assert.match(pickCongrats(0, 0, 0, "es"), /0 de 0/);
});

test("computeStreak cuenta días consecutivos con aciertos", () => {
  const now = new Date(2026, 8, 5, 12, 0, 0);
  const day = (offset) => new Date(2026, 8, 5 - offset, 12, 0, 0).toISOString();
  const progress = {
    answers: { a: [{ lessonId: "a", ok: true, at: day(0) }, { lessonId: "a", ok: false, at: day(1) }] },
    updatedAt: day(0),
  };
  assert.equal(computeStreak(progress, now), 1);
  progress.answers.a.push({ lessonId: "a", ok: true, at: day(1) });
  progress.answers.a.push({ lessonId: "a", ok: true, at: day(2) });
  assert.equal(computeStreak(progress, now), 3);
  const withGap = { answers: { a: [{ lessonId: "a", ok: true, at: day(0) }, { lessonId: "a", ok: true, at: day(2) }] }, updatedAt: day(0) };
  assert.equal(computeStreak(withGap, now), 1);
  const onlyYesterday = { answers: { a: [{ lessonId: "a", ok: true, at: day(1) }] }, updatedAt: day(1) };
  assert.equal(computeStreak(onlyYesterday, now), 1);
  assert.equal(computeStreak({ answers: {}, updatedAt: "" }, now), 0);
});

test("recordAnswer + getProgress persisten en el MemoryStore (fallback en node)", () => {
  const store = MemoryStore.init("test");
  const updated = recordAnswer(store, "l1", true, new Date());
  assert.equal(updated.answers["l1"].length, 1);
  const read = getProgress(store);
  assert.equal(read.answers["l1"][0].ok, true);
  const fresh = MemoryStore.init("otro-prefijo");
  assert.equal(getProgress(fresh).answers["l1"], undefined);
});

test("normalizeLessonPlan + nextLesson/prevLesson", () => {
  const src = {
    code: "CY-101",
    title: "Cybersecurity Fundamentals",
    year: 1,
    credits: 3,
    description: "Riesgo y controles.",
    competencies: ["CYBER-FUNDAMENTALS"],
    lessons: [
      { id: "cy-101-1", title: "Risk is a decision", type: "theory", minutes: 22, objective: "Diferenciar riesgo.", content: "X" },
      { id: "cy-101-2", title: "Assessment", type: "assessment", minutes: 35, objective: "Justificar un control.", content: "Y" },
    ],
  };
  const plan = normalizeLessonPlan(src);
  assert.ok(plan);
  assert.equal(plan.lessons.length, 2);
  assert.equal(plan.lessons[0].type, "theory");
  assert.equal(nextLesson(plan, "cy-101-1")?.id, "cy-101-2");
  assert.equal(prevLesson(plan, "cy-101-2")?.id, "cy-101-1");
  assert.equal(nextLesson(plan, "cy-101-2"), undefined);
  assert.equal(prevLesson(plan, "cy-101-1"), undefined);
  assert.equal(normalizeLessonPlan({}), null);
});

test("sugerirSiguientePaso propone pendientes, revisión y completo", () => {
  const lessons = [{ id: "l1" }, { id: "l2" }, { id: "l3" }];
  const empty = { answers: {}, updatedAt: "" };
  assert.equal(sugerirSiguientePaso(empty, lessons)?.lessonId, "l1");
  const answered = {
    answers: {
      l1: [{ lessonId: "l1", ok: true, at: "2026-01-01T00:00:00.000Z" }],
      l2: [{ lessonId: "l2", ok: false, at: "2026-01-02T00:00:00.000Z" }],
    },
    updatedAt: "",
  };
  assert.equal(sugerirSiguientePaso(answered, lessons)?.lessonId, "l3");
  const answeredAll = {
    answers: {
      l1: [{ lessonId: "l1", ok: true, at: "2026-01-01T00:00:00.000Z" }],
      l2: [{ lessonId: "l2", ok: false, at: "2026-01-02T00:00:00.000Z" }],
      l3: [{ lessonId: "l3", ok: true, at: "2026-01-03T00:00:00.000Z" }],
    },
    updatedAt: "",
  };
  const review = sugerirSiguientePaso(answeredAll, lessons);
  assert.equal(review?.lessonId, "l2");
  assert.equal(review?.reason, "review");
});

test("TutorAgent no lanza en entornos sin voz (node)", () => {
  const t = new TutorAgent();
  assert.equal(t.voiceAvailable(), false);
  t.say("hola", "es");
  t.welcome("Alex", "pt-BR");
  t.celebrate("es");
  t.encourage("ca");
  t.stop();
  assert.ok(t.locales.pt === "pt-BR");
});
