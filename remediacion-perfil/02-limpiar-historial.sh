#!/usr/bin/env bash
# FASE 1 — Borrar secretos y artefactos del HISTORIAL de git (reescritura).
# Requiere: pip install git-filter-repo
# Por defecto es SIMULACIÓN. Para ejecutar de verdad:  APLICAR=1 ./02-limpiar-historial.sh
# ⚠️ Reescribe historia y hace push --force: avisa a colaboradores; los forks conservan copia.
set -euo pipefail
OWNER="${OWNER:-belentani7}"
WORK="${WORK:-$HOME/limpieza-historial}"
APLICAR="${APLICAR:-0}"
command -v git-filter-repo >/dev/null || { echo "Instala: pip install git-filter-repo"; exit 1; }
mkdir -p "$WORK"

# Sustitución por regex: NO contiene ningún secreto real.
REPL="$WORK/reemplazos.txt"
cat > "$REPL" <<'R'
regex:sk-[A-Za-z0-9]{32}==>REDACTED_API_KEY
regex:sk-(proj|ant)-[A-Za-z0-9_\-]{20,}==>REDACTED_API_KEY
regex:ghp_[A-Za-z0-9]{36}==>REDACTED_GITHUB_TOKEN
R

# repo | rutas a eliminar de TODA la historia (separadas por espacio)
PLAN=(
  "duck-2000-2|.duck-qa"
  "judas-experience-web|"
  "secure-t|2026-09-03_01-43-46_317349_1133.txt pasted_content.txt pasted_content_2.txt pasted_content_3.txt pasted_file_FZGcNY_image.png"
  "DUCK-ZION-PREMIUM|01-STUDIO-OS/source/db/custom.db 11-PORTAL-CLIENTES/db/custom.db 11-PORTAL-CLIENTES/release"
  "duck-studio-os-v2|source/db/custom.db"
  "duck-docs|duck-studio-delivery/source/db/custom.db"
  "ManosAbiertas|prisma/dev.db"
  "aprende-brasil|data/aprende.db"
  "belentani-omega-template|node_modules dist"
)

for entrada in "${PLAN[@]}"; do
  repo="${entrada%%|*}"; rutas="${entrada#*|}"
  echo; echo "════ $repo ════"
  dir="$WORK/$repo.git"
  rm -rf "$dir"; git clone --quiet --mirror "https://github.com/$OWNER/$repo.git" "$dir"
  args=(--force --replace-text "$REPL")
  if [ -n "$rutas" ]; then
    args+=(--invert-paths); for p in $rutas; do args+=(--path "$p"); done
  fi
  echo "git filter-repo ${args[*]}"
  if [ "$APLICAR" = "1" ]; then
    git -C "$dir" filter-repo "${args[@]}"
    # filter-repo quita el remoto por seguridad: lo reponemos y publicamos
    git -C "$dir" remote add origin "https://github.com/$OWNER/$repo.git"
    git -C "$dir" push --force --mirror origin
    echo "✔ $repo reescrito y publicado"
  else
    echo "(simulación — usa APLICAR=1 para ejecutar)"
  fi
done

cat <<'TXT'

Después de APLICAR=1:
  • GitHub guarda caché de commits antiguos: abre un ticket en
    https://support.github.com/contact → "Remove sensitive data" con los repos listados.
  • Cada máquina con clones viejos: bórralos y vuelve a clonar (no hagas pull).
  • Luego puedes volver a poner públicos los repos de la fase 0 si quieres.
TXT
