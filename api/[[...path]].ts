import { app } from "../server/index.js";

// Catch-all serverless (Vercel): una sola función sirve TODO /api/*.
// Vercel solo invoca funciones del filesystem: api/index.ts mapea a /api y
// nunca recibe /api/health (por eso caía al rewrite → SPA HTML). El patrón
// opcional catch-all [[...path]] captura /api y /api/<cualquier-cosa>.
// La app Express ya es un handler (req, res); no usar createRequestHandler
// (no existe en Express 4) y no listen() en serverless.
export default app;
