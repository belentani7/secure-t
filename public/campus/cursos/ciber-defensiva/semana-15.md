# Semana 15: Gestion de identidades y acceso (IAM)

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 15 de 20

## Objetivo de la semana
Comprender los fundamentos de la Gestión de Identidades y Accesos (IAM), su rol crítico como control preventivo y detective en un SOC moderno, y cómo los atacantes abusan de identidades comprometidas para moverse lateralmente y persistir. El estudiante aprenderá a diseñar, auditar y monitorear controles IAM alineados con marcos como NIST SP 800-207 (Zero Trust), CIS Controls v8 y MITRE ATT&CK, aplicándolos a la detección de técnicas como T1078 (Valid Accounts) y T1110 (Brute Force).

## LECTURA

La Gestión de Identidades y Accesos (IAM, Identity and Access Management) es el conjunto de políticas, procesos y tecnologías que garantizan que las personas y sistemas adecuados accedan a los recursos correctos, en el momento y contexto apropiados. En ciberseguridad defensiva, IAM deja de ser solo un área de TI administrativa y se convierte en la primera línea de defensa del SOC, ya que la mayoría de las brechas modernas (según Verizon DBIR, más del 80%) involucran credenciales comprometidas, abuso de cuentas privilegiadas o identidades mal gestionadas.

Los cuatro pilares clásicos de IAM son: **Identificación** (asignar una identidad única a cada sujeto), **Autenticación** (verificar que esa identidad es quien dice ser), **Autorización** (definir qué puede hacer) y **Auditoría/Accountability** (registrar y revisar lo que hizo). A estos se suma hoy la **Federación** (SAML, OAuth 2.0, OIDC) y la **gestión del ciclo de vida** (joiner-mover-leaver), que en entornos cloud híbridos es crítica.

El estándar **NIST SP 800-63B** define niveles de garantía de autenticación (AAL1–AAL3) y desaconseja el cambio periódico obligatorio de contraseñas, priorizando longitud, verificación contra listas de contraseñas filtradas (HIBP) y autenticación multifactor resistente al phishing (FIDO2/WebAuthn). El **NIST SP 800-207 (Zero Trust Architecture)** establece que ninguna identidad debe ser confiada por defecto, ni siquiera dentro de la red: cada acceso se evalúa con PDP/PEP (Policy Decision/Enforcement Point) según identidad, dispositivo, contexto y postura.

El **CIS Controls v8** dedica los controles 5 (Account Management) y 6 (Access Control Management) a IAM: inventario de cuentas, desactivación de cuentas huérfanas, principio de mínimo privilegio, separación de funciones administrativas y uso de MFA en todos los accesos administrativos. **ISO/IEC 27001:2022** cubre IAM en los controles A.5.15–A.5.18 (control de acceso, gestión de identidades, derechos de acceso privilegiado, autenticación) y A.8.2–A.8.5 (gestión de privilegios, autenticación, MFA).

Desde la óptica del atacante, **MITRE ATT&CK** modela el abuso de identidades en la táctica *Credential Access* (TA0006) y *Privilege Escalation* (TA0004): T1078 (Valid Accounts) es una de las técnicas más usadas en intrusiones cloud, T1110 (Brute Force) incluye Password Spraying, y T1556 (Modify Authentication Process) ataca directamente a los proveedores de identidad. En entornos cloud, ATT&CK for Cloud añade técnicas como T1078.004 (Cloud Accounts) y T1526 (Cloud Service Discovery).

Un IAM defensivo en el SOC requiere: (1) inventario y clasificación de identidades humanas, máquinas y de servicio; (2) MFA phishing-resistant en todos los accesos privilegiados; (3) PAM (Privileged Access Management) con bóvedas de credenciales, sesiones grabadas y just-in-time access; (4) revisión periódica de accesos (access recertification); (5) monitoreo continuo de eventos de autenticación en SIEM (Event ID 4624/4625/4648 en Windows, CloudTrail/Entra ID sign-in logs en cloud) con detección de anomalías (impossible travel, MFA fatigue, token theft); (6) gestión de secretos para cuentas no humanas (HashiCorp Vault, AWS Secrets Manager). Sin IAM robusto, cualquier control perimetral es insuficiente.

## EJERCICIO

**Objetivo:** Detectar y analizar abuso de identidades en un laboratorio Windows + Entra ID simulado, aplicando reglas Sigma y consultas KQL.

**Herramientas:** Windows Server con AD, una cuenta de prueba, Sysmon, Splunk Free o Microsoft Sentinel (trial), Atomic Red Team, y reglas Sigma del repositorio SigmaHQ.

