"use client";

import { useMemo, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { VerdictHero } from "@/components/results/VerdictHero";
import { AnalysisKpiCards } from "@/components/results/AnalysisKpiCards";
import { ChartsTabs } from "@/components/results/ChartsTabs";
import { ParameterPanel } from "@/components/parameter-panel/ParameterPanel";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MockAuthForm } from "@/components/auth/MockAuthForm";
import { quickCalcKapitalanlage } from "@/lib/calculator/quick-calc";
import { mapResultToView } from "@/lib/calculator/mapResultToView";
import type { ErgebnisView as ErgebnisViewData } from "@/lib/calculator/mapResultToView";
import type { QuickCalcInput } from "@/lib/schemas/calculator";

const DESKTOP_KPI_INDICES = [0, 2, 3] as const;
const MOBILE_PRIORITY: [string, string] = ["Cashflow", "Bruttorendite"];

interface ErgebnisViewProps {
  view: ErgebnisViewData;
  input: QuickCalcInput;
}

export function ErgebnisView({ view: initialView, input: initialInput }: ErgebnisViewProps) {
  const [input, setInput] = useState<QuickCalcInput>(initialInput);
  const [authOpen, setAuthOpen] = useState(false);

  const handleInputChange = (next: QuickCalcInput) => {
    setInput(next);
  };

  const view = useMemo<ErgebnisViewData>(() => {
    const result = quickCalcKapitalanlage(input);
    if (!result) return initialView;
    return mapResultToView(input, result);
  }, [input, initialView]);

  const visibleKpis = DESKTOP_KPI_INDICES.map((i) => view.kpis[i]);

  return (
    <PublicLayout width="full">
      <div className="container-lg page-px py-8">
        <PageHeader
          title={view.title}
          subtitle={view.subtitle}
          backLink={{ href: "/", label: "Zurück zur Startseite" }}
          titleSuffix={
            <VerdictHero level={view.verdict.level} label={view.verdict.label} />
          }
          actions={<ShareActions />}
        />

        <div className="mt-6">
          <AnalysisKpiCards kpis={visibleKpis} mobilePriority={MOBILE_PRIORITY} />
        </div>

        <div className="mt-8">
          <ChartsTabs
            projection={view.projection}
            eigenkapital={input.eigenkapital}
            kaufnebenkosten={view.kaufnebenkosten}
            waterfall={view.waterfall}
            waterfallMeta={view.waterfallMeta}
            tilgungsplan={view.tilgungsplan}
          />
        </div>

        <div className="mt-6">
          <ParameterPanel
            input={input}
            view={view}
            onInputChange={handleInputChange}
            onAuthRequest={() => setAuthOpen(true)}
            inlineFrom="md"
          />
        </div>
      </div>

      <Modal open={authOpen} onClose={() => setAuthOpen(false)} title="Analyse speichern & anpassen">
        <MockAuthForm mode="signup" title="Konto erstellen" submitLabel="Kostenlos registrieren" />
      </Modal>
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
