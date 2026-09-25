# Inteligencia Artificial Aplicada y Segura — material de repaso

# Chuleta — IA Aplicada y Segura

## Prompt that works (4 pieces)
ROLE (who you are) + TASK (what you ask for) + CONTEXT (relevant data) + FORMAT (how to answer)

## Quick ML checklist
- Is the data better than the model? → 90% of the time YES
- Train/test separated? → if not, the metric is a lie
- Explainable error in 1 sentence? → if not, you didn't understand it

## LLM: what it does and what it doesn't
- DOES: summarize, transform, draft, classify text
- DOES NOT: know (predicts), calculate precisely, guarantee truth
- Rule: AI proposes → person verifies

## Prompt injection (attack)
- Vector: text inside data (web, PDF, email) with hidden instructions
- Defense: input is ALWAYS data → delimiters + no privileges + sanitize + allowlist

## OWASP LLM Top 10 (short version)
1 Injection · 2 Leaky chains · 3 Training poisoning · 4 Model DoS · 5 Leaks
6 Excessive agency · 7 Insecure plugins · 8 Excessive tokens · 9 Deception · 10 No monitoring

## Safeguards of an educational assistant
- [ ] Only responds with course material (grounding + citation)
- [ ] Refuses out of scope
- [ ] Anonymous usage log (counters, not people)
- [ ] Human validates before anything executes

*Generado por edu-forge academy. Imprímela: es lo que llevas al examen.*
