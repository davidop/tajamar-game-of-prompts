# Architecture Research

**Domain:** Static single-page task manager (vanilla JS + Vite + CSS, localStorage)
**Researched:** 2026-11-16
**Confidence:** HIGH (small, well-understood problem; based on PRD 1.0 and standard browser APIs. No external library is needed, so no Context7 lookup was done.)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      UI layer (DOM)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐   │
│  │ TaskForm │ │ Filters  │ │ TaskList │ │ Progress      │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────▲───────┘   │
│       │ dispatch   │ dispatch   │ dispatch      │ render    │
├───────┴────────────┴────────────┴───────────────┴───────────┤
│                  State layer (store.js)                      │
│  state = { tasks[], filter } ; actions ; subscribe(fn)       │
├─────────────────────────────────────────────────────────────┤
│              Pure domain (no DOM, no storage)                │
│  validateTask · computeProgress · filterTasks                │
├─────────────────────────────────────────────────────────────┤
│                 Storage adapter (storage.js)                 │
│  load() / save(tasks) ──▶ localStorage["taskforge.v1"]       │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `store.js` | Single source of truth (`tasks`, `filter`); actions `addTask`, `toggleTask`, `deleteTask`, `setFilter`; notifies subscribers; persists after each task mutation | Closure with `getState/dispatch/subscribe` |
| `storage.js` | Reads and writes the task array; hides the key, JSON and failures | try/catch around `localStorage`; returns `[]` on missing, corrupt or unavailable data |
| `domain/*.js` | Pure functions: validation, progress, filtering | No imports from DOM or storage, so they are unit-testable |
| `ui/*.js` | Build DOM, bind events, call store actions | `render(state)` functions |
| `main.js` | Composition root: load storage, create store, mount UI, subscribe | ~20 lines |

## Recommended Project Structure

```
src/
├── main.js              # composition root
├── style.css            # includes :focus-visible, .sr-only, status styles
├── state/
│   ├── store.js         # createStore(initialTasks, {persist})
│   └── storage.js       # createStorage(key) → {load, save}
├── domain/
│   ├── tasks.js         # validateTitle, createTask, filterTasks
│   └── progress.js      # computeProgress(tasks)
├── ui/
│   ├── app.js           # mounts regions, subscribes, renders
│   ├── taskForm.js
│   ├── taskList.js      # includes empty state
│   ├── filters.js
│   ├── progress.js
│   └── confirmDelete.js # modal (<dialog>) or window.confirm wrapper
└── testids.js           # optional constants for the data-testid contract
```

### Structure Rationale

- **state/ vs domain/:** The pure logic (RF-01, RF-05, RF-07 rules) stays free of side effects, so it can be checked quickly. Only the store touches persistence.
- **ui/ per region:** Each file maps to one PRD feature, so work can be split into phases without conflicts.
- **No framework or router:** There is one screen. Anything more is overkill.

## Architectural Patterns

### Pattern 1: Minimal store with subscribe (unidirectional flow)

**What:** UI never mutates state. It dispatches actions, the store updates state, persists it, and notifies subscribers, which re-render.
**When to use:** Always, for this app.
**Trade-offs:** About 30 lines of code and no dependencies. Re-rendering is manual.

```js
export function createStore(initialTasks, storage) {
  let state = { tasks: initialTasks, filter: 'all' };
  const subs = new Set();
  const set = (next, persist) => {
    state = next;
    if (persist) storage.save(state.tasks);
    subs.forEach((fn) => fn(state));
  };
  return {
    getState: () => state,
    subscribe: (fn) => (subs.add(fn), () => subs.delete(fn)),
    addTask: (t) => set({ ...state, tasks: [...state.tasks, t] }, true),
    toggleTask: (id) => set({ ...state, tasks: state.tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t) }, true),
    deleteTask: (id) => set({ ...state, tasks: state.tasks.filter(t => t.id !== id) }, true),
    setFilter: (filter) => set({ ...state, filter }, false), // filter is not persisted
  };
}
```

### Pattern 2: Full re-render of the list with keyed identity

**What:** `renderList(state)` rebuilds the `<ul>` with `replaceChildren(...)` using `document.createElement` and `textContent`. The form and filter controls are rendered once and updated in place (`aria-pressed`, counts).
**When to use:** Lists of tens or hundreds of tasks.
**Trade-offs:** Rebuilding drops focus on the activated button. Fix this by restoring focus after render (see accessibility below). Do not re-render the form, to avoid losing typed text.

