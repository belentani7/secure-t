# Semana 7: Riesgo de terceros y supply chain

Curso: [Gobernanza y Compliance: Dirigir con Evidencia](../syllabus.md) · Semana 7 de 20

## Objetivos de aprendizaje

- Medir el riesgo que se hereda al integrar un proveedor o una dependencia
- Pedir evidencia en lugar de certificados enmarcados
- Escribir clausulas de seguridad que se puedan verificar

## El riesgo heredado no se ve en tu panel

Tu nivel de seguridad incluye el de tus proveedores, bibliotecas y servicios. Tres preguntas ordenan el trabajo:

1. **Que accede a que.** Un proveedor con acceso a datos personales no es lo mismo que uno que solo cobra por transferencia.
2. **Que evidencia existe.** SOC 2, ISO 27001 o un cuestionario propio: sirve lo que se puede revisar, con fecha y alcance.
3. **Que pasa si falla.** Plan de salida, datos que se pueden recuperar y en que plazo.

Dos reglas practicas que casi nadie aplica: **criticidad antes que popularidad** (un paquete pequenisimo mantenido por una persona puede estar en la ruta critica de tus pagos) y **dependencias transitivas cuentan** (lo que tu proveedor usa tambien es tu riesgo).

**Referencias:**
- NIST SP 800-161 Rev.1 — C-SCRM
- ISO/IEC 27036 — Supplier relationships
- CISA — Software Bill of Materials (SBOM)

## Caso real: la actualizacion firmada que traia intrusion

En la brecha de la cadena de suministro mas citada de la decada, la actualizacion de un producto de monitorizacion ampliamente desplegado llego con codigo malicioso dentro; miles de organizaciones la instalaron **porque confiaban en el proveedor**. La leccion de gobernanza: la confianza no se compra con un certificado; se mantiene con verificacion continua (build reproducible, SBOM, doble control de release) y con contratos que exigen notificar y compensar. Si tu unico control es «es un proveedor conocido», no tienes control.

## Ejercicio guiado: expide el pasaporte de un proveedor

1. Elige un proveedor real o un paquete que uses en produccion
2. Clasifica su criticidad: a que datos o procesos accede
3. Pide la evidencia disponible: informes, SBOM, fecha del ultimo test
4. Revisa cuanto de esa evidencia es verificable por ti y cuanto es declarativo
5. Escribe 5 clausulas exigibles: notificacion de incidentes, plazo de parcheo, auditoria, salida de datos, subcontratistas
6. Define el plan de salida: como lo sustituyes y en que plazo
7. Fija una revision periodica con responsable y fecha

## Recursos abiertos

- [NIST SP 800-161 Rev.1](https://csrc.nist.gov/pubs/sp/800/161/r1/final)
- [CISA SBOM](https://www.cisa.gov/sbom)
- [OpenSSF Scorecard](https://github.com/ossf/scorecard)

---
[Volver al syllabus](../syllabus.md)
