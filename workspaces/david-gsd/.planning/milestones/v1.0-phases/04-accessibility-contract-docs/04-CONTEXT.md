# Phase 4: Accessibility, Contract & Docs - Context

**Gathered:** 2026-11-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Pasada final: accesibilidad (teclado, foco visible, nombres accesibles, contraste, errores anunciados, estado no solo por color), verificación del contrato `data-testid`, README real con supuestos, y comprobación de los 7 criterios de aceptación del PRD §6. No se añaden funcionalidades nuevas.

</domain>

<decisions>
## Implementation Decisions

[auto] Opción recomendada por la investigación y coherente con las fases 1-3.

### Accesibilidad
- **D-01:** Auditoría y arreglos sobre el código existente, sin nuevas funciones: todos los controles son `button`/`input` nativos con etiqueta (`label` asociada o `aria-label`), foco visible con `:focus-visible` y contraste mínimo AA (4.5:1) en texto y botones.
- **D-02:** Los errores de validación se muestran en un contenedor con `role="alert"` (o `aria-live="assertive"`) y el input se enlaza con `aria-describedby` y `aria-invalid`.
- **D-03:** El estado Pendiente/Completada ya se muestra como texto; se comprueba que no depende solo del color (también el filtro activo y el progreso).
- **D-04:** Se verifica que `<html lang="es">`, el título de la página y un `h1` existen; los controles se pueden operar solo con teclado (crear, completar, filtrar, eliminar).

### Contrato de pruebas
- **D-05:** Test `node:test` que recorre `index.html` y los módulos de UI y comprueba que existen todos los `data-testid` del PRD §5 (incluidos `confirm-delete`/`cancel-delete`) en los elementos del tipo correcto; se amplía el smoke test existente, sin duplicarlo.

### Documentación y calidad
- **D-06:** Reescribir `README.md` en español: qué es TaskForge, requisitos, `npm install`, `npm run dev`, `npm run build`, `npm test`, estructura de carpetas y los supuestos (redondeo `Math.round`, filtro no persistido, confirmación con `<dialog>`, clave `taskforge.v1`).
- **D-07:** Comprobación de secretos y de servicios remotos: sin claves, sin `fetch`/XHR/CDN, sin `innerHTML` con datos del usuario.

### Aceptación PRD §6
- **D-08:** Se redacta una matriz de trazabilidad de los 7 criterios (test automático o paso manual) en el README o en `.planning`, y un UAT de navegador final los recorre.

### the agent's Discretion
- Ajustes exactos de estilo, tono del README.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Producto
- `docs/02-documento-funcional.md` — RNF-01..03, contrato §5, criterios §6.1-§6.7
- `.planning/REQUIREMENTS.md` — A11Y-01, A11Y-02, TEST-01, QUAL-01, QUAL-02
- `.planning/ROADMAP.md` — Phase 4 success criteria
- `.planning/phases/01..03-*/*-CONTEXT.md` — decisiones vigentes

### Investigación
- `.planning/research/PITFALLS.md` — a11y, `textContent`, contrato

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `index.html`, `src/ui/*.js`, `src/style.css`, `src/main.js`; `tests/smoke.test.js` (contrato parcial).
- `README.md` actual es el starter vacío del taller: debe reemplazarse.

### Established Patterns
- `textContent`, capas domain/state/ui, `node:test`, UI en español.

### Integration Points
- Cambios acotados en `index.html`, `style.css`, `taskForm.js`, tests y README.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

- Tests E2E con navegador automatizado — v2.

</deferred>

---

*Phase: 4-Accessibility, Contract & Docs*
*Context gathered: 2026-11-16*
