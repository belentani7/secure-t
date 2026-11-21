#!/usr/bin/env bash
set -euo pipefail

DESTINATION="${1:-${SECURE_T_MODEL_DIR:-$HOME/.local/share/secure-t/models}}"
mkdir -p "$DESTINATION"

command -v hf >/dev/null 2>&1 || {
  printf '%s\n' 'Falta el cliente hf. Instala: python3 -m pip install --user "huggingface_hub[cli]"' >&2
  exit 1
}

hf download unsloth/Qwen3-0.6B-GGUF \
  --include '*Q4_K_M*' \
  --local-dir "$DESTINATION/qwen3-0.6b-gguf"

if [ "${SECURE_T_DOWNLOAD_LARGE_MODELS:-0}" = "1" ]; then
  hf download Qwen/Qwen3.5-4B \
    --local-dir "$DESTINATION/qwen3.5-4b"
  hf download Wan-AI/Wan2.1-T2V-1.3B \
    --local-dir "$DESTINATION/wan2.1-t2v-1.3b"
fi

printf 'Modelos instalados en %s\n' "$DESTINATION"
