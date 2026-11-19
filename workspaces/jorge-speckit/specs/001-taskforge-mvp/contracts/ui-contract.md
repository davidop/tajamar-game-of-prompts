# UI Contract: TaskForge MVP

| `data-testid` | Element | Notes |
|---------------|---------|-------|
| `task-title` | `<input>` | Labelled "Título"; required 3–80 chars after trim |
| `task-description` | `<textarea>` | Labelled "Descripción" (optional) |
| `task-submit` | `<button type="submit">` | Creates the task |
| `task-item` | `<li>` | One per visible task; root of the task |
| `task-toggle` | `<button>` inside `task-item` | Label alternates "Completar"/"Reabrir" |
| `task-delete` | `<button>` inside `task-item` | Triggers `window.confirm` |
| `filter-all` | `<button>` | `aria-pressed` reflects the active filter |
| `filter-pending` | `<button>` | Same |
| `filter-completed` | `<button>` | Same |
| `progress-value` | `<output>`/`<span>` | Text like `50%` |

Additional behaviour:
- Validation error appears in an `role="alert"` element; no task is created.
- On success, fields are cleared and the title field is focused.
- Each `task-item` shows title, description (if any) and a textual status.
- Empty list (or empty filter result) shows an understandable message; progress shows `0%` when
  there are no tasks.
- Confirmation uses native `window.confirm`, so `confirm-delete`/`cancel-delete` are not needed.
