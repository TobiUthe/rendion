# Auth Spec

Authentication architecture for rendion. Currently mock-only. This spec documents the current state, the contract every server file must follow, and the work required before any non-demo deploy.

Source: [`src/lib/auth/`](../../src/lib/auth/).

---

## Current state (mock auth)

Auth is intentionally minimal while the product is in pre-launch development:

| File | Role |
|------|------|
| `src/lib/auth/mockAuth.ts` | Client-side — exports `AUTH_KEY` constant, `setMockAuth()` / `clearMockAuth()` / `useMockAuth()`. Sets a plain `rendion_auth=1` cookie. |
| `src/lib/auth/requireUser.ts` | Server-only — reads the cookie, returns `'mock-user'` if authed, `null` if not. Single source of truth for server-side auth checks. |

`AUTH_KEY` is a plain string constant (`"rendion_auth"`). `requireUser()` is the only place where the cookie is read on the server — all server routes and pages import from here, not from `mockAuth.ts` directly.

**What T1.1 fixed (2026-04)**: `src/app/dashboard/[id]/page.tsx` was querying Drizzle with a hard-coded `MOCK_USER_ID` constant without first checking the auth cookie. Any request with a guessed analysis ID returned 200. The page now calls `requireUser()` before the DB query and redirects unauthenticated requests to `/anmelden`. See [audit-report.md C1](../../product-artifacts/audit-report.md).

**What remains before launch** (see [improvement-plan.md T1.4](../../product-artifacts/improvement-plan.md)):
- Replace mock auth with a real provider (Clerk or Auth.js v5).
- Replace the plain unsecured cookie with a signed, `HttpOnly`, `Secure` session cookie.
- Source a real `userId` from the session instead of the `'mock-user'` constant.
- Enforce per-user data isolation end to end (DB rows already have `userId` columns — only the constant needs replacing).

---

## The contract

**Every server route or page that reads a database row by `userId` MUST call `requireUser()` first.**

```ts
import { requireUser } from '@/lib/auth/requireUser';

// In a Server Component page:
const userId = await requireUser();
if (!userId) redirect('/anmelden?next=<current path>');

// In an API route handler:
const userId = await requireUser();
if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
```

- `null` return means unauthenticated. Pages redirect to `/anmelden`; API routes return 401.
- Pass the returned `userId` directly to the Drizzle `where` clause. Never hard-code `'mock-user'` or any constant user id in a query.
- Do not call `cookies()` directly from route files — go through `requireUser()` so the auth logic has one upgrade point.

---

## Cookie shape (mock — will change)

| Attribute | Current value | Required at launch |
|-----------|---------------|--------------------|
| Name | `rendion_auth` | TBD (provider decides) |
| Value | `"1"` | Signed session token |
| Path | `/` | `/` |
| Max-Age | 30 days | Provider default |
| SameSite | `Lax` | `Lax` |
| Secure | Not set | Required (HTTPS only) |
| HttpOnly | Not set | Required (JS cannot read) |

When a real provider (Clerk, Auth.js) lands, `requireUser()` will call the provider's session API instead of reading the raw cookie. The call sites do not change — only the implementation of `requireUser()`.

---

## Pre-launch checklist

These items are required before any non-demo deploy. Sourced from [improvement-plan.md Phase 1](../../product-artifacts/improvement-plan.md):

- [ ] **T1.1 — done.** `curl http://localhost:3000/dashboard/demo-001` (no cookie) returns 307 to `/anmelden`, not 200.
- [ ] **T1.4 — pending.** Replace mock auth with Clerk or Auth.js v5 (see improvement-plan.md T1.4 for steps).
- [ ] `Grep "mock-user|MOCK_USER_ID|AUTH_KEY" src/` returns 0 hits after T1.4 lands.
- [ ] Auth cookie has `Secure` + `HttpOnly` flags (provider default closes audit finding I3).
- [ ] Two test users see disjoint analysis lists at `/dashboard`.
- [ ] `curl http://localhost:3000/api/analyses/demo-001` (no cookie) still returns 401.
- [ ] `npx tsc --noEmit && npm run lint && npm run build` all pass after T1.4.

---

## Upgrading to a real provider

When T1.4 lands, the only file that needs to change for the auth gate logic is `src/lib/auth/requireUser.ts`. Replace the cookie read with the provider's session call:

```ts
// Example with Auth.js v5:
import { auth } from '@/auth';

export async function requireUser(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

// Example with Clerk:
import { currentUser } from '@clerk/nextjs/server';

export async function requireUser(): Promise<string | null> {
  const user = await currentUser();
  return user?.id ?? null;
}
```

All call sites (`src/app/dashboard/[id]/page.tsx`, `src/app/api/analyses/[id]/route.ts`, and any future routes) are insulated from the provider change.
