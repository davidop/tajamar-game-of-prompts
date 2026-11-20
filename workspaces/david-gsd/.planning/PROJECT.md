# TaskForge

## What This Is

TaskForge es una aplicación web personal y estática para que un estudiante organice sus tareas cotidianas: crear, listar, completar/reabrir, eliminar y filtrar tareas, y ver su progreso. Funciona en navegador moderno sin cuenta, servidor ni servicios de terceros, y recuerda los datos mediante `localStorage`.

## Core Value

Un estudiante puede añadir tareas y comprobar su progreso, y los datos persisten tras recargar la página.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] RF-01 Crear tareas (título 3-80 chars sin espacios extremos, descripción opcional, error comprensible si es inválido)
- [ ] RF-02 Listar tareas (título, descripción si existe, estado; nuevas en Pendiente)
- [ ] RF-03 Completar y reabrir sin perder contenido
- [ ] RF-04 Eliminar con confirmación explícita (cancelar preserva)
- [ ] RF-05 Filtrar por Todas / Pendientes / Completadas sin borrar datos
- [ ] RF-06 Persistencia en `localStorage` de altas, cambios de estado y eliminaciones
- [ ] RF-07 Progreso X% completadas sobre el total (redondeo entero, 0% sin tareas, filtros no alteran denominador)
- [ ] RNF-01 Accesibilidad básica (teclado, nombres accesibles, validación perceptible, estado no solo por color, foco visible)
- [ ] RNF-02 App estática JS + Vite + CSS; `npm run dev` y `npm run build` sin errores
- [ ] RNF-03 Código comprensible, sin secretos, README con instrucciones
- [ ] Contrato de testabilidad: `data-testid` (task-title, task-description, task-submit, task-item, task-toggle, task-delete, filter-all, filter-pending, filter-completed, progress-value; confirm-delete/cancel-delete si hay modal)
- [ ] Estado vacío comprensible con progreso 0%

### Out of Scope

- Autenticación — el MVP no requiere cuenta
- Sincronización entre dispositivos / servidor / base de datos / APIs remotas — app estática local
- IA dentro de la app — fuera de alcance del PRD
- Drag-and-drop, notificaciones push, calendarios — no son requisitos del MVP
- Analítica de terceros y despliegue cloud — sin servicios de terceros
- Requisitos no documentados antes de completar los obligatorios — restricción de la dinámica

## Context

- Fuente: `docs/02-documento-funcional.md` (PRD 1.0 bloqueado, taller Tajamar 2026).
- Existe un scaffold inicial: `package.json` (Vite ^6.3), `index.html`, `src/main.js`, `src/style.css`.
- Los criterios de aceptación (7 historias) se ejecutarán como pruebas comparables entre alumnos vía `data-testid`.
- Ante ambigüedad: documentar el supuesto y decidir razonablemente.

## Constraints

- **Tech stack**: JavaScript + Vite + CSS; librerías UI ligeras permitidas, sin backend — RNF-02
- **Persistencia**: solo `localStorage` — RF-06
- **Testabilidad**: `data-testid` obligatorios — contrato común de evaluación
- **Calidad**: sin secretos ni servicios de pago, README de puesta en marcha — RNF-03

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS + Vite + CSS (sin framework) | Stack predeterminado del PRD, mínimo riesgo | ✓ Good — sin dependencias de runtime, 63 tests `node:test` |
| Confirmación de borrado con `<dialog>` nativo (`confirm-delete` / `cancel-delete`) | Accesible, foco gestionado; admitido por el PRD | ✓ Good — UAT 4/4 |
| Los requisitos del PRD son innegociables | Restricción de la dinámica | ✓ Good — 19/19 cumplidos |
| Filtro solo en memoria; progreso `Math.round` sobre la lista completa | Simplicidad; supuestos documentados en README | ✓ Good |

## Current State

**Shipped v1.0 MVP (2026-11-16):** captura, completar/reabrir, filtros, progreso, borrado con confirmación, accesibilidad, contrato `data-testid` y README. 4 fases, 8 planes, 19/19 requisitos, 63 tests, UAT superado en todas las fases.

**Tech debt conocida:** fallos de `saveTasks` (cuota/almacenamiento deshabilitado) no se notifican en la UI; `restoreFocus` asume que el toggle es el primer botón del item. Ver `milestones/v1.0-MILESTONE-AUDIT.md`.

## Next Milestone Goals

Candidatos v2 (fuera del PRD actual): persistir el filtro (V2-02), avisar de fallos de guardado, tests E2E en navegador, deshacer eliminación.

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-11-16 after v1.0 milestone
