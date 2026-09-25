# Secure T Local Models

Manifiestos y scripts para ejecutar modelos locales de Secure T sin depender de APIs de pago.

## Modelos preparados

| Modelo | Función | ID Hugging Face | Descarga aproximada |
|---|---|---|---:|
| Qwen3 0.6B Q4 GGUF | Tutor CPU y asistente básico | `unsloth/Qwen3-0.6B-GGUF` | 397 MB |
| Qwen3.5 4B | Tutor, razonamiento, código y visión | `Qwen/Qwen3.5-4B` | 8.8 GB |
| Wan2.1 T2V 1.3B | Generación de vídeo educativo | `Wan-AI/Wan2.1-T2V-1.3B` | 17 GB |

Los pesos no se almacenan en Git. Se descargan con `scripts/download-models.sh`. Para este Linux sin GPU, el modelo verificado es Qwen3 0.6B en formato GGUF ejecutado con llama.cpp.

## Hardware

Qwen3 0.6B Q4 funciona en CPU y ha sido probado en un Xeon x86_64 con AVX2 y 9.7 GB de RAM. Qwen3.5 en formato Transformers no es la opción adecuada para este equipo. Wan2.1 T2V 1.3B está pensado principalmente para GPU y se recomienda 480p; sus pesos no se deben ejecutar localmente en este equipo.

## Uso

```bash
./scripts/download-models.sh /srv/secure-t/models
```

Para ejecutar el modelo CPU se necesita `llama.cpp` y el archivo `Qwen3-0.6B-Q4_K_M.gguf`. El repositorio contiene el manifiesto, no el runtime compilado.

Las descargas requieren red. No se guardan tokens en el repositorio; si Hugging Face solicita autenticación, usar `HF_TOKEN` como variable de entorno temporal.

## Licencias

Revisar la licencia de cada modelo antes de distribuirlo o incorporarlo a un producto comercial. Los modelos conservan sus archivos `LICENSE` dentro de cada descarga.
