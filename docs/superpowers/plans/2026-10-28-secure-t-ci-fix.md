# secure-t: fix CI test failures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (Native). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the secure-t CI `node --test` suite fully pass on this machine by fixing two defects found in the forensic audit: a broken regex literal in `credential-v2.test.mjs` and an overly narrow offline fallback in `campus/sw.js` that breaks `service-worker.test.mjs`.

**Architecture:** Minimal, surgical edits only. No new features, no restructuring. Task 1 fixes a test-file regex syntax error. Task 2 widens the service-worker offline navigate fallback so any unvisited offline navigation returns the cached campus index (SPA app-shell behavior), which is both what the test asserts and correct behavior for a single-page campus.

**Tech Stack:** Node.js v26.9.0 (`node:test`), Express TS server (`index.ts`), service worker (`campus/sw.js`), vitest (`client/`). Python/pytest is NOT installed on this host (blocked for CI; documented below).

**Spec:** Forensic audit findings captured in this session (working tree diff + `node --test` output). No external spec document.

**Global Constraints:**
- Do NOT commit/push/PR (user did not explicitly request it; AGENTS.md rule).
- Do not introduce secrets or credentials.
- Keep changes minimal; one clear responsibility per edited file.
- `pnpm run typecheck` and `pnpm run test` must remain green.
- Python/pytest suite cannot run here (no Python); document exact CI command.

## Review Focus
1. **Regex escape in test literal** — `/secure-t\\/v2/` is invalid in Node v26 (`\\/` is rejected; `\/` is correct). Expected: literal compiles and matches `secure-t/v2`.
2. **Service-worker offline navigate fallback** — only exact home path falls back to cached `index.html`; arbitrary offline navigate returns `Response.error()`. Expected: any offline navigate not in cache returns cached campus index (app shell), while non-navigate missing assets still error.

---

### Task 1: Fix invalid regex literal in credential-v2.test.mjs

**Files:**
- Modify: `tests/credential-v2.test.mjs:12-14`
- Test: `tests/credential-v2.test.mjs`

**Interfaces:**
- Consumes: none (standalone test file).
- Produces: test file with a valid regex literal that compiles under Node v26.

- [ ] **Step 1: Write the failing test (already exists)** — `credential-v2.test.mjs:13` asserts `assert.match(html, /secure-t\/v2/)`. Current literal `/secure-t\\/v2/` throws `SyntaxError: Invalid regular expression flags` before any assertion runs.

- [ ] **Step 2: Run test to verify it fails** — `node --test tests/credential-v2.test.mjs`. Expected: FAIL with SyntaxError on line 13.

- [ ] **Step 3: Implement fix** — Replace `/secure-t\\/v2/` with `/secure-t\/v2/` and `/secure-t\\/v1/` with `/secure-t\/v1/` (single backslash escape, valid regex literal).

- [ ] **Step 4: Run test to verify it passes** — `node --test tests/credential-v2.test.mjs`. Expected: all 6 tests PASS, exit 0.

- [ ] **Step 5: Commit** — Skip (user did not request commit).

---

### Task 2: Widen service-worker offline navigate fallback to cached campus index

**Files:**
- Modify: `campus/sw.js` (fetch event handler, navigate branch)
- Test: `tests/service-worker.test.mjs:68-72`

**Interfaces:**
- Consumes: `caches.open(CACHE)`, `cache.match(campusHome.href)`, SCOPE from `self.registration.scope`.
- Produces: for any `navigate` request that misses cache and is not a directory index, returns cached `index.html` when available, else `Response.error()`.

- [ ] **Step 1: Write the failing test (already exists)** — `service-worker.test.mjs:68` "offline navigation can fall back to the cached campus index": offline, cached only `index.html`, request `unvisited.html` navigate → expects `'Campus index'`. Current SW returns `''`/error because fallback only matches exact home path.

- [ ] **Step 2: Run test to verify it fails** — `node --test tests/service-worker.test.mjs`. Expected: FAIL `'' !== 'Campus index'` at line 71.

- [ ] **Step 3: Implement fix** — In `campus/sw.js` fetch handler, after the directory-index check, change the navigate fallback condition from matching only home path to matching any `navigate` mode request: if `cached` miss and `mode === 'navigate'`, try `cache.match(campusHome.href)`; return index if found, else `Response.error()`. Non-navigate missing assets still hit `Response.error()` (preserves test at line 61-66).

- [ ] **Step 4: Run test to verify it passes** — `node --test tests/service-worker.test.mjs`. Expected: all 6 tests PASS, exit 0.

- [ ] **Step 5: Commit** — Skip (user did not request commit).

---

### Task 3: Full verification pass

**Files:** none
- Test: full `node --test` CI subset + `pnpm run typecheck` + `pnpm run test` (vitest) + `pnpm run build`

**Interfaces:** none

- [ ] **Step 1: Run verification** — `node --test tests/service-worker.test.mjs tests/credential-v2.test.mjs tests/soc-tabletop.test.mjs tests/threat-studio.test.mjs`; `pnpm run typecheck`; `pnpm run test`; `pnpm run build`. Expected: all green.
- [ ] **Step 2: Document Python/pytest block** — Python is not installed on this host; `python3 -m pytest -q tests/` cannot run here. Exact CI command documented for CI: `python3 -m pytest -q tests/`.
- [ ] **Step 3: Commit** — Skip (user did not request commit).

## Proportion check
Plan is ~200 lines for ~2 real code edits (2 lines changed total). Acceptable; no transcripts, no TBD.

---

**Native execution recommended:** 2 tasks with trivial interfaces, no cross-task dependencies beyond the working tree, low cost of a shipped mistake (test files + SW fallback only). I will implement directly in this session and report evidence.
