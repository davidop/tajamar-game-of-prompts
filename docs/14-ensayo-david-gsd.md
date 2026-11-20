> **Importante:** Para mostrar el código y los artefactos publicados usa `workspaces/david-gsd/`. Para ejecutar comandos del framework con Git independiente, usa `npm run demo:prepare` y `demos/david-gsd/`. Las demos empiezan con un nuevo commit baseline, no con el historial original del ensayo.

# Ensayo de David — Casa GSD Core

**Objetivo:** recorrer GSD de PRD a aplicación funcional en GitHub Copilot CLI, registrando qué aporta el framework y dónde se atasca. [Protocolo compartido](13-ensayo-ponentes.md).

## A. Preparar el entorno (fuera del reloj)

```powershell
git clone https://github.com/davidop/tajamar-game-of-prompts.git
cd tajamar-game-of-prompts
npm run check
npm run doctor
git config --get user.name
git config --get user.email
npm run demo:prepare
cd demos/david-gsd
git rev-parse --show-toplevel
npm install
npx @opengsd/gsd-core@latest --copilot --local  # SOLO si necesitas actualizar la versión fijada
git status --short  # GSD ya está instalado en el snapshot; no reinstales sin necesidad
copilot
```

- `git rev-parse --show-toplevel` **debe** apuntar a `workspaces/david-gsd`. Si apunta a la raíz del kit, GSD no podrá generar commits de su trabajo de manera independiente. No continúes.
- Si no hay cambios que añadir tras instalar GSD, omite el commit de instalación.
- Dentro de Copilot CLI: `/model`, elegir y **registrar el mismo modelo que Jorge**. Confirmar `/gsd-help` y consultar `/gsd-progress` solo si ya existe estado.
- El documento de entrada es `docs/02-documento-funcional.md`; no editar su texto. El snapshot publicado ya incluye la aplicación construida; para enseñar un starter vacío crea un workspace con otro nombre mediante npm run setup.
- Mantén el framework instalado **solo en tu workspace**. Evita autoaceptar herramientas destructivas o enviar información sensible.
- Abrir `npm run dev` en otra terminal para mostrar la aplicación. Dejar Playwright preparado antes del reloj desde `evaluation/` en la raíz del kit.

## B. Ejecución real (dentro de Copilot CLI)

En el minuto 45, si se parte de un starter nuevo, iniciar:

```text
/gsd-new-project --auto @docs/02-documento-funcional.md
/gsd-progress
/gsd-plan-phase 1
/gsd-execute-phase 1
/gsd-verify-work 1
```

El snapshot publicado ya incluye el milestone completado. Para enseñar el proceso desde cero crea un workspace nuevo con el starter. Es una **secuencia de referencia**, no una orden de ejecutarla sin revisar: deja que termine cada comando, inspecciona `.planning/` y la fase que realmente proponga el roadmap. Si el plan reparte RF entre fases, registra la cobertura real y sigue la fase correspondiente. No fuerces una fase innecesaria para aparentar completitud.

- Si GSD te propone `/gsd-onboard` por tratar el starter como existente, documenta el tiempo extra. No omitas esa dificultad en las conclusiones.
- No permitas que el agente altere el PRD original, añada servicios externos o pase a producción.
- **Minuto 70:** recibirás el mismo cambio funcional que Jorge por un canal privado; incorpóralo mediante el flujo de cambio/fases de la versión instalada (ver `/gsd-help`). Conserva las decisiones anteriores.
- En Copilot CLI algunos recorridos de GSD fuerzan **ejecución secuencial**, incluso cuando el framework tiene conceptos de ejecución en olas. Compruébalo en la versión instalada; **no prometer una demo de agentes paralelos** antes del ensayo.
- `/gsd-verify-work 1` solicita UAT. Una verificación autodeclarada por el agente no sustituye los tests externos.

## C. Pruebas y evidencias

En el workspace:
```powershell
npm run build
git log --oneline -n 12
git status --short
```

En otra terminal, desde la raíz del kit, con TaskForge levantado en 5173:
```powershell
cd evaluation
npm test
```

Registra los RF que fallen, qué significa `PASS` en `VERIFICATION.md` respecto a Playwright y cuánto tardas en corregir desviaciones. Captura `.planning/` (roadmap, planes, resúmenes, verificación) y explica un caso en que el framework retuvo contexto útil.

## D. Historia que contarás al alumnado

**Idea de entrada:** «Le doy a GSD el mismo documento funcional que a Jorge. Vamos a ver cómo convierte contexto en fases y cómo mantiene el hilo cuando algo cambia».

**Puntos que debes enseñar:** planificación `.planning/` → ejecución/commits → prueba real → gestión de un cambio → límites observados.

**Mensaje de cierre:** GSD no debe ganar por ser rápido; debe demostrar que cumple el PRD con evidencias y que su esfuerzo de planificación/ejecución está justificado.

Referencias: [Quickstart GSD Core](https://github.com/open-gsd/docs/blob/main/core/quickstart.mdx) y [Instalación para Copilot](https://github.com/open-gsd/gsd-core/blob/next/docs/how-to/install-on-your-runtime.md).
