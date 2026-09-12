"""Deterministic workflow orchestrator for Secure-T.

The default is dry-run. Real execution is opt-in and limited to known local
commands, so a repository checkout cannot execute arbitrary prompt content.
"""
from __future__ import annotations

import hashlib
import json
import subprocess
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


@dataclass(frozen=True)
class Step:
    name: str
    command: tuple[str, ...]
    reason: str


@dataclass(frozen=True)
class RunResult:
    run_id: str
    changed: bool
    plan: tuple[Step, ...]
    executed: bool
    repaired: bool
    success: bool
    outputs: tuple[str, ...]

    def to_dict(self) -> dict:
        return {
            "run_id": self.run_id,
            "changed": self.changed,
            "plan": [asdict(step) for step in self.plan],
            "executed": self.executed,
            "repaired": self.repaired,
            "success": self.success,
            "outputs": list(self.outputs),
        }


class Orchestrator:
    """Plan and optionally run the smallest useful Secure-T validation flow."""

    def __init__(self, root: Path, state_file: Path | None = None):
        self.root = root.resolve()
        self.state_file = state_file or self.root / ".orchestrator-state.json"
        self.audit_file = self.root / "audit" / "orchestrator-runs.jsonl"

    def fingerprint(self) -> str:
        digest = hashlib.sha256()
        for path in self._tracked_files():
            digest.update(str(path.relative_to(self.root)).encode())
            digest.update(path.read_bytes())
        return digest.hexdigest()

    def detect_changes(self) -> bool:
        current = self.fingerprint()
        if not self.state_file.exists():
            return True
        try:
            return json.loads(self.state_file.read_text()).get("fingerprint") != current
        except (OSError, ValueError):
            return True

    def plan(self) -> tuple[Step, ...]:
        steps: list[Step] = []
        if (self.root / "package.json").exists():
            steps.extend([
                Step("typecheck", ("pnpm", "check"), "validar TypeScript"),
                Step("tests", ("pnpm", "test"), "ejecutar pruebas del proyecto"),
            ])
        if (self.root / "factory" / "pyproject.toml").exists():
            steps.append(Step(
                "python-mass-validation",
                ("python", "-m", "compileall", "-q", "factory", "orchestrator", "scripts", "tests", "education"),
                "compilar masivamente los módulos Python del repositorio",
            ))
            steps.append(Step(
                "python-tests",
                ("python", "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"),
                "ejecutar las pruebas Python descubiertas",
            ))
        if (self.root / "scripts" / "audit-pii.mjs").exists():
            steps.append(Step("pii-audit", ("node", "scripts/audit-pii.mjs"), "auditar secretos y PII en código"))
        return tuple(steps)

    def run(self, execute: bool = False, repair: bool = False) -> RunResult:
        changed = self.detect_changes()
        plan = self.plan() if changed else tuple()
        outputs: list[str] = []
        success = True
        executed = bool(execute and changed)
        repaired = False
        if executed:
            if repair and (self.root / "package.json").exists() and not (self.root / "node_modules").exists():
                install = subprocess.run(
                    ("pnpm", "install", "--frozen-lockfile"),
                    cwd=self.root,
                    text=True,
                    capture_output=True,
                    check=False,
                )
                outputs.append(f"[repair-dependencies] exit={install.returncode}\n{(install.stdout + install.stderr)[-4000:]}")
                repaired = install.returncode == 0
                if not repaired:
                    success = False
            for step in plan:
                if not success:
                    break
                completed = subprocess.run(
                    step.command,
                    cwd=self.root,
                    text=True,
                    capture_output=True,
                    check=False,
                )
                output = (completed.stdout + completed.stderr).strip()
                outputs.append(f"[{step.name}] exit={completed.returncode}\n{output[-4000:]}")
                if completed.returncode != 0:
                    success = False
                    break
            if success:
                self.state_file.write_text(json.dumps({"fingerprint": self.fingerprint()}, indent=2) + "\n")
        result = RunResult(
            run_id=datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ"),
            changed=changed,
            plan=plan,
            executed=executed,
            repaired=repaired,
            success=success,
            outputs=tuple(outputs),
        )
        self.audit_file.parent.mkdir(parents=True, exist_ok=True)
        with self.audit_file.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(result.to_dict(), ensure_ascii=False) + "\n")
        return result

    def _tracked_files(self) -> Iterable[Path]:
        ignored = {".git", "node_modules", "dist", ".orchestrator-state.json"}
        for path in sorted(self.root.rglob("*")):
            if not path.is_file() or any(part in ignored for part in path.parts):
                continue
            if path.name.endswith((".lock", ".log")):
                continue
            yield path
