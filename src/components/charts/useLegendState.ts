"use client";

import { useState, useCallback } from "react";

// ── Focus mode ──────────────────────────────────────────────────────────────
// Clicking a key activates it; clicking again clears. Used when hiding other
// series would break chart math (e.g. waterfall running total).

export interface FocusLegendState {
  mode: "focus";
  activeKey: string | null;
  onToggle: (key: string) => void;
  reset: () => void;
}

// ── Toggle mode ─────────────────────────────────────────────────────────────
// Clicking a key hides / shows it. Used when the stack/domain can cleanly
// recompute without the hidden series.

export interface ToggleLegendState {
  mode: "toggle";
  hiddenKeys: Set<string>;
  onToggle: (key: string) => void;
  isHidden: (key: string) => boolean;
  reset: () => void;
}

// ── useFocusLegend ───────────────────────────────────────────────────────────

export function useFocusLegend(): FocusLegendState {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const onToggle = useCallback((key: string) => {
    setActiveKey((prev) => (prev === key ? null : key));
  }, []);

  const reset = useCallback(() => setActiveKey(null), []);

  return { mode: "focus", activeKey, onToggle, reset };
}

// ── useToggleLegend ──────────────────────────────────────────────────────────

export function useToggleLegend(initialHidden: string[] = []): ToggleLegendState {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(() => new Set(initialHidden));

  const onToggle = useCallback((key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const isHidden = useCallback((key: string) => hiddenKeys.has(key), [hiddenKeys]);

  const reset = useCallback(() => setHiddenKeys(new Set(initialHidden)), []);  // eslint-disable-line react-hooks/exhaustive-deps

  return { mode: "toggle", hiddenKeys, onToggle, isHidden, reset };
}

// ── useLegendState (overloaded convenience wrapper) ──────────────────────────
// Kept for the plan's stated API. Delegates to the mode-specific hooks above.
// Because hooks can't be called conditionally, this wrapper always calls both
// internal hooks and returns only the relevant state object.

interface FocusOptions {
  mode: "focus";
}

interface ToggleOptions {
  mode: "toggle";
  initialHidden?: string[];
}

export function useLegendState(options: FocusOptions): FocusLegendState;
export function useLegendState(options: ToggleOptions): ToggleLegendState;
export function useLegendState(
  options: FocusOptions | ToggleOptions,
): FocusLegendState | ToggleLegendState {
  // Both hooks are always called — React requires unconditional hook calls.
  const focusState = useFocusLegend();
  const toggleState = useToggleLegend(
    options.mode === "toggle" ? (options.initialHidden ?? []) : [],
  );

  return options.mode === "focus" ? focusState : toggleState;
}
