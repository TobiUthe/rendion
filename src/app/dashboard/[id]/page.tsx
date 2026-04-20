import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { VerdictHero } from "@/components/results/VerdictHero";
import { AnalysisKpiCards } from "@/components/results/AnalysisKpiCards";
import dynamic from "next/dynamic";
import { WaterfallChart } from "@/components/charts/d3/WaterfallChart";
import { ModellingPanel } from "@/components/dashboard/ModellingPanel";

const WealthAccumulationChart = dynamic(
  () => import("@/components/charts/d3/WealthAccumulationChart").then((m) => m.WealthAccumulationChart),
  { ssr: false },
);
import { MOCK_DASHBOARD_ANALYSES } from "@/lib/mock/dashboard";
import { MOCK_ANALYSIS } from "@/lib/mock/analysis";

interface DashboardDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return MOCK_DASHBOARD_ANALYSES.map((a) => ({ id: a.id }));
}

export default function DashboardDetailPage({ params }: DashboardDetailPageProps) {
  // In a real app, look up the analysis by id
  // For now, use the mock analysis
  const analysis = MOCK_ANALYSIS;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Header />
      <main className="flex-1 container-full page-px py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div className="space-y-6">
            <PageHeader
              title={analysis.title}
              subtitle={analysis.address}
              backLink={{ href: "/dashboard", label: "Zurück zu Meine Analysen" }}
              titleSuffix={
                <VerdictHero level={analysis.verdict.level} label={analysis.verdict.label} />
              }
            />

            <AnalysisKpiCards kpis={analysis.kpis} />

            <Section title="Vermögensentwicklung 30 Jahre">
              <WealthAccumulationChart
                projection={analysis.projection}
                eigenkapital={analysis.eigenkapital}
                kaufnebenkosten={analysis.kaufnebenkosten}
              />
            </Section>

            <Section title="Monatlicher Cashflow">
              <WaterfallChart items={analysis.cashflowWaterfall} />
            </Section>
          </div>

          {/* Sidebar */}
          <div>
            <ModellingPanel />
          </div>
        </div>

        {/* Mobile sticky CTA to jump to modelling panel */}
        <div className="lg:hidden sticky bottom-0 z-[var(--z-sticky)] border-t border-sand-200 bg-[var(--color-surface)]/95 backdrop-blur-md px-4 py-3">
          <a
            href="#modelling-panel"
            className="block w-full rounded-lg bg-sand-100 px-4 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-sand-200 transition-colors"
          >
            Parameter anpassen
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
