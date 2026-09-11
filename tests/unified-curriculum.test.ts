import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const file = join(process.cwd(), "education", "unified-curriculum.json");

interface KnowledgeArea {
  id: string;
  title: string;
  source: string;
  track: string;
  level: string;
}

interface Track {
  id: string;
  level: string;
  knowledge_areas: string[];
}

interface Unified {
  schema: string;
  sources: Record<string, { url: string }>;
  tracks: Track[];
  knowledge_areas: KnowledgeArea[];
  stats: { knowledge_areas: number; by_source: Record<string, number> };
}

const data: Unified = JSON.parse(readFileSync(file, "utf-8"));

const EXPECTED_TRACKS = [
  "digital-literacy",
  "cyber-foundations",
  "blue-team",
  "ai-foundations",
  "genai-applied",
  "secure-web",
  "digital-career",
];

describe("unified curriculum", () => {
  it("uses the versioned schema", () => {
    expect(data.schema).toBe("secure-t.unified-curriculum.v1");
  });

  it("covers all seven secure-t tracks", () => {
    expect(data.tracks.map((t) => t.id)).toEqual(EXPECTED_TRACKS);
    for (const track of data.tracks) {
      expect(track.knowledge_areas.length).toBeGreaterThan(0);
    }
  });

  it("every knowledge area maps to a real track", () => {
    const trackIds = new Set(data.tracks.map((t) => t.id));
    for (const area of data.knowledge_areas) {
      expect(trackIds.has(area.track)).toBe(true);
      expect(area.id).toBeTruthy();
      expect(area.title).toBeTruthy();
    }
  });

  it("unifies all four external sources", () => {
    const sources = new Set(data.knowledge_areas.map((a) => a.source));
    for (const expected of ["CyBOK", "NIST NICE SP 800-181r1", "OWASP Top 10 2021", "MIT OpenCourseWare"]) {
      expect(sources.has(expected)).toBe(true);
    }
  });

  it("stats match the actual knowledge area count", () => {
    expect(data.stats.knowledge_areas).toBe(data.knowledge_areas.length);
  });
});
