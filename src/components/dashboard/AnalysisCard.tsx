import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VerdictHero } from "@/components/results/VerdictHero";
import { cn } from "@/lib/utils";
import { BODY, DATA, HEADINGS } from "@/lib/design-tokens";
import { formatPercent, formatDelta, formatEuro } from "@/lib/format";
import type { DashboardAnalysisSummary } from "@/lib/mock/dashboard";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
}

function cashflowTone(value: number): string {
  if (value > 0) return "text-pine-700";
  if (value < 0) return "text-sienna-700";
  return "text-[var(--color-foreground)]";
}

interface AnalysisCardProps {
  analysis: DashboardAnalysisSummary;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <Link
      href={`/dashboard/${analysis.id}`}
      className="group flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <div className="flex items-start justify-between gap-3">
        <VerdictHero level={analysis.verdict.level} label={analysis.verdict.label} />
        <span className={cn(BODY.muted, "shrink-0 pt-2")}>
          {formatDate(analysis.createdAt)}
        </span>
      </div>

      <div className="mt-4">
        <h3 className={cn(HEADINGS.h4, "line-clamp-2")}>{analysis.title}</h3>
        <p className={cn(BODY.default, "mt-1 line-clamp-1 text-[var(--color-text-secondary)]")}>
          {analysis.address}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--color-border-subtle)] pt-4">
        <div>
          <div className={cn(BODY.sectionLabel, "text-[var(--color-text-secondary)]")}>
            Bruttorendite
          </div>
          <div className={cn(DATA.kpiStandard, "mt-1")}>
            {formatPercent(analysis.bruttorenditePct, { decimals: 2 })}
          </div>
        </div>
        <div>
          <div className={cn(BODY.sectionLabel, "text-[var(--color-text-secondary)]")}>
            Cashflow / Mo.
          </div>
          <div className={cn(DATA.kpiStandard, "mt-1", cashflowTone(analysis.cashflowMonat))}>
            {formatDelta(analysis.cashflowMonat, formatEuro)}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary-600 transition group-hover:gap-2.5">
        Details ansehen
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </div>
    </Link>
  );
}
