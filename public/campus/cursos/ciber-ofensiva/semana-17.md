# Semana 17: Red teaming wireless y fisico

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 17 de 20

## Objetivo de la semana
El estudiante aprenderá a planificar y ejecutar operaciones de red teaming en los dominios inalámbrico y físico, aplicando metodologías de adversario real para evaluar controles de acceso, segmentación y resiliencia. Se capacitará en el uso de hardware especializado, técnicas de evasión y correlación de hallazgos con marcos como MITRE ATT&CK, NIST SP 800-115 y CIS Controls, integrando el resultado en informes de riesgo accionables.

## LECTURA
El red teaming wireless y físico extiende la evaluación más allá de la red cableada, atacando la capa de acceso físico y el espectro radioeléctrico, que suelen ser los eslabones más débiles en defensas perimetrales. Mientras el pentesting tradicional se enfoca en aplicaciones y redes, el red teaming físico simula a un adversario con presencia cercana (insider, contratista, visitante) que busca obtener acceso a instalaciones, puertos desprotegidos, credenciales en post-its o dispositivos de red expuestos. En el ámbito wireless, se abordan redes Wi-Fi (WPA2/WPA3, WPS, EAP), Bluetooth/BLE, Zigbee, RFID/NFC y sistemas de radiofrecuencia como alarmas o controles de acceso.

MITRE ATT&CK for Enterprise incluye tácticas relevantes: *Initial Access* (T1200 Hardware Additions, T1078 Valid Accounts), *Credential Access* (T1110 Brute Force, T1557 Adversary-in-the-Middle), *Discovery* (T1040 Network Sniffing, T1016 System Network Configuration Discovery) y *Lateral Movement* (T1210 Exploitation of Remote Services). En el dominio móvil/ICS, ATT&CK for Mobile y ATT&CK for ICS cubren técnicas como abuso de Bluetooth y manipulación de controladores de acceso físico.

NIST SP 800-115 (Technical Guide to Information Security Testing and Assessment) define fases de planificación, descubrimiento, ataque y reporte, aplicables a evaluaciones inalámbricas y físicas. El CIS Controls v8 aporta salvaguardas concretas: Control 1 (Inventory of Enterprise Assets), Control 3 (Data Protection), Control 4 (Secure Configuration), Control 6 (Access Control Management) y Control 12 (Network Infrastructure Management), que se ven directamente comprometidas por un ataque wireless exitoso o un acceso físico no autorizado.

ISO/IEC 27001:2022, en sus controles A.7 (Seguridad física y ambiental) y A.8 (Seguridad de activos), exige perímetros físicos, protección contra amenazas ambientales y control de acceso a áreas sensibles; el red teaming físico verifica la eficacia real de estos controles. OWASP aporta el *Internet of Things (IoT) Top 10*, donde I1 (Weak, Guessable, or Hardcoded Passwords) y I3 (Insecure Network Services) son habituales en dispositivos Wi-Fi, cámaras y sensores desplegados en entornos corporativos.

Las técnicas wireless más relevantes incluyen: reconocimiento pasivo con adaptadores en modo monitor (captura de beacons, probe requests, PMKID), ataques de handshake WPA/WPA2 para cracking offline, *Evil Twin* y *Rogue AP* para capturar credenciales mediante portales cautivos, ataques *deauth* para forzar reconexión, y explotación de WPS con Pixie Dust. En WPA3, se estudian downgrades a WPA2, ataques *Dragonblood* (CVE-2019-9494/9495) y *side-channel* en SAE. Bluetooth/BLE permite *Bluejacking*, *Bluesnarfing*, *KNOB attack* (CVE-2019-9506) y abuso de GATT para extraer datos. RFID/NFC se ataca con clonado de tarjetas MIFARE Classic (Crypto1) o HID Prox.

En el plano físico, las técnicas incluyen *tailgating*, *piggybacking*, uso de lockpicks y *bump keys*, clonado de badges RFID, implantación de *drop devices* (Raspberry Pi, LAN Turtle, Bash Bunny) en puertos Ethernet expuestos, y *USB drop attacks* (Rubber Ducky). La metodología sigue el ciclo de kill chain: reconocimiento (OSINT, visita a pie), acceso inicial (bypass de torniquetes, puertas), establecimiento de persistencia (implantes), escalada y exfiltración. Todo debe realizarse bajo un *Rules of Engagement* (RoE) firmado, con alcance, ventanas de tiempo y contactos de emergencia, conforme a NIST SP 800-115 §3 y al PTES (Penetration Testing Execution Standard).

## EJERCICIO
**Objetivo:** Ejecutar una operación de red teaming wireless y físico contra un entorno de laboratorio controlado, documentando hallazgos con mapeo a MITRE ATT&CK y CIS Controls.

