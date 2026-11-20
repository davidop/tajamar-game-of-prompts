# Continúa aprendiendo: Game of Prompts

Este repositorio acompaña una **demostración de 120 minutos** para alumnado de Grado Superior. No es un taller obligatorio ni exige seguir los comandos durante la sesión.

## Qué vas a aprender

- Separar **requisitos**, **planificación**, **implementación** y **verificación** al trabajar con agentes.
- Contrastar GSD Core y Spec Kit sobre el **mismo documento funcional**.
- Evaluar el software por **pruebas de aceptación compartidas**, no por cantidad bruta de tests ni por la velocidad de una única ejecución.
- Revisar cambios y detectar regresiones antes de dar por terminado un requisito.

## Recorrido recomendado después de la sesión (30–45 minutos)

1. Lee el [PRD de TaskForge](02-documento-funcional.md) e identifica RF01–RF07.
2. Consulta el [roadmap GSD](../workspaces/david-gsd/.planning/ROADMAP.md) y las [tareas Spec Kit](../workspaces/jorge-speckit/specs/001-taskforge-mvp/tasks.md). ¿Cómo organizan el trabajo de forma diferente?
3. Abre el [dashboard comparativo](../dashboard/index.html) en tu navegador tras descargar el repositorio. Sus cifras son una **instantánea**, no datos en tiempo real.
4. Ejecuta una de las soluciones y comprueba las funcionalidades.
5. Introduce un cambio pequeño en un workspace Git aislado, añade una prueba y ejecuta la suite de regresión.

## Preparación local

Necesitas Git y Node.js compatible con las dependencias del proyecto.

```bash
git clone https://github.com/davidop/tajamar-game-of-prompts.git
cd tajamar-game-of-prompts
npm ci --prefix workspaces/david-gsd
npm --prefix workspaces/david-gsd test
npm --prefix workspaces/david-gsd run build
npm --prefix workspaces/david-gsd run dev
```

Visita http://127.0.0.1:5173. Para ver la otra implementación, revisa su README y sus scripts antes de arrancarla; no ejecutes ambos servidores en el mismo puerto simultáneamente.

Para practicar con agentes, desde la raíz ejecuta `npm run demo:prepare` y trabaja en `demos/david-gsd` o `demos/jorge-speckit`. **No hagas experimentos directamente en los snapshots `workspaces/`**.

## Reto opcional para casa (no es el cambio sorpresa de la sesión)

Añade **búsqueda por texto** en el listado de tareas, sin distinguir mayúsculas/minúsculas y sin romper los filtros de estado. Antes de implementar:

- Escribe criterios de aceptación y casos límite.
- Pide al agente que proponga un plan y revísalo.
- Implementa y añade pruebas de regresión.
- Ejecuta tests, build y, cuando sea posible, E2E.
- Explica qué decisiones tomaste tú y cuáles sugirió el agente.

## Preguntas para debatir

- ¿Qué artefacto permite entender por qué se hizo un cambio?
- ¿Qué ocurre cuando el agente produce código que compila, pero incumple un requisito?
- ¿Cómo compararías ambas metodologías con varias ejecuciones, misma configuración y tiempos medidos?
- ¿Qué riesgos de seguridad y accesibilidad revisarías antes de producción?

## Evidencias y límites

La ejecución de referencia de [GitHub Actions](https://github.com/davidop/tajamar-game-of-prompts/actions/runs/44709353375) superó cinco jobs. Ambas soluciones superaron 9/9 pruebas E2E compartidas; GSD 63/63 unitarias y Spec Kit 10/10 unitarias, **con suites de alcance distinto**. No conviertas estos recuentos en una clasificación automática.

## Presentación de los ponentes

La presentación la prepara **Jorge fuera del repositorio**. Se incorporará aquí **después de la sesión**, cuando los ponentes compartan el archivo definitivo. No se incluye ni se recrea una versión provisional.
