#!/usr/bin/env python3
"""Inventario y organización segura del ecosistema local/GitHub.

No mueve, borra ni publica archivos. Genera un manifiesto reproducible y un
informe final para que cualquier reorganización posterior sea explícita.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

SKIP = {".git", "node_modules", ".venv", "venv", "dist", "build", "__pycache__", ".cache"}
PROJECT_MARKERS = {"package.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "go.mod", "Dockerfile", "README.md"}


def run(command: list[str], cwd: Path | None = None) -> tuple[int, str]:
    try:
        p = subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=False)
        return p.returncode, (p.stdout + p.stderr).strip()
    except OSError as exc:
        return 127, str(exc)


def local_inventory(root: Path, max_depth: int) -> list[dict]:
    projects: list[dict] = []
    if not root.exists():
        return projects
    for current, dirs, files in os.walk(root):
        current_path = Path(current)
        rel = current_path.relative_to(root)
        if len(rel.parts) >= max_depth:
            dirs[:] = []
        dirs[:] = [d for d in dirs if d not in SKIP and not d.startswith(".")]
        file_set = set(files)
        markers = sorted(file_set & PROJECT_MARKERS)
        if markers or ".git" in dirs or (current_path / ".git").exists():
            projects.append({
                "path": str(current_path),
                "relative_path": str(rel) if str(rel) != "." else ".",
                "markers": markers,
                "python_files": sum(1 for f in files if f.endswith(".py")),
                "typescript_files": sum(1 for f in files if f.endswith((".ts", ".tsx"))),
            })
    return sorted(projects, key=lambda x: x["relative_path"])


def github_inventory(owner: str) -> dict:
    code, raw = run(["gh", "repo", "list", owner, "--limit", "200", "--json", "name,nameWithOwner,isPrivate,isArchived,defaultBranchRef,updatedAt,description,url"])
    if code != 0:
        return {"owner": owner, "available": False, "error": raw, "repositories": []}
    try:
        clean = re.sub(r"\x1b\[[0-9;]*[A-Za-z]", "", raw)
        payload = clean[clean.find("["):clean.rfind("]") + 1]
        repos = json.loads(payload)
    except json.JSONDecodeError:
        return {"owner": owner, "available": False, "error": f"gh devolvió JSON inválido: {raw[-500:]}", "repositories": []}
    active = [r for r in repos if not r.get("isArchived")]
    archived = [r for r in repos if r.get("isArchived")]
    return {"owner": owner, "available": True, "total": len(repos), "active": len(active), "archived": len(archived), "repositories": repos}


def classify(project: dict) -> str:
    markers = set(project["markers"])
    if "pyproject.toml" in markers or "requirements.txt" in markers:
        return "python"
    if "package.json" in markers:
        return "javascript-typescript"
    if "Dockerfile" in markers:
        return "container"
    return "other"


def main() -> int:
    parser = argparse.ArgumentParser(description="Inventario seguro del ecosistema local y GitHub")
    parser.add_argument("--local-root", type=Path, default=Path.home())
    parser.add_argument("--github-owner", default="belentani7")
    parser.add_argument("--output", type=Path, default=Path("ecosystem_final_report.json"))
    parser.add_argument("--max-depth", type=int, default=3)
    args = parser.parse_args()

    local = local_inventory(args.local_root.expanduser().resolve(), args.max_depth)
    for project in local:
        project["category"] = classify(project)
    github = github_inventory(args.github_owner)
    result = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "scope": {"local_root": str(args.local_root.expanduser().resolve()), "github_owner": args.github_owner, "destructive_actions": False},
        "summary": {
            "local_projects": len(local),
            "local_categories": dict(Counter(p["category"] for p in local)),
            "github_repositories": github.get("total", 0),
            "github_active": github.get("active", 0),
            "github_archived": github.get("archived", 0),
        },
        "local_projects": local,
        "github": github,
        "next_actions": [
            "Consolidar proyectos duplicados solo después de revisión humana.",
            "Asignar cada repositorio a activo, mantenimiento, archivo o candidato a consolidación.",
            "No borrar ni mover datos sin una orden explícita y un backup verificable.",
        ],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result["summary"], ensure_ascii=False, indent=2))
    print(f"Informe: {args.output.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
