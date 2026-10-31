#!/usr/bin/env python3
"""Small, dependency-free HTML/identity smoke gate for primary Secure T entry points."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "campus/index.html", "campus/academia/index.html", "404.html")
ACCENT = "#b8f36b"

class Audit(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = False
        self.title_depth = 0
        self.title_text = ""
        self.viewport = False
        self.description = False
        self.h1_count = 0
        self.ids = set()
        self.duplicates = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = bool(a.get("lang", "").strip())
        if tag == "title":
            self.title_depth += 1
        if tag == "meta":
            self.viewport |= a.get("name", "").lower() == "viewport"
            self.description |= a.get("name", "").lower() == "description"
        if tag == "h1":
            self.h1_count += 1
        if a.get("id"):
            if a["id"] in self.ids:
                self.duplicates.append(a["id"])
            self.ids.add(a["id"])
    def handle_endtag(self, tag):
        if tag == "title" and self.title_depth:
            self.title_depth -= 1
    def handle_data(self, data):
        if self.title_depth:
            self.title_text += data.strip()

def main() -> int:
    errors = []
    for rel in PAGES:
        path = ROOT / rel
        parser = Audit()
        try:
            source = path.read_text(encoding="utf-8")
            parser.feed(source)
            parser.close()
        except (OSError, UnicodeError) as exc:
            errors.append(f"{rel}: cannot read/parse: {exc}")
            continue
        if not parser.lang: errors.append(f"{rel}: missing html lang")
        if not parser.title_text.strip(): errors.append(f"{rel}: missing descriptive title")
        if not parser.viewport: errors.append(f"{rel}: missing responsive viewport")
        if rel != "404.html" and not parser.description: errors.append(f"{rel}: missing meta description")
        if parser.duplicates: errors.append(f"{rel}: duplicate IDs: {', '.join(parser.duplicates)}")
    tokens = (ROOT / "campus/tokens.css").read_text(encoding="utf-8")
    institutional = (ROOT / "ui/institutional.css").read_text(encoding="utf-8")
    academy = (ROOT / "campus/academia/style.css").read_text(encoding="utf-8")
    if "--hue: 145;" not in tokens: errors.append("campus/tokens.css: green brand hue is not configured")
    if "--st-accent: #b8f36b;" not in institutional: errors.append("ui/institutional.css: institutional accent must match #B8F36B")
    if "--aqua:#b8f36b;" not in academy: errors.append("campus/academia/style.css: academy accent must match #B8F36B")
    if errors:
        print("HTML/identity standards: FAIL")
        print("\n".join(f"- {e}" for e in errors))
        return 1
    print(f"HTML/identity standards: PASS ({len(PAGES)} entry points; shared green identity)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
