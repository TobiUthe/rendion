"use client";

import { useState, useCallback } from "react";
import type { ReactNode } from "react";

export interface TooltipState {
  x: number;
  y: number;
  visible: boolean;
  content: ReactNode;
}

export function useChartTooltip(): {
  show: (x: number, y: number, content: ReactNode) => void;
  hide: () => void;
  tooltipProps: TooltipState;
} {
  const [tooltipProps, setTooltipProps] = useState<TooltipState>({
    x: 0,
    y: 0,
    visible: false,
    content: null,
  });

  const show = useCallback((x: number, y: number, content: ReactNode) => {
    const tooltipWidth = 200;
    const tooltipHeight = 80;
    const padding = 12;

    let clampedX = x;
    let clampedY = y;

    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;
      if (clampedX + tooltipWidth + padding > innerWidth) {
        clampedX = x - tooltipWidth - padding;
      }
      if (clampedY + tooltipHeight + padding > innerHeight) {
        clampedY = y - tooltipHeight - padding;
      }
      if (clampedX < padding) clampedX = padding;
      if (clampedY < padding) clampedY = padding;
    }

    setTooltipProps({ x: clampedX, y: clampedY, visible: true, content });
  }, []);

  const hide = useCallback(() => {
    setTooltipProps((prev) => ({ ...prev, visible: false }));
  }, []);

  return { show, hide, tooltipProps };
}
