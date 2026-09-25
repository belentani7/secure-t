# Semana 18: Gestion de crisis y wargaming

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 18 de 20

## Objetivo de la semana
El estudiante aprenderá a diseñar, ejecutar y evaluar ejercicios de simulación de crisis (wargaming) en el ámbito de la ciberseguridad y la protección de datos, aplicando marcos como NIST SP 800-84, ISO 22361 y MITRE ATT&CK. Desarrollará habilidades para coordinar equipos multidisciplinares bajo presión, tomar decisiones con información incompleta y documentar lecciones aprendidas que fortalezcan el plan de respuesta a incidentes y la resiliencia organizacional.

## LECTURA
La gestión de crisis en ciberseguridad no consiste únicamente en reaccionar ante un incidente, sino en preparar a la organización para que su respuesta sea coordinada, proporcionada y conforme a las obligaciones legales, especialmente las derivadas del RGPD. El wargaming, entendido como un ejercicio estructurado de simulación de escenarios adversos, permite ensayar decisiones críticas sin exponer activos reales. Según el NIST SP 800-84, los ejercicios pueden clasificarse en discusiones (tabletop), simulaciones funcionales y ejercicios a gran escala; cada uno con distintos niveles de coste, realismo y riesgo operativo. La ISO 22361:2022 establece principios para la gestión estratégica de crisis, subrayando la necesidad de liderazgo, comunicación, toma de decisiones bajo incertidumbre y aprendizaje continuo. En paralelo, el marco MITRE ATT&CK aporta un lenguaje común para modelar tácticas, técnicas y procedimientos (TTPs) del adversario, lo que permite construir escenarios realistas basados en amenazas verosímiles. Los CIS Controls v8, en particular el Control 17 (Gestión de respuesta a incidentes), recomiendan ejercitar periódicamente los planes de respuesta mediante simulaciones que incluyan a dirección, legal, comunicación y TI. La ISO/IEC 27001:2022 exige en sus controles 5.24 a 5.28 la planificación, preparación, evaluación y aprendizaje de la respuesta a incidentes, lo que convierte el wargaming en una evidencia objetiva de mejora continua. OWASP, por su parte, ofrece guías como el "Incident Response Playbook" que ayudan a estructurar la comunicación y la contención en incidentes de aplicación. Un wargame eficaz debe definir objetivos medibles (tiempo de detección, tiempo de decisión, calidad de la comunicación), roles claros (facilitador, árbitro, observadores, equipo azul, equipo rojo), inyectores de eventos y un sistema de puntuación. Además, debe integrar requisitos del RGPD: notificación a la autoridad de control en 72 horas (art. 33), comunicación a interesados (art. 34) y registro de violaciones (art. 33.5). La evaluación posterior (after-action review) debe generar acciones correctivas trazables, actualizar el plan de continuidad y alimentar el registro de riesgos. Sin wargaming, los planes de crisis son documentos muertos; con él, se convierten en capacidades vivas y auditables.

## EJERCICIO
**Título:** Diseño y ejecución de un tabletop de crisis por fuga de datos personales.

**Objetivos:**
- Construir un escenario basado en MITRE ATT&CK (p. ej. T1567 Exfiltration Over Web Service).
- Ejecutar un ejercicio tabletop de 90 minutos con al menos 5 roles.
- Medir tiempos de decisión y cumplimiento de plazos RGPD.
- Generar un informe de lecciones aprendidas con acciones correctivas.

