# Ciberseguridad Ofensiva: Pensar como Atacante — material de repaso

# Chuleta — Ciberseguridad Ofensiva

## Regla 0 (antes que cualquier comando)
- ¿Permiso escrito? ¿Alcance firmado? ¿Ventana horaria? → si falta algo: NO.

## Recon pasivo (no toca al objetivo)
- `crt.sh/?q=dominio` — subdomains via certificates
- `site:dominio filetype:pdf` / `inurl:admin` — Google dorks
- Wayback Machine — deleted versions
- DNS: `nslookup`, `dig any dominio`

## Recon activo suave (autorizado)
- `nmap -sn 192.168.1.0/24` — host discovery
- `nmap -sV -p- --min-rate 1000 <ip>` — services (with permission)
- `whatweb <url>` — visible technologies

## OWASP Top 10 (memory hook)
1 Inyección · 2 Auth rota · 3 Datos sensibles · 4 XXE · 5 Control de acceso
· 6 Mal configuración · 7 XSS · 8 Deserialización · 9 Componentes obsoletos · 10 Logging insuficiente

## Informe (lo que se evalúa)
1. Hallazgo (qué) · 2. Severidad CVSS (cuánto) · 3. Reproducción paso a paso (cómo)
4. Evidencia (captura) · 5. Remediación (qué hacer)

## Números que importan
- CVSS: 0.1–3.9 bajo · 4.0–6.9 medio · 7.0–8.9 alto · 9.0–10 crítico

*Generado por edu-forge academy. Imprímela: es lo que llevas al examen.*
