# Auditorías Versionadas — secure-t

Este directorio contiene herramientas de auditoría automatizada que se ejecutan como parte del gate de calidad (`quality:check` y CI).

## Scripts

### `i18n_audit.py`
**Propósito**: Verifica integridad del sistema i18n (9 idiomas, 289 claves cada uno).

**Checks**:
1. **Paridad de claves**: Todos los locales tienen exactamente las mismas claves que `en.json`
2. **Claves vacías**: No hay valores vacíos o solo whitespace
3. **Traducción real**: Detecta valores idénticos a `en` fuera de allowlist (marcas, códigos, cognados)
4. **Claves usadas en código**: Todas las claves `t("namespace.clave")` existen en `en.json`

**Exit codes**:
- `0`: Paridad OK, claves existen, no vacías
- `1`: Fallos en paridad, claves vacías, o claves inexistentes en código

**Allowlist** (`ALLOWLIST_IDENTICOS_EN`): Marcas, códigos de curso, siglas técnicas, nombres propios que legítimamente son idénticos en todos los idiomas.

---

### `i18n_hardcoded.py`
**Propósito**: Detecta copy visible hardcodeado en JSX sin usar `t()`.

**Alcance**:
- `client/src/pages/*.tsx`
- `client/src/components/*.tsx` (excluye `components/ui/`)

**Detección**:
- Texto entre tags JSX (children) con apariencia de copy real
- Atributos `placeholder`, `title`, `alt`, `aria-label`, `aria-labelledby`
- Excluye: URLs, imports, siglas, camelCase, interpolaciones JSX, números

**Exit codes**:
- `0`: No hay copy hardcodeado detectado
- `1`: Hallazgos de copy sin `t()`

---

### `contrast_audit.py`
**Propósito**: Audita contraste WCAG 2.1 AA (mínimo 4.5:1) en clases Tailwind `text-*` / `bg-*`.

**Metodología**:
1. Extrae todas las clases `text-*` y `bg-*` de `className` en archivos `.tsx`
2. Resuelve colores Tailwind a RGB (incluye colores custom: `lime`, `cyan`, `violet`, `coral`, `dark-bg`, `dark-card`, `dark-hover`)
3. Aplica opacidad (`/10`..`/90`) via alpha blending sobre fondos de referencia
4. Calcula ratio de contraste WCAG 2.x
5. Falla si ratio < 4.5:1

**Fondos de referencia probados**:
- `dark-bg` (#071016) — fondo principal
- `dark-card` (#101d24) — tarjetas
- `dark-hover` (#0b1322) — hover/estados

**Exit codes**:
- `0`: Todos los pares ≥ 4.5:1
- `1`: Uno o más pares < 4.5:1

---

## Uso

```bash
# Ejecutar todas las auditorías
python tools/i18n_audit.py
python tools/i18n_hardcoded.py
python tools/contrast_audit.py

# En CI / quality:check
python tools/i18n_audit.py && python tools/i18n_hardcoded.py && python tools/contrast_audit.py
```

## Integración en CI

Añadir job `python-quality` en `.github/workflows/deploy-ci.yml`:

```yaml
- name: Python quality gates
  run: |
    python -m pip install -r requirements-dev.txt
    python tools/i18n_audit.py
    python tools/i18n_hardcoded.py
    python tools/contrast_audit.py
```

## Mantenimiento

- **Actualizar allowlist** en `i18n_audit.py` cuando se añadan marcas/códigos legítimos
- **Añadir colores custom** en `TAILWIND_COLORS` de `contrast_audit.py` si cambia `index.css`
- **Ajustar excepciones** en `i18n_hardcoded.py` si hay falsos positivos/negativos