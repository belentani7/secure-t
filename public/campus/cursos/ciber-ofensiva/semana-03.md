# Semana 3: Los 10 riesgos web (OWASP Top 10)

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 3 de 20

## Objetivos de aprendizaje

- Explicar los 10 riesgos web OWASP Top 10 (2021) con ejemplos reales
- Reproducir una inyección SQL y un XSS en entorno de laboratorio legal
- Mapear vulnerabilidades web a CWE y técnicas ATT&CK
- Proponer remediaciones concretas para cada riesgo demostrado

## OWASP Top 10 (2021): los riesgos que más brechas causan

OWASP Top 10 es un consenso comunitario sobre los 10 riesgos web más críticos. Se actualiza cada 3-4 años con datos reales de incidentes.

**A01:2021 — Broken Access Control** (CWE-284, CWE-639)
El servidor confía en el cliente para controlar el acceso. Ejemplo: cambiar `?user_id=123` a `?user_id=124` y acceder a datos ajenos (IDOR — Insecure Direct Object Reference). ATT&CK: T1078.

**A02:2021 — Cryptographic Failures** (CWE-327, CWE-328)
Datos sensibles sin cifrar o con algoritmos rotos (MD5, SHA1 sin sal). Contraseñas en texto plano, cookies sin Secure/HttpOnly.

**A03:2021 — Injection** (CWE-89 SQLi, CWE-79 XSS, CWE-77 Command)
Input del usuario que se ejecuta como código. La defensa universal: **nunca concatenar input en queries/comandos**; usar prepared statements, parametrización, encoding de salida.

```sql
-- VULNERABLE (concatenación):
SELECT * FROM users WHERE name = '' + input + '
-- SEGURO (prepared statement):
SELECT * FROM users WHERE name = ?   -- el driver escapa automáticamente
```

**A04:2021 — Insecure Design** (CWE-209, CWE-256)
Fallos de arquitectura que no se arreglan parcheando: falta de rate limiting, preguntas de seguridad predecibles, ausencia de modelo de amenazas.

**Referencias:**
- OWASP Top 10 — owasp.org/Top10/
- CWE-89 — SQL Injection
- CWE-79 — Cross-site Scripting
- CWE-284 — Improper Access Control
- T1078 — Valid Accounts

## OWASP Top 10: riesgos A05 a A10

**A05:2021 — Security Misconfiguration** (CWE-16)
Permisos por defecto, headers faltantes, stack traces en producción, servicios innecesarios activos. Incluye XML External Entities (XXE).

**A06:2021 — Vulnerable & Outdated Components** (CWE-1104)
Dependencias con CVEs conocidos sin parchear. `npm audit`, `pip-audit`, `trivy` detectan automáticamente. La mayor fuente de brechas masivas.

**A07:2021 — Identification & Authentication Failures** (CWE-287)
Credenciales débiles, sesiones que no expiran, falta de MFA en cuentas privilegiadas, brute force sin rate-limit.

**A08:2021 — Software & Data Integrity Failures** (CWE-502)
Deserialización insegura, pipelines CI/CD sin verificación de firmas, updates sin validación de integridad. ATT&CK: T1195 (Supply Chain).

**A09:2021 — Security Logging & Monitoring Failures** (CWE-778)
Sin logs de eventos de seguridad, sin alertas, sin capacidad de detectar una brecha. En promedio, una brecha tarda 287 días en detectarse (IBM 2023).

**A10:2021 — Server-Side Request Forgery (SSRF)** (CWE-918)
El servidor hace peticiones a URLs controladas por el atacante. Vector crítico en entornos cloud: acceso al metadata service (169.254.169.254). ATT&CK: T1090.

**Referencias:**
- CWE-918 — SSRF
- CWE-502 — Deserialization
- T1195 — Supply Chain Compromise
- IBM Cost of a Data Breach Report 2023

## Laboratorio práctico: SQLi y XSS en Juice Shop

OWASP Juice Shop es una aplicación web deliberadamente vulnerable, mantenida por OWASP como herramienta educativa. Se ejecuta en local (Docker o Node.js) — nunca en un servidor público.

**Instalación:**
```bash
# Opción 1: Docker (recomendada)
docker run --rm -p 3000:3000 bkimminich/juice-shop
# Opción 2: Node.js
git clone https://github.com/juice-shop/juice-shop.git
cd juice-shop && npm install && npm start
# Abrir http://localhost:3000
```

**Ejercicio 1 — SQL Injection (A03, CWE-89):**
1. Ve al login de Juice Shop
2. En el campo email, introduce: `' OR 1=1--`
3. Contraseña: cualquier cosa
4. Observa: entras como admin sin conocer credenciales
5. ¿Por qué funciona? El backend concatena el input en la query SQL
6. Remediación: prepared statements + validación de input

**Ejercicio 2 — Reflected XSS (A03, CWE-79):**
1. Ve a la barra de búsqueda de Juice Shop
2. Busca: `<iframe src="javascript:alert('XSS')">`
3. Observa: el script se ejecuta en tu navegador
4. ¿Por qué funciona? El input se refleja sin encoding en el HTML
5. Remediación: encoding de salida (HTML entities) + Content-Security-Policy

**Documentación del hallazgo:**
```
HALLAZGO:  SQL Injection en endpoint de login
SEVERIDAD: CVSS 9.8 (Critical)
CWE:       CWE-89
ATT&CK:    T1190 (Exploit Public-Facing Application)
REPRO:     Email: ' OR 1=1-- / Pass: x → acceso admin
IMPACTO:   Bypass completo de autenticación
REMEDIO:   Usar ORM con prepared statements
```

**Referencias:**
- OWASP Juice Shop — owasp.org/www-project-juice-shop/
- T1190 — Exploit Public-Facing Application
- CWE-89 — SQL Injection
- CWE-79 — Cross-site Scripting

## Caso real: Equifax 2017: CVE-2017-5638 (Apache Struts) — 147M registros

Equifax no parcheó CVE-2017-5638 (RCE en Apache Struts, CVSS 10.0) durante 2 meses después de la publicación del parche. Un atacante explotó la vulnerabilidad A06 (Vulnerable Components) para acceder a datos de 147 millones de personas: SSN, fechas de nacimiento, direcciones. Coste: $700M en acuerdos. Lección: `A06 — Vulnerable & Outdated Components` mata. Un npm audit / pip-audit semanal habría evitado la brecha.

## Ejercicio guiado: Encuentra y documenta 3 vulnerabilidades en Juice Shop

1. Instala Juice Shop con Docker: docker run --rm -p 3000:3000 bkimminich/juice-shop
2. Abre http://localhost:3000 y explora la aplicación como usuario normal
3. Intenta el SQLi del login: ' OR 1=1--
4. Busca un XSS reflejado en la barra de búsqueda
5. Explora el panel /administration (IDOR — A01)
6. Para cada hallazgo documenta: descripción, CWE, CVSS estimado, reproducción, remediación
7. Opcional: consulta el Juice Shop Score Board (/score-board) para más retos

## Recursos abiertos

- [OWASP Top 10](https://owasp.org/Top10/)
- [Juice Shop](https://owasp.org/www-project-juice-shop/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)

---
[Volver al syllabus](../syllabus.md)
