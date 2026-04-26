# Specs

Living documents for patterns and conventions in the rendion codebase. Each spec owns a domain.

## How specs work

- **Source of truth.** If a spec and the code disagree, either the code is wrong or the spec is stale. Fix whichever.
- **Durable only.** Specs describe patterns, not tasks. No "TODO", no in-flight work, no incident notes. Those belong in the plan file or a commit message.
- **Short is good.** A spec should fit on one screen once you skim past the inventory tables. If it sprawls, split it.

## Index

| Spec | Domain | Key files |
|------|--------|-----------|
| [typography.md](../../src/lib/specs.md) | Typography tokens, heading/body/data scale | `src/lib/design-tokens.ts` |
| [mobile-responsive.md](./mobile-responsive.md) | Breakpoints, mobile-first patterns, KPI & panel responsive behavior | `useBreakpoint.ts`, `AnalysisKpiCards`, `ParameterPanel` |
| [charts.md](./charts.md) | Chart-utils helpers, OPACITY/DASH tokens, useThemeTokens, accessibility, tooltip rules | `src/lib/chart-utils.ts`, `src/lib/hooks/useThemeTokens.ts`, `src/components/charts/d3/*` |
| [parameter-panel.md](./parameter-panel.md) | ParameterPanel architecture (inline vs sheet, locked fields, auth-upsell, input shape) | `src/components/parameter-panel/*`, `BottomSheet` |
| [storybook.md](./storybook.md) | Storybook coverage requirement — every component and page has a story | `src/stories/` |
| [inputs.md](./inputs.md) | SegmentedControl vs Tabs, INPUT_SHAPE token, suffix/prefix slots, state tokens | `src/lib/design-tokens.ts`, `src/components/ui/Input.tsx` |
| [dark-mode.md](./dark-mode.md) | CSS var rule, palette-lock rule, useThemeTokens for D3, theme toggle mechanism | `src/app/globals.css`, `src/lib/hooks/useThemeTokens.ts` |
| [numbers-and-locale.md](./numbers-and-locale.md) | de-DE locale, NBSP symbol position, decimal defaults, compact abbreviations | `src/lib/format.ts` |
| [auth.md](./auth.md) | Auth contract (`requireUser`), mock cookie shape, pre-launch checklist, provider upgrade path | `src/lib/auth/requireUser.ts`, `src/lib/auth/mockAuth.ts` |

## Maintenance rule

When a change alters a pattern that one of these specs describes, **update the spec in the same PR**. Do not let a code/spec drift accumulate. Conversely, when a session produces a new reusable pattern worth reusing, write a new spec (or extend an existing one) before closing out.
