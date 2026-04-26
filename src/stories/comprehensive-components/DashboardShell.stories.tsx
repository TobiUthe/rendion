import type { Meta, StoryObj } from '@storybook/react';
import { DashboardShell } from '@/components/dashboard/shell/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { AnalysesList } from '@/components/dashboard/home/AnalysesList';
import { MOCK_DASHBOARD_ANALYSES } from '@/lib/mock/dashboard';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'Comprehensive Components/Layout/DashboardShell',
  component: DashboardShell,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof DashboardShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <DashboardShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <PageHeader
          title="Übersicht"
          subtitle={`${MOCK_DASHBOARD_ANALYSES.length} gespeicherte Analysen`}
          actions={
            <Button href="/" variant="primary" size="md">
              Neue Analyse
            </Button>
          }
        />
        <div className="mt-8">
          <AnalysesList analyses={MOCK_DASHBOARD_ANALYSES} />
        </div>
      </div>
    </DashboardShell>
  ),
};

export const Empty: Story = {
  args: { children: null },
  render: () => (
    <DashboardShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <PageHeader title="Übersicht" subtitle="Noch keine Analysen" />
        <div className="mt-8">
          <AnalysesList analyses={[]} />
        </div>
      </div>
    </DashboardShell>
  ),
};
