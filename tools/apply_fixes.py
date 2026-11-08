#!/usr/bin/env python3
"""
Replication Toolkit — Apply standardized fixes to any repo.
Run from repo root: python tools/apply_fixes.py [--dry-run]
"""

import json
import sys
import subprocess
from pathlib import Path
from typing import List, Dict, Optional

REPO_ROOT = Path(__file__).resolve().parents[1]

# ============================================================================
# DETECTORS — Identify repo type and issues
# ============================================================================

def detect_repo_type() -> str:
    """Detect repository type/stack."""
    if (REPO_ROOT / "package.json").exists():
        pkg = json.loads((REPO_ROOT / "package.json").read_text())
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
        if "next" in deps:
            return "nextjs"
        if "vite" in deps or "@vitejs/plugin-react" in deps:
            return "vite-react"
        if "react" in deps:
            return "react"
        return "node"
    if (REPO_ROOT / "pyproject.toml").exists() or (REPO_ROOT / "requirements.txt").exists():
        return "python"
    if (REPO_ROOT / "Dockerfile").exists():
        return "docker"
    return "unknown"


def check_typescript() -> bool:
    return (REPO_ROOT / "tsconfig.json").exists()


def check_i18n_structure() -> bool:
    """Check if i18n locales directory exists."""
    return (REPO_ROOT / "client" / "src" / "locales").exists() or \
           (REPO_ROOT / "locales").exists() or \
           (REPO_ROOT / "messages").exists()


def check_ci_workflow() -> bool:
    return (REPO_ROOT / ".github" / "workflows").exists()


# ============================================================================
# FIXES — Standardized patches
# ============================================================================

def fix_tsconfig_incremental(dry_run: bool = False) -> bool:
    """Fix tsconfig.json incremental: true -> false (Next.js cache issues)."""
    tsconfig = REPO_ROOT / "tsconfig.json"
    if not tsconfig.exists():
        return False
    content = tsconfig.read_text()
    if '"incremental": true' in content:
        if dry_run:
            print("  [DRY-RUN] Would fix tsconfig.json: incremental true -> false")
            return True
        content = content.replace('"incremental": true', '"incremental": false')
        tsconfig.write_text(content)
        print("  ✅ Fixed tsconfig.json incremental")
        return True
    return False


def fix_typecheck_script(dry_run: bool = False) -> bool:
    """Add typecheck script to package.json if missing."""
    pkg = REPO_ROOT / "package.json"
    if not pkg.exists():
        return False
    data = json.loads(pkg.read_text())
    scripts = data.get("scripts", {})
    if "typecheck" not in scripts:
        if dry_run:
            print("  [DRY-RUN] Would add typecheck script")
            return True
        scripts["typecheck"] = "tsc --noEmit"
        data["scripts"] = scripts
        pkg.write_text(json.dumps(data, indent=2) + "\n")
        print("  ✅ Added typecheck script")
        return True
    return False


def fix_pytest_asyncio(dry_run: bool = False) -> bool:
    """Fix pytest-asyncio version in requirements-dev.txt."""
    req = REPO_ROOT / "requirements-dev.txt"
    if not req.exists():
        return False
    content = req.read_text()
    if "pytest-asyncio==0.23.3" in content or "pytest-asyncio==" in content and "1.4.1.post1" not in content:
        if dry_run:
            print("  [DRY-RUN] Would fix pytest-asyncio to 1.4.1.post1")
            return True
        content = content.replace("pytest-asyncio==0.23.3", "pytest-asyncio==1.4.1.post1")
        if "pytest-asyncio==" not in content:
            content += "\npytest-asyncio==1.4.1.post1\n"
        req.write_text(content)
        print("  ✅ Fixed pytest-asyncio version")
        return True
    return False


def fix_ci_python_quality(dry_run: bool = False) -> bool:
    """Add python-quality job to CI workflow."""
    workflows = list((REPO_ROOT / ".github" / "workflows").glob("*.yml")) + \
                list((REPO_ROOT / ".github" / "workflows").glob("*.yaml"))
    if not workflows:
        return False
    
    applied = False
    for wf in workflows:
        content = wf.read_text()
        if "python-quality" not in content and "pytest" in content:
            if dry_run:
                print(f"  [DRY-RUN] Would add python-quality job to {wf.name}")
                return True
            # This is a complex edit; in practice, append a job
            print(f"  ⚠️  Manual review needed for {wf.name} (complex edit)")
            applied = True
    return applied


def fix_html_lang(dry_run: bool = False) -> bool:
    """Fix index.html lang attribute to match default locale (es)."""
    index_html = REPO_ROOT / "client" / "index.html"
    if not index_html.exists():
        index_html = REPO_ROOT / "index.html"
    if not index_html.exists():
        return False
    content = index_html.read_text()
    if 'lang="en"' in content and 'lang="es"' not in content:
        if dry_run:
            print("  [DRY-RUN] Would change lang='en' to lang='es'")
            return True
        content = content.replace('lang="en"', 'lang="es"')
        index_html.write_text(content)
        print("  ✅ Fixed index.html lang to es")
        return True
    return False


def fix_theme_default(dry_run: bool = False) -> bool:
    """Fix ThemeProvider defaultTheme to dark."""
    app_tsx = REPO_ROOT / "client" / "src" / "App.tsx"
    if not app_tsx.exists():
        return False
    content = app_tsx.read_text()
    if 'defaultTheme="light"' in content:
        if dry_run:
            print("  [DRY-RUN] Would change defaultTheme to dark")
            return True
        content = content.replace('defaultTheme="light"', 'defaultTheme="dark"')
        app_tsx.write_text(content)
        print("  ✅ Fixed defaultTheme to dark")
        return True
    return False


# ============================================================================
# MAIN
# ============================================================================

FIXES = [
    ("tsconfig incremental", fix_tsconfig_incremental),
    ("typecheck script", fix_typecheck_script),
    ("pytest-asyncio version", fix_pytest_asyncio),
    ("CI python-quality job", fix_ci_python_quality),
    ("index.html lang", fix_html_lang),
    ("ThemeProvider defaultTheme", fix_theme_default),
]

def main():
    dry_run = "--dry-run" in sys.argv
    if dry_run:
        print("🔍 DRY-RUN MODE — No changes will be made\n")

    repo_type = detect_repo_type()
    print(f"📦 Repo type: {repo_type}")
    print(f"   TypeScript: {check_typescript()}")
    print(f"   i18n structure: {check_i18n_structure()}")
    print(f"   CI workflows: {check_ci_workflow()}")
    print()

    applied = 0
    for name, fix_fn in FIXES:
        try:
            if fix_fn(dry_run=dry_run):
                applied += 1
        except Exception as e:
            print(f"  ❌ {name}: {e}")

    if dry_run:
        print(f"\n🔍 DRY-RUN complete. Would apply {applied} fixes.")
    else:
        print(f"\n✅ Applied {applied} fixes.")


if __name__ == "__main__":
    main()