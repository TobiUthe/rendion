"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import {
  responsiveMargin,
  responsiveFontSize,
  prefersReducedMotion,
  formatCurrency,
} from "@/lib/chart-utils";
import { PALETTES, CHART_CHROME } from "@/lib/design-tokens";
import { ANIMATION } from "@/lib/animation-config";

export interface WaterfallItem {
  label: string;
  value: number;
  isTotal?: boolean;
  description?: string;
}

interface WaterfallProps {
  items: WaterfallItem[];
  title?: string;
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

const DS = {
  positive: PALETTES.forest[600],
  negative: PALETTES.terra[600],
  total: PALETTES.steel[500],
  grid: CHART_CHROME.grid,
  connector: CHART_CHROME.grid,
} as const;

export function WaterfallChart({ items, title, formatValue = formatCurrency }: WaterfallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [revealed, setRevealed] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

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
          color: DS.total,
          description: item.description,
        };
      }
      const start = running;
      running += item.value;
      return {
        label: item.label,
        value: item.value,
        isTotal: false,
        base: Math.min(start, running),
        top: Math.max(start, running),
        color: item.value >= 0 ? DS.positive : DS.negative,
        description: item.description,
      };
    });
  }, [items]);

  const hideTooltip = useCallback(() => setTooltip(null), []);
  const toggleActive = useCallback((label: string) => {
    setActiveLabel((prev) => (prev === label ? null : label));
  }, []);

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
    if (!svg || dimensions.width === 0) return;

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

    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", zeroY)
      .attr("y2", zeroY)
      .attr("stroke", DS.grid)
      .attr("stroke-width", 1)
      .attr("opacity", 0.4);

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
        .attr("stroke", DS.connector)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "3 3")
        .attr("opacity", 0.6);

      if (!revealed) {
        line.attr("opacity", 0);
      } else if (!reducedMotion && activeLabel === null) {
        line
          .attr("opacity", 0)
          .transition()
          .delay(i * ANIMATION.staggerDelay + ANIMATION.duration * 0.4)
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("opacity", 0.6);
      }
    });

    bars.forEach((bar, i) => {
      const barX = x(i) ?? 0;
      const barTop = y(bar.top);
      const barBottom = y(bar.base);
      const barH = Math.max(barBottom - barTop, 1);
      const barCx = barX + x.bandwidth() / 2;
      const isActive = activeLabel === bar.label;
      const isDimmed = activeLabel !== null && !isActive;
      const barOpacity = isDimmed ? 0.25 : bar.isTotal ? 1 : 0.85;

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
        .on("click", () => toggleActive(bar.label));

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
          .attr("stroke-opacity", 0.5)
          .attr("pointer-events", "none");
      }

      if (!revealed) {
        rect.attr("y", y(0)).attr("height", 0);
      } else if (reducedMotion || activeLabel !== null) {
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
        .attr("fill-opacity", isDimmed ? 0.3 : 1)
        .attr("font-size", fontSize)
        .attr("font-weight", 600)
        .attr("font-variant-numeric", "tabular-nums")
        .attr("pointer-events", "none")
        .text((bar.value >= 0 ? "+" : "") + formatValue(bar.value));

      if (!revealed) {
        label.attr("opacity", 0);
      } else if (!reducedMotion && activeLabel === null) {
        label
          .attr("opacity", 0)
          .transition()
          .delay(i * ANIMATION.staggerDelay + 300)
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("opacity", isDimmed ? 0.3 : 1);
      }
    });

    const iconLayer = g.append("g").attr("class", "icon-layer");
    bars.forEach((bar, i) => {
      const barCx = (x(i) ?? 0) + x.bandwidth() / 2;
      const isDimmed = activeLabel !== null && activeLabel !== bar.label;
      const iconGroup = iconLayer
        .append("g")
        .attr("transform", `translate(${barCx},${zeroY})`)
        .attr("pointer-events", "none");
      iconGroup.append("circle").attr("r", iconR + 1.5).attr("fill", "white");
      iconGroup.append("circle").attr("r", iconR).attr("fill", bar.color).attr("fill-opacity", isDimmed ? 0.08 : 0.15);
      iconGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", bar.color)
        .attr("fill-opacity", isDimmed ? 0.3 : 1)
        .attr("font-size", iconR * 1.1)
        .attr("font-weight", 700)
        .text(bar.label.charAt(0).toUpperCase());

      if (!revealed) {
        iconGroup.attr("opacity", 0);
      } else if (!reducedMotion && activeLabel === null) {
        iconGroup
          .attr("opacity", 0)
          .transition()
          .delay(i * ANIMATION.staggerDelay + 400)
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("opacity", 1);
      }
    });
  }, [dimensions, bars, formatValue, revealed, reducedMotion, activeLabel, toggleActive]);

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

  const [legendRow1, legendRow2] = useMemo(() => {
    const mid = Math.ceil(bars.length / 2);
    return [bars.slice(0, mid), bars.slice(mid)];
  }, [bars]);

  return (
    <div className="w-full">
      {title && (
        <h3 className="font-display mb-3 text-base font-semibold text-neutral-800">{title}</h3>
      )}
      <div
        ref={containerRef}
        className="relative h-64 w-full sm:h-72 md:h-80"
        onMouseLeave={hideTooltip}
      >
        <svg ref={svgRef} className="h-full w-full" role="img" aria-label={title ?? "Wasserfall-Diagramm"} />

        {tooltip?.visible && (
          <div
            className="pointer-events-none absolute z-50 w-60 rounded-lg bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm"
            style={{ border: "1px solid rgba(190,201,199,0.25)", ...tooltipStyle }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs-plus font-semibold text-neutral-800">{tooltip.bar.label}</p>
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
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                {tooltip.bar.description}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-y-1.5">
        {[legendRow1, legendRow2].map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-x-4">
            {row.map((bar) => {
              const isActive = activeLabel === bar.label;
              const isDimmed = activeLabel !== null && !isActive;
              return (
                <button
                  key={bar.label}
                  type="button"
                  onClick={() => toggleActive(bar.label)}
                  className={`flex items-center gap-1.5 transition-opacity ${
                    isDimmed ? "opacity-30" : "opacity-100"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white ${
                      isActive ? "ring-2 ring-offset-1 ring-current" : ""
                    }`}
                    style={{ backgroundColor: bar.color, color: bar.color }}
                  >
                    <span className="text-white">{bar.label.charAt(0).toUpperCase()}</span>
                  </span>
                  <span className="text-2xs text-neutral-500 whitespace-nowrap">{bar.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
