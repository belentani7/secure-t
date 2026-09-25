# Semana 1: Fundamentos: triada CIA y controles

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 1 de 20

## Objetivos de aprendizaje

- Explicar la triada CIA y aplicarla a la clasificación de activos
- Distinguir controles preventivos, detectivos y correctivos
- Clasificar activos por impacto en confidencialidad, integridad y disponibilidad
- Mapear controles a las funciones del NIST CSF

## La triada CIA: el fundamento de toda decisión de seguridad

Toda medida de seguridad protege al menos una de tres propiedades:

**Confidencialidad (C):** solo accede quien debe. Controles: cifrado (AES-256 en reposo, TLS 1.3 en tránsito), control de acceso (RBAC, ABAC), clasificación de datos (público/interno/confidencial/restringido).

**Integridad (I):** el dato no se altera sin autorización. Controles: hashing (SHA-256), firmas digitales, logs inmutables, checksums en transferencias, control de versiones.

**Disponibilidad (D):** el servicio responde cuando se necesita. Controles: redundancia (RAID, clustering), backups 3-2-1, CDN, balanceadores, plan de continuidad de negocio (BCP).

**Clasificación de activos por impacto CIA:**
```
ACTIVO              C    I    D    CONTROL PRINCIPAL
────────────────────────────────────────────────────
Base de datos RRHH  ALTO ALTO MEDIO Cifrado + RBAC + backup
Web pública         BAJO ALTO ALTO  WAF + CDN + monitorización
Correo corporativo  ALTO MEDIO ALTO MFA + antispam + backup
Código fuente       ALTO ALTO MEDIO Git + code review + firma
```

La clasificación dirige el presupuesto: un activo con impacto ALTO en las tres dimensiones recibe más controles que uno BAJO/BAJO/BAJO. No se protege todo igual — se protege según el riesgo.

**Referencias:**
- NIST SP 800-53 — Security and Privacy Controls
- ISO 27001:2022 — Annex A Controls
- NIST CSF — Identify (ID.AM: Asset Management)

## Taxonomía de controles: preventivo, detectivo, correctivo

Los controles se clasifican por **cuándo** actúan respecto al incidente:

**Preventivos** — impiden que ocurra:
- Firewall (bloquea tráfico no autorizado)
- MFA (impide acceso con credencial robada sola)
- Parches de seguridad (eliminan la vulnerabilidad)
- Formación del personal (reduce phishing exitoso)
- Cifrado (inutiliza datos robados)

**Detectivos** — alertan de que algo está pasando:
- SIEM (correlaciona eventos y alerta)
- IDS/IPS (detecta patrones de ataque en red)
- Antivirus/EDR (detecta malware en endpoint)
- Auditoría de logs (revisa actividad sospechosa)
- Honeypots (señuelos que alertan al ser tocados)

**Correctivos** — mitigan el daño después:
- Backup + restauración (recupera datos perdidos)
- Playbook de incidentes (guía la respuesta)
- Aislamiento de red (contiene la propagación)
- Revocación de credenciales (corta el acceso al atacante)

**Principio de defensa en profundidad:** ningún control solo es suficiente. Se combinan capas: preventivo (firewall) + detectivo (IDS) + correctivo (backup). Si falla uno, el siguiente actúa.

**Mapeo a NIST CSF:**
- Preventivos → función PROTECT (PR)
- Detectivos → función DETECT (DE)
- Correctivos → funciones RESPOND (RS) + RECOVER (RC)

**Referencias:**
- NIST CSF 2.0 — Protect, Detect, Respond, Recover
- CIS Controls v8
- ISO 27001:2022 — Control types

## Caso real: Target 2013: falló la detección, no la prevención

Target tenía FireEye (detectivo) instalado y configurado. El sistema alertó del malware POS que exfiltraba tarjetas de crédito. Pero el equipo SOC ignoró las alertas durante semanas. 40 millones de tarjetas robadas. Coste: $292M. Lección: un control detectivo sin proceso de respuesta es como una alarma sin nadie que la escuche. Los controles técnicos solo funcionan con personas y procesos detrás.

## Ejercicio guiado: Clasifica 10 activos de una ONG ficticia

1. Imagina una ONG con: web, CRM de donantes, email, contabilidad, WiFi oficina
2. Añade 5 activos más propios del contexto (base de beneficiarios, etc.)
3. Para cada activo, puntúa impacto C/I/D como ALTO/MEDIO/BAJO
4. Propón 1 control preventivo + 1 detectivo + 1 correctivo por activo
5. Estima coste relativo de cada control (€/€€/€€€)
6. Prioriza: ¿qué 3 controles implementarías primero con presupuesto limitado?
7. Defiende tu decisión en 5 minutos (simulación oral)

## Recursos abiertos

- [NIST CSF 2.0](https://www.nist.gov/cyberframework)
- [CIS Controls v8](https://www.cisecurity.org/controls)
- [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)

---
[Volver al syllabus](../syllabus.md)
