"""Exercise the actual publication artifact, rather than source-only links."""
import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


def builder():
    path = ROOT / "scripts/build_site.py"
    assert path.is_file(), "A shared builder must assemble the deployable campus"
    spec = importlib.util.spec_from_file_location("build_site", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_deployment_contains_complete_student_journey(tmp_path):
    module = builder()
    output = tmp_path / "site"
    module.build_site(output)
    for rel in (
        "index.html", "404.html", "conceptos/index.html", "ui/i18n.js",
        "campus/index.html", "campus/progreso.html", "campus/credencial.html",
        "campus/voces/pt/bienvenida.mp3", "sitemap.xml", "robots.txt",
    ):
        assert (output / rel).is_file(), rel
    for course in (ROOT / "campus/cursos").iterdir():
        if course.is_dir():
            assert (output / "campus/cursos" / course.name / "index.html").is_file()
    assert module.validate_local_html(output) == []
    assert not (output / "public").exists(), "Do not publish a second, stale campus"
    assert not (output / "package.json").exists()
    assert not (output / ".git").exists()


def test_builder_does_not_replace_source_or_ancestor(tmp_path):
    module = builder()
    for destination in (ROOT, ROOT / "campus", ROOT.parent, ROOT / "public"):
        with pytest.raises(ValueError):
            module.build_site(destination)


def test_builder_preserves_previous_artifact_when_validation_fails(tmp_path, monkeypatch):
    module = builder()
    output = tmp_path / "site"
    output.mkdir()
    (output / "previous.txt").write_text("last good release")
    monkeypatch.setattr(module, "validate_local_html", lambda root: ["broken link"])
    with pytest.raises(RuntimeError):
        module.build_site(output)
    assert (output / "previous.txt").read_text() == "last good release"


def test_validator_rejects_missing_and_escaping_links(tmp_path):
    module = builder()
    (tmp_path / "index.html").write_text(
        '<a href="missing.html">Missing</a><img src="../private.png">'
    )
    errors = module.validate_local_html(tmp_path)
    assert len(errors) == 2


def test_validator_resolves_url_encoded_paths(tmp_path):
    module = builder()
    (tmp_path / "lección.html").write_text("Lesson")
    (tmp_path / "index.html").write_text('<a href="lecci%C3%B3n.html#title">Read</a>')
    assert module.validate_local_html(tmp_path) == []


def test_private_paths_inside_public_trees_are_rejected(tmp_path):
    module = builder()
    (tmp_path / ".env.production").write_text("synthetic secret fixture")
    with pytest.raises(RuntimeError, match="private"):
        module.validate_public_files(tmp_path)


@pytest.mark.parametrize("name", ["index.html", "campus"])
def test_source_symlinks_cannot_publish_external_files(tmp_path, monkeypatch, name):
    module = builder()
    source = tmp_path / "source"
    source.mkdir()
    for filename in ("index.html", "404.html", "STORY.md"):
        (source / filename).write_text("public fixture")
    private = tmp_path / "private"
    if name == "campus":
        private.mkdir()
        (private / "index.html").write_text("private fixture")
    else:
        private.write_text("private fixture")
        (source / name).unlink()
    try:
        (source / name).symlink_to(private, target_is_directory=name == "campus")
    except OSError as exc:
        # Windows without Developer Mode cannot create symlinks. The
        # security behavior is still exercised by Linux CI.
        if getattr(exc, "winerror", None) == 1314:
            pytest.skip("Windows symlink privilege unavailable")
        raise
    monkeypatch.setattr(module, "ROOT", source)
    with pytest.raises(RuntimeError, match="symlink"):
        module.build_site(tmp_path / "output")


@pytest.mark.parametrize("content", [
    "-----BEGIN OPENSSH PRIVATE KEY-----\\nsynthetic test fixture",
    "sk-" + "x" * 30,
])
def test_extensionless_credentials_are_rejected(tmp_path, content):
    module = builder()
    (tmp_path / "id_rsa").write_text(content)
    with pytest.raises(RuntimeError, match="secret"):
        module.validate_public_files(tmp_path)


def test_security_reference_urls_are_not_treated_as_tokens(tmp_path):
    module = builder()
    (tmp_path / "references.md").write_text(
        "https://www.nist.gov/itl/ai-risk-management-framework"
    )
    module.validate_public_files(tmp_path)


def test_generated_metadata_has_resolved_urls(tmp_path, monkeypatch):
    module = builder()
    monkeypatch.setenv("SITE_URL", "https://learn.example.test/secure-t")
    output = tmp_path / "site"
    module.build_site(output)
    expected = "https://learn.example.test/secure-t"
    robots = (output / "robots.txt").read_text(encoding="utf-8")
    sitemap = (output / "sitemap.xml").read_text(encoding="utf-8")
    landing = (output / "index.html").read_text(encoding="utf-8")
    assert "__BASE_URL__" not in robots + sitemap
    assert "Sitemap: " + expected + "/sitemap.xml" in robots
    assert "<loc>" + expected + "/campus/</loc>" in sitemap
    assert 'rel="canonical" href="' + expected + '/"' in landing
    assert 'property="og:url" content="' + expected + '/"' in landing


def test_vercel_production_domain_sets_metadata(tmp_path, monkeypatch):
    module = builder()
    monkeypatch.delenv("SITE_URL", raising=False)
    monkeypatch.setenv("VERCEL_PROJECT_PRODUCTION_URL", "secure-t.vercel.app")
    output = tmp_path / "site"
    module.build_site(output)
    assert "https://secure-t.vercel.app/sitemap.xml" in (output / "robots.txt").read_text(encoding="utf-8")
    assert '<loc>https://secure-t.vercel.app/campus/</loc>' in (output / "sitemap.xml").read_text(encoding="utf-8")
    assert 'rel="canonical" href="https://secure-t.vercel.app/"' in (output / "index.html").read_text(encoding="utf-8")


def test_explicit_site_url_overrides_vercel_domain(monkeypatch):
    module = builder()
    monkeypatch.setenv("SITE_URL", "https://belentani7.github.io/secure-t/")
    monkeypatch.setenv("VERCEL_PROJECT_PRODUCTION_URL", "secure-t.vercel.app")
    assert module.public_site_url() == "https://belentani7.github.io/secure-t"


def test_bad_vercel_production_domain_is_rejected(monkeypatch):
    module = builder()
    monkeypatch.delenv("SITE_URL", raising=False)
    monkeypatch.setenv("VERCEL_PROJECT_PRODUCTION_URL", "bad.example.test/../private")
    with pytest.raises(ValueError, match="SITE_URL"):
        module.public_site_url()


@pytest.mark.parametrize("site_url", [
    'https://example.test/"><script>alert(1)</script>',
    "https://example.test/a b",
    "https://example.test/a\\\\b",
    "http://insecure.example.test",
    "https://username:password@example.test",
    "https://example.test/#fragment",
    "https://example.test/../secret",
])
def test_invalid_public_site_url_is_rejected(monkeypatch, site_url):
    module = builder()
    monkeypatch.setenv("SITE_URL", site_url)
    with pytest.raises(ValueError, match="SITE_URL"):
        module.public_site_url()


def test_credentials_are_only_local_integrity_not_institutional_claims():
    page = (ROOT / "campus" / "credencial.html").read_text(encoding="utf-8")
    assert "const subject = await sha256(t)" in page
    assert "const block = {v: 2" in page
    assert "canonico(block.curso, block.sujeto, block.evidencia, block.fecha)" in page
    assert 'token: t.slice' not in page
    assert "NO acredita emisor, identidad ni aprendizaje." in page


def test_legacy_remote_securetea_docker_is_not_used():
    docker = (ROOT / "Dockerfile").read_text(encoding="utf-8")
    railway = (ROOT / "railway.json").read_text(encoding="utf-8")
    assert "node:22-" in docker
    assert "USER node" in docker
    assert "--frozen-lockfile" in docker
    assert "SecureTea-Project" not in docker
    assert "code-server" not in docker
    assert "node dist/index.js" not in railway
    assert "index.ts" in railway


def test_optional_demo_services_are_loopback_only():
    compose = (ROOT / "docker-compose.yml").read_text(encoding="utf-8")
    # The deployed campus needs neither PostgreSQL nor MinIO; the optional
    # local demo may not expose its ports on every network interface.
    assert '"127.0.0.1:3000:3000"' in compose
    assert '"127.0.0.1:5173:5173"' in compose
    assert '"3000:3000"' not in compose
    assert '"5173:5173"' not in compose
    assert "http://127.0.0.1:3000/api/health" in compose


def test_404_recovery_has_real_links_and_a_project_safe_base():
    source = (ROOT / "404.html").read_text(encoding="utf-8")
    assert "<main" in source
    assert 'href="#"' not in source
    assert 'href="./" id="ir-inicio"' in source
    assert 'href="./campus/" id="ir-campus"' in source
    assert 'secure-t|secure-t-university' in source
    assert 'location.pathname.split("/")' in source


def test_campus_legacy_redirect_is_complete_html_with_a_clickable_fallback():
    source = (ROOT / "campus.html").read_text(encoding="utf-8")
    assert source.startswith("<!doctype html>")
    assert '<html lang="es">' in source
    assert '<meta name="robots" content="noindex">' in source
    assert '<meta http-equiv="refresh" content="0; url=campus/">' in source
    assert '<main>' in source
    assert '<a href="campus/">' in source
