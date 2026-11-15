# Guía del alumno — La batalla de los frameworks

## Objetivo
Construir TaskForge a partir de `docs/02-documento-funcional.md` con **GitHub Copilot CLI** y **exactamente uno** de los frameworks. Al final mostrarás la aplicación, sus artefactos y evidencias de calidad.

## Antes de entrar al taller
Tener VS Code, Git, Node.js >=22, Python >=3.11, uv, acceso activo a GitHub Copilot y GitHub Copilot CLI funcionando. La instalación debe verificarse con el equipo docente antes del evento.

## Flujo común
1. Crea una copia aislada del `starter` sin tocar el PRD común.
2. Elige **Spec Kit** o **GSD Core**. No instales ambos en un mismo proyecto.
3. Trabaja desde la terminal integrada de VS Code con `copilot` (no mezclar con Chat de VS Code durante la competición).
4. Usa el mismo modelo de Copilot que el resto de la clase, indicado por el docente.
5. Lee el PRD; haz una especificación/plan; implementa en incrementos verificables; prueba manualmente; ejecuta el build.
6. En el minuto 75 recibirás una CR nueva. No la implementes antes de recibirla.
7. Haz un commit final, registra el nivel de cumplimiento y prepara una demo de 60-90 segundos.

## Ruta A — Spec Kit
Instalación previa fuera del taller, recomendada en el directorio del proyecto:

```bash
uv tool install specify-cli
specify version
specify init --here --integration copilot
```

Si el starter está no vacío, `specify init --here` puede pedir confirmación o indicar conflicto: en la preparación verificar el mecanismo de inicialización sobre un directorio con código, crear un commit previo y revisar los cambios. `--force` solo tras respaldar el proyecto.

En Copilot CLI (NO en la shell), comandos del modo skills actual:

```text
/speckit-constitution
/speckit-specify Basándote únicamente en docs/02-documento-funcional.md, crea la especificación y criterios de aceptación de TaskForge.
/speckit-clarify
/speckit-plan
/speckit-tasks
/speckit-implement
/speckit-analyze
```

El facilitador puede acortar la secuencia si el tiempo apremia. Prioriza `/speckit-specify`, `/speckit-plan`, `/speckit-tasks` y `/speckit-implement`, y valida con tests/build.

## Ruta B — GSD Core
Instalación previa, desde el directorio de proyecto (scope local):

```bash
npx @opengsd/gsd-core@latest --copilot --local
```

Abrir un **nuevo proceso** de Copilot CLI para cargar el framework. En Copilot CLI (NO en la shell):

```text
/gsd-new-project --auto @docs/02-documento-funcional.md
/gsd-progress
/gsd-plan-phase 1
/gsd-execute-phase 1
/gsd-verify-work
```

Si el `ROADMAP.md` de GSD genera más de una fase, seleccionar la primera por prioridad de MVP y documentar las restantes. En caso de incompatibilidad de un comando con la versión instalada, usar `/gsd-help` o `/gsd-progress` para navegar. No se debe afirmar que haya cobertura funcional hasta ejecutar pruebas.

## Tras la petición CR-01
- Vuelve al documento de cambio; actualiza los artefactos creados por tu framework.
- Explica al agente cómo mantener compatibilidad con los datos y funcionalidades anteriores.
- Implementa y verifica la CR, sin modificar el PRD inicial.

## Evidencias que entregarás
- Nombre/casa, URL al repositorio o carpeta de entrega, screenshot de la aplicación.
- `npm run build` con resultado.
- Qué RF implementaste y cuáles faltan; qué pruebas superaste.
- Uno o dos archivos de especificación/plan creados por el framework.
- Tiempo aproximado de desarrollo y un fallo o decisión relevante.

## Seguridad
Lee las acciones propuestas por Copilot antes de ejecutarlas. No expongas credenciales, no uses API keys, evita comandos destructivos y no habilites aprobaciones globales por defecto.
