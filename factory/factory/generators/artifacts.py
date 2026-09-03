"""Artifacts: flashcards Anki TSV, cheat-sheet PDF, diagrama mermaid."""
from fpdf import FPDF


def gen_flashcards(course, out):
    rows = []
    for m in course.modules:
        for les in m.lessons:
            for b in les.bullets:
                rows.append(f"{les.title['es']}\t{b['es']}\t{b['en']}\t{b['pt']}")
    (out / f"{course.slug}_anki.tsv").write_text("\n".join(rows), encoding="utf-8")


def gen_cheatsheet(course, out):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(14, 32, 53)
    pdf.cell(0, 12, f"SECURE T - {course.title['es']}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(20, 20, 20)
    for m in course.modules:
        pdf.set_font("Helvetica", "B", 13)
        pdf.cell(0, 10, m.title["es"], new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 10)
        for les in m.lessons:
            for b in les.bullets[:2]:
                pdf.multi_cell(0, 5, f"- {b['es']}")
    pdf.output(str(out / f"{course.slug}_cheatsheet.pdf"))


def gen_diagram(course, out):
    lines = ["graph TD"]
    for m in course.modules:
        for les in m.lessons:
            lines.append(f'  {m.id}["{m.title["es"]}"] --> {les.id}["{les.title["es"]}"]')
    (out / f"{course.slug}.mmd").write_text("\n".join(lines), encoding="utf-8")
