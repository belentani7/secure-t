#!/usr/bin/env bash
# FASE 0 — Emergencia (minutos). Ejecuta en TU máquina con `gh` autenticado.
# Pone en privado los repos con credenciales expuestas. Reversible.
set -euo pipefail
OWNER="${OWNER:-belentani7}"
CRITICOS=(duck-2000-2 judas-experience-web)

for r in "${CRITICOS[@]}"; do
  echo "→ Poniendo $OWNER/$r en PRIVADO"
  gh repo edit "$OWNER/$r" --visibility private --accept-visibility-change-consequences
done

cat <<'TXT'

✅ Repos críticos ocultos. AHORA, a mano (nadie puede hacerlo por ti):

  1. DeepSeek → https://platform.deepseek.com/api_keys → REVOCA las 3 keys
     (sk-e2d8…a2a3 de secure-t, sk-67ae…9f26 y sk-e515…5f41 de judas-experience-web).
  2. Cambia la contraseña + activa 2FA, en este orden:
       Google · GitHub · AWS · Openbank · Seguridad Social (Cl@ve) · Proton Mail/VPN
       Microsoft · Alibaba Cloud · Amazon · DonDominio · Zurich · Facebook · IKEA
       Deudanet · Lista Robinson · Disney+ · Loudly · router 192.168.1.1
  3. AWS: IAM → revisa access keys y usuarios desconocidos; Billing → gasto anómalo;
     CloudTrail → inicios de sesión de las últimas semanas.
  4. GitHub → Settings → Sessions / SSH keys / Personal access tokens / OAuth apps:
     revoca todo lo que no reconozcas.
  5. En Edge (Windows): Configuración → Perfiles → Contraseñas → elimina las guardadas
     que ya hayas cambiado, y usa un gestor (Bitwarden / Proton Pass).
TXT
