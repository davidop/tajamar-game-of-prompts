# Feature Specification: Clon de la landing de HBO Max España (React + mocks)

**Feature Branch**: `001-hbomax-landing-clone`
**Status**: Draft
**Fuente analizada**: https://www.hbomax.com/es/es (landing pública, usuario no autenticado)
**Alcance**: Réplica **educativa/demostrativa** del front. Sin backend real, sin streaming, sin pagos, sin marca registrada reutilizable (ver Restricciones legales).

---

## 1. Análisis del sitio original

La página es una **landing de captación** (no el catálogo logueado). Estructura de arriba abajo:

| # | Sección | Contenido observado |
|---|---------|---------------------|
| 1 | Header | Skip-link de accesibilidad, logo HBO Max (→ `/es/es`), enlace "Iniciar sesión", botón "Suscribirse" |
| 2 | Hero / banner promocional | Titular "desde 6,99 €/mes", promo add-on Deportes 5 €/mes con CTA, nota legal (suscripción obligatoria, renovación automática, disponibilidad por país, +18) |
| 3 | "Descubre lo mejor en…" | Carrusel con controles Anterior/Siguiente |
| 4 | "Entretenimiento incomparable" | Raíles por categoría: Películas, Para toda la familia, Drama, Comedia, Acción, True Crime. Tarjetas póster con título y etiqueta de marca (HBO Original, Warner Bros.) |
| 5 | Deportes | Hero de atleta + "HBO Max Sports"; "Tus deportes favoritos en directo" con 4 tiles DAZN (LaLiga, Premier League, F1, MotoGP) y enlace "Más información" |
| 6 | Planes y precios | Toggle Mensual/Anual (mensual por defecto), 4 tarjetas con "Seleccionar plan" |
| 7 | FAQ | Acordeón: ¿Qué es HBO Max?, ¿Qué es el plan HBO Max DAZN?, ¿Cómo me suscribo?, ¿Dónde está disponible?, ¿Qué dispositivos son compatibles? |
| 8 | Footer | Idioma "Español", sitemap, enlaces de categoría, legales, centro de ayuda, © 2026 HBO Nordic AB |

### Planes (datos reales observados → base de los mocks)

| Plan | Mensual | Anual | Dispositivos | Vídeo / descargas |
|---|---|---|---|---|
| Básico con anuncios | 6,99 € | 69,90 € | 2 | Full HD |
| Estándar | 10,99 € | 109,00 € | 2 | Full HD, 30 descargas |
| Premium | 15,99 € | 159,00 € | 4 | 4K UHD + Dolby Atmos, 100 descargas |
| HBO Max DAZN | 44,99 € | — (no listado) | 4 (deportes en 2) | Todo HBO Max + Eurosport, DAZN 1–4, F1, LaLiga, 100 descargas |

### Lagunas del análisis (a confirmar con inspección visual)
El análisis fue por contenido textual. **No se obtuvo**: paleta exacta, tipografía, espaciados, breakpoints, ni los slides del carrusel. Se proponen valores por defecto en §6 que deben validarse contra capturas del sitio real (DevTools / Browser pane) antes de la fase de plan.

---

## 2. User Stories (priorizadas)

### US1 — Ver la propuesta de valor y navegar (P1)
Como visitante quiero ver cabecera, hero y navegación para entender qué ofrece el servicio.
- **Test independiente**: cargar `/` y ver header, hero con "6,99 €/mes" y CTAs.
- **Aceptación**:
  1. Dado `/`, cuando carga, entonces se ve logo, "Iniciar sesión" y "Suscribirse".
  2. Dado el hero, entonces aparece precio de entrada tomado del mock del plan más barato (no hardcodeado).
  3. Dado teclado, el primer Tab enfoca el skip-link "Saltar al contenido".

### US2 — Explorar catálogo por raíles (P1)
Como visitante quiero ver raíles de títulos por categoría para hacerme idea del catálogo.
- **Aceptación**:
  1. Se muestran los 6 raíles listados en §1 con ≥ 6 títulos mock cada uno.
  2. Cada tarjeta muestra póster, título y badge (HBO Original / Warner Bros.) cuando aplica.
  3. Los raíles hacen scroll horizontal con flechas (desktop) y swipe/scroll-snap (móvil).
  4. Hover/focus en tarjeta amplía ligeramente y muestra sinopsis corta.