### Pattern 3: Storage adapter with versioned key and defensive load

**What:** `taskforge.v1` holds `Task[]` as JSON. `load()` validates shape (array, fields with the right types) and drops invalid entries. `save()` catches `QuotaExceededError` and private-mode errors.
**When to use:** Always.
**Trade-offs:** A little extra code. In exchange, a corrupt value never blanks the app (RF-06).

```js
export const createStorage = (key = 'taskforge.v1') => ({
  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(key) ?? '[]');
      return Array.isArray(raw) ? raw.filter(isTask) : [];
    } catch { return []; }
  },
  save(tasks) {
    try { localStorage.setItem(key, JSON.stringify(tasks)); } catch { /* surface non-fatal notice */ }
  },
});
```

### Pattern 4: Pure progress and filter functions

**What:** Progress is always computed on the full `tasks` array, never on the filtered list. This satisfies RF-07 ("filters do not alter the denominator").

```js
export const computeProgress = (tasks) =>
  tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
export const filterTasks = (tasks, f) =>
  f === 'pending' ? tasks.filter(t => !t.completed)
  : f === 'completed' ? tasks.filter(t => t.completed) : tasks;
```

Rounding note: `Math.round` rounds .5 up. Example: 1/8 = 12.5% → 13%. Document this assumption in the README.

### Pattern 5: Accessible confirm-delete

