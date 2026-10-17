# Semana 1: Marcos: ISO 27001, NIST CSF, ENS

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 1 de 20

## Objetivos de aprendizaje

- Situar ISO 27001, NIST CSF y ENS en su papel real (lenguaje común, no checklist)
- Mapear un mismo control en los tres marcos simultáneamente
- Distinguir certificación de cumplimiento de implementación real
- Explicar las 5 funciones del NIST CSF 2.0 con ejemplos

## ISO 27001, NIST CSF y ENS: para qué sirve cada marco

Un marco de seguridad NO es un checklist que se rellena y se archiva. Es un **lenguaje común** para que técnicos, dirección, auditores y reguladores hablen de lo mismo.

**ISO 27001:2022 — Sistema de Gestión de Seguridad (SGSI):**
- Certificable por auditor externo acreditado
- Estructura: contexto → liderazgo → planificación → soporte → operación → evaluación → mejora
- Annex A: 93 controles organizados en 4 temas (Organizacionales, Personas, Físicos, Tecnológicos)
- Certificarse ≠ estar seguro. La certificación dice que TIENES un sistema de gestión; no dice que tus controles sean perfectos.

**NIST Cybersecurity Framework 2.0 (CSF):**
- No certificable (es una guía, no una norma)
- 6 funciones: **GOVERN** (nuevo en 2.0), **IDENTIFY**, **PROTECT**, **DETECT**, **RESPOND**, **RECOVER**
- Perfiles: estado actual vs estado deseado
- Tiers: 1 (Partial) → 4 (Adaptive)
- Libre, gratuito, ampliamente adoptado incluso fuera de EEUU

**ENS (Esquema Nacional de Seguridad, España):**
- Obligatorio para AAPP y sus proveedores
- 3 categorías: BÁSICA / MEDIA / ALTA
- Principios: función de seguridad diferenciada, prevención, detección, respuesta, conservación
- Mapeable a ISO 27001 (guía CCN-STIC)

**Los tres marcos se complementan:**
| Necesidad | Marco |
|---|---|
| Certificación ante clientes | ISO 27001 |
| Guía práctica de mejora | NIST CSF |
| Obligación legal España | ENS |

**Referencias:**
- ISO 27001:2022 — iso.org
- NIST CSF 2.0 — nist.gov/cyberframework
- ENS — ens.ccn.cni.es
- CCN-STIC 825 — Mapeo ENS-ISO 27001

## NIST CSF 2.0: las 6 funciones en detalle

**GV — GOVERN (nuevo en CSF 2.0):**
La seguridad como decisión de gobierno, no solo técnica. Incluye: estrategia de ciberseguridad, roles y responsabilidades, gestión de riesgo de la cadena de suministro, políticas.

**ID — IDENTIFY:**
¿Qué tenemos? ¿Qué vale? ¿Qué riesgos? Inventario de activos, entorno de negocio, evaluación de riesgos, estrategia de gestión.
Ejemplo: 'Tenemos 3 servidores web, 1 BD con datos de alumnos, 2 APIs públicas. El mayor riesgo es fuga de datos por API.'

**PR — PROTECT:**
Controles preventivos. IAM, formación, seguridad de datos, procesos y procedimientos, mantenimiento, tecnología de protección.
Ejemplo: 'MFA en todas las cuentas admin, cifrado AES-256 en la BD, parches mensuales.'

**DE — DETECT:**
Monitorización continua. Anomalías y eventos, monitorización de seguridad, procesos de detección.
Ejemplo: 'SIEM Wazuh con reglas Sigma, alertas a Slack, revisión semanal de dashboards.'

**RS — RESPOND:**
Cuando pasa algo. Planificación de respuesta, comunicaciones, análisis, mitigación, mejoras.
Ejemplo: 'Playbook de ransomware ensayado, contacto legal, canal de comunicación de crisis.'

**RC — RECOVER:**
Volver a la normalidad. Planificación de recuperación, mejoras, comunicaciones post-incidente.
Ejemplo: 'Backup 3-2-1-1-0, RTO 4h, RPO 1h, simulacro trimestral.'

**Referencias:**
- NIST CSF 2.0 — csf.tools (interactive)
- NIST CSF Quick Start Guide
- GV.OC — Organizational Context

## Caso real: Marriott 2018: certificación ISO no evitó la brecha

Marriott adquirió Starwood en 2016. Starwood tenía ISO 27001 certificado, pero la brecha de 500 millones de registros (desde 2014) se descubrió en 2018. La certificación cubría el SGSI de Starwood, pero no detectó que un atacante llevaba 4 años dentro. Lección: la certificación verifica que el sistema de gestión existe y funciona como proceso; no garantiza que cada control sea eficaz ni que no haya brechas activas. El marco es necesario pero no suficiente.

## Ejercicio guiado: Mapea un control en los tres marcos

1. Elige el control: 'Gestión de accesos e identidades'
2. Búscalo en ISO 27001:2022 Annex A → A.5.15 (Access control)
3. Búscalo en NIST CSF → PR.AC (Identity Management and Access Control)
4. Búscalo en ENS → op.acc (Control de acceso)
5. Documenta las diferencias: ¿qué pide cada marco exactamente?
6. Repite con: 'Gestión de incidentes' (ISO A.5.24, RS.*, op.mon ENS)
7. Conclusión: ¿un control implementado cumple los tres marcos?

## Recursos abiertos

- [NIST CSF 2.0](https://www.nist.gov/cyberframework)
- [ISO 27001 overview](https://www.iso.org/standard/27001)
- [ENS — CCN](https://ens.ccn.cni.es/)
- [CSF Tools (interactive)](https://csf.tools/)

---
[Volver al syllabus](../syllabus.md)
