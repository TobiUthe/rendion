# Charts Spec

All D3 charts pull their responsive sizing from a single helper module so spacing stays consistent.

Source: [`src/lib/chart-utils.ts`](../../src/lib/chart-utils.ts).

---

## Width tiers

All helpers key off the chart's **measured container width** (via `ResizeObserver`), not the viewport. This is important: a chart inside a sidebar may be narrow even on a desktop screen.

| Tier | Range | Intent |
|------|-------|--------|
| mobile | `< 640` | Phones, narrow sidebars, embedded previews |
| mid | `640–899` | Large phones landscape, small tablets |
| desktop | `≥ 900` | Full-width on tablets, all desktop |

Helpers: `isMobileWidth(width)`, plus the constants `MOBILE_WIDTH = 640` and `MID_WIDTH = 900`.

---

## Responsive helpers

| Helper | Returns | Notes |
|--------|---------|-------|
| `responsiveFontSize(width)` | `10` / `11` / `12` | Axis ticks, inline labels |
| `responsiveMargin(width)` | `{ top, right, bottom, left }` | Tighter on mobile (`right: 8, left: 48`) |
| `responsiveTickCount(width, minSpacing = 80)` | integer ≥ 3 | Mobile uses denser minimum spacing (110) for readability |
| `responsiveTooltipSize(width)` | `{ minW, maxW }` | `140/220` on mobile, `200/280` otherwise |
| `responsiveStroke(width, desktop = 2)` | thinner on mobile | Clamped to `≥ 1` |

Constants worth knowing: `DEFAULT_MARGIN` (desktop), `CHART_TOOLTIP` (named min/max), `CHART_COLORS`, `DONUT_COLORS` re-exported from `chart-config`.

---

## Container padding

Apply this class on the element wrapping a chart:

```tsx
<div className="p-3 sm:p-5 md:p-6">
  <MyChart />
</div>
```

Reference: [`ChartsTabs.tsx`](../../src/components/results/ChartsTabs.tsx).

---

## Tooltip rules

- Shared [`ChartTooltip`](../../src/components/charts/d3/ChartTooltip.tsx) caps at `max-w-[calc(100vw-1.5rem)]` and uses `text-[10px] sm:text-sm`.
- Chart-local tooltips (inside `WaterfallChart`, `WealthAccumulationChart`) should size responsively: `w-[200px] sm:w-60` and `px-3 py-2 sm:px-4 sm:py-3`.
- Never use a fixed tooltip width wider than 240px — a phone at 390 CSS pixels will clip it after padding.

---

## Chart heights

Default scale: `h-64 w-full sm:h-72 md:h-80` (≈ 256 / 288 / 320 px). For wealth-style charts that need more room at wide widths, bump to `h-72 md:h-96`.

Avoid `h-[50vh]` or viewport-derived heights — they compete with mobile browser chrome and make charts feel jumpy.

---

## Motion

Chart animations honour `prefersReducedMotion()` (from `chart-utils`). Enter animations are driven by an `IntersectionObserver` that sets a `revealed` state; skip this for users with reduced motion.

---

## Legends

All D3 charts use the shared [`ChartLegend`](../../src/components/charts/ChartLegend.tsx) primitive. No ad-hoc legend markup inside an SVG.

State is managed by [`useLegendState`](../../src/components/charts/useLegendState.ts) (or the mode-specific `useFocusLegend` / `useToggleLegend` hooks it delegates to).

### Mode decision rule

| Mode | When to use | Example |
|------|-------------|---------|
| `focus` | Hiding other series would break chart math — e.g. a waterfall running total depends on all bars | `WaterfallChart` |
| `toggle` | The stack and y-domain can cleanly recompute from visible series only | `TilgungsplanChart`, `WealthAccumulationChart` |

### Props

