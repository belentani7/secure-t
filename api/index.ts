import { app } from "../server/index.js";

// Adaptador serverless (Vercel): la app Express ya es un handler (req, res).
// No importar createRequestHandler de "express" (no existe en Express 4).
export default app;
