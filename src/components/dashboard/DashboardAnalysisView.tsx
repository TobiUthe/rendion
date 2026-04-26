'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { VerdictHero } from '@/components/results/VerdictHero';
import { AnalysisKpiCards } from '@/components/results/AnalysisKpiCards';
import { ChartsTabs } from '@/components/results/ChartsTabs';
import { ParameterPanel } from '@/components/parameter-panel/ParameterPanel';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { mapResultToView, type ErgebnisView } from '@/lib/calculator/mapResultToView';
import type { QuickCalcInput } from '@/lib/schemas/calculator';

const DESKTOP_KPI_INDICES = [0, 2, 3] as const;
const MOBILE_PRIORITY: [string, string] = ['Cashflow', 'Bruttorendite'];
const ALL_TABS = ['basisdaten', 'kaufnebenkosten', 'finanzierung', 'nebenkosten', 'steuern'] as const;

interface DashboardAnalysisViewProps {
  id: string;
  title: string;
  address: string;
  initialInput: QuickCalcInput;
  initialView: ErgebnisView;
}

export function DashboardAnalysisView({
  id,
  title,
  address,
  initialInput,
  initialView,
}: DashboardAnalysisViewProps) {
  const [input, setInput] = useState<QuickCalcInput>(initialInput);
  const isFirstChange = useRef(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const view = useMemo<ErgebnisView>(() => {
    const result = quickCalcKapitalanlage(input);
    if (!result) return initialView;
    return mapResultToView(input, result);
  }, [input, initialView]);

  useEffect(() => {
    if (isFirstChange.current) {
      isFirstChange.current = false;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void fetch(`/api/analyses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [input, id]);

  const visibleKpis = DESKTOP_KPI_INDICES.map((i) => view.kpis[i]);

  return (
    <div className="container-lg page-px py-8">
      <PageHeader
        title={title}
        subtitle={address}
        backLink={{ href: '/dashboard', label: 'Zurück zur Übersicht' }}
        titleSuffix={
          <VerdictHero level={view.verdict.level} label={view.verdict.label} />
        }
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
          onInputChange={setInput}
          onAuthRequest={() => {}}
          unlockedTabs={ALL_TABS}
          inlineFrom="md"
          defaultExpanded
        />
      </div>
    </div>
  );
}
