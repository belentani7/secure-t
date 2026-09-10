# Secure-T Business Operating System

## Conclusión ejecutiva

La empresa no necesita otro generador de proyectos. Necesita convertir capacidad técnica en **ofertas verificables, contratos y casos de éxito**. El cuello de botella identificado en la documentación reciente es la convergencia: demasiados activos, poca distribución, ningún ingreso verificado y tareas pendientes concentradas en venta, publicación y cierre.

Secure-T se adopta como núcleo porque ya combina educación, laboratorios, gobernanza de IA y evaluación por evidencia. La primera empresa vendible se estructura alrededor de cuatro líneas, en este orden:

1. **Trust & Safety / Integrity Operations**, con revisiones de políticas, controles y operaciones de enforcement.
2. **Evaluación y red-teaming multilingüe de modelos**, con matrices de pruebas y reportes reproducibles.
3. **Automatización con IA para pymes**, únicamente como servicio acotado por alcance y criterios de aceptación.
4. **Inclusión digital y formación**, activada cuando exista un comprador institucional o financiación confirmada.

## Estructura organizativa mínima

| Dominio | Responsabilidad | Salida medible |
|---|---|---|
| Dirección y ventas | Elegir nicho, contactar, descubrir, presupuestar y cerrar | Oportunidades con siguiente acción y fecha |
| Trust & Safety | Policy review, risk assessment, enforcement playbooks | Informe firmado y backlog priorizado |
| Model Evaluation | Diseñar pruebas, ejecutar red-team, medir resultados | Dataset, matriz y reporte reproducible |
| Delivery | Convertir venta en proyecto con criterios de aceptación | Entrega aceptada por cliente |
| Evidence & QA | Mantener repositorios, demos, hashes, permisos y casos | Evidencia verificable reutilizable |
| Operaciones | Finanzas, contratos, agenda, seguimiento y archivo | Estado semanal de caja y pipeline |

## Modelo de datos operativo

- `accounts`: organización o cliente, área, estado y responsable.
- `opportunities`: oportunidad comercial, valor, probabilidad, próxima acción y fecha.
- `projects`: trabajo vendido, área, propietario y criterios de aceptación.
- `evidence`: repositorios, demos, informes, cursos y casos, siempre con URI y verificación.
- `pipelines`: ejecuciones auditables con entrada, salida, estado terminal y error.

La implementación inicial usa un almacén en memoria para poder operar sin bloquear el desarrollo por credenciales de base de datos. La siguiente migración debe persistir estas entidades en PostgreSQL/Drizzle y añadir `tenant_id`, usuarios, roles y auditoría append-only.

## Pipelines

### 1. Lead → Discovery
Entrada: cuenta y contexto. Salida: llamada agendada, problema formulado, decisor identificado y presupuesto estimado. No se permite pasar a propuesta sin una siguiente acción fechada.

### 2. Discovery → Proposal
Entrada: oportunidad cualificada. Salida: propuesta con alcance, precio, exclusiones, criterios de aceptación, responsable y calendario.

### 3. Proposal → Delivery
Entrada: oportunidad ganada. Salida: proyecto con criterios de aceptación y repositorio de evidencia. El trabajo no empieza como “proyecto abierto”; empieza como contrato con definición de terminado.

### 4. Delivery → Case Study
Entrada: proyecto entregado. Salida: evidencia verificada, métricas antes/después, permiso de uso y caso de estudio publicable. La distribución es parte del producto, no una tarea opcional.

## API disponible

Base: `/api/business`

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/health` | Estado del servicio |
| GET | `/snapshot` | Vista operativa completa |
| GET | `/kpis` | Cuentas, pipeline ponderado, proyectos y evidencia |
| GET | `/config` | Áreas y pipelines admitidos |
| POST | `/accounts` | Crear cuenta |
| POST | `/opportunities` | Crear oportunidad validada |
| POST | `/projects` | Crear proyecto con aceptación |
| POST | `/evidence` | Registrar evidencia verificable |
| POST | `/pipelines/:type/run` | Ejecutar checkpoint de pipeline |
| PATCH | `/pipelines/:id` | Cambiar estado terminal o de trabajo |

## Plan de 30 días

**Días 1–3:** seleccionar una oferta única de Trust & Safety, crear una página de venta, publicar una demo y definir precio piloto.

**Días 4–10:** contactar a 30 compradores concretos, realizar al menos cinco conversaciones y registrar todo en `accounts` y `opportunities`.

**Días 11–20:** cerrar un piloto pagado pequeño, entregar con criterios de aceptación y conservar evidencia autorizada.

**Días 21–30:** convertir el piloto en caso de estudio, publicar la prueba y repetir el canal. Congelar la creación de nuevos repositorios salvo que un contrato lo exija.

## Guardrails

- No borrar activos: archivar o poner en cuarentena.
- No publicar datos de clientes sin permiso.
- No afirmar acreditación oficial ni resultados no medidos.
- No ejecutar acciones externas irreversibles desde un pipeline sin aprobación humana.
- Todo resultado comercial debe tener responsable, fecha, siguiente acción y evidencia.
- La autenticación y autorización multiempresa deben integrarse antes de exponer el servicio públicamente.
