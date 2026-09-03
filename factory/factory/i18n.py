from .llm import llm


def translate(es_text: str) -> dict:
    """ES → {es,en,pt} en una sola llamada JSON."""
    return llm(
        "Traduce al inglés (en) y portugués brasileño (pt) este contenido educativo. "
        'Devuelve {"es": <original>, "en": ..., "pt": ...}.\n' + es_text,
        json_mode=True,
    )


def T(es, en, pt):
    return {"es": es, "en": en, "pt": pt}
