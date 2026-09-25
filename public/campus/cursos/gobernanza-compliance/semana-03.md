# Semana 3: Gestión de riesgo con dueño y evidencia

Curso: [Gobernanza y Compliance Digital](../syllabus.md) · Semana 3 de 20

## Objetivos de aprendizaje

- Construir una matriz de riesgo con probabilidad, impacto y tratamiento
- Asignar dueño y fecha de revisión a cada riesgo
- Aplicar los 4 tratamientos: mitigar, transferir, aceptar, eliminar
- Distinguir riesgo inherente de riesgo residual

## Gestión de riesgo: la base de toda decisión de seguridad

No se protege todo igual. Se protege según el riesgo. Sin análisis de riesgo, el presupuesto de seguridad se gasta en lo visible (un firewall caro) en lugar de en lo necesario (formación anti-phishing).

**Fórmula conceptual:**
```
RIESGO = PROBABILIDAD × IMPACTO × VALOR DEL ACTIVO
```

**Matriz de riesgo 5×5:**
```
              IMPACTO
         Muy bajo  Bajo  Medio  Alto  Muy alto
Muy alta    M       A      A     MA     MA
Alta        B       M      A     A      MA
Media       B       B      M     A      A
Baja        MB      B      B     M      A
Muy baja    MB      MB     B     B      M

MB=Muy Bajo  B=Bajo  M=Medio  A=Alto  MA=Muy Alto
```

**Los 4 tratamientos:**
1. **Mitigar:** reducir probabilidad o impacto (parches, MFA, formación)
2. **Transferir:** pasar el riesgo a otro (seguro ciber, cloud provider SLA)
3. **Aceptar:** el coste de mitigar supera el impacto (documentar y firmar)
4. **Eliminar:** quitar el activo o la actividad que genera el riesgo

**Riesgo inherente vs residual:**
- Inherente: riesgo ANTES de aplicar controles
- Residual: riesgo DESPUÉS de aplicar controles
- El residual NUNCA es cero — siempre queda riesgo aceptado

**Cada riesgo tiene:**
- Descripción clara y escenario concreto
- Probabilidad e impacto evaluados
- Tratamiento elegido con justificación
- **Dueño** (persona con nombre, no 'el equipo')
- **Fecha de revisión** (no 'periódicamente')

**Referencias:**
- ISO 27005 — Information Security Risk Management
- NIST SP 800-30 — Guide for Risk Assessments
- NIST CSF — ID.RA (Risk Assessment)

## Registro de riesgos: formato y ejemplo práctico

**Formato del registro de riesgos:**
```
ID:           R-001
RIESGO:       Fuga de material didáctico por API sin autenticación
ACTIVO:       API de contenido del campus
PROBABILIDAD: Alta (3/5) — API pública, sin rate-limit
IMPACTO:      Medio (3/5) — material es abierto por diseño,
              pero el scraping masivo consume recursos
NIVEL:        Alto (3×3=9/25)
TRATAMIENTO:  Mitigar — rate-limit + cache CDN
DUEÑO:        [nombre del responsable técnico]
REVISIÓN:     2027-01-15
ESTADO:       En tratamiento
```

**8 riesgos reales de una plataforma educativa:**
```
R-001  Scraping masivo del contenido         Mitigar (CDN+rate-limit)
R-002  Caída de CDN/hosting                  Mitigar (multi-CDN) + Aceptar
R-003  Abuso de API del tutor IA             Mitigar (allowlist+truncado)
R-004  Token de progreso manipulado           Aceptar (localStorage, no PII)
R-005  Dependencia de proveedor cloud        Mitigar (exportable, multi-cloud)
R-006  Phishing a administradores            Mitigar (MFA + formación)
R-007  Inyección en quiz interactivo         Mitigar (sanitización + CSP)
R-008  Cambio regulatorio (IA, datos)        Transferir (asesoría legal)
```

**Errores comunes:**
- Riesgo sin dueño → nadie actúa
- 'Revisión: periódica' → nunca se revisa (poner fecha concreta)
- Confundir amenaza con riesgo (amenaza: phishing; riesgo: credenciales admin robadas por phishing que permite modificar contenido)
- Aceptar sin documentar → responsabilidad no asumida

**Referencias:**
- ISO 27005:2022
- NIST SP 800-30 Rev.1
- FAIR — Factor Analysis of Information Risk

## Caso real: Log4Shell 2021 (CVE-2021-44228): el riesgo que nadie tenía en su registro

Log4j, una librería de logging Java ubicua, tenía una vulnerabilidad RCE (CVSS 10.0) explotable con una sola línea de texto. Afectó a millones de aplicaciones. La mayoría de organizaciones no sabían que usaban Log4j (dependencia transitiva). Lección: el riesgo R-006 'componentes desconocidos en la cadena de suministro' debería estar en todo registro de riesgos. Sin inventario de dependencias (SBOM), no puedes evaluar riesgos que no sabes que existen.

## Ejercicio guiado: Construye la matriz de riesgo de la plataforma

1. Lista 8 riesgos reales del campus Secure T (usa los del material como base)
2. Para cada uno: describe el escenario concreto (qué pasa si se materializa)
3. Evalúa probabilidad (1-5) e impacto (1-5) con justificación
4. Calcula el nivel y ubícalo en la matriz 5×5
5. Elige tratamiento y justifica por qué ese y no otro
6. Asigna dueño (nombre) y fecha de revisión (fecha concreta)
7. Calcula riesgo residual después del tratamiento
8. Presenta la matriz completa en formato tabla

## Recursos abiertos

- [NIST SP 800-30](https://csrc.nist.gov/publications/detail/sp/800-30/rev-1/final)
- [FAIR Institute](https://www.fairinstitute.org/)
- [SBOM — NTIA](https://www.ntia.gov/sbom)

---
[Volver al syllabus](../syllabus.md)
