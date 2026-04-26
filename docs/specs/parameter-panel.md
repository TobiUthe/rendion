# ParameterPanel Spec

Shared parameter editor used on `/ergebnis` and `/dashboard/[id]`. One component, two layouts (inline card on desktop, bottom sheet on mobile), with per-tab locking for the auth-upsell flow.

Source: [`src/components/parameter-panel/`](../../src/components/parameter-panel/).

---

## Components

| File | Role |
|------|------|
| `ParameterPanel.tsx` | Orchestrator — picks inline card vs sticky trigger + `BottomSheet` based on `inlineFrom` |
| `ParameterPanelBody.tsx` | Tab nav + tab content. Shared between inline and sheet layouts |
| `LockedField.tsx` | Display-only field with hover lock icon; triggers auth modal on click |
| `UpsellFooter.tsx` | "Register to unlock" CTA at the bottom of locked tabs |
| `types.ts` | `ParameterTab` union + `PARAMETER_TABS` list |

`ParameterPanel` depends on [`BottomSheet`](../../src/components/ui/BottomSheet.tsx) — see [mobile-responsive.md](./mobile-responsive.md#bottomsheet-primitive).

---

## Public API

```ts
interface ParameterPanelProps {
  input: QuickCalcInput;
  view?: ErgebnisView;                        // optional — dashboard may omit it
  onInputChange?: (input: QuickCalcInput) => void;
  onAuthRequest: () => void;                  // fires from LockedField + UpsellFooter
  inlineFrom?: 'sm' | 'md' | 'lg';            // default 'md'
  unlockedTabs?: readonly ParameterTab[];     // default ['basisdaten']
  defaultExpanded?: boolean;                  // inline accordion initial state
}
```

- `onInputChange` emits the **full updated `QuickCalcInput`**. The panel never mutates — callers replace state wholesale.
- The panel **does not own the auth modal.** The caller owns state and renders `<Modal>` + `<MockAuthForm>` itself. The panel just bubbles up `onAuthRequest()` from every locked field.
- `unlockedTabs` controls which tabs render editable inputs vs `LockedField`. Any tab can be unlocked — all five have a corresponding editable path. Non-unlocked tabs also show an `UpsellFooter`.
- `inlineFrom` controls the breakpoint at which the inline card appears. Below it, the panel hides the inline card and renders a sticky mobile trigger + sheet.

---

## Call sites

### `/ergebnis`
```tsx
<ParameterPanel
  input={input}
  view={view}
  onInputChange={handleBasisdatenChange}
  onAuthRequest={() => setAuthOpen(true)}
  inlineFrom="md"
/>
```
See [`ErgebnisView.tsx`](../../src/components/results/ErgebnisView.tsx). Inline on `md+`, sheet below.

### `/dashboard/[id]`
Dashboard page is a server component that loads the row from Neon. It passes `input`/`view` down to [`DashboardAnalysisView`](../../src/components/dashboard/DashboardAnalysisView.tsx) (client island) which owns the `input` state, memoises `view`, and debounces a `PATCH /api/analyses/[id]` on every edit. The panel itself lives in a thin controlled wrapper [`DashboardParameterPanel.tsx`](../../src/components/dashboard/DashboardParameterPanel.tsx) that reads `useMockAuth()`:
- Authed → all five tabs unlocked, `onInputChange` forwarded to the page state.
- Guest or pre-hydration → `unlockedTabs=[]`, auth modal opens from any locked field.

`inlineFrom="lg"` so the panel is sticky on desktop and bottom-sheet on smaller screens.

---

## Tabs

`PARAMETER_TABS` (in order):

| Value | Label | Fields |
|-------|-------|--------|
| `basisdaten` | Basisdaten | Kaufpreis, Kaltmiete / Monat, Eigenkapital (CurrencyInput) |
| `kaufnebenkosten` | Kaufnebenkosten | Grunderwerbsteuer, Makler, Notar, Grundbuch (PercentInput) · Summe (derived, LockedField) |
| `finanzierung` | Finanzierung | Zinssatz, Tilgung (PercentInput) · Zinsbindung (YearsInput) · Finanzierungsart (LockedField — no schema slot) |
| `nebenkosten` | Nebenkosten | Nicht umlagefähig, Grundsteuer, Instandhaltung, Verwaltung (CurrencyInput) |
| `steuern` | Steuern & Prognosen | Grenzsteuersatz, AfA, Mietsteigerung, Wertsteigerung, Leerstand (PercentInput) |

All five tabs have both editable and locked renderers. Which one renders depends on whether the tab is in `unlockedTabs`.

Tab nav uses [`Tabs`](../../src/components/ui/Tabs.tsx) (the underline navigation primitive) wrapped in `overflow-x-auto no-scrollbar` so the five labels don't crush on narrow screens. Form grids are always `grid-cols-1 sm:grid-cols-2`.

**Input shape:** All editable inputs (`CurrencyInput`, `PercentInput`, `YearsInput`) compose the shared `Input` primitive and inherit `INPUT_SHAPE` (`h-11`, `rounded-lg`, `px-3`). This guarantees all inputs in the calculator row have the same height as each other and as any `SegmentedControl` used for form choices. See [inputs.md](./inputs.md) for the full spec.

**SegmentedControl vs Tabs decision:** `SegmentedControl` (box style, `h-11`) is used for in-form binary/ternary choices — e.g. loan type. `Tabs` (underline style) is used for the tab-panel navigation in the parameter panel header. See [inputs.md](./inputs.md#segmentedcontrol-vs-tabs--decision-rule).

---

## Adding a field

1. Decide which tab it belongs to.
2. If the tab is always locked for guests, add a `<LockedField>` row in `ParameterPanelBody`.
3. If the tab is in `unlockedTabs`, add both the editable input (typically `<CurrencyInput>`) and the locked alternative.
4. Extend `QuickCalcInput` in [`src/lib/schemas/calculator.ts`](../../src/lib/schemas/calculator.ts) if the field is new.
5. If the change affects the 5-tab shape, update `PARAMETER_TABS` in [`types.ts`](../../src/components/parameter-panel/types.ts).

---

## Follow-ups

- **Real auth.** The API route and server page hard-code `userId = "mock-user"` (see `src/app/api/analyses/[id]/route.ts` and `src/app/dashboard/[id]/page.tsx`). When Clerk/NextAuth lands, swap the cookie check + hard-coded id for a real session lookup.
- **Sliders.** The immo-deals ancestor shipped sliders for advanced finance parameters using Radix Collapsible. When adding them here, implement with native primitives (no Radix) — see the CSS `grid-rows` disclosure pattern noted in the plan.
