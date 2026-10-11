# Semana 8: Hardening de sistemas

Curso: [Ciberseguridad Defensiva: Construir y Defender](../syllabus.md) · Semana 8 de 20

## Objetivos de aprendizaje

- Reducir superficie de ataque con criterio: menos servicios, menos permisos, menos rutas
- Aplicar una linea base verificable en lugar de una lista de deseos
- Medir el antes y el despues con una comprobacion automatica

## Menos es mas: las cuatro reducciones

1. **Servicios**: lo que no se usa, se apaga y se desinstala.
2. **Permisos**: privilegio minimo por usuario, servicio y proceso; `sudo` con lista blanca.
3. **Rutas**: cierra lo que no necesita estar expuesto; el acceso interno pasa por un punto controlado.
4. **Credenciales**: sin contrasenas compartidas, sin claves en el codigo, rotacion con registro.

El hardening se sostiene con **linea base**: un documento ejecutable que dice como debe estar el sistema, y una comprobacion que lo verifica. Sin comprobacion, en tres meses el sistema vuelve a su estado original.

```bash
# Linea base minima en un servidor Linux
sudo ss -tulpn                                    # que escucha y quien
sudo systemctl list-unit-files --state=enabled    # que arranca solo
sudo grep -rE '^\s*PermitRootLogin|^\s*PasswordAuthentication' /etc/ssh/sshd_config
# Comprobacion automatica del estado esperado (falla si algo cambio)
sudo test "$(ss -tulpnH | wc -l)" -le 8 && echo 'OK: superficie bajo control'
```

**Referencias:**
- CIS Benchmarks — cisecurity.org/cis-benchmarks
- NIST SP 800-123 — Guide to General Server Security
- ANSSI — Recomendaciones de configuracion

## Medir el antes y el despues

Un panel de hardening que nadie ejecuta no protege nada. La prueba de que esta semana sirvio es simple: guarda la salida de las comprobaciones antes y despues, y compara. Lo que no se puede medir, no se puede mantener.

## Ejercicio guiado: endurece un servidor y demuestralo

1. Parte de una maquina virtual recien instalada (o un contenedor con SSH)
2. Levanta el inventario: puertos a la escucha, servicios habilitados, usuarios con shell
3. Aplica las cuatro reducciones y documenta cada cambio con su motivo
4. Escribe un script de comprobacion que devuelva OK o FALLO por cada regla
5. Ejecutalo antes y despues y guarda las dos salidas
6. Anade el script a una tarea programada y define quien revisa los fallos
7. Cierra con una tabla: cambio, riesgo que reduce, como se comprueba

## Recursos abiertos

- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
- [NIST SP 800-123](https://csrc.nist.gov/pubs/sp/800/123/final)
- [OpenSCAP](https://www.open-scap.org/)

---
[Volver al syllabus](../syllabus.md)
