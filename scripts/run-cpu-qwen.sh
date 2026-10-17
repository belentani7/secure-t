#!/usr/bin/env bash
set -euo pipefail

MODEL_DIR="${SECURE_T_MODEL_DIR:-$HOME/.local/share/secure-t/models}"
MODEL="${1:-$MODEL_DIR/qwen3-0.6b-gguf/Qwen3-0.6B-Q4_K_M.gguf}"
PROMPT="${2:-Responde en español en una frase: ¿puedes funcionar localmente sin GPU? /no_think}"
LLAMA_BIN="${LLAMA_BIN:-llama-cli}"

[ -x "$MODEL" ] || [ -f "$MODEL" ] || { echo "Modelo no encontrado: $MODEL" >&2; exit 1; }
command -v "$LLAMA_BIN" >/dev/null 2>&1 || {
  echo "Falta llama-cli. Consulta la guía oficial de llama.cpp o define LLAMA_BIN." >&2
  exit 1
}

exec "$LLAMA_BIN" \
  -m "$MODEL" \
  -p "$PROMPT" \
  -n "${SECURE_T_MAX_TOKENS:-128}" \
  -c "${SECURE_T_CONTEXT:-4096}" \
  -t "${SECURE_T_THREADS:-$(nproc)}" \
  --single-turn --simple-io --no-display-prompt --no-show-timings --color off
