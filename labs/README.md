# Labs Secure-T — APRENDE. PROTEGE. TRANSFORMA.

Todo open AGPLv3 + upstream MIT/BSD/GPL respetado.
Marca: dark `#070D18`, cyan `#38E1FF`, lime `#A8FF3E`, Space Grotesk + DM Sans + DM Mono. Ver `../open-school/shared/BELENTANI-DESIGN-SYSTEM.md`.
Voz ES/PT/EN directa, sin humo. Cada lab abre con Objetivo + Señal de alarma + Cómo reportar.

## Levantar
```bash
docker compose -f ../docker-compose.yml -f labs/docker-compose.labs.yml up -d
# Juice: http://localhost:3001
# DVWA: http://localhost:3002
```

## Fuentes literales
- Juice Shop MIT: `bkimminich/juice-shop`
- DVWA GPL: `vulnerables/web-dvwa` (aislado, no mezclar en core)
- Atomic Red Team MIT: scripts en `labs/atomic/`
- DetectionLab MIT: reglas en `labs/detection/`
- FCC InfoSec BSD: teoría en `academic/`

## Game-loop (clean-room HTB/SANS)
Puntos 250 + bonus velocidad/accuracy/first-blood, scoreboard real-time. Implementación propia en `server/`, sin código HTB.
