# Publicar este kit en GitHub

Nombre recomendado: `tajamar-game-of-prompts`; propietario: `davidop`; **visibilidad pública** si se comparte con los alumnos. No subir la CR sorpresa ni materiales privados del docente.

## Opción A — GitHub CLI (recomendada)

Instalar [GitHub CLI](https://cli.github.com/) e iniciar sesión (`gh auth login`). Desde la raíz de este proyecto:

```bash
# Si todavía no hay un remoto asociado
gh repo create davidop/tajamar-game-of-prompts --public --source=. --remote=origin --push
```

El proyecto se entrega con commit inicial e historial Git. También puedes ejecutar `bash scripts/publish-github.sh` o, en PowerShell, `./scripts/publish-github.ps1`. Si la CLI señala un conflicto de nombre, elegir otro nombre disponible; no sobrescribir un repositorio existente.

## Opción B — Interfaz de GitHub

1. Abrir https://github.com/new y crear `tajamar-game-of-prompts` bajo la cuenta `davidop`.
2. Elegir **Public** y **NO** marcar `Add a README file`, `.gitignore` ni licencia (ya están aquí).
3. Desde la carpeta descargada (que contiene `.git` si se usó el bundle):

```bash
git remote add origin https://github.com/davidop/tajamar-game-of-prompts.git
git push -u origin main
```

Si se descomprimió el ZIP (que no contiene `.git`), ejecutar primero:

```bash
git init -b main
git add .
git commit -m "docs: initial Tajamar SDD workshop kit"
```

## Después de publicar

- Verificar Actions > **Quality gate**.
- Compartir README y guía de prerrequisitos con antelación.
- No enviar el kit privado del facilitador a los alumnos.
- Considerar **Use this template** en Settings > General > Template repository si se quieren instancias independientes por alumno.
