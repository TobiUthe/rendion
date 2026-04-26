# Rendion Improvement Plan

Companion to [`audit-report.md`](./audit-report.md). Phased execution: Critical → Important → Polish. Each task names the domain tag, the specialist skill to dispatch, the files involved, and a clear acceptance criterion.

**Read order for the implementer**: complete Phase 1 fully (it gates the security posture and unblocks confident refactoring) before Phase 2. Phase 3 can run any time.

---

## Phase 1 — Critical (must ship before any non-demo deploy)

### Group 1A — runs in parallel (no shared files)

#### T1.1 — Add auth check to `/dashboard/[id]` server page  *(C1)*
- **Tag**: `[security]`  · **Skill**: `specialist-agents:backend`
- **Files**: [`src/app/dashboard/[id]/page.tsx`](../src/app/dashboard/[id]/page.tsx)
- **Steps**:
  1. Extract `requireUser()` from `src/app/api/analyses/[id]/route.ts:12–16` into a shared `src/lib/auth/requireUser.ts` (server-only).
  2. Call it in `DashboardDetailPage`. If it returns `null`, `redirect('/anmelden?next=/dashboard/' + id)`.
  3. Replace `MOCK_USER_ID` with the returned user id in the Drizzle `where` clause.
- **Acceptance**:
  - `curl -i http://localhost:3000/dashboard/demo-001` (no cookie) returns 307 to `/anmelden?next=…`, not 200.
  - With cookie set, the page renders unchanged.

#### T1.2 — Add unit tests for calculator math  *(C4)*
- **Tag**: `[testing]`  · **Skill**: `my-skills:test-engineer`
- **Files**: create `src/lib/calculator/__tests__/quick-calc.test.ts`, `loan.test.ts`, `cashflow.test.ts`, `appreciation.test.ts`, `kpis.test.ts`, `mapResultToView.test.ts`, `url-params.test.ts`; create `src/lib/__tests__/format.test.ts`.
- **Steps**:
  1. Add `vitest` config that registers a non-browser project for `src/lib/**/*.test.ts` (the existing Vitest config is Storybook-browser-only).
  2. Add `npm run test` script in `package.json`.
  3. For each pure-function module, write at minimum: happy-path identity test, edge case at zero, edge case at boundary, malformed-input rejection, locale/format compliance for `format.ts`.
  4. Round-trip test for `encodeQuickParams` ↔ `decodeQuickParams` (asserts I5 is also covered).
- **Acceptance**:
  - `npm run test` runs ≥ 30 assertions across ≥ 7 files; all green.
  - `formatDelta(-82, formatEuro)` returns `"−82 €"` (U+2212) — codifies I2 contract.

#### T1.3 — Document the C1/C2/C3 cluster as a launch gate
- **Tag**: `[security]`  · **Skill**: `specialist-agents:backend`
- **Files**: append a "Launch readiness" section to [`docs/specs/parameter-panel.md`](../docs/specs/parameter-panel.md) "Follow-ups" or create [`docs/specs/auth.md`](../docs/specs/auth.md) (new).
- **Steps**: list T1.1, T2.1, T2.2 as required-before-launch, link the audit report.
- **Acceptance**: a single source of truth exists that `/launch` can check against.

### Group 1B — sequential after 1A

