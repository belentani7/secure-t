import { describe, expect, it } from "vitest";
import { curriculum, curriculumByYear, findLesson } from "../academic/curriculum";

describe("academic curriculum", () => {
  it("contains a real lesson sequence", () => {
    expect(curriculum.length).toBeGreaterThanOrEqual(7);
    expect(curriculum.every(course => course.lessons.length >= 2)).toBe(true);
  });
  it("covers all four years", () => expect([1, 2, 3, 4].every(year => curriculumByYear(year).length > 0)).toBe(true));
  it("exposes evidence prompts for practice", () => expect(curriculum.flatMap(course => course.lessons).some(lesson => Boolean(lesson.evidencePrompt))).toBe(true));
  it("resolves lesson detail", () => expect(findLesson("net-101-2")?.lesson.type).toBe("lab"));
});
