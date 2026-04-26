import { cookies } from 'next/headers';

// Mirrors AUTH_KEY in src/lib/auth/mockAuth.ts. Duplicated here to avoid
// importing from a "use client" module on the server runtime.
// TODO(real-auth): replace with the auth provider's session lookup.
const AUTH_KEY = 'rendion_auth';
const MOCK_USER_ID = 'mock-user';

/**
 * Server-only. Reads the auth cookie and returns the current userId, or null if
 * the request is unauthenticated.
 *
 * Contract: every server route or page that reads a row by userId MUST call this
 * first. null → redirect to /anmelden (pages) or return 401 (API routes).
 * See docs/specs/auth.md for the full auth spec.
 */
export async function requireUser(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_KEY)?.value === '1' ? MOCK_USER_ID : null;
}