**Pasos concretos:**
1. **Definir alcance y objetivos:** Selecciona un sistema crítico (p. ej. CRM con datos de 50.000 clientes). Establece objetivos medibles: notificar a la AEPD en menos de 72 h, contener la fuga en menos de 4 h, emitir comunicado interno en 1 h.
2. **Construir el escenario con MITRE ATT&CK:** Usa la matriz Enterprise para elegir técnicas realistas: T1566 (Phishing), T1078 (Valid Accounts), T1530 (Data from Cloud Storage), T1567 (Exfiltration Over Web Service). Redacta un guion con 8-10 inyectores cronometrados.
3. **Asignar roles:** Facilitador, árbitro, equipo azul (SOC, TI, legal, DPO, comunicación), observadores. El equipo rojo puede estar representado por el facilitador que introduce inyectores.
4. **Preparar materiales:** Plantilla de registro de decisiones, cronómetro, pizarra compartida (Miro o Mural), formulario de notificación de brecha (modelo AEPD), checklist RGPD arts. 33-34.
5. **Ejecutar el ejercicio:** 90 minutos. Cada inyector se libera en momentos predefinidos. El equipo debe documentar: hora de detección, hora de contención, hora de decisión de notificar, hora de notificación efectiva.
6. **Evaluar con after-action review:** Usa la plantilla del NIST SP 800-84. Puntúa: detección, contención, comunicación, cumplimiento legal, toma de decisiones. Identifica 3 fortalezas y 5 áreas de mejora.
7. **Generar informe:** Incluye cronología, decisiones, desviaciones, acciones correctivas con responsable y plazo. Vincula cada acción a un control ISO 27001 (5.24-5.28) y a un CIS Control (17).
8. **Herramientas recomendadas:** Miro/Mural para pizarra, Google Forms para registro, plantilla de brecha de la AEPD, MITRE ATT&CK Navigator para marcar técnicas usadas.

**Entregable:** Informe de 4-6 páginas con cronología, métricas, lecciones aprendidas y plan de acción.

## CASO
**Caso real: Incidente de ransomware en un hospital europeo (basado en ataques a proveedores sanitarios como el ocurrido en Irlanda en 2021 y en el sector salud español).**

En mayo de 2021, el Servicio de Salud de Irlanda (HSE) sufrió un ataque de ransomware que cifró sistemas críticos y provocó la cancelación de miles de citas. La organización no había ejecutado un wargame integral que incluyera a dirección, legal y comunicación. Como resultado, la detección tardó días, la contención fue descoordinada y la notificación a la autoridad de protección de datos se retrasó más allá de lo deseable. El coste de recuperación superó los 100 millones de euros y la reputación institucional quedó gravemente dañada.

**Análisis con marcos:**
- **MITRE ATT&CK:** El atacante usó T1486 (Data Encrypted for Impact) y T1490 (Inhibit System Recovery). Un wargame basado en estas técnicas habría permitido ensayar la respuesta a cifrado masivo y destrucción de copias.
- **NIST SP 800-84:** La falta de ejercicios tabletop previos impidió que los roles conocieran sus responsabilidades. El after-action review posterior identificó la necesidad de simulaciones trimestrales.
- **ISO 22361:** La crisis evidenció ausencia de liderazgo estratégico y comunicación proactiva. La norma exige un centro de crisis con autoridad clara.
- **RGPD:** Al tratarse de datos de salud (categoría especial, art. 9), la notificación a la autoridad debía ser inmediata. La falta de un playbook de brecha retrasó el cumplimiento del art. 33.
- **CIS Control 17:** La organización no había implementado el control 17.4 (ejercicios de respuesta) ni el 17.7 (lecciones aprendidas).

**Lecciones aplicables:** Un wargame anual obligatorio con inyectores de ransomware, fuga de datos y caída de proveedores críticos; participación del DPO y del comité de dirección; medición de tiempos de notificación; y actualización del plan de respuesta tras cada ejercicio. Sin simulación, la crisis real se convierte en improvisación.

## Recursos abiertos
- NIST SP 800-84: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities — https://csrc.nist.gov/publications/detail/sp/800-84/final
- ISO 22361:2022 Security and resilience — Crisis management — Guidelines — https://www.iso.org/standard/50297.html
- MITRE ATT&CK Navigator — https://mitre-attack.github.io/attack-navigator/
- CIS Controls v8, Control 17: Incident Response Management — https://www.cisecurity.org/controls/incident-response-management
- OWASP Incident Response Playbook — https://owasp.org/www-project-incident-response/
- AEPD: Gestión de brechas de seguridad — https://www.aepd.es/es/guias-y-herramientas/guias

--- [Volver al syllabus](../syllabus.md)
