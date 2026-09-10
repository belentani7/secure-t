export type BusinessArea = "TRUST_SAFETY" | "MODEL_EVALUATION" | "AUTOMATION_CONSULTING" | "DIGITAL_INCLUSION";
export type PipelineType = "LEAD_TO_DISCOVERY" | "DISCOVERY_TO_PROPOSAL" | "PROPOSAL_TO_DELIVERY" | "DELIVERY_TO_CASE_STUDY";
export type PipelineStatus = "BACKLOG" | "READY" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED";
export type EvidenceKind = "REPO" | "REPORT" | "DEMO" | "COURSE" | "CASE_STUDY" | "CERTIFICATE";

export interface BusinessAccount {
  id: string;
  name: string;
  area: BusinessArea;
  status: "PROSPECT" | "ACTIVE" | "PAUSED" | "CLOSED";
  owner: string;
  notes?: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  accountId: string;
  title: string;
  stage: "QUALIFIED" | "DISCOVERY" | "PROPOSAL" | "WON" | "LOST";
  valueCents: number;
  probability: number;
  nextAction: string;
  dueAt?: string;
  createdAt: string;
}

export interface DeliveryProject {
  id: string;
  accountId: string;
  opportunityId?: string;
  title: string;
  area: BusinessArea;
  status: "PLANNED" | "ACTIVE" | "REVIEW" | "DELIVERED" | "ARCHIVED";
  acceptanceCriteria: string[];
  owner: string;
  createdAt: string;
}

export interface EvidenceItem {
  id: string;
  projectId?: string;
  kind: EvidenceKind;
  title: string;
  uri: string;
  hash?: string;
  verified: boolean;
  createdAt: string;
}

export interface PipelineRun {
  id: string;
  type: PipelineType;
  status: PipelineStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  startedAt: string;
  finishedAt?: string;
  error?: string;
}

export interface BusinessSnapshot {
  accounts: BusinessAccount[];
  opportunities: Opportunity[];
  projects: DeliveryProject[];
  evidence: EvidenceItem[];
  pipelines: PipelineRun[];
}
