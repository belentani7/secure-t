"""Unit tests for the published HTML inventory, using isolated fixtures."""
from pathlib import Path
import importlib.util

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "audit_published_pages.py"
spec = importlib.util.spec_from_file_location("audit_published_pages", MODULE)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


def test_inventory_counts_only_html_and_flags_quality(tmp_path):
    (tmp_path / "good.html").write_text(
        '<!doctype html><html lang="es"><head><title>Lección</title></head>'
        '<body><main><h1>Introducción</h1><p>' + ("contenido " * 90) +
        '</p></main></body></html>', encoding="utf-8"
    )
    (tmp_path / "notes.md").write_text("# Not HTML", encoding="utf-8")
    (tmp_path / "empty.html").write_text("<html></html>", encoding="utf-8")
    result = audit.inventory(tmp_path)
    assert result["html_pages"] == 2
    by_path = {page["path"]: page for page in result["pages"]}
    assert by_path["good.html"]["issues"] == []
    assert "missing-title" in by_path["empty.html"]["issues"]
    assert "low-text-content" in by_path["empty.html"]["issues"]


def test_nested_pages_are_counted(tmp_path):
    nested = tmp_path / "campus" / "cursos"
    nested.mkdir(parents=True)
    (nested / "semana-01.html").write_text("<html></html>", encoding="utf-8")
    result = audit.inventory(tmp_path)
    assert result["pages"][0]["path"] == "campus/cursos/semana-01.html"
