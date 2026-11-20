---
phase: 02-complete-filter-progress
plan: 02
subsystem: domain-ui
tags: [filter, progress, a11y, focus]
requires: [02-01]
provides: [filterTasks, progressPercent, filter bar, progress block, filter-specific empty state]
affects: [phase 3 a11y/contract]
tech-stack:
  added: []
  patterns: [pure domain functions, in-memory UI state, textContent-only rendering]
key-files:
  created: [src/domain/stats.js, tests/stats.test.js, src/ui/filterBar.js, src/ui/progress.js]
  modified: [src/ui/taskList.js, src/main.js, src/style.css, tests/smoke.test.js]
decisions:
  - "Filter is in-memory only (never persisted); progress always computed from the full list; Math.round for percentage"
requirements-completed: [FILT-01, PROG-01, PROG-02]
metrics:
  completed: 2026-11-16
  tasks: 3
  files: 8
---

# Phase 2 Plan 02: Filter & Progress Summary

Filter bar (Todas/Pendientes/Completadas, aria-pressed plus "✓" marker and underline) and a progress percentage over all tasks, backed by pure `filterTasks`/`progressPercent`.

## Commits

- 1f5936c test(02-02): failing tests for filterTasks/progressPercent
- 678157b feat(02-02): implement filterTasks and progressPercent
- b51d004 feat(02-02): filter bar, progress block, filter-specific empty state
- 087ba6b test(02-02): extend smoke tests

## Deviations from Plan

**1. [Process] RED gate not truly verified.** The RED test run was issued in parallel with creating `src/domain/stats.js`, so the 5 tests passed instead of failing. The test commit still precedes the implementation commit, but the RED failure was not observed. Tests are valid (they cover all required cases); flagged for TDD Gate Compliance.

**2. Focus fallback wired (from 02-01 note).** `main.js` passes `getFallbackFocus: () => filterBar.getButton(activeFilter)`, so focus goes to the active filter button when a toggle removes the item from the filtered list. Asserted statically in smoke tests; not browser-tested.

## Verification

`npm test`: 31/31 pass. `npm run build`: OK. Manual browser checks (percentages, filter empty messages, reload resets filter to Todas) deferred to end-of-phase UAT.

## Known Stubs

None.

## Self-Check: PASSED
