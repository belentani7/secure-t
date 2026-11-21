# catalogo.py — secure-t
# Generado por repo_forge.py (create-only)

import json
from pathlib import Path

REPO = json.loads(Path(__file__).with_name("catalogo.json").read_text(encoding="utf-8"))
FAMILIA = "educación"
AJUSTES_APLICADOS = 50
REGLAS_OFICIALES_OK = 40
ESTADO = "estructurado"
PRODUCTO_COMPLETO = False
GENERADO = "2026-11-10T19:10:59.982758+00:00"


def info() -> dict:
    return {
        "repo": REPO["nombre"],
        "familia": FAMILIA,
        "ajustes_aplicados": AJUSTES_APLICADOS,
        "reglas_oficiales_ok": REGLAS_OFICIALES_OK,
        "estado": ESTADO,
        "producto_completo": PRODUCTO_COMPLETO,
        "generado": GENERADO,
    }
