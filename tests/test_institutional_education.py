from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
CAMPUS=ROOT/"campus"
def test_institutional_education_pages_and_local_links():
    for page in ("metodo.html","laboratorios.html"):
        html=(CAMPUS/page).read_text(encoding="utf-8")
        assert "<main " in html and "<h1" in html
        assert "institutional-education.css" in html
        assert 'name="description"' in html
        for ref in re.findall(r'(?:href|src)="([^"]+)"',html):
            path=ref.split("#",1)[0].split("?",1)[0]
            if not path or path.startswith(("https:","http:","mailto:")): continue
            candidate=(CAMPUS/path).resolve()
            assert candidate.is_relative_to(ROOT), f"unsafe path: {path}"
            assert candidate.exists(), f"{page} missing {path}"
    homepage=(CAMPUS/"index.html").read_text(encoding="utf-8")
    assert 'href="metodo.html"' in homepage
    assert 'href="laboratorios.html"' in homepage
