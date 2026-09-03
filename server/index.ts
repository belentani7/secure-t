import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { securityHeaders, rateLimit } from "./security/headers.js";
import { orchestrate } from "./ai/orchestrator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);

app.use(express.json({ limit: "64kb" }));
app.use(securityHeaders);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "secure-t", phase: "foundation", database: "contract-ready" });
});

// Ready check
app.get("/api/ready", (_req, res) => {
  res.json({ ready: true, dependencies: { database: "contract-ready", identity: "not-connected", queue: "not-connected" } });
});

// Catalog endpoint
app.get("/api/catalog", (_req, res) => {
  res.json({ 
    program: { code: "BSCY", title: "Bachelor of Cybersecurity", credits: 120, duration: "4 years", accreditation: "not claimed" },
    courses: [{ code: "CY-101", title: "Cybersecurity Fundamentals", year: 1, credits: 3 }, { code: "CS-110", title: "Python for Defense", year: 1, credits: 4 }]
  });
});

// Labs endpoint
app.get("/api/labs", (_req, res) => {
  res.json({ labs: [], safety: "isolated execution required; production network denied" });
});

// API routes (simplified - no auth yet)
app.get("/api/progress", (req, res) => {
  res.json({ learnerId: "demo-learner", creditsCompleted: 21, completion: 72, competencies: [] });
});

// AI routing endpoint: orquestador élite sobre gobernanza real (ai/governance.ts).
// Rate-limit sin Redis (ver server/security/headers.ts). Safe-fallback si Ollama cae.
app.post("/api/ai/route", rateLimit("ai-route", 30), async (req, res) => {
  try {
    const { message, examMode = false, locale = "es" } = req.body ?? {};
    if (typeof message !== "string" || message.trim().length < 2) {
      return res.status(400).json({ error: "message must be a non-empty string" });
    }
    const out = await orchestrate(message, { examMode: examMode === true, locale });
    res.json({ ...out, sources: [], audit: "recorded" });
  } catch {
    res.json({ agent: "tutor", reply: "I can help you convert this into a safe and verifiable practice.", model: "safe-fallback", sources: [], audit: "recorded" });
  }
});

// Labs launch endpoint
app.post("/api/labs/:code/launch", (req, res) => {
  res.status(202).json({ task: "TASK_CREATED", instance: { id: "instance-demo", lab: req.params.code, status: "queued" } });
});

// Notifications preferences
app.post("/api/notifications/preferences", (_req, res) => {
  res.json({ message: "Notification preferences updated" });
});

// Serve static files
const staticPath = process.env.NODE_ENV === "production" 
  ? path.resolve(__dirname, "public") 
  : path.resolve(__dirname, "..", "dist", "public");
app.use(express.static(staticPath));
app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`secure T server running on http://localhost:${port}/`));
export { app, server };