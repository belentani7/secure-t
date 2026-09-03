// RBAC Express (spec élite adaptado: roles reales del schema incluyen FACULTY/EXAMINER/LAB_INSTRUCTOR/AI_AGENT/SYSTEM).
// Sin auth institucional aún (Keycloak pendiente): lee rol de header x-role solo en dev; por defecto STUDENT.
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
    const role = (req.header("x-role") ?? "STUDENT").toUpperCase();
    if (!MATRIX[role]?.includes(p)) return res.status(403).json({ error: "forbidden", need: p, role });
    return next();
  };
}
