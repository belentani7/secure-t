# Semana 9: Deteccion y respuesta en endpoints (EDR)

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 9 de 20

## Objetivo de la semana
Comprender los fundamentos, la arquitectura y las capacidades operativas de las soluciones EDR (Endpoint Detection and Response) dentro de un SOC moderno. El estudiante aprenderá a diferenciar EDR de antivirus tradicionales, aplicar el marco MITRE ATT&CK para mapear telemetría de endpoints, y ejecutar flujos básicos de triaje, hunting y respuesta ante incidentes sobre estaciones de trabajo y servidores comprometidos.

## LECTURA
El EDR es una categoría de solución de seguridad endpoint que combina telemetría continua, análisis de comportamiento, detección basada en firmas y heurísticas, y capacidades de respuesta remota. A diferencia del antivirus tradicional (basado en firmas y escaneos periódicos), el EDR registra eventos a nivel de proceso, hilo, archivo, registro, red y memoria, permitiendo reconstruir cadenas de ejecución completas. Gartner acuñó el término en 2013 y desde entonces evolucionó hacia XDR (Extended Detection and Response) al integrar señales de red, correo, identidad y nube.

Arquitectónicamente, un EDR se compone de: (1) un agente ligero instalado en el endpoint que recolecta telemetría y aplica políticas; (2) un backend en la nube o on-premise que correlaciona eventos, aplica machine learning y mantiene inteligencia de amenazas; (3) una consola de operador para hunting, triaje y respuesta; y (4) módulos de respuesta activa como aislamiento de host, kill de procesos, cuarentena de archivos y recolección forense.

El marco **MITRE ATT&CK** es la referencia principal para mapear detecciones EDR. Cada técnica (por ejemplo, T1059 Command and Scripting Interpreter, T1055 Process Injection, T1547 Boot or Logon Autostart Execution) se traduce en eventos observables en el endpoint: creación de procesos con línea de comandos sospechosa, inyección en procesos legítimos como `lsass.exe`, o persistencia vía claves Run del registro. Los operadores de SOC construyen "analytics" o reglas de detección alineadas a estas técnicas, siguiendo el modelo **Detection Engineering** descrito por frameworks como el **MITRE Engenuity ATT&CK Evaluations** y el **Sigma** project (reglas genéricas portables entre SIEM/EDR).

Desde el punto de vista normativo, **NIST SP 800-61r2** (Computer Security Incident Handling Guide) define el ciclo de respuesta: preparación, detección y análisis, contención, erradicación, recuperación y lecciones aprendidas; el EDR actúa principalmente en las fases de detección, contención y erradicación. **NIST SP 800-137** aporta el enfoque de monitoreo continuo y **NIST CSF 2.0** ubica al EDR en las funciones DE.CM (Detection Processes – Continuous Monitoring) y RS.MI (Response – Mitigation). **ISO/IEC 27001:2022** en su Anexo A control 8.16 (Monitoring activities) y 5.25 (Assessment and decision on information security events) exige capacidades de monitoreo y evaluación de eventos, donde el EDR es un habilitador técnico. Los **CIS Controls v8** abordan el tema en el Control 10 (Malware Defenses) y Control 13 (Network Monitoring and Defense), recomendando EDR con análisis de comportamiento y respuesta automatizada. **OWASP** publica guías relevantes como el "Logging Cheat Sheet" y el "Application Logging Vocabulary" que complementan la telemetría de endpoint en aplicaciones web comprometidas.

Los beneficios operativos incluyen: reducción del MTTD (Mean Time To Detect) y MTTR (Mean Time To Respond), visibilidad de amenazas fileless (PowerShell, WMI, macros), threat hunting proactivo con hipótesis basadas en ATT&CK, y capacidad de rollback en ransomware. Los desafíos son el volumen de telemetría (coste de almacenamiento), falsos positivos, la necesidad de personal especializado y los riesgos de privacidad (GDPR, Ley 1581 en Colombia) por la recolección de datos en equipos de empleados.

