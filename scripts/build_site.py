#!/usr/bin/env python3
"""Build one complete static campus for Pages, Netlify and local verification.

The previous Drive candidate introduced link checking, but assembled the stale
public/ mirror. This builder keeps that validation approach and uses the current
root landing, campus and concept sources without publishing the repository.
"""
from __future__ import annotations

import argparse
import os
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
import tempfile
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DESTINATION = ROOT / "site-dist"


# Intended Pages project path. A deployment may override this with SITE_URL.
DEFAULT_SITE_URL = "https://belentani7.github.io/secure-t"


def public_site_url() -> str:
    """Require an explicit, safe HTTPS origin for generated public metadata."""
    value = os.environ.get("SITE_URL", DEFAULT_SITE_URL).strip().rstrip("/")
    url = urlsplit(value)
    if (url.scheme != "https" or not url.netloc or url.username or url.password
            or url.query or url.fragment or not url.hostname
            or any(part in {".", ".."} for part in url.path.split("/"))):
        raise ValueError("SITE_URL must be a plain HTTPS origin and optional path")
    return value


def render_public_metadata(stage: Path) -> None:
    """No unresolved URL placeholders or stale project paths in the output."""
    site_url = public_site_url()
    for name in ("robots.txt", "sitemap.xml"):
        path = stage / name
        source = path.read_text(encoding="utf-8")
        if "__BASE_URL__" not in source:
            raise RuntimeError(f"Missing expected metadata placeholder: {name}")
        path.write_text(source.replace("__BASE_URL__", site_url), encoding="utf-8")
    landing = stage / "index.html"
    source = landing.read_text(encoding="utf-8")
    landing.write_text(source.replace(DEFAULT_SITE_URL + "/", site_url + "/"), encoding="utf-8")


class _References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name not in ("href", "src", "poster") or not value:
                continue
            parsed = urlsplit(value)
            if not parsed.scheme and not parsed.netloc and parsed.path:
                self.paths.append(unquote(parsed.path))


def validate_local_html(root: Path) -> list[str]:
    root = root.resolve()
    errors = []
    for html in root.rglob("*.html"):
        parser = _References()
        parser.feed(html.read_text(encoding="utf-8"))
        for ref in parser.paths:
            target = (root / ref.lstrip("/") if ref.startswith("/")
                      else html.parent / ref).resolve()
            if not target.is_relative_to(root):
                errors.append(f"reference escapes site: {html.relative_to(root)} -> {ref}")
                continue
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"missing local asset: {html.relative_to(root)} -> {ref}")
    return errors


def validate_public_files(root: Path) -> None:
    forbidden = {".git", ".github", "node_modules", "certs", "audit", "audit-kit"}
    secret = re.compile(
        r"(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|"
        r"AKIA[0-9A-Z]{16}|-----BEGIN (?:[A-Z]+ )*PRIVATE KEY-----"
    )
    for path in root.rglob("*"):
        if (path.is_symlink() or path.name in forbidden
                or path.name.startswith(".env")
                or path.suffix.lower() in {".pem", ".key", ".p12", ".pfx"}):
            raise RuntimeError(f"Refusing private publication path: {path.relative_to(root)}")
        if path.is_file():
            # Credentials can have no extension, or be embedded in an asset.
            if secret.search(path.read_bytes().decode("latin-1")):
                raise RuntimeError(f"Possible secret in publication: {path.relative_to(root)}")


def _source(relative: str) -> Path:
    source = ROOT / relative
    if any(path.is_symlink() for path in (source, *source.parents)
           if path.is_relative_to(ROOT)):
        raise RuntimeError(f"Refusing publication source symlink: {relative}")
    return source


def build_site(destination: Path = DEFAULT_DESTINATION) -> tuple[int, int]:
    destination = Path(destination).absolute()
    if destination.is_symlink():
        raise ValueError("Destination cannot be a symlink")
    destination = destination.resolve()
    if ROOT.is_relative_to(destination) or (
        destination.is_relative_to(ROOT) and destination not in {ROOT / "site-dist", ROOT / "_site"}
    ):
        raise ValueError("Destination would replace repository sources")
    if destination.exists() and not destination.is_dir():
        raise ValueError("Destination must be a directory")
    destination.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix=".secure-t-stage-", dir=destination.parent))
    backup = None
    try:
        for name in ("index.html", "404.html", "STORY.md"):
            shutil.copy2(_source(name), stage / name)
        for name in ("campus", "ui", "conceptos"):
            # Preserve links for the subsequent validation to reject them.
            shutil.copytree(_source(name), stage / name, symlinks=True)
        for name in ("robots.txt", "sitemap.xml", "humans.txt", ".well-known", "open-data"):
            source = _source("public/" + name)
            if source.is_dir():
                shutil.copytree(source, stage / name, symlinks=True)
            else:
                shutil.copy2(source, stage / name)
        (stage / ".nojekyll").touch()
        render_public_metadata(stage)
        validate_public_files(stage)
        errors = validate_local_html(stage)
        if errors:
            raise RuntimeError("Broken publication references:\n" + "\n".join(errors))
        files = [path for path in stage.rglob("*") if path.is_file()]
        count, size = len(files), sum(path.stat().st_size for path in files)
        if destination.exists():
            backup = Path(tempfile.mkdtemp(prefix=".secure-t-previous-", dir=destination.parent))
            backup.rmdir()
            destination.rename(backup)
        try:
            stage.rename(destination)
        except OSError:
            if backup is not None:
                backup.rename(destination)
            raise
        if backup is not None:
            shutil.rmtree(backup)
        return count, size
    finally:
        if stage.exists():
            shutil.rmtree(stage)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--destination", type=Path, default=DEFAULT_DESTINATION)
    args = parser.parse_args()
    count, size = build_site(args.destination)
    print(f"Static campus built: {count} files, {size:,} bytes in {args.destination}")


if __name__ == "__main__":
    main()
