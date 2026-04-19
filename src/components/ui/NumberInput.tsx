"use client";

import { forwardRef, useMemo, type ChangeEvent } from "react";
import { Input } from "./Input";

interface NumberInputProps {
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  suffix?: string;
  error?: string;
  helperText?: string;
  min?: number;
  max?: number;
  id?: string;
  name?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const FORMATTER = new Intl.NumberFormat("de-DE");

function formatDisplay(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "";
  return FORMATTER.format(value);
}

function parseInput(raw: string): number | null {
  const stripped = raw.replace(/[^0-9,]/g, "").replace(",", ".");
  if (stripped === "") return null;
  const n = Number.parseFloat(stripped);
  return Number.isNaN(n) ? null : n;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, onChange, suffix = "€", ...rest },
  ref,
) {
  const displayValue = useMemo(() => formatDisplay(value), [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseInput(e.target.value));
  };

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={displayValue}
      onChange={handleChange}
      suffix={suffix}
      {...rest}
    />
  );
});
