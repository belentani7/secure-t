import { describe, expect, it } from "vitest";
import { can } from "../platform/core/contracts.js";
import { executeTool } from "../platform/ai/tool-registry.js";
import { buildLearningGraph } from "../platform/content/pipeline.js";
import { analyzeDataset } from "../platform/data/analysis.js";
import { canProject, sanitizeSharePolicy } from "../platform/collaboration/policy.js";

describe("secure T platform foundation", () => {
  it("enforces role capabilities before tool execution", async () => {
    expect(can("learner", "data.analyze")).toBe(false);
    expect(can("faculty", "data.analyze")).toBe(true);
    await expect(executeTool("data.analyze", { datasetId: "demo" }, { actor: { id: "u1", role: "learner" }, requestId: "r1" })).rejects.toThrow("Forbidden capability");
  });

  it("builds a provenance-preserving learning graph", () => {
    const source = { id: "doc-1", type: "document" as const, title: "Network security" };
    const graph = buildLearningGraph("# Threats\n\nAuthentication and authorization", source);
    expect(graph.nodes).toHaveLength(2);
    expect(graph.nodes.every(node => node.sources.some(item => item.id === "doc-1"))).toBe(true);
    expect(graph.edges.some(edge => edge.relation === "prerequisite")).toBe(true);
  });

  it("profiles numeric and missing data", () => {
    const analysis = analyzeDataset({
      columns: [{ name: "score", type: "number" }, { name: "group", type: "string" }],
      rows: [{ score: 10, group: "A" }, { score: 20, group: "A" }, { score: null, group: "B" }],
    });
    expect(analysis.rows).toBe(3);
    expect(analysis.columns[0].mean).toBe(15);
    expect(analysis.columns[0].nulls).toBe(1);
  });

  it("keeps project permissions least-privilege", () => {
    expect(canProject("learner", "delete")).toBe(false);
    const sanitized = sanitizeSharePolicy({ projectId: "p1", actorId: "u1", target: "user", targetId: "u2", permissions: ["read", "delete", "read"] });
    expect(sanitized.permissions).toEqual(["read"]);
  });
});
