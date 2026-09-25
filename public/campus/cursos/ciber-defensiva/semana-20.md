# Semana 20: Capstone: Ejercicio Purple Team

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 20 de 20

## Objetivo de la semana
Diseñar, ejecutar y documentar un ejercicio Purple Team que integre las tácticas, técnicas y procedimientos (TTPs) de un adversario simulado (Red Team) con las capacidades de detección y respuesta del SOC (Blue Team). El estudiante aprenderá a mapear actividad ofensiva contra MITRE ATT&CK, validar reglas de detección en un SIEM y producir un informe accionable que cierre brechas entre ataque y defensa.

## LECTURA
Un ejercicio Purple Team no es simplemente un Red Team que ataca ni un Blue Team que defiende por separado: es un esfuerzo colaborativo y en tiempo real donde ambas partes comparten telemetría, hipótesis y hallazgos para mejorar la postura defensiva de forma medible. El marco de referencia principal es **MITRE ATT&CK** (https://attack.mitre.org), que estructura el comportamiento adversario en tácticas (el "por qué") y técnicas (el "cómo"), permitiendo mapear cada acción ofensiva a una detección concreta. Complementariamente, el **NIST SP 800-61 Rev. 2** (Computer Security Incident Handling Guide) define el ciclo de vida de respuesta a incidentes —preparación, detección y análisis, contención, erradicación, recuperación y lecciones aprendidas— que el Purple Team debe recorrer durante el ejercicio. Los **CIS Controls v8** (especialmente el Control 8: Audit Log Management y el Control 13: Network Monitoring and Defense) y el **ISO/IEC 27001:2022** (Anexo A, controles 5.7 sobre threat intelligence y 8.16 sobre monitoreo de actividades) proporcionan el marco de gobernanza para justificar el ejercicio ante la dirección.

La metodología típica sigue el ciclo **CTI → Emulación → Detección → Mitigación**. Primero, el equipo de Cyber Threat Intelligence selecciona un adversario relevante (por ejemplo, APT29 o FIN7) y extrae sus TTPs de ATT&CK Navigator. Después, el Red Team ejecuta esas técnicas con herramientas como **Atomic Red Team** (https://github.com/redcanaryco/atomic-red-team), **Caldera** de MITRE o **Prelude Operator**, generando telemetría controlada. Simultáneamente, el Blue Team monitoriza el SIEM (Splunk, Elastic, Sentinel, Wazuh) y valida si las reglas de detección disparan. Cada técnica se clasifica como **Detectada**, **Parcialmente detectada**, **No detectada** o **Detectada pero no alertada**, y se documenta en una matriz de cobertura.

La fase crítica es el **debrief conjunto**, donde se revisan las brechas: ¿falta telemetría (Sysmon, ETW, EDR)? ¿Las reglas Sigma están mal afinadas? ¿Hay exceso de falsos positivos? Se aplican principios de **OWASP** cuando el ejercicio toca aplicaciones web (por ejemplo, emular técnicas de la matriz OWASP Top 10 2021 como A03: Injection o A01: Broken Access Control), y se alinean las mitigaciones con **D3FEND** (https://d3fend.mitre.org), el framework defensivo complementario de ATT&CK. El resultado final es un informe con: alcance, TTPs emuladas, tasa de detección, MTTD (Mean Time To Detect), MTTR (Mean Time To Respond), brechas identificadas y un plan de remediación priorizado por riesgo. Un Purple Team maduro se ejecuta de forma recurrente (trimestral o semestral) y alimenta un ciclo de mejora continua alineado con ISO 27001 y el NIST CSF 2.0.

## EJERCICIO
**Objetivo:** Ejecutar un mini Purple Team end-to-end emulando 5 técnicas de ATT&CK contra un laboratorio y validar la cobertura de detección.

**Entorno requerido:**
- Un host Windows 10/11 víctima con **Sysmon** instalado (config de SwiftOnSecurity) y agente **Wazuh** o **Elastic Agent**.
- Un SIEM (Wazuh, Elastic Stack o Splunk Free) con dashboards funcionales.
- Una VM atacante con Kali Linux y **Atomic Red Team** instalado (`git clone https://github.com/redcanaryco/atomic-red-team`).
- **MITRE ATT&CK Navigator** abierto en el navegador.

**Pasos:**
1. **Planificación:** Selecciona 5 técnicas del adversario APT29 en ATT&CK Navigator, por ejemplo: T1059.001 (PowerShell), T1053.005 (Scheduled Task), T1547.001 (Registry Run Keys), T1003.001 (LSASS Memory) y T1071.001 (Web Protocols C2).
2. **Baseline:** Antes de atacar, verifica que el SIEM recibe logs de Sysmon (Event ID 1, 3, 11, 13) y del canal Security de Windows.
3. **Emulación:** Ejecuta cada técnica con Atomic Red Team: `Invoke-AtomicTest T1059.001 -TestNumbers 1,2` y documenta hora exacta (UTC) de cada ejecución.
4. **Detección:** En el SIEM, busca eventos correlacionados en una ventana de ±5 minutos. Registra si hubo alerta, qué regla disparó y el MTTD.
5. **Clasificación:** Rellena una tabla con columnas: Técnica | ATT&CK ID | Detectada (S/N/Parcial) | Regla SIEM | MTTD | Evidencia (captura).
6. **Mejora:** Para cada técnica no detectada, escribe una regla Sigma (https://github.com/SigmaHQ/sigma) o una consulta KQL/SPL que la detecte, y pruébala reinyectando el evento.
7. **Informe:** Genera un PDF/markdown de 2-3 páginas con resumen ejecutivo, matriz de cobertura, brechas y recomendaciones priorizadas por CIS Controls.

**Entregable:** Repositorio Git con el informe, las reglas Sigma creadas y las capturas de evidencia.

## CASO
**Caso: Ejercicio Purple Team en una entidad financiera europea (2023, escenario compuesto basado en incidentes reales como el de Banco Santander/ShinyHunters y campañas de ransomware tipo LockBit).**

Una entidad financiera mediana contrató un ejercicio Purple Team tras recibir inteligencia sobre un grupo APT que atacaba el sector con técnicas de *spear-phishing* (T1566.001) seguidas de ejecución de macros (T1204.002) y movimiento lateral vía SMB (T1021.002). El Red Team emuló la cadena completa usando Caldera y un C2 propio (Sliver) durante 5 días. El Blue Team, armado con Splunk ES y CrowdStrike Falcon, monitorizaba en tiempo real.

**Hallazgos clave:**
- El phishing inicial fue detectado por la pasarela de correo (detección OK, MTTD 3 min).
- La ejecución de macro en el endpoint **no generó alerta** durante 47 minutos porque Sysmon no registraba el Event ID 1 con línea de comandos completa (configuración deficiente).
- El movimiento lateral SMB fue detectado por reglas de Splunk, pero el analista tardó 2h 15min en escalarlo por fatiga de alertas (MTTR alto).
- La exfiltración por DNS (T1048.003) **no fue detectada** en absoluto: no había telemetría de DNS interno.

**Lecciones aprendidas aplicadas:**
1. Se desplegó una nueva configuración de Sysmon (basada en Olaf Hartong, https://github.com/olafhartong/sysmon-modular) en 4.000 endpoints en 3 semanas.
2. Se implementaron reglas Sigma convertidas a Splunk para DNS tunneling y se redujo el ruido de alertas en un 62% mediante tuning y *risk-based alerting*.
3. Se alineó el ejercicio con ISO 27001 A.5.7 y se documentó como evidencia para la auditoría de renovación.
4. El siguiente ejercicio se planificó con ATT&CK Navigator para cubrir las tácticas de **Exfiltration** y **Impact**, históricamente las menos monitorizadas.

El caso ilustra que el valor del Purple Team no está en el ataque en sí, sino en la **conversión de hallazgos en controles medibles** (CIS Controls 8.2, 8.5, 13.1) y en la reducción cuantificable de MTTD/MTTR.

## Recursos abiertos
- MITRE ATT&CK – Framework oficial de tácticas y técnicas adversarias: https://attack.mitre.org
- Atomic Red Team – Biblioteca de pruebas de emulación por técnica ATT&CK: https://github.com/redcanaryco/atomic-red-team
- SigmaHQ – Repositorio de reglas de detección genéricas y convertibles a múltiples SIEM: https://github.com/SigmaHQ/sigma

--- [Volver al syllabus](../syllabus.md)
