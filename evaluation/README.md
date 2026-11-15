# Acceptance suite (pruebas comunes del PRD base)

Tests E2E con Playwright que consumen el contrato `data-testid` del PRD. No son un benchmark completo de UX; complementarlos con revisión humana.

1. En el proyecto de un alumno, `npm run dev` en puerto 5173.
2. Aquí ejecutar `npm install` y una vez `npx playwright install chromium`.
3. `npm test`. Puede utilizarse `BASE_URL=http://localhost:5173 npm test`.
4. La configuración de app del alumno debe admitir los controles documentados; cualquier divergencia debe puntuarse manualmente y registrarse, no inventar fallos de funcionalidad.

Para comparar condiciones, cada entrega debe tener una sesión aislada de navegador nueva. La batería crea datos con interfaz; no depende de la representación interna de `localStorage`.

5. El suite comprueba únicamente los requisitos RF-01 a RF-07 del PRD 1.0; **no contiene el cambio sorpresa**.
6. Requiere Node.js 22+ y Playwright con navegador Chromium. El runner de CI del kit no ejecuta estas pruebas sobre una app resuelta, porque el starter está deliberadamente incompleto.
