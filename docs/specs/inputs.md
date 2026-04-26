# Inputs Spec

All form inputs share a single shape contract defined in `INPUT_SHAPE` and assembled
via `INPUT_BASE` in [`src/lib/design-tokens.ts`](../../src/lib/design-tokens.ts).

---

## SegmentedControl vs Tabs — decision rule

| Component | Use when |
|-----------|----------|
| `SegmentedControl` | Choosing a value within a form (e.g. Kaufen vs. Mieten, 2 or 3 options). Sits at the same `h-11` height as other inputs in a calculator row. |
| `Tabs` | Navigating between content sections (e.g. parameter tabs, chart tabs). Underline style, no fixed height, lives above its tab panel. |

Never use `SegmentedControl` for navigation, and never use `Tabs` inside a form field grid.

---

## INPUT_SHAPE token

Single source of truth for input geometry. Do not repeat these values inline.

```ts
// src/lib/design-tokens.ts
export const INPUT_SHAPE = {
  height:        "h-11",        // 44px — matches SegmentedControl height
  radius:        "rounded-lg",
  paddingX:      "px-3",
  text:          "text-base",
  borderDefault: "border-[var(--color-border)]",
  background:    "bg-[var(--color-surface)]",
  textColor:     "text-[var(--color-foreground)]",
  placeholder:   "placeholder:text-[var(--color-text-tertiary)]",
};
```

`INPUT_BASE` concatenates all of the above plus `w-full shadow-sm transition-colors`.

---

## Suffix / prefix slot rules

- Suffixes (`€`, `%`, `Jahre`) are rendered inside a right-hand `<span>` using
  `flex`-layout in the wrapper, so the suffix width never bleeds into the input text area.
- Width is intrinsic (no fixed `pr-9`/`pr-14` etc.) — the suffix renders in its own
  flex child.
- Suffix text uses `text-[var(--color-text-secondary)]` at `text-sm`.
- Prefix same rules, left-hand side.

---

## State token application

All states come from `STATES` in `design-tokens.ts`:

| State | Classes |
|-------|---------|
| `focus` | `focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-300` |
| `error` (on input) | `border-danger-500` + `aria-invalid="true"` |
| `error` (text below) | `STATES.errorText` → `text-xs text-danger-600` |
| `disabled` | `opacity-50 cursor-not-allowed` |
| `helperText` | `STATES.helperText` → `text-xs text-[var(--color-text-secondary)]` |

---

## Numeric input format integration

Every numeric input primitive delegates display formatting and parse to
[`src/lib/format.ts`](../../src/lib/format.ts).

| Component | Formatter used |
|-----------|----------------|
| `CurrencyInput` | `formatEuro` / `liveFormatDE` (during editing) |
| `PercentInput` | `formatPercent` / `liveFormatDE` |
| `YearsInput` | `formatYears` / `liveFormatDE` |

The primitives emit a numeric value to `onChange` — never a formatted string.

---

## Storybook requirement

Each input primitive must have Default, Filled, Mobile, and (where applicable)
Error and Disabled stories. See [`src/stories/primitives/`](../../src/stories/primitives/).