#### T1.4 — Replace mock auth with a real provider  *(C2 + C3)*
- **Tag**: `[security]`  · **Skill**: `my-skills:integration-engineer`
- **Files**: deleted `src/lib/auth/mockAuth.ts`; new `src/lib/auth/{requireUser,signIn,signOut}.ts`; updated `src/components/auth/MockAuthForm.tsx` → `AuthForm.tsx`; updated `src/app/api/analyses/[id]/route.ts`, `src/app/dashboard/[id]/page.tsx`, `src/components/dashboard/DashboardParameterPanel.tsx`.
- **Steps**:
  1. Pick a Vercel Marketplace provider — Clerk is the lowest-friction native install ([Vercel auth integrations](https://vercel.com/marketplace?category=authentication)). Auth.js v5 if you want self-hosted.
  2. Run `npx clerk` (or equivalent), wire the middleware/proxy, replace `setMockAuth()` with the provider's session cookie.
  3. Migrate `analyses.userId` rows: a one-shot SQL backfill `UPDATE analyses SET user_id = '<owner clerk id>' WHERE user_id = 'mock-user'` *or* drop the demo rows.
  4. Remove `MOCK_USER_ID` constants from both server files.
  5. Replace `useMockAuth()` hook with the provider's hook.
- **Acceptance**:
  - `Grep "mock-user"` and `Grep "AUTH_KEY"` return 0 hits in `src/`.
  - Two test users see disjoint analysis lists at `/dashboard`.
  - Cookie has `Secure`, `HttpOnly`, signed (provider default) — closes I3.

---

## Phase 2 — Important

### Group 2A — runs in parallel

#### T2.1 — Dark-mode token sweep across landing/auth/layout  *(I1)*
- **Tag**: `[design-system]`  · **Skill**: `specialist-agents:frontend` (composes `react-developer` + `design-system`)
- **Files**: 13 components listed in audit-report.md I1.
- **Steps** — for each file replace, in order:
  1. `bg-white` → `bg-[var(--color-surface)]`
  2. `bg-sand-50` (as page surface) → `bg-[var(--color-background)]`
  3. `text-stone-900` / `text-neutral-900` → `text-[var(--color-foreground)]`
  4. `text-stone-500` / `text-neutral-500` → `text-[var(--color-text-secondary)]`
  5. `border-sand-200` (as default border) → `border-[var(--color-border)]`
  6. Leave brand palette classes (`text-primary-600`, `bg-pine-50`, etc.) alone — those are palette-locked per Rule 2.
- **Acceptance**:
  - `Grep "bg-white|text-stone-9|text-neutral-9|bg-sand-50" src/components` returns 0 hits.
  - Storybook `data-theme="dark"` toolbar setting renders all 13 components legibly.
  - Update `docs/specs/dark-mode.md` if the sweep introduced a new pattern (e.g. a `decorative-tint` token for the Po5 case).

#### T2.2 — Move mock data to numbers, format at render time  *(I2)*
- **Tag**: `[design-system]`  · **Skill**: `my-skills:react-developer` + `my-skills:design-mentor`
- **Files**: [`src/lib/mock/dashboard.ts`](../src/lib/mock/dashboard.ts), [`src/components/dashboard/AnalysisCard.tsx`](../src/components/dashboard/AnalysisCard.tsx), [`src/lib/db/seed.ts`](../src/lib/db/seed.ts) (if seed reuses these).
- **Steps**:
  1. Change `bruttorendite: string` → `bruttorenditePct: number` and `cashflowMonat: string` → `cashflowMonat: number` in `DashboardAnalysisSummary`.
  2. Update three demo entries to numeric values.
  3. In `AnalysisCard.tsx`, call `formatPercent(analysis.bruttorenditePct)` and `formatDelta(analysis.cashflowMonat, formatEuro)` — both already produce U+2212 per `format.ts:76`.
  4. Delete the `cashflowTone` string-prefix detection; use `analysis.cashflowMonat >= 0` instead.
- **Acceptance**:
  - `08-dashboard-375.png` re-rendered shows `−82 €` (U+2212), not `-82 €`.
  - Test from T1.2 covers `formatDelta` round-trip.

#### T2.3 — CSRF + rate limit on PATCH `/api/analyses/[id]`  *(I4)*
- **Tag**: `[security]`  · **Skill**: `specialist-agents:backend`
- **Files**: [`src/app/api/analyses/[id]/route.ts`](../src/app/api/analyses/[id]/route.ts), or new Server Action in `src/lib/actions/analyses.ts`.
- **Steps** (recommended path: convert to Server Action):
  1. Create `'use server'` `updateAnalysis(id, input)` action with the same Zod schema.
  2. React 19 Server Actions get CSRF protection via the framework's encrypted-action-id mechanism.
  3. Call it from `DashboardAnalysisView` instead of `fetch('/api/analyses/[id]', {method:'PATCH'})`.
  4. Delete the API route once the action is wired (or keep for external clients; if so, add an explicit `Origin` check + Upstash rate limit on writes).
- **Acceptance**: PATCH from a foreign origin returns 403; Server Action call from same origin works unchanged.

#### T2.4 — Remove unused `recharts` dep + config  *(I7)*
- **Tag**: `[performance]`  · **Skill**: `my-skills:react-developer`
- **Files**: `package.json`, `package-lock.json`, [`next.config.ts`](../next.config.ts).
- **Steps**:
  1. `npm uninstall recharts`
  2. Edit `next.config.ts` `optimizePackageImports` → keep only `'lucide-react'`.
  3. Re-run `npm run build` to confirm no regressions.
- **Acceptance**: `Grep "recharts" package.json` and `Grep "from ['\"]recharts" src/` return 0 hits.

#### T2.5 — Newsletter footer: disable until functional  *(I8)*
- **Tag**: `[ux]`  · **Skill**: `my-skills:react-developer` + `my-skills:copy-writer`
- **Files**: `src/components/layout/Footer.tsx`.
- **Steps**: replace placeholder with "In Vorbereitung", add `disabled` to input, `aria-disabled` to button, replace "Bald verfügbar" subtitle with a clearer "Newsletter folgt mit Launch".
- **Acceptance**: keyboard-tab through the footer skips the disabled inputs; AT users hear "disabled".

#### T2.6 — Honor `prefers-reduced-motion` on AnimatedStat  *(I9)*
- **Tag**: `[a11y]`  · **Skill**: `my-skills:react-developer`
- **Files**: `src/components/landing/HeroWithCalculator.tsx`.
- **Steps**: import `prefersReducedMotion` from `@/lib/chart-utils`. In `animate()`, short-circuit to the final value if the user prefers reduced motion. Same fix in any other count-up usage (`AnimatedNumber.tsx` already does this — verify and reuse).
- **Acceptance**: With `prefers-reduced-motion: reduce` set, the "10.000+" stat renders fully on first paint.

### Group 2B — sequential after T2.1 lands

#### T2.7 — Trim landing claims to shipped reality  *(I6)*
- **Tag**: `[product]` + `[copy]`  · **Skill**: `specialist-agents:business` (composes `product-manager` + `copy-writer`)
- **Files**: `src/components/landing/FeatureBentoGrid.tsx`, possibly `CTABanner.tsx`.
- **Steps** (decision required from the user — see Open Questions below):
  - Option A — gate: keep all 7 cards, add "Bald verfügbar" badge to ETF-Vergleich, AfA & Steuereffekte, Profi-Analyse, Deal Scoring.
  - Option B — trim: remove the 4 unimplemented cards; rebalance to a 3-card grid focused on what ships (KPI-Dashboard, Cashflow-Analyse, 30-Jahres-Prognose).
  - Default recommendation: **Option B** for launch, then re-introduce cards as features ship.
- **Acceptance**: every visible feature card maps to a feature visible on `/ergebnis` or `/dashboard/[id]`.

---

## Phase 3 — Polish (any time)

| ID | Tag | File | One-line action | Skill |
|----|-----|------|------------------|-------|
| **Po1** | `[ux]` | `src/components/results/ErgebnisView.tsx:18` | Show all 7 KPIs on desktop (1 row of 4 + 1 row of 3) or add a "Detail-KPIs" expander | `react-developer` |
| **Po2** | `[design-system]` | `src/lib/design-tokens.ts:196,365` | Migrate remaining `INPUTS.base` consumers to `INPUT_BASE`, then delete `INPUTS.base` | `design-mentor` |
| **Po3** | `[ux]` | `src/lib/calculator/defaults.ts:32–36` | Bump `kaltmiete` in `DEMO_BASISDATEN` from 1200 → 1500 so the demo deal yields positive cashflow | `product-manager` |
| **Po4** | `[design-system]` | `src/components/calculator/Calculator.tsx:67` | Move `lg:-rotate-[0.4deg]` to `MOTION` token or remove | `design-mentor` |
| **Po5** | `[ux]` | `src/components/landing/FeatureBentoGrid.tsx:14–69` | Add `--decorative-tint` CSS var that adapts in dark mode; replace `fill-primary-400` etc. on background blobs | `react-developer` |
| **Po6** | `[ux]` | `src/app/dashboard/[id]/page.tsx:27` | Distinguish "calc failed on stored input" (500/error.tsx) from "row not found" (notFound) | `react-developer` |

---

## Parallel execution groups

```text
Phase 1
├── Group 1A  — T1.1, T1.2, T1.3 in parallel
└── Group 1B  — T1.4 after 1A complete

Phase 2 (after Phase 1)
├── Group 2A  — T2.1, T2.2, T2.3, T2.4, T2.5, T2.6 all in parallel
└── Group 2B  — T2.7 after T2.1

Phase 3 — any time, any order, any agent
```

A single sub-agent dispatch using `superpowers:dispatching-parallel-agents` over Group 2A is the highest-leverage step: 6 unrelated improvements across non-overlapping files.

---

## Open questions for the user

1. **T1.4 — auth provider choice.** Clerk is the lowest-friction option on Vercel Marketplace ([install link](https://vercel.com/marketplace/clerk)). Auth.js v5 is open-source/self-hosted. Pick one — the rest of T1.4 depends on it.
2. **T2.7 — landing claims**: Option A (gate with "Bald verfügbar") or Option B (remove and re-introduce)?
3. **Po3 — demo input**: keep "Hohes Risiko" demo to demonstrate the verdict system, or pick a positive demo to encourage first-time clicks?
4. **C4 / T1.2** — should the test runner be Vitest (added) or do you prefer the Storybook-browser-only setup to remain the only test pipeline (in which case calculator tests would be `.stories.test.tsx` interaction tests)?

---

## Re-audit checklist

After Phase 1 lands, re-run the audit with these specific checks:

- [ ] `curl -i http://localhost:3000/dashboard/demo-001` (no cookie) returns 307 → `/anmelden`
- [ ] `curl -i http://localhost:3000/api/analyses/demo-001` (no cookie) returns 401 (already passes)
- [ ] `Grep "mock-user|MOCK_USER_ID|AUTH_KEY" src/` returns 0 hits
- [ ] `npm run test` exists and runs ≥ 30 assertions
- [ ] `Grep "from ['\"]recharts" src/` returns 0 hits
- [ ] `Grep "bg-white\b|text-stone-9|text-neutral-9" src/components/{landing,layout,auth,dashboard}/` returns 0 hits
- [ ] Re-take `08-dashboard-375.png`; cashflow shows `−82 €` (U+2212)
- [ ] Storybook with `data-theme="dark"` toolbar renders all 13 fixed components legibly
- [ ] `npx tsc --noEmit && npm run lint && npm run build` all pass

When all are green, the rewrite is launch-ready against the inferred user-story baseline used in this audit.
