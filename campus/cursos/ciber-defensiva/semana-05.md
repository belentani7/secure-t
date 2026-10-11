# Semana 5: Deteccion y monitorizacion

Curso: [Ciberseguridad Defensiva: Construir y Defender](../syllabus.md) · Semana 5 de 20

## 🎯 Objetivo de la semana

Pasar de acumular registros a detectar lo que importa, con reglas probadas y no con listas de deseos.

- Distinguir registro, monitorizacion y deteccion: tres cosas distintas
- Montar un laboratorio de deteccion con reglas propias y datos reales
- Escribir una regla de deteccion con su caso de prueba y su tasa de falsos positivos

## 📖 Lectura principal

### La cadena de la deteccion

**Registrar** es guardar hechos; **monitorizar** es vigilarlos; **detectar** es decidir que un hecho importa. Sin la primera, las otras dos son imposibles: nadie detecta lo que no se registra. El error clasico es comprar una herramienta de deteccion antes de tener fuentes de datos ordenadas.

El diseno minimo de un laboratorio de deteccion caso de uso a cubrir, fuente de datos, regla, y **prueba**. La prueba es la parte que casi siempre falta y la que da valor: si no puedes provocar el evento a voluntad, no puedes saber si tu regla funciona.

```bash
# Fuente barata y realista: procesos y conexiones del propio equipo
ps aux --sort=-%cpu | head -20
ss -tunap | head -30
# Con Auditd o Sysmon (Windows) se registra lo que de verdad importa
sudo auditctl -a always,exit -F arch=b64 -S execve -F key=procesos
```

**Referencias:**
- MITRE ATT&CK — Data Sources
- Sigma — github.com/SigmaHQ/sigma
- NIST SP 800-92 — Guide to Computer Security Log Management

### De la alerta a la decision

Una alerta solo es util si alguien sabe que hacer con ella. Cada regla deberia llevar escrito: **que significa**, **que decision dispara** (escalar, investigar, cerrar) y **que la hace inutil** (falsos positivos conocidos). Empezar por dos o tres reglas bien probadas rinde mas que doscientas importadas sin revisar.

## 🛠️ Práctica guiada: tu primera regla de deteccion

1. Elige un caso de uso: por ejemplo, un proceso que abre conexiones salientes raras
2. Registra la evidencia con Auditd o Sysmon durante una hora de trabajo normal
3. Disena la regla: que campos, que umbral, que ventana de tiempo
4. Escribe su prueba: como provocaras el evento de forma controlada
5. Ejecuta la prueba, mide aciertos y falsos positivos
6. Documenta la regla como una ficha: nombre, fuente, logica, respuesta, limites

## Recursos abiertos

- [Sigma](https://github.com/SigmaHQ/sigma)
- [ATT&CK Data Sources](https://attack.mitre.org/datasources/)
- [NIST SP 800-92](https://csrc.nist.gov/pubs/sp/800/92/final)

---
[Volver al syllabus](../syllabus.md)
