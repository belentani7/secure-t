#!/usr/bin/env python3
"""
i18n Hardcoded Copy Detector — secure-t
Detecta copy visible sin t() en pages/ y components/ (excluye components/ui/)
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple

ROOT = Path(__file__).resolve().parents[1]
PAGES_DIR = ROOT / "client" / "src" / "pages"
COMPONENTS_DIR = ROOT / "client" / "src" / "components"

# Patrones de copy hardcodeado sospechoso en JSX
# Busca strings en atributos o como children que no estén envueltos en t()
PATRONES_SOSPECHOSOS = [
    # Texto entre tags JSX (children)
    r'>\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}(?:\s+[A-Za-záéíóúñ]{2,}){1,})\s*<',
    # Atributos comunes con texto: placeholder, title, alt, aria-label, etc.
    r'(placeholder|title|alt|aria-label|aria-labelledby)="([^"]{5,})"',
    r"(placeholder|title|alt|aria-label|aria-labelledby)='([^']{5,})'",
]

# Excepciones: patrones que NO son copy visible (código, rutas, etc.)
EXCEPCIONES = [
    r'^[a-z]+://',           # URLs
    r'^[./@]',               # imports/rutas
    r'^[A-Z]{2,}$',          # Siglas (HTML, CSS, API)
    r'^\d+$',                # Números
    r'^[A-Z][a-z]+[A-Z]',    # camelCase/PascalCase (componentes)
    r'^[a-z]+[A-Z]',         # camelCase
    r'[{}]',                 # Interpolaciones JSX
    r'^\w+$',                # Palabras simples (podrían ser claves)
]

def es_excepcion(texto: str) -> bool:
    """Verifica si el texto es una excepción (no copy visible)"""
    texto = texto.strip()
    for pat in EXCEPCIONES:
        if re.search(pat, texto):
            return True
    return False

def extraer_copy_sospechoso(archivo: Path) -> List[Tuple[int, str, str]]:
    """Extrae líneas con copy sospechoso en un archivo TSX"""
    resultados = []
    content = archivo.read_text(encoding="utf-8")
    lineas = content.split('\n')

    for i, linea in enumerate(lineas, 1):
        linea_stripped = linea.strip()

        # Saltar comentarios
        if linea_stripped.startswith('//') or linea_stripped.startswith('/*'):
            continue

        # Saltar imports
        if linea_stripped.startswith('import ') or linea_stripped.startswith('from '):
            continue

        # Buscar patrones sospechosos
        for patron in PATRONES_SOSPECHOSOS:
            matches = re.finditer(patron, linea)
            for match in matches:
                # Extraer el texto capturado (último grupo)
                texto = match.group(match.lastindex) if match.lastindex else match.group(0)
                texto = texto.strip()

                # Filtrar excepciones
                if texto and not es_excepcion(texto) and len(texto) > 3:
                    # Verificar si ya está envuelto en t() en la misma línea
                    if 't(' not in linea and 'useTranslation' not in content[:content.find(linea)]:
                        resultados.append((i, texto[:100], archivo.name))

    return resultados

def verificar_archivo_tiene_usetranslation(archivo: Path) -> bool:
    """Verifica si el archivo usa useTranslation()"""
    content = archivo.read_text(encoding="utf-8")
    return 'useTranslation' in content or 'from "@/lib/i18n"' in content or 'from "../lib/i18n"' in content

def main():
    print("=" * 70)
    print("DETECTOR COPY HARDCODEADO — secure-t")
    print("=" * 70)

    todos_hallazgos = []
    archivos_procesados = 0

    # Procesar pages/
    print("\n[1] ESCANEANDO pages/:")
    for tsx_file in sorted(PAGES_DIR.glob("*.tsx")):
        archivos_procesados += 1
        tiene_i18n = verificar_archivo_tiene_usetranslation(tsx_file)
        hallazgos = extraer_copy_sospechoso(tsx_file)

        if hallazgos:
            print(f"    ⚠️  {tsx_file.name} ({'CON i18n' if tiene_i18n else 'SIN i18n'}): {len(hallazgos)} hallazgos")
            for linea, texto, _ in hallazgos[:5]:
                print(f"       L{linea}: \"{texto}\"")
            if len(hallazgos) > 5:
                print(f"       ... y {len(hallazgos) - 5} más")
            todos_hallazgos.extend([(tsx_file.name, linea, texto) for linea, texto, _ in hallazgos])
        else:
            estado = "✅" if tiene_i18n else "⚪ (sin i18n ni copy)"
            print(f"    {estado} {tsx_file.name}")

    # Procesar components/ (excluir ui/)
    print("\n[2] ESCANEANDO components/ (excluye ui/):")
    for tsx_file in sorted(COMPONENTS_DIR.glob("*.tsx")):
        if "ui" in tsx_file.parts:
            continue
        archivos_procesados += 1
        tiene_i18n = verificar_archivo_tiene_usetranslation(tsx_file)
        hallazgos = extraer_copy_sospechoso(tsx_file)

        if hallazgos:
            print(f"    ⚠️  {tsx_file.name} ({'CON i18n' if tiene_i18n else 'SIN i18n'}): {len(hallazgos)} hallazgos")
            for linea, texto, _ in hallazgos[:5]:
                print(f"       L{linea}: \"{texto}\"")
            if len(hallazgos) > 5:
                print(f"       ... y {len(hallazgos) - 5} más")
            todos_hallazgos.extend([(tsx_file.name, linea, texto) for linea, texto, _ in hallazgos])
        else:
            estado = "✅" if tiene_i18n else "⚪ (sin i18n ni copy)"
            print(f"    {estado} {tsx_file.name}")

    # Resumen
    print("\n" + "=" * 70)
    print(f"ARCHIVOS PROCESADOS: {archivos_procesados}")
    print(f"HALLAZGOS TOTALES: {len(todos_hallazgos)}")

    if todos_hallazgos:
        print("\n❌ COPY HARDCODEADO DETECTADO (requiere t())")
        # Agrupar por archivo
        por_archivo = {}
        for archivo, linea, texto in todos_hallazgos:
            por_archivo.setdefault(archivo, []).append((linea, texto))

        for archivo, items in por_archivo.items():
            print(f"\n  📄 {archivo}:")
            for linea, texto in items[:10]:
                print(f"     L{linea}: \"{texto}\"")
            if len(items) > 10:
                print(f"     ... y {len(items) - 10} más")
        print("\nRESULTADO: FALLOS ❌")
        sys.exit(1)
    else:
        print("\n✅ NO HAY COPY HARDCODEADO DETECTADO")
        print("RESULTADO: OK ✅")
        sys.exit(0)

if __name__ == "__main__":
    main()
