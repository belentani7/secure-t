/**
 * secure T platform contracts.
 * Stable boundaries shared by Academic, AI, Data, Labs and Collaboration.
 * Keep domain decisions server-side; clients consume these contracts.
 */

export type Role = "learner" | "mentor" | "faculty" | "reviewer" | "researcher" | "developer" | "admin";
export type Capability =
  | "content.read" | "content.create" | "content.transform"
  | "ai.chat" | "ai.rag" | "ai.analyze" | "ai.code"
  | "data.read" | "data.query" | "data.analyze"
  | "lab.launch" | "lab.execute"
  | "project.read" | "project.write" | "project.review" | "project.admin"
  | "credential.issue" | "audit.read";

export interface Actor { id: string; role: Role; tenantId?: string; }
export interface SourceRef { id: string; type: "document" | "url" | "dataset" | "code" | "course"; title: string; locator?: string; }
export interface Evidence { type: string; value: unknown; source?: SourceRef; confidence?: number; }
export interface AIRequest { actor: Actor; capability: Capability; input: string; context?: SourceRef[]; metadata?: Record<string, unknown>; }
export interface AIResponse { text: string; model: string; sources: SourceRef[]; evidence?: Evidence[]; usage?: { inputTokens?: number; outputTokens?: number }; auditId: string; }

export const ROLE_CAPABILITIES: Record<Role, readonly Capability[]> = {
  learner: ["content.read", "ai.chat", "ai.rag", "ai.analyze", "data.read", "project.read", "project.write", "lab.launch"],
  mentor: ["content.read", "content.create", "content.transform", "ai.chat", "ai.rag", "ai.analyze", "data.read", "data.query", "project.read", "project.write", "project.review", "lab.launch"],
  faculty: ["content.read", "content.create", "content.transform", "ai.chat", "ai.rag", "ai.analyze", "ai.code", "data.read", "data.query", "data.analyze", "project.read", "project.write", "project.review", "credential.issue", "audit.read"],
  reviewer: ["content.read", "ai.analyze", "data.read", "project.read", "project.review", "credential.issue", "audit.read"],
  researcher: ["content.read", "content.transform", "ai.rag", "ai.analyze", "data.read", "data.query", "data.analyze", "project.read", "project.write"],
  developer: ["content.read", "content.transform", "ai.chat", "ai.rag", "ai.analyze", "ai.code", "data.read", "data.query", "data.analyze", "project.read", "project.write", "project.review"],
  admin: ["content.read", "content.create", "content.transform", "ai.chat", "ai.rag", "ai.analyze", "ai.code", "data.read", "data.query", "data.analyze", "lab.launch", "lab.execute", "project.read", "project.write", "project.review", "project.admin", "credential.issue", "audit.read"],
};

export function can(role: Role, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role]?.includes(capability) ?? false;
}
