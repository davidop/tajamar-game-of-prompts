# Guion exprés: mostrar el repositorio en 5 minutos

**Objetivo:** presentar el valor del repo sin depender de generación de IA, instalaciones o una demo en vivo que pueda atascarse.

## 00:00–00:45 — Portada y alcance

Abrir [README](../README.md). Decir:

> Game of Prompts es una sesión demostrativa de 2 horas: mismo PRD, mismo agente (GitHub Copilot CLI), dos metodologías y dos implementaciones reales. Jorge presenta Spec Kit y David presenta GSD Core.

Señalar la agenda, el badge de GitHub Actions y los accesos directos a los dos workspaces.

## 00:45–01:30 — El contrato común

Abrir [PRD TaskForge](02-documento-funcional.md). Enseñar los siete requisitos RF-01…RF-07 y los `data-testid`. Mensaje: **comparar sin una especificación compartida no tiene sentido**.

## 01:30–02:20 — Casa Spec Kit (Jorge)

Abrir [Spec Kit](../workspaces/jorge-speckit/specs/001-taskforge-mvp/) y luego [código](../workspaces/jorge-speckit/src/). Enseñar `spec.md`, `plan.md`, `tasks.md` y una prueba de `tests/`. Mensaje: **decisiones explícitas antes del código**.

## 02:20–03:10 — Casa GSD Core (David)

Abrir [ROADMAP](../workspaces/david-gsd/.planning/ROADMAP.md), [auditoría del milestone](../workspaces/david-gsd/.planning/milestones/v1.0-MILESTONE-AUDIT.md) y [código](../workspaces/david-gsd/src/). Mostrar la secuencia de fases y la relación requisitos → planes → verificación. Mensaje: **contexto persistente y trabajo por fases**.

Importante: el milestone declara 19/19 requisitos y 63 tests. Son resultados documentados en el repositorio; las pruebas independientes se ven en GitHub Actions.

## 03:10–04:20 — Evidencia verificable

Abrir [Quality gate](https://github.com/davidop/tajamar-game-of-prompts/actions/workflows/quality.yml). Mostrar los jobs:

- Kit y starter.
- Spec Kit: unit tests + build.
- GSD Core: unit tests + build.
- Spec Kit: Playwright RF-01…RF-07.
- GSD Core: Playwright RF-01…RF-07.

**Si algún job está rojo o pendiente, explicarlo.** No sustituir resultados reales por los de los informes del agente.

## 04:20–05:00 — Cierre y llamada a la acción

Abrir [presentación HTML](../presentation/index.html) y [guion de 120 minutos](16-sesion-demostrativa-120min.md). Decir:

> El objetivo no es declarar un ganador universal. Queremos enseñar qué artefactos deja cada metodología, cómo responde a un cambio y qué evidencias demuestran que funciona.

**No revelar el cambio sorpresa** durante esta presentación del repositorio.

## Contingencia: sin terminal ni red

Tener abiertas previamente las pestañas de README, PRD, ambas carpetas, Actions y presentación. Si GitHub Actions no termina a tiempo, mostrar la ejecución en curso y las pruebas unitarias ya completadas; no afirmar que Playwright está verde.

## Comandos rápidos para una demo local (opcional)

```powershell
git clone https://github.com/davidop/tajamar-game-of-prompts.git
cd tajamar-game-of-prompts
npm run check
npm ci --prefix workspaces/david-gsd
npm --prefix workspaces/david-gsd run dev
```

Para mostrar Spec Kit, detener antes el servidor GSD y sustituir `david-gsd` por `jorge-speckit`. Las dos aplicaciones usan el puerto 5173.

**Si vas a invocar GSD o Spec Kit para generar commits:** ejecutar primero `npm run demo:prepare` y trabajar dentro de `demos/david-gsd` o `demos/jorge-speckit`, nunca en los snapshots versionados.
