# Feature Research

**Domain:** Gestor de tareas personal para estudiante (web estática, localStorage)
**Researched:** 2026-11-16
**Confidence:** HIGH for scope (derived from locked PRD 1.0); MEDIUM for general market expectations (training knowledge, no external sources consulted)

> Scope rule: PRD RF-01..07 are locked. Anything not in the PRD is NOT to be built before all mandatory items are done (PRD §8). "Differentiators" below are therefore limited to how well the mandatory features are executed, plus a deferred list.

## Feature Landscape

### Table Stakes (Users Expect These)

All of these are PRD-mandatory.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| RF-01 Crear tarea (título 3-80 tras trim, descripción opcional) | Core of any task manager | LOW | Validar sobre `trim()`; error visible y asociado al input (`aria-describedby`/`role="alert"`); no crear si es inválido |
| RF-02 Listar tareas con título, descripción y estado | Users need to see their work | LOW | Nuevas = Pendiente; estado en texto, no solo color; escapar contenido (usar `textContent`) |
| RF-03 Completar / reabrir | Basic lifecycle | LOW | Un único `task-toggle`; no pierde contenido |
| RF-04 Eliminar con confirmación | Prevents accidental loss | LOW | `window.confirm` (más simple) o modal con `confirm-delete`/`cancel-delete`; cancelar preserva |
| RF-05 Filtro Todas/Pendientes/Completadas | Navigating a growing list | LOW | Filtro es estado de vista, nunca muta datos; `aria-pressed` en los controles |
| RF-06 Persistencia en localStorage | Data survives reload | LOW | Guardar tras cada mutación; `try/catch` en lectura de JSON corrupto |
| RF-07 Progreso X% | Core Value: "comprobar su progreso" | LOW | `Math.round(done/total*100)`; 0% sin tareas; denominador = total, no filtrado |
| Estado vacío con mensaje (historia 7) | Orientación inicial | LOW | Mensaje comprensible + 0% |
| `data-testid` contract | Evaluación comparable | LOW | Obligatorio; en la raíz repetida `task-item` y sus acciones |
| RNF-01 Accesibilidad básica | Requisito explícito | LOW-MED | Teclado, labels, foco visible, contraste, estado no solo por color |

### Differentiators (Competitive Advantage)

No new functionality. Within the locked scope, quality of execution is the only legitimate differentiator.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Validación clara y accesible (mensajes en español, foco al campo erróneo) | Cumple RF-01/RNF-01 mejor que el mínimo | LOW | Dentro de RF-01 |
| Anuncio de cambios para lectores de pantalla (`aria-live` en progreso/errores) | Mejora RNF-01 | LOW | Dentro de RNF-01 |
| Persistencia robusta (datos corruptos no rompen la app) | Fiabilidad de RF-06 | LOW | Dentro de RF-06 |
| Código modular y legible + README claro | RNF-03 | LOW | Separar estado / storage / render |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **OUT OF SCOPE (PRD §7):** Autenticación | "Mis datos, mi cuenta" | Contradice app sin cuenta | localStorage |
| **OUT OF SCOPE:** Sincronización / servidor / BD / APIs | Multi-dispositivo | Rompe app estática | Ninguna en MVP |
| **OUT OF SCOPE:** IA dentro de la app | Sugerir/priorizar tareas | Fuera del PRD | — |
| **OUT OF SCOPE:** Drag-and-drop | Reordenar | Complejidad + accesibilidad | Orden de creación |
| **OUT OF SCOPE:** Notificaciones push | Recordatorios | Requiere permisos/servicios | — |
| **OUT OF SCOPE:** Calendarios | Fechas límite | Fuera del PRD | — |
| **OUT OF SCOPE:** Analítica de terceros / despliegue cloud | Métricas, hosting | Servicios de terceros prohibidos | `npm run build` local |
| **NOT IN PRD (don't add before mandatory done):** editar tarea, prioridades, etiquetas/categorías, fechas, búsqueda, ordenación, exportar/importar, modo oscuro, deshacer, borrar completadas en bloque | Habituales en gestores de tareas | Requisitos no documentados (PRD §8); pueden romper los tests comparables | Diferir |

## Feature Dependencies

```
RF-01 Crear
    └──requires──> RF-06 modelo/persistencia (id, título, descripción, estado)
RF-02 Listar ──requires──> RF-01
    ├──enhanced by──> RF-03 Completar/reabrir
    ├──enhanced by──> RF-04 Eliminar
    └──enhanced by──> RF-05 Filtro
RF-07 Progreso ──requires──> RF-03 (estado) y total sin filtrar
Estado vacío ──requires──> RF-02 + RF-07
RF-05 Filtro ──conflicts──> RF-07 si el denominador usa la lista filtrada (prohibido)
```

### Dependency Notes

- **Todo requiere un modelo de estado único:** una fuente de verdad (array de tareas) desde la que se derivan lista, filtro y progreso evita incoherencias (RF-05 "cifras coherentes").
- **RF-07 vs RF-05:** progreso se calcula sobre todas las tareas, nunca sobre la vista filtrada.
- **RF-06 transversal:** persistir en cada mutación (alta, toggle, borrado).

## MVP Definition

### Launch With (v1)

- [ ] RF-01..RF-07 — obligatorios, innegociables
- [ ] Estado vacío + 0%
- [ ] Contrato `data-testid` completo
- [ ] RNF-01 accesibilidad básica, RNF-02 build/dev sin errores, RNF-03 README

### Add After Validation (v1.x)

- [ ] Solo tras completar y verificar todos los obligatorios, y únicamente si el equipo decide documentarlo: ninguno planificado. (Candidatos: editar tarea, búsqueda.)

### Future Consideration (v2+)

- [ ] Prioridades/etiquetas, exportar/importar JSON, modo oscuro — fuera del PRD 1.0

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| RF-01 Crear + validación | HIGH | LOW | P1 |
| RF-02 Listar | HIGH | LOW | P1 |
| RF-03 Completar/reabrir | HIGH | LOW | P1 |
| RF-06 Persistencia | HIGH | LOW | P1 |
| RF-07 Progreso | HIGH | LOW | P1 |
| RF-05 Filtros | MEDIUM | LOW | P1 |
| RF-04 Eliminar + confirmación | MEDIUM | LOW | P1 |
| Estado vacío / testids / RNF-01 | HIGH | LOW | P1 |
| Cualquier extra no-PRD | LOW | varies | Bloqueado |

## Competitor Feature Analysis

| Feature | Todoist / Microsoft To Do (general knowledge) | TodoMVC (referencia) | Our Approach |
|---------|-----------------------------------------------|----------------------|--------------|
| Crear/completar/borrar | Sí, con cuentas y sync | Sí | Igual, local-only |
| Filtros | Múltiples (fecha, etiqueta) | All/Active/Completed | Todas/Pendientes/Completadas |
| Contador | Variable | "N items left" | `X%` completadas |
| Persistencia | Nube | localStorage | localStorage |

TaskForge es esencialmente un TodoMVC con progreso en % y validación; no compite en funcionalidad.

## Sources

- `docs/02-documento-funcional.md` (PRD 1.0, bloqueado) — HIGH
- `.planning/PROJECT.md` — HIGH
- Conocimiento general de Todoist, Microsoft To Do y TodoMVC (sin verificación externa) — LOW/MEDIUM

---
*Feature research for: gestor de tareas personal para estudiantes*
*Researched: 2026-11-16*
