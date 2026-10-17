export type AuditEvent = { actorId?: string; actorType: "user" | "agent" | "system"; action: string; tool?: string; authorization: "allowed" | "denied" | "human_review"; result: "success" | "failure" | "blocked"; metadata?: Record<string, string | number | boolean>; error?: string };
const forbidden = /secret|token|password|authorization|cookie/i;
export function sanitizeMetadata(metadata: Record<string, unknown> = {}) { return Object.fromEntries(Object.entries(metadata).filter(([key]) => !forbidden.test(key)).map(([key, value]) => [key, typeof value === "string" && value.length > 240 ? `${value.slice(0, 240)}…` : value])); }
export function createAuditEvent(event: AuditEvent) { return { ...event, metadata: sanitizeMetadata(event.metadata), occurredAt: new Date().toISOString() }; }
