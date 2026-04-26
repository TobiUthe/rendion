'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BookmarkTabs } from '@/components/ui/BookmarkTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ErgebnisView } from '@/lib/calculator/mapResultToView';

type ChartTab = 'vermoegensentwicklung' | 'cashflow' | 'tilgungsplan';

interface ChartsTabsProps {
  projection: ErgebnisView['projection'];
  eigenkapital: number;
  kaufnebenkosten: number;
  waterfall: ErgebnisView['waterfall'];
  waterfallMeta: ErgebnisView['waterfallMeta'];
  tilgungsplan: ErgebnisView['tilgungsplan'];
}

const WealthAccumulationChart = dynamic(
  () =>
    import('@/components/charts/d3/WealthAccumulationChart').then((m) => m.WealthAccumulationChart),
  { ssr: false, loading: () => <Skeleton className="h-96 w-full" /> }
);

const WaterfallChart = dynamic(
  () => import('@/components/charts/d3/WaterfallChart').then((m) => m.WaterfallChart),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> }
);

const TilgungsplanChart = dynamic(
  () => import('@/components/charts/d3/TilgungsplanChart').then((m) => m.TilgungsplanChart),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> }
);

const CHART_TABS = [
  { value: 'vermoegensentwicklung', label: 'Vermögen 30J.' },
  { value: 'cashflow', label: 'Cashflow' },
  { value: 'tilgungsplan', label: 'Tilgungsplan' },
] as const;

export function ChartsTabs({
  projection,
  eigenkapital,
  kaufnebenkosten,
  waterfall,
  waterfallMeta,
  tilgungsplan,
}: ChartsTabsProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>('vermoegensentwicklung');

  return (
    <div>
      <BookmarkTabs
        options={CHART_TABS}
        value={activeTab}
        onChange={(value) => setActiveTab(value as ChartTab)}
      />

      <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div key={activeTab} className="p-3 sm:p-5 md:p-6 animate-chart-tab">
          {activeTab === 'vermoegensentwicklung' && (
            <WealthAccumulationChart
              projection={projection}
              eigenkapital={eigenkapital}
              kaufnebenkosten={kaufnebenkosten}
            />
          )}

          {activeTab === 'cashflow' && (
            <WaterfallChart
              items={waterfall}
              subtitle={waterfallMeta.timeframeLabel}
              footnote={waterfallMeta.postPayoffNote}
            />
          )}

          {activeTab === 'tilgungsplan' && <TilgungsplanChart tilgungsplan={tilgungsplan} />}
        </div>
      </div>
    </div>
  );
}
