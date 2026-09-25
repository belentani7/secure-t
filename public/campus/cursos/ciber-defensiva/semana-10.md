# Semana 10: Analisis de trafico de red con Zeek/Suricata

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 10 de 20

## Objetivo de la semana
Comprender los fundamentos del análisis de tráfico de red mediante herramientas IDS/NSM como Zeek y Suricata, diferenciando sus enfoques (registro de flujos vs. detección por firmas). El estudiante aprenderá a desplegar sensores, interpretar logs, escribir reglas de detección y correlacionar eventos con tácticas del MITRE ATT&CK para fortalecer la monitorización defensiva en un SOC.

## LECTURA
El análisis de tráfico de red constituye una de las fuentes de telemetría más valiosas para un Centro de Operaciones de Seguridad (SOC), ya que permite observar actividad maliciosa incluso cuando el endpoint no tiene agente o el atacante emplea técnicas *living-off-the-land*. En este contexto, **Zeek** (antes Bro) y **Suricata** son dos pilares complementarios: Zeek es un Network Security Monitor (NSM) que genera logs estructurados de alto nivel (conn.log, dns.log, http.log, ssl.log, files.log, notice.log, entre otros) sin bloquear tráfico, mientras que Suricata es un IDS/IPS multihilo capaz de inspeccionar firmas, hacer *protocol parsing*, extracción de ficheros y aplicar *rulesets* compatibles con Snort. Ambos se alinean con la categoría **DE.CM-1 (Network Monitoring)** del marco NIST CSF 2.0 y con el control **CIS Control 13 (Network Monitoring and Defense)**, además de ser mencionados explícitamente en las guías NIST SP 800-94 y SP 800-61r2 para respuesta a incidentes.

Desde la perspectiva del **MITRE ATT&CK**, el análisis de red permite detectar tácticas como *Command and Control* (T1071 – Application Layer Protocol, T1573 – Encrypted Channel), *Exfiltration* (T1041 – Exfiltration Over C2 Channel) y *Discovery* (T1046 – Network Service Discovery). Por ejemplo, picos anómalos en `conn.log` con duración larga y bytes asimétricos pueden indicar *beaconing*; consultas DNS con dominios generados algorítmicamente (DGA) se reflejan en `dns.log` y son detectables con el framework **Zeek Intelligence Framework** o reglas Suricata como `sid:2027757` (ET DNS Query to a *.top domain). En cuanto a estándares, la **ISO/IEC 27001:2022** en su control 8.16 (Monitoring activities) y el Anexo A 8.20 (Networks security) exigen monitorización continua y detección de intrusiones, mientras que **OWASP** recomienda en su Top 10 (A09:2021 – Security Logging and Monitoring Failures) precisamente este tipo de visibilidad.

La arquitectura típica de despliegue incluye un **sensor con interfaz en modo promiscuo o TAP/SPAN**, gestión con **ZeekControl o zeekctl** y **Suricata con suricata-update** para reglas ET Open. Los logs de Zeek se envían a un SIEM (Elastic Stack, Splunk, Wazuh) y las alertas de Suricata a `eve.json` en formato JSON para ingesta directa. Es fundamental aplicar **BPF filters** para reducir ruido, normalizar timestamps en UTC, y correlacionar `uid` de Zeek con `flow_id` de Suricata cuando se ejecutan en paralelo sobre el mismo tráfico. La madurez del SOC se mide por su capacidad de convertir estos logs en detecciones accionables, no por el volumen bruto recolectado.

## EJERCICIO
**Objetivo:** Desplegar Zeek y Suricata sobre una captura PCAP real, analizar logs y crear una regla de detección personalizada.

**Entorno:** Máquina Linux (Ubuntu 22.04 o Debian 12) con al menos 2 GB RAM y 20 GB disco. Usaremos el PCAP público `2019-11-06-traffic-analysis-exercise.pcap` de malware-traffic-analysis.net.

