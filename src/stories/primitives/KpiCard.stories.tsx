import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from '@/components/ui/KpiCard';
import { MOCK_ANALYSIS } from '@/lib/mock/analysis';

const meta = {
  title: 'Primitives/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['green', 'yellow', 'red', 'neutral'],
    },
  },
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  args: {
    color: 'green',
    label: 'Cashflow / Monat',
    value: '+148 €',
    subtitle: 'Positiver Cashflow',
  },
};

export const Yellow: Story = {
  args: {
    color: 'yellow',
    label: 'Bruttorendite',
    value: '3,79 %',
  },
};

export const Red: Story = {
  args: {
    color: 'red',
    label: 'Cashflow / Monat',
    value: '-82 €',
    subtitle: 'Negativer Cashflow',
  },
};

export const Neutral: Story = {
  args: {
    color: 'neutral',
    label: 'Kaufpreisfaktor',
    value: '26,4×',
  },
};

export const Grid: Story = {
  args: { color: 'neutral', label: 'Grid', value: '—' },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MOCK_ANALYSIS.kpis.map((kpi) => (
        <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} color={kpi.color ?? 'neutral'} />
      ))}
    </div>
  ),
};
