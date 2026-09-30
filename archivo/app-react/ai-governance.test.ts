import { describe, expect, it } from "vitest";
import { authorize, routeAgent } from "../ai/governance";

describe("AI governance", () => {
  it("routes lab requests to lab agent", () => expect(routeAgent("quiero abrir el laboratorio SOC")).toBe("lab"));
  it("prioritizes security agent for incident analysis", () => expect(routeAgent("investiga este incidente de seguridad")).toBe("security"));
  it("denies credential issuance globally", () => expect(authorize("academic", "issue_credential").allowed).toBe(false));
  it("restricts sensitive operations in exam mode", () => expect(authorize("assessment", "propose_assessment", true).allowed).toBe(false));
  it("allows tutor to read own progress", () => expect(authorize("tutor", "read_own_progress").allowed).toBe(true));
});
