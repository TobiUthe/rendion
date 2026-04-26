"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import {
  responsiveMargin,
  responsiveFontSize,
  prefersReducedMotion,
  formatChartValue,
} from "@/lib/chart-utils";
import { PALETTES, OPACITY, DASH } from "@/lib/design-tokens";
import { useThemeTokens } from "@/lib/hooks/useThemeTokens";
import { ANIMATION } from "@/lib/animation-config";
import { ChartLegend, type LegendSeries } from "@/components/charts/ChartLegend";
import { useFocusLegend } from "@/components/charts/useLegendState";

export interface WaterfallItem {
  label: string;
  value: number;
  isTotal?: boolean;
  description?: string;
}

interface WaterfallProps {
  items: WaterfallItem[];
  title?: string;
  subtitle?: string;
  footnote?: string;
  formatValue?: (n: number) => string;
}

export interface BarData {
  label: string;
  value: number;
  isTotal: boolean;
  base: number;
  top: number;
  color: string;
  description?: string;
}

interface TooltipState {
  x: number;
  y: number;
  bar: BarData;
  visible: boolean;
}

// Palette-locked series colors (same in light and dark — chosen for contrast on both surfaces)
const DS_COLORS = {
  positive: PALETTES.forest[600],
  negative: PALETTES.terra[600],
  total: PALETTES.steel[500],
} as const;

// Legend series for the three categories
const LEGEND_SERIES: LegendSeries[] = [
  { key: "positive", label: "Zufluss", color: DS_COLORS.positive },
  { key: "negative", label: "Abfluss", color: DS_COLORS.negative },
  { key: "total", label: "Endstand", color: DS_COLORS.total },
];

