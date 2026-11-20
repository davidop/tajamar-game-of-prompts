# TaskForge

TaskForge es una aplicación web estática para gestionar tareas de estudio: se pueden crear, completar, filtrar y eliminar tareas, y se muestra el porcentaje de progreso. No tiene backend, login ni servicios externos; los datos se guardan en el navegador (`localStorage`).

## Requisitos

- Node.js 20.19+ o 22.12+ (requisito de Vite 6; comprobado con Node 24 y Vite 6.4).
- npm.

## Puesta en marcha

```bash
npm install        # instala dependencias
npm run dev        # servidor de desarrollo en http://127.0.0.1:5173
npm run build      # build de producción en dist/
npm run preview    # sirve el build en http://127.0.0.1:4173
npm test           # node --test, sin dependencias adicionales
```

## Estructura de carpetas

```
index.html            # página única, lang="es"
src/main.js           # arranque y cableado
src/domain/           # tasks.js (validación, creación), stats.js (progreso, filtros)
src/state/            # store.js (estado), storage.js (localStorage)
src/ui/               # taskForm, taskList, filterBar, progress, confirmDialog
src/style.css         # estilos (foco visible, contraste AA)
tests/                # pruebas node:test (dominio, estado, a11y, contrato, calidad)
docs/                 # PRD y documentación del taller
```

## Accesibilidad

Controles nativos (`button`, `input`) operables con teclado, foco visible con `:focus-visible`, errores de validación en un contenedor `role="alert"` enlazado con `aria-describedby`, y el estado (Pendiente/Completada, filtro activo) siempre en texto, no solo por color.

## Supuestos

- El porcentaje de progreso se calcula sobre el total de tareas (no sobre las filtradas) y se redondea con `Math.round`; sin tareas es 0 %.
- El filtro activo **no** se persiste: al recargar vuelve a "Todas".
- La confirmación de borrado usa un `<dialog>` propio (botones `data-testid` `confirm-delete` y `cancel-delete`), no `window.confirm`.
- Los datos viven en `localStorage` bajo la clave `taskforge.v1`; datos ausentes o corruptos se tratan como lista vacía.

## Criterios de aceptación

La trazabilidad de los 7 criterios del PRD §6 (evidencia automática y pasos manuales de navegador) está en [`.planning/phases/04-accessibility-contract-docs/04-ACCEPTANCE.md`](.planning/phases/04-accessibility-contract-docs/04-ACCEPTANCE.md).
