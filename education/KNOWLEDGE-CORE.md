# SECURE T · EDUCATION KNOWLEDGE CORE

> Shared curriculum intelligence layer for the Belentani educational ecosystem.

## Purpose

This layer converts heterogeneous source material into reusable educational knowledge without duplicating the same source across projects.

### Pipeline

`SOURCE → INVENTORY → RIGHTS/PROVENANCE → DEDUPLICATE → NORMALIZE → CLASSIFY → LEARNING OBJECTIVES → LESSON → ACTIVITY → ASSESSMENT → CROSS-REPO DISTRIBUTION`

## Target ecosystems

| Domain | Primary destination |
|---|---|
| Cybersecurity, security awareness, secure computing | SECURE T |
| Digital literacy, access, employability, general education | Manos Abiertas |
| Languages, language learning and multilingual resources | Lingua Aberta |
| Language technology, AI + language, NLP | LinguaForge |
| UX/UI, HCI, research, accessibility, product design | UX Academy |
| AI literacy, generative AI, responsible AI | Cross-ecosystem |

## Video policy

Videos are **external learning resources**. Do not download or mirror them. Store the canonical URL plus title, provider, duration when known, language, level, topics, learning objectives, prerequisites, transcript/summary only when legally/technically available, discussion questions, practical task, assessment and provenance.

## Knowledge record

Each source should be representable as:

- `source_id`
- `canonical_url`
- `title`
- `source_type`
- `provider`
- `language`
- `topics[]`
- `competencies[]`
- `level`
- `audience[]`
- `learning_objectives[]`
- `prerequisites[]`
- `lesson_outline[]`
- `activities[]`
- `assessment[]`
- `projects[]`
- `related_sources[]`
- `destinations[]`
- `license_or_rights_status`
- `provenance`
- `quality_score`

## Quality gates

1. Never invent source facts.
2. Preserve canonical links.
3. Separate source-derived knowledge from generated pedagogy.
4. Flag uncertain, outdated or inaccessible resources.
5. Prefer primary/authoritative sources where possible.
6. Detect duplicate and near-duplicate resources.
7. Avoid redistributing copyrighted files when a link is sufficient.
8. Make lessons accessible and multilingual where useful.

## Educational transformation

A source is not considered processed merely because it has been catalogued. The target output is a learner-facing unit containing context, measurable outcomes, concepts, guided study, practice, assessment and evidence of mastery.

## Cross-repository strategy

Maintain one conceptual source of truth. Repositories consume domain-specific projections rather than independent copies. A resource can therefore feed multiple curricula while retaining one provenance record.
