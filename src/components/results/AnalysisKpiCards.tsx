import { KpiCard } from "@/components/ui/KpiCard";
import { cn } from "@/lib/utils";

interface KpiItem {
  label: string;
  value: string;
  color: "green" | "yellow" | "red" | null;
}

interface AnalysisKpiCardsProps {
  kpis: KpiItem[];
  /**
   * Label prefixes of the two KPIs to surface below `sm` (e.g. ['Cashflow', 'Bruttorendite']).
   * Match is `label.startsWith(prefix)`. All other cards are hidden on mobile.
   * Omit to show the first two KPIs on mobile.
   */
  mobilePriority?: [string, string];
}

function isMobileVisible(label: string, mobilePriority: [string, string] | undefined, idx: number): boolean {
  if (!mobilePriority) return idx < 2;
  return mobilePriority.some((prefix) => label.startsWith(prefix));
}

export function AnalysisKpiCards({ kpis, mobilePriority }: AnalysisKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className={cn(!isMobileVisible(kpi.label, mobilePriority, idx) && "hidden sm:block")}
        >
          <KpiCard
            label={kpi.label}
            value={kpi.value}
            color={kpi.color || "neutral"}
          />
        </div>
      ))}
    </div>
  );
}
