param([string]$Owner = 'davidop', [string]$Repo = 'tajamar-game-of-prompts')
$ErrorActionPreference = 'Stop'
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw 'Instala GitHub CLI (https://cli.github.com/) y ejecuta gh auth login.'
}
& gh auth status 2>$null
if ($LASTEXITCODE -ne 0) { throw 'Inicia sesión: gh auth login' }
& gh repo view "$Owner/$Repo" *> $null
if ($LASTEXITCODE -eq 0) { throw "Ya existe $Owner/$Repo; no se sobrescribirá." }
Set-Location (Resolve-Path (Join-Path $PSScriptRoot '..'))
& git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
  & git init -b main
  & git add .
  & git commit -m 'chore: initialize Tajamar SDD workshop'
}
& gh repo create "$Owner/$Repo" --public --source=. --remote=origin --push
if ($LASTEXITCODE -ne 0) { throw 'No se pudo publicar el repositorio; revisa la salida de GitHub CLI.' }
Write-Output "Publicación terminada: https://github.com/$Owner/$Repo"
