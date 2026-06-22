# Secciones — Landing CARGA CONSOLIDADA (ProBusiness)

**Figma:** [PROBUSINESS-LANDING-PAGE — Copy — nodo 570:219](https://www.figma.com/design/FSy03Q6Ir5CzBHN1KjGtwg/PROBUSINESS-LANDING-PAGE--Copy-?node-id=570-219)

**fileKey:** `FSy03Q6Ir5CzBHN1KjGtwg`

**Frame raíz:** `570:219` — `CARGA CONSOLIDADA` (3973 × 29038 px)

**Proyecto Astro:** `src/pages/index.astro`

**CDN:** `https://cdn.probusiness.pe/landing_consolidado_v2`

---

## Leyenda de estado

| Estado | Significado |
|--------|-------------|
| 🟡 Borrador | Componente creado, pulido pendiente |
| 🟠 En progreso | Pulido en curso |
| 🟢 Listo | Pixel-perfect / aprobado |
| ⬜ Pendiente | No implementado aún |

---

## Tokens de diseño (globales)

| Token | Valor | Uso |
|-------|-------|-----|
| `--probusiness-naranja` | `#ff6a29` | Acentos, badges |
| Gradiente CTA | `#ff5410` → `#ff733b` | Botones principales |
| Hero fondo | `#ff5410` | Franja superior |
| Fondo oscuro CTA hero | `#212121` → `#3d3d3d` | Cotizar mi importación |
| Fondo blanco | `#ffffff` | Secciones medias |
| Fondo gris | `#f9f9f9` / `#e4e4e4` | Testimonios / FAQ |
| Footer | `#ff5410` | Pie naranja |
| Tipografía títulos | **Sora** | Headings, números |
| Tipografía cuerpo | **Epilogue** | Texto, botones, FAQ |

---

## Escala viewport (artboard 3973px)

Todos los tamaños usan `clamp(min, calc(px / 3973 * 100vw), max)` con tope en **1920px** (`--site-max`).

Utilidades en `src/styles/figma-scale.css` (`.text-f-140`, `.text-f-65`, etc.).

---

## Orden de secciones

| # | Sección Figma | Componente | Estado |
|---|---------------|------------|--------|
| 01 | Header / Logo | `Header.astro` | 🟠 En progreso |
| 02 | Hero Carga Consolidada | `Hero.astro` | 🟠 En progreso |
| 03 | ¿Qué es Carga Consolidada? (4 pasos) | `WhatIsConsolidated.astro` | 🟠 En progreso |
| 04 | Beneficio Clave (contenedor) | `KeyBenefit.astro` | 🟠 En progreso |
| 05 | Así funciona (12 pasos) | `HowItWorks.astro` | 🟠 En progreso |
| 06 | Garantía probusiness | `Warranty.astro` | 🟠 En progreso |
| 07 | ¿Por qué elegirnos? (6 cards) | `WhyChooseUs.astro` | 🟠 En progreso |
| 08 | Testimonios / Casos de éxito | `Testimonials.astro` | 🟠 En progreso |
| 09 | Próximas salidas marítimas | `MaritimeDepartures.astro` | 🟠 En progreso |
| 10 | Formulario contacto | `ContactForm.astro` | 🟠 En progreso |
| 11 | FAQ (8 preguntas) | `FAQ.astro` | 🟠 En progreso |
| 12 | Footer naranja | `Footer.astro` | 🟠 En progreso |

**Compartido:** `QuoteCta.astro` — botón "Cotizar mi Importación"

---

## Scripts

```bash
npm install
npm run download:assets   # Descarga assets desde Figma MCP (~7 días)
npm run dev
npm run optimize:images   # Genera cdn-assets/ + manifest
npm run deploy:assets     # Sube a S3 landing_consolidado_v2
```

---

## Variables de entorno

Ver `.env.example`:

- `PUBLIC_LANDING_CONSOLIDADO_API_URL`
- `PUBLIC_LANDING_CONSOLIDADO_FORM_TOKEN`
- `PUBLIC_LANDING_CONSOLIDADO_CAMPAIGN_CODE`

---

## Pendientes

- [ ] Frame mobile (usuario no proporcionó enlace aún)
- [ ] Pulido pixel-perfect por sección vs Figma desktop
- [ ] URLs reales de videos testimoniales
- [ ] Integración backend del formulario
- [ ] Subir assets optimizados al CDN
