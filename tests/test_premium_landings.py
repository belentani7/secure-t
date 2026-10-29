"""Regression checks for Secure T's public-facing product experience."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LANDING = (ROOT / "index.html").read_text(encoding="utf-8")
CAMPUS = (ROOT / "campus/index.html").read_text(encoding="utf-8")
STYLES = (ROOT / "ui/experience.css").read_text(encoding="utf-8")
TRANSLATIONS = (ROOT / "ui/i18n.js").read_text(encoding="utf-8")


def test_homepage_exposes_visual_hero_before_secondary_banners():
    assert LANDING.count("<h1 ") == 1
    assert LANDING.index("st-hero-layout") < LANDING.index('id="academia-cinco-anos"')
    assert 'href="ui/experience.css"' in LANDING
    assert 'class="st-hero-art"' in LANDING
    assert 'href="campus/primeros-pasos.html"' in LANDING
    assert LANDING.count('class="st-route-card"') == 3


def test_both_landings_share_a_design_system_not_artist_identity():
    assert 'href="../ui/experience.css"' in CAMPUS
    assert "--st-electric" in STYLES
    assert ".st-hero-layout" in STYLES
    assert ".campus-landing .campus-menu" in STYLES
    assert "prefers-reduced-motion:reduce" in STYLES
    assert "BELENTANI music" not in STYLES


def test_campus_has_keyboard_navigation_and_real_route_links():
    assert 'href="#contenido"' in CAMPUS
    assert '<main class="wrap" id="contenido" tabindex="-1">' in CAMPUS
    assert "<details class=\"campus-menu\">" in CAMPUS
    assert 'href="academia/triage.html"' in CAMPUS
    assert 'href="primeros-pasos.html"' in CAMPUS
    assert 'href="cursos/ciber-defensiva/index.html"' in CAMPUS
    assert CAMPUS.count('class="st-route-card"') == 3


def test_course_descriptions_are_complete_not_ellipsis_placeholders():
    cards = re.findall(r'<article class="card">(.+?)</article>', CAMPUS, re.S)
    assert len(cards) == 4
    for card in cards:
        description = re.search(r'<p>([^<]+)</p>', card)
        assert description and len(description.group(1)) >= 145
        assert "…" not in description.group(1) and "..." not in description.group(1)
        assert 'href="cursos/' in card
    assert "no muestra datos en tiempo real" in CAMPUS


def test_learning_entrypoints_have_all_supported_landing_translations():
    for language in ("pt", "es", "en"):
        assert "Object.assign(I18N." + language in TRANSLATIONS
    for key in ("route.title", "route.first.title", "route.second.title", "route.third.title"):
        assert LANDING.count('data-i18n="' + key + '"') == 1
        assert TRANSLATIONS.count('"' + key + '"') >= 3


def test_four_courses_keep_complete_titles_and_semantic_document_headings():
    for slug in ("ciber-ofensiva", "ciber-defensiva", "ia-aplicada-segura",
                 "gobernanza-compliance"):
        page = (ROOT / "campus/cursos" / slug / "index.html").read_text(encoding="utf-8")
        assert page.count("<h1>") == 1, slug
        assert '<body class="course-landing">' in page
        assert 'href="../../../ui/experience.css"' in page
        assert "…</a>" not in page, slug
        assert '<meta name="description" content="' in page
        assert len(re.search(r'<meta name="description" content="([^"]+)"', page).group(1)) > 90
