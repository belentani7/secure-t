# Incidente de seguridad 2026-10-15

> Documento **sin secretos**. Describe *que* se expojo, *donde* y *como se corrige*.
> Nunca se documenta aqui el valor filtrado.

## Resumen

La auditoria del perfil ejecuto el job `secretos` (Gitleaks con `--log-opts=--all`, historial
completo) y el job **fallo con exit code 1**, lo que significa que hay hallazgos reales.
Se descargo el artefacto SARIF generado por el propio CI y se leyeron **solo los identificadores
de regla y las rutas**. No se leyeron ni se mostraron valores.

## Hallazgos (redactados)

| Regla | Detecciones | Ubicacion | Estado |
|---|---|---|---|
| `deepseek-api-key` | 1 | `fix_weeks.py:3` | **Solo en historia** — el fichero ya no existe en `main` |
| Secret scanning alert (GitHub) | 1 | tipo *Google API Key* | **Abierta** — requiere revocacion |

Ademas, `secure-t` tiene `fetch-depth: 0` y `--log-opts=--all`, es decir: el escaner revisa
**todas las ramas y toda la historia**, no solo el ultimo commit. Eso es exactamente lo que
debe hacer un control de secretos, y por eso falla.

## Por que el job sigue en rojo (y debe seguir asi)

El job `secretos` **no se relaja** hasta que las credenciales esten revocadas. Relajar el
scanner sin rotar las claves seria un falso verde: la peor combinacion posible.

## Plan de remediacion

1. **Rotar la clave de DeepSeek** usada por `fix_weeks.py` (panel del proveedor: revocar y
   emitir nueva). Una clave filtrada en un repositorio publico se considera comprometida
   aunque se borre el fichero.
2. **Rotar la Google API Key** que GitHub tiene marcada como alerta abierta, y marcarla como
   resuelta en GitHub (Settings -> Code security -> Secret scanning -> alerts).
3. Revisar los usos historicos de ambas credenciales: accesos, facturacion y cuota.
4. Anadir `.gitleaks.toml` con allowlist **solo por fingerprint** para falsos positivos
   documentados, nunca por regex laxa.
5. Si el historial debe purgarse: `git filter-repo` requiere un push con `--force` a un
   repositorio publico. **No se ha ejecutado**: es una operacion destructiva que requiere
   autorizacion explicita y coordinar forks existentes.

## Lo que este repositorio hace bien (y conviene mantener)

- Gitleaks pinneado a version, con checksum verificado antes de instalar
- `--redact` en el escaner: los valores nunca salen del runner
- Informe SARIF subido como artefacto para revision
- `SECURITY.md` presente en el repositorio
- Permisos minimos: el workflow pide lo justo

## Como reproducir la comprobacion

```bash
# Online, sin clonar: descarga el SARIF del ultimo run fallido
gh api repos/belentani7/secure-t/actions/runs/<run-id>/artifacts
# y lista reglas y rutas (nunca valores)
```
