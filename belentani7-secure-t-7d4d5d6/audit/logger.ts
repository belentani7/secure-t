export type AuditEvent = {
  actorId?: string;
  actorType: "user" | "agent" | "system";
  action: string;
  tool?: string;
  authorization: "allowed" | "denied" | "human_review";
  result: "success" | "failure" | "blocked";
  metadata?: Record<string, string | number | boolean>;
  error?: string;
};

const forbiddenKey = /secret|token|password|authorization|cookie|api.?key|credential|session/i;
const sensitiveValues = [
  /\bBearer\s+[^\s"'<>]+/gi,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  /\bsk-[A-Za-z0-9_-]{20,}\b/g,
  /\bAIza[0-9A-Za-z_-]{35}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
];

function redact(value: string): string {
  let safe = value;
  for (const pattern of sensitiveValues) safe = safe.replace(pattern, "[REDACTED]");
  return safe.slice(0, 240);
}

// Both the field name and its value must be screened. Logs are not a secret
// store; nested objects or non-finite values are rejected.
export function sanitizeMetadata(metadata: Record<string, unknown> = {}): Record<string, string | number | boolean> {
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (forbiddenKey.test(key)) continue;
    if (typeof value === "string") safe[key] = redact(value);
    else if (typeof value === "boolean") safe[key] = value;
    else if (typeof value === "number" && Number.isFinite(value)) safe[key] = value;
  }
  return safe;
}

export function createAuditEvent(event: AuditEvent) {
  return {
    ...event,
    action: redact(event.action),
    ...(event.error ? { error: redact(event.error) } : {}),
    metadata: sanitizeMetadata(event.metadata),
    occurredAt: new Date().toISOString(),
  };
}
