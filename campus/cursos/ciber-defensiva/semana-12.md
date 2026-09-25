# Semana 12: Forense digital y manejo de evidencias

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 12 de 20

## Objetivo de la semana
Comprender los fundamentos del forense digital y la cadena de custodia, aplicando metodologías reconocidas (NIST SP 800-86, ISO/IEC 27037) para adquirir, preservar, analizar y presentar evidencia digital de forma admisible. El estudiante será capaz de documentar un incidente, mantener la integridad de las pruebas mediante hashes y elaborar un informe forense básico alineado con estándares de la industria.

## LECTURA
El forense digital es la disciplina que aplica técnicas científicas para identificar, preservar, analizar y presentar evidencia digital con validez legal o corporativa. Su principio rector es el **intercambio de Locard**: "todo contacto deja un rastro". En un sistema comprometido, ese rastro incluye artefactos volátiles (RAM, conexiones de red, procesos) y no volátiles (disco, logs, registro de Windows, journal de ext4).

El marco de referencia principal es el **NIST SP 800-86 "Guide to Integrating Forensic Techniques into Incident Response"**, que define cuatro fases: **recolección, examen, análisis y reporte**. Complementariamente, la norma **ISO/IEC 27037:2012** establece directrices para el manejo de evidencia digital, y **ISO/IEC 27042** cubre el análisis e interpretación. En el ámbito legal, la **RFC 3227** ofrece directrices para la recolección y archivado de evidencia, y el **SWGDE** (Scientific Working Group on Digital Evidence) publica mejores prácticas específicas.

La **cadena de custodia** es el registro cronológico e ininterrumpido de quién tuvo la evidencia, cuándo, dónde y para qué. Cualquier ruptura la invalida. Cada pieza debe documentarse con: identificador único, descripción, origen (hostname, IP, MAC, número de serie), hash criptográfico (SHA-256 preferido sobre MD5 por colisiones conocidas), fecha/hora UTC, custodio y propósito. La **orden de volatilidad** (RFC 3227) dicta qué capturar primero: registros y caché de CPU → RAM → archivos temporales → disco → logs remotos → medios de respaldo → topología de red.

El **modelo de capas forenses** incluye: adquisición (imagen bit a bit con `dd`, `dc3dd`, `FTK Imager`, `Guymager`, `LiME` para memoria), verificación (hashes), análisis (`Autopsy`, `Sleuth Kit`, `Volatility`, `Eric Zimmerman tools`, `Velociraptor`) y presentación. En Windows destacan artefactos como `$MFT`, `$UsnJrnl`, `Prefetch`, `Amcache`, `ShimCache`, `SRUM`, `Event Logs` (EVTX) y `Registry hives`. En Linux/Unix: `auth.log`, `syslog`, `bash_history`, `wtmp/btmp`, `journald`. En macOS: `Unified Logs`, `FSEvents`, `QuarantineEvents`.

El análisis debe mapearse contra **MITRE ATT&CK** para vincular artefactos con TTPs (p. ej. T1059 Command and Scripting Interpreter, T1070 Indicator Removal, T1078 Valid Accounts). Los **CIS Controls v8** (Control 8: Audit Log Management, Control 13: Network Monitoring and Defense, Control 17: Incident Response Management) y **ISO/IEC 27001:2022 Anexo A 5.24-5.28** (gestión de incidentes y recolección de evidencia) refuerzan la necesidad de procesos forenses documentados. El **OWASP** aporta en forense de aplicaciones web (logs de servidor, `access.log`, errores de aplicación, WAF logs) y en el análisis post-mortem de brechas.

Un concepto clave es el **anti-forense**: técnicas para destruir o alterar evidencia (timestomping, wiping, cifrado, rootkits). Detectarlas es parte del análisis. Finalmente, el **informe forense** debe ser claro, reproducible, con hallazgos, limitaciones, metodología, herramientas y versiones, y anexos con hashes y logs.

## EJERCICIO
**Objetivo:** Realizar una adquisición forense completa de una imagen de disco y memoria, verificar integridad y extraer artefactos clave.

**Escenario:** Se te entrega una VM comprometida (puedes usar `Metasploitable2`, `Windows 10 eval VM` o una imagen pública como `dfir-samples`).

**Pasos:**

1. **Preparación del entorno forense:**
   - Trabaja sobre una máquina limpia (SIFT Workstation o REMnux).
   - Crea carpeta `~/case-2024-001/` con subcarpetas `evidence/`, `analysis/`, `reports/`.
   - Documenta en `chain_of_custody.txt`: analista, fecha UTC, caso, descripción del sistema origen.

