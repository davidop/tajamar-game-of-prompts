# Phase 2: Complete, Filter & Progress - Context

**Gathered:** 2026-11-16
**Status:** Ready for planning

<domain>
## Phase Boundary

El estudiante puede marcar tareas como Completadas y reabrirlas sin perder contenido, filtrar por Todas/Pendientes/Completadas, y ver el progreso "X%" sobre el total. Eliminar (Fase 3) y la pasada final de a11y/docs (Fase 4) quedan fuera.

</domain>

<decisions>
## Implementation Decisions

[auto] Opción recomendada por la investigación y coherente con las decisiones de la Fase 1.

### Estado y persistencia
- **D-01:** `toggleTask(id)` en el store alterna `status` entre `pending` y `completed` sin tocar título/descripción, y persiste tras cada cambio por el mismo camino que la Fase 1 (store → storage, único escritor).
- **D-02:** El filtro activo (`all|pending|completed`) es estado de UI en memoria, no persistido; arranca en "Todas" tras recargar (V2-02 diferido).

### Progreso
- **D-03:** Función pura en `src/domain/` `progressPercent(tasks)`: `total === 0 → 0`, si no `Math.round(completadas / total * 100)`. Siempre se calcula sobre la lista completa, nunca la filtrada.
- **D-04:** `progress-value` es un elemento visible con el texto `X%` (p. ej. "50%"), actualizado en cada render; el redondeo `Math.round` (12.5 → 13) se documenta como supuesto.

### Filtros
- **D-05:** Función pura `filterTasks(tasks, filter)`; tres botones (`filter-all`, `filter-pending`, `filter-completed`) con `aria-pressed` y texto del estado activo (no solo color).
- **D-06:** Si el filtro no tiene resultados, mostrar un mensaje de estado vacío específico del filtro (distinto del de lista totalmente vacía).

### UI
- **D-07:** Cada `task-item` incluye un botón `task-toggle` con nombre accesible que cambia de texto ("Completar"/"Reabrir") y muestra el estado como texto ("Pendiente"/"Completada") además de estilo visual.
- **D-08:** Tras alternar o filtrar el foco no se pierde (se conserva en el control accionado); sigue usándose `textContent`, nunca `innerHTML` con datos del usuario.
- **D-09:** Tests con `node:test` para `progressPercent`, `filterTasks` y `toggle` (incluido 0 tareas, 1/3 → 33%, 1/2 → 50%, 2/3 → 67%); ampliar el smoke test con los nuevos `data-testid`.

### the agent's Discretion
- Maquetación de la barra de filtros y del bloque de progreso, textos exactos.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Producto
- `docs/02-documento-funcional.md` — RF-03, RF-05, RF-07, contrato §5, criterios §6.3, §6.4, §6.7
- `.planning/REQUIREMENTS.md` — STAT-01, FILT-01, PROG-01, PROG-02
- `.planning/ROADMAP.md` — Phase 2 success criteria
- `.planning/phases/01-capture-persist-tasks/01-CONTEXT.md` — decisiones D-01..D-10 que siguen vigentes

### Investigación
- `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md` — progreso sobre total, filtro vs denominador

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/domain/tasks.js` (validación/creación), `src/state/storage.js` (carga defensiva), `src/state/store.js` (único escritor), `src/ui/taskForm.js`, `src/ui/taskList.js`.
- `tests/` con `node:test` (`npm test`).

### Established Patterns
- Capas domain/state/ui; render reconstruyendo con `textContent`; estado como texto.

### Integration Points
- Ampliar `store.js` (toggle) y `taskList.js` (botón toggle, filtro, progreso); `main.js` compone los nuevos controles.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

- Persistir el filtro activo — V2-02.

</deferred>

---

*Phase: 2-Complete, Filter & Progress*
*Context gathered: 2026-11-16*
