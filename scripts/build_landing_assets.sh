#!/usr/bin/env sh
# Rebuild checked-in landing assets without changing the SPA dependency graph.
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
tools_dir=$(mktemp -d)
trap 'rm -rf "$tools_dir"' EXIT HUP INT TERM
npm install --prefix "$tools_dir" --no-package-lock --ignore-scripts --no-audit --no-fund tailwindcss@3.4.17 lucide@1.46.0
cd "$project_root"
mkdir -p ui/vendor
node "$tools_dir/node_modules/tailwindcss/lib/cli.js" --input ui/landing.input.css --content index.html --output ui/vendor/landing.css --minify
cp "$tools_dir/node_modules/lucide/dist/umd/lucide.min.js" ui/vendor/lucide.min.js
cp "$tools_dir/node_modules/lucide/LICENSE" ui/vendor/LUCIDE-LICENSE
cp "$tools_dir/node_modules/tailwindcss/LICENSE" ui/vendor/TAILWIND-LICENSE