**Pasos:**
1. Despliega un dominio AD de laboratorio y habilita auditoría de autenticación (`auditpol /set /subcategory:"Logon" /success:enable /failure:enable`). Instala Sysmon con la config de SwiftOnSecurity.
2. Simula la técnica **T1110.003 (Password Spraying)** con Atomic Red Team: `Invoke-AtomicTest T1110.003`. Captura los eventos 4625 en el DC.
3. Simula **T1078 (Valid Accounts)** autenticándote con una cuenta de servicio y ejecutando `net group "Domain Admins" /domain` para reconocimiento. Captura el 4624 tipo 3 y 10.
4. Ingesta los logs en tu SIEM y aplica la regla Sigma *"Multiple Failed Logons Followed by Success"* (convertida con `sigma-cli` a tu backend).
5. Escribe una consulta KQL/Splunk que detecte *impossible travel*: compara `SigninLogs` de Entra ID (o 4624 con IP) buscando dos inicios de sesión exitosos de la misma cuenta desde geolocalizaciones distintas en <30 minutos.
6. Documenta en una tabla: técnica ATT&CK, evento fuente, campo clave, umbral de detección, y falso positivo esperado.
7. Propón dos controles CIS v8 (5.x y 6.x) que habrían mitigado cada técnica.

**Entregable:** Informe de 2 páginas con capturas, reglas YAML/Sigma, consultas y matriz de cobertura ATT&CK.

## CASO

**Caso real: compromiso de identidad en el ataque a Okta/MGM Resorts (2023)**

En septiembre de 2023, el grupo Scattered Spider (también tracked como UNC3944, vinculado a ALPHV/BlackCat) comprometió MGM Resorts, Caesars y otros casinos mediante un ataque centrado en identidades, no en exploits. La cadena fue:

1. **Reconocimiento en LinkedIn** para identificar empleados del help desk de TI.
2. **Vishing (voice phishing)** suplantando a un empleado, para obtener restablecimiento de MFA (técnica T1621 – *Multi-Factor Authentication Request Generation*, y T1566.004 – *Spearphishing Voice*).
3. **Acceso con credenciales válidas** (T1078) al proveedor de identidad Okta, obteniendo tokens y accediendo a sistemas internos.
4. **Movimiento lateral** hacia la infraestructura de virtualización (VMware vCenter/ESXi) y despliegue de ransomware ALPHV.

El fallo clave fue de IAM: MFA basado en SMS/push vulnerable a *MFA fatigue*, procesos de help desk sin verificación robusta de identidad, y ausencia de *phishing-resistant MFA* (FIDO2). Okta publicó posteriormente un informe reconociendo el vector de soporte. MGM sufrió pérdidas estimadas en ~100 M$ y días de interrupción operativa.

**Lecciones defensivas alineadas con marcos:**
- **NIST SP 800-63B AAL3**: MFA resistente a phishing obligatorio para accesos privilegiados.
- **CIS Control 6.5**: exigir MFA para todas las cuentas administrativas.
- **MITRE ATT&CK mitigations M1032 (MFA) y M1017 (User Training)**.
- **ISO 27001 A.5.17**: gestión de credenciales de autenticación y verificación de identidad en restablecimientos.
- Detección SOC: alertas sobre cambios de método MFA, enrollamientos de dispositivos nuevos, y *impossible travel* en sign-in logs de Okta/Entra ID.

El caso demuestra que IAM ya no es un control perimetral, sino el nuevo perímetro mismo: si el atacante se convierte en un usuario legítimo, las herramientas tradicionales fallan y solo el monitoreo de identidad (ITDR, *Identity Threat Detection and Response*) permite detectarlo.

## Recursos abiertos
- NIST SP 800-63B – Digital Identity Guidelines: https://pages.nist.gov/800-63-3/sp800-63b.html
- NIST SP 800-207 – Zero Trust Architecture: https://csrc.nist.gov/publications/detail/sp/800-207/final
- MITRE ATT&CK – Credential Access (TA0006): https://attack.mitre.org/tactics/TA0006/
- CIS Controls v8 – Control 5 y 6: https://www.cisecurity.org/controls/cis-controls-list
- SigmaHQ – Reglas de detección abiertas: https://github.com/SigmaHQ/sigma
- Atomic Red Team – Simulación T1078/T1110: https://github.com/redcanaryco/atomic-red-team

--- [Volver al syllabus](../syllabus.md)
