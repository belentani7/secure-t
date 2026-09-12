from __future__ import annotations

import argparse
import json
from pathlib import Path

from .core import Orchestrator


def main() -> int:
    parser = argparse.ArgumentParser(description="Secure-T workflow orchestrator")
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--execute", action="store_true", help="ejecutar el plan; por defecto solo simula")
    args = parser.parse_args()
    result = Orchestrator(args.root).run(execute=args.execute)
    print(json.dumps(result.to_dict(), ensure_ascii=False, indent=2))
    return 0 if result.success else 1


if __name__ == "__main__":
    raise SystemExit(main())
