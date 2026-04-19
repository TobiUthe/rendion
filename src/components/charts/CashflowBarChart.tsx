"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DataPoint {
  month: string;
  cashflow: number;
}

interface CashflowBarChartProps {
  data: DataPoint[];
}

export function CashflowBarChart({ data }: CashflowBarChartProps) {
  return (
    <div className="h-[240px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        className="animate-chart-enter"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
        <XAxis
          dataKey="month"
          stroke="var(--color-chart-axis)"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="var(--color-chart-axis)"
          style={{ fontSize: "12px" }}
          label={{ value: "EUR", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          formatter={(value) => `€${(value as number).toFixed(0)}`}
          labelFormatter={(label) => `${label}`}
          contentStyle={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        />
        <Bar
          dataKey="cashflow"
          radius={[4, 4, 0, 0]}
          name="Monatlicher Cashflow"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.cashflow >= 0 ? "var(--color-chart-success)" : "var(--color-chart-danger)"}
            />
          ))}
        </Bar>
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
