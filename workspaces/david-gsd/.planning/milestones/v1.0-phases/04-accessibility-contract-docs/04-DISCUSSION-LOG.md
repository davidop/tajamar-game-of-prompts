# Phase 4: Accessibility, Contract & Docs - Discussion Log

**Mode:** --auto (recommended option chosen for every gray area)

| Gray area | Options | Chosen |
|-----------|---------|--------|
| Validation error announcement | `role="alert"` / `aria-live` only / none | `role="alert"` + `aria-describedby` + `aria-invalid` |
| Contract verification | node:test static check / browser E2E | node:test extending smoke test |
| README | minimal / full with assumptions | Full Spanish README with assumptions |
| PRD §6 acceptance | traceability matrix + final UAT | matrix + browser UAT |
