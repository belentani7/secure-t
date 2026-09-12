# Workflow Orchestrator

El repositorio incorpora un orquestador Python pequeño para conectar los validadores que ya existían en Secure-T: comprobación TypeScript, pruebas, validación de Python y auditoría de PII. No duplica la fábrica de contenido ni ejecuta CLIs externos de forma arbitraria.

## Uso

Desde la raíz del repositorio:

```bash
PYTHONPATH=. python -m orchestrator.cli
PYTHONPATH=. python -m orchestrator.cli --execute
PYTHONPATH=. python -m orchestrator.cli --execute --repair
```

El primer comando genera un plan y registra la ejecución en `audit/orchestrator-runs.jsonl`, sin ejecutar nada. `--execute` es explícito: solo invoca los comandos fijos definidos por el orquestador. Tras una ejecución correcta guarda una huella en `.orchestrator-state.json`; las siguientes ejecuciones no repiten validaciones si no cambió el contenido rastreado.

`--repair` resuelve el bloqueo habitual de un checkout nuevo: si falta `node_modules`, ejecuta `pnpm install --frozen-lockfile` antes de las validaciones. La reparación no ejecuta scripts arbitrarios ni modifica secretos; usa exclusivamente el lockfile del repositorio. El resultado indica `repaired: true` cuando la instalación fue necesaria y correcta.

También queda disponible, tras instalar el paquete Python de la fábrica, el comando `securet-orchestrator`.

## Decisiones

La primera versión es determinista y local. El enrutamiento basado en modelos o prompts no se activa porque introduciría credenciales, costes y una superficie de ejecución innecesaria. La automatización externa (cron, webhooks o despliegue permanente) debe añadirse después de elegir explícitamente dónde debe vivir el proceso y qué secretos puede usar.

El registro JSONL proporciona trazabilidad sin afirmar que el sistema sea un control de seguridad productivo. La auditoría PII existente puede devolver código distinto de cero ante hallazgos; en ese caso el orquestador detiene el flujo y no actualiza el estado de éxito.
