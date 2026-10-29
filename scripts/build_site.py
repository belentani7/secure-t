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


# Verified public HTTPS canonical. Deployments may override this with SITE_URL.
DEFAULT_SITE_URL = "https://www.belentani.es/secure-t"


def public_site_url() -> str:
    """Require an explicit, safe HTTPS origin for generated public metadata."""
    # Prefer the actual production domain when Vercel builds this same campus.
    # SITE_URL remains an explicit override (e.g. for GitHub Pages or Netlify).
    configured = os.environ.get("SITE_URL")
    if configured is not None:
        value = configured.strip().rstrip("/")
    elif os.environ.get("VERCEL_PROJECT_PRODUCTION_URL"):
        host = os.environ["VERCEL_PROJECT_PRODUCTION_URL"].strip()
        value = f"https://{host}"
    else:
        value = DEFAULT_SITE_URL
    # This URL is inserted into HTML/XML metadata; never permit markup,
    # whitespace or escape characters from deployment configuration.
    if re.search(r"""[\s"'<>\\]""", value):
        raise ValueError("SITE_URL contains unsafe characters")
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
    # Canonical and Open Graph refer to the deployed site, never its Git repository.
    source = source.replace(DEFAULT_SITE_URL + "/", site_url + "/")
    for expression in (
        r'(<link rel="canonical" href=")[^"]+(")',
        r'(<meta property="og:url" content=")[^"]+(")',
    ):
        source, count = re.subn(
            expression,
            lambda match: match.group(1) + site_url + "/" + match.group(2),
            source,
            count=1,
        )
        if count != 1:
            raise RuntimeError("Missing required canonical or Open Graph URL in landing")
    landing.write_text(source, encoding="utf-8")


class _References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []
        self.base_href = None

    def handle_starttag(self, tag, attrs):
        if tag == "base":
            if self.base_href is None:
                self.base_href = dict(attrs).get("href")
            return
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
        base_dir = html.parent
        if parser.base_href:
            base_url = urlsplit(parser.base_href)
            if base_url.scheme or base_url.netloc:
                errors.append(f"external base URL: {html.relative_to(root)}")
                continue
            base_path = unquote(base_url.path)
            base_location = (root / base_path.lstrip("/") if base_path.startswith("/")
                             else html.parent / base_path).resolve()
            if not base_location.is_relative_to(root):
                errors.append(f"base URL escapes site: {html.relative_to(root)}")
                continue
            base_dir = base_location if base_path.endswith("/") else base_location.parent
        for ref in parser.paths:
            target = (root / ref.lstrip("/") if ref.startswith("/")
                      else base_dir / ref).resolve()
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


def omit_unbacked_lesson_pages(stage: Path) -> None:
    """Do not distribute generated lesson shells without the original lesson text."""
    lessons = stage / "campus/itinerarios/cursos"
    if not lessons.is_dir():
        return
    for course_dir in lessons.iterdir():
        if not course_dir.is_dir():
            continue
        source = ROOT / "campus/cursos" / course_dir.name
        for page in course_dir.glob("semana-??.html"):
            week_source = source / (page.stem + ".md")
            if not week_source.is_file():
                page.unlink()


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
        omit_unbacked_lesson_pages(stage)
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
