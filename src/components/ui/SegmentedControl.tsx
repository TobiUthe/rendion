"use client";

import { useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Apple-style segmented control. Box-shaped at h-11 to match input primitives.
 *
 * Visual: sand-100 pill container with a white/surface sliding active indicator.
 * Active segment: bg-[--color-surface] + shadow-sm + primary text.
 * Inactive: transparent + muted text, hover darkens text.
 *
 * Semantics: role="radiogroup" / role="radio" / aria-checked.
 * Keyboard: ArrowLeft/ArrowRight navigate, Home/End jump, Enter/Space selects.
 * Motion: sliding indicator via absolute positioned div + CSS transform.
 *         Respects prefers-reduced-motion — instant swap when reduced.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndex = options.findIndex((o) => o.value === value);

  // Roving tabindex: only the active item is tabbable.
  const focusItem = useCallback(
    (index: number) => {
      const el = containerRef.current?.querySelector<HTMLButtonElement>(
        `[data-index="${index}"]`,
      );
      el?.focus();
    },
    [],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % options.length;
      onChange(options[next].value);
      focusItem(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + options.length) % options.length;
      onChange(options[prev].value);
      focusItem(prev);
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(options[0].value);
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange(options[options.length - 1].value);
      focusItem(options.length - 1);
    }
  };

  // Sync focus when value changes via keyboard
  useEffect(() => {
    // Only auto-focus when the container or a child already has focus
    const container = containerRef.current;
    if (!container) return;
    const focused = container.contains(document.activeElement);
    if (focused) {
      focusItem(activeIndex);
    }
  }, [activeIndex, focusItem]);

  const segmentWidth = options.length > 0 ? 100 / options.length : 100;

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      className={cn(
        // Container: h-11 matches inputs, pill background, inner padding
        "relative flex h-11 w-full items-center rounded-lg bg-sand-100 p-1",
        className,
      )}
    >
      {/* Sliding active indicator — positioned absolute behind buttons */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-1 bottom-1 rounded-md bg-[var(--color-surface)] shadow-sm",
          // Motion: slide transition with spring easing. Instant on reduced-motion.
          "motion-safe:transition-transform motion-safe:[transition-duration:200ms] motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        )}
        style={{
          width: `calc(${segmentWidth}% - ${4 / options.length}px)`,
          transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * (4 / options.length)}px))`,
        }}
      />

      {options.map((opt, index) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            data-index={index}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              // Each button fills equal width, sits above the indicator
              "relative z-10 flex-1 min-w-0 whitespace-nowrap rounded-md px-3 py-1.5",
              "text-sm font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
              isSelected
                ? "text-[var(--color-foreground)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)]",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
