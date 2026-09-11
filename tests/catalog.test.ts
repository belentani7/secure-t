import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

interface Lesson { id: string; title: string; type: string; minutes: number; objective: string; }
interface Module { id: string; title: string; source: string; lessons: Lesson[]; }
interface Course {
  code: string; track: string; title: string; subtitle: string; level: string;
  weeks: number; hoursPerWeek: number; prerequisites: string[]; skills: string[];
  credential: string; modules: Module[];
}
interface Track { id: string; title: string; level: string; courses: string[]; }
interface Catalog {
  schema: string; tracks: Track[]; courses: Course[];
  stats: { tracks: number; courses: number; modules: number; lessons: number };
}

const catalog: Catalog = JSON.parse(
  readFileSync(join(process.cwd(), "education", "catalog.json"), "utf-8"),
);

const codes = new Set(catalog.courses.map((c) => c.code));
const trackIds = new Set(catalog.tracks.map((t) => t.id));

describe("platform catalog", () => {
  it("uses the versioned schema", () => {
    expect(catalog.schema).toBe("secure-t.catalog.v1");
  });

  it("has 7 tracks and at least 20 courses", () => {
    expect(catalog.tracks.length).toBe(7);
    expect(catalog.courses.length).toBeGreaterThanOrEqual(20);
  });

  it("every course belongs to a real track and has >= 3 modules", () => {
    for (const c of catalog.courses) {
      expect(trackIds.has(c.track)).toBe(true);
      expect(c.modules.length).toBeGreaterThanOrEqual(3);
      expect(c.skills.length).toBeGreaterThan(0);
      expect(c.credential).toBeTruthy();
    }
  });

  it("every module has exactly 4 lessons (theory/practice/lab/assessment)", () => {
    for (const c of catalog.courses) {
      for (const m of c.modules) {
        expect(m.lessons.map((l) => l.type)).toEqual(["theory", "practice", "lab", "assessment"]);
      }
    }
  });

  it("prerequisites reference existing course codes", () => {
    for (const c of catalog.courses) {
      for (const p of c.prerequisites) {
        expect(codes.has(p)).toBe(true);
      }
    }
  });

  it("stats match the real counts", () => {
    expect(catalog.stats.courses).toBe(catalog.courses.length);
    expect(catalog.stats.modules).toBe(catalog.courses.reduce((n, c) => n + c.modules.length, 0));
    expect(catalog.stats.lessons).toBe(
      catalog.courses.reduce((n, c) => n + c.modules.reduce((k, m) => k + m.lessons.length, 0), 0),
    );
  });
});
