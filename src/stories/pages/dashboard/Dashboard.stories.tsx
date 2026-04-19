import type { Meta } from '@storybook/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AnalysisCard } from '@/components/dashboard/AnalysisCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { MOCK_DASHBOARD_ANALYSES } from '@/lib/mock/dashboard';
import { BarChart3 } from 'lucide-react';

const meta = {
  title: 'Pages/Dashboard/Dashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

const DashboardPageComposition = ({ empty }: { empty?: boolean }) => (
  <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
    <Header />
    <main className="flex-1 container-lg page-px py-8">
      <PageHeader
        title="Meine Analysen"
        subtitle={empty ? undefined : '3 gespeicherte Analysen'}
        actions={<Button variant="primary" size="md">Neue Analyse</Button>}
      />
      {empty ? (
        <div className="mt-8">
          <EmptyState
            icon={BarChart3}
            title="Keine Analysen gefunden"
            description="Erstellen Sie Ihre erste Immobilienanalyse, um sie hier zu sehen."
            action={{ label: 'Neue Analyse', href: '#' }}
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {MOCK_DASHBOARD_ANALYSES.map((a) => (
            <AnalysisCard key={a.id} analysis={a} />
          ))}
        </div>
      )}
    </main>
    <Footer />
  </div>
);

export const Default = {
  render: () => <DashboardPageComposition empty={false} />,
};

export const Empty = {
  render: () => <DashboardPageComposition empty={true} />,
};