**Recommendation:** Use the native `<dialog>` with `showModal()`, with `data-testid="confirm-delete"` and `data-testid="cancel-delete"` on its buttons.
- `showModal()` provides the focus trap, `Esc` to cancel, `inert` background and top-layer rendering. It is supported in all modern browsers.
- Label the dialog with `aria-labelledby` (include the task title in the text). Put initial focus on **Cancel** (the safe default).
- On close, return focus to the opener (the task's delete button, or the next item or the title input if the item is gone).
- `window.confirm` is the permitted fallback. It is the least code and the most robust for automated tests, because Playwright auto-dismisses dialogs unless a handler is registered. A modal is a visible, inspectable DOM element. **Open decision for the roadmap:** a `<dialog>` is the better-quality choice, `confirm()` is the lower-risk one. If the hidden test suite only handles `page.on('dialog')`, a custom modal could fail; if it clicks `confirm-delete`, `window.confirm` would fail. The PRD allows both, so the tests must handle both. Choose the `<dialog>` because it is testable by click and accessible.

## Data Flow

### Request Flow

```
User action (click / submit)
    ↓
UI handler → store action (validate in domain for add)
    ↓
store: new state → storage.save(tasks) (task mutations only)
    ↓
subscribers → renderList / renderFilters / renderProgress
```

### State Management

```
store.state ──subscribe──▶ ui render(state)
     ▲                         │
     └──── actions ◀───────────┘ (event handlers)
```

### Key Data Flows

1. **Create:** `submit` → `validateTitle(trim)` → invalid: show the error in a `role="alert"` region and `aria-invalid` on the input, do not call the store; valid: `addTask(createTask())`, clear the form, return focus to the title input.
2. **Toggle:** `task-toggle` click → `toggleTask(id)` → persist → re-render list and progress.
3. **Delete:** `task-delete` click → open dialog (task id kept in the module) → confirm: `deleteTask(id)`; cancel: close, no state change.
4. **Filter:** `filter-*` click → `setFilter` → re-render list only. Progress is unchanged. The filter is not persisted (assumption: resets to "Todas" on reload).
5. **Boot:** `storage.load()` → `createStore` → first render. Empty list shows the empty-state message and `0%`.

## Task model and testid contract

```js
// Task: { id: string (crypto.randomUUID()), title, description, completed: boolean, createdAt: number }
```

`crypto.randomUUID()` requires a secure context. `localhost` qualifies, but a plain-HTTP LAN host does not. Use a fallback (`Date.now()` + counter) to be safe.

| `data-testid` | Element | Notes |
|---|---|---|
| `task-title` | `<input>` in a `<form>` | Visible `<label>`; `minlength`/`maxlength` should NOT be relied on to block validation. Use `novalidate` and the JS validator so the error message is always shown (story 1). |
| `task-description` | `<textarea>` | Optional |
| `task-submit` | `<button type="submit">` | Enter in the title field submits |
| `task-item` | `<li>` per task | Root; contains title, description, status text, toggle, delete |
| `task-toggle` | `<button>` inside `task-item` | Label changes ("Completar" / "Reabrir") and `aria-label` includes the task title |
| `task-delete` | `<button>` inside `task-item` | `aria-label="Eliminar: {title}"` |
| `filter-all/pending/completed` | `<button aria-pressed>` | Visible text and `aria-pressed` for state |
| `progress-value` | `<span>` | Text must contain `50%`. Do not split the number and the `%` across elements. Wrap with `role="status"`/`aria-live="polite"` on the container |
| `confirm-delete` / `cancel-delete` | `<button>` in the dialog | Only exist in the DOM while the dialog is open or rendered once inside the dialog |

Rules: put IDs in one constants file or in the render functions only. Set `data-testid` in the render code, never in styles or text. A `task-item` is rendered only for tasks in the current filter. Status is shown as text ("Pendiente"/"Completada"), not only by color/strike-through.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| < 200 tasks (the MVP) | Current design; full list re-render is imperceptible |
| ~1k+ tasks | Debounce saves; render with keyed diffing or `DocumentFragment` |
| Beyond localStorage (~5 MB) | Out of scope (no backend); IndexedDB would be the step, not needed here |

### Scaling Priorities

1. **First bottleneck:** synchronous `JSON.stringify` on every mutation. Only visible at thousands of tasks.
2. **Second bottleneck:** list re-render. Switch to keyed updates only if measured.

## Anti-Patterns

### Anti-Pattern 1: Computing progress from the visible list

**What people do:** `progress = completedInFilteredList / filteredList.length`.
**Why it's wrong:** Breaks RF-07 and story 3/4 (the filter changes the percentage).
**Do this instead:** `computeProgress(state.tasks)` with the unfiltered array.

### Anti-Pattern 2: Reading the DOM as state / persisting from UI handlers

**What people do:** Query checked boxes to decide state; call `localStorage.setItem` in click handlers.
**Why it's wrong:** State and storage drift; an action is forgotten (RF-06 requires every add, toggle and delete to persist).
**Do this instead:** Only the store persists, inside the mutation path.

### Anti-Pattern 3: `innerHTML` with user text

**What people do:** Template strings with the title/description.
**Why it's wrong:** XSS from the user's own content, and broken markup with `<` characters.
**Do this instead:** `createElement` + `textContent`.

### Anti-Pattern 4: Relying on HTML `required`/`minlength` alone, or on colour alone

**What people do:** Let the browser block submit, or show errors in red only.
**Why it's wrong:** The error may not be rendered or perceivable (RNF-01, story 1); whitespace-only titles pass native checks.
**Do this instead:** `novalidate` + JS validation on the trimmed value + text error linked via `aria-describedby`.

### Anti-Pattern 5: Over-engineering

**What people do:** Add a framework, event bus, router or build-time state library.
**Why it's wrong:** The PRD forbids undocumented extra requirements; extra code is risk.
**Do this instead:** The ~5 modules above.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| None | — | No network calls, analytics, or fonts from CDNs (PRD §7) |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| ui ↔ store | Direct calls to actions; `subscribe` for updates | UI never mutates state |
| store ↔ storage | Injected adapter (`storage.save`) | Injection makes it testable with a fake |
| store/ui ↔ domain | Pure function imports | No side effects |

## Suggested build order (for roadmap)

1. `domain/` + `storage.js` + `store.js` (logic with no UI).
2. Form + list + empty state + data-testids (RF-01, 02, 06, story 1, 2, 5, 7).
3. Toggle + progress + filters (RF-03, 05, 07, story 3, 4).
4. Confirm-delete dialog (RF-04, story 6).
5. Accessibility pass, README, `npm run build` check (RNF-01..03).

Phases 1–5 are standard patterns and need no further research. The only open decision is the confirm-delete choice (Pattern 5).

## Sources

- `docs/02-documento-funcional.md` (PRD 1.0): requirements and testid contract (HIGH)
- `.planning/PROJECT.md`: constraints and scope (HIGH)
- MDN: `HTMLDialogElement.showModal()`, `Web Storage API`, `Crypto.randomUUID()` (from training knowledge; not re-fetched in this session, MEDIUM)
- WAI-ARIA Authoring Practices, Dialog (Modal) pattern (training knowledge, MEDIUM)

---
*Architecture research for: static vanilla JS task manager*
*Researched: 2026-11-16*
