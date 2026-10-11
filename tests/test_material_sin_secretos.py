# -*- coding: utf-8 -*-
"""El material docente no puede disparar el escáner de secretos.

En la semana 8 de `ciber-ofensiva` el ejemplo del proxy combinaba la palabra
`curl` en un comentario con un `-u` de `ffuf` cinco líneas más abajo: la regla
`curl-auth-user` de gitleaks lo leía como un usuario:contraseña y el trabajo
`secretos` de la CI se rompía con un falso positivo (commits `f0d03a7`).

Este control replica la regla exacta de gitleaks 8.24.3 sobre todo el material
en Markdown para que el corpus no vuelva a introducir ese patrón. No sustituye
al escáner de la CI —que corre con el binario real y sobre todo el historial—,
sino que da al redactor una comprobación local inmediata.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

CAMPUS = Path(__file__).resolve().parent.parent / "campus"

# Regla `curl-auth-user` de gitleaks 8.24.3 (config/config.go → default config).
PATRON = re.compile(
    r"""\bcurl\b(?:.*|.*(?:[\r\n]{1,2}.*){1,5})[ \t\n\r](?:-u|--user)(?:=|[ \t]{0,5})"""
    r"""("(:[^"]{3,}|[^:"]{3,}:|[^:"]{3,}:[^"]{3,})"|'([^:'"]{3,}:[^'"]{3,})'|"""
    r"""((?:"[^"]{3,}"|'[^']{3,}'|[\w$@.-]+):(?:"[^"]{3,}"|'[^']{3,}'|[\w${}@.-]+)))"""
    r"""(?:\s|\Z)""",
    re.MULTILINE,
)

# Allowlists propias de la regla: placeholders legítimos.
PERMITIDOS = [
    re.compile(r"""[^:]+:(?:change(?:it|me)|pass(?:word)?|pwd|test|token|\*+|x+)"""),
    re.compile(r"""['"]?<[^>]+>['"]?:['"]?<[^>]+>|<[^:]+:[^>]+>['"]?"""),
    re.compile(r"""[^:]+:\[[^]]+]"""),
    re.compile(r"""['"]?[^:]+['"]?:['"]?\$(?:\d|\w+|\{(?:\d|\w+)})['"]?"""),
    re.compile(r"""\$\([^)]+\):\$\([^)]+\)"""),
    re.compile(r"""['"]?\$?{{[^}]+}}['"]?:['"]?\$?{{[^}]+}}['"]?"""),
]


def ficheros_markdown() -> list[Path]:
    return sorted(p for p in CAMPUS.rglob("*.md") if p.is_file())


def test_el_material_existe() -> None:
    ficheros = ficheros_markdown()
    assert len(ficheros) > 100, f"solo {len(ficheros)} ficheros Markdown en campus/"


@pytest.mark.parametrize("fichero", ficheros_markdown(), ids=lambda p: str(p.relative_to(CAMPUS)))
def test_sin_falsos_positivos_de_credenciales_en_curl(fichero: Path) -> None:
    texto = fichero.read_text(encoding="utf-8", errors="replace")
    for coincidencia in PATRON.finditer(texto):
        secreto = coincidencia.group(1)
        assert any(p.search(secreto) for p in PERMITIDOS), (
            f"{fichero.name}:{texto[: coincidencia.start()].count(chr(10)) + 1}: "
            f"la regla curl-auth-user de gitleaks lo leería como credencial ({secreto!r}); "
            "usa un placeholder (<usuario>:<clave>) o separa el ejemplo"
        )
