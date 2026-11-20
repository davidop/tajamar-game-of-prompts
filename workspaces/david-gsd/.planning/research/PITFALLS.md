# Pitfalls Research

**Domain:** Static vanilla JS + Vite todo app persisted in `localStorage` (TaskForge)
**Researched:** 2026-11-16
**Confidence:** MEDIUM (based on the PRD plus well-known browser/web behavior; no external sources were consulted in this pass)

## Critical Pitfalls

### Pitfall 1: Title validation checks the raw value, not the trimmed value

**What goes wrong:**
`"   "` or `"ab "` passes a `length >= 3` check. Titles are saved with outer spaces. An 81-char title that is 80 chars after trimming gets rejected, or the reverse.

**Why it happens:**
Validation runs on `input.value`, and the trim is applied only when saving (or not at all). The HTML `minlength`/`maxlength` attributes also count raw characters, and `maxlength` silently truncates input.

**How to avoid:**
- Use one pure `validateTitle(raw)` that does `const t = raw.trim()` and returns `{ok, value, error}`. Rule: 3 <= t.length <= 80.
- Store the trimmed value.
- Do not use `maxlength`/`required` as the only guard. Add `novalidate` to the form and validate in JS, so the error message is consistent and testable.
- Unit-test the boundaries: "", "  ", "ab", "  ab  ", 3 chars, 80 chars, 81 chars, and 80 chars plus surrounding spaces.

**Warning signs:**
The browser shows its native tooltip instead of the app's own error. Stored titles have leading or trailing spaces.

**Phase to address:**
Create-task phase (RF-01).

---

### Pitfall 2: Corrupted, missing or wrong-shape `localStorage` crashes the app on load

**What goes wrong:**
`JSON.parse(null)` returns `null`, and `.filter` on it throws. Invalid JSON, or a valid value of the wrong shape (an object instead of an array, entries with no `id`), leaves a blank page. `setItem` can also throw (quota, private mode, storage disabled).

**Why it happens:**
The happy path is assumed. Loading runs at module top level, so one throw kills all rendering.

**How to avoid:**
- Wrap `getItem`/`parse` in try/catch. Return `[]` if the result is not an array.
- Filter entries to valid tasks: string `id`, trimmed string `title`, boolean or enum status. Drop the rest.
- Wrap `setItem` in try/catch and show a non-fatal message.
- Use a namespaced, versioned key such as `taskforge.tasks.v1`.
- Keep storage access in one module (`storage.js`).
- Write on every mutation (add, toggle, delete). Do not write only on `beforeunload`.

**Warning signs:**
Setting the key to `{bad` in DevTools and reloading gives a white screen. Console shows `SyntaxError` or `TypeError` on load.

**Phase to address:**
Persistence phase (RF-06). Build it before the UI depends on it.

---

### Pitfall 3: Progress math (rounding, empty list, filter as denominator)

**What goes wrong:**
- An empty list gives `0/0 = NaN%`.
- `toFixed` returns a string like `"33.3"`, or `Math.floor` is used, so 1 of 3 shows 33% (correct) but 2 of 3 shows 66% instead of 67%.
- The progress is computed from the filtered list. In the Pending filter it then reads 0%, or 100% in Completed. This violates RF-07.

**Why it happens:**
The render function receives only the visible list. Percentage is calculated inline in the template.

**How to avoid:**
- Use `percent(tasks) = tasks.length === 0 ? 0 : Math.round(done / tasks.length * 100)`. Always pass the full task array, never the filtered one.
- Keep `getVisibleTasks(tasks, filter)` separate from `getProgress(tasks)`.
- Render the text as `${n}%` inside the element with `data-testid="progress-value"`.
- Test cases: 0 tasks -> 0%, 1 of 2 -> 50%, 1 of 3 -> 33%, 2 of 3 -> 67%, and the value unchanged when the filter changes.

**Warning signs:**
`NaN%` appears after deleting the last task. The percentage changes when you click a filter.

**Phase to address:**
Progress and filter phase (RF-05, RF-07).

---

### Pitfall 4: XSS through `innerHTML` with user text

**What goes wrong:**
A title or description such as `<img src=x onerror=alert(1)>` executes, or breaks the layout. Because tasks persist, the payload also re-runs on every reload (stored XSS, self-inflicted but still a defect).

**Why it happens:**
Building rows with template strings and `innerHTML` is the fastest approach in vanilla JS.

**How to avoid:**
- Use `textContent` or `createElement` for user data. Never interpolate title or description into an HTML string.
- If templates are used for static markup, assign the user text afterward via `textContent`.
- Keep `white-space: pre-wrap` in CSS if multi-line descriptions matter. Do not convert newlines to `<br>` through HTML.
- Do not use `innerHTML` with data read back from `localStorage`, because it is untrusted.

