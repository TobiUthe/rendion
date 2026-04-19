"use client";

import { useEffect, useState } from "react";

export const AUTH_KEY = "rendion_auth";

export function setMockAuth(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, "1");
  document.cookie = `${AUTH_KEY}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function clearMockAuth(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
  document.cookie = `${AUTH_KEY}=; path=/; max-age=0`;
}

export function isMockAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}

/**
 * Hydration-safe hook. Returns `null` during SSR and on the first client render,
 * then the real value after mount. Consumers should treat `null` as "unknown".
 */
export function useMockAuth(): boolean | null {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(isMockAuthenticated());
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) setAuthed(e.newValue === "1");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return authed;
}
