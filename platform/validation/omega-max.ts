export const OMEGA_MAX_VERSION = "1.0.0" as const;

export type ValidationSeverity = "info" | "warning" | "error" | "critical";
export type ValidationStatus = "pass" | "warn" | "fail";

export type ValidationSphereId =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type ValidationSphere = {
  id: ValidationSphereId;
  key: string;
  name: string;
  focus: string;
  checks: readonly string[];
};

export type ValidationFinding = {
  sphere: ValidationSphereId;
  code: string;
  severity: ValidationSeverity;
  status: ValidationStatus;
  message: string;
  evidence?: string;
  remediation?: string;
};

export type ValidationInput = {
  structure?: Record<string, unknown>;
  state?: Record<string, unknown>;
  security?: {
    authenticated?: boolean;
    encrypted?: boolean;
    headers?: Record<string, string | undefined>;
  };
  protocol?: { signed?: boolean; validated?: boolean };
  integrity?: { hash?: string; immutableLedger?: boolean };
  compliance?: { gdpr?: boolean; dsa?: boolean; nis2?: boolean };
  ai?: {
    modelVersion?: string;
    promptPolicy?: boolean;
    outputValidation?: boolean;
    hallucinationControls?: boolean;
  };
  mlops?: { versioned?: boolean; driftMonitoring?: boolean };
  cryptography?: { algorithm?: string; keyManagement?: boolean };
  ethics?: { biasEvaluation?: boolean; humanOversight?: boolean };
  simulation?: { enabled?: boolean };
  evolution?: { automaticUpdates?: boolean; rollback?: boolean };
  metadata?: Record<string, string | number | boolean>;
};

export const OMEGA_MAX_SPHERES: readonly ValidationSphere[] = [
  { id: 1, key: "structure", name: "Estructura", focus: "schemas, types and data structures", checks: ["schema", "types", "contracts"] },
  { id: 2, key: "semantics", name: "Semántica", focus: "meaning, context and consistency", checks: ["context", "meaning", "consistency"] },
  { id: 3, key: "state", name: "Estado", focus: "session, state and persistence", checks: ["session", "persistence", "state"] },
  { id: 4, key: "security", name: "Seguridad", focus: "authentication, headers and transport security", checks: ["authentication", "headers", "transport"] },
  { id: 5, key: "protocol", name: "Protocolo", focus: "message validation, handshakes and signatures", checks: ["messages", "handshake", "signatures"] },
  { id: 6, key: "integrity", name: "Integridad", focus: "hashing, checksums and audit integrity", checks: ["hash", "checksum", "ledger"] },
  { id: 7, key: "compliance", name: "Cumplimiento", focus: "GDPR, DSA, NIS2 and policy controls", checks: ["gdpr", "dsa", "nis2"] },
  { id: 8, key: "ai", name: "IA", focus: "LLM governance, prompts and outputs", checks: ["prompt-policy", "output-validation", "hallucination"] },
  { id: 9, key: "mlops", name: "MLOps", focus: "model versions, drift and production controls", checks: ["versioning", "drift"] },
  { id: 10, key: "cryptography", name: "Criptografía", focus: "encryption and key management", checks: ["encryption", "keys"] },
  { id: 11, key: "ethics", name: "Ética", focus: "bias, fairness and human oversight", checks: ["bias", "oversight"] },
  { id: 12, key: "digital-twin", name: "Gemelo Digital", focus: "simulation and what-if analysis", checks: ["simulation"] },
  { id: 13, key: "information-thermodynamics", name: "Termodinámica", focus: "information entropy and loss analysis", checks: ["entropy", "loss"] },
  { id: 14, key: "self-evolution", name: "Auto-evolución", focus: "adaptive updates and rollback", checks: ["updates", "rollback"] },
  { id: 15, key: "meta-validation", name: "Validación Superior", focus: "meta-validation and failure prediction", checks: ["meta-validation", "failure-prediction"] },
] as const;

function finding(sphere: ValidationSphereId, code: string, status: ValidationStatus, message: string, remediation?: string): ValidationFinding {
  const severity: ValidationSeverity = status === "fail" ? "critical" : status === "warn" ? "warning" : "info";
  return { sphere, code, status, severity, message, remediation };
}

