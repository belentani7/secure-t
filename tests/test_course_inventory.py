"""Guard the HTML lesson routes against missing source material."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ITINERARIES = ROOT / "campus" / "itinerarios"
COURSES = ROOT / "campus" / "cursos"


def test_every_lesson_page_has_original_material_and_manifest_entry():
    manifest = json.loads((ITINERARIES / "curso-manifest.json").read_text(encoding="utf-8"))
    for course in manifest["courses"]:
        slug = course["slug"]
        expected = {f"semana-{week:02d}" for week in course["weeks"]}
        pages = {path.stem for path in (ITINERARIES / "cursos" / slug).glob("semana-??.html")}
        sources = {path.stem for path in (COURSES / slug).glob("semana-??.md")}
        assert pages == expected == sources, slug


def test_html_fallbacks_link_to_existing_course_content():
    catalog = (ITINERARIES / "cursos-completos.html").read_text(encoding="utf-8")
    manifest = json.loads((ITINERARIES / "curso-manifest.json").read_text(encoding="utf-8"))
    assert "<noscript>" in catalog
    assert 'data-js-filters hidden' in catalog
    for course in manifest["courses"]:
        slug = course["slug"]
        assert f'../cursos/{slug}/index.html' in catalog
        assert (COURSES / slug / "index.html").is_file()
        for week in course["weeks"]:
            lesson = (ITINERARIES / "cursos" / slug / f"semana-{week:02d}.html").read_text(encoding="utf-8")
            assert "<noscript>" in lesson
            assert 'data-complete type="button" hidden' in lesson
            assert f'../cursos/{slug}/index.html#semana-{week:02d}' in lesson
