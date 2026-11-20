# Project Research Summary

**Project:** TaskForge
**Domain:** Static, localStorage-only personal task manager for students (vanilla JS + Vite + CSS)
**Researched:** 2026-11-16
**Confidence:** HIGH for scope and architecture; MEDIUM for pitfalls and test tooling

## Executive Summary

TaskForge is essentially a TodoMVC with a progress percentage and strict title validation. It has seven mandatory features (RF-01..07), a fixed `data-testid` contract used by shared acceptance tests, and basic accessibility (RNF-01). The PRD is locked, and anything outside it must not be built before all mandatory items are done. Experts build this kind of app with no framework and no runtime dependencies. They use a minimal store with subscribe, pure domain functions for validation, progress and filtering, and a defensive `localStorage` adapter.

Recommended approach: Vite 6 + vanilla ES modules + plain CSS, organised as `domain/` (pure), `state/` (store + storage) and `ui/` (one file per PRD region). Only the store persists, and it does so after every task mutation. Progress is always computed from the full task array. User text is rendered only via `textContent`. Build order follows the dependencies: logic first, then UI, then the delete dialog, then an accessibility and contract pass.

The main risks are subtle correctness and contract failures, not technology: validating the untrimmed title, crashing on corrupt storage, computing progress from the filtered list, `innerHTML` XSS, and misplaced `data-testid`s. Accessibility problems (focus loss on re-render, errors not announced, colour-only status) are the other big one. Each is prevented by the architecture above plus boundary unit tests and a final contract smoke check. The one open decision is the confirm-delete mechanism (`<dialog>` vs `window.confirm`).

## Key Findings

### Recommended Stack

Ship zero runtime dependencies. Keep the scaffold's Vite on 6.x (6.4.x) and add test tooling only if automated verification is wanted. Detail is in `STACK.md`.

**Core technologies:**
- Vanilla JavaScript (ES2022 modules): app logic and DOM rendering. PRD-mandated, and 7 features don't justify a framework.
- Vite ^6.4: dev server and build. Already in the scaffold; `npm run dev` / `npm run build` satisfy RNF-02.
- Plain CSS with custom properties: styling, `:focus-visible`, text-based status. No Tailwind or preprocessors.
- `localStorage`, wrapped in `storage.js`: the only allowed persistence, with try/catch and shape validation.
- `crypto.randomUUID()` for ids, with a `Date.now()` + counter fallback for non-secure contexts.
- Optional dev tools: Vitest for pure-logic tests and Playwright (`getByTestId`) for E2E. Not Jest, TypeScript or Cypress.

### Expected Features

**Must have (table stakes), all PRD-mandatory:**
- RF-01 Create task (title 3–80 chars after trim, optional description) with visible, accessible errors
- RF-02 List tasks with title, description and status as text
- RF-03 Complete / reopen via a single `task-toggle`
- RF-04 Delete with confirmation; cancel preserves the task
- RF-05 Filters All / Pending / Completed (view state only)
- RF-06 Persistence in `localStorage` after every mutation, tolerant of corrupt data
- RF-07 Progress `X%`, denominator = all tasks, 0% when empty
- Empty state message, full `data-testid` contract, RNF-01 accessibility, RNF-02 build, RNF-03 README

**Should have (quality of execution only, no new functionality):**
- Clear Spanish validation messages with focus returned to the field
- `aria-live` announcements for progress and errors
- Robust persistence and modular, readable code with a clear README

**Defer (v2+, or blocked until mandatory items are verified):**
- Edit task, search, priorities/tags, dates, export/import, dark mode, undo, bulk delete
- Never in scope: auth, sync/backend, in-app AI, drag-and-drop, push notifications, calendars, third-party analytics or cloud deploy

### Architecture Approach