2. **Adquisición de memoria (si es VM en ejecución):**
   - En Linux: `sudo apt install lime-forensics-dkms` y captura con `LiME`:
     ```
     sudo insmod lime.ko "path=/evidence/mem.lime format=lime"
     ```
   - En Windows: usa `winpmem` o `DumpIt`.

3. **Adquisición de disco:**
   - Con `dc3dd`:
     ```
     dc3dd if=/dev/sda of=/evidence/disk.dd hash=sha256 log=/evidence/dc3dd.log
     ```
   - Alternativa gráfica: `Guymager` o `FTK Imager`.

4. **Verificación de integridad:**
   - `sha256sum /evidence/disk.dd > /evidence/disk.dd.sha256`
   - Compara con el hash generado durante la adquisición. Documenta en la cadena de custodia.

5. **Análisis con Autopsy/Sleuth Kit:**
   - Crea un caso nuevo, añade la imagen, ejecuta ingest modules (hash lookup, keyword search, web artifacts, EXIF).
   - Extrae: procesos ejecutados, archivos recientemente modificados, conexiones de red, cuentas de usuario.

6. **Análisis de memoria con Volatility 3:**
   ```
   vol -f mem.lime windows.info
   vol -f mem.lime windows.pslist
   vol -f mem.lime windows.netscan
   vol -f mem.lime windows.cmdline
   ```

7. **Mapeo a MITRE ATT&CK:** identifica al menos 3 técnicas observadas y documéntalas con su ID (ej. T1059.001 PowerShell).

8. **Informe:** genera `report.md` con: resumen ejecutivo, metodología, hallazgos, IOCs, hashes, limitaciones y recomendaciones.

**Entregable:** Carpeta del caso con evidencia, hashes, logs de herramientas y reporte final.

## CASO
**Caso: Brecha en una empresa de servicios financieros (basado en patrones reales tipo "Carbanak" y "FIN7").**

Una entidad financiera detectó transferencias no autorizadas por USD 2.3 millones. El equipo SOC identificó que un analista de tesorería abrió un documento malicioso (macro VBA) enviado por spear-phishing. El atacante desplegó un backdoor (similar a **Cobalt Strike**) y movió lateralmente usando **Pass-the-Hash** (T1550.002) hacia un servidor de aplicaciones.

**Acciones forenses aplicadas:**
- Se aisló la red del segmento afectado y se preservó RAM de dos servidores antes de apagarlos.
- Se adquirieron imágenes forenses con `FTK Imager` y se documentó cadena de custodia en formulario firmado por dos testigos.
- El análisis de `Windows Event Logs` (Security ID 4624, 4672, 4688) reveló logons tipo 3 y 10 desde IPs internas anómalas.
- `Volatility` identificó un proceso `rundll32.exe` con conexión a IP de C2 en el extranjero.
- `Autopsy` recuperó archivos `.lnk` en la carpeta `Recent` que probaron la ejecución del documento malicioso.
- Se mapearon TTPs a MITRE ATT&CK: T1566.001 (Spearphishing Attachment), T1204.002 (Malicious File), T1055 (Process Injection), T1071.001 (Web Protocols).

**Lecciones aprendidas:**
- La cadena de custodia permitió que el informe fuera aceptado por auditoría externa y por la aseguradora.
- La falta de logs en un servidor Linux (rsyslog sin rotación) limitó el alcance del análisis, evidenciando la necesidad de alinear con **CIS Control 8**.
- El tiempo de respuesta (MTTR) fue de 72 horas; el objetivo es reducirlo a 24 mediante playbooks automatizados con **Velociraptor** y **TheHive**.

## Recursos abiertos
- NIST SP 800-86 – Guide to Integrating Forensic Techniques into Incident Response: https://csrc.nist.gov/pubs/sp/800/86/final
- ISO/IEC 27037:2012 – Guidelines for identification, collection, acquisition and preservation of digital evidence: https://www.iso.org/standard/44381.html
- RFC 3227 – Guidelines for Evidence Collection and Archiving: https://datatracker.ietf.org/doc/html/rfc3227
- Volatility Foundation (herramienta de análisis de memoria): https://github.com/volatilityfoundation/volatility3
- Autopsy / Sleuth Kit (suite forense open source): https://www.sleuthkit.org/autopsy/
- MITRE ATT&CK – Tácticas y técnicas: https://attack.mitre.org/
- SIFT Workstation (entorno forense de SANS): https://www.sans.org/tools/sift-workstation/
- DFIR Training / AboutDFIR (recursos y muestras): https://aboutdfir.com/

--- [Volver al syllabus](../syllabus.md)
