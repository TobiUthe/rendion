"use client";

import type { ReactNode } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";

interface ChartContainerProps {
  minHeight?: number;
  height?: number;
  className?: string;
  children: ReactNode;
}

export function ChartContainer({
  minHeight = 300,
  height,
  className = "",
  children,
}: ChartContainerProps) {
  const { ref, width } = useResizeObserver();

  return (
    <div
      ref={ref}
      className={`relative w-full ${className}`}
      style={{ minHeight: height ?? minHeight }}
    >
      {width === 0 ? (
        <div className="flex h-full min-h-[inherit] items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--color-neutral-200)]" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function ChartContainerWithDimensions({
  minHeight = 300,
  className = "",
  children,
}: {
  minHeight?: number;
  className?: string;
  children: (width: number, height: number) => ReactNode;
}) {
  const { ref, width, height } = useResizeObserver();
  const effectiveHeight = Math.max(height, minHeight);

  return (
    <div
      ref={ref}
      className={`relative w-full ${className}`}
      style={{ minHeight }}
    >
      {width === 0 ? (
        <div className="flex h-full min-h-[inherit] items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--color-neutral-200)]" />
        </div>
      ) : (
        <div className="animate-chart-enter">{children(width, effectiveHeight)}</div>
      )}
    </div>
  );
}
