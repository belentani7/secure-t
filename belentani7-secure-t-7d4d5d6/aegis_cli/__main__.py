from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass(frozen=True)
class Finding:
    rule: str
    severity: str
    path: str
    message: str


def scan(root: Path) -> list[Finding]:
    findings: list[Finding] = []
    ignored = {".git", "node_modules", ".venv", "venv", "dist", "build", "__pycache__"}
    for path in sorted(root.rglob("*")):
        if not path.is_file() or any(part in ignored for part in path.parts):
            continue
        if path.name in {".env", ".env.local"}:
            findings.append(Finding("secret-file", "high", str(path.relative_to(root)), "Environment secret file found"))
        if path.suffix in {".pem", ".key"}:
            findings.append(Finding("private-key-file", "critical", str(path.relative_to(root)), "Private-key extension found"))
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(prog="aegis")
    sub = parser.add_subparsers(dest="command", required=True)
    scan_parser = sub.add_parser("scan")
    scan_parser.add_argument("path", type=Path)
    scan_parser.add_argument("--format", choices=("json", "markdown"), default="json")
    args = parser.parse_args()
    findings = scan(args.path.resolve())
    if args.format == "json":
        print(json.dumps([asdict(item) for item in findings], ensure_ascii=False, indent=2))
    else:
        print("# Aegis report\n")
        for item in findings:
            print(f"- **{item.severity}** `{item.rule}` — `{item.path}`: {item.message}")
    return 1 if any(item.severity in {"high", "critical"} for item in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
