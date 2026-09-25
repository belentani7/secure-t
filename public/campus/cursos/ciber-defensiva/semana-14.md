# Semana 14: Hardening y lineas base de configuracion

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 14 de 20

## Objetivo de la semana
Comprender los fundamentos del hardening de sistemas y la definición de líneas base de configuración (baselines) como controles preventivos esenciales en un SOC. El estudiante aprenderá a aplicar estándares reconocidos (CIS Benchmarks, NIST SP 800-53, DISA STIG) para reducir la superficie de ataque, y a traducir esas configuraciones en reglas de detección y verificación continua dentro de un programa de gestión de cumplimiento técnico.

## LECTURA

El **hardening** es el proceso sistemático de reducir la superficie de ataque de un activo (servidor, endpoint, contenedor, dispositivo de red, servicio cloud) eliminando servicios innecesarios, cerrando puertos, aplicando permisos mínimos, deshabilitando protocolos legacy y forzando configuraciones seguras. Una **línea base de configuración** (configuration baseline) es el conjunto documentado y versionado de parámetros que representan el estado "seguro conocido" de un sistema, contra el cual se compara su estado real mediante herramientas de cumplimiento (SCAP, OpenSCAP, CIS-CAT, Chef InSpec, Ansible, Microsoft Security Compliance Toolkit). Sin baseline no hay hardening sostenible; sin verificación continua, el hardening se degrada en semanas por cambios operativos, parches y drift de configuración.

Los marcos de referencia son la columna vertebral del hardening:

- **CIS Controls v8** (Center for Internet Security): el Control 4 "Secure Configuration of Enterprise Assets and Software" es el núcleo del hardening, con salvaguardas como 4.1 (establecer y mantener procesos de configuración segura), 4.2 (cambiar credenciales por defecto), 4.6 (configuraciones seguras para activos de usuario) y 4.7 (gestionar cuentas por defecto de aplicaciones). Los **CIS Benchmarks** ofrecen perfiles Level 1 (aplicables en cualquier entorno) y Level 2 (defensa en profundidad, más restrictivos).
- **NIST SP 800-53 Rev.5**: la familia **CM (Configuration Management)** cubre CM-2 (Baseline Configuration), CM-3 (Configuration Change Control), CM-6 (Configuration Settings), CM-7 (Least Functionality) y CM-8 (System Component Inventory). Complementa con **NIST SP 800-123** (Guide to General Server Security) y **NIST SP 800-70 Rev.4** (National Checklist Program).
- **ISO/IEC 27001:2022** Anexo A: controles 8.9 (Configuration Management), 8.8 (Management of Technical Vulnerabilities) y 5.23 (Cloud Services), exigiendo baselines documentadas y auditables.
- **MITRE ATT&CK**: el hardening mitiga directamente tácticas como **TA0001 Initial Access** (T1190 Exploit Public-Facing Application, T1078 Valid Accounts con credenciales por defecto) y **TA0004 Privilege Escalation** (T1548 Abuse Elevation Control, T1068 Exploitation for Privilege Escalation). La técnica **T1562 Impair Defenses** y **T1070 Indicator Removal** se ven obstaculizadas por configuraciones inmutables y logging forzado.
- **OWASP**: para aplicaciones web, el **OWASP ASVS 4.0.3** (sección V14 Configuration) y la **OWASP Secure Headers Project** definen baselines HTTP (HSTS, CSP, X-Content-Type-Options, Referrer-Policy). **DISA STIGs** son baselines prescriptivas usadas en entornos gubernamentales y DoD.

El ciclo operativo de hardening sigue típicamente: (1) **inventario** de activos y versiones; (2) **selección de baseline** (CIS L1/L2, STIG, vendor-hardened); (3) **evaluación** del estado actual con escaneo autenticado (Nessus, Qualys, OpenSCAP, Lynis); (4) **remediación** mediante IaC (Ansible, Puppet, DSC) o GPO; (5) **verificación continua** con agentes de compliance (Wazuh SCA, Chef InSpec, AWS Config, Azure Policy); (6) **gestión de excepciones** documentadas con riesgo aceptado. El *drift* de configuración es el enemigo silencioso: un administrador que abre un puerto para una prueba y lo olvida reintroduce vulnerabilidad. Por eso en un SOC moderno el hardening no es un proyecto puntual sino un **control continuo** monitoreado con alertas ante desviaciones. Las excepciones deben registrarse como riesgos formales (ISO 27005) y revisarse periódicamente.

Finalmente, el hardening debe alinearse con **Zero Trust** (NIST SP 800-207): no confiar en la red, verificar explícitamente, asumir breach. Esto implica que incluso sistemas "internos" deben mantener baselines estrictas, autenticación fuerte y mínimo privilegio.

## EJERCICIO

**Objetivo:** Aplicar un CIS Benchmark a un servidor Linux Ubuntu 22.04 en laboratorio, generar una baseline con OpenSCAP y configurar verificación continua con Wazuh SCA.

**Requisitos:** VM Ubuntu 22.04 (VirtualBox/VMware), acceso root, conexión a internet.

