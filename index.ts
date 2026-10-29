import express from "express";
import { createHash, timingSafeEqual } from "node:crypto";
import { createServer } from "http";
import path from "path";

const SPA_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// The legacy campus is a self-contained static artifact that still compiles
// Tailwind in the browser and renders Markdown client-side. Keep it functional
// under a scoped policy without weakening the React app's strict CSP.
const LEGACY_CAMPUS_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const app = express();
const server = createServer(app);
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", SPA_CSP);
  next();
});
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Shared tutor throttle in production; local memory is only a development fallback.
const tutorLimits = new Map<string, { count: number; resetAt: number }>();
type TutorQuota = { allowed: boolean; retryAfter: number; unavailable?: boolean };

function localTutorQuota(ip: string): TutorQuota {
  const now = Date.now();
  if (tutorLimits.size >= 2048) {
    for (const [key, value] of tutorLimits) {
      if (value.resetAt <= now) tutorLimits.delete(key);
    }
  }
  const entry = tutorLimits.get(ip);
  if (!entry && tutorLimits.size >= 2048) return { allowed: false, retryAfter: 60 };
  if (!entry || entry.resetAt <= now) {
    tutorLimits.set(ip, { count: 1, resetAt: now + 60_000 });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= 10) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

async function allowTutor(ip: string): Promise<TutorQuota> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!redisUrl || !redisToken) {
    if (process.env.NODE_ENV === "production") return { allowed: false, retryAfter: 60, unavailable: true };
    return localTutorQuota(ip);
  }
  const identity = createHash("sha256").update(ip).digest("hex");
  const key = `secure-t:tutor:${identity}`;
  try {
    const response = await fetch(`${redisUrl.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
      body: JSON.stringify([[ "INCR", key ], [ "EXPIRE", key, 60 ]]),
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error(`Upstash ${response.status}`);
    const result = await response.json() as Array<{ result?: number }>;
    const count = Number(result[0]?.result);
    if (!Number.isInteger(count) || count < 1) throw new Error("Invalid Upstash response");
    if (count > 10) return { allowed: false, retryAfter: 60 };
    return { allowed: true, retryAfter: 0 };
  } catch {
    // Fail closed: an unavailable shared limiter must not become an unlimited tutor.
    return { allowed: false, retryAfter: 60, unavailable: true };
  }
}


const catalog = {
  program: { title: "Secure T — illustrative cybersecurity study roadmap", credits: 0, duration: "five-year plan", standard: "independent, non-accredited curriculum", demo: true },
  courses: [
    { code: "CY-101", title: "Fundamentos de Ciberseguridad", credits: 3, term: "Year 1 · Fall", status: "active" },
    { code: "CS-110", title: "Programación para Defensa", credits: 4, term: "Year 1 · Fall", status: "active" },
    { code: "NET-201", title: "Redes y Protocolos", credits: 4, term: "Year 1 · Spring", status: "next" },
    { code: "CY-350", title: "Network Security", credits: 3, term: "Year 3 · Fall", status: "planned" },
    { code: "CY-460", title: "SOC Operations", credits: 3, term: "Year 4 · Fall", status: "planned" },
    { code: "CY-494", title: "Senior Capstone", credits: 4, term: "Year 4 · Spring", status: "planned" },
  ],
};

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  app: "secure-t",
  version: "0.2.0",
  mode: "demo",
  tutorConfigured: process.env.NODE_ENV !== "production" || Boolean(process.env.SECURE_T_TUTOR_API_KEY),
  capabilities: ["catalog", "demo-progress"],
}));
app.get("/api/catalog", (_req, res) => res.json(catalog));
app.get("/api/progress", (_req, res) => res.json({
  demo: true, verified: false, persisted: false,
  learnerId: "demo-learner", creditsCompleted: 21,
  currentTerm: "Year 1 · Fall", completion: 72, streakDays: 4,
}));

app.post("/api/tutor", async (req, res) => {
  const { message, context = "cybersecurity" } = req.body ?? {};
  if (typeof message !== "string" || !message.trim() || message.length > 2000 ||
      typeof context !== "string" || !["cybersecurity", "defensive-security", "responsible-ai", "governance"].includes(context)) {
    return res.status(400).json({ error: "Invalid tutor message or context" });
  }

  // A production browser cannot safely store this secret. Until a trusted
  // server-side user session exists, keep the online tutor disabled by default.
  const secret = process.env.SECURE_T_TUTOR_API_KEY;
  if (process.env.NODE_ENV === "production" && !secret) {
    return res.status(503).json({ error: "Tutor is not configured for public access" });
  }
  if (secret) {
    const presented = req.get("x-secure-t-key") || "";
    const actual = Buffer.from(secret);
    const candidate = Buffer.from(presented);
    if (candidate.length !== actual.length || !timingSafeEqual(candidate, actual)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  const quota = await allowTutor(req.ip || req.socket.remoteAddress || "unknown");
  if (!quota.allowed) {
    res.setHeader("Retry-After", String(quota.retryAfter));
    return res.status(quota.unavailable ? 503 : 429).json({ error: quota.unavailable ? "Tutor protection is temporarily unavailable" : "Tutor rate limit exceeded" });
  }
  const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const system = `You are Astra, the secure T academic mentor. Teach ${context} using Socratic questioning, evidence, safe lab boundaries, and precise feedback. Never fabricate grades, credentials, accreditation, or source citations. Escalate safety, mental-health, legal, or personal-data issues to a human faculty member.`;
  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, stream: false, messages: [{ role: "system", content: system }, { role: "user", content: message }] }), signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`Ollama ${response.status}`);
    const data = await response.json() as { message?: { content?: string } };
    return res.json({ reply: data.message?.content || "Vamos a convertir esa intuición en una hipótesis comprobable.", engine: "ollama-local" });
  } catch {
    return res.json({ reply: "Buena pregunta. Separa la evidencia de la hipótesis y decide qué dato validarías primero. Puedes pedir una pista o abrir el laboratorio asociado.", engine: "safe-fallback" });
  }
});

// Unknown API endpoints must not fall through to an SPA HTML 200 response.
// The /api no-store policy above also applies to this JSON 404 handler.
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Resolve from the application working directory for both TS and compiled JS.
const staticPath = path.resolve(process.cwd(), "dist", "public");
app.use(
  "/assets",
  express.static(path.join(staticPath, "assets"), {
    immutable: true,
    maxAge: "1y",
  }),
);
app.use(
  express.static(staticPath, {
    redirect: false,
    setHeaders(res, filePath) {
      const inLegacyCampus =
        filePath.includes(`${path.sep}campus${path.sep}full${path.sep}`) ||
        filePath.includes(`${path.sep}conceptos${path.sep}`) ||
        filePath.endsWith("404.html");
      if (inLegacyCampus) {
        res.setHeader("Content-Security-Policy", LEGACY_CAMPUS_CSP);
      }
      if (/\.html?$/i.test(filePath)) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }),
);
app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`secure T server running on http://localhost:${port}/`));
