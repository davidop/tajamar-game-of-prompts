# Phase 3: Delete with Confirmation - Context

**Gathered:** 2026-11-16
**Status:** Ready for planning

<domain>
## Phase Boundary

El estudiante puede eliminar una tarea tras una confirmación explícita; cancelar la deja intacta; confirmar la quita de la lista, del progreso y de `localStorage`. La pasada final de a11y/contrato/docs (Fase 4) queda fuera.

</domain>

<decisions>
## Implementation Decisions

[auto] Opción recomendada por la investigación y coherente con las fases 1 y 2.

### Confirmación
- **D-01:** Se usa un modal propio con `<dialog>` nativo (`showModal()`), no `window.confirm`: foco atrapado, Esc cancela, accesible. El PRD (§5) admite ambas vías.
- **D-02:** Contrato: botón `task-delete` en cada `task-item`; el diálogo expone `confirm-delete` (confirmar) y `cancel-delete` (cancelar). El texto del diálogo nombra la tarea (vía `textContent`) y ambos botones tienen texto visible ("Eliminar"/"Cancelar").
- **D-03:** El diálogo se crea una sola vez (`src/ui/confirmDialog.js`, cableado en `main.js`) y se reutiliza; nunca se borra nada antes de pulsar `confirm-delete`.

### Estado y persistencia
- **D-04:** `deleteTask(id)` en el store filtra por id y persiste por el mismo camino (store → storage, único escritor); los ids inexistentes no hacen nada.
- **D-05:** El progreso y el filtro se recalculan desde la lista completa tras borrar (0% si queda vacía; se muestra el estado vacío correcto).

### Foco y UX
- **D-06:** Cancelar o Esc devuelve el foco al botón `task-delete` que abrió el diálogo; tras confirmar, el foco pasa al `task-delete` del siguiente elemento, o al contenedor de la lista (`tabindex="-1"`) si no queda ninguno, reutilizando `getFallbackFocus` de la Fase 2.
- **D-07:** Tests `node:test` para `deleteTask` (borra, persiste, id inexistente, lista vacía y progreso) y ampliación del smoke test con los nuevos `data-testid`; el flujo del diálogo se valida en UAT de navegador.

### the agent's Discretion
- Estilo del modal, textos exactos.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Producto
- `docs/02-documento-funcional.md` — RF-04, RF-06, contrato §5 (`task-delete`, `confirm-delete`, `cancel-delete`), criterio §6.6
- `.planning/REQUIREMENTS.md` — DEL-01, DEL-02
- `.planning/ROADMAP.md` — Phase 3 success criteria
- `.planning/phases/01-capture-persist-tasks/01-CONTEXT.md`, `.planning/phases/02-complete-filter-progress/02-CONTEXT.md` — decisiones vigentes

### Investigación
- `.planning/research/PITFALLS.md`, `.planning/research/ARCHITECTURE.md` — confirmación, foco, `textContent`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/state/store.js` (único escritor, `toggleTask`), `src/ui/taskList.js` (render, `getFallbackFocus`), `src/domain/tasks.js`, `src/main.js` (composición).

### Established Patterns
- Capas domain/state/ui; render reconstruyendo con `textContent`; `node:test`.

### Integration Points
- `deleteTask` en el store, botón `task-delete` en `taskList.js`, nuevo `confirmDialog.js`, cableado en `main.js`.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

- Deshacer eliminación (undo) — fuera de alcance v1.

</deferred>

---

*Phase: 3-Delete with Confirmation*
*Context gathered: 2026-11-16*
