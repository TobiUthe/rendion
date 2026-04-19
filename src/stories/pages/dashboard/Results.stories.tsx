import type { Meta } from '@storybook/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { VerdictHero } from '@/components/results/VerdictHero';
import { AnalysisKpiCards } from '@/components/results/AnalysisKpiCards';
import { Section } from '@/components/layout/Section';
import { WealthProjectionChart } from '@/components/charts/WealthProjectionChart';
import { CashflowBarChart } from '@/components/charts/CashflowBarChart';
import { MOCK_ANALYSIS } from '@/lib/mock/analysis';

const meta = {
  title: 'Pages/Dashboard/Results',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

const ResultsPageComposition = ({ verdict = 'good' }: { verdict?: 'good' | 'mixed' | 'risky' }) => {
  const verdictLabels = { good: 'Attraktive Rendite', mixed: 'Gemischtes Bild', risky: 'Nicht empfohlen' };
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container-lg page-px py-8">
        <div className="mb-2 text-xs text-neutral-400">Mock-Analyse — Demo-Daten</div>
        <PageHeader
          title={MOCK_ANALYSIS.title}
          subtitle={MOCK_ANALYSIS.address}
          backLink={{ href: '/', label: 'Zurück zur Startseite' }}
          titleSuffix={<VerdictHero level={verdict} label={verdictLabels[verdict]} />}
        />
        <div className="mt-6">
          <AnalysisKpiCards kpis={MOCK_ANALYSIS.kpis} />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div style={{ height: '400px' }}>
            <Section title="Vermögensentwicklung 30 Jahre" variant="card">
              <WealthProjectionChart data={MOCK_ANALYSIS.projection} />
            </Section>
          </div>
          <div style={{ height: '400px' }}>
            <Section title="Monatlicher Cashflow" variant="card">
              <CashflowBarChart data={MOCK_ANALYSIS.cashflowMonthly} />
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const Default = {
  render: () => <ResultsPageComposition verdict="good" />,
};

export const MixedVerdict = {
  render: () => <ResultsPageComposition verdict="mixed" />,
};
