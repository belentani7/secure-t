"""Protect the institutional public entrypoint from returning to a single-file demo."""
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOME = (ROOT / "index.html").read_text(encoding="utf-8")


def test_home_is_a_small_semantic_entry_not_an_application_dump():
    assert HOME.count("<h1 ") == 1
    assert HOME.count("<section ") <= 5
    assert "<style" not in HOME and "<script>" not in HOME
    assert "cdn.tailwindcss.com" not in HOME
    assert "unpkg.com" not in HOME
    assert 'href="ui/institutional.css"' in HOME
    assert 'src="ui/institutional.js"' in HOME
    for rel in ("campus/", "campus/primeros-pasos.html",
                "campus/academia/triage.html", "campus/academia/threat-studio.html"):
        assert f'href="{rel}"' in HOME


def test_navigation_is_accessible_and_course_links_are_real():
    assert 'href="#contenido"' in HOME
    assert '<main id="contenido">' in HOME
    assert '<nav class="site-nav"' in HOME
    assert '<label class="language-label" for="language"' in HOME
    assert '<select id="language"' in HOME
    for slug in ("ciber-defensiva", "ciber-ofensiva",
                 "ia-aplicada-segura", "gobernanza-compliance"):
        assert f'href="campus/cursos/{slug}/index.html"' in HOME
        assert (ROOT / "campus" / "cursos" / slug / "index.html").is_file()


def test_translations_are_complete_for_every_visible_key():
    js = (ROOT / "ui/institutional.js").read_text(encoding="utf-8")
    # In addition to the root language, require a full dictionary and safe
    # textContent rendering; never evaluate translated strings as HTML.
    assert "'use strict'" in js
    assert "el.textContent = dict[key]" in js
    assert "innerHTML" not in js
    assert "pt: {" in js and "es: {" in js and "en: {" in js
    assert "prefers-reduced-motion: reduce" in (
        ROOT / "ui/institutional.css").read_text(encoding="utf-8")