Unidirectional flow: UI dispatches actions, the store updates state, persists if it's a task mutation, and notifies subscribers who re-render. The pure domain layer has no DOM or storage imports, which makes it unit-testable. The list is fully re-rendered with `replaceChildren`, but the form is rendered once so typed text isn't lost. Focus is restored after re-render. The filter is not persisted. Details are in `ARCHITECTURE.md`.

**Major components:**
1. `domain/` (`tasks.js`, `progress.js`): `validateTitle`, `createTask`, `filterTasks`, `computeProgress`, all pure
2. `state/storage.js`: versioned key (`taskforge.v1`), defensive `load()`/`save()`
3. `state/store.js`: single source of truth, with `addTask`, `toggleTask`, `deleteTask`, `setFilter` and `subscribe`
4. `ui/*` (`taskForm`, `taskList` with empty state, `filters`, `progress`, `confirmDelete`): DOM building and event binding
5. `main.js`: composition root, about 20 lines

### Critical Pitfalls

1. **Title validated on the raw value:** use one pure `validateTitle` that trims first, store the trimmed value, use `novalidate` and JS validation, and test boundaries ("", "  ", "ab", "  ab  ", 80, 81 chars).
2. **Corrupt or missing storage crashes the app:** wrap in try/catch, validate shape, return `[]`, write on every mutation, and test with `{bad` and `null`.
3. **Progress math:** guard against NaN on empty, use `Math.round`, and always pass the full array (never the filtered one). Test 0 → 0%, 1/3 → 33%, 2/3 → 67%.
4. **`innerHTML` with user text (stored XSS):** use only `createElement` and `textContent`; grep for `innerHTML` in review.
5. **Misplaced `data-testid`s and accessibility gaps:** `task-toggle` and `task-delete` must sit inside `task-item`. The `task-title` testid is unique to the input (rendered titles use e.g. `task-item-title`). `progress-value` contains `N%` in one element. Errors need `role="alert"`, status must be text, and focus must be managed. Add a smoke check over all required ids.

Also noted: `window.confirm` vs. test harness behaviour (see the open decision below).

## Implications for Roadmap