**Pasos:**

1. **Instalación:**
   ```bash
   sudo apt update
   sudo apt install -y zeek suricata jq tshark
   sudo suricata-update
   ```

2. **Análisis con Zeek:**
   ```bash
   mkdir -p ~/lab/zeek && cd ~/lab/zeek
   zeek -r ~/pcaps/2019-11-06-traffic-analysis-exercise.pcap
   ls *.log
   ```
   Inspecciona:
   - `cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p proto duration orig_bytes resp_bytes | head -30`
   - `cat dns.log | zeek-cut query answers | sort | uniq -c | sort -rn | head`
   - `cat http.log | zeek-cut host uri user_agent | head -20`

3. **Análisis con Suricata:**
   ```bash
   suricata -r ~/pcaps/2019-11-06-traffic-analysis-exercise.pcap -l ~/lab/suricata -c /etc/suricata/suricata.yaml
   jq 'select(.event_type=="alert") | {ts, src_ip, dest_ip, alert}' ~/lab/suricata/eve.json | head -50
   ```

4. **Crear regla personalizada** en `/etc/suricata/rules/local.rules`:
   ```
   alert http $HOME_NET any -> $EXTERNAL_NET any (msg:"LAB - User-Agent sospechoso PowerShell"; flow:to_server,established; http.user_agent; content:"PowerShell"; nocase; classtype:trojan-activity; sid:1000001; rev:1;)
   ```
   Recarga y reejecuta Suricata; verifica que la alerta aparece en `eve.json`.

5. **Correlación:** Identifica en `conn.log` la IP del host comprometido y el dominio C2. Documenta el `uid` de Zeek y el `flow_id` de Suricata para la misma sesión.

**Entregable:** Informe markdown con (a) top 5 dominios consultados, (b) IP del C2 identificada, (c) captura de la alerta personalizada, (d) mapeo de la actividad a al menos 2 técnicas MITRE ATT&CK.

## CASO
**Caso real: Ataque a SolarWinds (2020) y la relevancia del análisis de red.** Aunque el vector inicial fue la cadena de suministro en el código de Orion, los equipos de respuesta de FireEye y Microsoft detectaron actividad post-compromiso analizando tráfico de red anómalo: comunicaciones HTTPS hacia dominios `avsvmcloud[.]com` con patrones de *beaconing* periódico. En los logs de Zeek, estos flujos aparecían como sesiones `ssl.log` con JA3 fingerprints poco comunes y duraciones constantes; en Suricata, reglas ET detectaron los certificados TLS con campos inusuales. Los atacantes, atribuidos a APT29 (Cozy Bear), usaron técnicas mapeadas como **T1071.001 (Web Protocols)**, **T1573.002 (Asymmetric Cryptography)** y **T1027 (Obfuscated Files or Information)**. Este incidente demostró que sin visibilidad de red —incluso con tráfico cifrado— es imposible detectar C2 sofisticado; la combinación de metadatos de Zeek (SNI, JA3, duración, bytes) y firmas Suricata permitió a los analistas pivotar desde una alerta aislada hasta la atribución completa del actor. Aprendizaje clave: los logs de red no son un "nice to have", son evidencia forense crítica y deben retenerse según políticas alineadas a **NIST SP 800-61r2** y **ISO 27037** para preservación de evidencia digital.

## Recursos abiertos
- Documentación oficial de Zeek: https://docs.zeek.org/en/current/
- Documentación oficial de Suricata: https://docs.suricata.io/en/latest/
- Reglas Emerging Threats Open (Suricata): https://rules.emergingthreats.net/open/
- PCAPs de entrenamiento de malware-traffic-analysis.net: https://www.malware-traffic-analysis.net/training-exercises.html
- MITRE ATT&CK – Tactic Command and Control: https://attack.mitre.org/tactics/TA0011/

--- [Volver al syllabus](../syllabus.md)
