# Semana 2: Reconocimiento pasivo y OSINT

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 2 de 20

## Objetivos de aprendizaje

- Ejecutar reconocimiento pasivo sin enviar un solo paquete al objetivo
- Usar Google dorks, crt.sh, Wayback Machine y Shodan para recopilar inteligencia
- Enumerar subdominios, tecnologías y emails expuestos de un dominio autorizado
- Documentar hallazgos OSINT en formato reproducible

## Reconocimiento pasivo: ver sin tocar

El reconocimiento pasivo recopila información sobre el objetivo sin enviar tráfico directo a su infraestructura. No toca servidores, no dispara alertas IDS, no deja logs en el objetivo. Es legal en la mayoría de jurisdicciones porque solo consulta información pública.

MITRE ATT&CK clasifica el reconocimiento en la táctica TA0043 con técnicas específicas:
- **T1593 — Search Open Websites/Domains:** Google, Bing, redes sociales
- **T1596 — Search Open Technical Databases:** Shodan, Censys, crt.sh
- **T1592 — Gather Victim Host Information:** OS, software, versiones
- **T1589 — Gather Victim Identity Information:** emails, nombres, roles
- **T1590 — Gather Victim Network Information:** rangos IP, ASN, DNS

**Regla del 70%:** en un pentest profesional, aproximadamente el 70% de la inteligencia útil proviene del reconocimiento pasivo. El escaneo activo (nmap, nikto) complementa, pero no sustituye.

**Referencias:**
- MITRE ATT&CK — TA0043 Reconnaissance
- T1593 — Search Open Websites/Domains
- T1596 — Search Open Technical Databases
- T1592 — Gather Victim Host Information
- T1589 — Gather Victim Identity Information
- T1590 — Gather Victim Network Information

## Herramientas OSINT: el arsenal pasivo

Cada herramienta OSINT tiene un propósito específico. No se trata de lanzar todas; se elige según lo que se busca.

**DNS y subdominios:**
```
# Subdominios vía certificados (Certificate Transparency)
curl -s 'https://crt.sh/?q=%.ejemplo.com&output=json' | jq '.[].name_value' | sort -u
# DNS pasivo con dnsdumpster.com (web) o subfinder (CLI)
subfinder -d ejemplo.com -silent
```

**Google dorks (búsqueda avanzada):**
```
site:ejemplo.com filetype:pdf        # documentos PDF indexados
site:ejemplo.com inurl:admin          # paneles de administración
site:ejemplo.com intitle:"index of"   # directorios abiertos
site:ejemplo.com ext:sql | ext:env    # backups y configs expuestas
```

**Certificados y tecnologías:**
- **crt.sh:** Certificate Transparency logs — muestra todos los certificados emitidos para un dominio, revelando subdominios internos
- **Wappalyzer / BuiltWith:** identifican stack tecnológico (CMS, framework, servidor, CDN) sin enviar tráfico sospechoso
- **Wayback Machine:** versiones históricas del sitio; puede revelar endpoints eliminados, credenciales en código fuente antiguo

**Shodan (motores de búsqueda de dispositivos):**
```
# Buscar servicios expuestos de una organización
shodan search 'org:"Ejemplo S.A."'
# Filtrar por puerto y producto
shodan search 'hostname:ejemplo.com port:443 product:Apache'
```

**Emails y credenciales filtradas:**
- **Hunter.io:** emails corporativos asociados a un dominio
- **Have I Been Pwned (HIBP):** verifica si un email aparece en brechas
- **Dehashed:** búsqueda avanzada en filtraciones (requiere cuenta)

**Referencias:**
- crt.sh — Certificate Transparency
- Shodan — shodan.io
- HIBP — haveibeenpwned.com
- Google Hacking Database — exploit-db.com/google-hacking-database

## Documentación de hallazgos OSINT

Cada dato recopilado se documenta de forma reproducible. Un hallazgo OSINT sin fuente ni fecha es inútil para el informe.

**Formato por hallazgo:**
```
HALLAZGO: Subdominio interno expuesto
FUENTE:   crt.sh, certificado CN=staging.ejemplo.com
FECHA:    2026-09-12
DATO:     staging.ejemplo.com (IP: 203.0.113.42)
RIESGO:   Entorno de staging accesible desde internet puede
          contener código sin auditar y datos de prueba reales
EVIDENCIA: captura-crtsh-staging.png
ATT&CK:   T1596.003 (Search Open Technical Databases: Digital Certs)
```

**Herramientas de organización:**
- **Maltego CE (Community Edition):** grafo visual de relaciones entre entidades (dominios → IPs → emails → personas)
- **Hoja de cálculo:** para volumen alto; columnas: tipo, dato, fuente, fecha, riesgo, técnica ATT&CK
- **Obsidian / CherryTree:** notas enlazadas para investigaciones largas

**Errores comunes a evitar:**
1. Recopilar sin documentar — el dato que no se registra no existe
2. Mezclar pasivo con activo — un escaneo nmap no es OSINT
3. No validar — un email de Hunter.io puede estar obsoleto
4. Guardar datos personales innecesarios — aplica minimización

**Referencias:**
- T1596.003 — Digital Certificates
- Maltego CE — maltego.com
- OSINT Framework — osintframework.com

## Caso real: Capital One 2019: el recon que reveló una brecha de 100M de registros

Paige Thompson (alias 'erratic') descubrió una misconfiguration en el WAF de Capital One alojado en AWS. El metadata service de EC2 (169.254.169.254) era accesible vía SSRF, exponiendo credenciales IAM temporales. Con ellas extrajo datos de 100 millones de clientes. Lección de recon: los metadatos cloud son un vector OSINT crítico. Técnica ATT&CK: T1552.005 (Cloud Instance Metadata API). CWE: CWE-918 (SSRF). La atacante fue condenada porque NO tenía autorización — un pentester ético con RoE habría reportado el hallazgo.

## Ejercicio guiado: Perfil OSINT completo de un dominio propio

1. Elige un dominio que controles (o usa 'scanme.nmap.org', autorizado por Nmap)
2. Subdominios: consulta crt.sh y anota todos los CN encontrados
3. Google dorks: busca site:tudominio filetype:pdf, inurl:admin, intitle:index
4. Tecnologías: visita el sitio con Wappalyzer y anota CMS, servidor, framework
5. Wayback Machine: busca versiones de hace 1-2 años, compara con la actual
6. Emails: busca en Hunter.io (free tier) y verifica 1 email en HIBP
7. Documenta cada hallazgo con el formato: dato/fuente/fecha/riesgo/ATT&CK
8. Crea un grafo simple (papel o draw.io): dominio → subdominios → IPs → techs

## Recursos abiertos

- [crt.sh](https://crt.sh/)
- [Shodan](https://www.shodan.io/)
- [Google Hacking DB](https://www.exploit-db.com/google-hacking-database)
- [OSINT Framework](https://osintframework.com/)
- [Have I Been Pwned](https://haveibeenpwned.com/)

---
[Volver al syllabus](../syllabus.md)
