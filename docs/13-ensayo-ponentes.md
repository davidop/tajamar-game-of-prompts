# Ensayo conjunto de ponentes — Game of Prompts

**Formato definitivo:** sesión demostrativa de 120 minutos, no taller de alumnos.
**Guion principal:** [16-sesion-demostrativa-120min.md](16-sesion-demostrativa-120min.md).

## Preflight (antes de entrar en directo)

1. Clonar el repositorio, comprobar `npm run check`, `node --version` y `git --version`.
2. Ejecutar `npm run demo:prepare` **una sola vez**. Se crean dos copias independientes de los snapshots publicados bajo `demos/`, con Git propio. No se recupera el historial original de commits; no fingirlo.
3. En cada demo: `npm ci`, `npm test`, `npm run build`. Abrir `npm run dev` y comprobar TaskForge en el navegador.
4. En `evaluation/`: `npm ci`, `npx playwright install chromium`. Probar cada implementación con `TASKFORGE_WORKSPACE`; Playwright arranca el servidor automáticamente.
5. Validar el [workflow de GitHub Actions](../.github/workflows/quality.yml) y guardar el enlace a la ejecución correcta.
6. Autenticarse en Copilot CLI, comprobar GSD/Spec Kit, modelo seleccionado y comandos. Preparar una captura o vídeo de respaldo.
7. Ensayar la transición entre ambos ponentes y tener abierta la [presentación](../presentation/index.html).

## Recorrido de demostración

| Tiempo | Evidencia |
| --- | --- |
| 00–20 | PRD, contrato y diferencias de metodología |
| 20–45 | Jorge: spec → plan → tasks → código → tests |
| 45–70 | David: PROJECT/ROADMAP → fases → plans → código → tests |
| 70–90 | Cambio privado: impacto en ambas metodologías |
| 90–105 | Ejecutar y comentar builds + Playwright, sin ocultar fallos |
| 105–120 | Comparar trade-offs, dudas y cierre |

**Regla de transparencia:** las implementaciones de `workspaces/` son resultados del ensayo; `demos/` son copias con un **nuevo commit baseline**, no la historia Git real de las fases. Si se usa un checkpoint preparado, anunciarlo. No presentar una ejecución como si hubiera ocurrido en directo cuando es pregrabada.

## Material que NO se publica

La especificación exacta del cambio sorpresa y sus pruebas adicionales deben permanecer fuera de `main` hasta el momento de revelarlo.

## Accesos

- [David: GSD](14-ensayo-david-gsd.md)
- [Jorge: Spec Kit](15-ensayo-jorge-speckit.md)
- [Playwright](../evaluation/README.md)
- [Comparativa](08-comparativa.md)
