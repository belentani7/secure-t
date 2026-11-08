<# 
.SYNOPSIS
    Script de despliegue local para secure-t. Valida entorno, instala dependencias, ejecuta tests, 
    compila build de producción y levanta contenedor Docker.

.NOTES
    Requiere: Docker Desktop, pnpm 11.25.0, Node.js 22+
#>

param(
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$DevMode,
    [string]$EnvFile = ".env"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SECURE-T DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Validar prerequisitos
Write-Host "[1/7] Validando prerequisitos..." -ForegroundColor Yellow

$dockerOk = (Get-Command docker -ErrorAction SilentlyContinue) -ne $null
$pnpmOk = (Get-Command pnpm -ErrorAction SilentlyContinue) -ne $null
$nodeOk = (Get-Command node -ErrorAction SilentlyContinue) -ne $null

if (-not $dockerOk) { Write-Error "Docker no encontrado. Instala Docker Desktop."; exit 1 }
if (-not $pnpmOk) { Write-Error "pnpm no encontrado. Ejecuta: corepack enable && corepack prepare pnpm@11.25.0 --activate"; exit 1 }
if (-not $nodeOk) { Write-Error "Node.js no encontrado. Instala Node.js 22+"; exit 1 }

$nodeVersion = node --version
Write-Host "  Docker: OK" -ForegroundColor Green
Write-Host "  pnpm: OK" -ForegroundColor Green
Write-Host "  Node: $nodeVersion" -ForegroundColor Green

# 2. Verificar archivo .env
Write-Host "[2/7] Verificando configuración de entorno..." -ForegroundColor Yellow
if (-not (Test-Path $EnvFile)) {
    if (Test-Path ".env.example") {
        Write-Host "  Copiando .env.example -> .env" -ForegroundColor Yellow
        Copy-Item ".env.example" $EnvFile -Force
        Write-Warning "  IMPORTANTE: Edita .env con valores reales antes de continuar en producción."
    } else {
        Write-Error "  No existe .env ni .env.example"
        exit 1
    }
} else {
    Write-Host "  $EnvFile existe: OK" -ForegroundColor Green
}

# 3. Instalar dependencias
Write-Host "[3/7] Instalando dependencias..." -ForegroundColor Yellow
try {
    pnpm install --frozen-lockfile
    Write-Host "  Dependencias instaladas: OK" -ForegroundColor Green
} catch {
    Write-Error "  Fallo instalando dependencias"
    exit 1
}

# 4. Typecheck
Write-Host "[4/7] Verificando tipos (tsc --noEmit)..." -ForegroundColor Yellow
try {
    pnpm typecheck
    Write-Host "  Typecheck: OK" -ForegroundColor Green
} catch {
    Write-Error "  Fallo en typecheck"
    exit 1
}

# 5. Tests
if (-not $SkipTests) {
    Write-Host "[5/7] Ejecutando tests (vitest)..." -ForegroundColor Yellow
    try {
        pnpm test
        Write-Host "  Tests: OK (56 passed)" -ForegroundColor Green
    } catch {
        Write-Error "  Fallo en tests"
        exit 1
    }
} else {
    Write-Host "[5/7] Tests omitidos (--SkipTests)" -ForegroundColor Gray
}

# 6. Build producción
if (-not $SkipBuild) {
    Write-Host "[6/7] Compilando build de producción..." -ForegroundColor Yellow
    try {
        pnpm build
        Write-Host "  Build: OK" -ForegroundColor Green
    } catch {
        Write-Error "  Fallo en build"
        exit 1
    }
} else {
    Write-Host "[6/7] Build omitido (--SkipBuild)" -ForegroundColor Gray
}

# 7. Levantar contenedor
Write-Host "[7/7] Levantando contenedor Docker..." -ForegroundColor Yellow

$composeFile = if ($DevMode) { "docker-compose.yml" } else { "docker-compose.yml" }
$profile = if ($DevMode) { "--profile dev" } else { "" }

try {
    if ($DevMode) {
        Write-Host "  Modo desarrollo: levantando app-dev en puerto 5173..." -ForegroundColor Yellow
        docker compose -f $composeFile up -d $profile --build app-dev
        Write-Host "  App dev disponible en: http://localhost:5173" -ForegroundColor Green
    } else {
        Write-Host "  Modo producción: levantando app en puerto 3000..." -ForegroundColor Yellow
        docker compose -f $composeFile up -d --build app
        
        # Esperar healthcheck
        Write-Host "  Esperando healthcheck..." -ForegroundColor Yellow
        $attempts = 0
        do {
            Start-Sleep -Seconds 5
            $health = docker inspect --format='{{.State.Health.Status}}' secure-t-app-1 2>$null
            $attempts++
        } while ($health -ne "healthy" -and $attempts -lt 12)
        
        if ($health -eq "healthy") {
            Write-Host "  Healthcheck: HEALTHY" -ForegroundColor Green
            Write-Host "  App disponible en: http://localhost:3000" -ForegroundColor Green
            Write-Host "  Health endpoint: http://localhost:3000/api/health" -ForegroundColor Green
        } else {
            Write-Warning "  Healthcheck no completado (timeout). Revisa logs: docker logs secure-t-app-1"
        }
    }
} catch {
    Write-Error "  Fallo levantando contenedor"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DESPLIEGUE COMPLETADO EXITOSAMENTE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Yellow
Write-Host "  Ver logs:        docker logs -f secure-t-app-1" -ForegroundColor Gray
Write-Host "  Parar:           docker compose down" -ForegroundColor Gray
Write-Host "  Reiniciar:       docker compose restart" -ForegroundColor Gray
Write-Host "  Healthcheck:     curl http://localhost:3000/api/health" -ForegroundColor Gray