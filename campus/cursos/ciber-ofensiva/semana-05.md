# Semana 5: Reconocimiento avanzado y OSINT

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 5 de 20

## 🎯 Objetivo de la semana

Convertir información pública dispersa en un mapa accionable del objetivo, sin dejar huella que el cliente no conozca.

- Convertir información pública dispersa en un mapa accionable del objetivo
- Enumerar subdominios con certificados, DNS y fuerza bruta ética
- Leer metadatos de documentos y perfilar personas sin acosarlas
- Cuidar la propia huella: el reconocimiento del pentester también deja rastro

## 📖 Lectura principal

### Del dato suelto al mapa: las tres preguntas

Un reconocimiento pasivo bien hecho responde tres preguntas **antes** de tocar nada: **qué** superficie existe, **quién** la administra y **qué** valor tiene para el alcance firmado. Todo lo demás es coleccionismo.

El trabajo empieza por el dominio. Los certificados (crt.sh) revelan subdominios históricos que a veces siguen vivos; los registros DNS cuentan una historia: los MX delatan el proveedor de correo, los TXT muestran SPF y DMARC (y con ellos, si suplantar el dominio es fácil), los NS dicen quién aloja la zona y, a veces, con qué otras empresas se relaciona. La Wayback Machine guarda versiones que alguien quiso borrar: portales antiguos, endpoints retirados, notas de prensa con contactos. Y los documentos públicos llevan metadatos: autor, plantilla, rutas internas del sistema que los generó.

**Referencias:**
- MITRE ATT&CK — T1593 Search Open Websites/Domains
- MITRE ATT&CK — T1596 Search Open Technical Databases
- RFC 7208 (SPF) y RFC 7489 (DMARC)

### Herramientas y automatización razonable

La enumeración manual escala mal; la automatización sin criterio genera ruido que nadie lee.

```bash
# Subdominios: certificados + DNS + permutaciones (amass, modo pasivo)
amass enum -passive -d ejemplo.com -o subdominios.txt
# Correos y hosts públicos (theHarvester)
theHarvester -d ejemplo.com -b bing,duckduckgo -f informe.html
# Metadatos de un documento público
exiftool documento-publico.pdf | grep -Ei 'author|creator|producer'
```

Regla de elección: una herramienta por pregunta. `amass` para superficie, `theHarvester` para identidad y correos, `exiftool` para documentos, `curl` y `jq` para APIs públicas. Si no sabes qué pregunta responde una herramienta, no la lances: añade ruido y, en modo activo, tráfico que el cliente tendrá que explicar.

**El perfilado de personas se hace para el informe, no para la intrusión.** Saber que la responsable de sistemas aparece en charlas y publicaciones sirve para escribir qué simulación de ingeniería social sería realista en un ejercicio autorizado. Ese es el límite: lo que no se puede justificar en el alcance, no se recoge. Y la minimización aplica también al OSINT: se guarda lo necesario, con fecha y fuente, y se borra lo que sobra al cerrar el proyecto.

**Higiene del propio pentester:** el reconocimiento deja huella (consultas a crt.sh con tu IP corporativa, visitas al sitio del cliente). Usa una salida de red declarada al cliente, evita iniciar sesión en servicios con cuentas personales y documenta qué hiciste y cuándo: si el cliente ve tráfico raro, tu registro es la respuesta.

**Referencias:**
- OWASP Amass — github.com/owasp-amass/amass
- theHarvester — github.com/laramies/theHarvester
- ExifTool — exiftool.org

### Caso real: Scattered Spider y el reconocimiento que abrió un casino (2023)

En 2023, el grupo conocido como Scattered Spider (atribuido a ALPHV/BlackCat) entró en MGM Resorts y Caesars Entertainment sin explotar una sola vulnerabilidad de software. El reconocimiento fue social: perfilaron empleados en redes profesionales, llamaron a la mesa de ayuda haciéndose pasar por ellos (vishing, T1566) y consiguieron restablecer el MFA. Con una cuenta válida (T1078) el resto fue movimiento lateral y cifrado de sistemas. Lección para esta semana: el reconocimiento avanzado no termina en los certificados. Cuando el informe dice «existe un procedimiento de restablecimiento de MFA por teléfono», eso es un hallazgo de seguridad, aunque no tenga CVE.

## 🛠️ Práctica guiada: perfil avanzado de un dominio autorizado

1. Elige un dominio propio o con programa público de bug bounty (y cita el programa)
2. Enumera subdominios con `amass enum -passive` y compara con `crt.sh`
3. Revisa DNS: MX, NS, TXT. Anota SPF y DMARC y explica si permiten suplantación
4. Busca en Wayback Machine versiones de hace 2-3 años y anota 3 diferencias
5. Descarga un PDF público y lee sus metadatos con `exiftool`: ¿quién lo generó?
6. Documenta cada dato con fuente, fecha y pregunta que responde
7. Escribe una ficha de una página: superficie, responsables y valor para el alcance
8. Añade una sección de «huella propia»: por dónde saliste, qué consultaste y cuándo

## Recursos abiertos

- [OWASP Amass](https://github.com/owasp-amass/amass)
- [crt.sh](https://crt.sh/)
- [theHarvester](https://github.com/laramies/theHarvester)
- [ExifTool](https://exiftool.org/)
- [ATT&CK Reconnaissance (TA0043)](https://attack.mitre.org/tactics/TA0043/)

---
[Volver al syllabus](../syllabus.md)
