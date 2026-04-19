import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  suffix?: ReactNode;
  prefix?: ReactNode;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, suffix, prefix, error, helperText, className, wrapperClassName, id, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const describedById = error || helperText ? `${inputId}-desc` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center rounded-lg border bg-white shadow-sm transition-colors",
          "focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200/60",
          error ? "border-danger-500" : "border-sand-200",
        )}
      >
        {prefix && <span className="pl-3 text-sm text-neutral-400">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById}
          className={cn(
            "flex-1 bg-transparent px-3 py-2 font-mono text-base text-neutral-900 tabular-nums placeholder:text-neutral-400 focus:outline-none",
            className,
          )}
          {...rest}
        />
        {suffix && <span className="pr-3 text-sm text-neutral-500">{suffix}</span>}
      </div>
      {(error || helperText) && (
        <p
          id={describedById}
          className={cn("text-xs", error ? "text-danger-600" : "text-neutral-500")}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
});
