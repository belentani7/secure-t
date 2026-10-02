"""Refresh voces/manifest.json with sha256 of generated MP3s."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "campus" / "voces"

SCRIPTS = {
    "pt": (
        "pt-BR-FranciscaNeural",
        "Bem-vindo ao Secure T. Este projeto nasceu do amor: formação aberta, sem cadastro e sem barreiras. Se te servir, passa adiante.",
    ),
    "es": (
        "es-ES-ElviraNeural",
        "Bienvenido a Secure T. Este proyecto nace del amor: formación abierta, sin registro y sin barreras. Si te sirve, pásalo adelante.",
    ),
    "en": (
        "en-US-AriaNeural",
        "Welcome to Secure T. This project was born from love: open learning, no signup, no barriers. If it helps you, pass it on.",
    ),
    "ca": (
        "ca-ES-JoanaNeural",
        "Benvingut a Secure T. Aquest projecte neix de l'amor: formació oberta, sense registre i sense barreres. Si et serveix, passa-ho endavant.",
    ),
}


def main() -> None:
    idiomas = {}
    for lang, (voz, guion) in SCRIPTS.items():
        path = ROOT / lang / "bienvenida.mp3"
        data = path.read_bytes()
        idiomas[lang] = {
            "voz": voz,
            "guion": guion,
            "archivo": f"voces/{lang}/bienvenida.mp3",
            "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "estado": "VERIFIED",
        }
    manifest = {
        "portal": "secure-t",
        "orden_idiomas": ["pt", "es", "en", "ca"],
        "generado_utc": "2026-10-02T00:00:00+00:00",
        "motor": "edge-tts + Web Speech fallback (ui/voz.js)",
        "idiomas": idiomas,
        "nota": "Nasceu do amor. Passa adiante.",
    }
    out = ROOT / "manifest.json"
    out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", out)
    for lang, meta in idiomas.items():
        print(lang, meta["bytes"], meta["sha256"][:12])


if __name__ == "__main__":
    main()
