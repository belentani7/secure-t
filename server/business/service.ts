import { randomUUID } from "node:crypto";
import { isDbConnected, query } from "../db/index.js";
import type { BusinessAccount, BusinessArea, BusinessSnapshot, DeliveryProject, EvidenceItem, Opportunity, PipelineRun, PipelineStatus, PipelineType } from "./types.js";

const now = () => new Date().toISOString();
const store: BusinessSnapshot = { accounts: [], opportunities: [], projects: [], evidence: [], pipelines: [] };

export async function hydrateBusinessStore() {
  if (!isDbConnected()) return;
  try {
    const [accounts, opportunities, projects, evidence, pipelines] = await Promise.all([
      query<any>("SELECT id, name, area, status, owner, notes, created_at AS \"createdAt\" FROM business_accounts ORDER BY created_at DESC"),
      query<any>("SELECT id, account_id AS \"accountId\", title, stage, value_cents AS \"valueCents\", probability, next_action AS \"nextAction\", due_at AS \"dueAt\", created_at AS \"createdAt\" FROM business_opportunities ORDER BY created_at DESC"),
      query<any>("SELECT id, account_id AS \"accountId\", opportunity_id AS \"opportunityId\", title, area, status, acceptance_criteria AS \"acceptanceCriteria\", owner, created_at AS \"createdAt\" FROM business_projects ORDER BY created_at DESC"),
      query<any>("SELECT id, project_id AS \"projectId\", kind, title, uri, hash, verified, created_at AS \"createdAt\" FROM business_evidence ORDER BY created_at DESC"),
      query<any>("SELECT id, type, status, input, output, error, started_at AS \"startedAt\", finished_at AS \"finishedAt\" FROM business_pipeline_runs ORDER BY started_at DESC"),
    ]);
    store.accounts = accounts;
    store.opportunities = opportunities;
    store.projects = projects;
    store.evidence = evidence;
    store.pipelines = pipelines;
  } catch (error) {
    console.error("[business] hydration skipped:", error);
  }
}

async function persist(table: string, values: unknown[], placeholders: string) {
  if (isDbConnected()) await query(`INSERT INTO ${table} VALUES (${placeholders})`, values);
}

export function resetBusinessStore() {
  store.accounts = [];
  store.opportunities = [];
  store.projects = [];
  store.evidence = [];
  store.pipelines = [];
}

export function getBusinessSnapshot(): BusinessSnapshot {
  return {
    accounts: [...store.accounts],
    opportunities: [...store.opportunities],
    projects: [...store.projects],
    evidence: [...store.evidence],
    pipelines: [...store.pipelines],
  };
}

export function createAccount(input: Pick<BusinessAccount, "name" | "area" | "owner"> & Partial<Pick<BusinessAccount, "notes">>): BusinessAccount {
  const account: BusinessAccount = { id: randomUUID(), name: input.name.trim(), area: input.area, owner: input.owner.trim(), notes: input.notes?.trim(), status: "PROSPECT", createdAt: now() };
  store.accounts.push(account);
  void persist("business_accounts (id, name, area, status, owner, notes, created_at, updated_at)", [account.id, account.name, account.area, account.status, account.owner, account.notes ?? null, account.createdAt, account.createdAt], "$1,$2,$3,$4,$5,$6,$7,$8");
  return account;
}

export function createOpportunity(input: Omit<Opportunity, "id" | "createdAt" | "stage"> & Partial<Pick<Opportunity, "stage">>): Opportunity {
  if (!store.accounts.some(account => account.id === input.accountId)) throw new Error("account_not_found");
  const opportunity: Opportunity = { ...input, id: randomUUID(), stage: input.stage ?? "QUALIFIED", createdAt: now() };
  store.opportunities.push(opportunity);
  void persist("business_opportunities (id, account_id, title, stage, value_cents, probability, next_action, due_at, created_at, updated_at)", [opportunity.id, opportunity.accountId, opportunity.title, opportunity.stage, opportunity.valueCents, opportunity.probability, opportunity.nextAction, opportunity.dueAt ?? null, opportunity.createdAt, opportunity.createdAt], "$1,$2,$3,$4,$5,$6,$7,$8,$9,$10");
  return opportunity;
}

