import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { BODY, HEADINGS } from "@/lib/design-tokens";
import type { DashboardAnalysisSummary } from "@/lib/mock/dashboard";
import { AnalysisCard } from "@/components/dashboard/AnalysisCard";

interface AnalysesListProps {
  analyses: DashboardAnalysisSummary[];
}

export function AnalysesList({ analyses }: AnalysesListProps) {
  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)]/60 px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]">
          <FileSearch className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h2 className={cn(HEADINGS.h3)}>Noch keine Analysen gespeichert</h2>
          <p className={cn(BODY.subtitle, "mt-1 max-w-md")}>
            Lege deine erste Analyse an, um Kennzahlen, Cashflow und Vermögensentwicklung zu sehen.
          </p>
        </div>
        <Button href="/" variant="primary" size="md">
          Erste Analyse starten
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {analyses.map((analysis) => (
        <AnalysisCard key={analysis.id} analysis={analysis} />
      ))}
    </div>
  );
}