**Warning signs:**
`grep innerHTML src/` shows a hit with interpolated data. Creating the task `<b>x</b>` shows bold text.

**Phase to address:**
List rendering phase (RF-02). Check it again in the final review.

---

### Pitfall 5: `window.confirm` blocks or breaks automated tests

**What goes wrong:**
Playwright and similar tools auto-dismiss dialogs by default, so confirm returns `false`. The "confirm deletes" test then fails even when the app is correct. In other runners the dialog hangs. The "cancel preserves" story passes by accident.

**Why it happens:**
Native dialogs are outside the DOM, and the test harness needs a dialog handler that the app author does not control. The PRD allows either option but the evaluation tests are fixed.

**How to avoid:**
- Prefer a custom in-page confirmation with `data-testid="confirm-delete"` and `data-testid="cancel-delete"`. It is deterministic in any runner. Use `<dialog>` or a role="dialog" container with focus handling (see Pitfall 6).
- If `window.confirm` is kept (PROJECT.md leaves this open), call it synchronously inside the click handler and delete only when it returns `true`. Document the choice in the README.
- Do not delete on click and offer "undo" instead. That violates RF-04.

**Warning signs:**
Tests that accept or dismiss the dialog give opposite results. A task disappears without a visible confirmation.

**Phase to address:**
Delete phase (RF-04). Decide in the phase discussion.

---

### Pitfall 6: Accessibility gaps (focus, error announcement, color-only status)

**What goes wrong:**
- On invalid submit the error is shown but not announced, and focus stays on the submit button.
- Status "Completada" is conveyed only by color or a strike-through that is not exposed to assistive tech.
- `outline: none` removes the focus ring.
- Icon-only buttons have no accessible name.
- After a delete (or a modal close), focus is lost to `<body>`.
- Re-rendering the whole list on toggle drops focus from the button the user just pressed.

**Why it happens:**
Styling is done first and a11y is added late. Full re-render with `innerHTML = ''` destroys focused nodes.

**How to avoid:**
- Put the error in an element with `role="alert"` (or `aria-live="polite"`) that exists in the DOM from page load. Set `aria-invalid="true"` and `aria-describedby` on the title input. Move focus to the title input on error.
- Show status as visible text ("Pendiente"/"Completada") and not only by color. Use a real `<button>` or checkbox with an accessible name that includes the task title, for example `aria-label="Completar: Preparar examen"`. Use `aria-pressed` on the filter buttons.
- Use `:focus-visible` styles with sufficient contrast. Never `outline: none` without a replacement.
- After a toggle, restore focus to the same task's toggle (key by `id`). After a delete, focus the next item or the title input.
- Modal: move focus in, trap or use `<dialog>.showModal()`, close on Esc, and return focus to the trigger.
- Empty-state message: use plain text ("No hay tareas todavía"), not only an icon.

**Warning signs:**
Tab-only navigation cannot complete the whole flow. A screen reader is silent on error. The page in grayscale shows no difference between states.

**Phase to address:**
Built in from the first UI phase. Include a dedicated accessibility pass at the end (RNF-01).

---

### Pitfall 7: `data-testid` in the wrong place or missing on re-render

**What goes wrong:**
- `task-toggle` and `task-delete` are placed outside `task-item`, so selectors like `task-item >> task-toggle` fail.
- `task-item` is on an inner element, or the same id appears more than once in a place where it must be unique (for example `task-title` on both the input and the rendered task title).
- A `<label>` or wrapper gets the testid instead of the `<input>` itself. Tests then cannot `fill()` it.
- `progress-value` is hidden, or contains only the number without `%`.
- The empty-state and filter controls are not rendered in the initial HTML.

**Why it happens:**
The contract is read loosely. Rows are generated by a helper that was written before the contract was checked.

**How to avoid:**
- Place `task-title`, `task-description`, `task-submit` on the actual form controls. Place `task-item` on the repeated root, one per task, with `task-toggle` and `task-delete` as its descendants and real `<button>` elements.
- The rendered task title text inside an item must not reuse `data-testid="task-title"`. Use a different one such as `task-item-title`.
- Do not render the filter controls as an element with a different type than expected (a `<button>` is safest).
- Add a smoke check (script or test) that asserts all 10 required ids, and that confirm-delete/cancel-delete exist when a modal is used.

**Warning signs:**
`document.querySelectorAll('[data-testid="task-title"]').length` is not 1. A task row's `querySelector('[data-testid="task-delete"]')` returns null.

