# Semana 11: Concienciacion y cultura de seguridad

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 11 de 20

## Objetivo de la semana
Comprender que la seguridad de la información es un problema sociotécnico donde el factor humano constituye la primera línea de defensa y, simultáneamente, el vector de ataque más explotado. El estudiante aprenderá a diseñar, implementar y medir programas de concienciación y cultura de seguridad alineados con estándares como ISO/IEC 27001:2022 (control A.6.3), NIST SP 800-50 y el marco de Cultura de Seguridad de ENISA, diferenciando entre formación puntual, concienciación continua y cambio cultural sostenible.

## LECTURA
La concienciación y cultura de seguridad constituyen el pilar humano de cualquier Sistema de Gestión de Seguridad de la Información (SGSI). Según el *Verizon Data Breach Investigations Report* (DBIR), entre el 68% y el 82% de las brechas de seguridad involucran el factor humano: phishing, ingeniería social, errores de configuración o uso indebido de credenciales. Por ello, ISO/IEC 27001:2022 exige en su control A.6.3 "Concienciación, educación y formación en seguridad de la información" que el personal reciba formación adecuada a su rol y que existan mecanismos para medir su eficacia.

Es fundamental distinguir tres niveles: **concienciación** (saber que la seguridad importa), **formación** (adquirir habilidades concretas) y **educación** (desarrollar criterio profesional). El NIST SP 800-50 "Building an Information Technology Security Awareness and Training Program" propone un ciclo de vida de cuatro fases: diseño, desarrollo, implementación y post-implementación con evaluación continua. Complementariamente, el **CIS Control 14** ("Security Awareness and Skills Training") establece 9 salvaguardas específicas, incluyendo simulaciones de phishing, formación en autenticación segura y entrenamiento en manejo de datos sensibles.

El **MITRE ATT&CK** documenta técnicas como *Phishing (T1566)*, *Spearphishing Attachment (T1566.001)* y *User Execution (T1204)*, todas dependientes de la interacción humana. Una cultura de seguridad madura reduce la superficie de exposición frente a estas tácticas. El modelo de **ENISA** sobre cultura de seguridad organizacional identifica cuatro dimensiones: actitud, comportamiento, cognición y comunicación, medibles mediante encuestas (por ejemplo, el *Security Culture Framework* de Kai Roer).

OWASP, a través de su proyecto **OWASP Security Culture**, ofrece una guía práctica con cinco pilares: liderazgo, comunicación, formación, métricas y reconocimiento. La medición es crítica: KPIs como tasa de clics en simulaciones de phishing, tiempo medio de reporte de incidentes, porcentaje de finalización de formaciones y resultados de encuestas culturales permiten demostrar la eficacia del programa ante auditores y dirección. El RGPD refuerza esta obligación en su artículo 32.4, exigiendo que las personas con acceso a datos personales reciban formación adecuada. Sin cultura, ningún control técnico es suficiente: la mejor tecnología falla ante un empleado que entrega sus credenciales.

## EJERCICIO
**Diseño y ejecución de un programa de concienciación con simulación de phishing**

**Objetivo:** Diseñar un plan de concienciación trimestral y ejecutar una campaña simulada de phishing sobre un grupo control de 10 personas, midiendo resultados.

**Pasos concretos:**

1. **Diagnóstico inicial (Semana 1):** Elabora una encuesta de 15 preguntas basada en el *Security Culture Framework* (Roer) usando Google Forms o Microsoft Forms. Mide actitudes, comportamientos y conocimiento previo. Documenta la línea base.

2. **Diseño del programa:** Alinea el contenido con CIS Control 14.1–14.9 y A.6.3 de ISO 27001. Define módulos: contraseñas y MFA, phishing, manejo de datos personales (RGPD), reporte de incidentes y uso de dispositivos.

3. **Simulación de phishing:** Utiliza una herramienta gratuita como **GoPhish** (https://getgophish.com) o **King Phisher**. Redacta un correo con señales típicas de *Spearphishing (T1566.002)*: urgencia, remitente suplantado, enlace acortado. Incluye una landing educativa (no captura credenciales reales).

4. **Ejecución controlada:** Envía el correo al grupo de 10 personas previa autorización por escrito de RRHH y dirección. Registra: tasa de apertura, clics, envío de datos y reportes al canal de seguridad.

5. **Análisis y remediación:** Calcula métricas (clic rate, report rate). Compara con benchmarks del sector (media ~30% clic inicial). Diseña formación específica para quienes fallaron.

6. **Informe final:** Entrega un documento de 4–6 páginas con metodología, resultados, lecciones aprendidas y plan de mejora continua alineado al ciclo PDCA.

**Entregables:** encuesta base, plantilla de correo, capturas de GoPhish, hoja de cálculo de métricas e informe final.

## CASO
**El caso de Twitter (julio de 2020): el mayor hackeo por ingeniería social**

El 15 de julio de 2020, atacantes comprometieron 130 cuentas de alto perfil en Twitter (Barack Obama, Elon Musk, Apple, Bill Gates) para difundir una estafa de bitcoin. La investigación del *New York State Department of Financial Services* (publicada en octubre de 2020) reveló que el vector principal fue **ingeniería social telefónica** (*vishing*, técnica asociada a *Phishing for Information, T1598* en MITRE ATT&CK). Los atacantes llamaron a empleados de Twitter haciéndose pasar por personal del departamento de TI, solicitando credenciales VPN y acceso a herramientas internas como el panel de administración "Agent Tools". Varios empleados, sin formación adecuada ni protocolos de verificación, entregaron sus credenciales.

El informe concluyó que Twitter carecía de: (1) controles de verificación de identidad en llamadas internas, (2) formación específica en ingeniería social para personal con privilegios, (3) monitoreo de accesos anómalos al panel administrativo. Este caso ilustra cómo la ausencia de una cultura de seguridad robusta anula controles técnicos avanzados. La lección clave: la concienciación debe ser **continua, contextualizada por rol y respaldada por procesos verificables**, no un curso anual de PowerPoint. Tras el incidente, Twitter implementó MFA obligatorio, formación reforzada y restricciones de acceso al panel administrativo, alineándose con CIS Control 14 y NIST SP 800-50.

## Recursos abiertos
- NIST SP 800-50 – Building an IT Security Awareness and Training Program: https://csrc.nist.gov/pubs/sp/800/50/final
- OWASP Security Culture Project: https://owasp.org/www-project-security-culture/
- ENISA – Cybersecurity Culture Guidelines: https://www.enisa.europa.eu/publications/cybersecurity-culture-guidelines-behavioural-aspects-of-cybersecurity
- GoPhish (herramienta open source de simulación de phishing): https://getgophish.com
- CIS Critical Security Controls v8 – Control 14: https://www.cisecurity.org/controls/security-awareness-and-skills-training

--- [Volver al syllabus](../syllabus.md)
