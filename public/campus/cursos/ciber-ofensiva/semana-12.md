# Semana 12: Mecanismos de persistencia

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 12 de 20

## Objetivo de la semana
Comprender los mecanismos que permiten a un atacante mantener el acceso a un sistema comprometido tras reinicios, cierres de sesión o cambios de credenciales. El estudiante aprenderá a identificar, analizar y detectar técnicas de persistencia en Windows y Linux, alineadas con MITRE ATT&CK y buenas prácticas de detección defensiva.

## LECTURA
La persistencia es la fase del ciclo de vida de un ataque en la que el adversario asegura su presencia continua en el entorno comprometido. Según **MITRE ATT&CK**, esta táctica (TA0003) agrupa técnicas como *Registry Run Keys* (T1547.001), *Scheduled Task/Job* (T1053), *Create Account* (T1136), *Server Software Component* (T1505), *Boot or Logon Autostart Execution* (T1547) y *Windows Service* (T1543.003). En Windows, los mecanismos clásicos incluyen claves `Run`/`RunOnce` en `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`, servicios creados con `sc create`, tareas programadas vía `schtasks`, y WMI Event Subscriptions (T1546.003). En Linux destacan cron (`/etc/cron.*`, `crontab -e`), systemd units, `.bashrc`/`.profile`, `LD_PRELOAD` (T1574.006) y SSH `authorized_keys` (T1098.004).

Los atacantes sofisticados emplean técnicas avanzadas como *bootkits* (UEFI), *rootkits* a nivel kernel, *web shells* (T1505.003) en servidores IIS/Apache, y *Account Manipulation* mediante cuentas ocultas o modificación de DACLs. El marco **NIST SP 800-61** (Computer Security Incident Handling Guide) recomienda que la respuesta a incidentes incluya la erradicación total de mecanismos de persistencia antes de restaurar servicios, ya que un solo artefacto olvidado permite la recompromisión. **CIS Controls v8** aborda este riesgo en el Control 4 (Configuración segura), Control 5 (Gestión de cuentas) y Control 10 (Defensas contra malware), mientras que **ISO/IEC 27001:2022** lo cubre en los controles A.8.7 (protección contra malware) y A.8.16 (monitorización de actividades).

Para la detección, el **OWASP** recomienda monitorizar integridad de archivos (FIM), revisar periódicamente claves de autorun, cuentas locales, tareas programadas y servicios no firmados. Herramientas como **Sysinternals Autoruns**, **osquery**, **Velociraptor** y **Sysmon** (con configuraciones como SwiftOnSecurity) permiten inventariar y alertar sobre artefactos de persistencia. En entornos empresariales, la telemetría EDR debe correlacionar eventos como `4698` (tarea creada), `7045` (servicio instalado) y `4720` (cuenta creada) en Windows, y auditorías `auditd` en Linux.

## EJERCICIO
**Objetivo:** Identificar y documentar mecanismos de persistencia en un laboratorio Windows 10/11 y Ubuntu, usando herramientas de análisis forense.

**Entorno:** Máquina virtual Windows 10 y Ubuntu 22.04 (aisladas, sin red externa). Herramientas: Sysinternals Suite, Autoruns, PowerShell, `osquery`, `auditd`.

**Pasos:**
1. **Windows – Inventario inicial:** Ejecuta `Autoruns64.exe -a -h -s -v > autoruns_baseline.csv` para exportar todos los puntos de persistencia. Filtra por las pestañas *Logon*, *Scheduled Tasks*, *Services* y *WMI*.
2. **Simulación controlada:** Crea una entrada de persistencia benigna:
   ```powershell
   New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "LabPersist" -Value "C:\Windows\System32\calc.exe"
   schtasks /create /tn "LabTask" /tr "calc.exe" /sc onlogon /ru %USERNAME%
   sc.exe create LabSvc binPath= "C:\Windows\System32\calc.exe" start= auto
   ```
3. **Detección:** Revisa el Visor de Eventos (IDs 4698, 7045, 13 de Sysmon) y vuelve a ejecutar Autoruns para confirmar la aparición de los artefactos.
4. **Linux – Persistencia y detección:** Añade `@reboot /usr/bin/xcalc` a `crontab -e`, crea una unit systemd en `~/.config/systemd/user/`, y agrega una clave a `~/.ssh/authorized_keys`. Verifica con `systemctl --user list-units`, `crontab -l` y `ausearch -m USER_CMD`.
5. **Erradicación:** Elimina cada artefacto (`Remove-ItemProperty`, `schtasks /delete`, `sc.exe delete`, `crontab -r`, `systemctl --user disable`) y documenta el procedimiento en un informe con capturas y hashes.

**Entregable:** Informe técnico (PDF) con línea base, artefactos introducidos, evidencia de detección (eventos, logs) y plan de erradicación.

## CASO
**Caso real: APT29 (Cozy Bear) y la persistencia mediante WMI y servicios maliciosos (2020-2021).**

En la campaña atribuida a APT29 contra la cadena de suministro de **SolarWinds Orion** (diciembre 2020), el grupo ruso demostró un dominio avanzado de persistencia. Tras comprometer el proceso de compilación, distribuyeron el backdoor **SUNBURST** firmado digitalmente. Una vez en los sistemas, los operadores desplegaban el implante **TEARDROP** y utilizaban técnicas alineadas con MITRE ATT&CK como T1546.003 (WMI Event Subscription) y T1053.005 (Scheduled Task) para asegurar acceso continuo. Además, empleaban *Golden SAML* (T1606.002) para persistir en entornos federados de Azure AD, permitiendo autenticación como cualquier usuario sin necesidad de credenciales.

La investigación de **FireEye** (posteriormente Mandiant) y **Microsoft MSRC** reveló que los atacantes mantenían acceso incluso tras la rotación de credenciales, porque habían insertado mecanismos en servicios y tareas programadas que se reejecutaban al inicio. El caso subraya la lección crítica: la respuesta a incidentes debe incluir un análisis exhaustivo de persistencia antes de declarar la erradicación; de lo contrario, el adversario recompromete el entorno en horas. **CISA** emitió la directiva de emergencia 21-01 exigiendo a agencias federales de EE.UU. auditar artefactos de persistencia y aplicar contramedidas como MFA, principio de mínimo privilegio y monitorización de WMI.

## Recursos abiertos
- MITRE ATT&CK – Tactic TA0003 Persistence: https://attack.mitre.org/tactics/TA0003/
- Microsoft Sysinternals Autoruns: https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns
- CISA Emergency Directive 21-01 (SolarWinds): https://www.cisa.gov/news-events/directives/ed-21-01-mitigate-solarwinds-orion-code-compromise

--- [Volver al syllabus](../syllabus.md)
