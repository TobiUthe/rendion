"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { parseDE, liveFormatDE } from "@/lib/format";

interface UseFocusedInputOptions {
  liveFormat?: boolean;
}

/**
 * Shared focus/blur/change logic for German-formatted numeric inputs.
 * While focused the user edits a raw string; on blur the raw string is parsed
 * back via `parseDE`. With `liveFormat` (default) thousand-separator dots are
 * inserted on every keystroke and the cursor is restored after re-render.
 */
export function useFocusedInput(
  value: number | undefined,
  formatter: (v: number) => string,
  options: UseFocusedInputOptions = {},
) {
  const { liveFormat = true } = options;
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (liveFormat && cursorRef.current !== null && inputRef.current && focused) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
      cursorRef.current = null;
    }
  });

  const displayValue = focused
    ? raw
    : value !== undefined && value !== 0
      ? formatter(value)
      : "";

  const handleFocus = () => {
    setFocused(true);
    setRaw(value !== undefined && value !== 0 ? formatter(value) : "");
  };

  const handleBlur = (onCommit: (parsed: number | undefined) => void) => {
    setFocused(false);
    if (raw.trim() === "") {
      onCommit(undefined);
    } else {
      onCommit(parseDE(raw));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (liveFormat) {
      const cursor = e.target.selectionStart ?? 0;
      const result = liveFormatDE(e.target.value, cursor);
      cursorRef.current = result.cursor;
      setRaw(result.formatted);
    } else {
      const cleaned = e.target.value.replace(/[^\d,\-]/g, "");
      setRaw(cleaned);
    }
  };

  return { focused, raw, inputRef, displayValue, handleFocus, handleBlur, handleChange };
}
