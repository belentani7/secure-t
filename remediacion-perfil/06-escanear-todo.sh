#!/usr/bin/env bash
# Re-auditoría periódica: clona (superficial) todos tus repos y escanea secretos/artefactos.
set -euo pipefail
OWNER="${OWNER:-belentani7}"; WORK="${WORK:-$HOME/auditoria-repos}"
HERE="$(cd "$(dirname "$0")" && pwd)"; mkdir -p "$WORK"; cd "$WORK"
gh repo list "$OWNER" --limit 1000 --json name -q '.[].name' | \
  xargs -P 8 -I{} sh -c '[ -d {} ] && git -C {} pull -q --depth 1 || git clone -q --depth 1 https://github.com/'"$OWNER"'/{}.git {}'
python3 "$HERE/../scripts/scan_secretos.py" --todo "$WORK"
