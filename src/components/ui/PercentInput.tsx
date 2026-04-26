"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { formatDE } from "@/lib/format";
import { useFocusedInput } from "@/hooks/useFocusedInput";
import { Input } from "./Input";

interface PercentInputProps {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
}

export function PercentInput({
  label,
  value,
  onChange,
  placeholder = "0",
  className = "",
  min = 0,
  max = 100,
}: PercentInputProps) {
  const autoId = useId();
  const { inputRef, displayValue, handleFocus, handleBlur, handleChange } =
    useFocusedInput(value, (v) => formatDE(v));

  return (
    <Input
      ref={inputRef}
      id={autoId}
      type="text"
      inputMode="decimal"
      label={typeof label === "string" ? label : undefined}
      value={displayValue}
      placeholder={placeholder}
      suffix="%"
      wrapperClassName={className}
      onFocus={handleFocus}
      onBlur={() =>
        handleBlur((v) => {
          const next = v ?? 0;
          const clamped = Math.min(max, Math.max(min, next));
          onChange(clamped);
        })
      }
      onChange={handleChange}
    />
  );
}
