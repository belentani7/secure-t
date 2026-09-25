# Ciberseguridad Defensiva: Operar como SOC — material de repaso

# Chuleta — Ciberseguridad Defensiva

## Clasificar un control (siempre lo mismo)
- ¿Qué protects? → C / I / D
- ¿Cuándo acts? → preventivo / detectivo / correctivo

## Logs mínimos (checklist)
- [ ] Authentication (success AND failure)
- [ ] Privilege changes
- [ ] Firewall/inbound connections
- [ ] Application errors
- [ ] Synchronized hour (NTP) — without it there is no correlation
- [ ] Defined retention (and legal justification)

## NIST 800-61 lifecycle
1 Preparación → 2 Detección y análisis → 3 Contención → 4 Erradicación →
5 Recuperación → 6 Lecciones aprendidas ← (the one always forgotten)

## Ransomware in 4 moves (game of the course)
1. ISOLATE machines (unplug network, do not power off) → 2. PRESERVE evidence (memory, logs)
3. NOTIFY (internal + authority if applicable) → 4. RESTORE from tested backup (never pay)

## Hardening in 60 seconds (CIS level 1)
- [ ] Unnecessary services OFF
- [ ] SSH: no root, no password (key)
- [ ] MFA on all critical accounts
- [ ] Automatic updates
- [ ] Open ports: only the essential ones
- [ ] Tested backup (restore every quarter)

*Generado por edu-forge academy. Imprímela: es lo que llevas al examen.*
