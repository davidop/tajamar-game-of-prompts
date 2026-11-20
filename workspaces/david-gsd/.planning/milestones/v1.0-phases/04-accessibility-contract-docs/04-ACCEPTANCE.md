# 04-ACCEPTANCE — Trazabilidad de los criterios de aceptación (PRD §6)

Fuente: `docs/02-documento-funcional.md` §6. Generado en el plan 04-02.

**Leyenda de resultado**
- **Automático: PASS** = los tests citados están en verde (`npm test`, `npm run build` ejecutados al cerrar este plan). Cubren la lógica de dominio/estado/persistencia y el cableado estático de la UI, **no** la interacción real en un navegador.
- **Resultado final: PASS (UAT 2026-11-16)** = el criterio incluye comportamiento de navegador (interacción, recarga, diálogo) que no se ha ejecutado aún. No se marca PASS hasta ejecutar los pasos manuales en `/gsd-verify-work`.

Servidor para los pasos manuales: `npm run dev` → http://127.0.0.1:5173 (empezar con `localStorage` limpio: DevTools → Application → Clear site data).

| # | Criterio | Evidencia automática (fichero › test) | Automático | Paso manual de navegador | Resultado final |
|---|----------|---------------------------------------|------------|--------------------------|-----------------|
| 1 | Formulario vacío no crea tarea y muestra error | `tests/domain.test.js` › "validateTitle rejects empty, blank and too short"; `tests/smoke.test.js` › "taskForm wires role=alert and aria-describedby"; `tests/a11y.test.js` › "validation error is announced and linked to the input" | PASS (lógica y cableado) | 1. Abrir la URL. 2. Pulsar "Añadir" (`task-submit`) con el título vacío. 3. Esperado: aparece un mensaje de error, no se crea ninguna tarea. | PASS (UAT 2026-11-16) |
| 2 | Crear "Preparar examen" genera una tarea Pendiente | `tests/domain.test.js` › "createTask builds a pending task"; "validateTitle accepts trimmed 3..80" | PASS (lógica) | 1. Escribir "Preparar examen" en `task-title`. 2. Pulsar `task-submit`. 3. Esperado: la tarea aparece en la lista con estado "Pendiente". | PASS (UAT 2026-11-16) |
| 3 | Con 2 tareas, completar una = 50 %; reabrirla = 0 % | `tests/stats.test.js` › "progressPercent: rounding with Math.round"; `tests/store.test.js` › "toggleTask flips pending <-> completed" | PASS (lógica) | 1. Crear dos tareas. 2. Completar una con `task-toggle`: `progress-value` muestra 50 %. 3. Reabrirla: muestra 0 %. | PASS (UAT 2026-11-16) |
| 4 | Filtro Pendientes solo muestra pendientes; Todas vuelve a mostrar ambas | `tests/stats.test.js` › "filterTasks: all / pending / completed"; "progressPercent is independent of filtering"; `tests/smoke.test.js` › "filterBar sets aria-pressed" | PASS (lógica y cableado) | 1. Con una tarea pendiente y otra completada, pulsar `filter-pending`: solo la pendiente. 2. Pulsar `filter-all`: ambas. | PASS (UAT 2026-11-16) |
| 5 | Recargar conserva tareas y su estado | `tests/storage.test.js` › "saveTasks round-trips", "key is taskforge.v1"; `tests/store.test.js` › "toggleTask persists to storage under taskforge.v1" | PASS (persistencia en lógica; sin navegador) | 1. Crear una tarea y completarla. 2. Recargar la página (F5). 3. Esperado: la tarea sigue y sigue Completada. | PASS (UAT 2026-11-16) |
| 6 | Eliminar + cancelar no borra; confirmar sí | `tests/store.test.js` › "deleteTask removes the task and keeps the others in order", "deleteTask persists removal under taskforge.v1"; `tests/smoke.test.js` › "deleteTask( is only called in the confirmed branch of main.js (DEL-02)", "confirm dialog uses showModal and no native confirm/alert anywhere in src" | PASS (lógica y cableado) | 1. Pulsar eliminar en una tarea: se abre el diálogo. 2. `cancel-delete`: la tarea sigue. 3. Eliminar otra vez y `confirm-delete`: la tarea desaparece (y no vuelve tras recargar). | PASS (UAT 2026-11-16) |
| 7 | Lista vacía = 0 % y mensaje de estado vacío | `tests/stats.test.js` › "progressPercent: zero tasks is 0"; `tests/store.test.js` › "deleting the only task leaves empty list and 0% progress"; `tests/smoke.test.js` › "empty-state message exists and is gated on zero tasks" | PASS (lógica y cableado) | 1. Con `localStorage` limpio abrir la URL. 2. Esperado: `progress-value` = 0 % y mensaje de lista vacía visible. | PASS (UAT 2026-11-16) |

## Huecos

Ninguno: los 7 criterios tienen evidencia automática y un paso manual. No hay pruebas E2E automatizadas en navegador (diferidas a v2), por lo que la verificación de interacción real queda en el UAT.

## Comprobaciones de calidad (QUAL-01)

- `tests/quality.test.js`: sin patrones de secretos, sin fetch/XHR/WebSocket/sendBeacon ni URLs remotas, sin innerHTML/outerHTML/insertAdjacentHTML, sin `.env` versionados.
- `git remote -v` vacío (sin remote); `.gitignore` excluye `.env` y `.env.*`.
