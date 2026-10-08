import { describe, expect, it } from "vitest";
import { can } from "../auth/rbac";
import { createAuditEvent } from "../audit/logger";
import { taskEvent } from "../notifications/task-events";

describe("platform contracts", () => {
  it("prevents students reading another record", () => expect(can("STUDENT", "read:own_record", "student-a", "student-b")).toBe(false));
  it("allows a student to launch a lab", () => expect(can("STUDENT", "launch:lab")).toBe(true));
  it("strips secret-like audit metadata", () => expect(createAuditEvent({ actorType: "agent", action: "test", authorization: "allowed", result: "success", metadata: { token: "hidden", safe: "kept" } }).metadata).toEqual({ safe: "kept" }));
  it("creates completion events", () => expect(taskEvent("task-1", "TASK_COMPLETED").type).toBe("TASK_COMPLETED"));
});
