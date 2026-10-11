/**
 * Registro de auditoría — **fuente única de verdad**.
 * Se traslada aquí desde `audit/logger.ts` (que ahora reexporta) para que el
 * agente, el servidor opcional y la interfaz registren eventos con el mismo
 * saneado de metadatos: ninguna clave sensible sale del proceso.
 */

export type AuditActor = "user" | "agent" | "system";
export type AuditAuthorization = "allowed" | "denied" | "human_review";
export type AuditResult = "success" | "failure" | "blocked";

export interface AuditEvent {
  actorId?: string;
  actorType: AuditActor;
  action: string;
  tool?: string;
  authorization: AuditAuthorization;
  result: AuditResult;
  metadata?: Record<string, string | number | boolean>;
  error?: string;
}

export type SanitizedAuditEvent = Omit<AuditEvent, "metadata"> & {
  metadata: Record<string, string | number | boolean>;
  occurredAt: string;
};

const forbidden = /secret|token|password|authorization|cookie/i;

export function sanitizeMetadata(metadata: Record<string, unknown> = {}): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([key]) => !forbidden.test(key))
      .map(([key, value]) => [key, typeof value === "string" && value.length > 240 ? `${value.slice(0, 240)}…` : value])
  );
}

export function createAuditEvent(event: AuditEvent): SanitizedAuditEvent {
  return {
    ...event,
    metadata: sanitizeMetadata(event.metadata) as Record<string, string | number | boolean>,
    occurredAt: new Date().toISOString()
  };
}

/** Cola en memoria con tope: el historial nunca crece sin control. */
export function createAuditLog(limit = 200) {
  const events: SanitizedAuditEvent[] = [];
  return {
    push(event: AuditEvent) {
      events.unshift(createAuditEvent(event));
      if (events.length > limit) events.length = limit;
      return events[0];
    },
    list() {
      return [...events];
    },
    clear() {
      events.length = 0;
    }
  };
}
