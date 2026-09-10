import { Router } from "express";
import { addEvidence, businessAreas, createAccount, createOpportunity, createProject, getBusinessKpis, getBusinessSnapshot, runPipeline, updatePipelineStatus } from "./service.js";
import type { EvidenceKind, PipelineStatus, PipelineType } from "./types.js";

export const businessRouter = Router();

businessRouter.get("/snapshot", (_req, res) => res.json(getBusinessSnapshot()));
businessRouter.get("/kpis", (_req, res) => res.json(getBusinessKpis()));
businessRouter.get("/config", (_req, res) => res.json({ areas: businessAreas, pipelines: ["LEAD_TO_DISCOVERY", "DISCOVERY_TO_PROPOSAL", "PROPOSAL_TO_DELIVERY", "DELIVERY_TO_CASE_STUDY"] }));

businessRouter.post("/accounts", (req, res) => {
  const { name, area, owner, notes } = req.body ?? {};
  if (typeof name !== "string" || !businessAreas.includes(area) || typeof owner !== "string") return res.status(400).json({ error: "name, area and owner are required" });
  return res.status(201).json(createAccount({ name, area, owner, notes }));
});

businessRouter.post("/opportunities", (req, res) => {
  const { accountId, title, valueCents, probability, nextAction, dueAt, stage } = req.body ?? {};
  if (typeof accountId !== "string" || typeof title !== "string" || !Number.isInteger(valueCents) || typeof probability !== "number" || probability < 0 || probability > 1 || typeof nextAction !== "string") return res.status(400).json({ error: "accountId, title, integer valueCents, probability [0,1] and nextAction are required" });
  try { return res.status(201).json(createOpportunity({ accountId, title, valueCents, probability, nextAction, dueAt, stage })); }
  catch { return res.status(404).json({ error: "account_not_found" }); }
});

businessRouter.post("/projects", (req, res) => {
  const { accountId, opportunityId, title, area, acceptanceCriteria, owner, status } = req.body ?? {};
  if (typeof accountId !== "string" || typeof title !== "string" || !businessAreas.includes(area) || !Array.isArray(acceptanceCriteria) || acceptanceCriteria.some((item: unknown) => typeof item !== "string") || typeof owner !== "string") return res.status(400).json({ error: "accountId, title, area, acceptanceCriteria[] and owner are required" });
  try { return res.status(201).json(createProject({ accountId, opportunityId, title, area, acceptanceCriteria, owner, status })); }
  catch { return res.status(404).json({ error: "account_not_found" }); }
});

businessRouter.post("/evidence", (req, res) => {
  const { projectId, kind, title, uri, hash, verified } = req.body ?? {};
  const kinds: EvidenceKind[] = ["REPO", "REPORT", "DEMO", "COURSE", "CASE_STUDY", "CERTIFICATE"];
  if (!kinds.includes(kind) || typeof title !== "string" || typeof uri !== "string") return res.status(400).json({ error: "kind, title and uri are required" });
  return res.status(201).json(addEvidence({ projectId, kind, title, uri, hash, verified }));
});

businessRouter.post("/pipelines/:type/run", (req, res) => {
  const allowed: PipelineType[] = ["LEAD_TO_DISCOVERY", "DISCOVERY_TO_PROPOSAL", "PROPOSAL_TO_DELIVERY", "DELIVERY_TO_CASE_STUDY"];
  if (!allowed.includes(req.params.type as PipelineType)) return res.status(404).json({ error: "pipeline_not_found" });
  const result = runPipeline(req.params.type as PipelineType, req.body ?? {});
  return res.status(result.status === "BLOCKED" ? 422 : 202).json(result);
});

businessRouter.patch("/pipelines/:id", (req, res) => {
  const allowed: PipelineStatus[] = ["BACKLOG", "READY", "IN_PROGRESS", "BLOCKED", "DONE", "CANCELLED"];
  if (!allowed.includes(req.body?.status)) return res.status(400).json({ error: "invalid_status" });
  const updated = updatePipelineStatus(req.params.id, req.body.status);
  return updated ? res.json(updated) : res.status(404).json({ error: "pipeline_not_found" });
});
