import { createAuditEvent, type AuditEvent } from "../../audit/logger.js";
import { getPool } from "../../server/db/index.js";

/** Persist governance events when PostgreSQL is available; always return a sanitized event. */
export async function recordAudit(event: AuditEvent) {
  const sanitized = createAuditEvent(event);
  const pool = getPool();
  if (!pool) return sanitized;

  try {
    await pool.query(
      `INSERT INTO ai_audit_events
        (agent_id, user_id, action, tool, authorization, input_metadata, output_metadata, result, error)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9)`,
      [
        event.actorType === "agent" ? event.actorId || "unknown-agent" : "platform",
        event.actorType === "user" ? event.actorId || null : null,
        event.action,
        event.tool || null,
        event.authorization,
        JSON.stringify(sanitized.metadata || {}),
        JSON.stringify({}),
        event.result,
        event.error || null,
      ],
    );
  } catch (error) {
    console.error("[audit] persistence failed:", error);
  }

  return sanitized;
}
