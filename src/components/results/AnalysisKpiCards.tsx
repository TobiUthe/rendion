import { KpiCard } from "@/components/ui/KpiCard";

interface KpiItem {
  label: string;
  value: string;
  color: "green" | "yellow" | "red" | null;
}

interface AnalysisKpiCardsProps {
  kpis: KpiItem[];
}

export function AnalysisKpiCards({ kpis }: AnalysisKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi, idx) => (
        <KpiCard
          key={idx}
          label={kpi.label}
          value={kpi.value}
          color={kpi.color || "neutral"}
        />
      ))}
    </div>
  );
}
