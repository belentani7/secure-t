# Seguridad y privacidad

## Controles obligatorios

secure T debe aplicar cabeceras seguras, validación de entradas con esquemas, rate limiting, autorización por recurso, cookies seguras, protección CSRF cuando corresponda, gestión de secretos, logs sin datos sensibles y escaneo de dependencias.

Los laboratorios deben ser efímeros, sin acceso a la red de producción y con permisos mínimos. Nunca se ejecuta código arbitrario de estudiantes dentro del proceso principal.

## Datos

Se separan datos de autenticación, expediente académico, conversaciones IA y auditoría. El diseño futuro incluye exportación, borrado de cuenta, retención limitada y consentimiento específico para voz.

## Revisión

Antes de producción se requiere threat model, revisión OWASP ASVS, pruebas de autorización negativas, escaneo SAST/DAST, pruebas de aislamiento de labs y revisión de configuración de Vercel y proveedores externos.

## No afirmaciones falsas

La plataforma no debe presentarse como universidad acreditada, ni emitir títulos oficiales, hasta que exista entidad legal, faculty responsable y acreditación verificable.
