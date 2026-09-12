# secure T platform foundation

This layer is intentionally provider-neutral. It is the contract surface for future integrations rather than a pile of vendor-specific SDK calls.

## Architecture

```text
                    SECURE T PLATFORM
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       ACADEMIC           AI              DATA
          │                │                │
          └───────────────┬┴────────────────┘
                          │
                    CORE CONTRACTS
                          │
              ┌───────────┼───────────┐
              │           │           │
          CONTENT       LABS       PROJECTS
              │           │           │
              └───────────┼───────────┘
                          │
                    AUDIT / EVENTS
```

## Content pipeline

`source → parse → provenance → learning graph → lesson/quiz/case/simulation → assessment → evidence`

No generated artifact should lose its source references.

## AI pipeline

`actor → capability check → policy → context/RAG → model/router → tool authorization → validation → response → audit`

Models are replaceable. Authorization is not delegated to the model.

## Data pipeline

`dataset → schema/profile → quality checks → query → analysis → evidence → visualization/API`

The analysis module contains no database driver, so PostgreSQL, DuckDB, Supabase, Neon or another provider can sit behind it.

## Collaboration

Project permissions are explicit and role-bound. A share operation must be validated server-side; UI controls are convenience only.

## Integration rule

Add an external provider only when it implements a platform capability. Keep vendor SDKs behind adapters. Never expose provider secrets to the browser.

## Current scope of this foundation

- typed capability/RBAC contracts
- content-to-learning graph primitives
- provider-neutral dataset profiling
- governed AI tool registry
- collaboration permission policy

The next implementation layer should wire these contracts into Express routes, Drizzle persistence, the existing AI orchestrator, and the React campus.
