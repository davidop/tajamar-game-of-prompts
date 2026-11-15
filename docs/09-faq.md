# FAQ y troubleshooting

**`copilot` no existe** — Instalar GitHub Copilot CLI según la documentación oficial; reiniciar terminal y revisar PATH. Iniciar sesión con `/login`.

**Copilot aparece, pero no genera respuestas** — Comprobar suscripción/cuota y política de organización habilitada, conexión y login. Tener plan de contingencia con parejas o equipo compartido.

**`specify` no existe** — Revisar `uv tool install specify-cli` y `uv tool list`; volver a abrir terminal; verificar `specify version`.

**`/speckit-*` no aparece** — Inicializar Spec Kit en el **workspace del alumno**, con integración `copilot`; abrir una sesión nueva de Copilot CLI, verificar `.github/skills/` y las opciones de inicialización.

**`/gsd-*` no aparece** — Instalar GSD Core con `--copilot --local` dentro del proyecto, abrir nueva sesión de Copilot CLI; comprobar archivos que el instalador dice haber generado. Algunos runtimes presentan comandos como skills/agentes según versión.

**GSD sugiere un onboarding para una aplicación existente** — El starter contiene código mínimo. Se admite el flujo `/gsd-onboard` cuando corresponda; documentar la decisión y seguir el mismo PRD. El docente debe ensayar la ruta con la versión elegida.

**Spec Kit avisa que el directorio no está vacío** — El starter tiene archivos. Crear un commit/copia de seguridad inicial; luego ejecutar `specify init --here --force --integration copilot` para confirmar una incorporación consciente. Revisar cualquier sobrescritura.

**Playwright da error por no encontrar un elemento** — Confirmar que el alumno agregó el atributo `data-testid` indicado por el PRD y que el servidor está en el puerto esperado. Diferenciar contrato de testabilidad de fallo funcional real; complementar con revisión manual.

**`npm run build` falla** — Ejecutar `npm install` en el directorio que contiene `package.json`, no en otra carpeta. Revisar imports, sintaxis y dependencias añadidas por el agente.

**Windows PowerShell con `BASE_URL=...`** — La asignación inline es sintaxis bash. En PowerShell: `$env:BASE_URL='http://127.0.0.1:5173'; npm test`.

**El tiempo se agota** — Priorizar crear/listar/completar, persistencia y build. Registrar claramente lo no terminado. Una demo no implica validación completa.
