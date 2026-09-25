# Cyber Range y laboratorios

## Flujo

`Student → Lab API → Lab Instance → Isolated Environment → Task → Telemetry → Assessment → Evidence → Destroy`.

## Modelo

Cada lab define objective, difficulty, skills, environment, instructions, tasks, hints, validation, evidence, time_limit y cleanup policy. La instancia debe tener límites de CPU, memoria, tiempo, filesystem y red.

## Infraestructura

La aplicación principal sólo orquesta. Un worker separado crea entornos efímeros con imágenes versionadas, red aislada y credenciales de corta duración. CTFd puede evaluarse para retos y competición; NetBox puede evaluarse como fuente de verdad de redes. Ningún lab debe comunicarse con producción.

## Estado

**Contrato y límites documentados; ejecución aislada pendiente.**

[1]: https://github.com/CTFd/CTFd "CTFd"
[2]: https://github.com/netbox-community/netbox "NetBox"
