# Semana 1: Ética, legalidad y alcance del test

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 1 de 20

## Objetivos de aprendizaje

- Distinguir hacking ético de actividad delictiva con base legal concreta
- Redactar un documento de alcance (rules of engagement) válido
- Situar PTES, OWASP WSTG y MITRE ATT&CK en el flujo de un pentest
- Identificar las fases de un test de intrusión profesional

## Regla número uno: permiso escrito

Un test de intrusión sin autorización escrita es un delito, sin excepciones. El Convenio de Budapest (arts. 2-6) tipifica el acceso ilícito a sistemas; el Código Penal español (arts. 197 bis, 264) castiga con prisión la intrusión y el daño informático. En Brasil, la Lei 12.737/2012 (Lei Carolina Dieckmann) penaliza la invasión de dispositivos. En la UE, la Directiva 2013/40 armoniza los tipos.

El documento de alcance — llamado 'Rules of Engagement' (RoE) — define: **quién** autoriza, **qué** sistemas se pueden tocar, **cuándo** (ventanas horarias), **cómo** se escala un incidente imprevisto y **dónde** se almacenan las evidencias. Sin este documento firmado, cualquier hallazgo es inadmisible y el pentester se expone a responsabilidad penal.

Elementos obligatorios de las RoE:
1. Partes: empresa contratante + equipo de pentest + contacto de emergencia
2. Alcance: IPs, dominios, redes, aplicaciones incluidas y excluidas
3. Ventanas de ejecución: horario permitido, fechas de inicio y fin
4. Técnicas autorizadas y prohibidas (p. ej. DoS: sí/no)
5. Protocolo de hallazgo crítico: a quién se comunica, en cuánto tiempo
6. Almacenamiento y destrucción de evidencias al finalizar
7. Firmas de ambas partes con fecha

**Referencias:**
- Convenio de Budapest, arts. 2-6
- Código Penal ES, arts. 197 bis, 264
- Lei 12.737/2012 (BR)
- Directiva 2013/40/UE

## Las fases de un pentest profesional (PTES)

El Penetration Testing Execution Standard (PTES) define 7 fases que todo test ético debe seguir. Saltarse fases produce informes incompletos y hallazgos no reproducibles.

**Fase 1 — Pre-engagement (acuerdo previo):** RoE, alcance, restricciones, contactos de emergencia. Es la fase más importante: sin ella no hay test.

**Fase 2 — Intelligence Gathering (recolección):** OSINT pasivo (semana 2), footprinting, identificación de tecnologías. MITRE ATT&CK: tácticas de Reconnaissance (TA0043).

**Fase 3 — Threat Modeling:** ¿Qué protege el objetivo? ¿Qué le importa a un atacante real? Se priorizan vectores por impacto de negocio.

**Fase 4 — Vulnerability Analysis:** Escaneo de vulnerabilidades con herramientas (Nmap, Nikto, Nuclei) + análisis manual. Se valida cada hallazgo: un falso positivo en el informe destruye la credibilidad.

**Fase 5 — Exploitation:** Solo se explota lo que se puede reproducir y documentar. El objetivo no es 'romper todo' sino demostrar el impacto real de cada vulnerabilidad.

**Fase 6 — Post-Exploitation:** ¿Qué puede hacer un atacante una vez dentro? Escalada de privilegios, movimiento lateral, exfiltración simulada. MITRE ATT&CK: tácticas Persistence (TA0003), Privilege Escalation (TA0004).

**Fase 7 — Reporting:** El informe es el producto. Tiene dos partes: resumen ejecutivo (para dirección) y detalle técnico (para el equipo). Cada hallazgo: descripción, severidad CVSS, reproducción paso a paso, evidencia (capturas), remediación propuesta.

**Referencias:**
- PTES — pentest-standard.org
- MITRE ATT&CK — TA0043 Reconnaissance
- MITRE ATT&CK — TA0003 Persistence
- MITRE ATT&CK — TA0004 Privilege Escalation

## Metodologías complementarias: OWASP WSTG y ATT&CK

PTES da la estructura del test. Pero para saber **qué probar** necesitas guías específicas por dominio.

**OWASP Web Security Testing Guide (WSTG):** 91 pruebas organizadas en 11 categorías: Information Gathering (WSTG-INFO), Configuration (WSTG-CONF), Identity (WSTG-IDENT), Authentication (WSTG-ATHN), Authorization (WSTG-ATHZ), Session (WSTG-SESS), Input Validation (WSTG-INPV), Error Handling (WSTG-ERRH), Cryptography (WSTG-CRYP), Business Logic (WSTG-BUSL), Client-Side (WSTG-CLNT). Cada prueba tiene objetivo, procedimiento y herramientas sugeridas.

**MITRE ATT&CK:** No es una metodología de test sino un catálogo de comportamiento real del adversario. 14 tácticas, ~200 técnicas, ~400 sub-técnicas documentadas con procedimientos de grupos APT reales. Su valor en un pentest: hablar el lenguaje del defensor. Cuando reportas un hallazgo mapeado a ATT&CK (p. ej. 'T1190 — Exploit Public-Facing Application'), el SOC sabe exactamente qué detectar.

Las tres herramientas se complementan:
- PTES → estructura del proyecto
- WSTG → checklist de pruebas web
- ATT&CK → lenguaje de amenazas y mapeo de cobertura

**Referencias:**
- OWASP WSTG v4.2 — owasp.org/www-project-web-security-testing-guide
- MITRE ATT&CK — attack.mitre.org
- T1190 — Exploit Public-Facing Application

## Caso real: El pentester que fue a prisión: caso Aaron Swartz y lecciones

Aaron Swartz descargó millones de artículos académicos de JSTOR desde la red del MIT en 2011. Aunque JSTOR retiró los cargos, la fiscalía federal mantuvo 13 cargos bajo la CFAA (Computer Fraud and Abuse Act). Lección operativa: tener acceso legítimo a una red (Swartz era fellow del MIT) NO equivale a tener autorización para un test ofensivo. El alcance lo define el documento firmado, no el acceso técnico.

## Ejercicio guiado: Redacta tu documento de alcance (RoE)

1. Elige un escenario ficticio: ONG con web, correo y VPN
2. Define las partes (tú como pentester, la ONG como cliente)
3. Lista los activos en alcance: 2 IPs, 1 dominio, 1 webapp
4. Establece ventana: sábados 02:00-06:00 UTC
5. Define técnicas autorizadas (escaneo, inyección) y prohibidas (DoS)
6. Escribe el protocolo de hallazgo crítico: email + teléfono en < 1h
7. Añade cláusula de destrucción de evidencias a los 30 días
8. Firma con fecha (simulada)

## Recursos abiertos

- [PTES Standard](https://www.pentest-standard.org/index.php/Main_Page)
- [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/)
- [MITRE ATT&CK Navigator](https://mitre-attack.github.io/attack-navigator/)
- [Convenio de Budapest (texto)](https://www.coe.int/en/web/cybercrime/the-budapest-convention)

---
[Volver al syllabus](../syllabus.md)
