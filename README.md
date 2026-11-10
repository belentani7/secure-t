

<!-- repo-forge:readme:inicio -->
## Qué es

**secure T** — instituto abierto de formación (programas + laboratorios).

Convertir conocimiento que ya existe en una ruta que una persona real puede recorrer hoy, sin pagar y sin que le pidan datos.

## Estado medido

| Dato | Valor |
|---|---|
| Lenguajes | Markdown, HTML, JavaScript, JSON, CSS, TypeScript |
| Archivos / líneas | 250 / 25589 |
| Páginas HTML | 28 |
| Tests detectados | 0 |
| Cumplimiento de reglas | 32/34 (94.1%) |

Todo lo anterior se midió en disco el 2026-11-10; no es una estimación.

## Uso

```bash
python -m unittest discover -s tests -v
python scripts/doctor.py
```

## Estructura

```
assets/
belentani7-secure-t-7d4d5d6/
brand/
data/
docs/
plataforma/
producto/
scripts/
tests/
```

## Diseño de plataforma

- Catálogo de 4 programas
- Laboratorios guiados
- Evaluación por evidencias
- Credencial verificable
- Bolsa de prácticas

La ficha completa —máximo potencial, marca, fases de monetización y recursos— vive en
[`plataforma/FICHA.md`](plataforma/FICHA.md). Los tokens de marca están en
[`brand/tokens.css`](brand/tokens.css).

## Reglas del proyecto

Este repositorio sigue el catálogo oficial del ecosistema (`GH-*`, `WEB-*`, `ACC-*`,
`SEO-*`, `COH-*`, `DEV-*`). El gate se ejecuta con:

```bash
python scripts/doctor.py
```

## Licencia

MIT. Ver [`LICENSE`](LICENSE).
<!-- repo-forge:readme:fin -->
## Producto comercial

Se vende un **aula de seguridad digital patrocinada**: 15 personas, 12 semanas, cuatro cursos
completos con laboratorio aislado, evaluaciones y constancia local. La organización paga; el
alumno no se registra y no paga.

- [`producto/OFERTA.md`](producto/OFERTA.md) — oferta, precio, garantía y objeciones
- [`producto/landing.html`](producto/landing.html) — página de venta autocontenida
- [`producto/precios.json`](producto/precios.json) — planes, límites e IVA
- [`producto/COBRO.md`](producto/COBRO.md) — cobro, facturación y reembolso
- [`producto/ONEPAGER.md`](producto/ONEPAGER.md) — ficha de una página
- [`producto/DEMO.md`](producto/DEMO.md) — guion de demo de 3 minutos
- [`producto/METRICAS.md`](producto/METRICAS.md) — indicadores y objetivos a 30 días

Verificación: `python tools/area_check.py producto --repo secure-t` desde la raíz del workspace.

<!-- repo-forge:readme:fin -->
<!-- repo-forge:readme:fin -->
<!-- repo-forge:readme:fin -->
