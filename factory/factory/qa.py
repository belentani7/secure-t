from collections import Counter


def validate_course(course, files) -> list[str]:
    errs = []
    for m in course.modules:
        for les in m.lessons:
            if not all([les.title.es, les.title.en, les.title.pt]):
                errs.append(f"{les.id}: i18n incompleto")
            if les.type == "QUIZ" and len(les.quiz) < 3:
                errs.append(f"{les.id}: quiz corto")
            dist = Counter(q.answer for q in les.quiz)
            if dist and max(dist.values()) / sum(dist.values()) > 0.6:
                errs.append(f"{les.id}: sesgo de respuesta")
    for f in files:
        if not f.exists() or f.stat().st_size == 0:
            errs.append(f"falta {f}")
    return errs


def assert_qa(errs):
    if errs:
        raise SystemExit("QA:\n" + "\n".join(errs))
    print("QA OK: trilingüe, psicometría balanceada, assets íntegros")
