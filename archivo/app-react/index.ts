import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
app.use(express.json({ limit: "64kb" }));

const catalog = {
  program: { title: "Bachelor of Cybersecurity", credits: 120, duration: "4 years", standard: "secure T academic framework" },
  courses: [
    { code: "CY-101", title: "Fundamentos de Ciberseguridad", credits: 3, term: "Year 1 · Fall", status: "active" },
    { code: "CS-110", title: "Programación para Defensa", credits: 4, term: "Year 1 · Fall", status: "active" },
    { code: "NET-201", title: "Redes y Protocolos", credits: 4, term: "Year 1 · Spring", status: "next" },
    { code: "CY-350", title: "Network Security", credits: 3, term: "Year 3 · Fall", status: "planned" },
    { code: "CY-460", title: "SOC Operations", credits: 3, term: "Year 4 · Fall", status: "planned" },
    { code: "CY-494", title: "Senior Capstone", credits: 4, term: "Year 4 · Spring", status: "planned" },
  ],
};

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "secure-t", version: "0.2.0", capabilities: ["catalog", "progress", "ai-tutor"] }));
app.get("/api/catalog", (_req, res) => res.json(catalog));
app.get("/api/progress", (_req, res) => res.json({ learnerId: "demo-learner", creditsCompleted: 21, currentTerm: "Year 1 · Fall", completion: 72, streakDays: 4 }));

app.post("/api/tutor", async (req, res) => {
  const { message, context = "cybersecurity" } = req.body ?? {};
  if (typeof message !== "string" || !message.trim()) return res.status(400).json({ error: "message is required" });
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

const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
app.use(express.static(staticPath));
app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`secure T server running on http://localhost:${port}/`));
