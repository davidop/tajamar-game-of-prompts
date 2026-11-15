# ⚔️ Game of Prompts — Spec Kit vs GSD Core

[![CI](https://img.shields.io/badge/CI-GitHub_Actions-informational)](./.github/workflows/quality.yml) ![Duración](https://img.shields.io/badge/Workshop-120_min-7046bf) ![Agent](https://img.shields.io/badge/Agent-GitHub_Copilot-24292f) ![Licencia](https://img.shields.io/badge/License-MIT-green)

**Una especificación. Dos frameworks. Un mismo desafío.** Laboratorio práctico para alumnos de Tajamar: todos parten del mismo documento funcional de **TaskForge**, todos usan **GitHub Copilot CLI** y cada alumno elige **Spec Kit** o **GSD Core**. El resultado se evalúa con criterios de aceptación comunes y una rúbrica de 100 puntos.

![Game of Prompts: dos casas](assets/duel.svg)

> **Importante:** aquí **no hay una aplicación resuelta**. El objetivo es que los estudiantes diseñen e implementen TaskForge con agentes. El cambio de requisitos del minuto 75 no está publicado aquí para preservar la dinámica.

## 🚀 Empezar en 3 pasos (alumnos)

**Antes del taller:** verifica el acceso a Copilot CLI y consulta [los requisitos previos](docs/06-prerrequisitos.md). Se requiere **Node.js >=22**, VS Code, Git, Python + `uv` si se elige Spec Kit, y acceso válido a GitHub Copilot CLI.

```bash
git clone https://github.com/davidop/tajamar-game-of-prompts.git
cd tajamar-game-of-prompts
npm run setup -- --framework spec-kit --name alumno01
# Alternativa: --framework gsd
cd workspaces/alumno01
npm install
npm run dev
```

Si todavía no se ha publicado este repositorio remoto, utiliza el ZIP descargado y ejecuta desde su carpeta `npm run setup -- ...`.

**Después**, abre la terminal integrada de VS Code, instala **solo el framework elegido** en `workspaces/alumno01` y utiliza `copilot`:
- 🛡️ [Ruta Spec Kit](docs/10-ruta-speckit.md)
- ⚡ [Ruta GSD Core](docs/11-ruta-gsd.md)

El código del alumno vive dentro de `workspaces/` (ignorado por Git para que no se mezclen entregas y no aparezcan artefactos de un framework en otro). El PRD original permanece disponible en el directorio `docs/` de cada workspace.

## 🎯 El reto

Construir una app web de gestión de tareas sin backend, con creación, listado, estados, eliminación con confirmación, filtros, `localStorage` y progreso. Diseño libre, pero todos deben respetar el [documento funcional PRD 1.0](docs/02-documento-funcional.md) y su contrato `data-testid` para las pruebas automáticas.

| Tramo | Actividad | Minutos |
|---|---|---:|
| 00–10 | Las dos casas: Spec Kit y GSD | 10 |
| 10–20 | PRD único y criterios de aceptación | 10 |
| 20–30 | Elección de casa y preparación | 10 |
| 30–45 | Especificación y planificación | 15 |
| 45–75 | Desarrollo asistido con Copilot CLI | 30 |
| 75–90 | Cambio sorpresa anunciado en directo | 15 |
| 90–105 | Pruebas, correcciones y build | 15 |
| 105–118 | Demos relámpago y marcador | 13 |
| 118–120 | Conclusiones | 2 |

## ⚖️ Reglas para una comparación válida

1. **Mismo PRD**, mismo starter, mismo tiempo y mismo modelo de Copilot cuando sea posible; la única variable intencional es el framework.
2. Una casa por persona o equipo. No instalar ambos frameworks en el mismo workspace.
3. Copilot CLI en terminal integrada de VS Code para todos; no mezclar modalidades de agente durante la competición.
4. Se permite corregir código manualmente, pero deben conservarse artefactos de planificación y evidencias de los cambios.
5. No introducir backend, servicios externos ni credenciales; revisar permisos propuestos por los agentes.
6. **No optimizar el marcador con soluciones precocinadas**: también importa trazabilidad, accesibilidad y explicación.

## 📂 Material incluido

| Ruta | Contenido | Público objetivo |
|---|---|---|
| [`starter/`](starter/) | Base Vite/JS/CSS **sin solución** | Alumno |
| [`docs/02-documento-funcional.md`](docs/02-documento-funcional.md) | PRD común y contrato E2E | Todos |
| [`docs/04-guia-alumnos.md`](docs/04-guia-alumnos.md) | Instrucciones de trabajo | Alumno |
| [`docs/10-ruta-speckit.md`](docs/10-ruta-speckit.md) | Instalación y flujo Spec Kit | Casa Spec Kit |
| [`docs/11-ruta-gsd.md`](docs/11-ruta-gsd.md) | Instalación y flujo GSD | Casa GSD |
| [`prompts/`](prompts/) | Prompts comunes de inicio y verificación | Alumno |
| [`evaluation/`](evaluation/) | Suite Playwright opcional (PRD base) | Todos / docente |
| [`results/scoreboard.html`](results/scoreboard.html) | Marcador local para puntuaciones | Docente |
| [`presentation/index.html`](presentation/index.html) | Presentación HTML local controlada con teclas | Docente |
| [`docs/01-guion-facilitador.md`](docs/01-guion-facilitador.md) | Guion minuto a minuto | Docente |
| [`docs/05-rubrica.md`](docs/05-rubrica.md) | Evaluación ponderada sobre 100 | Todos |
| [`docs/08-comparativa.md`](docs/08-comparativa.md) | Observaciones de método y validez | Todos |
| [`docs/09-faq.md`](docs/09-faq.md) | Errores y recuperación | Todos |
| [`scripts/`](scripts/) | Preparar workspace, comprobar entorno, validar kit | Todos |

## ✅ Verificación y entrega

```bash
# Proyecto de alumno
cd workspaces/alumno01
npm run build

# Volver a la raíz del workshop y ejecutar E2E contra app en http://127.0.0.1:5173
cd ../../evaluation
npm install
npx playwright install chromium
npm test
```

La suite de Playwright comprueba la funcionalidad **base**; los requisitos añadidos en directo se evalúan con los criterios que anunciará el facilitador. Las pruebas automatizadas no sustituyen la revisión humana de UX/accesibilidad.

```bash
# Desde la raíz, antes de impartir
npm run check
npm run doctor
```

## 🏆 Puntuación

**40** funcionalidad, **15** calidad/accesibilidad, **15** trazabilidad SDD, **15** gestión del cambio, **10** fiabilidad y **5** demo. Detalles en [la rúbrica](docs/05-rubrica.md). Las medias por casa sirven para debatir; la elección no está aleatorizada y no equivale a un benchmark científico.

## 👨‍🏫 Para facilitadores

Abrir [guion](docs/01-guion-facilitador.md), [presentación](presentation/index.html) y [marcador](results/scoreboard.html). El detalle de la **CR sorpresa** se distribuye **por separado al docente** y se revela simultáneamente a la clase al llegar al minuto 75. No se incluye en el repositorio público, ni en tests ni en ramas alternativas.

## 📚 Referencias y créditos

- [GitHub Spec Kit](https://github.com/github/spec-kit) · [Integración Copilot](https://github.github.com/spec-kit/integrations/copilot.html)
- [GSD Core](https://github.com/open-gsd/gsd-core) · [Instalación por runtime](https://github.com/open-gsd/gsd-core/blob/next/docs/how-to/install-on-your-runtime.md)
- [GitHub Copilot CLI](https://docs.github.com/es/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)
- Este es un **workshop docente independiente**; no está afiliado a los proyectos anteriores ni a los titulares de las marcas.

Código y documentación propios bajo [MIT](LICENSE). Licencias y marcas de terceros pertenecen a sus titulares.
