# ⚔️ Game of Prompts — Spec Kit vs GSD Core

![Game of Prompts: dos casas](assets/duel.svg)

**Sesión técnica demostrativa de 120 minutos · Tajamar**

**Una especificación. Dos metodologías. Un mismo desafío.** Jorge presenta **GitHub Spec Kit** y David presenta **GSD Core**, ambos con **GitHub Copilot CLI**. El público observa cómo los agentes convierten el mismo PRD de TaskForge en especificaciones, planes, código y pruebas, y cómo reaccionan ante un cambio de requisitos.

> **Formato:** demostración en directo de los dos ponentes, no workshop práctico. Los asistentes **no necesitan instalar herramientas, programar ni entregar ejercicios**. El repositorio contiene el starter y la documentación para reproducir el ejemplo voluntariamente.

## 🎬 Agenda de la sesión

| Tiempo | Contenido | Responsable |
| --- | --- | --- |
| 00–10 | Del prompting al Spec-Driven Development | Ambos |
| 10–20 | PRD de TaskForge y condiciones de comparación | Ambos |
| 20–45 | Demo Spec Kit: especificación, planificación y código | Jorge |
| 45–70 | Demo GSD Core: contexto, fases, ejecución y commits | David |
| 70–90 | Cambio de requisitos en ambas soluciones | Ambos |
| 90–105 | Playwright, errores reales y correcciones | Ambos |
| 105–115 | Comparativa técnica: trazabilidad, cobertura y fricción | Ambos |
| 115–120 | Preguntas y conclusiones | Ambos |

**Guion principal:** [docs/16-sesion-demostrativa-120min.md](docs/16-sesion-demostrativa-120min.md).

## 🧪 Caso práctico común

[TaskForge](docs/02-documento-funcional.md) es una app web de gestión de tareas con creación, estados, borrado con confirmación, filtros, persistencia en `localStorage` y progreso. Ambos ponentes parten del **mismo PRD 1.0**, del **mismo starter Vite** y de un modelo Copilot equivalente siempre que sea posible.

- [Starter sin resolver](starter/)
- [PRD y contrato de testabilidad](docs/02-documento-funcional.md)
- [Pruebas de aceptación Playwright](evaluation/)
- [Consigna común](prompts/prompt-comun.md)
- [Comparativa metodológica](docs/08-comparativa.md)

## 👥 Preparación de ponentes

- [Protocolo de ensayo conjunto](docs/13-ensayo-ponentes.md)
- [David — GSD Core](docs/14-ensayo-david-gsd.md)
- [Jorge — Spec Kit](docs/15-ensayo-jorge-speckit.md)
- [Guion de realización y checkpoints](docs/16-sesion-demostrativa-120min.md)
- [Resultados del ensayo](results/plantilla-ensayo-ponentes.csv)

**Antes de la sesión:** ambos ensayan el recorrido completo, preparan checkpoints reales (baseline, plan, implementación y validación), verifican las pruebas y dejan las dependencias instaladas. Durante la sesión ejecutan pasos reales, sin depender de que un agente complete todo en una ventana de 25 minutos.

### Crear un workspace aislado para reproducir las demos

Requiere Node.js 22+, Git configurado y GitHub Copilot CLI. Spec Kit necesita también Python y uv.

```bash
git clone https://github.com/davidop/tajamar-game-of-prompts.git
cd tajamar-game-of-prompts
npm run check
npm run doctor

# David
npm run setup -- --framework gsd --name david-gsd

# Jorge, en su propia máquina
npm run setup -- --framework spec-kit --name jorge-speckit
```

Cada workspace contiene su **propio repositorio Git**, independiente de la rama `main` del kit. El código generado se guarda en `workspaces/`, que está ignorado en el repositorio público.

## 🛡️ Material reservado

El cambio funcional que se introduce en la demo se distribuye por separado entre los ponentes. **No subir soluciones completas ni el cambio sorpresa al repositorio público**. Las implementaciones de ensayo pueden conservarse en local o en repositorios privados separados.

## 📚 Referencias

- [GitHub Spec Kit](https://github.com/github/spec-kit) · [Integración Copilot](https://github.github.com/spec-kit/integrations/copilot.html)
- [GSD Core](https://github.com/open-gsd/gsd-core)
- [GitHub Copilot CLI](https://docs.github.com/es/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)

Código y documentación propios bajo [MIT](LICENSE). Sesión independiente, sin afiliación con los proyectos anteriores.
