# Semana 3: Respuesta a incidentes (NIST 800-61)

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 3 de 20

## Objetivos de aprendizaje

- Ejecutar las 6 fases del ciclo de respuesta a incidentes NIST 800-61
- Desarrollar playbooks para ransomware, phishing y cuenta comprometida
- Clasificar indicadores de compromiso (IoC) por tipo y fuente
- Documentar un incidente con cronología y lecciones aprendidas

## NIST 800-61: el ciclo completo de respuesta

NIST SP 800-61 Rev.3 define 6 fases. Cada fase tiene entregables concretos — un incidente no está cerrado hasta que se documentan las lecciones aprendidas.

**1. Preparación:**
- Equipo de respuesta (CSIRT) con roles y contactos
- Kit de herramientas: imagen forense, logs centralizados, canal seguro
- Playbooks escritos y ensayados para los 3-5 escenarios más probables
- Contactos legales, comunicación, seguros ciber

**2. Detección y análisis:**
- Fuentes: alertas SIEM, reports de usuarios, feeds de inteligencia
- Triaje: ¿es un incidente real? Clasificar severidad (P1-P4)
- IoC (Indicators of Compromise): IPs, hashes, dominios, emails, TTPs

**3. Contención:**
- **Corto plazo:** aislar la máquina (desconectar de red, NO apagar)
- **Largo plazo:** parchear la vulnerabilidad explotada, revocar credenciales
- Decisión crítica: ¿contener inmediatamente o monitorear para entender el alcance?

**4. Erradicación:**
- Eliminar el malware, cerrar backdoors, eliminar cuentas creadas por el atacante
- Verificar que la causa raíz está eliminada, no solo los síntomas

**5. Recuperación:**
- Restaurar desde backup limpio, verificar integridad
- Monitorización intensiva post-recuperación (el atacante puede volver)
- Vuelta gradual a producción con validación

**6. Lecciones aprendidas (Post-Incident Activity):**
- Reunión post-incidente (sin culpables): qué pasó, cronología, qué funcionó, qué no
- Actualizar playbooks, reglas de detección, controles
- Informe formal con recomendaciones y dueños de cada acción

**Referencias:**
- NIST SP 800-61 Rev.3 — Incident Handling Guide
- MITRE ATT&CK — TA0040 Impact
- SANS Incident Handler's Handbook

## Playbooks: respuesta guiada por escenario

Un playbook es la receta paso a paso para un tipo de incidente. Sin playbook, cada incidente se improvisa — y la improvisación bajo presión produce errores.

**Playbook: Ransomware**
```
DETECCIÓN: Alerta de cifrado masivo / extensiones cambiadas / nota de rescate
TRIAJE:    ¿Cuántos sistemas afectados? ¿Se propaga activamente?
CONTENCIÓN:
  1. Aislar máquinas afectadas de la red (cable, no WiFi off)
  2. NO apagar — la RAM puede contener claves de descifrado
  3. Bloquear hash del ransomware en EDR/antivirus
  4. Deshabilitar cuentas comprometidas en AD
ERRADICACIÓN:
  1. Identificar vector de entrada (phishing? RDP expuesto? VPN?)
  2. Parchear/cerrar el vector
  3. Verificar que no hay persistencia (scheduled tasks, servicios)
RECUPERACIÓN:
  1. Restaurar desde backup (verificar que backup no está cifrado)
  2. Validar integridad de datos restaurados
DECISIÓN DE PAGO: NO se recomienda pagar — no garantiza descifrado,
  financia al atacante, y puede repetirse. ATT&CK: T1486 (Data Encrypted)
```

**Playbook: Phishing con credenciales robadas**
```
DETECCIÓN: Usuario reporta email sospechoso / alerta de login inusual
CONTENCIÓN:
  1. Resetear contraseña de la cuenta afectada INMEDIATAMENTE
  2. Revocar sesiones activas (tokens OAuth incluidos)
  3. Verificar reglas de reenvío de correo (T1114.003)
  4. Bloquear el dominio/URL de phishing en proxy/DNS
ANÁLISIS:
  1. ¿Cuántos usuarios recibieron el email?
  2. ¿Cuántos hicieron clic? (logs de proxy)
  3. ¿Cuántos introdujeron credenciales?
ERRADICACIÓN: Purgar email de todos los buzones
LECCIONES: Simulación de phishing + formación targeted
```

**Referencias:**
- T1486 — Data Encrypted for Impact
- T1114.003 — Email Forwarding Rule
- T1566 — Phishing
- CISA Ransomware Guide

## Caso real: WannaCry 2017: NHS sin playbook, sin backup, sin parche

WannaCry (EternalBlue, MS17-010) cifró 200.000 sistemas en 150 países. El NHS británico canceló 19.000 citas médicas. No tenían: parche disponible desde marzo (2 meses), playbook de ransomware, ni backups offline verificados. Un investigador (MalwareTech) encontró el kill switch por accidente registrando un dominio hardcodeado. Lección: las 3 defensas que habrían evitado el impacto son las más básicas — parchear, tener backup probado, tener un playbook ensayado.

## Ejercicio guiado: Simulación de incidente: ransomware en la ONG

1. Escenario: lunes 08:00, 3 de 10 PCs muestran nota de rescate en el escritorio
2. Asigna roles: analista (tú), coordinador, comunicación
3. Fase 1 — Contención: lista las 5 primeras acciones en orden de prioridad
4. Fase 2 — Análisis: ¿por dónde entró? Lista 3 hipótesis y cómo verificarlas
5. Fase 3 — Erradicación: ¿qué haces si el backup del viernes está cifrado?
6. Fase 4 — Recuperación: plan B de restauración sin backup reciente
7. Fase 5 — Lecciones: escribe 5 mejoras concretas para que no se repita
8. Cronología: construye la timeline del incidente en una tabla

## Recursos abiertos

- [NIST 800-61 Rev.3](https://csrc.nist.gov/publications/detail/sp/800-61/rev-3/final)
- [CISA Ransomware Guide](https://www.cisa.gov/stopransomware)
- [SANS IR Handbook](https://www.sans.org/white-papers/33901/)

---
[Volver al syllabus](../syllabus.md)
