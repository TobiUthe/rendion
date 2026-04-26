"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import {
  formatChartTick,
  formatChartValue,
  responsiveMargin,
  responsiveFontSize,
} from "@/lib/chart-utils";
import { PALETTES, OPACITY, DASH } from "@/lib/design-tokens";
import { useThemeTokens } from "@/lib/hooks/useThemeTokens";
import type { ProjectionRow } from "@/lib/schemas/calculator-output";
import { ChartLegend, type LegendSeries } from "@/components/charts/ChartLegend";
import { useToggleLegend } from "@/components/charts/useLegendState";

interface D3WealthAccumulationChartProps {
  projection: ProjectionRow[];
  eigenkapital: number;
  kaufnebenkosten?: number;
}

interface WealthDataPoint {
  jahr: number;
  eigenkapital: number;
  tilgungDelta: number;
  wertzuwachsDelta: number;
  cashflowDelta: number;
  cumulativeNet: number;
}

interface TooltipState {
  x: number;
  y: number;
  row: WealthDataPoint;
  visible: boolean;
}

const SERIES_KEYS = ["eigenkapital", "tilgungDelta", "wertzuwachsDelta", "cashflowDelta"] as const;
type SeriesKey = (typeof SERIES_KEYS)[number];

const NET_LINE_KEY = "cumulativeNet";
const NET_LINE_COLOR = PALETTES.gold[500];

const SERIES_META: Record<SeriesKey, { color: string; label: string }> = {
  eigenkapital: { color: PALETTES.stone[400], label: "Eigenkapital" },
  tilgungDelta: { color: PALETTES.blush[600], label: "Tilgung" },
  wertzuwachsDelta: { color: PALETTES.forest[500], label: "Wertzuwachs" },
  cashflowDelta: { color: PALETTES.steel[500], label: "Cashflow" },
};

// All series + the net line entry for the legend
const ALL_LEGEND_SERIES: LegendSeries[] = [
  ...SERIES_KEYS.map((k) => ({ key: k, label: SERIES_META[k].label, color: SERIES_META[k].color })),
  { key: NET_LINE_KEY, label: "Kumulierter Nettowert", color: NET_LINE_COLOR },
];

