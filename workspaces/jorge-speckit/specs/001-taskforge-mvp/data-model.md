# Data Model: TaskForge MVP

## Task

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Unique, generated on creation, immutable |
| `title` | string | Trimmed; 3–80 characters; required; duplicates allowed |
| `description` | string | Optional; trimmed; may be empty |
| `status` | `"pending"` \| `"completed"` | Starts `pending` |
| `createdAt` | number (ms epoch) | Set on creation; defines list order (oldest first) |

### State transitions

`pending` ⇄ `completed` (toggle); content is never modified by a toggle. Deletion removes the
task after confirmation.

## Persisted state

Key `taskforge.tasks.v1` holds a JSON array of Task objects. Invalid JSON, a non-array value, or
entries failing the shape check are discarded and the app starts with the valid remainder (or an
empty list).

## Derived values

- **Progress** = `round(completed / total * 100)`; `0` if `total = 0`. Uses all tasks.
- **Visible tasks** = tasks filtered by active filter (`all` | `pending` | `completed`), kept in
  creation order.
