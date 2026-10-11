# Semana 7: Forense digital basico

Curso: [Ciberseguridad Defensiva: Construir y Defender](../syllabus.md) · Semana 7 de 20

## Objetivos de aprendizaje

- Aplicar el orden de volatilidad al recoger evidencia
- Trabajar con imagenes y artefactos sin modificarlos (cadena de custodia)
- Reconstruir una linea de tiempo minima de un equipo comprometido

## Orden de volatilidad: que se pierde primero

La evidencia se recoge de lo que desaparece antes a lo que aguanta mas: **memoria y procesos → conexiones → disco → copias y logs remotos**. Apagar el equipo destruye la primera capa. Si el equipo esta cifrado con clave en memoria, apagarlo puede dejar los datos inaccesibles para siempre.

Toda captura se documenta: quien, cuando, con que herramienta, hash del resultado. Un fichero sin hash no es evidencia; es una copia.

```bash
# Memoria y conexiones (nunca escribir en el disco investigado)
ss -tunap > /mnt/evidencia/conexiones.txt
# Imagen forense con hash y verificacion
sudo dd if=/dev/sda of=/mnt/evidencia/disco.img bs=4M conv=noerror,sync status=progress
sha256sum /mnt/evidencia/disco.img > /mnt/evidencia/disco.img.sha256
# Linea de tiempo simple a partir de metadatos
find /mnt/evidencia/montaje -printf '%T@ %p\n' | sort -n | head -50
```

**Referencias:**
- NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response
- RFC 3227 — Guidelines for Evidence Collection and Archiving

## Linea de tiempo: el relato minimo

Una investigacion no termina con «encontre un fichero raro», sino con una secuencia: primero esto, despues aquello. Con marcas de tiempo de ficheros, logs de autenticacion y registros de procesos se construye esa secuencia. Ordenar bien ya descarta explicaciones innocentes: a veces el «ataque» es una tarea de mantenimiento.

## Ejercicio guiado: linea de tiempo de un compromiso simulado

1. En tu laboratorio, monta una maquina virtual y deja dos o tres «huellas» controladas
2. Antes de tocar nada, anota el orden de volatilidad que vas a seguir
3. Captura conexiones y procesos, y guarda el hash de cada salida
4. Haz una imagen del disco con `dd` y verifica su integridad
5. Monta la imagen en solo lectura y extrae marcas de tiempo de `/var/log` y `/tmp`
6. Ordena los hechos en una linea de tiempo con su explicacion
7. Cierra el informe con tres recomendaciones de mejora para el proximo caso

## Recursos abiertos

- [RFC 3227](https://www.rfc-editor.org/rfc/rfc3227)
- [NIST SP 800-86](https://csrc.nist.gov/pubs/sp/800/86/final)
- [The Sleuth Kit](https://www.sleuthkit.org/sleuthkit/)

---
[Volver al syllabus](../syllabus.md)