### US3 — Carrusel "Descubre lo mejor" (P2)
- **Aceptación**: slides mock con Anterior/Siguiente, indicadores, autoplay pausable, `prefers-reduced-motion` desactiva autoplay, navegable por teclado, `aria-roledescription="carousel"`.

### US4 — Comparar y seleccionar plan (P1)
Como visitante quiero alternar mensual/anual y elegir plan.
- **Aceptación**:
  1. Por defecto "Mensual" activo; el toggle cambia precios de los 3 primeros planes a anual.
  2. El plan DAZN no tiene precio anual: en modo anual sigue mostrando mensual con etiqueta "Solo mensual".
  3. "Seleccionar plan" lleva a un **checkout mock** (`/suscripcion?plan=<id>&ciclo=<mensual|anual>`) que resume la elección; no procesa pagos.
  4. Se muestra ahorro anual calculado (`mensual×12 − anual`).

### US5 — Sección Deportes (P2)
- **Aceptación**: hero deportivo + 4 tiles (LaLiga, Premier League, F1, MotoGP) + enlace "Más información" que abre el plan DAZN (ancla a la tarjeta del plan o ruta mock).

### US6 — FAQ en acordeón (P2)
- **Aceptación**: 5 preguntas; solo una abierta a la vez; `aria-expanded`/`aria-controls`; operable con Enter/Espacio.

### US7 — Footer y legales (P3)
- **Aceptación**: columnas de enlaces según §1; selector de idioma "Español" (mock, deshabilitado salvo ES); © dinámico por año.

### US8 — Login mock (P3)
- **Aceptación**: `/iniciar-sesion` con formulario email/contraseña, validación en cliente, éxito simulado (`mockAuth`) que redirige a `/` con estado "sesión iniciada" en header. Sin credenciales reales.

### Edge cases
- Imagen de póster rota → placeholder con título.
- Mock de catálogo vacío para un raíl → raíl oculto.
- Viewport < 360 px sin scroll horizontal de página.
- Precio con formato locale `es-ES` (`6,99 €`, coma decimal, símbolo tras número con espacio no separable).
- Query de plan inválida en checkout → redirige a planes con aviso.

---

## 3. Requisitos funcionales

- **FR-001** SPA React con rutas: `/`, `/suscripcion`, `/iniciar-sesion`, `*` (404).
- **FR-002** Todos los datos provienen de una **capa de mocks** (`src/mocks/*.json|ts`) accedida mediante servicios asíncronos (`Promise` con latencia simulada 150–400 ms) para poder sustituir por API real sin tocar componentes.
- **FR-003** Estados de carga (skeleton), error (con reintento) y vacío en raíles, carrusel y planes.
- **FR-004** Toggle mensual/anual con estado global de página (compartido hero ↔ planes si el hero muestra precio).
- **FR-005** Checkout mock persiste la elección en `sessionStorage`.
- **FR-006** Auth mock con `localStorage`; cualquier email válido + contraseña ≥ 8 caracteres entra.
- **FR-007** Formato de moneda y textos con `Intl.NumberFormat('es-ES')`; textos en un diccionario i18n (`es` ahora, preparado para `en`).
- **FR-008** Scroll horizontal de raíles con botones accesibles (`aria-label`), sin dependencia de librería de carrusel salvo justificación en plan.
- **FR-009** Banner de cookies mock (aceptar / rechazar no esenciales / gestionar), recordando elección.
- **FR-010** Metadatos `<title>`, `description`, Open Graph básicos.

## 4. Requisitos no funcionales

- **NFR-001 Rendimiento**: Lighthouse móvil ≥ 85 Perf; LCP < 2,5 s con mocks locales; imágenes `loading="lazy"` salvo hero; `srcset`/AVIF/WebP cuando haya assets propios.
- **NFR-002 Accesibilidad**: WCAG 2.2 AA; contraste ≥ 4.5:1; foco visible; landmarks (`header/main/nav/footer`); `prefers-reduced-motion`; Lighthouse A11y ≥ 95.
- **NFR-003 Responsive**: mobile-first; breakpoints 480 / 768 / 1024 / 1440.
- **NFR-004 Calidad**: TypeScript estricto, ESLint + Prettier, Vitest + React Testing Library (cobertura ≥ 70 % en lógica y componentes clave), Playwright para 3 flujos E2E (plan→checkout, FAQ, login).
- **NFR-005 Compatibilidad**: últimas 2 versiones de Chrome, Firefox, Safari, Edge.
- **NFR-006 Mantenibilidad**: componentes < 150 líneas; sin lógica de datos en componentes de presentación.

