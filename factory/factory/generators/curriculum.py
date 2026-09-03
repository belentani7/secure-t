"""Curriculum: blueprint YAML → Course (módulos × lecciones). Requiere LLM (Ollama)."""
import pathlib

import yaml

from ..i18n import translate
from ..llm import llm
from ..schema import Course, Lesson, Module, Program
from .quizzes import gen_quiz


def load_blueprint(name: str) -> dict:
    return yaml.safe_load((pathlib.Path("specs") / f"{name}.yaml").read_text(encoding="utf-8"))


def gen_course(bp: dict, n_modulos: int, lecciones: int) -> Course:
    outline = llm(
        f"Eres decano de una universidad de élite en {bp['domain']}. "
        f"Genera el curso \"{bp['nombre']}\" con {n_modulos} módulos × {lecciones} lecciones. "
        'JSON: {"modulos":[{"titulo":str,"lecciones":[{"titulo":str,"tipo":"READING|VIDEO|LAB|QUIZ"}]}]} '
        "Progresión: fundamentos → aplicación → maestría. Sin relleno.",
        json_mode=True,
    )
    modules = []
    for mi, m in enumerate(outline["modulos"]):
        lessons = []
        for li, les in enumerate(m["lecciones"]):
            lid = f"{bp['slug']}-m{mi}-l{li}"
            content = llm(
                f"Contenido académico (3 párrafos + 4 bullets) de '{les['titulo']}' ({bp['nombre']}). "
                'JSON: {"parrafos":[str], "bullets":[str]}',
                json_mode=True,
            )
            tr_title = translate(les["titulo"])
            tr_content = translate("\n\n".join(content["parrafos"]))
            tr_bullets = [translate(b) for b in content["bullets"]]
            lessons.append(
                Lesson(
                    id=lid, type=les["tipo"], title=tr_title, content=tr_content,
                    duration_min=15, bullets=tr_bullets,
                    quiz=gen_quiz(lid, tr_title) if les["tipo"] == "QUIZ" else [],
                )
            )
        modules.append(Module(id=f"{bp['slug']}-m{mi}", title=translate(m["titulo"]), lessons=lessons))
    return Course(slug=bp["slug"], title=translate(bp["nombre"]), desc=translate(bp["descripcion"]), modules=modules)


def gen_program(name: str, n_modulos: int, lecciones: int) -> Program:
    bp = load_blueprint(name)
    return Program(
        slug=bp["slug"], title=translate(bp["nombre"]),
        courses=[gen_course({**bp, "slug": f"{bp['slug']}-{i}"}, n_modulos, lecciones) for i in range(bp.get("cursos", 1))],
    )
