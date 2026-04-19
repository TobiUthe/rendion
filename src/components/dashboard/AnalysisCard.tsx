import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldCheck, XCircle } from "lucide-react";
import type { DashboardAnalysisSummary } from "@/lib/mock/dashboard";

interface AnalysisCardProps {
  analysis: DashboardAnalysisSummary;
}

const VERDICT_ICONS = {
  good: ShieldCheck,
  mixed: AlertTriangle,
  risky: XCircle,
};

const VERDICT_COLORS = {
  good: "text-success-500",
  mixed: "text-warning-500",
  risky: "text-danger-500",
};

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const VerdictIcon = VERDICT_ICONS[analysis.verdict.level];

  return (
    <Link href={`/dashboard/${analysis.id}`}>
      <div className="group rounded-xl border border-sand-200 bg-white shadow-sm hover:shadow-md transition-shadow px-6 py-5 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-display font-semibold text-neutral-900 text-base">{analysis.title}</h3>
            <p className="text-sm text-neutral-500 mt-0.5">{analysis.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <VerdictIcon className={`h-4 w-4 ${VERDICT_COLORS[analysis.verdict.level]}`} />
            <span className={`text-sm font-semibold ${VERDICT_COLORS[analysis.verdict.level]}`}>
              {analysis.verdict.label}
            </span>
            <ArrowRight className="h-4 w-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-3 border-t border-sand-100">
          <div>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Kaufpreis</p>
            <p className="font-mono text-sm font-semibold text-neutral-900 mt-1">
              {(analysis.kaufpreis / 1000).toFixed(0)}k €
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Rendite</p>
            <p className="font-mono text-sm font-semibold text-neutral-900 mt-1">
              {analysis.bruttorendite}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Cashflow</p>
            <p className="font-mono text-sm font-semibold text-neutral-900 mt-1">
              {analysis.cashflowMonat}
            </p>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mt-3">
          Erstellt {new Date(analysis.createdAt).toLocaleDateString("de-DE")}
        </p>
      </div>
    </Link>
  );
}
