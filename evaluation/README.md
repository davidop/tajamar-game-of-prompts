# Playwright — contrato común RF-01…RF-07

Estas pruebas E2E usan los mismos `data-testid` para validar las implementaciones de **Jorge (Spec Kit)** y **David (GSD Core)**. Cada ejecución inicia una app Vite automáticamente, usa un contexto de navegador limpio y cierra el servidor al terminar.

## Requisitos

- Node.js 22+ y npm.
- Dependencias de la aplicación seleccionada instaladas.
- Playwright y Chromium instalados.

## Desde la raíz del repositorio

```bash
npm ci --prefix workspaces/david-gsd
npm ci --prefix workspaces/jorge-speckit
npm ci --prefix evaluation
cd evaluation
npx playwright install chromium
npm test
```

Por defecto `npm test` ejecuta la suite contra **GSD Core**.

Para ejecutar contra **Spec Kit**:

```powershell
# PowerShell (Windows)
$env:TASKFORGE_WORKSPACE="workspaces/jorge-speckit"
npm test
```

```bash
# bash (Linux/macOS)
TASKFORGE_WORKSPACE=workspaces/jorge-speckit npm test
```

Si quieres validar las **copias independientes** creadas con `npm run demo:prepare`, utiliza `demos/david-gsd` o `demos/jorge-speckit` como `TASKFORGE_WORKSPACE` e instala antes sus dependencias.

**No levantes manualmente otro Vite en el puerto 5173 durante la prueba**: el servidor de Playwright lo gestiona. Si ya hay un servidor activo en local, la configuración puede reutilizarlo; para comparar dos apps, detén cualquier servidor anterior.

## GitHub Actions

El workflow [Quality gate](../.github/workflows/quality.yml) ejecuta **unit tests, build y Playwright para ambas aplicaciones** en jobs aislados. Un fallo conserva informe HTML, trazas y capturas como artefacto.

**Alcance:** la suite cubre RF-01…RF-07 del PRD base. No incluye el cambio sorpresa ni sustituye una auditoría completa de accesibilidad. Los resultados de cada ejecución son la fuente de verdad; no se infiere PASS de la documentación de GSD o Spec Kit.
