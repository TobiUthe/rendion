# Rendion App Audit Report

## Overview

- **App**: rendion v0.1.0 — German rental-property financial analyzer (rewrite of `immo-deals`)
- **Scope**: Full app — landing, auth, dashboard, calculator, charts, results
- **Stack**: Next.js 16.2.4 (Turbopack), React 19.2.4, Tailwind v4, TypeScript ^5, Drizzle ORM 0.36 + Neon serverless, Zod 3, D3 v7, Recharts 3.8 (unused), Storybook 10, Vitest 4 + Playwright
- **Date**: 2026-04-25
- **Auditor**: Claude Code (`/my-skills:app-auditor`)
- **Browser Testing**: Live Playwright at 1280 / 375 (8 screenshots in `tmp/audit-screenshots/`)
- **Methodology**: Code review + dev-server crawl + 6 web searches grounding the audit in current 2026 best practices.

---

## Research Summary (Phase 1.5)

| Tech | Project version | Latest / Current Best Practice | Sources |
|------|-----------------|--------------------------------|---------|
| Next.js | **16.2.4** | App Router; RSCs default; opt-in caching via `cacheComponents` + `use cache` directive; default 300s function timeout; **prefer Server Actions over API route handlers for mutations** with five-layer security (auth + Zod + authz + rate limit + error handling) | [Next 16 blog](https://nextjs.org/blog/next-16), [Caching guide](https://nextjs.org/docs/app/getting-started/caching), [Server Actions security (Makerkit)](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions) |
| React | **19.2.4** | Use `useActionState` + `<form action>` for mutations; replace `useState`+`useEffect` form patterns; `useFormStatus` for nested form state; `use` hook for promises in client | [React 19 release](https://react.dev/blog/2024/12/05/react-19), [Forms with Zod](https://www.freecodecamp.org/news/handling-forms-nextjs-server-actions-zod/) |
| Tailwind | **v4** | CSS-first config via `@theme`; `bg-linear-to-*` (not `bg-gradient-to-*`); avoid `@apply`; v4 targets Safari 16.4+/Chrome 111+/Firefox 128+ | [v4 release](https://tailwindcss.com/blog/tailwindcss-v4), [v4 migration](https://www.digitalapplied.com/blog/tailwind-css-v4-2026-migration-best-practices) |
| Zod | **3.23.8** | v4 is current major as of 2026; v3 still supported; strict validation on every Server Action / API route is mandatory | [Type-safe Server Actions](https://yournextstore.com/blog/typesafe-server-actions-zod-nextjs) |
| Drizzle | **0.36.4 / Neon-http** | Parameterized queries (safe); recommend per-row RLS once real auth lands; use `prepare()` for hot paths | (Neon serverless docs in repo) |
| D3 | **v7** | ResizeObserver responsive sizing (correct here); `<svg role="img" aria-label="…">` for screen readers | (See `docs/specs/charts.md`) |
| WCAG | **2.2 AA** | Target size **24×24 CSS px** (2.5.8); focus indicators ≥ 2px and 3:1 contrast (2.4.11); focus-not-obscured | [WCAG 2.2 changes](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/), [Level Access checklist](https://www.levelaccess.com/blog/wcag-2-2-aa-summary-and-checklist-for-website-owners/) |
| Core Web Vitals | **2026 thresholds** | LCP < 2.5s · INP < 200ms · CLS < 0.1 (75th percentile of CrUX) | [web.dev Vitals](https://web.dev/articles/vitals), [Google Search docs](https://developers.google.com/search/docs/appearance/core-web-vitals) |

---

## Requirements Files

No formal user stories, personas, or acceptance criteria exist in the repo. Only technical specs were found in [docs/specs/](../docs/specs/). The audit therefore uses **inferred** stories synthesised from landing copy, the calculator's domain, and predecessor-project signals — clearly tagged `[inferred]`.

### Inferred Personas

| ID | Name | Goal | Primary signals |
|----|------|------|-----------------|
| **P1** | "Erstinteressent" — first-time real-estate evaluator | Quickly judge if a listing is a good deal without committing to anything | Hero CTA "Rendite in 5 Sekunden", "Kostenlos · Ohne Anmeldung · DSGVO-konform" |
| **P2** | "Vergleicher" — has a few candidate properties, wants side-by-side | Save multiple analyses, revisit and tweak parameters | `/dashboard` list + `/dashboard/[id]` editor, mock data of 3 properties at distinct quality grades |
| **P3** | "Tiefenanalyst" — wants AfA, Cap Rate, DSCR, Monte Carlo | Premium/PRO features for advanced analysis | FeatureBentoGrid PRO badges (Deal Scoring, Profi-Analyse) |

### Inferred User Stories

All marked `[inferred]`.

| ID | Story | Implementation file(s) |
|----|-------|------------------------|
| US-1 | As **P1** I can input Kaufpreis/Kaltmiete/Eigenkapital on the landing page and see Bruttorendite, Kaufpreisfaktor, monatlicher Cashflow live | [`Calculator.tsx`](../src/components/calculator/Calculator.tsx), [`HeroWithCalculator.tsx`](../src/components/landing/HeroWithCalculator.tsx) |
| US-2 | As **P1** I can submit and see a full result page with verdict, KPI cards, and 30-year wealth chart | [`/ergebnis`](../src/app/ergebnis/page.tsx), [`ErgebnisView.tsx`](../src/components/results/ErgebnisView.tsx) |
| US-3 | As **P1** I can see DSCR, Cap Rate, AfA / Steuereffekte, Eigenkapitalrendite | `quick-calc.ts` computes them, **but `ErgebnisView` only renders 3 of them** (`DESKTOP_KPI_INDICES = [0,2,3]`) |
| US-4 | As **P2** I can register, save analyses, and see them in a dashboard | [`/registrieren`](../src/app/registrieren/page.tsx), [`/dashboard`](../src/app/dashboard/page.tsx), but **mock auth with shared user** |
| US-5 | As **P2** I can re-open a saved analysis and edit parameters with persistence | [`/dashboard/[id]`](../src/app/dashboard/[id]/page.tsx) + [`PATCH /api/analyses/[id]`](../src/app/api/analyses/[id]/route.ts) |
| US-6 | As **P2** I can compare ETF vs property | **Not implemented** — landing claims it (`FeatureBentoGrid` "ETF-Vergleich") |
| US-7 | As **P3** I can run Monte Carlo, sensitivity, deal scoring | **Not implemented** — landing claims it as PRO |
| US-8 | As **anyone** I can share a result via URL link | `Link kopieren` button + `encodeQuickParams` in `url-params.ts` |

### Coverage Matrix

| Story | Criteria total | Complete | Partial | Missing | Coverage |
|-------|---------------:|---------:|--------:|--------:|---------:|
| US-1 | 3 | 3 | 0 | 0 | 100% |
| US-2 | 4 | 4 | 0 | 0 | 100% |
| US-3 | 4 | 1 | 3 | 0 | 25% |
| US-4 | 3 | 0 | 3 | 0 | 0% (mock only) |
| US-5 | 3 | 1 | 2 | 0 | 33% (no auth, no per-user data) |
| US-6 | 1 | 0 | 0 | 1 | 0% |
| US-7 | 3 | 0 | 0 | 3 | 0% |
| US-8 | 2 | 2 | 0 | 0 | 100% |
| **Total** | **23** | **11** | **8** | **4** | **48%** |

---

## Persona Flow Coverage

| Persona | Flow | Status | Issues |
|---------|------|--------|--------|
| **P1** | F1 — Land → enter values → live preview → submit → /ergebnis | ✅ Complete | Demo input (380k / 1.2k / 95k) yields "Hohes Risiko" — first-time visitors see a discouraging result; consider a more neutral demo |
| **P1** | F3 — Quick-calc skeptic via shared URL → /ergebnis | ✅ Complete | Empty/invalid `d` param falls through to `ErgebnisEmptyState` cleanly |
| **P2** | F2 — /anmelden → /dashboard → click analysis → edit → autosaves | ⚠ Friction | "Demo-Modus" copy openly tells the user it's fake; no real auth means the saved-analysis story is symbolic |
| **P2** | F4 — Sidebar nav: Analysen, Einstellungen | ✅ Complete | Both pages render; not deeply audited |
| **P3** | Premium / Profi-Analyse | ❌ Missing | PRO features advertised on landing don't exist |

---

## UX Quality

| Category | Rating | Key Findings |
|----------|--------|--------------|
| **V1 Usability & Flows** | Strong | Clear entry path landing→calc→result. Live preview on calculator. Sticky "Parameter anpassen" bottom-sheet trigger on mobile is excellent. Empty/error states present (`ErgebnisEmptyState`). Login form has `noValidate` + accepts empty inputs (acceptable per "Demo-Modus" copy but confusing). |
| **V2 Visual Design** | Strong | Strong typography system (Libre Baskerville display + Work Sans body + IBM Plex Mono data). Warm sand-toned surface palette is distinctive and not generic-AI. Two-tone tabular numbers create good editorial rhythm on result pages. |
| **V3 Responsive** | Strong | Verified: home@1280, home@375, ergebnis@1280, ergebnis@375, dashboard@1280, dashboard@375, analysis@1280 — all reflow cleanly, no horizontal overflow at 375. KPI `mobilePriority` works (Cashflow + Bruttorendite shown on mobile). Charts adapt via `ResizeObserver`. |
| **V4 State Coverage** | Adequate | Loading: `RouteProgressBar` + button-text swap. Empty: ErgebnisEmptyState exists. Error: API has 401/404/400 paths, page falls back to `notFound()`. Missing: a 500 / corrupted-input error state on `/dashboard/[id]` (currently masquerades as 404). Newsletter footer renders an enabled-looking input but is "Bald verfügbar" — should be visually disabled. |
| **V5 Accessibility** | Adequate | Strong: all D3 charts have `role="img"`/`aria-label` per spec, ChartLegend uses `<button>` with `aria-pressed`, KPI live-region (`aria-live="polite"`) on calculator preview. Gaps: `AnimatedStat` count-up does not honor `prefers-reduced-motion`. No `lang` audit performed but `de` should be set on `<html>`. Focus indicators: present (custom `outline-2 outline-primary-600`) — passes 2.4.11 contrast at desktop. |

Console: **0 errors / 0 warnings** across all audited routes.

---

## Quality Baselines

| Baseline | Status | Violations |
|----------|--------|------------|
| Responsive Design (320–1280) | **PASS** | 0 critical; mobile reflow verified at 375 |
| Accessibility (WCAG 2.2 AA) | **MOSTLY** | 1 important (motion respect); spot checks only — not a full WCAG audit |
| State Coverage | **MOSTLY** | 1 important (newsletter "Bald verfügbar" should be disabled); 1 polish (corrupted-row 404 vs 500 distinction) |
| Security | **FAIL** | 4 critical / 3 important — see findings |
| Performance | **PASS** | Build succeeds; bundle table emitted but no oversized chunk seen; 1 polish — `recharts` is in deps but unused |
| Design-system conformance | **MOSTLY** | 13 component files violate dark-mode rule 1; 1 violation of locale spec in mock data |

---

## Technical Health

| Area | Status | Findings |
|------|--------|----------|
| `next build` | ✅ PASS | Compiled in 6.6s; all 10 routes generated; Turbopack production build |
| `npx tsc --noEmit` | ✅ PASS | exit 0 |
| `npm run lint` (eslint) | ✅ PASS | exit 0 |
| Code architecture | Strong | Clean layering: `app/` routes → `components/{ui,charts,calculator,results,dashboard,parameter-panel,landing,layout,auth,brand}/` → `lib/{calculator,db,schemas,hooks,format,design-tokens,mock,auth,analytics}/`. Specs in `docs/specs/` are excellent and largely respected. |
| Test coverage | **Weak** | **0 unit/spec test files** for business logic. Math (loan amortisation, cashflow projection, KPIs, format helpers, URL param round-trip) has no asserted behaviour. The 286 file count in initial exploration was Storybook stories — visual regressions only, no functional verification. |
| Performance | Adequate | `next.config.ts` enables `optimizePackageImports: ['recharts','lucide-react']` but `recharts` has zero imports in `src/`. D3 charts use `ResizeObserver` correctly per spec. No `next/image` audit was needed — site uses inline SVG illustrations. |
| Security | **Weak** | Mock auth is acknowledged in code TODO comments, but the page-route bypass (Critical 1) is not flagged anywhere. |

---

## Prioritized Findings

### Critical

#### C1. `[security]` `/dashboard/[id]` server page bypasses auth check entirely

The server component at [`src/app/dashboard/[id]/page.tsx:18–22`](../src/app/dashboard/[id]/page.tsx) queries Drizzle with `userId='mock-user'` **without checking the auth cookie**. The companion API route does check it, but the page does not.

**Reproduced**:
```bash
$ curl -i http://localhost:3000/dashboard/demo-001    # no cookie sent
HTTP/1.1 200 OK         # ← serves the analysis HTML
$ curl -i http://localhost:3000/api/analyses/demo-001 # no cookie sent
HTTP/1.1 401            # ← API correctly refuses
```

**Current** (`src/app/dashboard/[id]/page.tsx:15–24`):
```ts
export default async function DashboardDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [row] = await db
    .select()
    .from(schema.analyses)
    .where(and(eq(schema.analyses.id, id), eq(schema.analyses.userId, MOCK_USER_ID)))
    .limit(1);
  if (!row) notFound();
  …
}
```

**Recommended** (mirror the route handler's `requireUser`, or — better — adopt Server Actions per [Next 16 security guidance](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions)):
```ts
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/requireUser';

export default async function DashboardDetailPage({ params }: PageProps) {
  const userId = await requireUser();
  if (!userId) redirect('/anmelden?next=/dashboard/' + (await params).id);
  const { id } = await params;
  const [row] = await db.select().from(schema.analyses)
    .where(and(eq(schema.analyses.id, id), eq(schema.analyses.userId, userId)))
    .limit(1);
  if (!row) notFound();
  …
}
```

**Why**: An attacker who guesses or scrapes any analysis ID can read it, including (eventually) real-user data once mock auth is replaced. The fix must land *before* real auth ships, otherwise launch-day will leak.

---

#### C2. `[security]` Auth cookie is a literal `=1` string with no signing or identity

[`src/lib/auth/mockAuth.ts:10`](../src/lib/auth/mockAuth.ts) sets `rendion_auth=1; samesite=lax` (no `Secure`, no `HttpOnly`, no signature). [`src/app/api/analyses/[id]/route.ts:14`](../src/app/api/analyses/[id]/route.ts) trusts `value === '1'`. There is no user identity in the cookie — every authenticated request maps to the constant `MOCK_USER_ID = 'mock-user'`.

**Current** (`src/lib/auth/mockAuth.ts:7–11`):
```ts
export function setMockAuth(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, "1");
  document.cookie = `${AUTH_KEY}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}
```

**Recommended** (move to a hosted auth provider on the Vercel Marketplace before any non-demo deploy — Clerk, Auth.js, or Descope; see [Vercel auth integrations](https://vercel.com/marketplace?category=authentication)):
```ts
// e.g. NextAuth.js v5
import { auth } from '@/auth';
const session = await auth();
const userId = session?.user?.id;
```

**Why**: Even ignoring multi-tenancy, a static cookie value is trivially forgeable. The current code documents this as a `TODO(real-auth)` in three files — making it Critical here is a gate against shipping the rewrite with mock auth still wired up.

---

#### C3. `[security]` Hardcoded `MOCK_USER_ID = 'mock-user'` collapses multi-tenancy

[`src/app/api/analyses/[id]/route.ts:10`](../src/app/api/analyses/[id]/route.ts) and [`src/app/dashboard/[id]/page.tsx:9`](../src/app/dashboard/[id]/page.tsx) both store and look up rows under the same constant `'mock-user'`. Any real user that registers shares the same row set as every other user. The Drizzle schema has a `userId` column ([`src/lib/db/schema.ts:6`](../src/lib/db/schema.ts)) — it is correctly indexed for per-user lookups, but no real `userId` is ever stored.

**Recommended** (source: [Next 16 Server Actions security](https://vercel.com/academy/nextjs-foundations/security-review-apis-and-config)): Replace the constant with the real session user id everywhere it is referenced. Add a Drizzle migration to set `analyses.userId NOT NULL DEFAULT 'mock-user'` to a real user id during cutover. Consider Postgres RLS on `analyses` keyed by `current_setting('app.user_id')`.

**Why**: Coupled with C1, this means the production-shaped code already supports a class of bug ("user A reads user B's analysis") — the data model is correct, but every query path forgets the user context.

---

#### C4. `[testing]` Zero unit tests for calculator math — the heart of the product

`src/lib/calculator/quick-calc.ts`, `loan.ts`, `cashflow.ts`, `appreciation.ts`, `kpis.ts`, `mapResultToView.ts`, `url-params.ts` and all of `src/lib/format.ts` have **no `*.test.ts`/`*.spec.ts` companion files**. Verified by `Glob src/**/*.test.{ts,tsx}` and `src/**/*.spec.{ts,tsx}` — both empty.

**Current**: 46 `*.stories.tsx` files (visual regression coverage via Storybook + Vitest browser runner). Zero functional/behavioural tests.

**Recommended** (source: [Vitest 4 guide](https://vitest.dev/guide/)): Add `*.test.ts` next to each pure-function module and assert at least:
```ts
// src/lib/calculator/__tests__/quick-calc.test.ts
import { describe, it, expect } from 'vitest';
import { quickCalcKapitalanlage } from '../quick-calc';
import { withDefaults } from '../defaults';

describe('quickCalcKapitalanlage', () => {
  it('computes Bruttorendite as jahresmiete / kaufpreis', () => {
    const r = quickCalcKapitalanlage(withDefaults({ kaufpreis: 100_000, kaltmiete: 500, eigenkapital: 0 }));
    expect(r!.bruttoRendite).toBeCloseTo(6.0, 5); // 6.000 / 100.000 * 100
  });

  it('returns null on non-positive Kaufpreis', () => {
    expect(quickCalcKapitalanlage(withDefaults({ kaufpreis: 0, kaltmiete: 500, eigenkapital: 0 }))).toBeNull();
  });

  it('amortisation total matches darlehenssumme − last restschuld', () => {…});
});
```

**Why**: This is a financial-calculation product. A regression in `computeAnnuity` or `buildCashflowSeries` produces silently wrong euros, with no test to catch it. Storybook stories prove the chart *renders*, not that the numbers are *right*.

---

### Important

#### I1. `[design-system]` 13 component files violate dark-mode rule 1 (palette classes for surface/text)

`docs/specs/dark-mode.md` Rule 1: components must use `var(--color-surface)`/`var(--color-foreground)` etc., not raw palette classes like `bg-white` or `text-stone-900`.

**Files** (verified by `Grep "bg-white|text-stone-|text-neutral-|bg-sand-50|text-sand-"` in `src/components/`):
- `src/components/auth/MockAuthForm.tsx:40, 41, 42, 73`
- `src/components/landing/HeroWithCalculator.tsx:24, 28, 34, 41, 110, 111, 119`
- `src/components/landing/FeatureBentoGrid.tsx:315, 318, 343, 346`
- `src/components/landing/TrustBadges.tsx:16, 20`
- `src/components/landing/CTABanner.tsx:9, 10, 13`
- `src/components/landing/CalculatorTeaser.tsx`
- `src/components/landing/HeroSection.tsx`
- `src/components/layout/Section.tsx`, `Header.tsx`, `Footer.tsx`, `PageHeader.tsx`, `ThemeToggle.tsx`
- `src/components/dashboard/shell/DashboardUserFooter.tsx`

**Current** (`src/components/landing/CTABanner.tsx:9–13`):
```tsx
<div className="… border-sand-200 bg-gradient-to-br from-sand-50 to-white …">
  <h2 className="… text-neutral-900 …">Bereit für Ihre erste Analyse?</h2>
  <p className="… text-neutral-500">Kostenlos und ohne Anmeldung. In unter 2 Minuten.</p>
```

**Recommended** (source: `docs/specs/dark-mode.md` Rule 1):
```tsx
<div className="… border-[var(--color-border)] bg-[var(--color-surface)] …">
  <h2 className="… text-[var(--color-foreground)] …">Bereit für Ihre erste Analyse?</h2>
  <p className="… text-[var(--color-text-secondary)]">Kostenlos und ohne Anmeldung. In unter 2 Minuten.</p>
```

**Why**: In dark mode, `text-neutral-900` (mapped to `stone-900`, palette-locked) renders as near-black on a near-black surface — invisible. The Calculator and result components got it right; landing + auth + layout chrome got it wrong. ThemeToggle is the most ironic offender.

---

#### I2. `[design-system]` Mock dashboard data uses hyphen-minus instead of typographic minus

[`src/lib/mock/dashboard.ts:37`](../src/lib/mock/dashboard.ts):
```ts
cashflowMonat: "-82 €",   // ← ASCII hyphen-minus 0x2D
```

`docs/specs/numbers-and-locale.md`:
> Negative values: Typographic minus U+2212 (`−`), not hyphen-minus (`-`)

The dashboard list (screenshot `06-dashboard-1280.png`) shows **`-82 €`** for demo-002 — visibly different from the `−281 €` rendered through `formatDelta` on `/ergebnis`. Two glyphs for the same concept on the same site.

**Recommended**:
```ts
// Best — store numbers, format at render time
cashflowMonat: -82, // number
// In AnalysisCard:
{cashflow >= 0 ? formatDelta(cashflow, formatEuro) : formatDelta(cashflow, formatEuro)}
```
or, if the mock-as-strings shape must stay:
```ts
cashflowMonat: "−82 €", // U+2212
```

**Why**: Same-page inconsistency that any reader will notice. Storing pre-formatted strings also defeats the entire `format.ts` helper layer that was built to enforce this exact rule.

---

#### I3. `[security]` Cookie missing `Secure` flag

`src/lib/auth/mockAuth.ts:10` — `samesite=lax` only. Should also be `Secure` (HTTPS-only) and ideally `HttpOnly` (server-only) and signed.

**Recommended**: Move cookie creation server-side (a Server Action calling `cookies().set(name, value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', signed: true })`) before any non-demo deploy.

**Why**: SameSite=Lax allows the cookie on top-level GETs cross-origin — combined with the static `=1` value (C2) this is trivially forgeable.

---

#### I4. `[security]` PATCH `/api/analyses/[id]` has no CSRF protection or rate limiting

[`src/app/api/analyses/[id]/route.ts:44`](../src/app/api/analyses/[id]/route.ts) has `cookies` + Zod validation + ownership check (good) but no Origin/Referer check and no rate limit. Recommended for any mutation route per current Next 16 best practice (source: [Next.js security best practices 2026](https://www.authgear.com/post/nextjs-security-best-practices)).

**Recommended**: convert to a Server Action with React 19's built-in CSRF protection, OR add an explicit Origin check + Upstash rate limiter.

---

#### I5. `[testing]` No regression coverage on `decodeQuickParams` URL round-trip

[`src/lib/calculator/url-params.ts`](../src/lib/calculator/url-params.ts) is the only mechanism by which `/ergebnis` accepts external input. It does base64url decode + JSON parse + numeric guards. No tests assert the round-trip identity, the malformed-input rejection, or the array-vs-scalar `searchParams.d` handling.

**Recommended**:
```ts
// src/lib/calculator/__tests__/url-params.test.ts
it('round-trips kaufpreis/kaltmiete/eigenkapital', () => {
  const qs = encodeQuickParams({ kaufpreis: 380_000, kaltmiete: 1200, eigenkapital: 95_000 });
  expect(decodeQuickParams({ d: qs.replace('d=', '') })).toMatchObject({ kaufpreis: 380_000 });
});
it('rejects negative or zero kaufpreis', () => {…});
it('rejects malformed base64', () => {…});
```

---

#### I6. `[product]` Landing promises features that don't exist (ETF-Vergleich, Monte Carlo, Deal Scoring, AfA-Steuereffekte)

[`src/components/landing/FeatureBentoGrid.tsx:223–308`](../src/components/landing/FeatureBentoGrid.tsx) shows 7 feature cards including:
- **ETF-Vergleich** (no implementation found)
- **Profi-Analyse — Finanzierungs-Baukasten, Monte-Carlo-Simulation, Stresstests, Sensitivitätsanalyse** PRO badge (no implementation)
- **Deal Scoring — A–F Bewertung** PRO badge (no implementation, but `VerdictHero` exists with `level: good/mixed/risky` — so a 3-tier exists, not A–F)
- **AfA & Steuereffekte** — `quick-calc.ts` does compute `steuerersparnis` per year, but it's not shown anywhere in the UI

**Recommended**: either gate these cards behind a "Coming soon" badge, or remove them until the underlying feature ships. Mismatched promises erode trust the moment a visitor reaches /ergebnis and sees a smaller surface than advertised.

---

#### I7. `[performance]` `recharts` is a dependency but is not imported anywhere

`package.json` declares `"recharts": "^3.8.1"` and `next.config.ts` lists it in `optimizePackageImports`, but `Grep "from 'recharts'"` across `src/` returns 0 matches. ~50–100 KB of unused install footprint and config noise.

**Recommended**:
```bash
npm uninstall recharts
# Edit next.config.ts: remove 'recharts' from optimizePackageImports
```

---

#### I8. `[ux]` Newsletter footer renders enabled-looking input but is "Bald verfügbar"

The `Footer` component shows an email input + "Anmelden" button, with the disclaimer "Bald verfügbar" below in muted text. The button is greyed but the input still focuses, and submitting does nothing.

**Recommended**: `disabled` the input, add `aria-disabled="true"` on the button, replace placeholder with "Folgt bald", or remove the form entirely until the integration ships.

---

#### I9. `[a11y]` `AnimatedStat` count-up does not respect `prefers-reduced-motion`

[`src/components/landing/HeroWithCalculator.tsx:54–106`](../src/components/landing/HeroWithCalculator.tsx) drives a 1.6s `requestAnimationFrame` count-up unconditionally. The chart code uses `prefersReducedMotion()` from `chart-utils` — landing should mirror that.

**Recommended**:
```ts
import { prefersReducedMotion } from '@/lib/chart-utils';
// in animate():
if (prefersReducedMotion()) {
  setDisplay(formatDE(target) + suffix);
  return;
}
```

---

### Polish

- **Po1.** `[ux]` `/ergebnis` shows only 3 of the computed KPIs (`DESKTOP_KPI_INDICES = [0,2,3]` in `ErgebnisView.tsx:18`). DSCR, Cap Rate, Eigenkapitalrendite are computed but never displayed. Either hide them in `quick-calc` output or add a "Detail-KPIs" expandable below the main row.
- **Po2.** `[design-system]` `INPUTS.base` and `INPUT_BASE` coexist in `design-tokens.ts:196,365` with a comment "Replace existing INPUTS.base usage in PR 2; for now, both coexist." Schedule that cleanup.
- **Po3.** `[ux]` Demo input on the calculator (380k / 1.2k / 95k) yields a "Hohes Risiko" verdict — first-time demo-clickers see a discouraging result. Pick a more neutral example (e.g. 380k / 1.5k / 95k, which yields a positive cashflow).
- **Po4.** `[design-system]` `Calculator.tsx:67` has `lg:-rotate-[0.4deg]` arbitrary-value tilt. Cute, but not in motion tokens. Either move to `MOTION` tokens or remove.
- **Po5.** `[ux]` Decorative SVG blobs in `FeatureBentoGrid` use `opacity-[0.07]` etc. with palette colours (`fill-primary-400`). In dark mode these may either disappear or clip on the dark surface. Consider `var(--decorative-tint)` token.
- **Po6.** `[ux]` `/dashboard/[id]` returns `notFound()` if `quickCalcKapitalanlage` returns `null` (corrupted row) — should be a 500/error page, not 404.

---

## Spec Conformance Report

| Spec | Status | Notes |
|------|--------|-------|
| [`charts.md`](../docs/specs/charts.md) | ✅ PASS | All 4 D3 charts use `useThemeTokens`, `OPACITY`/`DASH` tokens, `responsiveMargin`/`responsiveFontSize`, `ChartLegend`. Verified in `WaterfallChart.tsx`. |
| [`mobile-responsive.md`](../docs/specs/mobile-responsive.md) | ✅ PASS | KPI `mobilePriority` works (verified at 375 viewport), `inlineFrom` pattern used in `ParameterPanel`, `BottomSheet` primitive in place. |
| [`parameter-panel.md`](../docs/specs/parameter-panel.md) | ✅ PASS | 5-tab structure intact, `LockedField` + `UpsellFooter` flow preserved, `unlockedTabs` API matches spec. |
| [`inputs.md`](../docs/specs/inputs.md) | ✅ PASS | `INPUT_SHAPE` referenced; `CurrencyInput`/`PercentInput`/`YearsInput` all derive from `Input` primitive. |
| [`dark-mode.md`](../docs/specs/dark-mode.md) | ❌ **FAIL** | 13 files violate Rule 1 — see I1. |
| [`numbers-and-locale.md`](../docs/specs/numbers-and-locale.md) | ❌ **FAIL** | Mock data uses hyphen-minus — see I2. |
| [`storybook.md`](../docs/specs/storybook.md) | ✅ PASS | 46 story files. Note: deleted `ModellingPanel.stories.tsx` was removed alongside the deleted component, which is correct per spec. |
| [typography.md → src/lib/specs.md](../src/lib/specs.md) | ✅ PASS (not deeply audited) | `HEADINGS`, `BODY`, `DATA` token blocks present and referenced. |

---

## Summary

- **Total findings**: **22** — 4 critical · 9 important · 6 polish · 3 spec violations rolled into Important
- **Requirements coverage**: ~48% of inferred user stories complete (mock auth, missing PRO features pull this down; the core P1 flow is 100%)
- **Persona flows**: 3 of 5 complete, 1 friction (P2 due to mock auth), 1 missing (P3 PRO)
- **Quality baselines**: 4 of 6 PASS (Responsive, Performance, Accessibility-mostly, State-mostly); Security FAIL; Design-system mostly-pass with two FAIL specs (dark-mode, numbers-and-locale)
- **Build / lint / typecheck**: all PASS
- **Console errors during live walks**: **0** (8 routes audited)

### Top priority

1. **Fix C1 immediately**: add the auth check to [`src/app/dashboard/[id]/page.tsx`](../src/app/dashboard/[id]/page.tsx) so the page mirrors the API route's `requireUser` gate. This is a 6-line change that closes a Critical data-leak risk *today*, before real auth lands.
2. **Schedule the C2 + C3 + I3 + I4 + I7 sweep** as a single "real auth + cleanup" pre-launch milestone. They all converge on the same code path.
3. **Add C4** — calculator math unit tests — as a required PR before any further feature work in `src/lib/calculator/`. A handful of `*.test.ts` files unlocks confident refactoring of the module.
4. **Run an I1 dark-mode audit pass** in parallel — `react-developer` skill can do all 13 files mechanically with the current/recommended pattern in this report.

### Skills needed to action the plan

- `specialist-agents:backend` — C1, C2, C3, I3, I4 (auth + API hardening)
- `my-skills:test-engineer` — C4, I5 (calculator + url-params unit tests)
- `my-skills:react-developer` (via `frontend`) — I1, I8, I9, Po1, Po3, Po5, Po6
- `my-skills:copy-writer` (via `frontend`) — I6 (landing claims to trim or gate)
- `my-skills:integration-engineer` — C2 substitute (Clerk / Auth.js Marketplace install on Vercel)
- `my-skills:design-mentor` — I2 (mock data shape) and Po2 (token cleanup)

### Browser captures (referenced from `tmp/audit-screenshots/`)

| File | Route | Viewport |
|------|-------|---------:|
| `01-home-1280.png` | `/` | 1280 |
| `02-home-375.png` | `/` | 375 |
| `03-ergebnis-1280.png` | `/ergebnis?d=…` | 1280 |
| `04-ergebnis-375.png` | `/ergebnis?d=…` | 375 |
| `05-anmelden-1280.png` | `/anmelden` | 1280 |
| `06-dashboard-1280.png` | `/dashboard` (post-login) | 1280 |
| `07-analysis-detail-1280.png` | `/dashboard/demo-001` | 1280 |
| `08-dashboard-375.png` | `/dashboard` | 375 |
| `_tsc.txt`, `_lint.txt`, `_build.txt` | command output | — |
