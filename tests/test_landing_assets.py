"""Landing layout and icons must be usable without executing third-party CDNs."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def test_landing_uses_local_compiled_layout_and_icons():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    scripts = re.findall(r'<script[^>]+src="([^"]+)"', html)
    assert not any(url.startswith(("https://", "http://")) for url in scripts)
    assert 'href="ui/vendor/landing.css"' in html
    assert 'src="ui/vendor/lucide.min.js"' in html
    css = (ROOT / "ui/vendor/landing.css").read_text(encoding="utf-8")
    assert ".hidden{display:none}" in css
    assert ".grid{display:grid}" in css
    assert "@media (min-width:768px)" in css


def test_vendored_landing_dependencies_keep_their_licenses():
    for name in ("TAILWIND-LICENSE", "LUCIDE-LICENSE"):
        license_text = (ROOT / "ui/vendor" / name).read_text(encoding="utf-8")
        assert "Permission" in license_text or "permission" in license_text
