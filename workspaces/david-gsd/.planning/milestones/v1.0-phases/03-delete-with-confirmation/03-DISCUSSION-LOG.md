# Phase 3: Delete with Confirmation - Discussion Log

**Mode:** --auto (recommended option chosen for every gray area)

| Gray area | Options | Chosen |
|-----------|---------|--------|
| Confirmation mechanism | `<dialog>` modal / `window.confirm` | `<dialog>` modal (a11y, focus, Esc) |
| Focus after cancel/confirm | trigger / next item / list container | trigger on cancel; next item or list container on confirm |
| Delete semantics | store `deleteTask`, single writer | filter by id, persist, no-op on unknown id |
| Testing | node:test + browser UAT | unit for `deleteTask`, UAT for dialog flow |
