import { describe, expect, it } from "vitest";
import { buildQuizFromLessons, grade } from "../education/edu-engine/src/quiz";
import { TutorAgent } from "../education/edu-engine/src/tutor";

const lessons = [
  { id: "a", title: "A", objective: "objA", content: "cA" },
  { id: "b", title: "B", objective: "objB", content: "cB" },
  { id: "c", title: "C", objective: "objC", content: "cC" },
  { id: "d", title: "D", objective: "objD", content: "cD" },
];

describe("edu-engine quiz", () => {
  it("grade rejects empty, blank and null answers", () => {
    const q = { id: "q", prompt: "p", options: ["a", "b", "c", "d"], answer: 0, explanation: "" };
    expect(grade("", q)).toBe(false);
    expect(grade(" ", q)).toBe(false);
    // @ts-expect-error guarda de runtime para null
    expect(grade(null, q)).toBe(false);
    expect(grade(0, q)).toBe(true);
    expect(grade("0", q)).toBe(true);
    expect(grade(2, q)).toBe(false);
  });

  it("bounds count by valid pool and never repeats a lesson", () => {
    const quiz = buildQuizFromLessons(lessons, { count: 10, seed: "x" });
    expect(quiz.length).toBeLessThanOrEqual(lessons.length);
    const lessonIds = quiz.map((q) => q.id.replace(/-q\d+$/, ""));
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
  });

  it("ignores invalid lessons when bounding count", () => {
    const withBad = [...lessons, { id: 123, title: null }] as unknown as typeof lessons;
    const quiz = buildQuizFromLessons(withBad, { count: 4, seed: "x" });
    expect(quiz.length).toBeLessThanOrEqual(4);
  });
});

describe("edu-engine tutor", () => {
  it("celebrate/encourage rotate independently without throwing", () => {
    const t = new TutorAgent();
    expect(() => {
      t.celebrate("es");
      t.encourage("es");
      t.celebrate("es");
    }).not.toThrow();
  });
});
