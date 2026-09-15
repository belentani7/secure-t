// Cabeceras OWASP + rate-limit en memoria (spec élite adaptado sin Redis).
// Upstash/Redis solo cuando haya caso medido (ARCHITECTURE.md). Hoy: Map con ventana deslizante.
import type { NextFunction, Request, Response } from "express";

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'",
  );
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  return next();
}

const hits = new Map<string, number[]>();
let lastSweep = 0;
export function rateLimit(prefix: string, n = 30, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    // Barrido periódico: evita crecimiento sin límite del Map (fuga de memoria).
    if (now - lastSweep > windowMs) {
      const stale: string[] = [];
      hits.forEach((v, k) => {
        const live = v.filter((t: number) => now - t < windowMs);
        if (live.length) hits.set(k, live);
        else stale.push(k);
      });
      stale.forEach((k) => hits.delete(k));
      lastSweep = now;
    }
    const key = prefix + ":" + (req.ip ?? "unknown");
    const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    arr.push(now);
    hits.set(key, arr);
    if (arr.length > n) return res.status(429).json({ error: "rate_limited", retry_after_s: Math.ceil(windowMs / 1000) });
    return next();
  };
}
