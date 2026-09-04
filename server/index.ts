import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { securityHeaders, rateLimit } from "./security/headers.js";
import { pingDb, isDbConnected } from "./db/index.js";
import { dbService } from "./services/db.js";
import { orchestrate } from "./ai/orchestrator.js";
import { getWelcomeMessage } from "./ai/welcome.js";
import { curriculum, getCourse, getCoursesForYear } from "./data/curriculum.js";
import { issueCredential, verifyCredential, sampleCredentials } from "./data/credentials.js";
import { generateSpeechSafe } from "./voice/tts.js";
import { instructors, getInstructor, getInstructorsByCourse } from "./data/instructors.js";
import { enrollLearner, updateEnrollmentProgress, sampleEnrollments } from "./data/enrollment.js";
import { enrollmentRepository, progressRepository } from "../academic/repositories/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);

app.use(express.json({ limit: "64kb" }));
app.use(securityHeaders);

// Health check
app.get("/api/health", async (_req, res) => {
  res.json({ ok: true, app: "secure-t", phase: "foundation", database: isDbConnected() ? "connected" : "in-memory" });
});

// Ready check
app.get("/api/ready", async (_req, res) => {
  const dbOk = await pingDb();
  res.json({ ready: true, dependencies: { database: dbOk ? "connected" : "in-memory", identity: "not-connected", queue: "not-connected" } });
});

// Database status (transient, safe)
app.get("/api/db/status", async (_req, res) => {
  const live = await pingDb();
  res.json({ connected: live, mode: live ? "postgres" : "in-memory-fallback", poolSize: live ? 10 : 0 });
});

// Catalog endpoint: full curriculum structure
app.get("/api/catalog", (_req, res) => {
  res.json({
    program: {
      code: curriculum.code,
      title: curriculum.title,
      duration: curriculum.duration,
      credits: curriculum.credits,
      description: curriculum.description,
      accreditation: "not claimed - reference curriculum only",
    },
    courses: curriculum.courses.map(c => ({
      code: c.code,
      title: c.title,
      year: c.year,
      credits: c.credits,
      description: c.description,
      moduleCount: c.modules.length,
      prerequisites: c.prerequisites,
    })),
    competencies: curriculum.competencies,
  });
});

// Courses by year
app.get("/api/catalog/year/:year", (req, res) => {
  const year = parseInt(req.params.year) as 1 | 2 | 3 | 4;
  if (![1, 2, 3, 4].includes(year)) {
    return res.status(400).json({ error: "Year must be 1-4" });
  }
  res.json({ year, courses: getCoursesForYear(year) });
});

// Course detail
app.get("/api/catalog/course/:code", (req, res) => {
  const course = getCourse(req.params.code);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json(course);
});

// Labs endpoint
app.get("/api/labs", (_req, res) => {
  res.json({ labs: [], safety: "isolated execution required; production network denied" });
});

// API routes (simplified - no auth yet)
app.get("/api/progress", (req, res) => {
  res.json({ learnerId: "demo-learner", creditsCompleted: 21, completion: 72, competencies: [] });
});

// Welcome endpoint: personalized greeting on first connection
app.get("/api/ai/welcome", async (req, res) => {
  const locale = (req.query.locale as string) || "es";
  const isFirstTime = req.query.first === "true";
  const isSpecial = req.query.special === "true";

  try {
    const message = await getWelcomeMessage(
      locale as "es" | "pt" | "en",
      isFirstTime,
      isSpecial
    );
    res.json({
      agent: "tutor",
      reply: message,
      model: "welcome",
      sources: [],
      audit: "recorded"
    });
  } catch {
    res.json({
      agent: "tutor",
      reply: "Bienvenido a secure T. Estamos aquí para ayudarte.",
      model: "safe-fallback",
      sources: [],
      audit: "recorded"
    });
  }
});

