"use client";

import { useId } from "react";
import * as d3 from "d3";
import { useD3 } from "@/hooks/useD3";
import { useChartTooltip } from "@/hooks/useChartTooltip";
import { ChartContainerWithDimensions } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import {
  CHART_COLORS,
  formatChartTick,
  formatChartValue,
  prefersReducedMotion,
  responsiveMargin,
  responsiveTickCount,
  responsiveFontSize,
} from "@/lib/chart-utils";
import { OPACITY, DASH } from "@/lib/design-tokens";
import { useThemeTokens } from "@/lib/hooks/useThemeTokens";
import { ANIMATION } from "@/lib/animation-config";
import type { TilgungsplanRow } from "@/lib/schemas/calculator-output";
import { ChartLegend, type LegendSeries } from "@/components/charts/ChartLegend";
import { useToggleLegend } from "@/components/charts/useLegendState";

interface D3TilgungsplanChartProps {
  tilgungsplan: TilgungsplanRow[];
}

const SERIES = [
  { key: "zinsanteil" as const, label: "Zinsanteil", color: CHART_COLORS.warning },
  { key: "tilgungsanteil" as const, label: "Tilgungsanteil", color: CHART_COLORS.primary },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

const LEGEND_SERIES: LegendSeries[] = SERIES.map((s) => ({
  key: s.key,
  label: s.label,
  color: s.color,
}));

export function TilgungsplanChart({ tilgungsplan }: D3TilgungsplanChartProps) {
  const { tooltipProps, show, hide } = useChartTooltip();
  const uid = useId().replace(/:/g, "");
  const legend = useToggleLegend();
  const typedHiddenKeys = legend.hiddenKeys as Set<SeriesKey>;
  const tokens = useThemeTokens();

  return (
    <div className="relative">
      <ChartContainerWithDimensions>
        {(width, height) => (
          <D3TilgungsplanSVG
            data={tilgungsplan}
            width={width}
            height={height}
            uid={uid}
            hiddenKeys={typedHiddenKeys}
            tokens={tokens}
            onHover={(evt, row) => {
              const visibleSeries = SERIES.filter((s) => !typedHiddenKeys.has(s.key));
              show(
                evt.clientX,
                evt.clientY,
                <div>
                  <div className="mb-1 font-medium text-[var(--color-foreground)]">
                    Jahr {row.jahr}
                  </div>
                  {visibleSeries.some((s) => s.key === "zinsanteil") && (
                    <div style={{ color: CHART_COLORS.warning }}>
                      Zinsanteil: {formatChartValue(row.zinsanteil)}
                    </div>
                  )}
                  {visibleSeries.some((s) => s.key === "tilgungsanteil") && (
                    <div style={{ color: CHART_COLORS.primary }}>
                      Tilgungsanteil: {formatChartValue(row.tilgungsanteil)}
                    </div>
                  )}
                  {row.sondertilgung > 0 && (
                    <div style={{ color: CHART_COLORS.positive }}>
                      Sondertilgung: {formatChartValue(row.sondertilgung)}
                    </div>
                  )}
                  <div style={{ color: tokens.textSecondary }}>
                    Restschuld: {formatChartValue(row.restschuld)}
                  </div>
                </div>,
              );
            }}
            onLeave={hide}
          />
        )}
      </ChartContainerWithDimensions>
      <ChartTooltip tooltipProps={tooltipProps} />
      <ChartLegend
        mode="toggle"
        series={LEGEND_SERIES}
        hiddenKeys={legend.hiddenKeys as Set<string>}
        onToggle={legend.onToggle}
        className="mt-3"
        ariaLabel="Tilgungsplan-Legende — Datenreihe ein-/ausblenden"
      />
    </div>
  );
}

interface SVGProps {
  data: TilgungsplanRow[];
  width: number;
  height: number;
  uid: string;
  hiddenKeys: Set<SeriesKey>;
  tokens: ReturnType<typeof useThemeTokens>;
  onHover: (evt: MouseEvent, row: TilgungsplanRow) => void;
  onLeave: () => void;
}

function D3TilgungsplanSVG({ data, width, height, uid, hiddenKeys, tokens, onHover, onLeave }: SVGProps) {
  const margin = responsiveMargin(width);
  const fontSize = responsiveFontSize(width);

  const svgRef = useD3(
    (svg) => {
      svg.selectAll("*").remove();
      const w = width - margin.left - margin.right;
      const h = height - margin.top - margin.bottom;
      if (w <= 0 || h <= 0) return;

      const g = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const visibleSeries = SERIES.filter((s) => !hiddenKeys.has(s.key));
      const visibleKeys = visibleSeries.map((s) => s.key);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => String(d.jahr)))
        .range([0, w])
        .padding(0.2);

      const maxY =
        d3.max(data, (d) => {
          return visibleKeys.reduce((sum, k) => sum + (d[k as SeriesKey] ?? 0), 0);
        }) ?? 0;
      const y = d3.scaleLinear().domain([0, maxY * 1.1]).nice().range([h, 0]);

      // Grid lines using theme tokens and DASH pattern
      g.append("g")
        .call(d3.axisLeft(y).tickSize(-w).tickFormat(() => ""))
        .call((sel) =>
          sel
            .selectAll("line")
            .attr("stroke", tokens.grid)
            .attr("stroke-dasharray", DASH.grid)
            .attr("stroke-opacity", OPACITY.chartMuted),
        )
        .call((sel) => sel.select(".domain").remove());

      const reduced = prefersReducedMotion();

      if (visibleKeys.length > 0) {
        const stack = d3
          .stack<TilgungsplanRow>()
          .keys(visibleKeys)
          .order(d3.stackOrderNone)
          .offset(d3.stackOffsetNone);

        const stacked = stack(data);

        stacked.forEach((layer, i) => {
          const seriesInfo = visibleSeries[i];
          if (!seriesInfo) return;
          g.selectAll(`.bar-${seriesInfo.key}-${uid}`)
            .data(layer)
            .join("rect")
            .attr("class", `bar-${seriesInfo.key}-${uid}`)
            .attr("x", (d) => x(String(d.data.jahr)) ?? 0)
            .attr("width", x.bandwidth())
            .attr("rx", 2)
            .attr("fill", seriesInfo.color)
            .attr("fill-opacity", OPACITY.chartNormal)
            .attr("y", reduced ? (d) => y(d[1]) : y(0))
            .attr("height", reduced ? (d) => y(d[0]) - y(d[1]) : 0)
            .call((sel) => {
              if (!reduced) {
                sel
                  .transition()
                  .duration(ANIMATION.duration)
                  .ease(d3.easeCubicOut)
                  .delay((_, idx) => idx * ANIMATION.staggerDelay)
                  .attr("y", (d) => y(d[1]))
                  .attr("height", (d) => y(d[0]) - y(d[1]));
              }
            });
        });
      }

      const tickValues = data.filter((_, i) => i % 5 === 0).map((d) => String(d.jahr));
      g.append("g")
        .attr("transform", `translate(0,${h})`)
        .call(d3.axisBottom(x).tickValues(tickValues))
        .call((sel) => sel.select(".domain").remove())
        .call((sel) =>
          sel.selectAll("text").attr("fill", tokens.axis).style("font-size", `${fontSize}px`),
        )
        .call((sel) => sel.selectAll(".tick line").remove());

      g.append("g")
        .call(
          d3
            .axisLeft(y)
            .ticks(responsiveTickCount(width, 120))
            .tickFormat((d) => formatChartTick(d as number)),
        )
        .call((sel) => sel.select(".domain").remove())
        .call((sel) =>
          sel.selectAll("text").attr("fill", tokens.axis).style("font-size", `${fontSize}px`),
        )
        .call((sel) => sel.selectAll(".tick line").remove());

      g.append("rect")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "transparent")
        .style("cursor", "crosshair")
        .on("mousemove", (event: MouseEvent) => {
          const [mx] = d3.pointer(event);
          const bandWidth = x.step();
          const idx = Math.min(Math.floor(mx / bandWidth), data.length - 1);
          const row = data[Math.max(0, idx)];
          if (row) onHover(event, row);
        })
        .on("mouseleave", () => onLeave());
    },
    // tokens added to dependency array so SVG re-renders on theme change
    [data, width, height, uid, hiddenKeys, tokens],
  );

  // Compose a meaningful aria-label
  const lastRow = data[data.length - 1];
  const ariaLabel = lastRow
    ? `Tilgungsverlauf über ${lastRow.jahr} Jahre — Restschuld am Ende: ${formatChartValue(lastRow.restschuld)}`
    : "Diagramm: Tilgungsverlauf";

  return <svg ref={svgRef} role="img" aria-label={ariaLabel} />;
}
