import { beforeEach, describe, expect, it } from "vitest";
import { addEvidence, createAccount, createOpportunity, createProject, getBusinessKpis, getBusinessSnapshot, resetBusinessStore, runPipeline, updatePipelineStatus } from "../server/business/service.js";

describe("business operations", () => {
  beforeEach(() => resetBusinessStore());

  it("creates a traceable account, opportunity and project", () => {
    const account = createAccount({ name: "Acme Security", area: "TRUST_SAFETY", owner: "Pedro" });
    const opportunity = createOpportunity({ accountId: account.id, title: "Policy review", valueCents: 120000, probability: 0.5, nextAction: "Book discovery" });
    const project = createProject({ accountId: account.id, opportunityId: opportunity.id, title: "Trust review", area: "TRUST_SAFETY", acceptanceCriteria: ["Report delivered", "Evidence linked"], owner: "Pedro" });
    addEvidence({ projectId: project.id, kind: "REPORT", title: "Final report", uri: "https://example.com/report", verified: true });

    expect(getBusinessSnapshot().projects[0].acceptanceCriteria).toContain("Report delivered");
    expect(getBusinessKpis()).toMatchObject({ accounts: 1, opportunities: 1, activeProjects: 0, verifiedEvidence: 1, weightedPipelineCents: 60000 });
  });

  it("blocks invalid pipeline inputs and completes valid runs", () => {
    const blocked = runPipeline("LEAD_TO_DISCOVERY", {});
    expect(blocked.status).toBe("BLOCKED");
    const account = createAccount({ name: "Beta", area: "MODEL_EVALUATION", owner: "Pedro" });
    const completed = runPipeline("LEAD_TO_DISCOVERY", { accountId: account.id });
    expect(completed.status).toBe("DONE");
    expect(completed.output?.auditRequired).toBe(true);
    expect(updatePipelineStatus(completed.id, "CANCELLED")?.status).toBe("CANCELLED");
  });
});