**Pasos:**

1. **Inventario inicial.** Ejecuta `uname -a`, `lsb_release -a`, `ss -tulnp` y `systemctl list-units --type=service --state=running`. Documenta servicios activos y puertos en escucha en un archivo `inventario.md`.

2. **Descarga del CIS Benchmark.** Obtén el PDF oficial de CIS Ubuntu Linux 22.04 LTS Benchmark v2.0.0 desde https://www.cisecurity.org/benchmark/ubuntu_linux (requiere registro gratuito). Identifica 10 controles del perfil Level 1 de la sección 1 (Filesystem), 2 (Services) y 5 (Access Control).

3. **Instalación de OpenSCAP.**
   ```
   sudo apt update && sudo apt install -y libopenscap8 openscap-scanner scap-security-guide
   ```

4. **Escaneo con perfil CIS.** Localiza el datastream:
   ```
   ls /usr/share/xml/scap/ssg/content/
   oscap xccdf eval --profile cis_level1_server \
     --results /tmp/scan-cis.xml \
     --report /tmp/scan-cis.html \
     /usr/share/xml/scap/ssg/content/ssg-ubuntu2204-ds.xml
   ```
   Abre el HTML y anota el porcentaje de cumplimiento inicial y las 5 reglas fallidas más críticas.

5. **Remediación manual de 3 hallazgos.** Ejemplos típicos:
   - Deshabilitar `cramfs` y `freevxfs` en `/etc/modprobe.d/`.
   - Configurar `PermitRootLogin no` en `/etc/ssh/sshd_config`.
   - Establecer `umask 027` en `/etc/profile` y `/etc/bash.bashrc`.
   Documenta cada cambio con comando, archivo modificado y justificación.

6. **Verificación con Wazuh SCA.** Instala Wazuh Agent en la VM y conecta a un manager (o usa Docker con `wazuh/wazuh-manager`). Habilita el módulo SCA en `ossec.conf` apuntando a una política basada en CIS:
   ```xml
   <sca>
     <enabled>yes</enabled>
     <scan_on_start>yes</scan_on_start>
     <interval>12h</interval>
   </sca>
   ```
   Accede al dashboard y revisa el score SCA por política.

7. **Re-escaneo y comparación.** Vuelve a ejecutar OpenSCAP y compara el porcentaje. Genera un informe de 1 página con: estado inicial, cambios aplicados, estado final, excepciones justificadas.

**Entregable:** Informe PDF/markdown con capturas del dashboard Wazuh SCA, salida de OpenSCAP antes/después y reflexión sobre qué controles son inviables en un entorno productivo y por qué.

## CASO

**Caso: Brecha de Capital One (2019) y el rol del hardening en la nube.**

En julio de 2019, Capital One sufrió una brecha que expuso datos de aproximadamente 100 millones de clientes en EE.UU. y 6 millones en Canadá. La atacante, una ex-empleada de AWS, explotó una **Server-Side Request Forgery (SSRF)** en un WAF mal configurado (ModSecurity en un Application Load Balancer) para obtener credenciales temporales del rol IAM del EC2 metadata service (`http://169.254.169.254/`). Con esas credenciales, enumeró buckets S3 y exfiltró información.

El análisis post-incidente (informe del Senado de EE.UU., 2020) reveló fallas directas de hardening y baseline:

- **IMDSv1 habilitado**: el Instance Metadata Service versión 1 no requería token, permitiendo SSRF. AWS ya recomendaba IMDSv2 (con sesión PUT obligatoria). Esto es un control de baseline de configuración cloud.
- **Rol IAM con permisos excesivos**: violaba el principio de mínimo privilegio (CIS Controls 5 y 6; NIST AC-6). El rol permitía `s3:ListBucket` y `s3:GetObject` sobre demasiados recursos.
- **Falta de cifrado y monitoreo en S3**: los buckets no aplicaban políticas restrictivas ni alertas ante descargas masivas.
- **Configuración del WAF**: reglas ModSecurity desactualizadas y sin bloqueo de SSRF saliente.

Alineando con **MITRE ATT&CK**, la cadena fue: *T1190 (Exploit Public-Facing Application) → T1552.005 (Unsecured Credentials: Cloud Instance Metadata API) → T1530 (Data from Cloud Storage) → T1567 (Exfiltration Over Web Service)*.

**Lecciones de hardening y baseline:**
1. Forzar **IMDSv2** en todas las instancias EC2 (control CIS AWS Foundations Benchmark 1.x y AWS Config rule `ec2-imdsv2-check`).
2. Aplicar **SCPs (Service Control Policies)** y roles IAM con least privilege, auditados con IAM Access Analyzer.
3. Habilitar **AWS Config**, **GuardDuty**, **CloudTrail** con integridad y alertas SIEM.
4. Definir baselines cloud con **CIS AWS Foundations Benchmark v3.0** y verificar continuamente con herramientas como Prowler, ScoutSuite o Steampipe.
5. Implementar **defense in depth**: aunque el WAF falle, IMDSv2+IAM restringido+monitoreo

--- [Volver al syllabus](../syllabus.md)
