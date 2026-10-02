"""Mirror campus/ui/landing assets into public/ for Netlify."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"


def mirror(src: Path, dst: Path) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def main() -> None:
    PUB.mkdir(exist_ok=True)
    mirror(ROOT / "campus", PUB / "campus")
    (PUB / "ui").mkdir(exist_ok=True)
    for name in ("voz.js", "i18n.js", "biblia.js"):
        shutil.copy2(ROOT / "ui" / name, PUB / "ui" / name)
    (PUB / "conceptos").mkdir(exist_ok=True)
    shutil.copy2(ROOT / "conceptos" / "index.html", PUB / "conceptos" / "index.html")
    shutil.copy2(ROOT / "conceptos" / "conceptos.json", PUB / "conceptos" / "conceptos.json")
    shutil.copy2(ROOT / "index.html", PUB / "index.html")
    shutil.copy2(ROOT / "llms.txt", PUB / "llms.txt")
    mp3s = list((PUB / "campus" / "voces").rglob("*.mp3"))
    print("PUBLIC_SYNC_OK", "mp3s", len(mp3s))
    for p in mp3s:
        print(p.relative_to(PUB), p.stat().st_size)


if __name__ == "__main__":
    main()
