import { describe, expect, it, vi } from "vitest";
import type { Request } from "express";
import { ActorResolutionError, actorFromRequest } from "../platform/security/actor.js";

const request = (headers: Record<string, string> = {}) => ({
  header: (name: string) => headers[name.toLowerCase()],
}) as unknown as Request;

describe("secure T actor security boundary", () => {
  it("allows explicit development actor headers outside production", () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";
    expect(actorFromRequest(request({ "x-secure-t-role": "developer", "x-secure-t-actor": "u-dev" }))).toEqual({ id: "u-dev", role: "developer" });
    process.env.NODE_ENV = previous;
  });

  it("rejects development headers in production", () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    expect(() => actorFromRequest(request({ "x-secure-t-role": "admin", "x-secure-t-actor": "attacker" }))).toThrow(ActorResolutionError);
    process.env.NODE_ENV = previous;
  });

  it("accepts an actor injected by trusted authentication middleware", () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const req = request() as Request & { secureTActor: unknown };
    req.secureTActor = { id: "u1", role: "faculty" };
    expect(actorFromRequest(req)).toEqual({ id: "u1", role: "faculty" });
    process.env.NODE_ENV = previous;
  });
});
