#!/usr/bin/env python3
"""
Contrast Audit Script — secure-t
Extrae pares text-*/bg-* de Tailwind y calcula WCAG 2.x; falla por debajo de 4.5:1.
"""

import re
import sys
import json
from pathlib import Path
from typing import List, Tuple, Dict, Optional

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "client" / "src"

# Colores base de Tailwind (valores aproximados para cálculo)
# Formato: nombre -> (r, g, b) normalizado 0-1
TAILWIND_COLORS = {
    # Slate/Zinc/Neutral/Stone (grises)
    "slate-50": (0.98, 0.98, 0.99), "slate-100": (0.95, 0.95, 0.96), "slate-200": (0.89, 0.89, 0.91),
    "slate-300": (0.80, 0.81, 0.84), "slate-400": (0.59, 0.60, 0.65), "slate-500": (0.45, 0.46, 0.51),
    "slate-600": (0.31, 0.33, 0.39), "slate-700": (0.23, 0.24, 0.29), "slate-800": (0.16, 0.17, 0.21),
    "slate-900": (0.09, 0.10, 0.13), "slate-950": (0.02, 0.03, 0.05),
    "zinc-50": (0.99, 0.99, 0.99), "zinc-100": (0.96, 0.96, 0.96), "zinc-200": (0.91, 0.91, 0.91),
    "zinc-300": (0.83, 0.83, 0.83), "zinc-400": (0.64, 0.64, 0.64), "zinc-500": (0.52, 0.52, 0.52),
    "zinc-600": (0.39, 0.39, 0.39), "zinc-700": (0.29, 0.29, 0.29), "zinc-800": (0.18, 0.18, 0.18),
    "zinc-900": (0.10, 0.10, 0.10), "zinc-950": (0.04, 0.04, 0.04),
    # Colores de secure-t (definidos en index.css / tailwind config)
    "lime": (0.72, 0.95, 0.42),      # #b8f36b
    "cyan": (0.29, 0.86, 0.91),      # #49dce8
    "violet": (0.74, 0.64, 0.97),    # #bda2ff
    "coral": (1.0, 0.51, 0.47),      # #ff8377
    "dark-bg": (0.03, 0.06, 0.09),   # #071016
    "dark-card": (0.06, 0.11, 0.14), # #101d24
    "dark-hover": (0.04, 0.07, 0.13), # #0b1322
}

# Opacidades Tailwind /10, /20, /30, /40, /50, /60, /70, /80, /90
OPACIDADES = {
    "10": 0.1, "15": 0.15, "20": 0.2, "25": 0.25, "30": 0.3, "35": 0.35,
    "40": 0.4, "42": 0.42, "45": 0.45, "50": 0.5, "55": 0.55, "60": 0.6,
    "65": 0.65, "70": 0.7, "75": 0.75, "80": 0.8, "85": 0.85, "90": 0.9, "95": 0.95,
}

def parse_color(color_str: str) -> Optional[Tuple[float, float, float]]:
    """Parsea un string de color Tailwind a RGB normalizado"""
    # Hex directo
    if color_str.startswith("#"):
        hex_color = color_str[1:]
        if len(hex_color) == 3:
            hex_color = "".join(c*2 for c in hex_color)
        if len(hex_color) == 6:
            r = int(hex_color[0:2], 16) / 255
            g = int(hex_color[2:4], 16) / 255
            b = int(hex_color[4:6], 16) / 255
            return (r, g, b)
    
    # rgb() / rgba()
    rgb_match = re.match(r'rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)', color_str)
    if rgb_match:
        r, g, b = map(int, rgb_match.groups())
        return (r/255, g/255, b/255)
    
    # Tailwind named colors (simplificado)
    for key, val in TAILWIND_COLORS.items():
        if key in color_str:
            return val
    
    return None

def aplicar_opacidad(color: Tuple[float, float, float], opacidad: float, fondo: Tuple[float, float, float]) -> Tuple[float, float, float]:
    """Aplica opacidad sobre un fondo (alpha blending)"""
    r = color[0] * opacidad + fondo[0] * (1 - opacidad)
    g = color[1] * opacidad + fondo[1] * (1 - opacidad)
    b = color[2] * opacidad + fondo[2] * (1 - opacidad)
    return (r, g, b)

