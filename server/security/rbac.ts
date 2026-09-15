// RBAC Express (spec élite adaptado: roles reales del schema incluyen FACULTY/EXAMINER/LAB_INSTRUCTOR/AI_AGENT/SYSTEM).
// Sin auth institucional aún (Keycloak pendiente): el header x-role SOLO se respeta
// si ALLOW_HEADER_ROLES=true (dev local). En cualquier otro caso se fuerza STUDENT
// (deny-by-default): un header controlado por el cliente jamás otorga privilegios.
import type { NextFunction, Request, Response } from "express";

export type Perm = "content:write" | "content:approve" | "grading" | "users:manage" | "finance" | "moderate";

const MATRIX: Record<string, Perm[]> = {
  ADMIN: ["content:write", "content:approve", "grading", "users:manage", "finance", "moderate"],
  CONTENT: ["content:write", "grading", "moderate"],
  FACULTY: ["content:write", "grading", "moderate"],
  EXAMINER: ["grading"],
  LAB_INSTRUCTOR: ["grading"],
  MENTOR: ["grading"],
  AI_AGENT: [],
  SYSTEM: ["content:write", "content:approve", "grading", "users:manage", "finance", "moderate"],
  STUDENT: [],
};

export function requirePerm(p: Perm) {
  return (req: Request, res: Response, next: NextFunction) => {
    const headerRolesAllowed = process.env.ALLOW_HEADER_ROLES === "true" && process.env.NODE_ENV !== "production";
    const role = headerRolesAllowed
      ? (req.header("x-role") ?? "STUDENT").toUpperCase()
      : "STUDENT";
    if (!MATRIX[role]?.includes(p)) return res.status(403).json({ error: "forbidden", need: p, role });
    return next();
  };
}