export function validateOmegaMax(input: ValidationInput): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  findings.push(input.structure ? finding(1, "S1_STRUCTURE_PRESENT", "pass", "Structure metadata supplied.") : finding(1, "S1_STRUCTURE_MISSING", "warn", "No structure metadata supplied; structural validation is incomplete."));
  findings.push(input.state ? finding(3, "S3_STATE_PRESENT", "pass", "State metadata supplied.") : finding(3, "S3_STATE_MISSING", "warn", "No state metadata supplied; persistence/session validation is incomplete."));

  if (input.security?.authenticated === false) findings.push(finding(4, "S4_AUTH_REQUIRED", "fail", "Authentication boundary is explicitly disabled.", "Require a trusted identity before protected operations."));
  else if (input.security?.authenticated === true) findings.push(finding(4, "S4_AUTH_PRESENT", "pass", "Authenticated actor boundary supplied."));
  else findings.push(finding(4, "S4_AUTH_UNKNOWN", "warn", "Authentication state is unknown; do not treat caller-provided role headers as a security boundary."));

  if (input.security?.encrypted === false) findings.push(finding(4, "S4_TRANSPORT_UNENCRYPTED", "fail", "Encrypted transport is explicitly disabled.", "Require TLS for protected traffic."));
  else if (input.security?.encrypted === true) findings.push(finding(4, "S4_TRANSPORT_ENCRYPTED", "pass", "Encrypted transport supplied."));

  if (input.protocol?.validated === false) findings.push(finding(5, "S5_MESSAGE_UNVALIDATED", "fail", "Protocol message validation is disabled.", "Validate request and tool contracts before execution."));
  else if (input.protocol?.validated === true) findings.push(finding(5, "S5_MESSAGE_VALIDATED", "pass", "Protocol validation supplied."));

  if (input.integrity?.immutableLedger === false) findings.push(finding(6, "S6_LEDGER_MUTABLE", "warn", "Immutable audit ledger is not enabled.", "Persist security-relevant events in an append-oriented audit trail."));
  else if (input.integrity?.immutableLedger === true) findings.push(finding(6, "S6_LEDGER_IMMUTABLE", "pass", "Immutable audit ledger supplied."));

  const compliance = input.compliance;
  if (compliance) {
    for (const [key, value] of Object.entries(compliance)) {
      if (value === false) findings.push(finding(7, `S7_${key.toUpperCase()}_FAIL`, "warn", `${key.toUpperCase()} compliance control is not enabled.`));
      else findings.push(finding(7, `S7_${key.toUpperCase()}_PASS`, "pass", `${key.toUpperCase()} compliance control supplied.`));
    }
  } else findings.push(finding(7, "S7_COMPLIANCE_UNKNOWN", "warn", "No compliance profile supplied; regulatory validation is incomplete."));

  if (input.ai) {
    const controls: Array<[keyof NonNullable<ValidationInput["ai"]>, string]> = [
      ["promptPolicy", "prompt policy"],
      ["outputValidation", "output validation"],
      ["hallucinationControls", "hallucination controls"],
    ];
    for (const [key, label] of controls) {
      findings.push(input.ai[key] === true
        ? finding(8, `S8_${String(key).toUpperCase()}_PASS`, "pass", `${label} enabled.`)
        : finding(8, `S8_${String(key).toUpperCase()}_MISSING`, "warn", `${label} is not confirmed.`));
    }
  } else findings.push(finding(8, "S8_AI_PROFILE_MISSING", "warn", "No AI governance profile supplied."));

  if (input.mlops) {
    findings.push(input.mlops.versioned === true ? finding(9, "S9_MODEL_VERSIONED", "pass", "Model versioning supplied.") : finding(9, "S9_MODEL_UNVERSIONED", "warn", "Model versioning is not confirmed."));
    findings.push(input.mlops.driftMonitoring === true ? finding(9, "S9_DRIFT_MONITORED", "pass", "Model drift monitoring supplied.") : finding(9, "S9_DRIFT_UNMONITORED", "warn", "Model drift monitoring is not confirmed."));
  }

  if (input.cryptography) {
    const algorithm = input.cryptography.algorithm?.toUpperCase();
    findings.push(algorithm ? finding(10, "S10_ALGORITHM_PRESENT", "pass", `Cryptographic algorithm declared: ${algorithm}.`) : finding(10, "S10_ALGORITHM_MISSING", "warn", "No cryptographic algorithm declared."));
    findings.push(input.cryptography.keyManagement === true ? finding(10, "S10_KEYS_MANAGED", "pass", "Key-management control supplied.") : finding(10, "S10_KEYS_UNMANAGED", "warn", "Key management is not confirmed."));
  }

  if (input.ethics) {
    findings.push(input.ethics.biasEvaluation === true ? finding(11, "S11_BIAS_EVALUATED", "pass", "Bias evaluation supplied.") : finding(11, "S11_BIAS_UNKNOWN", "warn", "Bias evaluation is not confirmed."));
    findings.push(input.ethics.humanOversight === true ? finding(11, "S11_HUMAN_OVERSIGHT", "pass", "Human oversight supplied.") : finding(11, "S11_OVERSIGHT_UNKNOWN", "warn", "Human oversight is not confirmed."));
  }

  findings.push(input.simulation?.enabled === true ? finding(12, "S12_SIMULATION_ENABLED", "pass", "Simulation capability supplied.") : finding(12, "S12_SIMULATION_NOT_CONFIRMED", "warn", "Digital-twin/simulation capability is not confirmed."));
  findings.push(finding(13, "S13_INFORMATION_BASELINE", "pass", "Information-loss/entropy sphere registered; quantitative analysis requires telemetry."));

  if (input.evolution) {
    findings.push(input.evolution.automaticUpdates === true ? finding(14, "S14_AUTO_UPDATE", "warn", "Automatic updates enabled; changes require rollback and validation gates.") : finding(14, "S14_MANUAL_UPDATE", "pass", "Automatic updates are not enabled."));
    findings.push(input.evolution.rollback === true ? finding(14, "S14_ROLLBACK", "pass", "Rollback control supplied.") : finding(14, "S14_ROLLBACK_MISSING", "fail", "Automatic evolution has no confirmed rollback control.", "Require a reversible deployment/version strategy."));
  }

  findings.push(finding(15, "S15_META_VALIDATION", "pass", "OMEGA-MAX meta-validation engine executed; findings are themselves auditable."));
  return findings;
}

export function summarizeValidation(findings: readonly ValidationFinding[]) {
  const counts = findings.reduce((acc, item) => {
    acc[item.status] += 1;
    return acc;
  }, { pass: 0, warn: 0, fail: 0 });

  const score = findings.length === 0 ? 0 : Math.round((counts.pass / findings.length) * 100);
  const status: ValidationStatus = counts.fail > 0 ? "fail" : counts.warn > 0 ? "warn" : "pass";
  return { status, score, counts, total: findings.length, version: OMEGA_MAX_VERSION };
}
