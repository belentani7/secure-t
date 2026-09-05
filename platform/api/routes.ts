import { Router, type Request } from "express";
import { can, type Actor, type Capability, type Role, type SourceRef } from "../core/contracts.js";
import { executeTool, listTools } from "../ai/tool-registry.js";
import { buildLearningGraph, type ContentKind } from "../content/pipeline.js";
import { analyzeDataset, type Dataset } from "../data/analysis.js";
import { canProject, type ProjectPermission } from "../collaboration/policy.js";
import { ActorResolutionError, actorFromRequest } from "../security/actor.js";

const router = Router();

const ROLES: readonly Role[] = ["learner", "mentor", "faculty", "reviewer", "researcher", "developer", "admin"];
const CAPABILITIES: readonly Capability[] = [
  "content.read", "content.create", "content.transform", "ai.chat", "ai.rag", "ai.analyze", "ai.code",
  "data.read", "data.query", "data.analyze", "lab.launch", "lab.execute", "project.read", "project.write",
  "project.review", "project.admin", "credential.issue", "audit.read",
];
const CONTENT_KINDS: readonly ContentKind[] = ["document", "lesson", "module", "quiz", "flashcards", "case-study", "simulation", "knowledge-map"];
const PROJECT_PERMISSIONS: readonly ProjectPermission[] = ["read", "write", "review", "manage_members", "manage_settings", "delete"];

function resolveActor(req: Request, res: import("express").Response): Actor | null {
  try {
    return actorFromRequest(req);
  } catch (error) {
    if (error instanceof ActorResolutionError) {
      res.status(error.statusCode).json({ ok: false, error: error.message, code: "AUTH_REQUIRED" });
      return null;
    }
    res.status(401).json({ ok: false, error: "Actor resolution failed", code: "AUTH_REQUIRED" });
    return null;
  }
}

function requestId(req: Request): string {
  return req.header("x-request-id") || crypto.randomUUID();
}

router.get("/capabilities", (req, res) => {
  const actor = resolveActor(req, res);
  if (!actor) return;
  res.json({ actor, capabilities: CAPABILITIES.filter(capability => can(actor.role, capability)) });
});

router.get("/tools", (_req, res) => {
  res.json({ tools: listTools() });
});

router.post("/tools/:name", async (req, res) => {
  const actor = resolveActor(req, res);
  if (!actor) return;
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
  const actor = resolveActor(req, res);
  if (!actor) return;
  if (!can(actor.role, "content.transform")) return res.status(403).json({ ok: false, error: "Forbidden capability: content.transform" });

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
  const actor = resolveActor(req, res);
  if (!actor) return;
  if (!can(actor.role, "data.analyze")) return res.status(403).json({ ok: false, error: "Forbidden capability: data.analyze" });

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
  const actor = resolveActor(req, res);
  if (!actor) return;
  const { role, permission } = req.body ?? {};
  if (!ROLES.includes(role) || !PROJECT_PERMISSIONS.includes(permission)) return res.status(400).json({ error: "invalid role or permission" });
  if (role !== actor.role && actor.role !== "admin") return res.status(403).json({ ok: false, error: "Cannot evaluate permissions for another role" });
  res.json({ role, permission, allowed: canProject(role, permission) });
});

export default router;
