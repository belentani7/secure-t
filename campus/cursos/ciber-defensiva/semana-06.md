# Semana 6: Respuesta a incidentes

Curso: [Ciberseguridad Defensiva: Construir y Defender](../syllabus.md) · Semana 6 de 20

## Objetivos de aprendizaje

- Recorrer el ciclo NIST de respuesta: preparar, detectar, contener, erradicar, recuperar, aprender
- Escribir un runbook que sirva a las 3 de la manana
- Practicar con un ejercicio de mesa antes de necesitarlo de verdad

## El ciclo, y las decisiones que no se improvisan

| Fase | Pregunta que responde | Artefacto |
|---|---|---|
| Preparar | Quien decide y con que | Plan, contactos, accesos de emergencia |
| Detectar | Que paso y desde cuando | Alerta triada + linea de tiempo |
| Contener | Como deja de extenderse | Aislamiento de host o credencial |
| Erradicar | Como se va del entorno | Causa raiz eliminada, no solo el sintoma |
| Recuperar | Como se vuelve a operar | Restauracion verificada |
| Aprender | Que cambia manana | Acciones con fecha y responsable |

**La contencion se decide antes del incidente, no durante.** Que se aislara (red, credencial, servicio), quien puede autorizarlo y que se acepta perder. El error habitual: contener tan tarde que el atacante ya esta en el backup.

**Referencias:**
- NIST SP 800-61r2 — Computer Security Incident Handling Guide
- ATT&CK — Tactics y tecnicas para mapear lo observado

## Runbook: cuatro lineas que salvan el turno de noche

1. **Senal**: como se reconoce el incidente y quien avisa.
2. **Primeras acciones**: preservar evidencia (memoria, disco) y aislar sin destruir datos.
3. **Escalado**: a quien se llama, con que reloj corriendo.
4. **Criterio de cierre**: cuando se considera contenido y quien lo firma.

## Ejercicio guiado: simulacro de mesa

1. Situacion: un portatil cifra ficheros de red compartida (ransomware)
2. Escribe las tres primeras acciones sin mirar el runbook
3. Compara con el ciclo NIST: que fase saltaste y a que costo
4. Redacta el runbook de esa situacion en una pagina
5. Haz un ejercicio de mesa de 30 minutos con alguien que haga de «jefe de negocio»
6. Anota las preguntas que no supiste responder y conviertelas en pendientes

## Recursos abiertos

- [NIST SP 800-61r2](https://csrc.nist.gov/pubs/sp/800/61/r2/final)
- [CISA — Incident Response Playbooks](https://www.cisa.gov/resources-tools/resources/incident-and-vulnerability-response-playbooks)
- [SANS — Incident Handler's Handbook](https://www.sans.org/white-papers/33901/)

---
[Volver al syllabus](../syllabus.md)
