"use client";

import { useEffect } from "react";

/**
 * Registra el service worker que hace el campus utilizable sin conexión.
 * En desarrollo se omite para no servir versiones cacheadas mientras se edita.
 */
export function OfflineRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const register = () => {
      void navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).catch(() => undefined);
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
