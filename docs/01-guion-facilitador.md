# Guion del facilitador — 120 minutos

## Objetivos de aprendizaje
1. Distinguir LLM/harness (GitHub Copilot) de framework de orquestación (Spec Kit o GSD Core).
2. Transformar un documento funcional en artefactos operativos, tareas y una implementación.
3. Comprobar los requisitos mediante pruebas y no solo a través de una demo convincente.
4. Medir gestión del cambio, trazabilidad, esfuerzo y contexto.

## Agenda y notas
| Reloj | Minutos | Actividad | Evidencia |
|---|---:|---|---|
| 00-10 | 10 | Contexto SDD + presentación de casas | Entender la dinámica |
| 10-20 | 10 | Presentación del PRD y preguntas sobre requisitos | Comprensión del alcance |
| 20-30 | 10 | Elección de casa, apertura del proyecto y verificación | Copilot + framework listo |
| 30-45 | 15 | Generar especificaciones, planes y tareas | Primer commit de artefactos |
| 45-75 | 30 | Implementación incremental | MVP de funciones principales |
| 75-90 | 15 | Cambio sorpresa + adaptación | Evidencias del cambio |
| 90-105 | 15 | Test, build, revisión y commit | Tests y build |
| 105-118 | 13 | Demos relámpago y tabla de puntuaciones | Comparativa por casa |
| 118-120 | 2 | Conclusión y QR de encuesta | Aprendizaje reflexivo |

## Roles de ponentes (si son dos)
- Moderador: marca ritmo, anuncia cambio, dirige debate y recopila métricas.
- Soporte técnico: solventa problemas de login / dependencias y ayuda a ejecutar tests; no desarrolla por los alumnos.

## Reglas de equidad
- Todos reciben el mismo `docs/02-documento-funcional.md`; nada de soluciones prediseñadas.
- VS Code como editor y Copilot CLI como agente para todos: misma familia de modelo seleccionada, misma licencia/política si es posible.
- El código se produce con ayuda del agente; el alumno revisa, decide y puede editar. No puntuar el número de mensajes como métrica de calidad.
- Prohibido utilizar SaaS, API keys, servicios externos, otros asistentes o frameworks distintos al asignado.
- No sobrescribir el documento funcional. Se permite enriquecer especificaciones derivadas y documentar supuestos.
- Copilot CLI solicita confirmaciones de acciones; no aconsejar permisos ilimitados. No ejecutar scripts no revisados.
- Todos realizan un commit inicial y uno final. Guardar timestamps de inicio y fin.
- Permitir a quienes se atasquen proseguir con un MVP mínimo, no introducir ayuda que desvirtúe la comparación.

## Demos finales
Pedir 3-4 alumnos de diferentes casas (preferible 2 por cada) para enseñar 60-90 s de aplicación, 30 s artefactos, 30 s evidencia de pruebas. Mostrar también la media por casa y no solo la mejor entrega.

## Preguntas de debrief
- ¿Qué parte del proceso aportó más valor: preguntas iniciales, planificación, ejecución o validación?
- ¿Cuánto trabajo quedó por hacer tras una demo aparentemente terminada?
- ¿Qué casa gestionó el cambio anunciado con más trazabilidad y menos retrabajo?
- ¿Hubo context rot, instrucciones olvidadas o decisiones inconsistentes?
- ¿Qué framework elegirías para un proyecto sujeto a auditoría? ¿Y para un MVP personal?

## Riesgos
- Auth/quotas de Copilot → validar con una pregunta trivial 24-48 h antes.
- Confusión VS Code vs Copilot CLI → mostrar terminal integrada, no Chat de VS Code para una casa y CLI para otra.
- `npm install` / descargas → paquetes cacheados, opción starter preparado.
- Algunos alumnos no llegan a tiempo → puntuar artefactos/funcionalidad parcial y organizar demos representativas.
- El docente no debe adjudicar la victoria automáticamente a GSD ni Spec Kit: evidencia primero.
