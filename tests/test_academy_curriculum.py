"""Regression tests for the recovered, *planned* five-year Secure T curriculum."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ACADEMY = ROOT / "campus" / "academia"


def curriculum():
    source = (ACADEMY / "data.js").read_text(encoding="utf-8")
    assert "window.SecureTAcademyData =" in source
    payload = source.split("window.SecureTAcademyData =", 1)[1].strip().removesuffix(";")
    return json.loads(payload)


def test_five_years_are_represented_honestly_as_a_plan():
    data = curriculum()
    assert data["schema"] == "secure-t.academia.v1"
    assert data["planning"] is True, "A planned curriculum is not a completed/accredited degree"
    assert data["years"] == 5
    assert data["semesters"] == 10
    assert len(data["courses"]) == 60
    for year in range(1, 6):
        assert len([c for c in data["courses"] if c["year"] == year]) == 12
    for semester in range(1, 11):
        assert len([c for c in data["courses"] if c["semester"] == semester]) == 6
    assert "não 5 anos" in data["notes"]["pt"] or "não" in data["notes"]["pt"]
    assert "not five years" in data["notes"]["en"].lower()


def test_prerequisites_resources_and_languages_are_internally_consistent():
    data = curriculum()
    course_ids = [c["id"] for c in data["courses"]]
    resource_ids = {r["id"] for r in data["resources"]}
    assert len(course_ids) == len(set(course_ids))
    assert len(resource_ids) == len(data["resources"])
    assert {c["track"] for c in data["courses"]} == {"cyber", "web", "languages"}
    for course in data["courses"]:
        assert course["requires"] is None or course["requires"] in course_ids
        assert all(resource in resource_ids for resource in course["resources"])
        assert course["hours"] > 0
        assert course["topics"]
        for key in ("title", "outcome", "assessment"):
            assert all(course[key].get(lang) for lang in ("pt", "es", "en"))


def test_academy_links_and_scripts_are_part_of_static_publication():
    landing = (ROOT / "index.html").read_text(encoding="utf-8")
    academy = (ACADEMY / "index.html").read_text(encoding="utf-8")
    assert '<html lang="pt"' in landing
    assert "campus/academia/" in landing
    assert '<html lang="pt-BR"' in academy
    for asset in ("style.css", "data.js", "app.js", "labs.js"):
        assert (ACADEMY / asset).is_file()
        assert f'src="{asset}"' in academy or f'href="{asset}"' in academy


def test_local_labs_do_not_allow_active_scripts_or_external_targets():
    source = (ACADEMY / "labs.js").read_text(encoding="utf-8")
    assert "script-src 'none'" in source
    assert "connect-src 'none'" in source
    assert "form-action 'none'" in source
    assert "srcdoc" in source
    assert "sandbox" in (ACADEMY / "index.html").read_text(encoding="utf-8")


def test_pages_uses_current_repository_and_builder_validates_site_metadata():
    workflow = (ROOT / ".github" / "workflows" / "pages.yml").read_text(encoding="utf-8")
    builder = (ROOT / "scripts" / "build_site.py").read_text(encoding="utf-8")
    assert "https://www.belentani.es/secure-t/" in workflow
    assert "SITE_URL" in builder and "render_public_metadata(stage)" in builder
    assert "site-dist" in builder
    assert "secure-t-university/" not in workflow
