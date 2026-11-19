# Tasks: TaskForge MVP

**Input**: Design documents in `/specs/001-taskforge-mvp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: Vitest unit tests for pure logic are included (plan.md, constitution principle IV).

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: user story label (US1–US5)

## Phase 1: Setup

- [X] T001 Add Vitest as a devDependency and a `"test": "vitest run"` script in `package.json`, then run `npm install`
- [X] T002 [P] Replace the starter placeholder in `index.html` (keep `lang="es"`, `#app` and the module script) with a `<title>` of TaskForge
- [X] T003 [P] Rewrite `README.md` with setup instructions (`npm install`, `npm run dev`, `npm run build`, `npm test`), feature overview and the `localStorage` note (RNF-03)

## Phase 2: Foundational (blocks all user stories)

- [X] T004 Create `src/tasks.js` exporting pure functions: `validateTitle(title)` (trim; valid only if 3–80 characters), `createTask(title, description)` (fields `id`, `title`, `description`, `status: "pending"`, `createdAt`; ids via `crypto.randomUUID()` with fallback), `toggleTask(tasks, id)`, `removeTask(tasks, id)`, `filterTasks(tasks, filter)` (`all`|`pending`|`completed`, creation order, oldest first), `computeProgress(tasks)` (`Math.round(completed/total*100)`, `0` when empty)
- [X] T005 [P] Create `src/storage.js` exporting `loadTasks()` and `saveTasks(tasks)` using the key `taskforge.tasks.v1`; `loadTasks` MUST return `[]` for missing, invalid JSON or non-array data and drop entries not matching the Task shape (id string, title string, status `pending`|`completed`)
- [X] T006 Create the page skeleton in `src/ui.js` exporting `initUI(root)` that renders the form (labelled title input `data-testid="task-title"`, labelled textarea `task-description`, submit button `task-submit`), filter buttons (`filter-all`, `filter-pending`, `filter-completed`, `aria-pressed`), progress element `progress-value`, an `role="alert"` error element, an empty-state message element and a `<ul>` list; wire `src/main.js` to load tasks and call `initUI`
- [X] T007 [P] Replace `src/style.css` with base layout styles, a visible `:focus-visible` outline and readable contrast (RNF-01)

**Checkpoint**: app renders the skeleton and `npm run build` passes.

## Phase 3: User Story 1 - Create and see tasks (P1) 🎯 MVP

**Goal**: add validated tasks and see them listed as Pending.
**Independent Test**: empty submit shows error and creates nothing; `Preparar examen` appears as Pending.

- [X] T008 [P] [US1] Write unit tests in `tests/tasks.test.js` for `validateTitle`/`createTask`: lengths 2 and 81 rejected, 3 and 80 accepted, whitespace-only rejected, title trimmed, new task `pending`, duplicate titles allowed
- [X] T009 [US1] In `src/ui.js`, handle form submit: validate with `validateTitle`, on failure show a comprehensible message in the `role="alert"` element linked via `aria-describedby` and create nothing; on success add task, clear both fields and focus `task-title`
- [X] T010 [US1] In `src/ui.js`, render each task as `<li data-testid="task-item">` with title, description only when non-empty and a textual status ("Pendiente"/"Completada") using `textContent` (never `innerHTML` for user input), oldest first
- [X] T011 [US1] In `src/ui.js`, show the empty-state message when the visible list is empty

**Checkpoint**: US1 works independently.

## Phase 4: User Story 3 - Persistence (P1)

**Goal**: tasks survive reloads.
**Independent Test**: create a task, reload, task and status remain.

- [X] T012 [P] [US3] Add tests in `tests/tasks.test.js` for `src/storage.js`: round-trip save/load, corrupted JSON returns `[]`, non-array returns `[]`, invalid entries dropped (use a stubbed `localStorage`)
- [X] T013 [US3] In `src/main.js`/`src/ui.js`, load tasks with `loadTasks()` on start and call `saveTasks()` after every creation, toggle and deletion

## Phase 5: User Story 2 - Complete, reopen and progress (P1)

**Goal**: toggle status and show progress.
**Independent Test**: two tasks, complete one → `50%`; reopen → `0%`; empty → `0%`.

- [X] T014 [P] [US2] Add tests in `tests/tasks.test.js` for `toggleTask` (content preserved, round-trip) and `computeProgress` (0 tasks → 0, 1/2 → 50, 1/3 → 33, 2/3 → 67)
- [X] T015 [US2] In `src/ui.js`, add a `data-testid="task-toggle"` button inside each `task-item` (label "Completar"/"Reabrir") that toggles status, saves and re-renders
- [X] T016 [US2] In `src/ui.js`, render `computeProgress` over ALL tasks (not the filtered view) as `NN%` in `progress-value`, updated after every change

## Phase 6: User Story 4 - Delete with confirmation (P2)

**Goal**: delete only after confirmation.
**Independent Test**: cancel keeps the task; confirm removes it.

- [X] T017 [P] [US4] Add tests in `tests/tasks.test.js` for `removeTask` (removes only the target id, others untouched)
- [X] T018 [US4] In `src/ui.js`, add a `data-testid="task-delete"` button inside each `task-item` that calls `window.confirm`; only on confirmation remove, save and re-render (cancel changes nothing)

## Phase 7: User Story 5 - Filter by status (P2)

**Goal**: filter All/Pending/Completed without altering data or progress.
**Independent Test**: Pendientes shows only pending; Todas shows all; progress unchanged.

- [X] T019 [P] [US5] Add tests in `tests/tasks.test.js` for `filterTasks` (each filter, order preserved, input not mutated)
- [X] T020 [US5] In `src/ui.js`, keep the active filter in memory, update `aria-pressed` on `filter-all`/`filter-pending`/`filter-completed`, render `filterTasks` results and show an empty message when a filter matches nothing

## Phase 8: Polish & Cross-Cutting

- [X] T021 [P] Style task status so it is not conveyed by color alone and the active filter is distinguishable beyond color, in `src/style.css`
- [X] T022 Verify every `data-testid` in `specs/001-taskforge-mvp/contracts/ui-contract.md` exists in the rendered DOM
- [X] T023 Run `npm test` and `npm run build`; fix any failures
- [ ] T024 Execute the manual walkthrough in `specs/001-taskforge-mvp/quickstart.md` (including keyboard-only use and corrupted-storage reload)

## Dependencies & Order

- Phase 1 → Phase 2 → user stories → Polish.
- US1 (T008–T011) first (MVP); US3 depends on US1 tasks existing; US2, US4, US5 depend on the list rendering from US1 and are independent of each other.
- Tests T008, T012, T014, T017, T019 all edit `tests/tasks.test.js`; [P] means independent of implementation, but apply them sequentially to that file.
- All `src/ui.js` tasks are sequential.

## Parallel Examples

- Setup: T002 and T003 together.
- Foundational: T005 and T007 alongside T004.
- Test-writing tasks can proceed while a different story's `src/ui.js` work is in progress.

## Implementation Strategy

1. MVP: Phases 1–3 (+ US3 persistence, since PRD requires it) → validate.
2. Add US2, then US4, then US5, validating each independently.
3. Finish with Polish and the quickstart walkthrough.
