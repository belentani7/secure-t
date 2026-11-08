#!/usr/bin/env bash
# deploy.sh - Script de despliegue local para secure-t (Linux/macOS/Git Bash)
# Requiere: Docker, pnpm 11.25.0, Node.js 22+

set -euo pipefail

SKIP_TESTS=false
SKIP_BUILD=false
DEV_MODE=false
ENV_FILE=".env"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests) SKIP_TESTS=true; shift ;;
        --skip-build) SKIP_BUILD=true; shift ;;
        --dev) DEV_MODE=true; shift ;;
        --env-file) ENV_FILE="$2"; shift 2 ;;
        *) echo "Uso: $0 [--skip-tests] [--skip-build] [--dev] [--env-file <file>]"; exit 1 ;;
    esac
done

echo "========================================"
echo "  SECURE-T DEPLOYMENT SCRIPT"
echo "========================================"
echo ""

# 1. Validar prerequisitos
echo "[1/7] Validando prerequisitos..."

for cmd in docker pnpm node; do
    if ! command -v "$cmd" &> /dev/null; then
        echo "ERROR: $cmd no encontrado. Instala $cmd." >&2
        exit 1
    fi
done

echo "  Docker: OK"
echo "  pnpm: OK"
echo "  Node: $(node --version)"

# 2. Verificar archivo .env
echo "[2/7] Verificando configuración de entorno..."
if [[ ! -f "$ENV_FILE" ]]; then
    if [[ -f ".env.example" ]]; then
        echo "  Copiando .env.example -> $ENV_FILE"
        cp ".env.example" "$ENV_FILE"
        echo "  ADVERTENCIA: Edita $ENV_FILE con valores reales antes de producción." >&2
    else
        echo "  ERROR: No existe $ENV_FILE ni .env.example" >&2
        exit 1
    fi
else
    echo "  $ENV_FILE existe: OK"
fi

# 3. Instalar dependencias
echo "[3/7] Instalando dependencias..."
pnpm install --frozen-lockfile
echo "  Dependencias instaladas: OK"

# 4. Typecheck
echo "[4/7] Verificando tipos (tsc --noEmit)..."
pnpm typecheck
echo "  Typecheck: OK"

# 5. Tests
if [[ "$SKIP_TESTS" = false ]]; then
    echo "[5/7] Ejecutando tests (vitest)..."
    pnpm test
    echo "  Tests: OK"
else
    echo "[5/7] Tests omitidos (--skip-tests)"
fi

# 6. Build producción
if [[ "$SKIP_BUILD" = false ]]; then
    echo "[6/7] Compilando build de producción..."
    pnpm build
    echo "  Build: OK"
else
    echo "[6/7] Build omitido (--skip-build)"
fi

# 7. Levantar contenedor
echo "[7/7] Levantando contenedor Docker..."

if [[ "$DEV_MODE" = true ]]; then
    echo "  Modo desarrollo: levantando app-dev en puerto 5173..."
    docker compose up -d --profile dev --build app-dev
    echo "  App dev disponible en: http://localhost:5173"
else
    echo "  Modo producción: levantando app en puerto 3000..."
    docker compose up -d --build app
    
    # Esperar healthcheck
    echo "  Esperando healthcheck..."
    attempts=0
    health=""
    while [[ "$health" != "healthy" && $attempts -lt 12 ]]; do
        sleep 5
        health=$(docker inspect --format='{{.State.Health.Status}}' secure-t-app-1 2>/dev/null || echo "")
        ((attempts++))
    done
    
    if [[ "$health" = "healthy" ]]; then
        echo "  Healthcheck: HEALTHY"
        echo "  App disponible en: http://localhost:3000"
        echo "  Health endpoint: http://localhost:3000/api/health"
    else
        echo "  ADVERTENCIA: Healthcheck no completado (timeout). Revisa logs: docker logs secure-t-app-1" >&2
    fi
fi

echo ""
echo "========================================"
echo "  DESPLIEGUE COMPLETADO EXITOSAMENTE"
echo "========================================"
echo ""
echo "Comandos útiles:"
echo "  Ver logs:        docker logs -f secure-t-app-1"
echo "  Parar:           docker compose down"
echo "  Reiniciar:       docker compose restart"
echo "  Healthcheck:     curl http://localhost:3000/api/health"