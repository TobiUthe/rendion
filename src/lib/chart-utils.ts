import * as d3 from "d3";
import "d3-transition";

export { CHART_COLORS, DONUT_COLORS, formatAxisK, CHART_MARGIN } from "./chart-config";

import { CHART_COLORS } from "./chart-config";

export const DEFAULT_MARGIN = { top: 20, right: 20, bottom: 40, left: 60 };

const germanLocale: d3.FormatLocaleDefinition = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\u00a0\u20ac"] as [string, string],
};

const locale = d3.formatLocale(germanLocale);

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return locale.format(",.1f")(value / 1_000_000) + " Mio. €";
  }
  return locale.format(",.0f")(value) + " €";
}

export function formatPercent(value: number): string {
  return locale.format(",.1f")(value) + " %";
}

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

export function responsiveTickCount(width: number, minSpacing = 80): number {
  return Math.max(3, Math.floor(width / minSpacing));
}

export function responsiveFontSize(width: number): number {
  return width < 400 ? 11 : 12;
}

export function responsiveMargin(width: number) {
  if (width < 400) return { top: 16, right: 12, bottom: 32, left: 48 };
  return DEFAULT_MARGIN;
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
