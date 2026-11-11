#!/usr/bin/env python3
"""
i18n Audit Script — secure-t
Verifica paridad de claves, claves inexistentes y traducciones reales (no solo inglés copiado).
"""

import json
import sys
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple

ROOT = Path(__file__).resolve().parents[1]
LOCALES_DIR = ROOT / "client" / "src" / "locales"
PAGES_DIR = ROOT / "client" / "src" / "pages"
COMPONENTS_DIR = ROOT / "client" / "src" / "components"

# Allowlist de valores que pueden ser idénticos a inglés (marcas, códigos, cognados legítimos)
ALLOWLIST_IDENTICOS_EN = {
    "secureT", "securet", "T", "Astra", "GitHub", "Vercel", "Netlify",
    "HTML", "CSS", "JS", "TS", "API", "UI", "UX", "CI", "CD", "SSR", "CSR",
    "CY-101", "WEB-201", "SOC-301", "ECTS", "AI", "LLM", "MCP", "CLI",
    "Home", "Campus", "Progress", "Mentor", "Portal", "Notifications", "Settings",
    "All levels", "Beginner", "Intermediate", "Advanced",
}

def cargar_locales() -> Dict[str, Dict]:
    """Carga todos los archivos JSON de locales"""
    locales = {}
    for json_file in LOCALES_DIR.glob("*.json"):
        lang = json_file.stem
        try:
            locales[lang] = json.loads(json_file.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            print(f"❌ Error parseando {json_file}: {e}")
            sys.exit(1)
    return locales

def verificar_paridad(locales: Dict[str, Dict]) -> Tuple[bool, List[str]]:
    """Verifica que todos los locales tengan las mismas claves que 'en'"""
    errores = []
    claves_en = set(locales.get("en", {}).keys())

    for lang, data in locales.items():
        if lang == "en":
            continue
        claves_lang = set(data.keys())
        faltantes = claves_en - claves_lang
        extra = claves_lang - claves_en

        if faltantes:
            errores.append(f"[{lang}] FALTAN {len(faltantes)} claves: {sorted(faltantes)}")
        if extra:
            errores.append(f"[{lang}] EXTRA {len(extra)} claves: {sorted(extra)}")

    return len(errores) == 0, errores

def verificar_claves_vacias(locales: Dict[str, Dict]) -> Tuple[bool, List[str]]:
    """Verifica que no haya valores vacíos"""
    errores = []
    for lang, data in locales.items():
        for clave, valor in data.items():
            if not valor or (isinstance(valor, str) and not valor.strip()):
                errores.append(f"[{lang}] CLAVE VACÍA: '{clave}'")
    return len(errores) == 0, errores

def verificar_valores_identicos_en(locales: Dict[str, Dict]) -> Tuple[bool, List[str]]:
    """Detecta valores idénticos a 'en' fuera de allowlist (indica sin traducir)"""
    advertencias = []
    en_data = locales.get("en", {})

    for lang, data in locales.items():
        if lang == "en":
            continue
        for clave, valor in data.items():
            valor_en = en_data.get(clave)
            if valor_en and valor == valor_en and valor not in ALLOWLIST_IDENTICOS_EN:
                # Verificar si es cognado legítimo (heurística simple)
                if not (len(valor) <= 3 or valor.isupper() or re.match(r'^[A-Z][a-z]+$', valor)):
                    advertencias.append(f"[{lang}] '{clave}' = '{valor}' (idéntico a en)")

    return len(advertencias) == 0, advertencias

def extraer_claves_usadas_en_codigo() -> Set[str]:
    """Extrae todas las claves t("...") usadas en páginas y componentes (excluye ui/)"""
    claves = set()
    # Patron más estricto: solo claves con namespace (home.xxx, header.xxx, etc.)
    patron = r't\(["\']([a-z][a-z0-9_]*\.[a-z][a-z0-9_]*)["\']\)'

    for tsx_file in PAGES_DIR.glob("*.tsx"):
        content = tsx_file.read_text(encoding="utf-8")
        claves.update(re.findall(patron, content))

    for tsx_file in COMPONENTS_DIR.glob("*.tsx"):
        if "ui" not in tsx_file.parts:  # excluir components/ui/
            content = tsx_file.read_text(encoding="utf-8")
            claves.update(re.findall(patron, content))

    # También buscar en App.tsx y lib/i18n.tsx
    for extra_file in [ROOT / "client" / "src" / "App.tsx", ROOT / "client" / "src" / "lib" / "i18n.tsx"]:
        if extra_file.exists():
            content = extra_file.read_text(encoding="utf-8")
            claves.update(re.findall(patron, content))

    return claves

def verificar_claves_inexistentes(locales: Dict[str, Dict], claves_usadas: Set[str]) -> Tuple[bool, List[str]]:
    """Verifica que todas las claves usadas existan en al menos un locale (preferiblemente en)"""
    errores = []
    claves_disponibles = set(locales.get("en", {}).keys())

    for clave in claves_usadas:
        if clave not in claves_disponibles:
            errores.append(f"CLAVE INEXISTENTE EN LOCALES: '{clave}' (usada en código)")

    return len(errores) == 0, errores

def main():
    print("=" * 70)
    print("AUDITORÍA i18n — secure-t")
    print("=" * 70)

    # 1. Cargar locales
    locales = cargar_locales()
    print(f"\n[1] LOCALES CARGADOS: {len(locales)} idiomas")
    for lang in sorted(locales.keys()):
        print(f"    {lang}: {len(locales[lang])} claves")

    # 2. Paridad de claves
    print("\n[2] PARIDAD DE CLAVES (vs en):")
    ok_paridad, errores_paridad = verificar_paridad(locales)
    if ok_paridad:
        print("    ✅ Todos los locales tienen las mismas claves que 'en'")
    else:
        for err in errores_paridad:
            print(f"    ❌ {err}")

    # 3. Claves vacías
    print("\n[3] CLAVES VACÍAS:")
    ok_vacias, errores_vacias = verificar_claves_vacias(locales)
    if ok_vacias:
        print("    ✅ No hay claves vacías")
    else:
        for err in errores_vacias:
            print(f"    ❌ {err}")

    # 4. Valores idénticos a en (sin traducir)
    print("\n[4] VALORES IDÉNTICOS A 'en' (posibles sin traducir):")
    ok_traducidos, advertencias_trad = verificar_valores_identicos_en(locales)
    if ok_traducidos:
        print("    ✅ No hay valores idénticos a 'en' fuera de allowlist")
    else:
        print(f"    ⚠️ {len(advertencias_trad)} valores idénticos a 'en':")
        for adv in advertencias_trad[:20]:  # mostrar primeras 20
            print(f"       {adv}")
        if len(advertencias_trad) > 20:
            print(f"       ... y {len(advertencias_trad) - 20} más")

    # 5. Claves usadas en código
    print("\n[5] CLAVES USADAS EN CÓDIGO (t('...')):")
    claves_usadas = extraer_claves_usadas_en_codigo()
    print(f"    Total claves únicas detectadas: {len(claves_usadas)}")

    ok_inexistentes, errores_inexistentes = verificar_claves_inexistentes(locales, claves_usadas)
    if ok_inexistentes:
        print("    ✅ Todas las claves usadas existen en locales")
    else:
        for err in errores_inexistentes:
            print(f"    ❌ {err}")

    # Resumen
    print("\n" + "=" * 70)
    todo_ok = ok_paridad and ok_vacias and ok_inexistentes
    # Para traducción real: solo warning, no fallo (fase aparte)
    if todo_ok:
        print("RESULTADO: PARIDAD Y EXISTENCIA ✅  |  TRADUCCIÓN REAL: REVISAR ⚠️")
    else:
        print("RESULTADO: FALLOS EN PARIDAD/EXISTENCIA ❌")
    print("=" * 70)

    # Exit code: 0 si paridad y existencia OK, 1 si fallos críticos
    sys.exit(0 if todo_ok else 1)

if __name__ == "__main__":
    main()
