# Semana 2: Telemetría: logs y detección

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 2 de 20

## Objetivos de aprendizaje

- Configurar recolección de logs desde múltiples fuentes en un SIEM
- Escribir reglas de detección básicas (Sigma/Wazuh)
- Correlacionar eventos para identificar actividad sospechosa
- Mantener integridad temporal con NTP y retención legal de logs

## El log es el testigo: fuentes y formatos

Sin logs no hay detección, no hay investigación, no hay evidencia. Un SOC sin telemetría es un puesto vacío.

**Fuentes de logs críticas:**
- **Sistema operativo:** autenticaciones (Event ID 4624/4625 en Windows, auth.log en Linux), cambios de privilegios, instalación de software
- **Aplicaciones:** accesos, errores, transacciones (access.log, error.log)
- **Red:** flujos NetFlow, DNS queries, conexiones firewall
- **Identidad:** logins MFA, cambios de contraseña, creación de cuentas
- **Cloud:** CloudTrail (AWS), Activity Log (Azure), Audit Log (GCP)

**Formato estructurado (JSON structured logging):**
```json
{"timestamp": "2026-09-12T10:23:45Z",
 "source": "auth",
 "event": "login_failed",
 "user": "admin",
 "src_ip": "203.0.113.42",
 "attempts": 5,
 "geo": "RU"}
```
El formato estructurado permite búsqueda, filtrado y correlación automática. Los logs en texto libre son mucho más difíciles de procesar.

**Sincronización temporal (NTP):**
Si dos servidores tienen relojes desincronizados 5 minutos, la correlación de eventos se rompe. Configura NTP en TODOS los sistemas:
```bash
# Linux: verificar sincronización
timedatectl status
# Configurar NTP
sudo systemctl enable --now systemd-timesyncd
```

**Retención:** RGPD exige finalidad y plazo definido. NIST recomienda mínimo 90 días online + 1 año archivado. PCI-DSS: 1 año, 3 meses online.

**Referencias:**
- NIST SP 800-92 — Guide to Computer Security Log Management
- Windows Event IDs — 4624 (logon), 4625 (failed logon)
- MITRE ATT&CK — T1070 (Indicator Removal: Clear Logs)

## SIEM y reglas de detección (Wazuh / Sigma)

Un SIEM (Security Information and Event Management) centraliza logs, correlaciona eventos y genera alertas. Wazuh es un SIEM open source completo y gratuito.

**Instalación mínima de Wazuh:**
```bash
# Wazuh all-in-one (lab, no producción)
curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh
sudo bash wazuh-install.sh -a
# Dashboard: https://localhost:443 (admin/admin)
# Instalar agente en la máquina monitoreada:
sudo apt install wazuh-agent
```

**Reglas Sigma (formato universal de detección):**
Sigma es un formato abierto para escribir reglas de detección independientes del SIEM. Se compilan a Wazuh, Splunk, Elastic, etc.
```yaml
title: Brute Force Login Attempt
status: stable
logsource:
  category: authentication
  product: windows
detection:
  selection:
    EventID: 4625
  condition: selection | count(src_ip) > 10
  timeframe: 5m
level: high
tags:
  - attack.credential_access
  - attack.t1110  # Brute Force
```

**Correlación de eventos — detección por contexto:**
Un login fallido es ruido. 50 login fallidos desde la misma IP en 5 minutos seguidos de un login exitoso es un brute force que funcionó. El SIEM correlaciona: evento A + evento B + condición temporal = alerta.

**ATT&CK y detección:**
- T1110 (Brute Force) → regla: >N fallos + éxito desde misma IP
- T1078 (Valid Accounts) → regla: login desde geolocalización inusual
- T1070.001 (Clear Windows Event Logs) → regla: Event ID 1102
- T1059 (Command and Scripting) → regla: PowerShell encoded command

**Referencias:**
- Wazuh — wazuh.com
- Sigma Rules — github.com/SigmaHQ/sigma
- T1110 — Brute Force
- T1070.001 — Clear Windows Event Logs

## Caso real: NotPetya 2017: sin logs, sin cronología, sin recuperación

NotPetya (atribuido a GRU ruso, dirigido contra Ucrania) se propagó vía M.E.Doc (software fiscal ucraniano) usando EternalBlue (MS17-010). Maersk perdió 49.000 endpoints en 7 minutos. Su recuperación dependió de un único controlador de dominio en Ghana que estaba apagado durante el ataque. Lección de telemetría: sin logs centralizados fuera de la red afectada, la reconstrucción del incidente es imposible. Coste total estimado: $10B globalmente.

## Ejercicio guiado: Mini-SOC con Wazuh: detecta 3 eventos de seguridad

1. Instala Wazuh all-in-one en una VM (Ubuntu 22.04, 4GB RAM mínimo)
2. Conecta 1-2 agentes (otra VM Linux + tu máquina Windows si tienes)
3. Genera evento 1: 10 login fallidos con ssh (usuario incorrecto)
4. Genera evento 2: escalada de privilegios con sudo su
5. Genera evento 3: descarga del test EICAR (antimalware test file)
6. Verifica las 3 alertas en el dashboard de Wazuh
7. Exporta las alertas como evidencia (JSON o captura de pantalla)
8. Escribe 1 regla Sigma personalizada para tu entorno

## Recursos abiertos

- [Wazuh Documentation](https://documentation.wazuh.com/)
- [Sigma Rules Repo](https://github.com/SigmaHQ/sigma)
- [NIST SP 800-92](https://csrc.nist.gov/publications/detail/sp/800-92/final)
- [EICAR Test File](https://www.eicar.org/download-anti-malware-testfile/)

---
[Volver al syllabus](../syllabus.md)