export function WealthAccumulationChart({
  projection,
  eigenkapital,
  kaufnebenkosten = 0,
}: D3WealthAccumulationChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const tokens = useThemeTokens();
  const legend = useToggleLegend();

  const hideTooltip = useCallback(() => setTooltip(null), []);

  const netEigenkapital = eigenkapital - kaufnebenkosten;

  const data = useMemo<WealthDataPoint[]>(() => {
    const points: WealthDataPoint[] = [
      {
        jahr: 0,
        eigenkapital: netEigenkapital,
        tilgungDelta: 0,
        wertzuwachsDelta: 0,
        cashflowDelta: 0,
        cumulativeNet: netEigenkapital,
      },
    ];
    let prevTilgung = 0;
    let prevWertzuwachs = 0;
    let prevCashflow = 0;
    for (const row of projection) {
      points.push({
        jahr: row.jahr,
        eigenkapital: 0,
        tilgungDelta: row.getilgterBetrag - prevTilgung,
        wertzuwachsDelta: row.wertzuwachs - prevWertzuwachs,
        cashflowDelta: row.kumulierterCashflow - prevCashflow,
        cumulativeNet:
          netEigenkapital + row.getilgterBetrag + row.wertzuwachs + row.kumulierterCashflow,
      });
      prevTilgung = row.getilgterBetrag;
      prevWertzuwachs = row.wertzuwachs;
      prevCashflow = row.kumulierterCashflow;
    }
    return points;
  }, [projection, netEigenkapital]);

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
    const svg = svgRef.current;
    // Bail out if dimensions haven't been measured yet
    if (!svg || dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;
    const baseMargin = responsiveMargin(width);
    const margin = {
      ...baseMargin,
      top: 16,
      bottom: 32,
      right: Math.max(baseMargin.right, baseMargin.left),
    };
    const fontSize = responsiveFontSize(width);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const root = d3.select(svg);
    root.selectAll("*").remove();
    root.attr("width", width).attr("height", height);

    const g = root.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand<number>().domain(data.map((d) => d.jahr)).range([0, w]).padding(0.25);

    // Filter visible stack keys
    const visibleKeys = SERIES_KEYS.filter((k) => !legend.hiddenKeys.has(k));
    const showNetLine = !legend.hiddenKeys.has(NET_LINE_KEY);

    let stacked: d3.Series<WealthDataPoint, string>[] = [];

    if (visibleKeys.length > 0) {
      const stack = d3
        .stack<WealthDataPoint>()
        .keys(visibleKeys as unknown as string[])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetDiverging);
      stacked = stack(data);
    }

    const minDelta = stacked.length > 0 ? (d3.min(stacked, (layer) => d3.min(layer, (d) => d[0])) ?? 0) : 0;
    const maxDelta = stacked.length > 0 ? (d3.max(stacked, (layer) => d3.max(layer, (d) => d[1])) ?? 0) : 0;
    const leftPad = (maxDelta - minDelta) * 0.05;
    const yLeft = d3
      .scaleLinear()
      .domain([Math.min(0, minDelta - leftPad), maxDelta + leftPad])
      .nice()
      .range([h, 0]);

    const cumMax = d3.max(data, (d) => d.cumulativeNet) ?? 0;
    const cumMin = Math.min(0, d3.min(data, (d) => d.cumulativeNet) ?? 0);
    const yRight = d3.scaleLinear().domain([cumMin, cumMax * 1.05]).nice().range([h, 0]);

    const barsGroup = g.append("g").attr("class", "bars");
    const rr = Math.min(3, x.bandwidth() / 4);
    const segGap = 1.5;

    for (let li = 0; li < stacked.length; li++) {
      const layer = stacked[li];
      const key = layer.key as SeriesKey;
      const color = SERIES_META[key].color;

      barsGroup
        .selectAll(`.bar-${key}`)
        .data(layer)
        .join("rect")
        .attr("class", `bar-${key}`)
        .each(function (d) {
          const raw = Math.abs(yLeft(d[0]) - yLeft(d[1]));
          if (raw < 1) {
            d3.select(this)
              .attr("x", x(d.data.jahr) ?? 0)
              .attr("y", yLeft(d[1]))
              .attr("width", x.bandwidth())
              .attr("height", raw)
              .attr("rx", 0)
              .attr("fill", color)
              .attr("fill-opacity", OPACITY.chartNormal);
            return;
          }

          const dataIdx = data.indexOf(d.data);
          let isTop = true;
          for (let j = li + 1; j < stacked.length; j++) {
            if (Math.abs(stacked[j][dataIdx][1] - stacked[j][dataIdx][0]) > 0.01) {
              isTop = false;
              break;
            }
          }
          let hasBelow = false;
          for (let j = 0; j < li; j++) {
            if (Math.abs(stacked[j][dataIdx][1] - stacked[j][dataIdx][0]) > 0.01) {
              hasBelow = true;
              break;
            }
          }

          const topInset = isTop ? 0 : segGap / 2;
          const bottomInset = hasBelow ? segGap / 2 : 0;
          const adjH = Math.max(0, raw - topInset - bottomInset);
          const adjY = yLeft(d[1]) + topInset;

          d3.select(this)
            .attr("x", x(d.data.jahr) ?? 0)
            .attr("y", adjY)
            .attr("width", x.bandwidth())
            .attr("height", adjH)
            .attr("rx", isTop ? rr : 0)
            .attr("fill", color)
            .attr("fill-opacity", OPACITY.chartNormal);
        });
    }

    // X axis
    const xAxisG = g
      .append("g")
      .attr("transform", `translate(0,${h})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(data.filter((d) => d.jahr % 5 === 0).map((d) => d.jahr))
          .tickFormat((d) => String(d)),
      );
    xAxisG.select(".domain").attr("stroke", tokens.axis).attr("stroke-opacity", 0.3);
    xAxisG.selectAll("text").attr("fill", tokens.axis).style("font-size", `${fontSize}px`);
    xAxisG.selectAll(".tick line").remove();

    // Left axis — uses formatChartTick for German compact notation
    const leftAxisG = g.append("g").call(
      d3.axisLeft(yLeft).ticks(5).tickFormat((d) => formatChartTick(d as number)),
    );
    leftAxisG.select(".domain").attr("stroke", tokens.axis).attr("stroke-opacity", 0.3);
    leftAxisG.selectAll("text").attr("fill", tokens.axis).style("font-size", `${fontSize}px`);
    leftAxisG.selectAll(".tick line").attr("stroke", tokens.axis).attr("stroke-opacity", 0.2);

    // Right axis (net line scale)
    const rightAxisG = g
      .append("g")
      .attr("transform", `translate(${w},0)`)
      .call(d3.axisRight(yRight).ticks(5).tickFormat((d) => formatChartTick(d as number)));
    rightAxisG.select(".domain").attr("stroke", NET_LINE_COLOR).attr("stroke-opacity", 0.4);
    rightAxisG.selectAll("text").attr("fill", NET_LINE_COLOR).style("font-size", `${fontSize}px`);
    rightAxisG.selectAll(".tick line").attr("stroke", NET_LINE_COLOR).attr("stroke-opacity", 0.3);

    const lineGen = d3
      .line<WealthDataPoint>()
      .x((d) => (x(d.jahr) ?? 0) + x.bandwidth() / 2)
      .y((d) => yRight(d.cumulativeNet))
      .curve(d3.curveMonotoneX);

    if (showNetLine) {
      // White "halo" replaced with theme surface — correct in dark mode
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", tokens.surface)
        .attr("stroke-width", 4)
        .attr("d", lineGen);
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", NET_LINE_COLOR)
        .attr("stroke-width", 2)
        .attr("d", lineGen);
    }

    // Zero line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", w)
      .attr("y1", yLeft(0))
      .attr("y2", yLeft(0))
      .attr("stroke", tokens.axis)
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", OPACITY.chartMuted);

    const lastRow = data[data.length - 1];
    const defaultNet = lastRow?.cumulativeNet ?? 0;

    const netIndicator = g.append("g").attr("class", "net-indicator");
    if (showNetLine) {
      netIndicator
        .append("line")
        .attr("class", "net-line")
        .attr("x1", 0)
        .attr("x2", w)
        .attr("y1", yRight(defaultNet))
        .attr("y2", yRight(defaultNet))
        .attr("stroke", NET_LINE_COLOR)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", DASH.connector)
        .attr("stroke-opacity", OPACITY.chartNormal - 0.15);
      netIndicator
        .append("text")
        .attr("class", "net-label")
        .attr("x", w + 6)
        .attr("y", yRight(defaultNet))
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("fill", NET_LINE_COLOR)
        .style("font-size", `${fontSize}px`)
        .style("font-weight", "700")
        .text(formatChartTick(defaultNet));
    }

    const barCenters = data.map((d) => (x(d.jahr) ?? 0) + x.bandwidth() / 2);
    let activeIdx = -1;

    const applyHighlight = (idx: number) => {
      if (idx === activeIdx) return;
      activeIdx = idx;
      if (idx < 0) {
        barsGroup.selectAll("rect").attr("fill-opacity", OPACITY.chartNormal);
        if (showNetLine) {
          netIndicator.select(".net-line").attr("y1", yRight(defaultNet)).attr("y2", yRight(defaultNet));
          netIndicator.select(".net-label").attr("y", yRight(defaultNet)).text(formatChartTick(defaultNet));
        }
        setTooltip(null);
        return;
      }
      const row = data[idx];
      if (!row) return;
      const net = row.cumulativeNet;

      barsGroup.selectAll("rect").attr("fill-opacity", OPACITY.chartInactive);
      for (const layer of stacked) {
        const key = layer.key as SeriesKey;
        barsGroup
          .selectAll<SVGRectElement, d3.SeriesPoint<WealthDataPoint>>(`.bar-${key}`)
          .filter((pt) => pt.data.jahr === row.jahr)
          .attr("fill-opacity", OPACITY.chartActive);
      }

      if (showNetLine) {
        const netY = yRight(net);
        netIndicator.select(".net-line").attr("y1", netY).attr("y2", netY);
        netIndicator.select(".net-label").attr("y", netY).text(formatChartTick(net));
      }

      const barX = barCenters[idx] + margin.left;
      const topLayerIdx = stacked.length - 1;
      const stackTop = topLayerIdx >= 0 ? stacked[topLayerIdx][idx] : null;
      const rawY = stackTop ? yLeft(stackTop[1]) + margin.top : margin.top + 10;
      const clampedY = Math.max(margin.top + 10, Math.min(rawY, height - margin.bottom - 10));
      setTooltip({ x: barX, y: clampedY, row, visible: true });
    };

    g.append("rect")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("mousemove", (event: MouseEvent) => {
        const [mx] = d3.pointer(event);
        let nearest = 0;
        let bestDist = Infinity;
        for (let i = 0; i < barCenters.length; i++) {
          const dist = Math.abs(mx - barCenters[i]);
          if (dist < bestDist) {
            bestDist = dist;
            nearest = i;
          }
        }
        applyHighlight(nearest);
      })
      .on("mouseleave", () => applyHighlight(-1));
  // tokens is included so the effect re-runs on theme change
  }, [dimensions, data, legend.hiddenKeys, tokens]);

  const tooltipStyle = useMemo(() => {
    if (!tooltip) return undefined;
    const containerW = dimensions.width;
    const containerH = dimensions.height;
    const tooltipW = 240;
    const tooltipH = 220;
    const flipX = tooltip.x + tooltipW + 16 > containerW;
    const left = flipX ? Math.max(4, tooltip.x - tooltipW - 8) : tooltip.x + 12;
    let top = tooltip.y - tooltipH - 10;
    if (top < 4) top = tooltip.y + 10;
    if (top + tooltipH > containerH - 4) top = containerH - tooltipH - 4;
    top = Math.max(4, top);
    return { left, top };
  }, [tooltip, dimensions.width, dimensions.height]);

  const tooltipNetTotal = tooltip ? tooltip.row.cumulativeNet : 0;
  const showNetLineInTooltip = !legend.hiddenKeys.has(NET_LINE_KEY);

  // Compose a meaningful aria-label from the data
  const ariaLabel = useMemo(() => {
    const lastRow = data[data.length - 1];
    if (lastRow) {
      return `Vermögensentwicklung über ${lastRow.jahr} Jahre — kumulierter Nettowert: ${formatChartValue(lastRow.cumulativeNet)}`;
    }
    return "Diagramm: Vermögensaufbau";
  }, [data]);

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="relative h-72 w-full md:h-96" onMouseLeave={hideTooltip}>
        <svg
          ref={svgRef}
          className="h-full w-full"
          role="img"
          aria-label={ariaLabel}
        />

        {tooltip?.visible && (
          <div
            className="pointer-events-none absolute z-50 w-[200px] sm:w-60 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 sm:px-4 sm:py-3 shadow-md"
            style={tooltipStyle}
          >
            <p className="text-xs-plus font-semibold text-[var(--color-foreground)]">
              {tooltip.row.jahr === 0 ? "Jahr 0 — Startkapital" : `Jahr ${tooltip.row.jahr} — Veränderung`}
            </p>

            <div className="mt-2 space-y-1">
              {SERIES_KEYS.filter((k) => !legend.hiddenKeys.has(k)).map((k) => {
                const val = tooltip.row[k];
                if (k === "eigenkapital" && val === 0) return null;
                return (
                  <div key={k} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: SERIES_META[k].color }}
                      />
                      {SERIES_META[k].label}
                    </span>
                    <span className="tabular-nums text-[var(--color-foreground)]">
                      {formatChartValue(val)}
                    </span>
                  </div>
                );
              })}
            </div>

            {showNetLineInTooltip && (
              <div className="mt-1.5 flex items-center justify-between border-t border-[var(--color-border)] pt-1.5 text-xs">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <span
                    className="inline-block h-[2px] w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: NET_LINE_COLOR }}
                  />
                  Kumulierter Nettowert
                </span>
                <span className="font-semibold tabular-nums text-[var(--color-foreground)]">
                  {formatChartValue(tooltipNetTotal)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <ChartLegend
        mode="toggle"
        series={ALL_LEGEND_SERIES}
        hiddenKeys={legend.hiddenKeys}
        onToggle={legend.onToggle}
        className="mt-3"
        ariaLabel="Vermögensaufbau-Legende — Datenreihe ein-/ausblenden"
      />
    </div>
  );
}
