# Contribuir / Contributing

Gracias por ayudar a que **Game of Prompts** sea un experimento abierto, verificable y útil.

## Antes de empezar / Before you start

1. Lee el [PRD común](docs/02-documento-funcional.md) y los [criterios de aceptación](evaluation/README.md).
2. Busca si existe una [issue](https://github.com/davidop/tajamar-game-of-prompts/issues) relacionada.
3. Abre una issue para cambios de alcance o nuevas metodologías antes de enviar una PR grande.
4. Trabaja en una rama propia; evita modificar los snapshots publicados sin explicar el motivo.
5. Mantén **sin implementación** el directorio `starter/`.

## Validación / Validation

```bash
npm ci --prefix workspaces/david-gsd
npm ci --prefix workspaces/jorge-speckit
npm --prefix workspaces/david-gsd test
npm --prefix workspaces/jorge-speckit test
npm --prefix workspaces/david-gsd run build
npm --prefix workspaces/jorge-speckit run build
```

Para E2E consulta [evaluation/README.md](evaluation/README.md). Documenta versión de Node, modelo y framework cuando aportes resultados.

## Pull requests

- Explica **problema, cambio, pruebas y riesgos**.
- Añade capturas **reales** si hay cambios visuales (sin datos personales).
- Mantén accesibilidad, navegación por teclado y responsive.
- No subas credenciales, datos personales, el cambio sorpresa reservado ni la presentación oficial antes de que Jorge la facilite.
- Mantén el mismo contrato de evaluación para ambas implementaciones.
- No conviertas recuentos de tests de distinto alcance en una puntuación de calidad.

**English:** Please describe the problem, proposed change, validation steps and limitations. Keep tests reproducible and disclose differences in environment or model.
