# Quickstart: Validating TaskForge MVP

**Prerequisites**: Node 18+, `npm install` run at the repo root.

## Automated checks

```bash
npm test          # unit tests for validation, progress, filtering, storage
npm run build     # must finish without errors
```

## Manual walkthrough (`npm run dev`, open http://127.0.0.1:5173)

1. Submit the empty form → error visible, no task (spec US1, PRD story 1).
2. Create `Preparar examen` → Pending task appears; form cleared, title focused.
3. Try titles of 2 and 81 characters, and only spaces → rejected; 3 and 80 chars → accepted.
4. Create a second task; complete one → progress `50%`; reopen → `0%`.
5. Filter Pendientes → only pending shown; Todas → all shown; progress unchanged.
6. Delete and cancel → task stays; delete and confirm → task gone.
7. Reload the page → tasks and statuses preserved.
8. Delete all tasks → `0%` and empty-state message.
9. Corrupt the storage key in DevTools, reload → app starts empty without errors.
10. Operate everything with keyboard only; focus visible.

Check that every identifier in [contracts/ui-contract.md](contracts/ui-contract.md) is present.
