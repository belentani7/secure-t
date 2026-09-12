import type { Role } from "../core/contracts.js";

export type ProjectPermission = "read" | "write" | "review" | "manage_members" | "manage_settings" | "delete";
export const ROLE_PROJECT_PERMISSIONS: Record<Role, readonly ProjectPermission[]> = {
  learner: ["read", "write"],
  mentor: ["read", "write", "review"],
  faculty: ["read", "write", "review", "manage_members"],
  reviewer: ["read", "review"],
  researcher: ["read", "write"],
  developer: ["read", "write", "review"],
  admin: ["read", "write", "review", "manage_members", "manage_settings", "delete"],
};
export function canProject(role: Role, permission: ProjectPermission): boolean { return ROLE_PROJECT_PERMISSIONS[role].includes(permission); }

export interface SharePolicy { projectId: string; actorId: string; target: "user" | "team"; targetId: string; permissions: ProjectPermission[]; expiresAt?: string; }
export function sanitizeSharePolicy(policy: SharePolicy): SharePolicy {
  return { ...policy, permissions: [...new Set(policy.permissions)].filter(p => p !== "delete") };
}
