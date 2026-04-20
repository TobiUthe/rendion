# Typography Specification

Single source of truth for all text styles in the rendion UI.
All typography decisions live in `design-tokens.ts`. Components consume them via `cn(TOKEN)`.

---

## Rules

1. **No inline typography in components.** Never write `font-display`, `font-mono`, `text-sm`, `font-semibold`, or color classes for text directly in JSX. Always import from `@/lib/design-tokens`.
2. **No `text-neutral-*` in component JSX.** The `neutral` alias maps to `stone`, so class names drift. Use `text-stone-*` via tokens.
3. **`cn(TOKEN, extraClasses)` is the pattern.** Layout modifiers (`mt-1`, `mb-4`, `truncate`) are fine as extra classes — they are not typography.
4. **To add a new variant:** add it to the appropriate token object in `design-tokens.ts`, document it here, then use it in the component.

---

## Token Inventory

### HEADINGS — `font-display` (Libre Baskerville), for structural titles

| Key | Classes | Where to use |
|-----|---------|--------------|
| `h1` | `font-display text-2xl font-bold leading-snug tracking-tight text-stone-800 md:text-3xl` | Page title (`PageHeader`) |
| `h2` | `font-display text-xl font-bold leading-snug text-stone-800` | Major section titles (reserved, not yet used) |
| `h3` | `font-display text-lg font-semibold leading-snug text-stone-800` | Panel/sidebar headings (`ModellingPanel`) |
| `h4` | `font-display text-base font-semibold text-stone-800` | Card headings (`Section`, `AnalysisCard`) |
| `h5` | `font-sans text-sm font-semibold text-stone-800` | Sub-section labels |

> Note: HTML element semantics (`<h2>`) and visual token size (`HEADINGS.h4`) may differ. Choose the semantic element for accessibility; choose the token for visual weight.

---

### BODY — `font-sans` (Work Sans), for prose and UI text

| Key | Classes | Where to use |
|-----|---------|--------------|
| `default` | `font-sans text-sm text-stone-600` | Body text, card descriptions |
| `strong` | `font-sans text-sm font-semibold text-stone-600` | Emphasized body, status labels |
| `caption` | `font-sans text-xs italic text-stone-400` | Chart captions, disclaimers |
| `sectionLabel` | `font-sans text-xs font-semibold uppercase tracking-wider text-stone-600` | Metric category labels (KpiCard, AnalysisCard) |
| `subtitle` | `font-sans text-sm-plus text-stone-500` | Page or card subtitles below a heading |
| `formLabel` | `font-sans text-sm font-medium text-stone-600` | Form field labels, slider labels |
| `navLink` | `font-sans text-xs-plus font-medium text-stone-500` | Back links, breadcrumb links |
| `muted` | `font-sans text-xs text-stone-400` | Dates, metadata, fine print (non-italic) |

---

### DATA — `font-mono` (IBM Plex Mono) + `tabular-nums`, for numeric display

| Key | Classes | Where to use |
|-----|---------|--------------|
| `kpiLarge` | `font-mono text-2xl font-bold tabular-nums text-stone-800` | Hero KPI values |
| `kpiStandard` | `font-mono text-xl font-semibold tabular-nums text-stone-800` | Standard KPI values (`KpiCard`) |
| `value` | `font-mono text-sm font-medium tabular-nums text-stone-800` | Inline metric values (`AnalysisCard`) |
| `axisLabel` | `font-mono text-xs tabular-nums text-stone-400` | Chart axis ticks, range min/max |
| `chartAnnotation` | `font-sans text-xs italic text-stone-400` | Chart callout text |
| `deltaBadge` | `font-mono text-sm font-medium tabular-nums` | Delta/change badges (color applied by badge variant) |
| `parameterValue` | `font-mono text-sm font-semibold tabular-nums text-primary-600` | Interactive parameter values (slider readouts) |

---

## Extended Text Scale

Custom sizes filling Tailwind's gaps — defined as CSS variables in `globals.css`:

| Tailwind class | Size | Use case |
|----------------|------|----------|
| `text-2xs` | 11px | Data labels, axis labels |
| `text-xs-plus` | 13px | Nav links, back links (`BODY.navLink`) |
| `text-sm-plus` | 15px | Subtitles, input text (`BODY.subtitle`) |

---

## Font Stack

| Variable | Font | Purpose |
|----------|------|---------|
| `font-sans` | Work Sans | Body, UI, labels |
| `font-display` | Libre Baskerville | All headings |
| `font-mono` | IBM Plex Mono | All numeric / data values |

---

## What Is Out of Scope

Changes to this file do **not** cover:

- **Colors** — defined in `PALETTES` and `SEMANTIC` in `design-tokens.ts`
- **Spacing** — use `SPACING` tokens or Tailwind gap/margin
- **Component structure** — layout, borders, shadows are in `CARDS`, `OVERLAYS`, etc.
- **Chart typography** — chart axis/label styles are driven by `CHART_CHROME` and Recharts config
