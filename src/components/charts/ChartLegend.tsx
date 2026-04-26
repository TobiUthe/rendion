"use client";

import { cn } from "@/lib/utils";
import { MOTION } from "@/lib/design-tokens";
import { prefersReducedMotion } from "@/lib/chart-utils";
import { useMemo } from "react";

export interface LegendSeries {
  key: string;
  label: string;
  /** Hex color string sourced from design tokens (PALETTES / CHART_ROLES / CHART_SEMANTIC). */
  color: string;
  /**
   * Swatch shape override.
   * - "dot" (default for most series): 8×8 rounded-full circle
   * - "line": 12×2 rounded-full horizontal bar — use for cumulative/net overlay lines
   * - "square": 8×8 rounded-sm block — use for stacked-area fills
   */
  shape?: "dot" | "line" | "square";
}

interface ChartLegendFocusProps {
  series: LegendSeries[];
  mode: "focus";
  activeKey: string | null;
  onToggle: (key: string) => void;
  align?: "start" | "center" | "end";
  ariaLabel?: string;
  className?: string;
}

interface ChartLegendToggleProps {
  series: LegendSeries[];
  mode: "toggle";
  hiddenKeys: Set<string>;
  onToggle: (key: string) => void;
  align?: "start" | "center" | "end";
  ariaLabel?: string;
  className?: string;
}

type ChartLegendProps = ChartLegendFocusProps | ChartLegendToggleProps;

const alignClass: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

/** Render the appropriate swatch shape based on series metadata. */
function Swatch({ color, shape = "dot" }: { color: string; shape?: LegendSeries["shape"] }) {
  if (shape === "line") {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-[2px] w-3 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
    );
  }
  if (shape === "square") {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 shrink-0 rounded-sm"
        style={{ backgroundColor: color }}
      />
    );
  }
  // Default: dot
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export function ChartLegend(props: ChartLegendProps) {
  const { series, mode, onToggle, align = "start", ariaLabel, className } = props;

  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  // Transition duration from MOTION token — zero when reduced motion is preferred
  const transitionStyle = reducedMotion
    ? undefined
    : { transition: `opacity ${MOTION.durBase}ms ease` };

  return (
    <ul
      role="list"
      aria-label={ariaLabel ?? "Diagramm-Legende"}
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-2",
        alignClass[align] ?? alignClass.start,
        className,
      )}
    >
      {series.map((s) => {
        let isPressed: boolean;
        let isDimmed: boolean;

        if (mode === "focus") {
          const { activeKey } = props as ChartLegendFocusProps;
          isPressed = activeKey === s.key;
          isDimmed = activeKey !== null && !isPressed;
        } else {
          const { hiddenKeys } = props as ChartLegendToggleProps;
          isPressed = !hiddenKeys.has(s.key);
          isDimmed = hiddenKeys.has(s.key);
        }

        return (
          <li key={s.key}>
            <button
              type="button"
              aria-pressed={isPressed}
              onClick={() => onToggle(s.key)}
              style={{
                opacity: isDimmed ? 0.4 : 1,
                ...transitionStyle,
              }}
              className={cn(
                // 44px min hit target via padding — no forced height
                "flex min-h-[44px] items-center gap-2 px-1 py-2.5",
                "rounded focus-visible:outline-2 focus-visible:outline-offset-2",
                "focus-visible:outline-[var(--color-steel-600)]",
              )}
            >
              <Swatch color={s.color} shape={s.shape} />
              <span
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {s.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
