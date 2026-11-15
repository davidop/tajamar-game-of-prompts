# 🛡️ Casa Spec Kit + GitHub Copilot CLI

> Ejecutar instalación antes del taller. Revisa la [guía oficial](https://github.github.com/spec-kit/integrations/copilot.html).

## 1. Preparar el workspace

Desde la raíz del workshop:

```bash
npm run setup -- --framework spec-kit --name alumno01
cd workspaces/alumno01
npm install
npm run dev
```

Comprueba en el navegador que se muestra el starter, aún **sin funcionalidades**.

## 2. Instalar Spec Kit en este workspace

```bash
uv tool install specify-cli
specify version
# El directorio ya contiene archivos; asegurarse de tener backup/commit.
specify init --here --force --integration copilot
```

En Windows se puede añadir `--script ps` para las utilidades de PowerShell si lo exige la versión de la herramienta. El `--force` confirma incorporación a un proyecto con archivos: inspecciona los cambios. Las skills Copilot resultantes normalmente están en `.github/skills/speckit-*/SKILL.md`.

## 3. Abrir GitHub Copilot CLI

```bash
copilot
```

Dentro de Copilot (no en PowerShell), comprueba los comandos:

```text
/speckit-constitution
/speckit-specify Partiendo únicamente de docs/02-documento-funcional.md, describe TaskForge y sus criterios de aceptación.
/speckit-clarify
/speckit-plan
/speckit-tasks
/speckit-implement
/speckit-analyze
```

Si un comando cambia de nombre o faltan skills, consulta el instalador y su documentación en vez de inventar un equivalente. Pon límites al alcance: un único MVP estático en Vite.

## 4. Validar antes de declarar éxito

```bash
npm run build
```

Revisar manualmente RF-01 a RF-07; si tienes Playwright disponible, ejecuta la batería común desde `evaluation/` del repositorio del taller.

**Evidencias:** especificación, plan, tareas, decisiones, captura, build y un caso probado que falló y se corrigió.
