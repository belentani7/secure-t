import type { Request } from "express";
import type { Actor, Role } from "../core/contracts.js";

const ROLES: readonly Role[] = ["learner", "mentor", "faculty", "reviewer", "researcher", "developer", "admin"];

export class ActorResolutionError extends Error {
  readonly statusCode = 401;
  constructor(message = "Authenticated actor required") {
    super(message);
    this.name = "ActorResolutionError";
  }
}

/**
 * Resolve identity from trusted request context in production.
 * Development headers exist only outside production and are never a security boundary.
 */
export function actorFromRequest(req: Request): Actor {
  const contextActor = (req as Request & { secureTActor?: unknown }).secureTActor;
  if (isActor(contextActor)) return contextActor;

  if (process.env.NODE_ENV === "production") {
    throw new ActorResolutionError();
  }

  const role = req.header("x-secure-t-role");
  const actorId = req.header("x-secure-t-actor") || "dev-learner";
  const safeRole: Role = role && ROLES.includes(role as Role) ? (role as Role) : "learner";
  return { id: actorId, role: safeRole };
}

function isActor(value: unknown): value is Actor {
  if (!value || typeof value !== "object") return false;
  const actor = value as Partial<Actor>;
  return typeof actor.id === "string" && actor.id.length > 0 && typeof actor.role === "string" && ROLES.includes(actor.role as Role);
}