```tsx
// focus mode
<ChartLegend
  mode="focus"
  series={series}          // LegendSeries[] — key, label, color from design tokens
  activeKey={activeKey}    // string | null
  onToggle={onToggle}
/>

// toggle mode
<ChartLegend
  mode="toggle"
  series={series}
  hiddenKeys={hiddenKeys}  // Set<string>
  onToggle={onToggle}
/>
```

### Accessibility contract

- Renders a `<ul role="list">` of `<button type="button">` items.
- Each button carries `aria-pressed={isPressed}` — `true` when visible/active, `false` when dimmed/hidden.
- Keyboard: Space and Enter toggle state (native button behavior).
- Minimum hit target: `min-h-[44px]` achieved via `py-2.5` padding — no forced fixed height.
- Color dot is `aria-hidden="true"`; the label text provides the accessible name.

### Colors

All dot colors come from series metadata (`PALETTES`, `CHART_ROLES`, `CHART_SEMANTIC`, `CHART_CHROME` in `src/lib/design-tokens.ts`). No hex literals in `ChartLegend.tsx`.

### Motion

Inactive/hidden state uses `opacity-40`. The opacity transition (`duration-300`) is gated on `prefersReducedMotion()` — if the user prefers reduced motion, the class is applied without the transition.

---

## OPACITY scale

All chart opacity values come from `OPACITY` in `design-tokens.ts`. Never hardcode.

| Key | Value | Use |
|-----|-------|-----|
| `chartInactive` | 0.25 | Hidden / dimmed series |
| `chartMuted` | 0.5 | Benchmarks, secondary context |
| `chartNormal` | 0.85 | Default rendered state |
| `chartActive` | 1 | Hovered or focused series |

---

## DASH patterns

All stroke-dasharray values come from `DASH` in `design-tokens.ts`. Never hardcode.

| Key | Value | Use |
|-----|-------|-----|
| `grid` | `"3 3"` | Horizontal grid lines |
| `connector` | `"4 3"` | Net / connector lines |
| `projection` | `"2 4"` | Forecast / projected values |

---

## Theme-aware colors (useThemeTokens)

D3 charts cannot read Tailwind classes at runtime. Pass theme-aware hex strings via:

```tsx
const tokens = useThemeTokens(); // src/lib/hooks/useThemeTokens.ts
// tokens.axis, tokens.grid, tokens.surface, tokens.border
// tokens.chartPrimary, tokens.chartAccent, tokens.chartSuccess, ...
```

`useThemeTokens` re-subscribes to `data-theme` attribute changes and
`prefers-color-scheme` media query changes. Charts repaint within one render cycle.

Never pass `"white"` or raw hex strings for surface-level chart backgrounds.
Use `tokens.surface` instead.

---

## Accessibility

Every chart `<svg>` must carry:

```tsx
<svg role="img" aria-label="Bilanz nach 30 Jahren: Vermögen +250.000 €" ...>
```

The `aria-label` summarises the chart's key takeaway from the actual data — not a
generic label like "Chart". Update it whenever the rendered data changes.

---

## Bar corner radius

All chart bars use `rx={2}` for a subtle 2px corner radius. Hard 90° corners are
not used. Applied via the `rx` attribute on `<rect>` elements.

---

## Tooltip elevation

Tooltips use `shadow-md` plus a 1px `--color-border` border — not `shadow-xl`.
Background is `bg-[var(--color-surface)]/95` for both themes.

---

## Adding a new D3 chart

1. Use `ResizeObserver` on the outer container, not `window`.
2. Derive `margin`, `fontSize`, stroke width, tick count from the helpers above — do not hard-code tier thresholds inline.
3. Wrap in a container with the progressive padding class.
4. Add a `ChartLegend` below the SVG (never inside it). Choose `focus` or `toggle` mode per the decision rule above.
5. Add a Storybook story at `src/stories/comprehensive-components/charts/<Name>.stories.tsx` with at least a `default`, `SeriesHidden` (or `FocusActive`), and `mobile` variant.
