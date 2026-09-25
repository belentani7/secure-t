# open-data

Pack de datos abiertos de **vulnerabilidades explotadas (CISA KEV)**.

- **Fuente:** <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- **Clave de API:** no requiere.
- **Generado:** ver `meta.generated_at` en `cisa-kev.json`.

## Ficheros

| Fichero | Descripcion |
|---|---|
| `cisa-kev.json` | Registros con metadatos + bloque `meta` |
| `cisa-kev.csv` | El mismo pack en tabla |

## Regenerar

```bash
python scripts/fetch_open_data.py
```

Usa solo la libreria estandar.

## Licencia

Datos del catalogo CISA KEV (dominio publico, EE.UU.). Codigo del pack: MIT.
