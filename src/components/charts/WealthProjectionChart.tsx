"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DataPoint {
  year: number;
  immobilienwert: number;
  eigenkapital: number;
  restschuld: number;
  kumulierterCashflow: number;
}

interface WealthProjectionChartProps {
  data: DataPoint[];
}

export function WealthProjectionChart({ data }: WealthProjectionChartProps) {
  return (
    <div className="h-[240px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        className="animate-chart-enter"
      >
        <defs>
          <linearGradient id="colorEigenkapital" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-success)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-chart-success)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorImmobilienwert" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-chart-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
        <XAxis
          dataKey="year"
          stroke="var(--color-chart-axis)"
          style={{ fontSize: "12px" }}
          label={{ value: "Jahre", position: "right", offset: 10 }}
        />
        <YAxis
          stroke="var(--color-chart-axis)"
          style={{ fontSize: "12px" }}
          label={{ value: "EUR", angle: -90, position: "insideLeft" }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value) => `€${(value as number).toLocaleString("de-DE", { maximumFractionDigits: 0 })}`}
          labelFormatter={(label) => `Jahr ${label}`}
          contentStyle={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="eigenkapital"
          stroke="var(--color-chart-success)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorEigenkapital)"
          name="Eigenkapital"
        />
        <Area
          type="monotone"
          dataKey="immobilienwert"
          stroke="var(--color-chart-primary)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorImmobilienwert)"
          name="Immobilienwert"
        />
      </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
