# TaskForge

Gestor de tareas personal para estudiantes. Aplicación estática (Vite + JavaScript + CSS) sin
backend: los datos se guardan en el `localStorage` del navegador.

## Puesta en marcha

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # genera dist/
npm test         # pruebas unitarias (Vitest)
```

## Funcionalidades

- Crear tareas (título 3–80 caracteres, descripción opcional) con errores comprensibles.
- Completar/reabrir, eliminar con confirmación y filtrar por estado.
- Progreso `X%` sobre el total de tareas (no depende del filtro).
- Persistencia en `localStorage` (clave `taskforge.tasks.v1`).

Los `data-testid` siguen el contrato de `docs/02-documento-funcional.md`. La especificación,
el plan y las tareas están en `specs/001-taskforge-mvp/`.
