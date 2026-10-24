import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

function directVersion(file: string, dependency: string) {
  const pkg = JSON.parse(readFileSync(new URL("../" + file, import.meta.url), "utf8"));
  const spec: string = pkg.devDependencies?.[dependency] ?? pkg.dependencies?.[dependency] ?? "";
  const match = spec.match(/^(?:\^|~)?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) throw new Error("Cannot verify exact security floor for " + file + ":" + dependency + "=" + spec);
  return match.slice(1).map(Number);
}

function atLeast(actual: number[], minimum: [number, number, number]) {
  for (let i = 0; i < 3; i++) {
    if (actual[i] > minimum[i]) return true;
    if (actual[i] < minimum[i]) return false;
  }
  return true;
}

describe("2026 security advisory minimum versions", () => {
  it("uses patched Vite and Vitest in the root app", () => {
    expect(atLeast(directVersion("package.json", "vite"), [8, 3, 3])).toBe(true);
    expect(atLeast(directVersion("package.json", "vitest"), [5, 0, 3])).toBe(true);
  });
  it("pins patched body-parser for Express 4 transitively", () => {
    const workspace = readFileSync(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
    expect(workspace).toMatch(/body-parser:\s*1\.20\.9/);
  });
  for (const file of ["secure-t-app/package.json", "cybersecurity_course/package.json", "Cybersecurity-Course-Document-Overview/package.json"]) {
    it("uses patched Vitest in " + file, () => {
      expect(atLeast(directVersion(file, "vitest"), [4, 1, 11])).toBe(true);
    });
  }
});
