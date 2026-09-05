# DRIVE → EDUCATION EXTRACTION MATRIX

This is the deep-processing specification for converting the available source corpus into educational modules across the ecosystem.

## Extraction passes

### PASS 01 · Discovery
- Enumerate every accessible document/resource.
- Capture filename, source type, URL, date, language and provenance.
- Identify embedded URLs, especially YouTube/video resources.
- Detect duplicated files and repeated research dumps.

### PASS 02 · Semantic decomposition
For every meaningful source extract:
- claims and definitions
- concepts
- frameworks
- procedures
- examples/case studies
- named tools/platforms
- references
- prerequisites
- potential exercises
- potential assessment questions
- target learner profiles

### PASS 03 · Curriculum mapping
Map each knowledge unit to one or more domains:
- AI foundations
- Generative AI
- AI agents
- cybersecurity
- privacy and digital safety
- systems architecture
- programming/technical literacy
- UX/UI
- HCI
- accessibility
- research methods
- design systems
- visual/motion identity
- language learning
- NLP/language technology
- digital literacy
- employability
- responsible/ethical technology

### PASS 04 · Pedagogical enrichment
Transform knowledge into:
- micro-lessons
- full lessons
- modules
- learning paths
- glossaries
- worked examples
- labs
- challenges
- quizzes
- flashcards
- projects
- capstones
- instructor notes
- learner notes
- assessment rubrics

### PASS 05 · Video enrichment
For each video URL:
- preserve canonical URL
- never download the video
- identify title/provider/topic
- infer or record level only when supported
- create learning objectives
- provide pre-viewing context
- provide active-viewing questions
- provide post-viewing synthesis
- create practical exercise
- create knowledge check
- connect to related lessons

### PASS 06 · Cross-ecosystem routing
A knowledge unit can have multiple destinations.

**SECURE T**
Security fundamentals → threat awareness → privacy → defensive practice → secure development → AI security.

**MANOS ABIERTAS**
Digital literacy → practical technology → AI literacy → employability → access to education.

**LINGUA ABERTA**
Language foundations → communication → multilingual learning → learning resources → language practice.

**LINGUAFORGE**
NLP → language models → translation → speech/text → AI-assisted language learning → language tooling.

**UX ACADEMY**
UX foundations → user research → information architecture → interaction design → UI → accessibility → design systems → AI product design.

### PASS 07 · Quality and provenance
Every generated module must retain:
- source references
- confidence level
- date checked
- rights/licensing note
- distinction between source material and generated pedagogy
- update priority

## Priority scoring

`priority = relevance × educational_value × authority × reusability × freshness`

High-scoring sources should become structured curriculum first. Low-confidence or low-authority material remains a reference, not a factual foundation.

## Output hierarchy

`knowledge-core/`
→ `sources/`
→ `concepts/`
→ `lessons/`
→ `modules/`
→ `learning-paths/`
→ `assessments/`
→ `video-classes/`
→ `projects/`
→ `cross-repo-maps/`
→ `provenance/`

## Anti-duplication rule

Do not create five independent copies of the same educational source. Maintain a canonical knowledge record and generate destination-specific views.
