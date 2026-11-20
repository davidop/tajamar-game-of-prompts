# Demo exprés de GSD Core — TaskForge (5 minutos)

**Objetivo:** mostrar trazabilidad requisitos → roadmap → implementación → pruebas, sin generar código durante el recorrido seguro.

## Preparación (antes de enseñar la pantalla)

Desde PowerShell, con Node.js y Git instalados:

```powershell
git clone https://github.com/davidop/tajamar-game-of-prompts.git
cd tajamar-game-of-prompts
npm ci --prefix workspaces/david-gsd
npm --prefix workspaces/david-gsd run dev
```

Abrir http://127.0.0.1:5173 y dejar estas pestañas listas:

1. [Documento funcional](02-documento-funcional.md)
2. [Roadmap GSD](../workspaces/david-gsd/.planning/ROADMAP.md)
3. [Auditoría v1.0](../workspaces/david-gsd/.planning/milestones/v1.0-MILESTONE-AUDIT.md)
4. [GitHub Actions](https://github.com/davidop/tajamar-game-of-prompts/actions/workflows/quality.yml)

## Guion cronometrado

**00:00–01:00 — Requisito y planificación.** Enseñar el documento funcional y el roadmap. Explicar las cuatro fases: capturar y persistir; completar, filtrar y mostrar progreso; eliminar con confirmación; accesibilidad y documentación. Ocho planes completados.

**01:00–03:00 — Aplicación funcionando.** Crear una tarea, marcarla completada y recargar la página para comprobar persistencia. Si el servidor no arranca, mostrar código y tests sin afirmar que se ha ejecutado en directo.

**03:00–04:00 — Evidencias.** Enseñar la auditoría del milestone y el workflow. Diferenciar resultados declarados por GSD de comprobaciones independientes en CI. No interpretar el número de tests como puntuación comparativa frente a Spec Kit.

**04:00–05:00 — Cierre.** «GSD organiza la ejecución en fases, deja trazabilidad y permite verificar cada entrega. Comparamos métodos con el mismo documento funcional y el mismo agente».

## Segunda demo opcional: cambio de requisito en directo

**No usar el cambio sorpresa reservado para la sesión.** Probar un cambio distinto: «Permitir buscar tareas por texto, sin romper los filtros existentes; la búsqueda debe ser insensible a mayúsculas y tener pruebas de regresión».

Desde la raíz del repo:

```powershell
npm run demo:prepare
cd demos/david-gsd
git status
copilot
```

En Copilot CLI, comprobar `/gsd-help` y `/gsd-progress`; después solicitar a GSD que planifique el nuevo requisito, revisar el plan antes de ejecutar y verificar tests y build. Los nombres exactos de comandos disponibles dependen de la instalación local de GSD; usar la ayuda instalada y no inventar comandos.

**No ejecutar el cambio sobre** `workspaces/david-gsd` **ni publicar la solución de la demo como sustitución del snapshot validado.** Si la generación tarda, volver al roadmap y a la CI ya comprobada.
