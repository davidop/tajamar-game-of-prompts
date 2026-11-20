# ⚡ Casa GSD Core + GitHub Copilot CLI

> Ejecutar instalación antes del taller. Referencia: [instalación de GSD Core por runtime](https://github.com/open-gsd/gsd-core/blob/next/docs/how-to/install-on-your-runtime.md).

## 1. Preparar el workspace

Desde la raíz del workshop:

```bash
npm run setup -- --framework gsd --name alumno02
cd workspaces/alumno02
npm install
npm run dev
```

## 2. Instalar el framework en este workspace

```bash
npx @opengsd/gsd-core@latest --copilot --local
```

Instala GSD **de forma local en el workspace**, no globalmente en todo el equipo (para evitar interferencias con prácticas de otras personas). Lee la salida del instalador y comprueba instrucciones y hooks en la ruta indicada. Inicia una sesión **nueva** de Copilot CLI:

```bash
copilot
```

## 3. Planificar y construir en Copilot CLI

```text
/gsd-new-project --auto @docs/02-documento-funcional.md
/gsd-progress
/gsd-plan-phase 1
/gsd-execute-phase 1
/gsd-verify-work 1
```

Si el starter provoca un flujo de **proyecto existente**, GSD ofrece `/gsd-onboard`; decidirlo en el ensayo docente con la versión instalada. Si el proyecto se divide en varias fases, prioriza RF-01 a RF-07 y registra las que no lleguen a implementarse. Confirma en `/gsd-help` la sintaxis de comandos de la versión instalada.

**Importante:** `npm run setup` crea un repositorio Git independiente en el workspace. Comprueba `git rev-parse --show-toplevel`; GSD necesita poder registrar commits y no debe ejecutar dentro de la raíz del kit.

## 4. Validación

```bash
npm run build
```

El paso `/gsd-verify-work` es útil, pero la aplicación **no se considera terminada** hasta ejecutar y comprobar comportamientos con los criterios comunes. Documentar artefactos `.planning/`, decisiones y pendientes.

**Evidencias:** fases, resultados de verificación, captura, build y una corrección real.
