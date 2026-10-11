# Semana 8: Ataques a aplicaciones web (OWASP Top 10)

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 8 de 20

## Objetivos de aprendizaje

- Explicar y probar las categorías del OWASP Top 10 2021 en un entorno propio
- Diferenciar control de acceso roto de inyección: distinto fallo, distinta defensa
- Usar herramientas de intercepción (proxy) con criterio, no como botón mágico
- Escribir un hallazgo web con reproducción, impacto de negocio y remediación

## Las diez familias, con la mirada de quien ataca

El Top 10 2021 no es un catálogo de vulnerabilidades sueltas sino de **familias** que se repiten. Para el pentester, saber qué familia tiene delante cambia el experimento:

- **A01 Control de acceso roto.** El fallo rey en la práctica. Prueba: cambiar un identificador, quitar un parámetro, usar el rol equivocado. CWE-639, CWE-284.
- **A02 Fallos criptográficos.** Datos sensibles sin cifrar o con cifrado mal aplicado. Prueba: mirar tráfico y respuestas, revisar cookies y tokens. CWE-319, CWE-327.
- **A03 Inyección.** SQL, NoSQL, comandos, plantillas. Prueba: comillas y metacaracteres en un punto de entrada controlado, midiendo el eco. CWE-89, CWE-78.
- **A04 Diseño insegura.** Reglas de negocio que permiten abusos que ningún escáner ve (por ejemplo, pedir 10.000 unidades cuando hay 3 en stock).
- **A05 Configuración incorrecta.** Cabeceras ausentes, directorios listados, paneles de administración expuestos, credenciales por defecto.
- **A06 Componentes desactualizados.** `nuclei -t cves` ordena candidatos; la versión exacta decide.
- **A07 Fallos de identificación y autenticación.** Sin límite de intentos, sesiones que no expiran, MFA eludible.
- **A08 Integridad de software y datos.** Deserialización insegura, actualizaciones sin firmar.
- **A09 Registro y monitoreo insuficientes.** Prueba: ¿cuánto tarda el equipo en detectar tu intento autorizado?
- **A10 SSRF.** El servidor como puente hacia su red interna. Prueba: URL controlada por ti que apunte a una dirección interna.

**Referencias:**
- OWASP Top 10 2021 — owasp.org/Top10/
- OWASP WSTG — owasp.org/www-project-web-security-testing-guide
- CWE Top 25 — cwe.mitre.org/top25

## Herramientas: el proxy como cuaderno de laboratorio

La herramienta central de esta semana no escanea: **intercepta**. Con un proxy (ZAP o Burp Community) ves y modificas la petición real, que es donde viven estas diez familias.

```bash
# Proxy local, comprobación rápida con curl (sin repetir la request a mano)
curl -sv -x http://127.0.0.1:8080 https://lab.ejemplo.test/orders/1042 -H 'Cookie: sid=...'
# Prueba de IDOR: la misma petición con el identificador de otro usuario
curl -s -b 'sid=...' https://lab.ejemplo.test/orders/1043 | head -c 400
# Fuzzing controlado de parámetros con ffuf (0,3 req/s, dentro del RoE)
ffuf --url 'https://lab.ejemplo.test/item?id=FUZZ' -w ids.txt -rate 1 -mc all -fc 404
```

Dos reglas: la primera petición rara se mira a mano antes de automatizar; y **todo lo que descubres se demuestra con el mínimo daño** (leer un registro propio, no volcar la tabla).

**Referencias:**
- OWASP ZAP — zaproxy.org
- ffuf — github.com/ffuf/ffuf

## Caso real: Capital One 2019, la SSRF que cruzó la frontera

Una trabajadora de una empresa ajena al banco aprovechó una regla de firewall mal configurada y, desde el servidor de aplicaciones, consultó el servicio de metadatos de la nube para obtener credenciales temporales (SSRF, T1552.005). Con esas credenciales listó y copió datos de 100 millones de clientes. El detalle didáctico: la vulnerabilidad no estaba en «un endpoint viejo» aislado, sino en la combinación de una frontera de confianza mal cerrada (servidor → metadatos) y permisos excesivos. En el informe, ese hallazgo es **A10 + A05 + identidad**: se escribe junto, no en tres apartados distintos.

## Ejercicio guiado: caza las diez familias en Juice Shop

1. Levanta OWASP Juice Shop en tu laboratorio: `docker run --rm -p 3000:3000 bkimminich/juice-shop`
2. Arranca ZAP o Burp, apunta el navegador al proxy y navega la tienda con certificado de laboratorio
3. Encuentra un **A01**: accede a la cesta de otro usuario cambiando el identificador
4. Encuentra un **A03**: prueba una comilla en el buscador y observa el error; documenta el eco
5. Encuentra un **A05**: busca `robots.txt`, `/.git/` y cabeceras de seguridad ausentes
6. Encuentra un **A07**: pide un token con contraseña incorrecta 20 veces y mide la respuesta
7. Para cada uno: petición, respuesta, captura y severidad CVSS 3.1 propuesta
8. Redacta **un** hallazgo completo (título, descripción, reproducción, impacto, remediación, referencias) como si fuera el cliente quien debe arreglarlo mañana

## Recursos abiertos

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---
[Volver al syllabus](../syllabus.md)