**Phase to address:**
First UI phase. Re-verify in the final contract-verification phase.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store only the array with no version key | Simpler code | A later shape change breaks old data | Acceptable if the key is namespaced (`.v1`) |
| Full re-render with `innerHTML = ''` | Easy | Lost focus, XSS risk if mixed with templates | Only if focus is restored and text uses `textContent` |
| `Date.now()` as id | One line | Collisions when two tasks are created in the same millisecond | Use `crypto.randomUUID()` (fallback counter) instead |
| Validation only via HTML attributes | Less JS | Not testable, inconsistent messages, no trimming | Never |
| Single big `main.js` | Fast start | Hard to unit-test, RNF-03 readability | Never; split into storage / logic / render |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `localStorage` | Reading it once at import and keeping a stale copy across tabs | Load on init; optionally listen to the `storage` event |
| `JSON.parse` | Trusting the result | Validate shape and fields (Pitfall 2) |
| Vite build | `import.meta`/dev-only assumptions, secrets in `.env` | Keep it plain; check `npm run build` after each phase |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Re-render the full list on every keystroke | Input lag | Re-render only on state changes | Thousands of tasks (irrelevant for MVP) |
| Writing to storage in loops | Slow bulk ops | One write per mutation | Not a concern at this scale |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| `innerHTML` with user or stored text | Stored XSS | `textContent`/`createElement` (Pitfall 4) |
| Committing `.env` or keys | Policy breach (RNF-03) | No secrets needed; add `.gitignore` entry |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Error only in a tooltip or red border | Not perceivable | Visible text near the field plus `role="alert"` |
| Form keeps the invalid text but gives no hint | Confusion | Keep the text, focus the field, explain the rule ("3-80 caracteres") |
| Form not cleared after a successful add | Duplicate entries | Clear fields, clear any error, return focus to the title |
| Filter selected but empty result shows a blank list | Looks broken | A different empty message, such as "No hay tareas pendientes", and keep the real empty state for no tasks |
| Active filter not indicated | Unclear state | `aria-pressed` plus a visible style that is not only color |

## "Looks Done But Isn't" Checklist

- [ ] **Validation:** Often missing the trimmed check — verify `"  ab  "` is rejected and `"  abc  "` is saved as `abc`.
- [ ] **Persistence:** Often missing delete/toggle writes — reload after each action.
- [ ] **Corrupt storage:** Often missing — set the key to `{bad` and to `null`, reload, the app must open with an empty list.
- [ ] **Progress:** Often wrong when filtered or empty — verify 0 tasks -> 0%, 2 of 3 -> 67%, filters do not change it.
- [ ] **Delete:** Often missing cancel path — verify cancel keeps the task and confirm removes it and updates the progress and storage.
- [ ] **Filter after toggle:** Often missing — toggling in the Pending filter should remove the item from view while the progress updates.
- [ ] **XSS:** Create the task `<img src=x onerror=alert(1)>`; no alert, shown as text.
- [ ] **Keyboard:** Complete the full flow without a mouse; focus ring visible.
- [ ] **Test ids:** All 10 required ids exist, correctly nested, and `npm run build` passes.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Corrupted storage in the field | LOW | Sanitize on load; reset the key if nothing is salvageable |
| Wrong test-id placement found late | LOW | Move attributes; add the contract smoke test |
| innerHTML spread across the code | MEDIUM | Centralize rendering in one `render.js` using DOM APIs |
| Progress computed from the filtered list | LOW | Pass the full array to `getProgress` |

## Pitfall-to-Phase Mapping

Suggested phase names (the roadmap may rename them).

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Title trim/length | Create tasks (RF-01) | Boundary unit tests |
| 2. Corrupt/missing storage | Persistence (RF-06) | Manual corrupt-key reload; unit tests |
| 3. Progress math / denominator | Progress and filters (RF-05/07) | Unit tests; filter does not change `progress-value` |
| 4. XSS | List rendering (RF-02) | Grep for `innerHTML`; XSS payload test |
| 5. confirm in tests | Delete (RF-04) | Run the cancel/confirm stories under a headless runner |
| 6. Accessibility | All UI phases plus a final pass (RNF-01) | Keyboard-only run; screen-reader/axe check |
| 7. Test-id placement | First UI phase plus a final contract check | Smoke test over the 10 ids |

## Sources

- `docs/02-documento-funcional.md` (PRD 1.0): requirements and the test-id contract. Confidence HIGH.
- `.planning/PROJECT.md`: scope and open decisions. Confidence HIGH.
- General knowledge of browser behavior (MDN: `localStorage`, `Element.textContent`, ARIA live regions, `<dialog>`; Playwright's default dialog handling). Not re-verified against live docs in this pass. Confidence MEDIUM.

---
*Pitfalls research for: localStorage todo app (TaskForge)*
*Researched: 2026-11-16*