// Text-to-speech endpoint: Kokoro via Hugging Face
app.post("/api/ai/speak", rateLimit("tts", 10), async (req, res) => {
  try {
    const { text, locale = "es" } = req.body ?? {};
    if (typeof text !== "string" || text.trim().length < 2) {
      return res.status(400).json({ error: "text required (min 2 chars)" });
    }

    const audio = await generateSpeechSafe({
      text,
      locale: (locale as "es" | "pt" | "en") || "es",
    });

    if (!audio) {
      return res.json({
        error: "TTS unavailable, use browser fallback",
        fallback: true,
      });
    }

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", audio.length);
    res.send(audio);
  } catch (error) {
    console.error("TTS endpoint error:", error);
    res.status(500).json({
      error: "Speech generation failed",
      fallback: true,
    });
  }
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

// Credentials: achievements and verifiable certificates
app.get("/api/credentials", (_req, res) => {
  res.json({
    achievements: Object.entries(sampleCredentials).map(([key, cred]) => ({
      id: `ach-${key.toLowerCase().replace(/ /g, "-")}`,
      ...cred,
    })),
    message: "Credentials are evidence-based. No fabrication. Faculty review required for mastery > 70%.",
  });
});

// Issue credential (post-completion verification)
app.post("/api/credentials/issue", (req, res) => {
  const { learnerId, courseCode, mastery, evidence } = req.body ?? {};
  if (!learnerId || !courseCode || typeof mastery !== "number") {
    return res
      .status(400)
      .json({ error: "learnerId, courseCode, and mastery required" });
  }
  const credential = issueCredential(learnerId, courseCode, mastery, evidence || {
    assessments: 1,
    projects: 0,
    labs: 1,
  });
  res.status(201).json(credential);
});

// Verify credential (public)
app.get("/api/credentials/:id/verify", (req, res) => {
  const isValid = verifyCredential(req.params.id);
  res.json({
    credentialId: req.params.id,
    valid: isValid,
    verifiedAt: new Date().toISOString(),
    issuer: "secure T",
  });
});

// Instructors
app.get("/api/instructors", (_req, res) => {
  res.json({ instructors: instructors.map(i => ({ id: i.id, name: i.name, title: i.title, expertise: i.expertise, verified: i.verified })) });
});

app.get("/api/instructors/:id", (req, res) => {
  const instr = getInstructor(req.params.id);
  if (!instr) return res.status(404).json({ error: "Instructor not found" });
  res.json(instr);
});

app.get("/api/courses/:code/instructors", (req, res) => {
  const instrs = getInstructorsByCourse(req.params.code);
  res.json({ courseCode: req.params.code, instructors: instrs });
});

// Enrollment
app.get("/api/enrollments/:learnerId", async (req, res) => {
  if (isDbConnected()) {
    const rows = await enrollmentRepository.listByUser(req.params.learnerId);
    return res.json({ enrollments: rows, message: "Enrollment tracking: progress, hours, status", mode: "postgres" });
  }
  res.json({
    enrollments: sampleEnrollments,
    message: "Enrollment tracking: progress, hours, status",
  });
});

app.post("/api/enrollments", async (req, res) => {
  const { learnerId, courseCode } = req.body ?? {};
  if (!learnerId || !courseCode) {
    return res.status(400).json({ error: "learnerId and courseCode required" });
  }
  const course = getCourse(courseCode);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  if (isDbConnected()) {
    const enrollment = await enrollmentRepository.enroll(learnerId, course.code);
    return res.status(201).json({ ...enrollment, mode: "postgres" });
  }
  const enrollment = enrollLearner(learnerId, courseCode);
  res.status(201).json(enrollment);
});

app.put("/api/enrollments/:enrollmentId/progress", async (req, res) => {
  const { progress, hoursSpent } = req.body ?? {};
  if (typeof progress !== "number" || typeof hoursSpent !== "number") {
    return res.status(400).json({ error: "progress and hoursSpent required" });
  }
  if (isDbConnected()) {
    const updated = await progressRepository.update(req.params.enrollmentId, req.params.enrollmentId, true, hoursSpent);
    return res.json({ ...updated, mode: "postgres" });
  }
  const updated = updateEnrollmentProgress(
    { id: req.params.enrollmentId, learnerId: "demo", courseCode: "demo", enrolledAt: "", status: "in_progress", progress: 0, hoursSpent: 0, lastAccessedAt: "" },
    progress,
    hoursSpent
  );
  res.json(updated);
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