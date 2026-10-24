"""Contract checks for the published Secure T student workstation."""
from html.parser import HTMLParser
from pathlib import Path
import shutil
import subprocess

import pytest

ROOT = Path(__file__).resolve().parents[1]
WORKSTATION = ROOT / "campus" / "workstation"


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag in ("script", "link"):
            ref = attributes.get("src") or attributes.get("href")
            if ref:
                self.refs.append(ref)


def test_workstation_complete_and_wired():
    index = (WORKSTATION / "index.html").read_text(encoding="utf-8")
    parser = Assets()
    parser.feed(index)
    for name in ("workstation.css", "workstation-data.js", "workstation.js"):
        assert name in parser.refs
        assert (WORKSTATION / name).is_file()
    for panel in ("dashboard", "terminal", "cases", "notebook", "guide"):
        assert f'id="panel-{panel}"' in index
        assert f'data-panel="{panel}"' in index
    assert 'role="log"' in index
    assert 'href="../cursos/ciber-defensiva/index.html"' in index


def test_workstation_discoverable_and_offline_cached():
    assert 'href="workstation/"' in (ROOT / "campus" / "index.html").read_text(encoding="utf-8")
    assert 'href="../workstation/"' in (ROOT / "campus" / "academia" / "index.html").read_text(encoding="utf-8")
    service_worker = (ROOT / "campus" / "sw.js").read_text(encoding="utf-8")
    for asset in ("index.html", "workstation.css", "workstation.js", "workstation-data.js"):
        assert f"'./workstation/{asset}'" in service_worker
    assert "/campus/workstation/" in (ROOT / "public" / "sitemap.xml").read_text(encoding="utf-8")


def test_workstation_safe_simulation_contract():
    script = (WORKSTATION / "workstation.js").read_text(encoding="utf-8")
    data = (WORKSTATION / "workstation-data.js").read_text(encoding="utf-8")
    for forbidden in ("eval(", "new Function(", "fetch(", "WebSocket(", "child_process", "innerHTML", "navigator.sendBeacon"):
        assert forbidden not in script, f"forbidden browser feature: {forbidden}"
    for command in ('"help"', '"cat"', '"grep"', '"timeline"', '"head"'):
        assert command in script
    assert "Object.hasOwn(files, tokens[1])" in script
    for reserved_ip in ("198.51.100.24",):
        assert reserved_ip in data
    assert "secure-t.workstation.v1" in script
    assert 'localStorage.setItem(storageKey' in script


@pytest.mark.skipif(shutil.which("node") is None, reason="Node.js no disponible")
@pytest.mark.parametrize("asset", ["workstation.js", "workstation-data.js"])
def test_workstation_js_syntax(asset):
    completed = subprocess.run(["node", "--check", str(WORKSTATION / asset)],
                               text=True, capture_output=True, check=False)
    assert completed.returncode == 0, completed.stderr
