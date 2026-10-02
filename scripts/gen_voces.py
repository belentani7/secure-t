"""Generate welcome MP3s for secure-t campus voices (edge-tts)."""
from __future__ import annotations

import asyncio
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1] / "campus" / "voces"

JOBS = [
    ("pt", "pt-BR-FranciscaNeural",
     "Bem-vindo ao Secure T. Este projeto nasceu do amor: formação aberta, sem cadastro e sem barreiras. Se te servir, passa adiante."),
    ("es", "es-ES-ElviraNeural",
     "Bienvenido a Secure T. Este proyecto nace del amor: formación abierta, sin registro y sin barreras. Si te sirve, pásalo adelante."),
    ("en", "en-US-AriaNeural",
     "Welcome to Secure T. This project was born from love: open learning, no signup, no barriers. If it helps you, pass it on."),
    ("ca", "ca-ES-JoanaNeural",
     "Benvingut a Secure T. Aquest projecte neix de l'amor: formació oberta, sense registre i sense barreres. Si et serveix, passa-ho endavant."),
]


async def one(lang: str, voice: str, text: str) -> None:
    out_dir = ROOT / lang
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / "bienvenida.mp3"
    await edge_tts.Communicate(text, voice).save(str(path))
    print(f"OK {lang} {path.stat().st_size} bytes -> {path}")


async def main() -> None:
    for lang, voice, text in JOBS:
        await one(lang, voice, text)


if __name__ == "__main__":
    asyncio.run(main())
