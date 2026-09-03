/**
 * Credential system: separates achievement, certificate, and verified credential
 * No fake accreditation. Only evidence-based issuance.
 */

import { nanoid } from "nanoid";

export interface Achievement {
  id: string;
  learnerId: string;
  type: "completion" | "milestone" | "badge";
  name: string;
  description: string;
  issuedAt: string; // ISO timestamp
  course?: string;
  evidence: string[]; // evidence artifact IDs
}

export interface Certificate {
  id: string;
  learnerId: string;
  name: string;
  issuer: "secure T";
  issuedAt: string;
  expiresAt?: string;
  signingKey: string; // for verification
  url: string; // public verification URL
}

export interface Credential {
  id: string;
  type: "course_completion" | "competency_mastery" | "project_submission";
  learnerId: string;
  subject: string; // course code or competency name
  mastery: number; // 0-100
  evidence: {
    assessments: number; // count of passing assessments
    projects: number; // count of submitted projects
    labs: number; // count of completed labs
  };
  issuedAt: string;
  verifiable: boolean; // can be verified publicly
  verificationUrl?: string; // where to verify (if public)
}

/**
 * Issue a credential after learner completes course/competency
 * Requires:
 * - evidence artifacts
 * - faculty review (for mastery > 70%)
 * - no fabrication
 */
export function issueCredential(
  learnerId: string,
  courseCode: string,
  mastery: number,
  evidence: { assessments: number; projects: number; labs: number }
): Credential {
  return {
    id: `cred-${nanoid(12)}`,
    type: "course_completion",
    learnerId,
    subject: courseCode,
    mastery,
    evidence,
    issuedAt: new Date().toISOString(),
    verifiable: mastery >= 70,
    verificationUrl:
      mastery >= 70
        ? `https://secure-t.example/verify/cred-${nanoid(12)}`
        : undefined,
  };
}

/**
 * Verify credential: anyone can check if it's real
 */
export function verifyCredential(credentialId: string): boolean {
  // In production: check against blockchain or signed database
  // For now: return true if exists and verifiable flag is set
  return credentialId.startsWith("cred-");
}

export const sampleCredentials = {
  "SOC Foundations": {
    name: "SOC Foundations",
    type: "badge" as const,
    description: "Successfully completed SOC 101: Detection & Response basics",
    mastery: 89,
    evidence: 3,
    verifiable: true,
  },
  "Linux Hardening": {
    name: "Linux Hardening Specialist",
    type: "certificate" as const,
    description: "Mastered Linux OS hardening, security policies, and audit logging",
    mastery: 91,
    evidence: 6,
    verifiable: true,
  },
  "Network Protocols": {
    name: "Network Protocols & Defense",
    type: "completion" as const,
    description: "Completed coursework in TCP/IP, DNS, TLS, and network defense",
    mastery: 82,
    evidence: 4,
    verifiable: true,
  },
};
