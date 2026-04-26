# Dark Mode Spec

Rendion supports light and dark mode via a `data-theme` attribute on `<html>`.
The value `"light"` or `"dark"` is set by `ThemeToggle` and persists via `localStorage`.

Source: [`src/app/globals.css`](../../src/app/globals.css),
[`src/components/ui/ThemeToggle.tsx`](../../src/components/ui/ThemeToggle.tsx).

---

## Rule 1 — Components consume CSS vars, not Tailwind palette classes

Components must reference semantic CSS variables via Tailwind's arbitrary-value syntax.
They must not use raw palette classes like `bg-white`, `text-stone-900`, `bg-sand-50`.

```tsx
// Correct
<div className="bg-[var(--color-surface)] text-[var(--color-foreground)]" />

// Incorrect — breaks in dark mode
<div className="bg-white text-stone-900" />
```

The semantic CSS vars (`--color-surface`, `--color-foreground`, `--color-border`, etc.)
are defined for both themes in `globals.css` under `:root[data-theme="light"]` and
`:root[data-theme="dark"]`.

---

## Rule 2 — Palette colors are NOT swept

Named palette classes (`bg-forest-500`, `text-plum-600`, `bg-terra-100`, etc.) are
**palette-locked** — they are the same color in both modes. Only the semantic surface
vars flip. Do not convert palette classes to CSS vars; they are used for intentional
brand colors.

---

## Rule 3 — D3 charts use useThemeTokens()

D3 charts cannot read Tailwind classes at render time. They receive hex strings from
[`useThemeTokens`](../../src/lib/hooks/useThemeTokens.ts):

```ts
const tokens = useThemeTokens();
// tokens.axis, tokens.grid, tokens.surface, tokens.border,
// tokens.chartPrimary, tokens.chartAccent, tokens.chartSuccess, ...
```

`useThemeTokens` re-reads the CSS vars via `getComputedStyle` whenever `data-theme`
changes or `prefers-color-scheme` fires. Chart colors therefore update within one
render cycle of a theme switch.

Chart colors (`.chartPrimary`, `.chartAccent`, etc.) are **palette-locked** — identical
in light and dark. Only axis, grid, and surface colors flip.

---

## Theme toggle mechanism

1. `ThemeToggle` calls `document.documentElement.setAttribute('data-theme', theme)`.
2. The `globals.css` vars resolve under the new theme.
3. React components using `var(--color-*)` classes repaint automatically.
4. D3 charts receive new values via `useThemeTokens` on the next render.

If `data-theme` is absent, the `prefers-color-scheme` media query in `globals.css`
acts as a fallback.

---

## Storybook

The Storybook theme toolbar (via `withThemeByDataAttribute` from `@storybook/addon-themes`)
toggles `data-theme` on the story iframe's `<html>`. Every story should render
correctly in both themes without a dedicated "Dark" story variant — use the toolbar
instead. Stories that test a specific dark-only layout may add a `Dark` variant if needed.

See [`.storybook/preview.ts`](../../.storybook/preview.ts).
