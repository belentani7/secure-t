import { randomBytes } from "node:crypto";
import { describe, expect, it, beforeAll } from "vitest";
import { issueAnonymousToken, verifySignedToken } from "../server/auth/token";

const SECRET_A = randomBytes(32).toString("hex");
const SECRET_B = randomBytes(32).toString("hex");

beforeAll(() => {
  process.env.TOKEN_SECRET = SECRET_A;
});

describe("signed anonymous tokens (HMAC)", () => {
  it("issues a 4-part token and verifies it", () => {
    const t = issueAnonymousToken();
    expect(t.split("_").length).toBe(4);
    const r = verifySignedToken(t);
    expect(r.valid).toBe(true);
    expect(typeof r.uuid).toBe("string");
  });

  it("rejects a tampered signature", () => {
    const t = issueAnonymousToken();
    const last = t.slice(-1);
    const bad = t.slice(0, -1) + (last === "A" ? "B" : "A");
    expect(verifySignedToken(bad).valid).toBe(false);
    expect(verifySignedToken(bad).errorCode).toBe("INVALID_SIGNATURE");
  });

  it("rejects a token signed with a different secret", () => {
    const t = issueAnonymousToken();
    process.env.TOKEN_SECRET = SECRET_B;
    expect(verifySignedToken(t).valid).toBe(false);
    process.env.TOKEN_SECRET = SECRET_A;
  });

  it("rejects legacy 3-part unsigned tokens", () => {
    const legacy = "secure-t_123e4567-e89b-42d3-a456-426614174000_1700000000000";
    expect(verifySignedToken(legacy).valid).toBe(false);
    expect(verifySignedToken(legacy).errorCode).toBe("INVALID_FORMAT");
  });

  it("rejects a malformed token", () => {
    expect(verifySignedToken("nope").valid).toBe(false);
  });
});
