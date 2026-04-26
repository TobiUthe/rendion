"use client";

import { type KeyboardEvent, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface TabsOption<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  options: readonly TabsOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Underline-style tabs primitive. Correct WAI-ARIA tablist semantics.
 *
 * Visual: border-bottom container, animated underline slides under active tab.
 * Use this for navigation between content panels (charts, report sections).
 * Use SegmentedControl instead when the tabs sit inline with form inputs.
 *
 * Semantics: role="tablist" / role="tab" / aria-selected.
 * Keyboard: ArrowLeft/ArrowRight navigate and activate (auto-activation).
 *           Home/End jump to first/last.
 */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const focusAndActivate = useCallback(
    (index: number) => {
      const el = containerRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab-index="${index}"]`,
      );
      el?.focus();
      onChange(options[index].value);
    },
    [onChange, options],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAndActivate((index + 1) % options.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAndActivate((index - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusAndActivate(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusAndActivate(options.length - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={cn("relative flex w-full border-b border-sand-200", className)}
    >
      {options.map((opt, index) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            data-tab-index={index}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "group relative flex-1 min-w-0 whitespace-nowrap px-3 pb-2.5 pt-1",
              "text-sm sm:text-sm-plus font-medium",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset",
              isSelected
                ? "text-primary-700"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)]",
            )}
          >
            {opt.label}
            {/* Animated underline indicator */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute bottom-0 left-2 right-2 h-[2px] rounded-full",
                "motion-safe:transition-transform motion-safe:duration-200",
                isSelected
                  ? "bg-primary-600 scale-x-100"
                  : "bg-transparent scale-x-0 group-hover:bg-[var(--color-border)] group-hover:scale-x-100",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
