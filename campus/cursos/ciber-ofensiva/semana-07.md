# Semana 7: Escaneo de vulnerabilidades y validacion

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 7 de 20

## Objetivos de aprendizaje

- Distinguir escaneo autenticado de no autenticado y saber cuándo usar cada uno
- Configurar Nmap NSE, Nikto y Nuclei sin tumbar el servicio escaneado
- Validar un hallazgo antes de escribirlo: reproducirlo y descartar el falso positivo
- Priorizar con datos: CVSS, EPSS y el catálogo KEV de CISA

## Escanear sin hacer daño

Un escáner lanza miles de peticiones; el servicio que escaneas no está ahí para aguantarte. Antes de disparar, tres decisiones:

1. **Ventana y ritmo.** Respeta la ventana del RoE y limita la concurrencia (`-T3` en Nmap, `-rate-limit` en Nuclei). Un `-T5` en producción puede ser un incidente autoinfligido.
2. **Autenticado o no.** El escaneo no autenticado ve lo que ve un extraño; el autenticado ve lo que ve un usuario con cuenta. Para medir superficie real, los dos: primero el de fuera (impacto), luego el de dentro (cobertura).
3. **Qué se excluye.** Hosts fuera de alcance, servicios frágiles (impresoras, equipos médicos, PLC) y cualquier cosa que el cliente marque como intocable. Se excluyen por escrito.

```bash
# Nmap: servicios y scripts NSE sobre puertos abiertos (ritmo moderado)
nmap -sV -sC --script vuln -T3 -p 22,80,443,3306 192.0.2.10 -oA escaneo
# Nuclei: plantillas por tecnología, con límite de ritmo y excluyendo lo delicado
nuclei -u https://ejemplo.com -t cves,exposures,misconfiguration -rl 40 -etags dos
```

**Referencias:**
- Nmap NSE — nmap.org/book/nse.html
- Nuclei — docs.projectdiscovery.io
- NIST SP 800-115 — Technical Guide to Information Security Testing

## Validar antes de escribir

Un informe con un falso positivo pierde credibilidad para siempre. La validación tiene cuatro pasos y se hace **siempre**:

1. **Reproducir** el hallazgo desde cero, en un entorno limpio, y anotar las versiones exactas.
2. **Aislar** la causa: ¿es la versión, la configuración o el código propio? Un CVE de banner no es una vulnerabilidad explotable.
3. **Medir impacto real** con un experimento mínimo (leer un fichero propio, no «extraer toda la base de datos»).
4. **Registrar evidencia** utilizable por quien no estuvo allí: comando, salida, captura y hora.

Ese trabajo es también el que fija la severidad. **CVSS** puntúa la gravedad técnica; no dice si alguien lo explota. Para eso están **EPSS** (probabilidad de explotación en 30 días) y la lista **KEV de CISA** (se sabe explotado). Priorización honesta: KEV primero, EPSS alto después, CVSS alto sin explotación conocida al final… y siempre cruzado con el impacto de negocio que definió el modelo de amenazas de la semana 6.

**Referencias:**
- FIRST — CVSS 3.1 (first.org/cvss)
- FIRST — EPSS (first.org/epss)
- CISA — Known Exploited Vulnerabilities (cisa.gov/known-exploited-vulnerabilities-catalog)

## Caso real: Log4Shell, el escaneo que no bastaba

En diciembre de 2021 apareció CVE-2021-44228 (Log4j 2, CVSS 10.0). Semanas después, el KEV de CISA ya listaba explotación activa masiva (T1190) y los atacantes usaban el JNDI para cargar clases remotas (T1059). Las organizaciones que solo ejecutaron un escáner tuvieron listas enormes de «posible afectación»; las que validaron (versión exacta + `log4j-core` en el classpath + llamada JNDI reproducible) pudieron parchear primero lo explotable. Lección: el escáner produce **candidatos**; el pentester produce **hallazgos** validados.

## Ejercicio guiado: escanea, valida y prioriza tres hallazgos

1. En tu laboratorio (Metasploitable 2 o contenedores propios), ejecuta Nmap con `-sV -sC` y guarda la salida
2. Pasa Nikto sobre el servicio web y anota los avisos, sin copiarlos al informe todavía
3. Elige 3 avisos y reprodúcelos a mano con `curl` o el navegador
4. Para cada uno: ¿es explotable? Describe el experimento mínimo y su resultado
5. Puntúa con CVSS 3.1 (calculadora de FIRST) y consulta EPSS y KEV por CVE
6. Ordena los tres por riesgo real, no por CVSS, y justifica el orden
7. Escribe la ficha de cada hallazgo con reproducción y evidencia
8. Anota qué decidiste **no** escanear y por qué (queda en el apéndice del informe)

## Recursos abiertos

- [Nmap NSE](https://nmap.org/book/nse.html)
- [Nuclei](https://docs.projectdiscovery.io/opensource/nuclei/overview)
- [EPSS](https://www.first.org/epss/)
- [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [CVSS 3.1](https://www.first.org/cvss/calculator/3.1)

---
[Volver al syllabus](../syllabus.md)
