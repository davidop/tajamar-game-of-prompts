# Stack Research

**Domain:** Static, localStorage-only todo app (vanilla JS + Vite + CSS)
**Researched:** 2026-11-16
**Confidence:** HIGH for core (PRD-fixed, npm versions checked via `npm view`); MEDIUM for test tooling choices (opinion, versions verified)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vanilla JavaScript (ES modules) | ES2022+ | App logic, DOM rendering | PRD-mandated (RNF-02). The app is ~7 features; a framework adds no value. |
| Vite | ^6.4 (latest 6.x is 6.4.6) | Dev server + production build | Already in scaffold. `npm run dev` / `npm run build` satisfy RNF-02. Vite 8 exists, but nothing needs it; stay on 6 to match the scaffold. |
| Plain CSS (+ custom properties) | n/a | Styling | No preprocessor needed. Use `:focus-visible`, CSS variables and a text/icon status indicator (RNF-01). |
| Browser `localStorage` | Web API | Persistence (RF-06) | Only persistence allowed. Wrap in a small `storage.js` module with try/catch + JSON validation. |
| Node.js | 20.19+ or 22+ (dev machine has 24) | Tooling runtime | Needed by Vite 6 and Vitest 5. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none at runtime) | — | — | Ship zero runtime dependencies. |
| `crypto.randomUUID()` (built-in) | Web API | Task ids | Instead of the `uuid`/`nanoid` packages. Needs a secure context; `localhost` qualifies. Fall back to `Date.now()+counter` if the app is opened via `file://`. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vitest (optional) | Unit tests for pure logic (validation 3–80 chars, progress %, filter, storage) | Keep logic in DOM-free modules so these run in plain Node. Use `environment: 'jsdom'` only if DOM-level tests are wanted. |
| @playwright/test (optional) | E2E acceptance tests via `data-testid` | `page.getByTestId('task-title')`. Default test-id attribute is already `data-testid`. Configure `webServer: { command: 'npm run preview' }` or `npm run dev`. Handle `window.confirm` with `page.on('dialog', d => d.accept())`. |
| jsdom (optional) | DOM env for Vitest | Only if DOM tests are needed. |
| ESLint / Prettier (optional) | Readability (RNF-03) | Low priority; skip unless time allows. |

## Installation

```bash
# Core (already in scaffold)
npm install -D vite@^6.4

# Optional unit tests
npm install -D vitest

# Optional E2E acceptance tests
npm install -D @playwright/test
npx playwright install chromium
```

Suggested scripts (add only if tests are adopted): `"test": "vitest run"`, `"test:e2e": "playwright test"`.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vanilla JS | Preact / Svelte / Lit | Only if the PRD is relaxed or UI grows well beyond the MVP. Not needed here. |
| Vite 6 | Vite 7/8 | If starting fresh with no scaffold constraint. Upgrade is cheap later. |
| Playwright | Cypress | Cypress is fine, but Playwright's `getByTestId`, multi-browser support and built-in webServer are simpler. |
| Playwright | Vitest browser mode | If you want one runner. Playwright E2E remains the closest match to the shared acceptance tests. |
| `window.confirm` | Custom modal / `<dialog>` | Use `<dialog>` + `confirm-delete`/`cancel-delete` testids if a styled confirmation is wanted. Both are allowed by the PRD. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Backend, IndexedDB, Firebase, any API | Out of scope; PRD says localStorage only | `localStorage` |
| Tailwind / CSS-in-JS / UI kits | Extra build config for no gain | Plain CSS |
| TypeScript | Not required (PRD says JS); adds setup. Optionally use JSDoc types. | JS + JSDoc |
| Jest | Needs extra transform setup with ESM/Vite | Vitest |
| Class/CSS selectors in tests | Break the shared acceptance contract | `data-testid` attributes |
| Analytics / CDN scripts / fonts | Violates "no third-party services" | Local assets, system font stack |

## Stack Patterns by Variant

**If only the mandatory requirements are built (recommended MVP):**
- Vite + vanilla JS + CSS, with no test dependencies.
- Verify manually against the 7 acceptance criteria.

**If automated verification is wanted:**
- Add Vitest for pure logic and Playwright for the `data-testid` flows.
- Playwright tests should clear `localStorage` in `beforeEach` (`page.addInitScript` or `context.clearCookies` is not enough; use `page.evaluate(() => localStorage.clear())`).

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| vite@6.4.x | vitest@5.1.0 | Vitest 5.1.0 peer range is `^6.4.0 \|\| ^7 \|\| ^8`, so keep Vite at 6.4 or later. A scaffold pinned to `^6.3.0` resolves to 6.4.x on install. |
| vite@6 | Node 20.19+ / 22.12+ | Verify against the Vite 6 docs if CI uses older Node. |
| @playwright/test@1.65.x | Node 18+ | Browsers are installed separately via `npx playwright install`. |

## Sources

- `npm view` (2026-11-16): vite latest 8.3.8, vite@6 latest 6.4.6, vitest 5.1.0 (peer `vite ^6.4.0 || ^7.0.0 || ^8.0.0`), @playwright/test 1.65.1, jsdom 31.0.1 — HIGH
- `.planning/PROJECT.md`, repo `package.json` — project constraints — HIGH
- Playwright `getByTestId` and dialog handling, from training knowledge; not re-verified against docs this session — MEDIUM
- Vite 6 Node-version requirement, from training knowledge; not re-verified — MEDIUM

---
*Stack research for: static localStorage todo app (TaskForge)*
*Researched: 2026-11-16*
