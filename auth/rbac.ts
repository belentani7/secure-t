export type InstitutionalRole = "STUDENT" | "FACULTY" | "MENTOR" | "EXAMINER" | "LAB_INSTRUCTOR" | "ADMIN" | "AI_AGENT" | "SYSTEM";
export type ResourceAction = "read:own_record" | "read:course" | "review:evidence" | "launch:lab" | "manage:curriculum" | "manage:identity" | "issue:credential";
const grants: Record<InstitutionalRole, ResourceAction[]> = { STUDENT: ["read:own_record", "read:course", "launch:lab"], FACULTY: ["read:own_record", "read:course", "review:evidence", "manage:curriculum"], MENTOR: ["read:own_record", "read:course", "review:evidence"], EXAMINER: ["read:own_record", "review:evidence"], LAB_INSTRUCTOR: ["read:own_record", "read:course", "launch:lab"], ADMIN: ["read:own_record", "read:course", "manage:curriculum", "manage:identity"], AI_AGENT: ["read:course"], SYSTEM: ["manage:identity"], };
// A record may never be authorized by role alone: the actor and target
// owner must both be known and identical. Missing identities fail closed.
export function can(
  role: InstitutionalRole,
  action: ResourceAction,
  resourceOwnerId?: string,
  actorId?: string,
): boolean {
  if (!grants[role]?.includes(action)) return false;
  if (action === "read:own_record") {
    return Boolean(resourceOwnerId && actorId && resourceOwnerId === actorId);
  }
  return true;
}
export function assertRole(role: InstitutionalRole, allowed: InstitutionalRole[]) { if (!allowed.includes(role)) throw new Error("authorization_denied"); }
