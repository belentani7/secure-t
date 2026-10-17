# Semana 19: Resiliencia: backup, DR y continuidad

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 19 de 20

## Objetivo de la semana
Comprender los principios de resiliencia operativa y recuperación ante desastres dentro de un SOC moderno, diferenciando entre backup, alta disponibilidad, continuidad de negocio (BCP) y recuperación ante desastres (DRP). El estudiante aprenderá a diseñar estrategias de respaldo alineadas a estándares como NIST SP 800-34, ISO 22301 e ISO 27001, aplicando métricas RTO/RPO y validando su efectividad frente a ataques reales como ransomware.

## LECTURA

La resiliencia en ciberseguridad no consiste únicamente en prevenir intrusiones, sino en garantizar que la organización pueda **resistir, absorber y recuperarse** de un incidente con impacto operativo. El estándar **NIST SP 800-34 Rev. 1** ("Contingency Planning Guide for Federal Information Systems") define cuatro componentes esenciales: Plan de Continuidad de Operaciones (COOP), Plan de Recuperación ante Desastres (DRP), Plan de Respuesta a Incidentes (IRP) y Plan de Contingencia de Sistemas de Información. En paralelo, **ISO 22301** establece los requisitos para un Sistema de Gestión de Continuidad de Negocio (BCMS), mientras que **ISO/IEC 27001:2022** incluye controles específicos en el Anexo A (5.29, 5.30, 8.13, 8.14) sobre continuidad TIC y redundancia de información.

Los conceptos clave que todo analista SOC debe dominar son:

- **RTO (Recovery Time Objective):** tiempo máximo tolerable de interrupción antes de que el impacto sea inaceptable.
- **RPO (Recovery Point Objective):** cantidad máxima de datos que la organización puede permitirse perder, medida en tiempo.
- **MTD (Maximum Tolerable Downtime):** ventana total de indisponibilidad admisible.
- **Regla 3-2-1-1-0:** 3 copias de los datos, en 2 medios distintos, 1 fuera de sitio, 1 inmutable/offline, 0 errores verificados tras pruebas de restauración.

**MITRE ATT&CK** documenta tácticas directamente relacionadas con la destrucción de respaldos: **T1485 (Data Destruction)**, **T1486 (Data Encrypted for Impact)**, **T1490 (Inhibit System Recovery)** y **T1561 (Disk Wipe)**. Ransomware como Ryuk, Conti y LockBit han incorporado rutinas específicas para eliminar shadow copies (`vssadmin delete shadows`), deshabilitar el servicio de backup de Windows y cifrar repositorios Veeam o NetBackup accesibles por SMB. Por ello, los **CIS Controls v8** recomiendan en el Control 11 ("Data Recovery") mantener respaldos aislados, cifrados y con pruebas de restauración trimestrales.

Un DRP maduro separa **backups operacionales** (para errores humanos o corrupción) de **backups de recuperación ante desastres** (para pérdida total del sitio primario). Se recomienda arquitectura **air-gapped** o **immutable storage** (WORM, S3 Object Lock), autenticación multifactor para consolas de backup, y cuentas de servicio con privilegios mínimos. Finalmente, todo DRP debe probarse: un backup nunca restaurado no es un backup, es una hipótesis.

## EJERCICIO

**Objetivo:** Diseñar, implementar y validar un plan de backup y recuperación para una PYME ficticia ("FinTech Andes S.A.") que opera un servidor de base de datos PostgreSQL y un servidor de archivos SMB.

**Paso 1 – Inventario y clasificación de activos**
- Lista los activos críticos, su criticidad (alta/media/baja) y los RTO/RPO propuestos (ej. DB: RTO 4h / RPO 15min).
- Usa una plantilla basada en NIST SP 800-34 Apéndice A.

**Paso 2 – Diseño de la estrategia 3-2-1-1-0**
- Copia 1: local en el servidor (snapshot LVM).
- Copia 2: NAS local con `rsync` cifrado.
- Copia 3: bucket remoto con **S3 Object Lock en modo Compliance** (inmutabilidad).
- Copia offline: disco rotativo semanal guardado fuera de sitio.

**Paso 3 – Implementación técnica (entorno de laboratorio)**
- Instala **Restic** o **BorgBackup** en una VM Linux.
- Configura un repositorio remoto con `restic init --repo sftp:user@host:/backups`.
- Programa backups con `systemd timer` cada 6 horas y política de retención `--keep-daily 7 --keep-weekly 4 --keep-monthly 12`.
- Aplica cifrado AES-256 y verifica con `restic check --read-data-subset=5%`.

**Paso 4 – Simulación de ataque**
- Ejecuta en una VM de prueba un script que simule T1490: eliminar shadow copies y borrar el repositorio local.
- Verifica que el repositorio remoto inmutable permanezca intacto.

**Paso 5 – Prueba de restauración (DR Drill)**
- Mide el tiempo real de restauración y compáralo contra el RTO declarado.
- Documenta resultados en un informe con: fecha, activo restaurado, RTO real, RPO real, lecciones aprendidas.

**Entregable:** Documento PDF con estrategia, comandos ejecutados, evidencia de restauración y matriz de riesgos residuales.

## CASO

**Caso: Ataque de ransomware a Kaseya VSA (julio 2021) – REvil/Sodinokibi**

El 2 de julio de 2021, el grupo REvil explotó una vulnerabilidad zero-day (CVE-2021-30116) en Kaseya VSA, plataforma de gestión remota usada por MSPs. El ataque afectó a más de 1.500 empresas downstream en 17 países. El impacto fue devastador no solo por el cifrado de endpoints, sino porque **los atacantes buscaron activamente los servidores de backup** de los MSPs para destruirlos antes de desplegar el cifrado masivo, siguiendo el patrón MITRE **T1490 (Inhibit System Recovery)**.

**Lecciones clave de resiliencia:**

1. **Backups accesibles desde la red comprometida = backups perdidos.** Muchos MSPs tenían repositorios montados por SMB con las mismas credenciales de dominio, lo que permitió su borrado.
2. **Falta de inmutabilidad:** sin WORM ni air-gap, el ransomware cifró o eliminó los respaldos en minutos.
3. **Ausencia de pruebas de restauración:** varias víctimas descubrieron durante el incidente que sus backups llevaban meses fallando silenciosamente.
4. **Concentración de riesgo (supply chain):** un solo proveedor comprometido derribó la continuidad de cientos de negocios.

**Resultado:** Kaseya publicó parches de emergencia, el FBI obtuvo una clave de descifrado universal, y la industria adoptó masivamente el modelo **"backup inmutable + MFA + segmentación"** recomendado por CISA en su guía #StopRansomware. Este caso es hoy material obligatorio en ejercicios de tabletop de DRP y demuestra que la resiliencia se diseña **antes** del incidente, asumiendo que el atacante ya tiene acceso al entorno productivo.

## Recursos abiertos
- https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final — NIST SP 800-34 Rev. 1, Contingency Planning Guide.
- https://www.iso.org/standard/75106.html — ISO 22301:2019, Security and resilience — Business continuity management systems.
- https://attack.mitre.org/techniques/T1490/ — MITRE ATT&CK T1490: Inhibit System Recovery.
- https://www.cisa.gov/stopransomware/ransomware-guide — CISA #StopRansomware Guide (sección de backups).
- https://www.cisecurity.org/controls/data-recovery — CIS Critical Security Controls v8, Control 11: Data Recovery.

--- [Volver al syllabus](../syllabus.md)
