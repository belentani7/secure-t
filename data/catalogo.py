"""secure-t — banco de datos canónico.

Generado por repo-forge desde el árbol real. Es la única fuente de verdad del
repositorio: si un dato no está aquí, no se afirma en ningún otro sitio.
"""
from __future__ import annotations

REPO = {
    "nombre": "secure-t",
    "remoto": "https://github.com/belentani7/secure-t",
    "tipo": "python-tool",
    "modelo": 'instituto abierto de formación (programas + laboratorios)',
    "publico": 'profesionales que quieren entrar en ciberseguridad e IA sin pagar matrícula',
    "licencia": "MIT",
    "medido": {
        "archivos": 250,
        "lineas": 25589,
        "bytes": 1597581,
        "html": 28,
        "tests": 0,
    },
    "modulos": ['Catálogo de 4 programas', 'Laboratorios guiados', 'Evaluación por evidencias', 'Credencial verificable', 'Bolsa de prácticas'],
    "paleta": {
        "bg": "#fbfaf7",
        "ink": "#1a1a1a",
        "accent": "#0e6e5a",
    },
}


def resumen() -> str:
    """Una línea legible con el estado medido."""
    m = REPO["medido"]
    return f"{REPO['nombre']}: {m['archivos']} archivos, {m['lineas']} líneas, {m['html']} páginas HTML"


if __name__ == "__main__":
    print(resumen())
