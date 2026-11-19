# Cómo ejecutarlo con GitHub Spec Kit

`specify` ya está instalado en tu máquina. Desde la carpeta del nuevo proyecto:

```bash
specify init hbomax-clone --integration claude
cd hbomax-clone
```

(Si tu versión usa otro flag, mira `specify init --help`.) Copia `spec.md` a `specs/001-hbomax-landing-clone/spec.md` y lanza en Claude Code, en este orden:

## 1. Constitution
```
/speckit.constitution Principios: React + TypeScript estricto; mobile-first; accesibilidad WCAG 2.2 AA; datos solo vía capa de servicios con mocks sustituibles; tests (Vitest/RTL + Playwright); no usar marcas, logos ni imágenes con copyright; proyecto educativo.
```

## 2. Specify
```
/speckit.specify Clon de la landing pública de HBO Max España con datos mock. Usa como base el archivo specs/001-hbomax-landing-clone/spec.md: header, hero promo, carrusel, raíles por categoría, sección deportes, planes mensual/anual con checkout mock, FAQ acordeón, footer, login mock.
```

## 3. Clarify
```
/speckit.clarify
```
Resuelve las preguntas abiertas de la sección 11 (branding ficticio, Tailwind vs CSS Modules, MSW, i18n, despliegue).

## 4. Plan
```
/speckit.plan React 18 + Vite + TypeScript, React Router, CSS Modules, TanStack Query, mocks en src/mocks con servicios async y latencia simulada, Vitest + React Testing Library, Playwright.
```

## 5. Tasks → Analyze → Implement
```
/speckit.tasks
/speckit.analyze
/speckit.implement
```

## Estructura objetivo

```
src/
  mocks/        titles.ts plans.ts slides.ts faq.ts sports.ts
  services/     catalogService.ts planService.ts authService.ts
  features/     hero/ rails/ carousel/ sports/ plans/ faq/ auth/ checkout/
  components/   Header Footer Card Accordion CookieBanner
  i18n/es.ts
  styles/tokens.css
```

## Antes de implementar: completar lo que falta del análisis
Faltan colores, tipografía y slides reales. Abre el sitio en el navegador, captura 375 px y 1440 px, y añade las capturas a `specs/001-hbomax-landing-clone/reference/` para que `/speckit.plan` y `/speckit.implement` las usen.