**Materiales:**
- Adaptador Wi-Fi con soporte monitor/injection (Alfa AWUS036ACH o similar)
- Raspberry Pi 4 con Kali Linux
- Flipper Zero o Proxmark3 (opcional para RFID)
- LAN Turtle o similar para implante físico
- Laboratorio con un AP WPA2 (router doméstico) y un switch accesible

**Pasos:**
1. **Reconocimiento pasivo (30 min):** Pon el adaptador en modo monitor (`airmon-ng start wlan0`). Captura tráfico durante 10 minutos con `airodump-ng wlan0mon -w captura --output-format pcap`. Identifica BSSIDs, canales, cifrado, clientes y fabricantes (OUI lookup).
2. **Análisis de handshake/PMKID:** Lanza `hcxdumptool` para capturar PMKID sin esperar clientes: `hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1`. Convierte con `hcxpcapngtool` a hash 22000 y ejecuta `hashcat -m 22000 pmkid.22000 rockyou.txt` para evaluar fortaleza de PSK.
3. **Evil Twin + portal cautivo:** Con `hostapd-wpe` o `wifiphisher`, replica el SSID objetivo y despliega un portal falso. Documenta si las credenciales son capturadas y en qué tiempo.
4. **Acceso físico simulado:** Con RoE del instructor, accede al rack del laboratorio. Conecta la LAN Turtle a un puerto Ethernet libre y configura *reverse shell* hacia tu Pi. Documenta el tiempo desde entrada hasta shell.
5. **Clonado RFID:** Con Proxmark3, lee una tarjeta MIFARE Classic del lab (`hf mf autopwn`) y clona a un magic card. Verifica acceso al lector.
6. **Mapeo y reporte:** Tabula cada técnica con su ID MITRE ATT&CK (ej. T1200, T1557, T1040) y el CIS Control vulnerado. Redacta un informe ejecutivo de 2 páginas con severidad CVSS v3.1 y recomendaciones (WPA3-Enterprise, 802.1X, NAC, control de acceso físico con doble factor).

**Entregable:** Informe PDF con capturas, hashes, timeline y matriz de cobertura ATT&CK.

## CASO
**Caso real: Red teaming físico en una entidad financiera (2022, divulgado por el equipo de IBM X-Force Red).** En una evaluación autorizada, el equipo identificó que la sede corporativa tenía torniquetes controlados por badges MIFARE Classic. Mediante reconocimiento OSINT, obtuvieron fotos de empleados en LinkedIn y determinaron el modelo de badge. Con un Proxmark3 oculto en una mochila, un operador se acercó a un empleado en la cafetería y clonó su tarjeta a 5 cm sin contacto físico (ataque *skimming* RFID). Con el clon, accedieron al edificio por una puerta lateral sin cámaras. Una vez dentro, localizaron una sala de telecomunicaciones con un switch Cisco sin 802.1X; conectaron un implante (Raspberry Pi Zero con 4G) y obtuvieron persistencia. Desde ahí, pivotaron a la VLAN de administración y extrajeron credenciales de dominio vía LLMNR/NBT-NS poisoning (Responder). El ejercicio demostró que, aunque la red inalámbrica usaba WPA3-Enterprise con certificados, el eslabón físico anuló todas las defensas lógicas. Los hallazgos se mapearon a MITRE ATT&CK (T1200, T1557.001, T1040) y derivaron en un plan de remediación: migración a badges con cifrado AES (MIFARE DESFire EV3), despliegue de 802.1X con MAB en todos los puertos, y auditoría física trimestral alineada a ISO 27001 A.7.4. El caso ilustra que el red teaming físico y wireless debe integrarse en un programa continuo de *adversary emulation*, no como ejercicio puntual, y que el RoE debe cubrir explícitamente el manejo de datos sensibles capturados durante la operación.

## Recursos abiertos
- MITRE ATT&CK Enterprise – Técnicas relevantes: https://attack.mitre.org/tactics/enterprise/
- NIST SP 800-115, Technical Guide to Information Security Testing and Assessment: https://csrc.nist.gov/publications/detail/sp/800-115/final
- CIS Controls v8: https://www.cisecurity.org/controls/v8
- OWASP Internet of Things Top 10: https://owasp.org/www-project-internet-of-things/
- Proxmark3 GitHub (herramienta RFID/NFC): https://github.com/RfidResearchGroup/proxmark3
- Aircrack-ng Suite (documentación oficial): https://www.aircrack-ng.org/documentation.html
- ISO/IEC 27001:2022 controles A.7 y A.8: https://www.iso.org/standard/27001

--- [Volver al syllabus](../syllabus.md)
