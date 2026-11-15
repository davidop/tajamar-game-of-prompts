# Ensayo de Jorge — Casa Spec Kit

**Objetivo:** recorrer Spec Kit desde constitución y especificación hasta tareas, implementación y pruebas usando el mismo TaskForge que David. [Protocolo compartido](13-ensayo-ponentes.md).

## A. Preparación (fuera del reloj)

```powershell
git clone https://github.com/davidop/tajamar-game-of-prompts.git
cd tajamar-game-of-prompts
npm run check
npm run doctor
git config --get user.name
git config --get user.email
npm run setup -- --framework spec-kit --name jorge-speckit
cd workspaces/jorge-speckit
git rev-parse --show-toplevel
npm install
uv tool install specify-cli
specify version
specify init --here --force --integration copilot
git add -A
git commit -m "chore: install Spec Kit for rehearsal"
copilot
```

- El proyecto debe tener `.git` propio. Confirmar que no se está alterando `main` del kit.
- `--force` acepta combinar Spec Kit con un proyecto ya existente: revisar diff antes de registrar el commit.
- Dentro de Copilot CLI seleccionar en `/model` **exactamente el mismo modelo que David**. Comprobar que aparecen las skills `/speckit-*`.
- Preparar `npm run dev` y Playwright antes del reloj; dejar PRD sin modificar.

## B. Durante el ensayo, dentro de Copilot CLI

```text
/speckit-constitution
/speckit-specify Lee docs/02-documento-funcional.md y redacta la especificación de TaskForge sin alterar el PRD.
/speckit-clarify
/speckit-plan
/speckit-tasks
/speckit-implement
/speckit-analyze
```

La secuencia es orientativa: **no lanzar todos los pasos de una vez**. Tras cada uno, revisar el output y registrar las preguntas que Spec Kit requiera. Validar que `/speckit-specify` cubre RF-01..RF-07 y el contrato `data-testid`. En algunas versiones, `analyze` se utiliza antes de implementar para comprobar consistencia; registrar la secuencia empleada.

- **Minuto 75:** incorporar el mismo cambio privado anunciado a David, actualizando especificación, plan y tareas antes de editar código.
- Preguntar cuándo el rigor documental aporta valor y cuándo consume tiempo que necesita el MVP.
- Documentar especificaciones, plan, tareas y diffs de corrección.

## C. Pruebas

Desde el workspace: `npm run build` y `git log --oneline -n 12`. Con `npm run dev` activo, desde `evaluation/` en la raíz: `npm test`. Registrar RF cubiertos, fallos, esfuerzo humano y tiempos.

## D. Historia que contarás

**Idea de entrada:** «Con el mismo PRD vamos a hacer explícitas las reglas, las decisiones, la arquitectura y las tareas antes de pedir código».

**Mostrar:** constitución → especificación → plan → tareas → código → verificación.

**Mensaje de cierre:** el valor de Spec Kit no está en generar más documentos, sino en reducir ambigüedad y hacer que las decisiones puedan revisarse en equipo.

Referencia: [GitHub Copilot + Spec Kit](https://github.github.com/spec-kit/integrations/copilot.html) y [Quickstart Spec Kit](https://github.github.com/spec-kit/quickstart).
