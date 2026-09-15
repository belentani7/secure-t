# Labs Secure-T — APRENDE. PROTEGE. TRANSFORMA.

Todo open AGPLv3 + upstream MIT/BSD/GPL respetado.
Marca: dark `#070D18`, cyan `#38E1FF`, lime `#A8FF3E`, Space Grotesk + DM Sans + DM Mono. Ver `../open-school/shared/BELENTANI-DESIGN-SYSTEM.md`.
Voz ES/PT/EN directa, sin humo. Cada lab abre con Objetivo + Señal de alarma + Cómo reportar.

## Levantar
```bash
docker compose -f ../docker-compose.yml -f labs/docker-compose.labs.yml up -d
# Juice: http://127.0.0.1:3001  (solo local; no expuesto a la red)
# DVWA:  http://127.0.0.1:3002  (solo local; no expuesto a la red)
```
> Nota de seguridad: los labs se publican únicamente en `127.0.0.1` para no exponer aplicaciones
> deliberadamente vulnerables a la red. El aislamiento por contenedor/red y el pin de imágenes
> por digest son trabajo pendiente (ver `docs/LAB_ARCHITECTURE.md`).

## Fuentes literales
- Juice Shop MIT: `bkimminich/juice-shop`
- DVWA GPL: `vulnerables/web-dvwa` (solo binding local `127.0.0.1`; aislamiento de red real pendiente)
- Atomic Red Team MIT: scripts en `labs/atomic/`
- DetectionLab MIT: reglas en `labs/detection/`
- FCC InfoSec BSD: teoría en `academic/`

## Game-loop (clean-room HTB/SANS)
Puntos 250 + bonus velocidad/accuracy/first-blood, scoreboard real-time. Implementación propia en `server/`, sin código HTB.
