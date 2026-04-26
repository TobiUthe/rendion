import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AnalysisKpiCards } from '@/components/results/AnalysisKpiCards';
import { MOCK_ANALYSIS } from '@/lib/mock/analysis';

const meta = {
  title: 'Comprehensive Components/AnalysisKpiCards',
  component: AnalysisKpiCards,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AnalysisKpiCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    kpis: MOCK_ANALYSIS.kpis,
  },
};

export const SingleRow: Story = {
  args: {
    kpis: MOCK_ANALYSIS.kpis.slice(0, 3),
  },
};

export const MobileTwoShown: Story = {
  args: {
    kpis: MOCK_ANALYSIS.kpis.slice(0, 4),
    mobilePriority: ['Cashflow', 'Bruttorendite'],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};

export const MixedColors: Story = {
  args: {
    kpis: [
      { label: 'Positiv', value: '+142 €', color: 'green' },
      { label: 'Warnung', value: '3,79 %', color: 'yellow' },
      { label: 'Negativ', value: '-82 €', color: 'red' },
      { label: 'Neutral', value: '26,4×', color: null },
    ],
  },
};
