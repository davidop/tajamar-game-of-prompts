---
phase: 02-complete-filter-progress
plan: 01
subsystem: state-ui
tags: [toggle, status, persistence, focus, a11y]
requires: [01-capture-persist-tasks]
provides: [toggleTask, task-toggle button, focus restoration with fallback]
affects: [02-02 filters/progress]
tech-stack:
  added: []
  patterns: [store single writer, textContent-only rendering]
key-files:
  created: [tests/store.test.js]
  modified: [src/state/store.js, src/ui/taskList.js, src/main.js, src/style.css, tests/smoke.test.js]
decisions:
  - "Focus fallback: if the toggled item leaves the rendered list, focus handlers.getFallbackFocus() (plan 02 should return the active filter button), else the list container (tabindex=-1)"
requirements-completed: [STAT-01]
metrics:
  completed: 2026-11-16
  tasks: 3
  files: 6
---

# Phase 2 Plan 01: Complete/Reopen Tasks Summary

`toggleTask(id)` in the store (persisted via the single writer) plus a per-task `task-toggle` button (Completar/Reabrir) with focus kept after re-render.

## Commits

- 3d86d1a test(02-01): failing tests for toggleTask (RED)
- eafbb01 feat(02-01): toggleTask in store (GREEN)
- 317103e feat(02-01): task-toggle button, focus restoration, wiring, CSS

## Deviations from Plan

**1. [Rule 2 - Missing critical functionality] Focus fallback (plan-checker warning)**
- When a toggle removes the item from the rendered list (relevant once plan 02 adds filters), focus would be lost. `renderTaskList` now accepts optional `handlers.getFallbackFocus()` (intended: active filter button) and otherwise focuses the list container (`tabindex="-1"`).
- Plan 02 must pass `getFallbackFocus` returning the active filter button. No filter exists in this plan, so only the container fallback is exercised here (not browser-tested).
- Files: src/ui/taskList.js, src/style.css. Commit 317103e.

Otherwise executed as written.

## Verification

`npm test`: 22/22 pass. `npm run build`: OK. Manual browser check (reload persistence, focus) deferred to end of phase.

## Known Stubs

None.

## Self-Check: PASSED
