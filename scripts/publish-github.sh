#!/usr/bin/env bash
set -euo pipefail
OWNER="${1:-davidop}"
REPO="${2:-tajamar-game-of-prompts}"
if ! command -v gh >/dev/null 2>&1; then
  echo 'Instala GitHub CLI (https://cli.github.com/) y ejecuta gh auth login.' >&2
  exit 1
fi
gh auth status >/dev/null || { echo 'Antes inicia sesión: gh auth login' >&2; exit 1; }
if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "Ya existe $OWNER/$REPO; no se va a sobrescribir." >&2
  exit 2
fi
cd "$(dirname "$0")/.."
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init -b main
  git add .
  git commit -m 'chore: initialize Tajamar SDD workshop'
fi
gh repo create "$OWNER/$REPO" --public --source=. --remote=origin --push
printf 'Publicación terminada: https://github.com/%s/%s\n' "$OWNER" "$REPO"