## EJERCICIO
**Objetivo:** Configurar un laboratorio EDR open source, generar telemetría de una técnica ATT&CK y validar la detección y respuesta.

**Herramientas:** Windows 10/11 VM, Sysmon v15, Wazuh 4.x (o Elastic Security), Atomic Red Team, Kali Linux como atacante.

**Pasos:**
1. Instalar Sysmon en la VM Windows con la configuración de SwiftOnSecurity (`sysmonconfig-export.xml`) y verificar en el Visor de Eventos que se registran los Event ID 1 (Process Create), 3 (Network Connect), 11 (File Create) y 13 (Registry Set).
2. Desplegar Wazuh Manager en un contenedor Docker y conectar el agente Windows. Confirmar en el dashboard que llegan eventos de Sysmon.
3. Instalar **Atomic Red Team** (`Install-AtomicRedTeam`) y ejecutar la prueba `T1059.001 - PowerShell` y `T1547.001 - Registry Run Keys`. Documentar el hash del comando ejecutado.
4. En Wazuh, crear una regla personalizada que alerte cuando `powershell.exe` se ejecute con `-EncodedCommand` o cuando se cree una clave en `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`.
5. Simular respuesta: aislar el endpoint desconectando la interfaz de red vía regla activa de Wazuh o `netsh`, y terminar el proceso sospechoso con `Stop-Process`.
6. Exportar la línea de tiempo de eventos (proceso padre-hijo, conexiones de red, archivos creados) y mapearla a técnicas ATT&CK en una tabla.

**Entregable:** Documento con capturas del dashboard, reglas Sigma/YARA equivalentes, timeline del incidente simulado y mapeo ATT&CK.

## CASO
**Caso: Ataque de ransomware con abuso de Cobalt Strike y PsExec (basado en incidentes reales tipo Conti/LockBit).**

En 2021, múltiples organizaciones reportaron intrusiones donde el atacante inicial obtiene acceso vía phishing con macro, ejecuta un loader en PowerShell, y despliega Cobalt Strike Beacon en memoria (T1055 Process Injection, T1059.001). El EDR detecta la inyección al observar que `rundll32.exe` carga una DLL sin firma desde `%TEMP%` y establece conexión saliente a un dominio recién registrado. Posteriormente, el atacante usa PsExec (T1021.002 SMB/Windows Admin Shares) para moverse lateralmente y desplegar el ransomware con `vssadmin delete shadows` (T1490 Inhibit System Recovery).

**Análisis SOC:** El operador recibe alerta de severidad alta por "Suspicious Process Injection into lsass.exe". Aplica triaje: verifica hash en VirusTotal, revisa el árbol de procesos en el EDR, confirma C2 con threat intel. Contiene aislando el host desde la consola EDR (network containment), mata el proceso malicioso, recolecta memoria con WinPmem, y erradica eliminando persistencia (Run keys, tareas programadas). Recupera desde backup inmutable y documenta lecciones aprendidas alineadas a NIST SP 800-61r2. El caso ilustra por qué el antivirus tradicional falló (binario fileless) y cómo el EDR con behavioral analytics y respuesta remota redujo el impacto.

## Recursos abiertos
- https://attack.mitre.org/ (MITRE ATT&CK – matriz oficial de tácticas y técnicas)
- https://github.com/SigmaHQ/sigma (Reglas Sigma portables para detección EDR/SIEM)
- https://documentation.wazuh.com/current/index.html (Documentación oficial de Wazuh, EDR/XDR open source)
- https://www.cisecurity.org/controls/v8 (CIS Critical Security Controls v8)
- https://csrc.nist.gov/pubs/sp/800/61/r2/final (NIST SP 800-61r2 – Incident Handling Guide)

--- [Volver al syllabus](../syllabus.md)
