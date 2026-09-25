# Semana 10: Escalada de privilegios Windows y Linux

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 10 de 20

## Objetivo de la semana
Comprender y aplicar técnicas de escalada de privilegios en sistemas Windows y Linux, identificando configuraciones inseguras, vulnerabilidades locales y malas prácticas que permiten a un atacante pasar de un usuario con bajos privilegios a administrador o root. El estudiante aprenderá a enumerar el sistema, explotar debilidades comunes y documentar hallazgos alineados con marcos como MITRE ATT&CK y CIS Controls.

## LECTURA
La escalada de privilegios es la fase del pentesting en la que un atacante, tras obtener acceso inicial con privilegios limitados, busca elevar su nivel de control sobre el sistema. En MITRE ATT&CK se documenta como la táctica **Privilege Escalation (TA0004)**, con técnicas como **T1068 (Exploitation for Privilege Escalation)**, **T1548 (Abuse Elevation Control Mechanism)** y **T1078 (Valid Accounts)**. En Windows, los vectores más comunes incluyen tokens de acceso inseguros, servicios con rutas no citadas, permisos débiles en directorios, tareas programadas mal configuradas, credenciales almacenadas en el registro o en archivos de configuración, y vulnerabilidades en el kernel. Herramientas como **WinPEAS**, **PowerUp** (PowerSploit) y **Seatbelt** automatizan la enumeración. En Linux, los vectores típicos son binarios SUID/SGID mal configurados, capacidades (capabilities) excesivas, tareas cron ejecutables por usuarios sin privilegios, archivos con permisos de escritura en rutas críticas, variables de entorno PATH manipulables, y servicios systemd débiles. **LinPEAS**, **Linux Smart Enumeration (LSE)** y **GTFOBins** son referencias clave. El estándar **NIST SP 800-115** (Technical Guide to Information Security Testing and Assessment) recomienda validar estos hallazgos mediante pruebas controladas y documentar el impacto. Los **CIS Controls v8** (especialmente el Control 4: Secure Configuration y el Control 5: Account Management) ayudan a mitigar estas debilidades. En entornos reales, la escalada de privilegios suele combinarse con **persistencia** (TA0003) y **movimiento lateral** (TA0008). La clave está en la enumeración exhaustiva, la priorización de vectores viables y la explotación ética dentro del alcance autorizado. Además, ISO/IEC 27001:2022 en su Anexo A.8.2 (Privileged Access Rights) exige controlar y restringir los derechos de acceso privilegiado, lo que refleja la importancia de esta fase en auditorías reales.

## EJERCICIO
**Objetivo:** Escalar privilegios en una máquina vulnerable Windows y otra Linux en un laboratorio controlado (por ejemplo, TryHackMe, HackTheBox o VMs locales con VulnHub).

**Parte 1 – Windows (máquina "Blue" o "Jerry" de HackTheBox o similar):**
1. Accede con un usuario de bajos privilegios vía RDP o shell reversa.
2. Ejecuta `whoami /priv` y `systeminfo` para identificar privilegios y parches.
3. Descarga y ejecuta **WinPEAS.exe** (`winpeasany.exe`) y guarda la salida.
4. Busca servicios con rutas no citadas: `wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows\\"`.
5. Si encuentras un servicio vulnerable, crea un binario malicioso con `msfvenom` y colócalo en la ruta explotable.
6. Reinicia el servicio con `sc stop` y `sc start`.
7. Verifica privilegios con `whoami` y captura la flag de administrador.

**Parte 2 – Linux (máquina "Linux Privesc" de TryHackMe o similar):**
1. Accede como usuario no privilegiado.
2. Ejecuta `sudo -l` para ver comandos permitidos.
3. Busca binarios SUID: `find / -perm -4000 -type f 2>/dev/null`.
4. Identifica versiones vulnerables con `uname -a` y busca exploits en Exploit-DB.
5. Usa **LinPEAS** (`./linpeas.sh`) y revisa tareas cron: `cat /etc/crontab` y `ls -la /etc/cron.*`.
6. Si encuentras un script cron ejecutable por root y escribible por tu usuario, modifícalo para obtener una shell root.
7. Alternativamente, explota un binario SUID con GTFOBins (ej. `find`, `nmap`, `vim`).
8. Documenta cada paso con capturas y comandos exactos.

**Entrega:** Informe en Markdown con hallazgos, comandos, evidencias (capturas) y recomendaciones de mitigación alineadas a CIS Controls.

## CASO
**Caso real: "Dirty Pipe" (CVE-2022-0847) en Linux**
En marzo de 2022, se divulgó una vulnerabilidad crítica en el kernel de Linux (versiones 5.8 a 5.16.11) que permitía a un usuario local sobrescribir archivos de solo lectura, incluyendo binarios SUID y archivos de configuración. Un atacante con acceso no privilegiado podía modificar `/etc/passwd` o inyectar código en un binario SUID para obtener root. El fallo se debía a un manejo incorrecto de las tuberías (pipes) en el kernel. Fue explotado en entornos reales contra servidores web y contenedores Docker. La mitigación requería actualizar el kernel a versiones parcheadas (5.16.11, 5.15.25, 5.10.102). Este caso ilustra cómo una vulnerabilidad local de escalada de privilegios puede comprometer completamente un sistema. En MITRE ATT&CK se mapea como **T1068** y resalta la necesidad de aplicar parches de seguridad de forma urgente, tal como exige el CIS Control 7 (Continuous Vulnerability Management) y NIST SP 800-40 (Guide to Enterprise Patch Management).

## Recursos abiertos
- https://github.com/carlospolop/PEASS-ng (WinPEAS y LinPEAS)
- https://gtfobins.github.io/ (Binarios explotables en Linux)
- https://attack.mitre.org/tactics/TA0004/ (MITRE ATT&CK Privilege Escalation)
- https://www.cisecurity.org/controls (CIS Controls v8)
- https://book.hacktricks.xyz/windows-hardening/windows-local-privilege-escalation (HackTricks Windows Privesc)

--- [Volver al syllabus](../syllabus.md)
