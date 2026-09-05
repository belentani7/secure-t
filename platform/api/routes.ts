import { Router, type Request } from "express";
import { can, type Actor, type Capability, type Role, type SourceRef } from "../core/contracts.js";
import { executeTool, listTools } from "../ai/tool-registry.js";
import { buildLearningGraph, type ContentKind } from "../content/pipeline.js";
import { analyzeDataset, type Dataset } from "../data/analysis.js";
import { canProject, type ProjectPermission } from "../collaboration/policy.js";

const router = Router();

const ROLES: readonly Role[] = ["learner", "mentor", "faculty", "reviewer", "researcher", "developer", "admin"];
const CAPABILITIES: readonly Capability[] = [
  "content.read", "content.create", "content.transform", "ai.chat", "ai.rag", "ai.analyze", "ai.code",
  "data.read", "data.query", "data.analyze", "lab.launch", "lab.execute", "project.read", "project.write",
  "project.review", "project.admin", "credential.issue", "audit.read",
];
const CONTENT_KINDS: readonly ContentKind[] = ["document", "lesson", "module", "quiz", "flashcards", "case-study", "simulation", "knowledge-map"];
const PROJECT_PERMISSIONS: readonly ProjectPermission[] = ["read", "write", "review", "manage_members", "manage_settings", "delete"];

/**
 * Temporary development actor resolver.
 * Production identity must come from authenticated middleware, never from these headers.
 */
function actorFromRequest(req: Request): Actor {
  const role = req.header("x-secure-t-role");
  const actorId = req.header("x-secure-t-actor") || "dev-learner";
  const safeRole: Role = role && ROLES.includes(role as Role) ? role as Role : "learner";
  return { id: actorId, role: safeRole };
}

function requestId(req: Request): string {
  return req.header("x-request-id") || crypto.randomUUID();
}

router.get("/capabilities", (req, res) => {
  const actor = actorFromRequest(req);
  res.json({ actor, capabilities: CAPABILITIES.filter(capability => can(actor.role, capability)) });
});

router.get("/tools", (_req, res) => {
  res.json({ tools: listTools() });
});

router.post("/tools/:name", async (req, res) => {
  const actor = actorFromRequest(req);
  try {
    const result = await executeTool(req.params.name, req.body, { actor, requestId: requestId(req) });
    res.json({ ok: true, actor, tool: req.params.name, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tool execution failed";
    const status = message.startsWith("Forbidden") ? 403 : message.startsWith("Unknown") ? 404 : 400;
    res.status(status).json({ ok: false, error: message });
  }
});

router.post("/content/graph", (req, res) => {
  const { text, source, transform } = req.body ?? {};
  if (typeof text !== "string" || text.trim().length < 2) return res.status(400).json({ error: "text must contain at least 2 characters" });
  if (!source || typeof source !== "object" || typeof source.id !== "string" || typeof source.title !== "string" || typeof source.type !== "string") {
    return res.status(400).json({ error: "source requires id, title and type" });
  }
  const graph = buildLearningGraph(text, source as SourceRef);
  const requested = Array.isArray(transform) ? transform.filter((kind: unknown): kind is ContentKind => CONTENT_KINDS.includes(kind as ContentKind)) : [];
  res.json({ graph, derived: requested.length ? graph.nodes.flatMap(node => requested.map(kind => ({ ...node, id: `${node.id}_${kind}`, kind, title: `${node.title} — ${kind}`, metadata: { ...node.metadata, derivedFrom: node.id, transform: kind } }))) : [] });
});

router.post("/data/analyze", (req, res) => {
  const data = req.body as Dataset;
  if (!data || !Array.isArray(data.columns) || !Array.isArray(data.rows)) return res.status(400).json({ error: "dataset requires columns[] and rows[]" });
  if (data.rows.length > 10000) return res.status(413).json({ error: "dataset exceeds the 10,000-row API safety limit" });
  if (data.columns.length > 200) return res.status(413).json({ error: "dataset exceeds the 200-column API safety limit" });
  try {
    res.json({ analysis: analyzeDataset(data) });
  } catch {
    res.status(400).json({ error: "dataset could not be analyzed" });
  }
});

router.post("/projects/check-permission", (req, res) => {
  const { role, permission } = req.body ?? {};
  if (!ROLES.includes(role) || !PROJECT_PERMISSIONS.includes(permission)) return res.status(400).json({ error: "invalid role or permission" });
  res.json({ role, permission, allowed: canProject(role, permission) });
});

export default router;
