# Semana 18: Ingenieria social y phishing

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 18 de 20

## Objetivo de la semana
Comprender los fundamentos psicológicos y técnicos de la ingeniería social y el phishing, identificando las tácticas, técnicas y procedimientos (TTPs) utilizados por atacantes reales. El estudiante aprenderá a diseñar campañas de simulación ética, analizar indicadores de compromiso y aplicar controles defensivos alineados con marcos como MITRE ATT&CK, NIST SP 800-50 y CIS Controls v8.

## LECTURA
La ingeniería social explota la confianza, la urgencia, la autoridad y la curiosidad humanas en lugar de vulnerabilidades técnicas. Según el **Verizon Data Breach Investigations Report (DBIR)**, más del 70% de las brechas involucran el factor humano, y el phishing sigue siendo el vector inicial dominante. MITRE ATT&CK documenta estas tácticas en la táctica **TA0001 (Initial Access)** con técnicas como **T1566 (Phishing)**, que se subdivide en T1566.001 (Spearphishing Attachment), T1566.002 (Spearphishing Link) y T1566.003 (Spearphishing via Service). Asimismo, la táctica **TA0005 (Defense Evasion)** incluye T1036 (Masquerading) y T1204 (User Execution), esenciales para entender cómo un correo malicioso deriva en ejecución de código.

El phishing puede clasificarse en: **phishing masivo** (envío indiscriminado), **spear phishing** (dirigido a individuos concretos), **whaling** (dirigido a ejecutivos), **vishing** (voz), **smishing** (SMS) y **phishing de clonación** (copia de correos legítimos). El estándar **NIST SP 800-63B** enfatiza la autenticación resistente al phishing mediante FIDO2/WebAuthn, mientras que **ISO/IEC 27001:2022** en su Anexo A control 6.3 exige concienciación y formación en seguridad. **CIS Controls v8** dedica el Control 14 a "Security Awareness and Skills Training", recomendando simulaciones periódicas y métricas de clic.

Los atacantes emplean frameworks como **Gophish**, **Evilginx2** (para bypass de MFA mediante reverse proxy), **SET (Social-Engineer Toolkit)** y **King Phisher**. La defensa requiere capas: filtrado de correo (SPF, DKIM, DMARC), análisis de URL en tiempo de clic, sandboxing de adjuntos, MFA resistente a phishing y programas de concienciación medibles. El **OWASP Top 10** incluye A07:2021 "Identification and Authentication Failures", directamente relacionado con credenciales robadas vía phishing. Finalmente, el **Social Engineering Framework de Chris Hadnagy** describe los vectores humanos: pretexting, pretexto, phishing, tailgating y quid pro quo, todos mapeables a ATT&CK.

## EJERCICIO
**Objetivo:** Diseñar y ejecutar una campaña de simulación de phishing ética en un entorno controlado, midiendo tasas de clic y reporte.

**Pasos:**
1. **Preparación del entorno:** Instala Gophish en un VPS o VM local (`docker run -p 3333:3333 -p 8080:8080 gophish/gophish`). Accede al panel admin en `https://localhost:3333`.
2. **Configuración de dominio:** Configura un dominio de prueba (ej. `phish.lab.local`) con registros SPF, DKIM y DMARC para simular un remitente legítimo. Documenta los valores.
3. **Creación de plantilla:** Diseña un correo de spear phishing basado en un pretexto realista (ej. "Actualización de política de contraseñas - RRHH"). Incluye un enlace a una landing page clonada de un portal de login ficticio.
4. **Landing page:** Configura la página de captura en Gophish. Añade un campo de usuario/contraseña y una redirección a una página de formación tras el envío.
5. **Grupo objetivo:** Crea un grupo con 5-10 correos de prueba (compañeros o cuentas propias). Importa desde CSV.
6. **Lanzamiento:** Envía la campaña y monitoriza en tiempo real: correos enviados, abiertos, clics, envío de datos y reportes.
7. **Análisis:** Exporta resultados. Calcula tasa de clic (CTR), tasa de compromiso de credenciales y tasa de reporte. Mapea cada acción a técnicas MITRE ATT&CK (T1566.002, T1204.001).
8. **Informe:** Redacta un informe de 1 página con hallazgos, indicadores de compromiso (IoCs) generados y recomendaciones alineadas con CIS Control 14.

**Herramientas:** Gophish, Docker, MailHog (para capturar correos en lab), Wireshark (análisis de tráfico SMTP).

## CASO
**Caso real: Ataque de phishing a Twitter (julio 2020)**
En julio de 2020, atacantes comprometieron 130 cuentas de alto perfil en Twitter (Obama, Musk, Apple, Uber) mediante un ataque de **vishing combinado con spear phishing**. Los atacantes se hicieron pasar por el departamento de IT de Twitter y llamaron a empleados, convenciéndolos de introducir credenciales en una página de VPN falsa. Una vez dentro, accedieron a herramientas internas de administración y publicaron tweets fraudulentos solicitando Bitcoin. El incidente se mapea a MITRE ATT&CK: **T1566.004 (Spearphishing Voice)**, **T1078 (Valid Accounts)** y **T1531 (Account Access Removal)**. Las lecciones clave: la falta de MFA resistente a phishing permitió el acceso; la formación en concienciación era insuficiente; y la ausencia de segmentación de privilegios amplificó el impacto. Twitter fue multada con 150 millones de dólares por la FTC por violaciones de privacidad relacionadas. Este caso subraya la necesidad de controles NIST SP 800-63B (AAL2/AAL3) y monitoreo de comportamiento anómalo en cuentas privilegiadas.

## Recursos abiertos
- https://attack.mitre.org/techniques/T1566/
- https://www.cisa.gov/secure-our-world/recognize-and-report-phishing
- https://github.com/gophish/gophish
- https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/
- https://www.cisecurity.org/controls/security-awareness-and-skills-training

--- [Volver al syllabus](../syllabus.md)
