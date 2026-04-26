"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// External store for theme state — avoids setState-in-useEffect
let currentTheme: Theme = "light";
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "light";
}

function initTheme() {
  const stored = localStorage.getItem("rnd_theme");
  if (stored === "light" || stored === "dark") {
    currentTheme = stored;
  } else {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  document.documentElement.setAttribute("data-theme", currentTheme);
}

// Initialize on module load (client-side only)
if (typeof window !== "undefined") {
  initTheme();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Hydration guard: server returns "light", client may differ
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const toggle = useCallback(() => {
    const next: Theme = currentTheme === "light" ? "dark" : "light";
    currentTheme = next;
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("rnd_theme", next);
    emitChange();
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center" aria-hidden />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
      aria-label={
        theme === "light"
          ? "Dunkelmodus aktivieren"
          : "Hellmodus aktivieren"
      }
    >
      {theme === "light" ? (
        <Moon className="h-[18px] w-[18px]" />
      ) : (
        <Sun className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
