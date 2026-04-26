"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { useFocusedInput } from "@/hooks/useFocusedInput";
import { Input } from "./Input";

interface YearsInputProps {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
}

export function YearsInput({
  label,
  value,
  onChange,
  placeholder = "0",
  className = "",
  min = 1,
  max = 50,
}: YearsInputProps) {
  const autoId = useId();
  const { inputRef, displayValue, handleFocus, handleBlur, handleChange } =
    useFocusedInput(value, (v) => (v === 0 ? "" : String(Math.round(v))));

  return (
    <Input
      ref={inputRef}
      id={autoId}
      type="text"
      inputMode="numeric"
      label={typeof label === "string" ? label : undefined}
      value={displayValue}
      placeholder={placeholder}
      suffix="Jahre"
      wrapperClassName={className}
      onFocus={handleFocus}
      onBlur={() =>
        handleBlur((v) => {
          const next = Math.round(v ?? 0);
          const clamped = Math.min(max, Math.max(min, next));
          onChange(clamped);
        })
      }
      onChange={handleChange}
    />
  );
}
