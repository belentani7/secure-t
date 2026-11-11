#!/usr/bin/env python3
"""
Sync document.documentElement.lang — Sincroniza el atributo lang del HTML
con el idioma activo en el provider i18n.

Usage:
  python tools/sync_document_lang.py          # Verifica sincronización
  python tools/sync_document_lang.py --fix    # Añade useEffect al provider i18n
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]

I18N_PROVIDER = REPO_ROOT / "client" / "src" / "lib" / "i18n.tsx"
INDEX_HTML = REPO_ROOT / "client" / "index.html"
ALT_INDEX_HTML = REPO_ROOT / "index.html"


def check_index_html_lang() -> str:
    """Obtiene el lang actual del index.html"""
    for path in [INDEX_HTML, ALT_INDEX_HTML]:
        if path.exists():
            content = path.read_text(encoding="utf-8")
            match = re.search(r'<html\s+lang="([^"]+)"', content)
            if match:
                return match.group(1)
    return "unknown"


def check_provider_sync() -> bool:
    """Verifica si el provider i18n tiene useEffect para sincronizar document.documentElement.lang"""
    if not I18N_PROVIDER.exists():
        return False
    content = I18N_PROVIDER.read_text(encoding="utf-8")
    # Busca useEffect que actualice document.documentElement.lang
    return "document.documentElement.lang" in content


def add_sync_effect() -> bool:
    """Añade el useEffect de sincronización al provider i18n"""
    if not I18N_PROVIDER.exists():
        print("❌ No se encuentra i18n.tsx")
        return False

    content = I18N_PROVIDER.read_text(encoding="utf-8")

    # Verificar si ya existe
    if "document.documentElement.lang" in content:
        print("✅ Ya existe sincronización de document.documentElement.lang")
        return True

    # Buscar el primer useEffect (el que guarda en localStorage)
    pattern = r'(useEffect\(\(\) => \{\s*try \{\s*localStorage\.setItem\(STORAGE_KEY, lang\);\s*\} catch \{\}\s*\}, \[lang\])'
    match = re.search(pattern, content)
    if not match:
        print("❌ No se encuentra el useEffect de localStorage")
        return False

    # Insertar sincronización de document.documentElement.lang después
    new_effect = '''

    // Sync document.documentElement.lang for SEO and accessibility
    useEffect(() => {
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang;
      }
    }, [lang]);'''

    new_content = content.replace(
        match.group(1),
        match.group(1) + new_effect
    )

    I18N_PROVIDER.write_text(new_content, encoding="utf-8")
    print("✅ Añadido useEffect de sincronización document.documentElement.lang")
    return True


def main():
    fix_mode = "--fix" in sys.argv

    print("🔍 Verificando sincronización document.documentElement.lang")
    print()

    # 1. Check index.html lang
    html_lang = check_index_html_lang()
    print(f"📄 index.html lang: {html_lang}")

    # 2. Check provider sync
    provider_sync = check_provider_sync()
    print(f"⚙️  Provider sync: {'✅ Sí' if provider_sync else '❌ No'}")

    # 3. Determine default lang from i18n provider
    default_lang = "es"  # Hardcoded based on DEFAULT_LANG in i18n.tsx
    print(f"🌐 Idioma por defecto (DEFAULT_LANG): {default_lang}")

    if html_lang != default_lang:
        print(f"⚠️  MISMATCH: index.html lang='{html_lang}' vs DEFAULT_LANG='{default_lang}'")

    print()

    if fix_mode:
        if not provider_sync:
            print("🔧 Aplicando fix...")
            if add_sync_effect():
                print("✅ Fix aplicado. Ejecuta 'npx tsc --noEmit' para verificar.")
            else:
                print("❌ Error aplicando fix.")
                sys.exit(1)
        else:
            print("✅ Ya está sincronizado.")

        if html_lang != default_lang:
            # Fix index.html
            index_path = INDEX_HTML if INDEX_HTML.exists() else ALT_INDEX_HTML
            content = index_path.read_text(encoding="utf-8")
            content = content.replace(f'lang="{html_lang}"', f'lang="{default_lang}"')
            index_path.write_text(content, encoding="utf-8")
            print(f"✅ Corregido index.html lang a '{default_lang}'")
    else:
        if not provider_sync or html_lang != default_lang:
            print("💡 Ejecuta con --fix para corregir automáticamente.")
            sys.exit(1)
        else:
            print("✅ Todo sincronizado correctamente.")


if __name__ == "__main__":
    main()
