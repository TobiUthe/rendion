"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { INPUT_BASE, STATES, BODY } from "@/lib/design-tokens";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  suffix?: ReactNode;
  prefix?: ReactNode;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
}

export function Input({
  label,
  suffix,
  prefix,
  error,
  helperText,
  className,
  wrapperClassName,
  id,
  disabled,
  ref,
  ...rest
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const describedById = error || helperText ? `${inputId}-desc` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className={BODY.formLabel}>
          {label}
        </label>
      )}
      <div
        className={cn(
          INPUT_BASE,
          "flex items-center",
          error ? STATES.focusError : STATES.focus,
          error ? STATES.invalid : "",
          disabled ? STATES.disabled : "",
        )}
      >
        {prefix && (
          <span className="shrink-0 pl-3 text-sm text-[var(--color-text-secondary)]">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById}
          className={cn(
            "min-w-0 flex-1 bg-transparent py-2.5 font-mono tabular-nums focus:outline-none focus-visible:outline-none",
            prefix ? "pl-2" : "pl-3",
            suffix ? "pr-2 text-right" : "pr-3",
            className,
          )}
          {...rest}
        />
        {suffix && (
          <span className="shrink-0 pr-3 text-sm text-[var(--color-text-secondary)]">
            {suffix}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <p
          id={describedById}
          className={error ? STATES.errorText : STATES.helperText}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
