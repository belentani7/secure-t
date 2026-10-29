"""The public entrypoint and Pages artifact metadata must use the real HTTPS canonical."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = "https://www.belentani.es/secure-t/"


def test_public_canonical_is_https_and_not_the_redirecting_github_pages_alias():
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    workflow = (ROOT / ".github/workflows/pages.yml").read_text(encoding="utf-8")
    builder = (ROOT / "scripts/build_site.py").read_text(encoding="utf-8")

    assert f'<link rel="canonical" href="{CANONICAL}">' in home
    assert f'<meta property="og:url" content="{CANONICAL}">' in home
    assert f"SITE_URL: {CANONICAL}" in workflow
    assert f'DEFAULT_SITE_URL = "{CANONICAL.rstrip("/")}"' in builder
    assert "http://www.belentani.es/secure-t/" not in workflow
    assert "http://www.belentani.es/secure-t/" not in home
