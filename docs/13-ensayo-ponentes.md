# Ensayo de ponentes · Game of Prompts (Jorge vs. David)

**Propósito:** ejecutar el workshop completo antes de impartirlo. Los dos ponentes trabajan en paralelo con el mismo PRD y starter, pero en repositorios Git locales independientes.

| Ponente | Casa | Guía |
| --- | --- | --- |
| Jorge Fernández | Spec Kit | [Ruta del ensayo de Jorge](15-ensayo-jorge-speckit.md) |
| David Oliva | GSD Core | [Ruta del ensayo de David](14-ensayo-david-gsd.md) |

## 1. Preflight (antes de poner en marcha el reloj)

- Cada ponente clona el repo público en **su propio equipo**. **No trabajar directamente en main**.
- Node.js 22+, Git con `user.name` y `user.email`, VS Code, Copilot CLI autenticado y acceso al mismo modelo; Python/uv para Spec Kit.
- Comprobar `npm run doctor`, `npm run check`; GSD y Spec Kit se instalan en **workspaces distintos**.
- Seleccionar un modelo **fijo**, usando `/model` de Copilot CLI (no Auto), misma licencia y cuota si se puede. Registrar modelo, versiones y cualquier diferencia entre equipos.
- Preparar `evaluation/`: `npm install` y `npx playwright install chromium` **antes** del ensayo; confirmar que los navegadores arrancan. El starter no superará aún las pruebas funcionales, y eso es lo esperado.
- `npm run setup -- --framework gsd --name david-gsd` o `--framework spec-kit --name jorge-speckit` crea ahora un **repositorio Git propio dentro de workspaces/** con commit de baseline. `git rev-parse --show-toplevel` debe devolver la carpeta del workspace, no la raíz del kit.
- Ejecutar `npm install` en cada workspace, instalar el framework local, registrar `git status` y dejar un commit de **configuración**, de forma que el reloj mida el proceso SDD y no descargas.
- Ensayar el uso de `/help` y `/model` en Copilot CLI. Comprobar comandos del framework y disponibilidad del plan GitHub Copilot.

## 2. Reloj conjunto de 120 minutos

| Tiempo | Actividad | Evidencia mínima |
| --- | --- | --- |
| 00-10 | Presentación y framing: dos casas | Preguntas y mensaje central |
| 10-20 | Leer PRD / criterios RF y RNF | Supuestos comunes |
| 20-30 | Explicar instalación, workspaces y elección de casa | Entornos listos (preinstalados) |
| 30-45 | SDD: constitución/especificación o inicialización/planificación | Artefactos y plan revisables |
| 45-75 | Construir el MVP con Copilot | Primera funcionalidad real, % de RF cubiertos |
| 75-90 | Inyectar el mismo **cambio funcional privado**, anunciado simultáneamente | Plan actualizado y alcance del cambio |
| 90-105 | Build y pruebas de aceptación, correcciones | Resultados Playwright + revisión visual |
| 105-118 | 2 demos y comparación: aplicación, trazabilidad y fallos | Rúbrica completada |
| 118-120 | Mensaje de cierre | Qué cambiar antes de Tajamar |

**Regla:** el reloj no se detiene porque un framework tarde más. Registra los bloqueos y si un alumno habría podido recuperarse. No ayudar al otro con su implementación hasta el debrief.

## 3. Evidencias por ponente

Guardar un archivo local `rehearsal-notes.md` en **cada workspace**, al menos:
- modelo, versión de Copilot CLI y framework; OS/Node y fecha; hora de inicio;
- minutos: primera especificación, primer plan, primer flujo funcional, primer build correcto, comienzo/fin de verificación;
- RF-01 a RF-07: PASS/FAIL/NO TEST; accesibilidad y cambio;
- comandos de framework usados, tiempos muertos, preguntas, prompts manuales de rescate y problemas de contexto;
- `git log --oneline -n 12`, `npm run build`, `npm test` y capturas con datos ficticios;
- esfuerzo humano estimado (minutos de intervención) y observaciones.

Usar [CSV comparativo](../results/plantilla-ensayo-ponentes.csv) y [rúbrica](05-rubrica.md). Comparar también velocidad y tokens/coste **solo si ambos tienen medida homogénea**; si no, dejar N/D.

## 4. Revisión posterior (30 min fuera del reloj)

1. Repasar cronómetro y artefactos **sin ajustar retrospectivamente** los resultados.
2. Identificar problemas graves de instalación, comandos, autenticación, red y tiempos.
3. Decidir qué simplificar en el PRD o la agenda, y qué conservar para mostrar dificultades reales.
4. Validar que 30-45 min de planificación + 45 min de desarrollo son suficientes; si no, preinstalar aún más o reducir alcance.
5. Decidir cómo repartir la narración: Jorge explica Spec Kit, David GSD; turnarse en el papel de moderador.
6. No publicar en **este repo público** ni soluciones completas ni materiales privados del cambio. Conservar implementaciones en local o en repos privados distintos.

**No confundir ensayo docente con benchmark científico:** no hay aleatorización, muestra significativa ni control absoluto de experiencia personal; el aprendizaje está en comparar el proceso y los resultados visibles.

Referencias: [GSD Core](https://github.com/open-gsd/gsd-core) · [Spec Kit y Copilot](https://github.github.com/spec-kit/integrations/copilot.html) · [Copilot CLI](https://docs.github.com/es/copilot/reference/copilot-cli-reference/cli-command-reference).
