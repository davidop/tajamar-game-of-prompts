# Checklist de preparación (enviar 48 h antes)

## Equipo
- [ ] Windows, macOS o Linux con VS Code y Git.
- [ ] Node.js 22 o superior, npm operativo, Python 3.11+ y uv.
- [ ] `npm install -g @github/copilot` o `winget install GitHub.Copilot` y `copilot` abre la consola.
- [ ] Autenticación GitHub con `/login` dentro de Copilot CLI; pregunta de prueba correcta.
- [ ] Confirmar que la organización permite GitHub Copilot CLI; plan y cuota disponibles.
- [ ] Acceso a `npm`, PyPI y GitHub sin proxy bloqueante.
- [ ] Instalar/preparar y probar al menos un framework antes del taller.

## Preparación del equipo docente
- [ ] Probar Spec Kit `specify init` con el starter y verificar menú `/speckit-*`.
- [ ] Probar GSD Core `--copilot --local` en una carpeta aislada y verificar `/gsd-*` en Copilot CLI.
- [ ] Registrar versiones (Node, Copilot CLI, Spec Kit, GSD) y fijarlas para todos. `@latest` solo durante preparación; evitar drift entre máquinas el día del evento.
- [ ] Seleccionar un modelo de Copilot disponible en todas las cuentas y comprobar límites de uso.
- [ ] Reservar repositorios por alumno o permitir ZIP local + commit, sin interacciones sobre el repositorio base común.
- [ ] Probar `npm install` y `npm run dev` del starter.
- [ ] Instalar Playwright Chromium en el equipo de evaluación si se usarán pruebas E2E.
- [ ] Preparar proyector/timer, proyección de scoreboard y enlaces al PRD.
- [ ] No filtrar el CR-01 antes del minuto 75.

## Fuentes
- https://docs.github.com/es/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli
- https://github.github.com/spec-kit/integrations/copilot.html
- https://github.com/open-gsd/gsd-core/blob/next/docs/how-to/install-on-your-runtime.md