Based on research, suggested phase structure (5 phases, matching the architecture's build order):

### Phase 1: Domain, Storage and Store (logic foundation)
**Rationale:** Everything depends on a single state model, and persistence must exist before the UI relies on it. No UI is needed to verify it.
**Delivers:** `validateTitle`, `createTask`, `filterTasks`, `computeProgress`, a defensive `storage.js` and `store.js`. Optional Vitest boundary tests.
**Addresses:** the RF-06 foundation, plus the RF-01 validation rules and RF-07/RF-05 logic.
**Avoids:** Pitfalls 1, 2 and 3.

### Phase 2: Create and List UI (form, list, empty state, testids)
**Rationale:** The first visible slice. Doing the testid contract and safe rendering here avoids retrofitting.
**Delivers:** the task form with accessible errors, the list with status text, the empty state, and persistence across reloads.
**Addresses:** RF-01, RF-02, RF-06 (end-to-end), user stories 1, 2, 5, 7.
**Avoids:** Pitfalls 4 and 7, and starts Pitfall 6 (error announcement, focus).
**Uses:** `textContent`/`createElement`, `crypto.randomUUID()` with a fallback.

### Phase 3: Toggle, Progress and Filters
**Rationale:** Needs the list and store. Progress and filters belong together because the main risk is their interaction.
**Delivers:** `task-toggle`, `progress-value` with `aria-live`, and `filter-*` buttons with `aria-pressed`. Filter-specific empty messages. Focus restored after re-render.
**Addresses:** RF-03, RF-05, RF-07, user stories 3 and 4.
**Avoids:** Pitfall 3 and the focus-loss part of Pitfall 6.

### Phase 4: Delete with Confirmation
**Rationale:** Isolated, and it carries the one open decision.
**Delivers:** the `<dialog>` with `confirm-delete` / `cancel-delete`, initial focus on Cancel, focus return on close, and the storage and progress update after delete.
**Addresses:** RF-04, user story 6.
**Avoids:** Pitfall 5 and the modal focus issues of Pitfall 6.

### Phase 5: Accessibility, Contract Verification and Docs
**Rationale:** A final gate against the "Looks Done But Isn't" checklist.
**Delivers:** a keyboard-only run, a focus and contrast audit, a smoke check over all required testids, an XSS payload test, a corrupt-storage test, a README (rounding assumption, confirm choice, filter not persisted), and a clean `npm run build`.
**Addresses:** RNF-01, RNF-02, RNF-03.
**Avoids:** whatever slipped through Pitfalls 4, 6 and 7.

### Phase Ordering Rationale

- Dependencies run model/persistence → create/list → toggle/progress/filter → delete → polish. Progress needs the state, and the filter must not feed progress.
- Each `ui/` file maps to a PRD feature, so the phases map cleanly to the structure without conflicts.
- The pitfalls are front-loaded: validation, storage and the testid contract are built in from the start, and the last phase only verifies them.
- No extras beyond the PRD are scheduled. Any v1.x item needs explicit approval after all of RF-01..07 are verified.

### Research Flags

Phases needing deeper research: none are required. Phase 4 needs a **decision**, not research: confirm `<dialog>` vs `window.confirm` in `/gsd-discuss-phase`.

Phases with standard patterns (skip research-phase): Phases 1, 2, 3 and 5. They use well-understood browser APIs and a small problem.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | PRD-fixed core; versions checked with `npm view`. Test tooling is opinion (MEDIUM). |
| Features | HIGH | Derived from the locked PRD. Market comparisons are general knowledge (LOW/MEDIUM) but irrelevant to scope. |
| Architecture | HIGH | Small, well-understood problem. MDN/ARIA APG points are from training knowledge (MEDIUM). |
| Pitfalls | MEDIUM | Based on the PRD and well-known browser behaviour; no external sources consulted in this pass. |

**Overall confidence:** HIGH for building the MVP; MEDIUM for hidden-test compatibility.

### Gaps to Address

- **Confirm-delete mechanism:** The research files lean the same way (a deterministic in-page `<dialog>` with testids) but note the risk. If the hidden suite only handles `page.on('dialog')`, a custom modal could fail. Decide in Phase 4 discussion, document it in the README, and re-read the PRD's acceptance wording on this point.
- **Filter persistence:** Assumed not persisted (resets to All on reload). Confirm against the PRD and document it.
- **Rounding:** `Math.round` (1/8 → 13%) is an assumption. Document it in the README.
- **Node version:** The Vite 6 Node requirement (20.19+/22.12+) was not re-verified. Check it before CI or other machines are used.
- **Vitest/Playwright adoption:** Optional. Decide at the start of Phase 1. If skipped, verify manually against the 7 acceptance criteria and the checklist.
- **`STATE.md` is missing:** `.planning/STATE.md` was not present when synthesising, so scope was checked against the PRD and `PROJECT.md` as cited in the research files.

## Sources

### Primary (HIGH confidence)
- `docs/02-documento-funcional.md` (PRD 1.0, locked): requirements, testid contract, scope
- `.planning/PROJECT.md` and repo `package.json`: constraints and scaffold
- `npm view` (2026-11-16): vite 6.4.6 (latest 8.3.8), vitest 5.1.0, @playwright/test 1.65.1, jsdom 31.0.1

### Secondary (MEDIUM confidence)
- MDN: `HTMLDialogElement.showModal()`, Web Storage, `Crypto.randomUUID()`, ARIA live regions (training knowledge, not re-fetched)
- WAI-ARIA Authoring Practices, Dialog (Modal) (training knowledge)
- Playwright `getByTestId` and default dialog handling (training knowledge)

### Tertiary (LOW confidence)
- General knowledge of Todoist, Microsoft To Do and TodoMVC, used for context only

---
*Research completed: 2026-11-16*
*Ready for roadmap: yes*
