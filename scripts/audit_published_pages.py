#!/usr/bin/env python3
"""Auditable inventory of published educational HTML pages.

Run after: python3 scripts/build_site.py --destination site-dist
Counts real published HTML files, not Markdown, planned routes or SPA states.
"""
from __future__ import annotations

import argparse
import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = False
        self.titles = []
        self.headings = []
        self.main = 0
        self.lang = ""
        self.text = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang", "")
        if tag == "title":
            self.title = True
        if tag == "main":
            self.main += 1
        if tag in ("script", "style"):
            self.skip += 1
        if tag in ("h1", "h2"):
            self.headings.append(tag)

    def handle_endtag(self, tag):
        if tag == "title":
            self.title = False
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if self.title:
            self.titles.append(data.strip())
        if not self.skip:
            self.text.append(data.strip())


def inventory(root: Path):
    if not root.is_dir():
        raise SystemExit(f"Build directory not found: {root}")
    pages = []
    for file in sorted(root.rglob("*.html")):
        if file.is_symlink():
            raise SystemExit(f"Refusing symlink: {file}")
        parser = Page()
        parser.feed(file.read_text(encoding="utf-8"))
        relative = file.relative_to(root).as_posix()
        words = len(" ".join(parser.text).split())
        issues = []
        if not "".join(parser.titles).strip():
            issues.append("missing-title")
        if not parser.lang.strip():
            issues.append("missing-lang")
        if "h1" not in parser.headings:
            issues.append("missing-h1")
        if not parser.main:
            issues.append("missing-main")
        if words < 80:
            issues.append("low-text-content")
        pages.append({"path": relative, "words": words, "issues": issues})
    counts = Counter(issue for page in pages for issue in page["issues"])
    return {
        "html_pages": len(pages),
        "quality_flags": dict(sorted(counts.items())),
        "pages": pages,
        "note": "Counts HTML artifacts only; flags are heuristics, not pedagogical certification.",
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", default="site-dist")
    ap.add_argument("--json", dest="json_path")
    ap.add_argument("--min-pages", type=int, default=0)
    args = ap.parse_args()
    if args.min_pages < 0:
        ap.error("--min-pages must be nonnegative")
    report = inventory(Path(args.site).resolve())
    print(f"Published HTML pages: {report['html_pages']}")
    print(f"Quality flags: {report['quality_flags']}")
    if args.json_path:
        Path(args.json_path).write_text(
            json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
    if report["html_pages"] < args.min_pages:
        raise SystemExit(f"Expected at least {args.min_pages} published HTML pages")


if __name__ == "__main__":
    main()
