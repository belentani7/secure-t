import { createAuditEvent, type AuditEvent } from "../../audit/logger.js";
import { getDb } from "../../server/db/index.js";
import { aiAuditEvents } from "../../drizzle/schema.js";

/** Persist governance events when PostgreSQL is available; always return a sanitized event. */
export async function recordAudit(event: AuditEvent) {
  const sanitized = createAuditEvent(event);
  const db = getDb();
  if (!db) return sanitized;

  try {
    await db.insert(aiAuditEvents).values({
      agentId: event.actorType === "agent" ? event.actorId || "unknown-agent" : "platform",
      userId: event.actorType === "user" ? event.actorId : undefined,
      action: event.action,
      tool: event.tool,
      authorization: event.authorization,
      inputMetadata: sanitized.metadata || {},
      outputMetadata: {},
      result: event.result,
      error: event.error,
    });
  } catch (error) {
    console.error("[audit] persistence failed:", error);
  }

  return sanitized;
}
