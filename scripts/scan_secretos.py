#!/usr/bin/env python3
"""Escáner de secretos sin dependencias (patrones estilo gitleaks).

Uso:
  python3 scripts/scan_secretos.py [ruta ...]      # sale con código 1 si encuentra algo
  python3 scripts/scan_secretos.py --todo ~/repos   # escanea cada subcarpeta como repo

Detecta API keys (OpenAI/DeepSeek/Anthropic/Groq/HF/Google/AWS/Stripe/GitHub/Slack/
Telegram/Resend/Replicate), claves privadas, URLs de BD con contraseña, JWT, y
ARTEFACTOS peligrosos: perfiles de navegador (Login Data, Cookies), .env, *.db.
Nunca imprime el secreto completo.
"""
import os, re, sys

PATRONES = {
    "OpenAI/DeepSeek key": r"\bsk-(?:proj-|ant-)?[A-Za-z0-9_\-]{20,}",
    "GitHub token": r"\b(?:ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}",
    "Google API key": r"\bAIza[0-9A-Za-z_\-]{35}",
    "AWS access key": r"\bAKIA[0-9A-Z]{16}\b",
    "Stripe live key": r"\b[sr]k_live_[0-9a-zA-Z]{20,}",
    "Slack token": r"xox[baprs]-[0-9A-Za-z\-]{10,}",
    "Groq key": r"\bgsk_[A-Za-z0-9]{40,}",
    "HuggingFace token": r"\bhf_[A-Za-z0-9]{30,}",
    "Replicate token": r"\br8_[A-Za-z0-9]{30,}",
    "Telegram bot token": r"\b\d{8,10}:AA[A-Za-z0-9_\-]{33}\b",
    "Clave privada": r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----\s*\n?[A-Za-z0-9+/]{40,}",
    "URL BD con contraseña": r"(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis)://[^\s:/'\"]+:[^\s@'\"]{6,}@[^\s'\"]+",
    "JWT": r"\beyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}",
}
RE = {k: re.compile(v) for k, v in PATRONES.items()}
# Falsos positivos típicos: ejemplos, tests, placeholders
BENIGNO = re.compile(r"(:password@|user:password|postgres:postgres|postgres:test|change-?me|example|your[_-]|"
                     r"xxxx|1234567890|abcdefgh|<|\$\{|placeholder|localhost|127\.0\.0\.1|dummy|fake)", re.I)
ARTEFACTOS = {"Login Data": "perfil de navegador (contraseñas guardadas)",
              "Cookies": "perfil de navegador (cookies de sesión)",
              "Local State": "perfil de navegador (clave de cifrado)",
              "id_rsa": "clave SSH privada", "id_ed25519": "clave SSH privada"}
SALTAR_DIR = {".git", "node_modules", "dist", ".next", ".venv", "venv", "__pycache__"}
SALTAR_EXT = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp3", ".mp4", ".wav", ".woff", ".woff2",
              ".ttf", ".pdf", ".zip", ".gz", ".wasm", ".ico", ".lock", ".min.js", ".map")
PROPIO = os.path.abspath(__file__)

def escanear(raiz):
    hallazgos = []
    for d, ds, fs in os.walk(raiz):
        ds[:] = [x for x in ds if x not in SALTAR_DIR]
        for f in fs:
            p = os.path.join(d, f); rel = os.path.relpath(p, raiz)
            if os.path.abspath(p) == PROPIO:
                continue
            if f in ARTEFACTOS:
                hallazgos.append((rel, "ARTEFACTO", ARTEFACTOS[f])); continue
            if f == ".env" or (f.startswith(".env.") and not f.endswith((".example", ".sample", ".template"))):
                hallazgos.append((rel, "ARTEFACTO", "archivo .env subido")); continue
            if f.endswith((".db", ".sqlite", ".sqlite3")):
                hallazgos.append((rel, "ARTEFACTO", "base de datos subida (revisar datos personales)")); continue
            if f.lower().endswith(SALTAR_EXT):
                continue
            try:
                if os.path.getsize(p) > 3_000_000:
                    continue
                texto = open(p, encoding="utf-8", errors="ignore").read()
            except OSError:
                continue
            for nombre, rx in RE.items():
                for m in rx.finditer(texto):
                    s = m.group(0)
                    if BENIGNO.search(s) or "/tests/" in "/" + rel.replace("\\", "/"):
                        continue
                    linea = texto.count("\n", 0, m.start()) + 1
                    hallazgos.append((f"{rel}:{linea}", nombre, s[:8] + "…" + s[-4:]))
    return hallazgos

def main(argv):
    if argv and argv[0] == "--todo":
        base = argv[1] if len(argv) > 1 else "."
        rutas = [os.path.join(base, x) for x in sorted(os.listdir(base)) if os.path.isdir(os.path.join(base, x))]
    else:
        rutas = argv or ["."]
    total = 0
    for r in rutas:
        hs = escanear(r)
        vistos = set()
        for h in hs:
            if h in vistos:
                continue
            vistos.add(h); total += 1
            print(f"[{os.path.basename(os.path.abspath(r))}] {h[0]}  ·  {h[1]}  ·  {h[2]}")
    print(f"\n{total} hallazgo(s).")
    return 1 if total else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
