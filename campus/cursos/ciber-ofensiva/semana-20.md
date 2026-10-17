# Semana 20: Capstone: Pentest completo end-to-end

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 20 de 20

## Objetivo de la semana
Ejecutar un pentest completo end-to-end sobre un entorno simulado, integrando todas las fases del ciclo de vida de un test de intrusión profesional: reconocimiento, enumeración, explotación, post-explotación, escalada de privilegios, movimiento lateral y reporte final. El estudiante aprenderá a documentar hallazgos bajo estándares de la industria (PTES, OWASP WSTG, MITRE ATT&CK) y a entregar un informe ejecutivo y técnico listo para cliente.

## LECTURA

Un pentest end-to-end no es una colección de exploits aislados, sino un proceso metodológico disciplinado que sigue marcos reconocidos. El estándar **PTES (Penetration Testing Execution Standard)** define siete fases: pre-engagement, intelligence gathering, threat modeling, vulnerability analysis, exploitation, post-exploitation y reporting. Estas fases se alinean con el **NIST SP 800-115** (*Technical Guide to Information Security Testing and Assessment*), que enfatiza planificación, descubrimiento, ataque y reporte como ciclo cerrado. La fase de reconocimiento debe distinguir entre **OSINT pasivo** (WHOIS, Shodan, DNSdumpster, theHarvester) y **escaneo activo** (Nmap, Masscan), respetando el alcance contractual y las reglas de engagement (RoE).

Durante la enumeración, el pentester mapea servicios contra el **MITRE ATT&CK** para predecir TTPs del adversario. Por ejemplo, T1046 (Network Service Scanning) y T1595 (Active Scanning) guían la recolección. La explotación se prioriza con **CVSS v3.1** y el **CISA KEV Catalog** (Known Exploited Vulnerabilities), evitando perder tiempo en vulnerabilidades teóricas. En aplicaciones web, el **OWASP Web Security Testing Guide (WSTG)** y el **OWASP Top 10:2021** estructuran las pruebas: A01 Broken Access Control, A03 Injection, A07 Identification and Authentication Failures.

La post-explotación sigue tácticas del **MITRE ATT&CK** como T1003 (OS Credential Dumping), T1055 (Process Injection) y T1021 (Remote Services). Herramientas como BloodHound, Mimikatz, Impacket y CrackMapExec permiten mapear Active Directory y escalar privilegios. La contención del alcance se documenta según **ISO/IEC 27001:2022** (controles A.5.7 sobre threat intelligence y A.8.8 sobre gestión de vulnerabilidades técnicas), y los hallazgos se clasifican con **CIS Controls v8** (Control 7: Continuous Vulnerability Management; Control 4: Secure Configuration).

El entregable final incluye: resumen ejecutivo sin jerga técnica, matriz de riesgo (probabilidad × impacto), evidencia reproducible (capturas, comandos, hashes), remediación priorizada y mapeo a ATT&CK. Según el **PTES Reporting**, el informe debe permitir a un tercero reproducir cada hallazgo. Un pentest sin reporte accionable es un pentest fallido: el valor no está en romper, sino en comunicar riesgo de negocio con trazabilidad técnica.

## EJERCICIO

**Escenario:** Red corporativa simulada "MegaCorp" con DMZ, servidor web vulnerable, jump host Linux y controlador de dominio Windows Server 2019.

**Fase 1 – Reconocimiento (30 min):**
- Ejecutar `theHarvester -d megacorp.local -b all` para OSINT.
- Escaneo con `nmap -sC -sV -p- -oA scan_full 10.10.10.0/24`.
- Identificar hosts vivos y servicios expuestos.

**Fase 2 – Enumeración (45 min):**
- Sobre HTTP: `gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/common.txt`.
- Sobre SMB: `enum4linux-ng -A 10.10.10.10` y `smbclient -L //10.10.10.10`.
- Sobre LDAP: `ldapsearch -x -H ldap://10.10.10.10 -b "dc=megacorp,dc=local"`.

**Fase 3 – Explotación (60 min):**
- Web: explotar vulnerabilidad en WordPress con `wpscan` y `searchsploit`.
- Linux: obtener reverse shell y estabilizar con `python3 -c 'pty.spawn("/bin/bash")'`.
- Windows: usar `impacket-psexec` o responder para capturar hashes NTLMv2.

**Fase 4 – Post-explotación (60 min):**
- Ejecutar `linpeas.sh` y `winPEAS.exe` para enumerar vectores de escalada.
- Con BloodHound + SharpHound mapear rutas a Domain Admin.
- Dumpear credenciales con `secretsdump.py` y realizar Pass-the-Hash.

**Fase 5 – Reporte (45 min):**
- Crear informe en Markdown con: Executive Summary, Scope, Methodology, Findings (con CVSS, ATT&CK ID, evidencia), Remediation.
- Mapear cada hallazgo a OWASP WSTG y CIS Controls.

**Entregable:** PDF + repositorio Git con scripts, capturas y `report.md`.

## CASO

**Caso real: Pentest de Uber (2016) y su lección sobre alcance y reporte.**
En 2016, dos investigadores de seguridad descubrieron una vulnerabilidad crítica en la infraestructura de Uber que permitía acceso a datos de 57 millones de usuarios. Bajo el programa **HackerOne** de Uber, reportaron el hallazgo. Sin embargo, Uber pagó a los atacantes 100.000 USD a través de un acuerdo de confidencialidad para ocultar el incidente, en lugar de gestionarlo como un pentest legítimo con trazabilidad. Este caso, documentado por el **Departamento de Justicia de EE.UU. (DOJ)** y sancionado con una multa de 148 millones USD en 2018, ilustra por qué un pentest end-to-end debe seguir un marco formal: **PTES** exige autorización escrita, alcance definido y reporte auditable. La ausencia de estos elementos convirtió un hallazgo legítimo en un delito de encubrimiento bajo el **Computer Fraud and Abuse Act (CFAA)**. Lección clave: el pentester profesional documenta, reporta y escala hallazgos por canales formales, mapeando cada acción a **MITRE ATT&CK** y entregando remediación alineada con **ISO 27001** y **NIST CSF 2.0** (función ID.RA – Risk Assessment). Un capstone bien ejecutado demuestra que el valor del pentest reside tanto en la técnica como en la ética y el reporte.

## Recursos abiertos
- PTES – Penetration Testing Execution Standard: http://www.pentest-standard.org/
- OWASP Web Security Testing Guide: https://owasp.org/www-project-web-security-testing-guide/
- MITRE ATT&CK Framework: https://attack.mitre.org/
- NIST SP 800-115 Technical Guide to Information Security Testing: https://csrc.nist.gov/publications/detail/sp/800-115/final
- CIS Controls v8: https://www.cisecurity.org/controls/v8
- HackTricks (metodologías y post-explotación): https://book.hacktricks.xyz/

--- [Volver al syllabus](../syllabus.md)
