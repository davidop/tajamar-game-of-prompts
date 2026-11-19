<!--
Sync Impact Report
Version change: (blank template) → 1.0.0
Modified principles: none renamed (all five principles newly defined)
Added sections: Core Principles I–V, Technical Constraints, Development Workflow, Governance
Removed sections: none
Follow-up TODOs: none
-->
# TaskForge Constitution

## Core Principles

### I. Spec-Driven Source of Truth
`docs/02-documento-funcional.md` is the only functional source. Every feature MUST trace to
it through the Spec Kit flow (specify → clarify → plan → tasks → implement → analyze). No
feature outside the PRD may be added, and no reference solution may be used.

### II. Static MVP, No Backend
TaskForge MUST be a single static Vite application. Backends, external services and
external persistence are prohibited; data MUST persist only in `localStorage`. Dependencies
MUST be justified in the plan and kept minimal.

### III. Testability Contract (NON-NEGOTIABLE)
All `data-testid` attributes listed in the PRD testability section MUST be present and
stable, regardless of visual design. If a custom delete modal is used, `confirm-delete` and
`cancel-delete` MUST exist. Renaming or removing a test id is a breaking change.

### IV. Verified Delivery
Each user story MUST have acceptance criteria that are checked before it is considered done.
`npm run build` MUST succeed and the app MUST start with `npm run dev` at every completed
task. Behaviour MUST be verified against the PRD, not assumed.

### V. Simplicity and Documented Decisions
Prefer plain, readable code and the smallest design that meets the PRD (YAGNI). Significant
decisions and deviations MUST be recorded in the plan or spec with their rationale.

## Technical Constraints

- Stack: Vite 6, vanilla JavaScript (ES modules), CSS; code lives in `src/`.
- Dev server on `127.0.0.1:5173`; preview on port `4173`.
- Corrupted or invalid `localStorage` content MUST be handled without crashing.
- UI MUST be usable with keyboard and have visible labels for form controls.

## Development Workflow

- Work proceeds on Spec Kit artifacts in order; implementation MUST NOT start before
  spec, plan and tasks exist and `/speckit-analyze` reports no critical inconsistencies.
- Changes are small and committed per task or logical group.
- Prompts in `prompts/` and the guide in `docs/guia-casa.md` define the workshop scope; a
  single MVP is delivered.

## Governance

This constitution supersedes other practices. Amendments MUST be made through
`/speckit-constitution`, documenting the rationale, and versioned semantically: MAJOR for
incompatible principle removal or redefinition, MINOR for new or materially expanded
principles, PATCH for clarifications. Plans and reviews MUST verify compliance with these
principles, and any violation MUST be justified explicitly in the plan's complexity tracking.

**Version**: 1.0.0 | **Ratified**: 2026-11-16 | **Last Amended**: 2026-11-16
