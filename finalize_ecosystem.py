#!/usr/bin/env python3
import json
from pathlib import Path

source = Path("ecosystem_final_report.json")
data = json.loads(source.read_text(encoding="utf-8"))
local = data["local_projects"]
github = data["github"].get("repositories", [])

manifest = {
    "generated_at": data["generated_at"],
    "github_owner": data["scope"]["github_owner"],
    "local_root": data["scope"]["local_root"],
    "repositories": [
        {
            "name": r.get("nameWithOwner"),
            "url": r.get("url"),
            "private": r.get("isPrivate"),
            "archived": r.get("isArchived"),
            "default_branch": (r.get("defaultBranchRef") or {}).get("name"),
            "updated_at": r.get("updatedAt"),
            "category": "archived" if r.get("isArchived") else "active",
        }
        for r in github
    ],
    "local_projects": local,
}
Path("ecosystem_manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

lines = [
    "# Informe final del ecosistema",
    "",
    f"Generado: `{data['generated_at']}`. Alcance local: `{data['scope']['local_root']}`. GitHub: `{data['scope']['github_owner']}`.",
    "",
    "> Este informe organiza e inventaría. No borra, mueve ni publica datos.",
    "",
    "## Resumen",
    "",
    f"- Proyectos locales detectados: **{data['summary']['local_projects']}**",
    f"- Repositorios GitHub detectados: **{data['summary']['github_repositories']}**; activos: **{data['summary']['github_active']}**; archivados: **{data['summary']['github_archived']}**",
    "",
    "## Proyectos locales",
    "",
    "| Categoría | Ruta | Marcadores | Python | TypeScript |",
    "|---|---|---|---:|---:|",
]
for p in local:
    lines.append(f"| {p['category']} | `{p['relative_path']}` | {', '.join(p['markers']) or '—'} | {p['python_files']} | {p['typescript_files']} |")
lines += ["", "## Repositorios GitHub", "", "| Repositorio | Estado | Privado | Actualizado | URL |", "|---|---|---:|---|---|"]
for r in github:
    status = "archivado" if r.get("isArchived") else "activo"
    lines.append(f"| `{r.get('nameWithOwner')}` | {status} | {r.get('isPrivate')} | {r.get('updatedAt')} | {r.get('url')} |")
lines += [
    "", "## Decisiones y límites", "",
    "- Los candidatos a consolidación requieren revisión humana; no se fusionaron automáticamente.",
    "- La relación entre una copia local y un repositorio remoto solo debe aceptarse cuando el remoto Git lo confirme.",
    "- No se ejecutaron acciones destructivas ni se modificaron repositorios GitHub.",
    "- La siguiente fase recomendada es validar cada proyecto activo con su propio lockfile y CI.",
    "",
]
Path("ecosystem_final_report.md").write_text("\n".join(lines), encoding="utf-8")
print("Generados: ecosystem_final_report.md, ecosystem_manifest.json")
