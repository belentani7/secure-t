# Semana 4: Laboratorio final: máquina vulnerable + informe

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 4 de 20

## Objetivos de aprendizaje

- Ejecutar un pentest completo de recon a reporte sobre una máquina vulnerable
- Usar nmap, nikto y herramientas de explotación en entorno local autorizado
- Puntuar hallazgos con CVSS 3.1 y mapearlos a ATT&CK
- Escribir un informe con resumen ejecutivo y detalle técnico reproducible

## El laboratorio: máquina vulnerable en red local

Para la práctica final usamos máquinas deliberadamente vulnerables en red local aislada. Nunca sobre internet, nunca contra terceros.

**Opciones de laboratorio (todas gratuitas):**
- **Metasploitable 2:** VM clásica con servicios vulnerables (FTP, SSH, Samba, Apache, MySQL). Descarga: sourceforge.net/projects/metasploitable
- **VulnHub:** cientos de VMs descargables por dificultad (vulnhub.com)
- **HackTheBox (Starting Point):** máquinas guiadas online con VPN
- **TryHackMe:** laboratorios guiados con teoría integrada

**Configuración segura del lab:**
```bash
# Red host-only en VirtualBox (aislada de internet)
# 1. VirtualBox → File → Host Network Manager → Create
# 2. VM atacante (Kali): Adapter 1 → Host-only
# 3. VM objetivo (Metasploitable): Adapter 1 → Host-only
# 4. Verificar: desde Kali, ping a Metasploitable → OK
#    desde Metasploitable, ping a 8.8.8.8 → DEBE fallar
```

La red host-only garantiza que el tráfico de explotación nunca sale a internet. Es un control de seguridad, no una conveniencia.

**Referencias:**
- Metasploitable — sourceforge.net/projects/metasploitable
- VulnHub — vulnhub.com
- HackTheBox — hackthebox.com
- TryHackMe — tryhackme.com

## De recon a explotación: flujo completo con herramientas

**Paso 1 — Descubrimiento de hosts:**
```bash
nmap -sn 192.168.56.0/24    # ping sweep: qué hosts hay en la red
```

**Paso 2 — Escaneo de puertos y servicios:**
```bash
nmap -sV -sC -p- 192.168.56.101 -oN scan.txt
# -sV: versión de servicios
# -sC: scripts por defecto (NSE)
# -p-: todos los 65535 puertos
# -oN: guardar output (evidencia)
```

**Paso 3 — Identificación de vulnerabilidades:**
```bash
# Web: escaneo con nikto
nikto -h http://192.168.56.101 -output nikto.txt
# Buscar CVEs por versión: searchsploit apache 2.2
searchsploit apache 2.2.8
```

**Paso 4 — Explotación controlada:**
Cada explotación debe ser: (a) autorizada, (b) documentada paso a paso, (c) con captura de evidencia (screenshot + output). El objetivo es demostrar el impacto, no causar daño.

**Paso 5 — Post-explotación:**
¿Qué puede hacer un atacante una vez dentro?
- Leer `/etc/shadow` → credenciales
- Escalar privilegios (kernel exploits, SUID binaries)
- Pivotar a otros hosts de la red interna
ATT&CK: T1003 (OS Credential Dumping), T1068 (Exploitation for Privilege Escalation), T1021 (Remote Services para lateral movement)

**Referencias:**
- Nmap — nmap.org
- Nikto — github.com/sullo/nikto
- SearchSploit — exploit-db.com/searchsploit
- T1003 — OS Credential Dumping
- T1068 — Exploitation for Privilege Escalation

## El informe: el producto real del pentester

El informe ético tiene dos audiencias: dirección (resumen ejecutivo) y equipo técnico (detalle reproducible). Sin un buen informe, todo el trabajo técnico no sirve.

**Estructura del informe:**

**1. Portada:** cliente, equipo, fecha, clasificación (CONFIDENCIAL)

**2. Resumen ejecutivo (1-2 páginas):**
- Alcance y objetivos del test
- Resumen de hallazgos por severidad (tabla: Critical/High/Medium/Low)
- Conclusión: postura de seguridad y recomendaciones prioritarias
- Redactado para quien NO es técnico

**3. Detalle técnico (por hallazgo):**
```
ID:          VULN-001
TÍTULO:      SQL Injection en endpoint de login
SEVERIDAD:   Critical (CVSS 9.8)
CVSS Vector: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
CWE:         CWE-89
ATT&CK:      T1190
DESCRIPCIÓN: El parámetro 'email' del endpoint POST /rest/user/login
             no sanitiza input, permitiendo inyección SQL.
REPRODUCCIÓN:
  1. POST /rest/user/login
  2. Body: {"email": "' OR 1=1--", "password": "x"}
  3. Respuesta: 200 OK con token de sesión admin
EVIDENCIA:   [captura adjunta]
IMPACTO:     Bypass completo de autenticación; acceso a todos los datos
REMEDIACIÓN: Usar ORM con prepared statements; validar formato email
```

**4. Apéndices:** configuración del lab, herramientas usadas, log de tiempos, lista de puertos/servicios encontrados.

**CVSS 3.1 — cómo puntuar:**
8 métricas: Attack Vector, Complexity, Privileges Required, User Interaction, Scope, Confidentiality/Integrity/Availability Impact. Usa la calculadora oficial de FIRST (first.org/cvss/calculator/3.1).

**Referencias:**
- CVSS 3.1 — first.org/cvss/
- PTES Reporting — pentest-standard.org
- OWASP Reporting Guidelines

## Caso real: SolarWinds 2020: la post-explotación más sofisticada documentada

El grupo UNC2452 (atribuido a SVR ruso) comprometió el pipeline de build de SolarWinds Orion (ATT&CK: T1195.002 — Supply Chain: Software Supply Chain). El backdoor SUNBURST se distribuyó como actualización legítima a 18.000 organizaciones. Post-explotación: movimiento lateral con tokens SAML forjados (T1606.002), persistencia con tareas programadas (T1053.005). Lección para el informe: la post-explotación define el impacto real — sin ella, un hallazgo parece menor de lo que es.

## Ejercicio guiado: Pentest completo de Metasploitable 2 con informe

1. Configura el lab: Kali + Metasploitable 2 en red host-only
2. Ejecuta ping sweep: nmap -sn 192.168.56.0/24
3. Escanea la máquina: nmap -sV -sC -p- [IP] -oN scan.txt
4. Identifica al menos 5 servicios vulnerables en el output
5. Elige 2 vectores y explótalos (documenta cada paso con capturas)
6. Intenta escalada de privilegios en al menos 1 vector
7. Puntúa cada hallazgo con CVSS 3.1 (usa la calculadora de FIRST)
8. Escribe el informe completo: ejecutivo + técnico + apéndices

## Recursos abiertos

- [Metasploitable 2](https://sourceforge.net/projects/metasploitable/)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)
- [VulnHub](https://www.vulnhub.com/)
- [Nmap Reference Guide](https://nmap.org/book/man.html)

---
[Volver al syllabus](../syllabus.md)
