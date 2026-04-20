import type { Meta, StoryObj } from '@storybook/react';
import { AnalysisCard } from '@/components/dashboard/AnalysisCard';
import { MOCK_DASHBOARD_ANALYSES } from '@/lib/mock/dashboard';

const meta = {
  title: 'Comprehensive Components/AnalysisCard',
  component: AnalysisCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AnalysisCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Good: Story = {
  args: {
    analysis: MOCK_DASHBOARD_ANALYSES[0],
  },
};

export const Mixed: Story = {
  args: {
    analysis: MOCK_DASHBOARD_ANALYSES[1],
  },
};

export const Risky: Story = {
  args: {
    analysis: {
      ...MOCK_DASHBOARD_ANALYSES[0],
      id: 'demo-risky',
      verdict: { level: 'risky', label: 'Nicht empfohlen' },
    },
  },
};

export const List: Story = {
  args: { analysis: MOCK_DASHBOARD_ANALYSES[0] },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-3xl">
      {MOCK_DASHBOARD_ANALYSES.map((analysis) => (
        <AnalysisCard key={analysis.id} analysis={analysis} />
      ))}
    </div>
  ),
};
