# Secure T University — universidad digital de ciberseguridad e IA

> **PT** — Universidade digital independente de cybersegurança e IA. Material aberto e auditável, custo zero, acesso anónimo.
> **ES** — Universidad digital independiente de ciberseguridad e IA. Material abierto y auditable, coste cero, acceso anónimo.
> **EN** — Independent digital university for cybersecurity & AI. Open, auditable material; zero cost; anonymous access.

Plataforma educativa digital **independiente y abierta**: 4 cursos
universitarios (ofensiva, defensiva, IA segura, gobernanza), evaluación por
evidencia, progreso local anónimo y credenciales verificables por hash
SHA-256. Sin matrícula, sin registro, sin datos personales: el estudiante es
un token local.

| Evaluación | Peso |
|---|---|
| Participación (laboratorios con evidencia) | 30 % |
| Quizzes formativos | 30 % |
| Proyecto / examen final | 40 % |

| Curso | Horas | Semanas |
|---|---|---|
| Ciberseguridad Ofensiva | 60 h | 4 |
| Ciberseguridad Defensiva (SOC) | 60 h | 4 |
| IA Aplicada y Segura | 48 h | 4 |
| Gobernanza y Compliance | 40 h | 4 |

> Estado honesto: credencial = sello hash verificable. Anclaje blockchain:
> PLANNED (fase 2). Contenido docente en ES; PT/EN de lecciones: PLANNED
> (ver `campus/idiomas.md`). Sin acreditación institucional: es un proyecto
> educativo abierto, no una universidad acreditada.

## Arquitectura

La única fuente de verdad es el motor Python **eduforge**
(`belentani7/belentani-unified-map`): los datos de curso viven en
`eduforge/content.py` y **todo el campus se genera** desde ahí.

```
content.py (fuente de verdad)
   → curriculum  (semanas, syllabus, quiz, recursos)
   → academy     (capas 2-4: rúbricas, exámenes, glosarios, chuletas,
                  laboratorios, páginas de curso LMS, progreso, credencial,
                  búsqueda, calendario, mapa NICE, idiomas, sitemap)
   → frontend    (hub del campus, PWA offline)
   → audit       (14 secciones, exit 1 ante CRITICAL/HIGH)
```

Nada del contenido de `campus/` se edita a mano: se regenera.

## Uso local

```bash
python -m http.server 8080   # dentro del repo
# → http://localhost:8080            (landing trilingüe PT/ES/EN)
# → http://localhost:8080/campus/    (hub)
# → /campus/cursos/<curso>/          (página LMS del curso)
```

Las páginas de curso llevan el quiz embebido y funcionan también abiertas
con `file://`; progreso/credencial/búsqueda usan `fetch` y requieren HTTP.

## Generación, tests y auditoría (requieren el motor)

```bash
# en belentani-unified:
python -m eduforge build    # regenera campus/ completo (determinista)
python -m eduforge audit    # auditoría de 14 secciones del repo objetivo
python -m pytest tests/ -q  # tests del motor (6)
# en este repo:
python -m pytest tests/ -q  # tests de comportamiento del producto (37+)
```

## Estructura real

```
index.html              landing trilingüe (PT por defecto, regla PT>ES>EN)
ui/i18n.js              diccionario i18n (152 claves × 3 idiomas)
campus/                 TODO generado por eduforge
  cursos/<slug>/        página LMS + semanas + quiz + lab + rúbrica + examen
  progreso.html         progreso anónimo (token local, export/import)
  credencial.html       sello SHA-256 generable y verificable sin servidor
  buscar.html           búsqueda local (indice.json)
  idiomas.md            matriz honesta de traducción por capa
public/                 robots.txt + sitemap.xml (rutas reales, __BASE_URL__)
tests/                  tests de comportamiento
.github/workflows/      ci + 3 deploys (gated en secrets) + tutor-ia
```

## Despliegue

Sitio 100 % estático. Workflows de Vercel/Netlify/Cloudflare incluidos pero
**inactivos por diseño** hasta configurar los secrets correspondientes
(`VERCEL_TOKEN`…, `NETLIFY_AUTH_TOKEN`…, `CLOUDFLARE_API_TOKEN`…). Al
desplegar, reemplaza `__BASE_URL__` en `public/robots.txt` y
`public/sitemap.xml` por el dominio real. No hay URLs en vivo todavía.

## Seguridad

- Sin backend ni base de datos: cero PII, el progreso vive en localStorage.
- Agente tutor (GitHub Actions) con allowlist SSRF de un solo host https.
- Secrets: gitleaks en cada commit; workflows con `permissions` mínimos.
- Limitación declarada: escaneo Mimosa con cobertura parcial (limitación
  del parser de la herramienta); verificación alternativa: `eduforge audit`.

## Licencia

MIT — ver [LICENSE](LICENSE). Contenido educativo reutilizable con atribución.
