"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { VerdictHero } from "@/components/results/VerdictHero";
import { AnalysisKpiCards } from "@/components/results/AnalysisKpiCards";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ErgebnisView as ErgebnisViewData } from "@/lib/calculator/mapResultToView";
import type { QuickCalcInput } from "@/lib/schemas/calculator";

const WealthAccumulationChart = dynamic(
  () => import("@/components/charts/d3/WealthAccumulationChart").then((m) => m.WealthAccumulationChart),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full md:h-96" /> },
);

const WaterfallChart = dynamic(
  () => import("@/components/charts/d3/WaterfallChart").then((m) => m.WaterfallChart),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full" /> },
);

const TilgungsplanChart = dynamic(
  () => import("@/components/charts/d3/TilgungsplanChart").then((m) => m.TilgungsplanChart),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full" /> },
);

interface ErgebnisViewProps {
  view: ErgebnisViewData;
  input: QuickCalcInput;
  kaufpreisfaktor: number;
}

export function ErgebnisView({ view, input, kaufpreisfaktor }: ErgebnisViewProps) {
  return (
    <PublicLayout width="full">
      <div className="container-lg page-px py-8">
        <PageHeader
          title={view.title}
          subtitle={view.subtitle}
          backLink={{ href: "/", label: "Zurück zur Startseite" }}
          titleSuffix={
            <VerdictHero
              level={view.verdict.level}
              label={view.verdict.label}
              kaufpreisfaktor={kaufpreisfaktor}
            />
          }
          actions={<ShareActions />}
        />

        <div className="mt-6">
          <AnalysisKpiCards kpis={view.kpis} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Section title="Vermögensentwicklung 30 Jahre" className="lg:col-span-2">
            <WealthAccumulationChart
              projection={view.projection}
              eigenkapital={input.eigenkapital}
              kaufnebenkosten={view.kaufnebenkosten}
            />
          </Section>
          <Section title="Monatlicher Cashflow">
            <WaterfallChart items={view.waterfall} />
          </Section>
          <Section title="Tilgungsplan">
            <TilgungsplanChart tilgungsplan={view.tilgungsplan} />
          </Section>
        </div>
      </div>
    </PublicLayout>
  );
}

function ShareActions() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const print = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={copyLink}>
        {copied ? "Kopiert!" : "Link kopieren"}
      </Button>
      <Button variant="secondary" size="sm" onClick={print}>
        Drucken
      </Button>
    </div>
  );
}
