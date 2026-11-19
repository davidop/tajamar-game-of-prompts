# PRD 1.0 — TASKFORGE

**Documento funcional común.** Fecha de referencia: taller Tajamar 2026. Versión bloqueada 1.0.

## 1. Contexto y objetivo
TaskForge es una aplicación web personal para que un estudiante organice sus tareas cotidianas. Se busca un MVP utilizable que no requiera cuenta, servidor ni servicios de terceros. La aplicación debe funcionar en navegador moderno y recordar los datos aunque se cierre o recargue la pestaña.

## 2. Usuario y casos de uso
Un estudiante quiere añadir un ejercicio pendiente, visualizar todo lo pendiente, marcarlo como completado, corregir una acción y comprobar cómo progresa su trabajo.

## 3. Funcionalidades obligatorias (deben implementarse todas)
- **RF-01 Crear tareas.** Un formulario admite título obligatorio de 3-80 caracteres (sin contar espacios extremos) y descripción opcional. No se crean tareas inválidas. Mostrar un error comprensible. Se acepta un campo de descripción de texto libre.
- **RF-02 Listar tareas.** Mostrar título, descripción cuando exista y estado de cada tarea. Las nuevas se crean en estado **Pendiente**.
- **RF-03 Completar y reabrir.** Cada tarea puede pasar de Pendiente a Completada y volver atrás sin perder su contenido.
- **RF-04 Eliminar.** Se solicita confirmación explícita antes de eliminar una tarea; cancelar preserva la tarea.
- **RF-05 Filtrar por estado.** Controles para Todas, Pendientes y Completadas. El listado y las cifras deben ser coherentes; el filtro no borra datos.
- **RF-06 Persistencia local.** Toda alta, cambio de estado y eliminación persiste en `localStorage`; recargar la página conserva las tareas. La aplicación no utiliza datos en la nube.
- **RF-07 Progreso.** Mostrar `X%` de tareas completadas respecto al total de tareas, redondeado al entero más cercano; sin tareas mostrar **0%**. Los filtros no alteran el denominador.

## 4. No funcionales
- **RNF-01 Accesibilidad básica.** Los controles se manejan por teclado y tienen nombres accesibles. Mensajes de validación perceptibles; el estado no depende exclusivamente del color. Contraste legible y foco visible.
- **RNF-02 Ejecución y arquitectura.** Aplicación estática sin login, backend, base de datos ni APIs remotas. Stack predeterminado JavaScript + Vite + CSS; se permiten librerías UI ligeras, pero no introducir backend. `npm run dev` arranca la app y `npm run build` debe finalizar sin errores.
- **RNF-03 Calidad.** Código comprensible, sin secretos ni servicios de pago, con instrucciones de puesta en marcha en `README.md`.

## 5. Contrato de testabilidad
Para ejecutar las pruebas comparables de todos los alumnos, la UI debe incluir estos `data-testid` independientemente de cómo se presente visualmente:

| Identificador | Tipo esperado |
|---|---|
| `task-title` | input del título |
| `task-description` | textarea o input descripción |
| `task-submit` | botón guardar/crear |
| `task-item` | raíz repetida por tarea |
| `task-toggle` | acción completar/reabrir dentro de task-item |
| `task-delete` | acción borrar dentro de task-item |
| `filter-all` | control todas |
| `filter-pending` | control pendientes |
| `filter-completed` | control completadas |
| `progress-value` | elemento visible que incluye porcentaje |

Se admite confirmación nativa (`window.confirm`) o modal propio. Si se usa modal, añadir `data-testid="confirm-delete"` al botón confirmatorio y `data-testid="cancel-delete"` al botón de cancelar.

## 6. Criterios de aceptación ejecutables como historias
1. Dado un formulario vacío, al enviar no se crea una tarea y se ve un error.
2. Dado un título válido `Preparar examen`, al crear aparece una tarea Pendiente con dicho título.
3. Dadas dos tareas, marcar una Completada muestra el progreso `50%` y al reabrirla vuelve a `0%`.
4. Dadas tareas de ambos estados, el filtro Pendientes solo muestra las pendientes y Todas vuelve a mostrar ambas.
5. Dada una tarea creada, refrescar la página conserva la tarea y su estado.
6. Dada una tarea, pulsar Eliminar y cancelar NO la borra; confirmar sí.
7. Dada una lista vacía, el progreso es `0%` y existe un mensaje de estado vacío comprensible.

## 7. Fuera de alcance
No añadir: autenticación, sincronización entre dispositivos, servidor, IA dentro de la app, drag-and-drop, notificaciones push, calendarios, analítica de terceros ni despliegue cloud.

## 8. Restricciones de la dinámica
El equipo decide por sí mismo el diseño y la estructura interna; los requisitos anteriores son innegociables. Si surge ambigüedad, documentar el supuesto y tomar una decisión razonable. No incorporar requisitos no documentados antes de completar los obligatorios.