export function createProject(input: Omit<DeliveryProject, "id" | "createdAt" | "status"> & Partial<Pick<DeliveryProject, "status">>): DeliveryProject {
  if (!store.accounts.some(account => account.id === input.accountId)) throw new Error("account_not_found");
  const project: DeliveryProject = { ...input, id: randomUUID(), status: input.status ?? "PLANNED", createdAt: now() };
  store.projects.push(project);
  void persist("business_projects (id, account_id, opportunity_id, title, area, status, acceptance_criteria, owner, created_at, updated_at)", [project.id, project.accountId, project.opportunityId ?? null, project.title, project.area, project.status, JSON.stringify(project.acceptanceCriteria), project.owner, project.createdAt, project.createdAt], "$1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10");
  return project;
}

export function addEvidence(input: Omit<EvidenceItem, "id" | "createdAt" | "verified"> & Partial<Pick<EvidenceItem, "verified">>): EvidenceItem {
  const evidence: EvidenceItem = { ...input, id: randomUUID(), verified: input.verified ?? false, createdAt: now() };
  store.evidence.push(evidence);
  void persist("business_evidence (id, project_id, kind, title, uri, hash, verified, created_at, updated_at)", [evidence.id, evidence.projectId ?? null, evidence.kind, evidence.title, evidence.uri, evidence.hash ?? null, evidence.verified, evidence.createdAt, evidence.createdAt], "$1,$2,$3,$4,$5,$6,$7,$8,$9");
  return evidence;
}

export function runPipeline(type: PipelineType, input: Record<string, unknown>): PipelineRun {
  const run: PipelineRun = { id: randomUUID(), type, status: "IN_PROGRESS", input, startedAt: now() };
  store.pipelines.push(run);
  void persist("business_pipeline_runs (id, type, status, input, started_at, created_at, updated_at)", [run.id, run.type, run.status, JSON.stringify(run.input), run.startedAt, run.startedAt, run.startedAt], "$1,$2,$3,$4::jsonb,$5,$6,$7");
  try {
    const output = executePipeline(type, input);
    run.status = "DONE";
    run.output = output;
    run.finishedAt = now();
  } catch (error) {
    run.status = "BLOCKED";
    run.error = error instanceof Error ? error.message : "pipeline_failed";
    run.finishedAt = now();
  }
  return run;
}

function executePipeline(type: PipelineType, input: Record<string, unknown>): Record<string, unknown> {
  if (type === "LEAD_TO_DISCOVERY" && typeof input.accountId !== "string") throw new Error("accountId_required");
  if (type === "DISCOVERY_TO_PROPOSAL" && typeof input.opportunityId !== "string") throw new Error("opportunityId_required");
  if (type === "PROPOSAL_TO_DELIVERY" && typeof input.opportunityId !== "string") throw new Error("opportunityId_required");
  if (type === "DELIVERY_TO_CASE_STUDY" && typeof input.projectId !== "string") throw new Error("projectId_required");
  return { checkpoint: type, nextAction: nextActionFor(type), governed: true, auditRequired: true };
}

function nextActionFor(type: PipelineType): string {
  const actions: Record<PipelineType, string> = {
    LEAD_TO_DISCOVERY: "Schedule a 30-minute discovery call and capture the problem statement.",
    DISCOVERY_TO_PROPOSAL: "Draft a scoped proposal with acceptance criteria, price and owner.",
    PROPOSAL_TO_DELIVERY: "Create a delivery project and confirm the acceptance criteria with the client.",
    DELIVERY_TO_CASE_STUDY: "Verify evidence, obtain permission and publish a measurable case study.",
  };
  return actions[type];
}

export function updatePipelineStatus(id: string, status: PipelineStatus): PipelineRun | null {
  const run = store.pipelines.find(item => item.id === id);
  if (!run) return null;
  run.status = status;
  if (["DONE", "CANCELLED"].includes(status)) run.finishedAt = now();
  if (isDbConnected()) void query("UPDATE business_pipeline_runs SET status = $1, finished_at = $2, updated_at = now() WHERE id = $3", [status, run.finishedAt ?? null, id]);
  return run;
}

export function getBusinessKpis() {
  const weightedPipelineCents = store.opportunities.reduce((sum, item) => sum + item.valueCents * item.probability, 0);
  return {
    accounts: store.accounts.length,
    activeAccounts: store.accounts.filter(item => item.status === "ACTIVE").length,
    opportunities: store.opportunities.length,
    weightedPipelineCents: Math.round(weightedPipelineCents),
    activeProjects: store.projects.filter(item => item.status === "ACTIVE").length,
    verifiedEvidence: store.evidence.filter(item => item.verified).length,
    pipelineRuns: store.pipelines.length,
  };
}

export const businessAreas: BusinessArea[] = ["TRUST_SAFETY", "MODEL_EVALUATION", "AUTOMATION_CONSULTING", "DIGITAL_INCLUSION"];
