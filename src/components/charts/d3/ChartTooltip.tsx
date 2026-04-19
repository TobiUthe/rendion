import type { ReactNode } from "react";
import type { TooltipState } from "@/hooks/useChartTooltip";

interface ChartTooltipProps {
  tooltipProps: TooltipState;
  children?: ReactNode;
}

export function ChartTooltip({ tooltipProps }: ChartTooltipProps) {
  if (!tooltipProps.visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[var(--z-tooltip)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm shadow-lg"
      style={{
        left: tooltipProps.x,
        top: tooltipProps.y,
        transform: "translate(8px, -50%)",
      }}
    >
      {tooltipProps.content}
    </div>
  );
}
