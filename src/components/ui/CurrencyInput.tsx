"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { formatDE } from "@/lib/format";
import { useFocusedInput } from "@/hooks/useFocusedInput";
import { Input } from "./Input";

interface CurrencyInputProps {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  suffix?: ReactNode;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = "0",
  className = "",
  suffix = "€",
}: CurrencyInputProps) {
  const autoId = useId();
  const { inputRef, displayValue, handleFocus, handleBlur, handleChange } =
    useFocusedInput(value, formatDE);

  return (
    <Input
      ref={inputRef}
      id={autoId}
      type="text"
      inputMode="decimal"
      label={typeof label === "string" ? label : undefined}
      value={displayValue}
      placeholder={placeholder}
      suffix={suffix}
      wrapperClassName={className}
      onFocus={handleFocus}
      onBlur={() => handleBlur((v) => onChange(v ?? 0))}
      onChange={handleChange}
    />
  );
}
