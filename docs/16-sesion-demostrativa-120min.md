# Guion de realización — sesión demostrativa de 120 minutos

**Ponentes:** Jorge (Spec Kit) y David (GSD Core). **Público:** asistentes observan, preguntan y comparan; no programan. **Objetivo:** demostrar el proceso completo y sus límites con un único PRD.

## Reglas de producción

- Dos ordenadores o dos entornos independientes, con **workspace Git propio**. Nunca compartir el mismo directorio ni hacer commits de demos sobre `main`.
- Instalar dependencias, autenticarse y descargar Playwright **antes** de comenzar. Registrar versión y modelo en ambos equipos.
- Preparar **checkpoints reales** para cada casa: A (starter y framework), B (especificación/plan), C (MVP implementado), D (tests y correcciones). Se pueden guardar como commits o etiquetas locales; no simular outputs de una ejecución.
- Cada demo de 25 minutos combina **un paso auténtico en vivo** con explicación de artefactos previamente generados en el ensayo. Si una generación tarda más de 3 minutos, explicar qué está haciendo y saltar al checkpoint preparado; dejar claro al público cuándo se cambia de estado.
- Capturas o grabación de respaldo de la ejecución completa para caídas de red, cuotas o problemas de Copilot.
- Mismo PRD, starter y pruebas; mismo modelo si está disponible en ambas cuentas. Anotar diferencias de versión y configuración.
- El cambio sorpresa se revela simultáneamente a ambos en el minuto 70. Guardar su documento y sus pruebas **fuera del repositorio público**.
- No presentar la puntuación de alumnos ni un «ganador» automático: se comparan **evidencias observables** y trade-offs.

## Escaleta

| Minutos | Pantalla | Qué mostrar / contar |
| --- | --- | --- |
| 00–10 | Diapositiva de contexto | Prompting vs. SDD; qué hace Copilot CLI y qué añade el framework |
| 10–20 | PRD TaskForge | RF-01..RF-07, restricciones, contrato `data-testid`; mismo punto de partida |
| 20–25 | Jorge: terminal | Framework, constitución, entrada al PRD |
| 25–35 | Jorge: artefactos | Spec, clarificaciones, plan y tareas; un prompt/comando real |
| 35–45 | Jorge: aplicación | Implementación parcial real, diff, build/checkpoint y decisiones |
| 45–50 | David: terminal | GSD local, `.planning/`, `/gsd-new-project` y roadmap |
| 50–60 | David: fases | Planificación de fase, tareas, ejecución y commits de GSD |
| 60–70 | David: aplicación | Verificación, diferencias respecto a Spec Kit, checkpoint |
| 70–75 | Ambos | Revelar cambio de requisitos; localizar impacto |
| 75–85 | Ambos | Adaptar especificaciones/planes y ejecutar un cambio real en cada solución |
| 85–90 | Ambos | Diffs, riesgos y trabajo pendiente; no ocultar fallos |
| 90–105 | Ambos | `npm run build`, Playwright, RF aprobados/fallidos, corrección de un fallo |
| 105–115 | Comparativa | Tiempo de arranque, trazabilidad, cobertura, esfuerzo humano, cambios, limitaciones |
| 115–120 | Q&A | Conclusiones y enlaces al repo/PRD |

## Ensayo general previo

1. Ejecutar cada recorrido **sin pausas ni ayuda cruzada** y medir tiempos reales.
2. Identificar comandos que necesitan confirmación, herramientas que no arrancan y prompts que producen demasiado alcance.
3. Validar todos los checkpoints, incluidas etiquetas Git y ejecución `npm run dev` tras recuperar cada estado.
4. Ensayar el cambio sorpresa en **ambas soluciones** y registrar regresiones con Playwright.
5. Ensayar el cambio de pantalla y de ponente; dejar un cronómetro visible y acordar quién avanza las diapositivas.
6. Preparar preguntas al público: «¿Qué parte del plan comprobaríais?», «¿Dónde buscaríais el impacto del cambio?», «¿Qué prueba demuestra que está terminado?».
7. Ajustar las demos para que duren **25 minutos cada una**, dejando tiempo de verificación y preguntas.

## Indicadores para comparar en la pantalla final

| Dimensión | Evidencia |
| --- | --- |
| Tiempo de planificación | Minutos hasta un plan ejecutable |
| Primer resultado | Minutos hasta una funcionalidad verificable |
| Cobertura | RF-01..RF-07 y resultado Playwright |
| Trazabilidad | Relación PRD → especificación/fase → código → test |
| Cambio | Qué se modifica y cuánto retrabajo implica |
| Fiabilidad | Build, regresiones, errores y recuperación |
| Esfuerzo humano | Decisiones, correcciones, bloqueos y prompts de rescate |

No equiparar una sola ejecución de dos ponentes a un benchmark estadístico.

## Accesos rápidos

- [PRD común](02-documento-funcional.md)
- [David: GSD](14-ensayo-david-gsd.md)
- [Jorge: Spec Kit](15-ensayo-jorge-speckit.md)
- [Playwright](../evaluation/README.md)
- [Comparativa](08-comparativa.md)

**Nota de mantenimiento:** los documentos históricos de alumno, rúbrica competitiva y scoreboard se conservan como material opcional/legado; **no forman parte de la agenda oficial de la sesión demostrativa**.
