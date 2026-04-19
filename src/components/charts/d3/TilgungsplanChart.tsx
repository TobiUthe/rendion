"use client";

import { useId } from "react";
import * as d3 from "d3";
import { useD3 } from "@/hooks/useD3";
import { useChartTooltip } from "@/hooks/useChartTooltip";
import { ChartContainerWithDimensions } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import {
  CHART_COLORS,
  formatAxisK,
  formatCurrency,
  prefersReducedMotion,
  responsiveMargin,
  responsiveTickCount,
  responsiveFontSize,
} from "@/lib/chart-utils";
import { ANIMATION } from "@/lib/animation-config";
import type { TilgungsplanRow } from "@/lib/schemas/calculator-output";

interface D3TilgungsplanChartProps {
  tilgungsplan: TilgungsplanRow[];
}

const SERIES = [
  { key: "zinsanteil" as const, label: "Zinsanteil", color: CHART_COLORS.warning },
  { key: "tilgungsanteil" as const, label: "Tilgungsanteil", color: CHART_COLORS.primary },
] as const;

export function TilgungsplanChart({ tilgungsplan }: D3TilgungsplanChartProps) {
  const { tooltipProps, show, hide } = useChartTooltip();
  const uid = useId().replace(/:/g, "");

  return (
    <div className="relative">
      <ChartContainerWithDimensions>
        {(width, height) => (
          <D3TilgungsplanSVG
            data={tilgungsplan}
            width={width}
            height={height}
            uid={uid}
            onHover={(evt, row) => {
              show(
                evt.clientX,
                evt.clientY,
                <div>
                  <div className="mb-1 font-medium">Jahr {row.jahr}</div>
                  <div style={{ color: CHART_COLORS.warning }}>
                    Zinsanteil: {formatCurrency(row.zinsanteil)}
                  </div>
                  <div style={{ color: CHART_COLORS.primary }}>
                    Tilgungsanteil: {formatCurrency(row.tilgungsanteil)}
                  </div>
                  {row.sondertilgung > 0 && (
                    <div style={{ color: CHART_COLORS.positive }}>
                      Sondertilgung: {formatCurrency(row.sondertilgung)}
                    </div>
                  )}
                  <div style={{ color: CHART_COLORS.muted }}>
                    Restschuld: {formatCurrency(row.restschuld)}
                  </div>
                </div>,
              );
            }}
            onLeave={hide}
          />
        )}
      </ChartContainerWithDimensions>
      <ChartTooltip tooltipProps={tooltipProps} />
    </div>
  );
}

interface SVGProps {
  data: TilgungsplanRow[];
  width: number;
  height: number;
  uid: string;
  onHover: (evt: MouseEvent, row: TilgungsplanRow) => void;
  onLeave: () => void;
}

function D3TilgungsplanSVG({ data, width, height, uid, onHover, onLeave }: SVGProps) {
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

      const x = d3
        .scaleBand()
        .domain(data.map((d) => String(d.jahr)))
        .range([0, w])
        .padding(0.2);

      const maxY = d3.max(data, (d) => d.zinsanteil + d.tilgungsanteil) ?? 0;
      const y = d3.scaleLinear().domain([0, maxY * 1.1]).nice().range([h, 0]);

      g.append("g")
        .call(d3.axisLeft(y).tickSize(-w).tickFormat(() => ""))
        .call((sel) => sel.selectAll("line").attr("stroke", CHART_COLORS.grid).attr("stroke-opacity", 0.5))
        .call((sel) => sel.select(".domain").remove());

      const reduced = prefersReducedMotion();

      const stack = d3
        .stack<TilgungsplanRow>()
        .keys(SERIES.map((s) => s.key))
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

      const stacked = stack(data);

      stacked.forEach((layer, i) => {
        g.selectAll(`.bar-${SERIES[i].key}`)
          .data(layer)
          .join("rect")
          .attr("class", `bar-${SERIES[i].key}`)
          .attr("x", (d) => x(String(d.data.jahr)) ?? 0)
          .attr("width", x.bandwidth())
          .attr("rx", 1)
          .attr("fill", SERIES[i].color)
          .attr("fill-opacity", 0.8)
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

      const tickValues = data.filter((_, i) => i % 5 === 0).map((d) => String(d.jahr));
      g.append("g")
        .attr("transform", `translate(0,${h})`)
        .call(d3.axisBottom(x).tickValues(tickValues))
        .call((sel) => sel.select(".domain").remove())
        .call((sel) => sel.selectAll("text").attr("fill", CHART_COLORS.axis).style("font-size", `${fontSize}px`))
        .call((sel) => sel.selectAll(".tick line").remove());

      g.append("g")
        .call(d3.axisLeft(y).ticks(responsiveTickCount(width, 120)).tickFormat((d) => formatAxisK(d as number)))
        .call((sel) => sel.select(".domain").remove())
        .call((sel) => sel.selectAll("text").attr("fill", CHART_COLORS.axis).style("font-size", `${fontSize}px`))
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

      const legend = g.append("g").attr("transform", `translate(${Math.max(0, w - 200)}, -10)`);

      SERIES.forEach((s, i) => {
        const lg = legend.append("g").attr("transform", `translate(${i * 110}, 0)`);
        lg.append("circle").attr("r", 4).attr("fill", s.color);
        lg.append("text")
          .attr("x", 8)
          .attr("y", 4)
          .text(s.label)
          .attr("fill", CHART_COLORS.axis)
          .style("font-size", `${fontSize}px`);
      });
    },
    [data, width, height, uid],
  );

  return <svg ref={svgRef} role="img" aria-label="Diagramm: Tilgungsverlauf" />;
}
