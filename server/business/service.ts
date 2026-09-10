import { randomUUID } from "node:crypto";
import type { BusinessAccount, BusinessArea, BusinessSnapshot, DeliveryProject, EvidenceItem, Opportunity, PipelineRun, PipelineStatus, PipelineType } from "./types.js";

const now = () => new Date().toISOString();
const store: BusinessSnapshot = { accounts: [], opportunities: [], projects: [], evidence: [], pipelines: [] };

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
  return account;
}

export function createOpportunity(input: Omit<Opportunity, "id" | "createdAt" | "stage"> & Partial<Pick<Opportunity, "stage">>): Opportunity {
  if (!store.accounts.some(account => account.id === input.accountId)) throw new Error("account_not_found");
  const opportunity: Opportunity = { ...input, id: randomUUID(), stage: input.stage ?? "QUALIFIED", createdAt: now() };
  store.opportunities.push(opportunity);
  return opportunity;
}

export function createProject(input: Omit<DeliveryProject, "id" | "createdAt" | "status"> & Partial<Pick<DeliveryProject, "status">>): DeliveryProject {
  if (!store.accounts.some(account => account.id === input.accountId)) throw new Error("account_not_found");
  const project: DeliveryProject = { ...input, id: randomUUID(), status: input.status ?? "PLANNED", createdAt: now() };
  store.projects.push(project);
  return project;
}

export function addEvidence(input: Omit<EvidenceItem, "id" | "createdAt" | "verified"> & Partial<Pick<EvidenceItem, "verified">>): EvidenceItem {
  const evidence: EvidenceItem = { ...input, id: randomUUID(), verified: input.verified ?? false, createdAt: now() };
  store.evidence.push(evidence);
  return evidence;
}

export function runPipeline(type: PipelineType, input: Record<string, unknown>): PipelineRun {
  const run: PipelineRun = { id: randomUUID(), type, status: "IN_PROGRESS", input, startedAt: now() };
  store.pipelines.push(run);
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
