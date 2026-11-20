---
phase: 03-delete-with-confirmation
plan: 02
subsystem: ui
tags: [focus, dialog, css, smoke-tests]
requires: [03-01]
provides: [post-delete focus management, dialog styling, delete contract smoke tests]
affects: [04 a11y/contract/docs]
tech-stack:
  added: []
  patterns: [getFallbackFocus-style container fallback, dataset id comparison, regex-guarded confirm branch]
key-files:
  created: []
  modified: [src/main.js, src/style.css, tests/smoke.test.js]
decisions:
  - "Post-delete focus: next visible task's task-delete, else list container (tabindex=-1), mirroring the Phase 2 getFallbackFocus fallback idea"
requirements-completed: [DEL-01, DEL-02]
metrics:
  completed: 2026-11-16
  tasks: 3
  files: 3
---

# Phase 3 Plan 02: Delete Focus, Styling and Contract Tests Summary

After a confirmed delete, focus moves to the next visible task's Eliminar button or to the list container. The dialog and delete button are styled. Smoke tests lock the delete contract.

## What was built

- `src/main.js`: `confirmAndDelete` computes the next visible task id before deleting. `focusAfterDelete(nextId)` reuses the Phase 2 `getFallbackFocus` fallback approach (stable focus target when the natural one is gone). It matches `li.dataset.taskId` by iteration, with no selector interpolation (T-03-05). If no next task exists, it sets `tabindex=-1` on the list container and focuses it. Cancel/Esc focus is still handled in `confirmDialog.js`.
- `src/style.css`: `.task-delete`, `dialog`, `dialog::backdrop`, and a flex action row (`.confirm-dialog-actions`). It also has a small-screen width rule. `:focus-visible` is untouched and there are no remote assets.
- `tests/smoke.test.js`: 6 new tests.
  - The three test ids exist.
  - `showModal` is used, and there is no `window.confirm`, `alert` or `confirm(` in src.
  - `deleteTask(` appears exactly once in main.js. A regex ties it to `.open(...).then(ok => { if (ok) { store.deleteTask(` and it must come after `.open(`.
  - taskList never deletes or persists.
  - The dialog message is set through `textContent`.
  - Focus lookup uses `dataset.taskId ===` with no interpolated selectors.

## Commits

- 3c7e024 feat(03-02): move focus to next task-delete or list container after confirmed delete
- d27674f feat(03-02): style confirm dialog, backdrop and task-delete button
- 7b8066e test(03-02): lock delete contract in smoke tests

## Verification

`npm test`: 42 pass, 0 fail. `npm run build`: OK. Browser UAT (keyboard Tab/Enter/Esc, focus after confirm) is still pending, as D-07 specifies.

## Deviations from Plan

- The plan's Task 3 is marked `tdd="true"`, but the tests are guards over code that already exists from plan 01. They passed on first run, so there was no RED phase. Only a `test(...)` commit exists.
- The checker warnings were applied. `getFallbackFocus` is named explicitly in the code comment, and the confirm-gated regex is stronger than the plan's `.then(` / `deleteTask(` check.

## Known Stubs

None.

## Self-Check: PASSED
