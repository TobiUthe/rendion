# Mobile Responsive Spec

Conventions for responsive behavior across the app. Mobile-first. Tailwind v4 breakpoints (`sm=640`, `md=768`, `lg=1024`, `xl=1280`) + a hand-tuned mid-tier for charts.

---

## Breakpoints

| Token | px | Use |
|-------|----|-----|
| `< sm` (< 640) | mobile | Single-column layouts, bottom sheets, compressed KPIs |
| `sm–md` (640–767) | large phone / small tablet | 2-column grids begin |
| `md–lg` (768–1023) | tablet | Inline parameter panel appears on `/ergebnis` |
| `≥ lg` (1024+) | desktop | Sidebar layouts, inline panel on `/dashboard/[id]` |

Programmatic access: [`useIsMobile(breakpoint = 640)`](../../src/lib/hooks/useBreakpoint.ts) — `useSyncExternalStore` + `matchMedia`, SSR-safe (returns `false` on server).

---

## KPI cards — `mobilePriority` pattern

[`AnalysisKpiCards`](../../src/components/results/AnalysisKpiCards.tsx) renders every KPI; non-priority cards get `hidden sm:block` so exactly two cards fill the 50/50 grid on mobile.

```tsx
<AnalysisKpiCards
  kpis={allKpis}
  mobilePriority={['Cashflow', 'Bruttorendite']} // label prefixes
/>
```

- Grid is always `grid-cols-2 sm:grid-cols-2 lg:grid-cols-3`.
- Match is `label.startsWith(prefix)` — tolerant of suffixes like `" / Monat"`.
- Omit `mobilePriority` to show the first two KPIs on mobile.
- Never filter the `kpis` array at the call site — always pass the full list and let the component decide visibility. This keeps SSR output stable.

---

## Panel / sheet — `inlineFrom` pattern

Any panel that needs a full-screen mobile treatment should:

1. Render inline at and above its `inlineFrom` breakpoint (`sm` / `md` / `lg`).
2. Below it, render a sticky bottom trigger that opens a `BottomSheet`.

Reference implementation: [`ParameterPanel`](../../src/components/parameter-panel/ParameterPanel.tsx).

Breakpoint class map (use these exact strings so Tailwind can statically extract them):

```ts
const HIDE_ABOVE = { sm: 'sm:hidden',   md: 'md:hidden',   lg: 'lg:hidden' };
const SHOW_ABOVE = { sm: 'hidden sm:block', md: 'hidden md:block', lg: 'hidden lg:block' };
```

The sticky trigger uses `sticky bottom-0 z-[var(--z-sticky)]` and a backdrop-blurred surface so it floats above scrolling content.

---

## BottomSheet primitive

[`src/components/ui/BottomSheet.tsx`](../../src/components/ui/BottomSheet.tsx). Native-DOM, no Radix. Must-have features for any sheet-like overlay in this app:

- `fixed inset-x-0 bottom-0 z-50`, rounded top corners, `max-height: 85vh`, content scrolls internally.
- Drag-handle bar (`h-1 w-10 rounded-full bg-stone-300`) in a sticky header.
- `padding-bottom: env(safe-area-inset-bottom, 0px)` for iOS notch devices.
- Escape key + backdrop click close.
- Body scroll lock via `document.body.style.overflow = 'hidden'` while open (mirrors `Modal.tsx`).
- Slide-in animation `animate-bottom-sheet-in` (defined in `globals.css`).

Never hand-roll a second sheet component — extend this one.

---

## Chart spacing (summary)

See [charts.md](./charts.md) for the full helper API. Rules that apply page-wide:

- Chart containers use progressive padding: `p-3 sm:p-5 md:p-6`.
- Tooltips cap at `max-w-[calc(100vw-1.5rem)]` so they never overflow a phone viewport.
- Chart content (font size, margin, stroke width) is responsive to the container's measured `width` via `ResizeObserver` — do not key off `window.innerWidth`.

---

## Patterns to avoid

- **Hiding the whole panel on mobile.** Dashboard used to hide `ModellingPanel` below `lg` and fall back to a text anchor link. Replace with the `inlineFrom` + sticky-trigger pattern.
- **Fixed pixel padding on chart wrappers.** Use the progressive `p-3 sm:p-5 md:p-6` scale.
- **Filtering the array before passing to a grid.** Pass the full list and hide via responsive classes so SSR + hydration agree.
- **Stacking 3+ KPI cards vertically on mobile.** Surface the two most actionable metrics side by side; the rest appear at `sm+`.
