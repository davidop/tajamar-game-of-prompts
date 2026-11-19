# Implementation Plan: TaskForge MVP

**Branch**: `001-taskforge-mvp` | **Date**: 2026-11-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-taskforge-mvp/spec.md`

## Summary

Build a single-page, static task manager for students: create (validated), list, toggle,
delete-with-confirmation, filter by status, show rounded progress, and persist everything in
`localStorage`. Approach: vanilla JS ES modules on the existing Vite starter, split into small
pure logic modules (validation, progress, filtering, storage) and one render/controller module,
so the logic can be unit-tested and the UI satisfies the `data-testid` contract.

## Technical Context

**Language/Version**: JavaScript (ES modules), Node 18+ for tooling

**Primary Dependencies**: Vite 6 (existing); Vitest as a dev-only dependency for unit tests

**Storage**: Browser `localStorage`, single JSON key

**Testing**: Vitest for pure logic; manual/browser walkthrough in `quickstart.md`

**Target Platform**: Modern desktop browsers

**Project Type**: Static single-page web app

**Performance Goals**: Instant interactions for up to a few hundred tasks

**Constraints**: No backend, auth or remote APIs; `npm run build` MUST pass; keyboard accessible

**Scale/Scope**: One user, one list, one screen

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status |
|-----------|--------|
| I. Spec-driven source of truth | PASS – plan derives only from spec/PRD |
| II. Static MVP, no backend | PASS – `localStorage` only; Vitest is dev-only and justified in research.md |
| III. Testability contract | PASS – all ids mapped in `contracts/ui-contract.md` |
| IV. Verified delivery | PASS – unit tests, `npm run build`, quickstart walkthrough |
| V. Simplicity & documented decisions | PASS – decisions in research.md; no frameworks |

Post-design re-check: PASS, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-taskforge-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md             # created later by /speckit-tasks
```

### Source Code (repository root)

```text
index.html
src/
├── main.js              # bootstraps app, wires events
├── ui.js                # rendering + DOM event handling
├── tasks.js             # pure logic: validate, create, toggle, remove, filter, progress
├── storage.js           # load/save with corruption-safe parsing
└── style.css
tests/
└── tasks.test.js        # Vitest unit tests for tasks.js and storage.js
README.md                # setup instructions (RNF-03)
```

**Structure Decision**: Single project with logic separated from DOM code. No sub-packages.

## Complexity Tracking

No constitution violations; nothing to justify.
