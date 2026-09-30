#!/usr/bin/env bash
# FASE 3 — Higiene: .gitignore común + dejar de versionar artefactos, vía PULL REQUEST
# (no toca main directamente). Simulación por defecto; APLICAR=1 para abrir los PRs.
set -euo pipefail
OWNER="${OWNER:-belentani7}"; APLICAR="${APLICAR:-0}"
HERE="$(cd "$(dirname "$0")" && pwd)"; WORK="${WORK:-$HOME/higiene-repos}"; mkdir -p "$WORK"
RAMA="chore/higiene-seguridad"
REPOS=(belentani-design-system belentani-ops michelle-relayze-web          # sin .gitignore
       belentani-omega-template duck-2000-2                                 # node_modules
       belentani-github-catalogo-minimalista belentani7.github.io           # dist/build
       DUCK-A-GEMA-1-LAB duck-apps duck-apps-web duck-unified-master skillforge  # __pycache__
       DUCK-ZION-PREMIUM duck-studio-os-v2 duck-docs duck-lab ManosAbiertas aprende-brasil)  # *.db
for r in "${REPOS[@]}"; do
  echo "════ $r"
  [ "$APLICAR" = "1" ] || { echo "(sim)"; continue; }
  d="$WORK/$r"; rm -rf "$d"; gh repo clone "$OWNER/$r" "$d" -- --quiet --depth 1
  cd "$d"; git checkout -q -b "$RAMA"
  # fusiona el .gitignore común sin duplicar líneas
  touch .gitignore; cat "$HERE/gitignore-comun" .gitignore | awk '!seen[$0]++' > .gi.tmp && mv .gi.tmp .gitignore
  git rm -r -q --cached --ignore-unmatch node_modules dist build .next '**/__pycache__' '*.db' '*.sqlite' .duck-qa '**/win-unpacked' 2>/dev/null || true
  git add .gitignore
  if git diff --cached --quiet; then echo "nada que cambiar"; cd - >/dev/null; continue; fi
  git commit -q -m "chore(seguridad): .gitignore común y dejar de versionar artefactos/BD"
  git push -q -u origin "$RAMA"
  gh pr create --title "Higiene de seguridad: .gitignore y artefactos" \
    --body "Generado por remediacion-perfil/04-higiene-repos.sh (auditoría 2026-09-30). Los ficheros quedan en tu disco; solo dejan de versionarse. Para borrarlos también del historial usa 02-limpiar-historial.sh." >/dev/null
  echo "✔ PR abierto"; cd - >/dev/null
done
