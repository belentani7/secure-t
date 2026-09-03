"""Quizzes + exámenes con psicometría (muestreo estratificado + semilla por versión)."""
import random

from ..i18n import translate
from ..llm import llm
from ..schema import Question


def gen_quiz(lesson_id: str, title_trilang: dict, n=5) -> list[Question]:
    raw = llm(
        f"Crea {n} preguntas sobre: {title_trilang['es']}. "
        "Mezcla basico/medio/avanzado. 4 opciones, 1 correcta, explicación breve. "
        'JSON: [{"q":str,"options":[str x4],"answer":int,"explain":str,"difficulty":str}]',
        json_mode=True,
    )
    return [
        Question(
            q=translate(r["q"]), options=[translate(o) for o in r["options"]],
            answer=r["answer"], explain=translate(r["explain"]), difficulty=r["difficulty"],
        )
        for r in raw
    ]


def gen_exam(course, bank: list[Question], version="A", minutes=45):
    rng = random.Random(f"{course.slug}-{version}")
    by = {"basico": [], "medio": [], "avanzado": []}
    for q in bank:
        by[q.difficulty].append(q)
    pick = [
        rng.sample(by["basico"], min(10, len(by["basico"]))),
        rng.sample(by["medio"], min(8, len(by["medio"]))),
        rng.sample(by["avanzado"], min(5, len(by["avanzado"]))),
    ]
    exam = [q for grp in pick for q in grp]
    rng.shuffle(exam)
    return {"course": course.slug, "version": version, "minutes": minutes, "questions": exam, "pass_score": 70}