def luminance(rgb: Tuple[float, float, float]) -> float:
    """Calcula luminancia relativa WCAG"""
    def canal(c):
        c = c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        return c
    r, g, b = map(canal, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contraste(rgb1: Tuple[float, float, float], rgb2: Tuple[float, float, float]) -> float:
    """Calcula ratio de contraste WCAG 2.x"""
    l1 = luminance(rgb1)
    l2 = luminance(rgb2)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

def parsear_clase_tailwind(clase: str) -> Optional[Tuple[str, str, Optional[float]]]:
    """Parsea clase Tailwind text-* o bg-* y devuelve (tipo, color, opacidad)"""
    # text-white/45, bg-slate-900/50, text-[#b8f36b], etc.
    match = re.match(r'^(text|bg)-(.+)$', clase)
    if not match:
        return None
    
    tipo = match.group(1)
    valor = match.group(2)
    
    # Separar opacidad si existe: color/45
    opacidad = None
    if '/' in valor:
        partes = valor.split('/')
        valor = partes[0]
        try:
            opacidad = OPACIDADES.get(partes[1]) or (int(partes[1]) / 100)
        except:
            opacidad = 1.0
    
    return (tipo, valor, opacidad)

def extraer_clases_tsx(archivo: Path) -> List[Tuple[int, str, str]]:
    """Extrae todas las clases Tailwind text-* y bg-* de un archivo TSX"""
    resultados = []
    content = archivo.read_text(encoding="utf-8")
    lineas = content.split('\n')
    
    for i, linea in enumerate(lineas, 1):
        # Buscar className="..." o className={...}
        matches = re.finditer(r'className\s*=\s*["\']([^"\']+)["\']', linea)
        for match in matches:
            clases = match.group(1).split()
            for clase in clases:
                parsed = parsear_clase_tailwind(clase)
                if parsed:
                    resultados.append((i, clase, parsed[0]))  # (linea, clase_completa, tipo)
    
    return resultados

def resolver_color(valor: str, opacidad: Optional[float], fondo_por_defecto: Tuple[float, float, float]) -> Optional[Tuple[float, float, float]]:
    """Resuelve un color Tailwind a RGB final considerando opacidad"""
    color_base = parse_color(valor)
    if not color_base:
        return None
    
    if opacidad and opacidad < 1.0:
        return aplicar_opacidad(color_base, opacidad, fondo_por_defecto)
    return color_base

def auditar_archivo(archivo: Path, fondo_por_defecto: Tuple[float, float, float]) -> List[Dict]:
    """Audita un archivo TSX y devuelve fallos de contraste"""
    fallos = []
    clases = extraer_clases_tsx(archivo)
    
    # Agrupar por línea: buscar pares text-* + bg-* en la misma línea
    por_linea = {}
    for linea, clase, tipo in clases:
        if linea not in por_linea:
            por_linea[linea] = {"text": [], "bg": []}
        parsed = parsear_clase_tailwind(clase)
        if parsed:
            _, color, opacidad = parsed
            por_linea[linea][tipo].append((color, opacidad))
    
    for linea, datos in por_linea.items():
        for text_color, text_opacidad in datos["text"]:
            text_rgb = resolver_color(text_color, text_opacidad, fondo_por_defecto)
            if not text_rgb:
                continue
            
            # Buscar bg en misma línea o asumir fondo por defecto
            bg_rgb = fondo_por_defecto
            if datos["bg"]:
                bg_color, bg_opacidad = datos["bg"][0]
                bg_resuelto = resolver_color(bg_color, bg_opacidad, fondo_por_defecto)
                if bg_resuelto:
                    bg_rgb = bg_resuelto
            
            ratio = contraste(text_rgb, bg_rgb)
            if ratio < 4.5:
                fallos.append({
                    "archivo": str(archivo.relative_to(ROOT)),
                    "linea": linea,
                    "text_class": f"text-{text_color}" + (f"/{int(text_opacidad*100)}" if text_opacidad and text_opacidad < 1 else ""),
                    "bg_class": f"bg-{bg_color}" + (f"/{int(bg_opacidad*100)}" if bg_opacidad and bg_opacidad < 1 else "") if datos["bg"] else "FONDO POR DEFECTO",
                    "ratio": round(ratio, 2),
                    "texto_ejemplo": "Texto en esta línea",
                })
    
    return fallos

def main():
    print("=" * 70)
    print("AUDITORÍA DE CONTRASTE WCAG 2.x — secure-t")
    print("=" * 70)
    
    # Fondos por defecto detectados en el proyecto
    FONDOS = [
        ("dark-bg (#071016)", TAILWIND_COLORS["dark-bg"]),
        ("dark-card (#101d24)", TAILWIND_COLORS["dark-card"]),
        ("dark-hover (#0b1322)", TAILWIND_COLORS["dark-hover"]),
    ]
    
    todos_fallos = []
    archivos_procesados = 0
    
    for tsx_file in SRC_DIR.rglob("*.tsx"):
        if "node_modules" in tsx_file.parts or ".git" in tsx_file.parts:
            continue
        archivos_procesados += 1
        
        for nombre_fondo, fondo_rgb in FONDOS:
            fallos = auditar_archivo(tsx_file, fondo_rgb)
            for f in fallos:
                f["fondo_asumido"] = nombre_fondo
            todos_fallos.extend(fallos)
    
    # Deduplicar (mismo archivo, línea, clases)
    fallos_unicos = []
    vistos = set()
    for f in todos_fallos:
        clave = (f["archivo"], f["linea"], f["text_class"], f["bg_class"], f["fondo_asumido"])
        if clave not in vistos:
            vistos.add(clave)
            fallos_unicos.append(f)
    
    print(f"\nARCHIVOS PROCESADOS: {archivos_procesados}")
    print(f"FALLOS DE CONTRASTE (< 4.5:1): {len(fallos_unicos)}")
    
    if fallos_unicos:
        # Agrupar por ratio para mostrar los peores primero
        fallos_unicos.sort(key=lambda x: x["ratio"])
        
        print("\n🔴 TOP FALLOS (peor contraste primero):")
        for f in fallos_unicos[:30]:
            print(f"  {f['archivo']}:{f['linea']} | {f['text_class']} ON {f['bg_class']} ({f['fondo_asumido']})")
            print(f"       Ratio: {f['ratio']}:1")
        
        if len(fallos_unicos) > 30:
            print(f"\n  ... y {len(fallos_unicos) - 30} fallos más")
        
        # Estadísticas por opacidad
        print("\n📊 ESTADÍSTICAS POR OPACIDAD:")
        por_opacidad = {}
        for f in fallos_unicos:
            match = re.search(r'/(\d+)', f["text_class"])
            op = match.group(1) if match else "100"
            por_opacidad[op] = por_opacidad.get(op, 0) + 1
        
        for op in sorted(por_opacidad.keys(), key=int):
            print(f"   /{op}: {por_opacidad[op]} fallos")
        
        print("\nRESULTADO: FALLOS DE CONTRASTE ❌")
        sys.exit(1)
    else:
        print("\n✅ TODOS LOS PARES CUMPLEN 4.5:1")
        print("RESULTADO: OK ✅")
        sys.exit(0)

if __name__ == "__main__":
    main()