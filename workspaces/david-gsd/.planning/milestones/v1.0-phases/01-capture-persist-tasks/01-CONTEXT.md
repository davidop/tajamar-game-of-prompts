# Phase 1: Capture & Persist Tasks - Context

**Gathered:** 2026-11-16
**Status:** Ready for planning

<domain>
## Phase Boundary

El estudiante puede crear tareas válidas (título 3-80 + descripción opcional), verlas listadas en estado Pendiente, ver un estado vacío comprensible, y recuperarlas tras recargar (`localStorage`, tolerante a datos corruptos). Incluye que `npm run dev` / `npm run build` funcionen. Completar, filtrar, progreso, eliminar y verificación final a11y/docs pertenecen a fases posteriores.

</domain>

<decisions>
## Implementation Decisions

[auto] Todas las decisiones usan la opción recomendada por la investigación (`.planning/research/SUMMARY.md`).

### Estructura de código
- **D-01:** Vanilla ES modules sobre el scaffold existente (`index.html`, `src/main.js`, `src/style.css`), sin dependencias de runtime. Capas `src/domain/` (validación, funciones puras), `src/state/` (store + adaptador de storage) y `src/ui/` (render y eventos).
- **D-02:** Un único array de tareas es la fuente de verdad; lista, filtro y progreso se derivan de él. El store es el único código que escribe en `localStorage`.

### Modelo y persistencia
- **D-03:** Tarea = `{ id, title, description, status: 'pending'|'completed', createdAt }`; `id` con `crypto.randomUUID()` con fallback.
- **D-04:** Clave `localStorage` = `taskforge.v1`; guardar tras cada mutación. La carga valida forma/tipos y ante datos ausentes, corruptos o de forma errónea arranca con lista vacía sin lanzar; `setItem` envuelto en try/catch.

### Validación y formulario
- **D-05:** Formulario con `novalidate`; la validación en JS usa el título recortado (`trim`) y el rango 3-80 inclusive. Error de texto en un elemento enlazado con `aria-describedby` y `role="alert"`; el título inválido no crea tarea y conserva lo escrito.
- **D-06:** Tras crear con éxito se limpia el formulario y el foco vuelve al campo título.

### Render y UI
- **D-07:** Render reconstruyendo la lista en cada cambio con `textContent` (nunca `innerHTML` con datos del usuario). Estado mostrado como texto ("Pendiente"), no solo color.
- **D-08:** Estado vacío: mensaje visible en español ("Aún no tienes tareas…"). Idioma de la UI: español (`lang="es"`).
- **D-09:** Poner ya los `data-testid` de esta fase: `task-title`, `task-description`, `task-submit`, `task-item` (raíz repetida por tarea); `task-toggle`/`task-delete`, filtros y `progress-value` llegan en fases 2-3.
- **D-10:** CSS plano, sencillo, con `:focus-visible` y contraste legible desde el inicio.

### the agent's Discretion
- Diseño visual concreto, nombres de archivos/funciones y texto exacto de mensajes.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Producto
- `docs/02-documento-funcional.md` — PRD 1.0 bloqueado: RF-01, RF-02, RF-06, RNF-02, contrato §5, criterios §6.1, §6.2, §6.5, §6.7
- `.planning/PROJECT.md` — alcance, restricciones y decisiones clave
- `.planning/REQUIREMENTS.md` — TASK-01..05, PERS-01, PERS-02, BUILD-01

### Investigación
- `.planning/research/ARCHITECTURE.md` — estructura, store, storage, render
- `.planning/research/PITFALLS.md` — validación con trim, storage corrupto, XSS
- `.planning/research/STACK.md` — Vite 6 + vanilla JS

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `index.html`: `<div id="app">` y carga de `/src/main.js`; `lang="es"` ya establecido.
- `src/main.js` y `src/style.css`: placeholder del starter, a reemplazar.

### Established Patterns
- Proyecto ESM (`"type": "module"`), Vite 6; scripts `dev`, `build`, `preview` ya definidos.

### Integration Points
- `src/main.js` monta la app en `#app`; las fases 2-3 amplían el store y la UI sin cambiar su forma.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

- Editar tarea, persistir filtro, pruebas automatizadas (Vitest/Playwright) — v2.

</deferred>

---

*Phase: 1-Capture & Persist Tasks*
*Context gathered: 2026-11-16*
