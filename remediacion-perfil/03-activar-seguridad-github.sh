#!/usr/bin/env bash
# FASE 2 — Blindaje preventivo en TODOS tus repos (públicos y privados).
# Activa: Secret scanning + Push protection (bloquea el push si lleva una key),
#         Dependabot alerts + actualizaciones automáticas de seguridad.
# Simulación por defecto; APLICAR=1 para ejecutar.
set -uo pipefail
OWNER="${OWNER:-belentani7}"; APLICAR="${APLICAR:-0}"
mapfile -t REPOS < <(gh repo list "$OWNER" --limit 1000 --no-archived --json name -q '.[].name')
echo "${#REPOS[@]} repos"
ok=0; fallo=0
for r in "${REPOS[@]}"; do
  if [ "$APLICAR" != "1" ]; then echo "[sim] $r"; continue; fi
  gh api -X PATCH "repos/$OWNER/$r" --silent \
    -F 'security_and_analysis[secret_scanning][status]=enabled' \
    -F 'security_and_analysis[secret_scanning_push_protection][status]=enabled' 2>/dev/null \
    || echo "  ! $r: secret scanning no disponible (en privados requiere GitHub Advanced Security)"
  gh api -X PUT "repos/$OWNER/$r/vulnerability-alerts" --silent 2>/dev/null && \
  gh api -X PUT "repos/$OWNER/$r/automated-security-fixes" --silent 2>/dev/null && ok=$((ok+1)) || fallo=$((fallo+1))
  echo "✔ $r"
done
echo "Listo: $ok con Dependabot · $fallo con avisos"