## 5. Entidades (modelo de mocks)

```ts
type Brand = 'HBO Original' | 'Warner Bros.' | 'Max Original' | 'DAZN'
interface Title { id: string; title: string; category: CategoryId; brand?: Brand; synopsis: string; posterUrl: string; year?: number }
interface Category { id: 'peliculas'|'familia'|'drama'|'comedia'|'accion'|'true-crime'; label: string; titleIds: string[] }
interface Plan { id: 'basico'|'estandar'|'premium'|'dazn'; name: string; priceMonthly: number; priceAnnual: number | null; devices: number; sportsDevices?: number; video: string; downloads: number | null; features: string[]; ads: boolean }
interface HeroSlide { id: string; title: string; subtitle: string; imageUrl: string; cta: { label: string; href: string } }
interface SportTile { id: string; name: 'LaLiga'|'Premier League'|'F1'|'MotoGP'; imageUrl: string }
interface FaqItem { id: string; question: string; answer: string }
interface Session { email: string; loggedAt: string }
```

Mock inicial de títulos (nombres observados): *Cumbres Borrascosas* (Películas), *Colección Harry Potter* (Familia), *La casa del dragón* (Drama), *Rooster* (Comedia), *From* (Acción), *Asesinato en Glitterball City* (True Crime). Completar hasta ≥ 6 por raíl con títulos ficticios o genéricos.

## 6. Diseño visual (supuestos a validar)

- Tema **oscuro** (fondo casi negro `#000`–`#0b0b12`), acento violeta/azul (`~#5822b4`–`#002be7` gradiente), texto blanco.
- Tipografía sans-serif geométrica (fallback `system-ui`); encabezados en peso 700.
- Botones primarios redondeados (pill), CTA destacado en gradiente.
- Tokens CSS en `:root` (`--color-bg`, `--color-accent`, `--radius`, `--space-*`).
- Tarjetas póster 2:3, tiles deportivos 16:9.

## 7. Restricciones legales y de contenido

- **No** copiar logotipos, pósters, vídeos ni textos con copyright. Usar un wordmark propio de placeholder ("MAX-CLONE"/nombre ficticio) y pósters generados (gradientes, `picsum`, ilustraciones propias).
- Mantener un banner/nota "Proyecto educativo, no afiliado a HBO ni a Warner Bros. Discovery".
- Los precios y nombres de planes se usan solo como datos de ejemplo.

## 8. Fuera de alcance

Reproductor de vídeo, catálogo autenticado, búsqueda, perfiles, pagos reales, DRM, backend, i18n más allá de ES.

## 9. Criterios de éxito

- **SC-001** Las 8 secciones de §1 renderizan fielmente en 375 px y 1440 px.
- **SC-002** Flujo plan → checkout mock completable en ≤ 3 clics.
- **SC-003** 0 errores axe críticos/serios; Lighthouse A11y ≥ 95.
- **SC-004** Tests unitarios y E2E en verde en CI.
- **SC-005** Sustituir mocks por una API requiere cambiar solo la capa `services/`.

## 10. Stack propuesto (a ratificar en `/speckit.plan`)

React 18 + Vite + TypeScript, React Router, CSS Modules (o Tailwind), TanStack Query para la capa async, MSW opcional para mocks por red, Vitest/RTL, Playwright.

## 11. Preguntas abiertas `[NEEDS CLARIFICATION]`

1. ¿Nombre/branding ficticio a usar en lugar de HBO Max?
2. ¿Tailwind o CSS Modules?
3. ¿Mocks en módulos TS o vía MSW (red simulada)?
4. ¿Se incluye selector de idioma funcional (ES/EN)?
5. ¿Se despliega (GitHub Pages / Vercel) o solo local?
