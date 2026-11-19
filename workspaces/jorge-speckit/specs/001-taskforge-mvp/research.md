# Research: TaskForge MVP

No NEEDS CLARIFICATION items remain; decisions below.

## Decisions

- **Framework**: Vanilla JS + Vite. Rationale: PRD default stack, constitution II/V.
  Alternatives: React/Vue (unneeded weight).
- **State & persistence**: In-memory array saved to one `localStorage` key (`taskforge.tasks.v1`)
  after every mutation. Corrupt or non-array JSON falls back to an empty list.
- **IDs**: `crypto.randomUUID()` with a timestamp+counter fallback.
- **Delete confirmation**: Native `window.confirm`. Rationale: simplest, accessible, allowed by
  PRD; avoids custom modal focus management. Alternative: custom modal (more code).
- **Progress**: `Math.round(completed / total * 100)`, `0` when total is 0; computed from all
  tasks, never the filtered view.
- **Filtering**: Active filter kept in memory (not persisted); `aria-pressed` marks the active
  control, and text labels avoid color-only state.
- **Rendering**: Re-render the list from state after each change; use `textContent` (never
  `innerHTML`) for user input to prevent injection.
- **Validation**: Trim title; accept length 3–80; error shown in an element with `role="alert"`
  linked to the input via `aria-describedby`.
- **Testing**: Vitest (dev-only) for pure logic. Justification under constitution II: it does not
  ship in the bundle. Alternative: manual-only testing (weaker verification, principle IV).
- **Language of UI**: Spanish, matching PRD and `lang="es"`.
- **Accessibility**: Native `button`, `label`, `input`, visible `:focus-visible` outline,
  status text "Pendiente"/"Completada" shown in addition to styling.
