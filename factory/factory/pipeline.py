"""Pipeline: blueprint → course → assets → QA → manifest. Escalas smoke/medium/giga."""
import json
import pathlib
import re

from .config import S
from .generators import artifacts, curriculum
from .generators.simulations import SIMS, gen_sim
from .qa import assert_qa, validate_course
from .storage import record, stats

SCALES = {"smoke": (1, 4), "medium": (4, 4), "giga": (12, 4)}
# Slug seguro: sin separadores de ruta ni "..", evita path traversal al escribir en OUT_DIR.
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")


def run(programs: list[str], scale: str):
    n_mod, n_les = SCALES[scale]
    out = pathlib.Path(S.OUT_DIR)
    out.mkdir(parents=True, exist_ok=True)
    for name in programs:
        course = curriculum.gen_program(name, n_mod, n_les)
        if not SLUG_RE.match(course.slug):
            raise ValueError(f"invalid course slug: {course.slug!r}")
        cdir = out / course.slug
        cdir.mkdir(parents=True, exist_ok=True)
        (cdir / "course.json").write_text(course.model_dump_json(indent=1), encoding="utf-8")
        artifacts.gen_flashcards(course, cdir)
        artifacts.gen_cheatsheet(course, cdir)
        artifacts.gen_diagram(course, cdir)
        for i, kind in enumerate(SIMS):
            gen_sim(kind, f"{course.slug}-{i}", cdir / f"sim-{kind}")
        files = [cdir / "course.json", cdir / f"{course.slug}_anki.tsv",
                 cdir / f"{course.slug}_cheatsheet.pdf", cdir / f"{course.slug}.mmd"]
        assert_qa(validate_course(course, files))
        for f in files:
            if f.exists():
                record("content", f, program=course.slug, scale=scale)
    stats()


def stats_cmd():
    stats()
