#!/usr/bin/env bash
# FASE 4 — Consolidar: archivar duplicados (P2 del inventario). Archivar es REVERSIBLE
# (Settings → Unarchive) y conserva todo; solo marca el repo como solo-lectura.
# Revisa inventario-repos.csv primero. Simulación por defecto; APLICAR=1 para archivar.
set -euo pipefail
OWNER="${OWNER:-belentani7}"; APLICAR="${APLICAR:-0}"
HERE="$(cd "$(dirname "$0")" && pwd)"
python3 - "$HERE/inventario-repos.csv" <<'PY' > /tmp/archivar.txt
import csv,sys
for r in csv.DictReader(open(sys.argv[1],encoding='utf-8')):
    if r['prioridad']=='P2': print(r['repo'])
PY
while read -r r; do
  [ -z "$r" ] && continue
  if [ "$APLICAR" = "1" ]; then gh repo archive "$OWNER/$r" --yes && echo "🗄️  $r archivado"
  else echo "[sim] archivaría $r"; fi
done < /tmp/archivar.txt