export function WaterfallChart({
  items,
  title,
  subtitle,
  footnote,
  formatValue = formatChartValue,
}: WaterfallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [revealed, setRevealed] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const tokens = useThemeTokens();
  const { activeKey, onToggle } = useFocusLegend();

  const bars = useMemo<BarData[]>(() => {
    let running = 0;
    return items.map((item) => {
      if (item.isTotal) {
        return {
          label: item.label,
          value: item.value,
          isTotal: true,
          base: Math.min(0, item.value),
          top: Math.max(0, item.value),
          color: DS_COLORS.total,
          description: item.description,
        };
      }
      const start = running;
      // eslint-disable-next-line react-hooks/immutability
      running += item.value;
      return {
        label: item.label,
        value: item.value,
        isTotal: false,
        base: Math.min(start, running),
        top: Math.max(start, running),
        color: item.value >= 0 ? DS_COLORS.positive : DS_COLORS.negative,
        description: item.description,
      };
    });
  }, [items]);

  // Derive the active category key from activeKey (focus is per-category, not per-bar)
  const activeCategoryKey = useMemo(() => {
    if (activeKey === null) return null;
    return activeKey as "positive" | "negative" | "total" | null;
  }, [activeKey]);

  const hideTooltip = () => setTooltip(null);

  const handleBarToggle = (barLabel: string) => {
    const bar = bars.find((b) => b.label === barLabel);
    if (!bar) return;
    const categoryKey = bar.isTotal ? "total" : bar.value >= 0 ? "positive" : "negative";
    onToggle(categoryKey);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;
    const margin = { ...responsiveMargin(width), top: 28, bottom: 8, left: 8, right: 8 };
    const fontSize = responsiveFontSize(width);
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const iconR = width < 400 ? 8 : 10;

    const root = d3.select(svg);
    root.selectAll("*").remove();
    root.attr("width", width).attr("height", height);

    const g = root.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand<number>()
      .domain(bars.map((_, i) => i))
      .range([0, innerW])
      .padding(0.35);

    const allValues = bars.flatMap((b) => [b.base, b.top]);
    const yMin = Math.min(0, ...allValues);
    const yMax = Math.max(0, ...allValues);
    const yPad = (yMax - yMin) * 0.18;

    const y = d3.scaleLinear().domain([yMin - yPad, yMax + yPad]).range([innerH, 0]);
    const zeroY = y(0);

    // Zero baseline
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", zeroY)
      .attr("y2", zeroY)
      .attr("stroke", tokens.grid)
      .attr("stroke-width", 1)
      .attr("opacity", OPACITY.chartMuted);

    // Connector lines between bars
    bars.forEach((bar, i) => {
      if (i >= bars.length - 1) return;
      const nextBar = bars[i + 1];
      if (!nextBar) return;
      const connectY = bar.value >= 0 ? bar.top : bar.base;
      const line = g
        .append("line")
        .attr("x1", (x(i) ?? 0) + x.bandwidth())
        .attr("x2", x(i + 1) ?? 0)
        .attr("y1", y(connectY))
        .attr("y2", y(nextBar.isTotal ? (nextBar.value >= 0 ? nextBar.top : nextBar.base) : connectY))
        .attr("stroke", tokens.grid)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", DASH.connector)
        .attr("opacity", OPACITY.chartMuted);

      if (!revealed) {
        line.attr("opacity", 0);
      } else if (!reducedMotion && activeCategoryKey === null) {
        line
          .attr("opacity", 0)
          .transition()
          .delay(i * ANIMATION.staggerDelay + ANIMATION.duration * 0.4)
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("opacity", OPACITY.chartMuted);
      }
    });

    // Bars
    bars.forEach((bar, i) => {
      const barCategoryKey = bar.isTotal ? "total" : bar.value >= 0 ? "positive" : "negative";
      const barX = x(i) ?? 0;
      const barTop = y(bar.top);
      const barBottom = y(bar.base);
      const barH = Math.max(barBottom - barTop, 1);
      const barCx = barX + x.bandwidth() / 2;
      const isActive = activeCategoryKey === barCategoryKey;
      const isDimmed = activeCategoryKey !== null && !isActive;
      const barOpacity = isDimmed
        ? OPACITY.chartInactive
        : bar.isTotal
          ? OPACITY.chartActive
          : OPACITY.chartNormal;

      const labelPad = 18;
      const hitTop = Math.min(barTop - labelPad, zeroY - iconR - 2);
      const hitBottom = bar.value >= 0 ? barBottom : barBottom + labelPad;

      g.append("rect")
        .attr("x", barX)
        .attr("y", hitTop)
        .attr("width", x.bandwidth())
        .attr("height", hitBottom - hitTop)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseenter", (event: MouseEvent) => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            setTooltip({
              x: event.clientX - containerRect.left,
              y: event.clientY - containerRect.top,
              bar,
              visible: true,
            });
          }
        })
        .on("mousemove", (event: MouseEvent) => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            setTooltip((prev) =>
              prev
                ? { ...prev, x: event.clientX - containerRect.left, y: event.clientY - containerRect.top }
                : null,
            );
          }
        })
        .on("mouseleave", () => setTooltip(null))
        .on("click", () => handleBarToggle(bar.label));

      const rect = g
        .append("rect")
        .attr("x", barX)
        .attr("width", x.bandwidth())
        .attr("rx", 2)
        .attr("fill", bar.color)
        .attr("fill-opacity", barOpacity)
        .attr("pointer-events", "none");

      if (isActive) {
        g.append("rect")
          .attr("x", barX - 2)
          .attr("width", x.bandwidth() + 4)
          .attr("y", barTop - 2)
          .attr("height", barH + 4)
          .attr("rx", 4)
          .attr("fill", "none")
          .attr("stroke", bar.color)
          .attr("stroke-width", 2)
          .attr("stroke-opacity", OPACITY.chartMuted)
          .attr("pointer-events", "none");
      }

      if (!revealed) {
        rect.attr("y", y(0)).attr("height", 0);
      } else if (reducedMotion || activeCategoryKey !== null) {
        rect.attr("y", barTop).attr("height", barH);
      } else {
        rect
          .attr("y", y(0))
          .attr("height", 0)
          .transition()
          .delay(i * ANIMATION.staggerDelay)
          .duration(ANIMATION.duration)
          .ease(d3.easeCubicOut)
          .attr("y", barTop)
          .attr("height", barH);
      }

      const labelY = bar.value >= 0 ? barTop - 6 : barBottom + 14;
      const label = g
        .append("text")
        .attr("x", barCx)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("fill", bar.color)
        .attr("fill-opacity", isDimmed ? OPACITY.chartInactive + 0.05 : OPACITY.chartActive)
        .attr("font-size", fontSize)
        .attr("font-weight", 600)
        .attr("font-variant-numeric", "tabular-nums")
        .attr("pointer-events", "none")
        .text((bar.value >= 0 ? "+" : "") + formatValue(bar.value));

      if (!revealed) {
        label.attr("opacity", 0);
      } else if (!reducedMotion && activeCategoryKey === null) {
        label
          .attr("opacity", 0)
          .transition()
          .delay(i * ANIMATION.staggerDelay + 300)
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("opacity", isDimmed ? OPACITY.chartInactive + 0.05 : OPACITY.chartActive);
      }
    });

    // Icon layer — circles at zero line with initials
    const iconLayer = g.append("g").attr("class", "icon-layer");
    bars.forEach((bar, i) => {
      const barCategoryKey = bar.isTotal ? "total" : bar.value >= 0 ? "positive" : "negative";
      const barCx = (x(i) ?? 0) + x.bandwidth() / 2;
      const isDimmed = activeCategoryKey !== null && activeCategoryKey !== barCategoryKey;
      const iconGroup = iconLayer
        .append("g")
        .attr("transform", `translate(${barCx},${zeroY})`)
        .attr("pointer-events", "none");

      // Halo uses theme surface so it reads correctly in dark mode
      iconGroup.append("circle").attr("r", iconR + 1.5).attr("fill", tokens.surface);
      iconGroup
        .append("circle")
        .attr("r", iconR)
        .attr("fill", bar.color)
        .attr("fill-opacity", isDimmed ? 0.08 : 0.15);
      iconGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", bar.color)
        .attr("fill-opacity", isDimmed ? OPACITY.chartInactive : OPACITY.chartActive)
        .attr("font-size", iconR * 1.1)
        .attr("font-weight", 700)
        .text(bar.label.charAt(0).toUpperCase());

      if (!revealed) {
        iconGroup.attr("opacity", 0);
      } else if (!reducedMotion && activeCategoryKey === null) {
        iconGroup
          .attr("opacity", 0)
          .transition()
          .delay(i * ANIMATION.staggerDelay + 400)
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("opacity", 1);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, bars, formatValue, revealed, reducedMotion, activeCategoryKey, tokens]);

  const tooltipStyle = useMemo(() => {
    if (!tooltip) return undefined;
    const containerW = dimensions.width;
    const tooltipW = 240;
    const flipX = tooltip.x + tooltipW + 16 > containerW;
    return {
      left: flipX ? tooltip.x - tooltipW - 8 : tooltip.x + 12,
      top: tooltip.y - 10,
      transform: "translateY(-100%)",
    };
  }, [tooltip, dimensions.width]);

  // Compose a meaningful aria-label summarizing the chart's key takeaway
  const totalBar = bars.find((b) => b.isTotal);
  const ariaLabel = useMemo(() => {
    if (title) {
      if (totalBar) {
        const sign = totalBar.value >= 0 ? "+" : "";
        return `${title}: Monatlicher Cashflow ${sign}${formatChartValue(totalBar.value)}`;
      }
      return title;
    }
    return "Cashflow-Aufschlüsselung";
  }, [title, totalBar]);

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <h3 className="font-display text-base font-semibold text-[var(--color-foreground)]">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        className="relative h-64 w-full sm:h-72 md:h-80"
        onMouseLeave={hideTooltip}
      >
        <svg
          ref={svgRef}
          className="h-full w-full"
          role="img"
          aria-label={ariaLabel}
        />

        {tooltip?.visible && (
          <div
            className="pointer-events-none absolute z-50 w-[200px] sm:w-60 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3 py-2 sm:px-4 sm:py-3 shadow-md backdrop-blur-sm"
            style={tooltipStyle}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs-plus font-semibold text-[var(--color-foreground)]">{tooltip.bar.label}</p>
              {tooltip.bar.isTotal && (
                <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700">
                  Gesamt
                </span>
              )}
            </div>
            <p
              className="mt-1 text-sm-plus font-semibold tabular-nums"
              style={{ color: tooltip.bar.color }}
            >
              {tooltip.bar.value >= 0 ? "+" : ""}
              {formatValue(tooltip.bar.value)}
            </p>
            {tooltip.bar.description && (
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {tooltip.bar.description}
              </p>
            )}
          </div>
        )}
      </div>

      {footnote && (
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">{footnote}</p>
      )}

      <ChartLegend
        mode="focus"
        series={LEGEND_SERIES}
        activeKey={activeCategoryKey}
        onToggle={onToggle}
        className="mt-3"
        ariaLabel="Wasserfalldiagramm-Legende — Kategorie hervorheben"
      />
    </div>
  );
}
