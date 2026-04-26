import * as d3 from "d3";
import "d3-transition";

export { CHART_COLORS, DONUT_COLORS, formatAxisK, CHART_MARGIN } from "./chart-config";

import { CHART_COLORS } from "./chart-config";
import { formatCompact as fmtCompact, formatEuro } from "./format";

export const DEFAULT_MARGIN = { top: 20, right: 20, bottom: 40, left: 60 };

const germanLocale: d3.FormatLocaleDefinition = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", " €"] as [string, string],
};

const locale = d3.formatLocale(germanLocale);

/**
 * Format a value for axis tick labels using the unified German compact format.
 * e.g. 1500000 → "1,5 Mio." | 850000 → "850 Tsd." | 1234 → "1 Tsd."
 * Delegates to format.ts formatCompact for German abbreviation consistency.
 */
export function formatChartTick(value: number): string {
  return fmtCompact(value);
}

/**
 * Format a value for tooltip display as a full euro amount.
 * e.g. 250000 → "250.000 €"
 * Delegates to format.ts formatEuro.
 */
export function formatChartValue(value: number): string {
  return formatEuro(value);
}

/**
 * @deprecated Use formatChartValue for tooltip values or formatChartTick for axis ticks.
 * Kept for backward compatibility during migration.
 */
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return locale.format(",.1f")(value / 1_000_000) + " Mio. €";
  }
  return locale.format(",.0f")(value) + " €";
}

export function formatPercent(value: number): string {
  return locale.format(",.1f")(value) + " %";
}

/**
 * @deprecated Use formatChartTick for chart axis labels.
 */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return locale.format(",.1f")(value / 1_000_000) + "M";
  }
  if (abs >= 1_000) {
    return locale.format(",.0f")(value / 1_000) + "k";
  }
  return locale.format(",.0f")(value);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const MOBILE_WIDTH = 640;
export const MID_WIDTH = 900;

export function isMobileWidth(width: number): boolean {
  return width < MOBILE_WIDTH;
}

export function responsiveTickCount(width: number, minSpacing = 80): number {
  if (isMobileWidth(width)) return Math.max(3, Math.floor(width / 110));
  return Math.max(3, Math.floor(width / minSpacing));
}

export function responsiveFontSize(width: number): number {
  if (width < MOBILE_WIDTH) return 10;
  if (width < MID_WIDTH) return 11;
  return 12;
}

export function responsiveMargin(width: number) {
  if (width < MOBILE_WIDTH) return { top: 16, right: 8, bottom: 32, left: 48 };
  if (width < MID_WIDTH) return { top: 18, right: 16, bottom: 36, left: 56 };
  return DEFAULT_MARGIN;
}

export const CHART_TOOLTIP = {
  mobile: { minW: 140, maxW: 220 },
  desktop: { minW: 200, maxW: 280 },
} as const;

export function responsiveTooltipSize(width: number) {
  return isMobileWidth(width) ? CHART_TOOLTIP.mobile : CHART_TOOLTIP.desktop;
}

export function responsiveStroke(width: number, desktop = 2): number {
  return isMobileWidth(width) ? Math.max(1, desktop - 0.5) : desktop;
}

export function renderGridLines(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.ScaleLinear<number, number>,
  width: number,
): void {
  g.call(
    d3
      .axisLeft(scale)
      .ticks(5)
      .tickSize(-width)
      .tickFormat(() => ""),
  );
  g.select(".domain").remove();
  g.selectAll(".tick line")
    .attr("stroke", CHART_COLORS.grid)
    .attr("stroke-dasharray", "3,3")
    .attr("opacity", 0.7);
}
