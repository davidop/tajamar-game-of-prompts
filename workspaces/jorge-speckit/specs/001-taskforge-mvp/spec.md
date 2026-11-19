# Feature Specification: TaskForge MVP

**Feature Branch**: `001-taskforge-mvp`

**Created**: 2026-11-16

**Status**: Draft

**Input**: User description: "@docs/02-documento-funcional.md"

## Clarifications

### Session 2026-11-16

- Q: Should the app allow creating two tasks with the same title? → A: Allow duplicates
- Q: In what order should tasks appear in the list? → A: Oldest first (creation order)
- Q: After a task is created successfully, what should happen to the form? → A: Clear fields and focus the title

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and see tasks (Priority: P1)

A student adds a pending exercise with a title and optional description and sees it in the list
as Pending.

**Why this priority**: Without creating and listing tasks there is no product.

**Independent Test**: Submit the form with a valid title and verify a Pending task appears;
submit it empty and verify an error is shown and nothing is created.

**Acceptance Scenarios**:

1. **Given** an empty form, **When** the student submits, **Then** no task is created and an
   understandable error is visible.
2. **Given** the title `Preparar examen`, **When** the student submits, **Then** a Pending task
   with that title appears in the list.
3. **Given** a title of fewer than 3 or more than 80 characters (ignoring leading/trailing
   spaces), **When** submitted, **Then** no task is created and an error is shown.
4. **Given** a task with a description, **When** listed, **Then** title, description and status
   are all shown.

---

### User Story 2 - Complete and reopen tasks with progress (Priority: P1)

A student marks a task Completed, reopens it, and checks overall progress as a percentage.

**Why this priority**: Tracking progress is the core value of the product.

**Independent Test**: With two tasks, complete one and verify 50%; reopen it and verify 0%.

**Acceptance Scenarios**:

1. **Given** two tasks, **When** one is marked Completed, **Then** progress shows `50%`.
2. **Given** a Completed task, **When** reopened, **Then** it returns to Pending with its
   content intact and progress returns to `0%`.
3. **Given** no tasks, **When** the app is viewed, **Then** progress shows `0%` and a clear
   empty-state message is displayed.

---

### User Story 3 - Persistence across reloads (Priority: P1)

A student closes or reloads the page and finds all tasks and their states unchanged.

**Why this priority**: Required for the app to be usable day to day.

**Independent Test**: Create a task, reload, and verify it and its state remain.

**Acceptance Scenarios**:

1. **Given** a created task, **When** the page is reloaded, **Then** the task and its status are
   still present.
2. **Given** a completed or deleted task, **When** the page is reloaded, **Then** the change is
   preserved.

---

### User Story 4 - Delete with confirmation (Priority: P2)

A student removes a task only after explicitly confirming.

**Why this priority**: Corrects mistakes; the confirmation prevents accidental loss.

**Independent Test**: Request deletion, cancel and verify the task stays; request again, confirm
and verify it is gone.

**Acceptance Scenarios**:

1. **Given** a task, **When** the student requests deletion and cancels, **Then** the task is
   not deleted.
2. **Given** a task, **When** the student requests deletion and confirms, **Then** the task is
   removed and progress updates.

---

### User Story 5 - Filter by status (Priority: P2)

A student views All, Pending or Completed tasks.

**Why this priority**: Helps focus, but the app works without it.

**Independent Test**: With tasks in both states, apply each filter and verify the list.

**Acceptance Scenarios**:

1. **Given** tasks in both states, **When** the Pending filter is chosen, **Then** only pending
   tasks are shown.
2. **Given** a filter is active, **When** All is chosen, **Then** every task is shown again.
3. **Given** any filter, **When** applied, **Then** no data is deleted and the progress
   percentage is unchanged.

---

### Edge Cases

- Title consisting only of spaces: rejected as invalid.
- Title of exactly 3 or exactly 80 characters (after trimming): accepted.
- Filter selected with no matching tasks: an understandable empty message is shown.
- Progress rounding: 1 of 3 completed shows `33%`; 2 of 3 shows `67%`.
- Stored data that is missing or corrupted: the app starts with an empty list without failing.
- Everything must remain operable using only the keyboard.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST let users create a task with a required title of 3–80 characters
  (excluding leading/trailing spaces) and an optional free-text description.
- **FR-002**: System MUST NOT create invalid tasks and MUST show an understandable error.
  Tasks with identical titles MUST be allowed. After a successful creation, the form fields
  MUST be cleared and focus returned to the title field.
- **FR-003**: System MUST list each task with its title, its description when present, and its
  status; new tasks MUST start as Pending. Tasks MUST be ordered oldest first (creation order).
- **FR-004**: Users MUST be able to toggle a task between Pending and Completed without losing
  content.
- **FR-005**: System MUST ask for explicit confirmation before deleting a task; cancelling MUST
  preserve it.
- **FR-006**: Users MUST be able to filter by All, Pending and Completed; filtering MUST NOT
  delete data and the list MUST stay consistent with the filter.
- **FR-007**: System MUST persist every creation, status change and deletion locally on the
  user's device so reloading keeps tasks; no cloud data is used.
- **FR-008**: System MUST display the percentage of completed tasks over the total, rounded to
  the nearest integer, `0%` when there are no tasks, unaffected by the active filter.
- **FR-009**: System MUST show an understandable empty-state message when the list is empty.
- **FR-010**: Controls MUST be keyboard operable with accessible names, visible focus, readable
  contrast, perceptible validation messages, and status not conveyed by color alone.
- **FR-011**: System MUST run without login, backend, database or remote APIs.
- **FR-012**: The interface MUST expose these test identifiers (`data-testid`): `task-title`
  (title input), `task-description`, `task-submit`, `task-item` (repeated per task),
  `task-toggle` and `task-delete` (inside each task-item), `filter-all`, `filter-pending`,
  `filter-completed`, and `progress-value` (visible element containing the percentage). If a
  custom confirmation dialog is used, its buttons MUST use `confirm-delete` and `cancel-delete`.
- **FR-013**: The product MUST NOT include authentication, cross-device sync, server, in-app AI,
  drag-and-drop, push notifications, calendars, third-party analytics or cloud deployment.

### Key Entities

- **Task**: A student's to-do item with a title, optional description and status (Pending or
  Completed).
- **Progress**: Derived percentage of Completed tasks over all tasks.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A student can add a valid task in under 15 seconds.
- **SC-002**: All 7 acceptance scenarios in the PRD (section 6) pass.
- **SC-003**: 100% of tasks and statuses survive a page reload.
- **SC-004**: Progress shown equals the correct rounded percentage in 100% of tested cases,
  including the empty case.
- **SC-005**: All core actions (create, toggle, delete, filter) can be completed using only the
  keyboard.
- **SC-006**: Every identifier listed in FR-012 is found by automated checks.

## Assumptions

- Target user is a single student on a modern desktop browser; no accounts are needed.
- Deletion uses a native browser confirmation or a custom dialog; either is acceptable.
- Descriptions have no length limit beyond reasonable free text.
- Editing an existing task's title/description is not required by the PRD and is out of scope.
- Setup instructions are provided in the project README, per the PRD quality requirements.
