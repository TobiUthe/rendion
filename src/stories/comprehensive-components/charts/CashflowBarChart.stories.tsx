import type { Meta, StoryObj } from '@storybook/react';
import { CashflowBarChart } from '@/components/charts/CashflowBarChart';
import { MOCK_ANALYSIS } from '@/lib/mock/analysis';

const meta = {
  title: 'Comprehensive Components/Charts/CashflowBarChart',
  component: CashflowBarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CashflowBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const ChartFrame = ({ data }: { data: { month: string; cashflow: number }[] }) => (
  <div style={{ width: '600px', height: '350px' }}>
    <CashflowBarChart data={data} />
  </div>
);

export const Default: Story = {
  args: { data: [] },
  render: () => <ChartFrame data={MOCK_ANALYSIS.cashflowMonthly} />,
};

export const WithNegativeValues: Story = {
  args: { data: [] },
  render: () => (
    <ChartFrame
      data={[
        { month: 'Jan', cashflow: 150 },
        { month: 'Feb', cashflow: -100 },
        { month: 'Mär', cashflow: 200 },
        { month: 'Apr', cashflow: -50 },
        { month: 'Mai', cashflow: 180 },
        { month: 'Jun', cashflow: 160 },
      ]}
    />
  ),
};

export const Minimal: Story = {
  args: { data: [] },
  render: () => <ChartFrame data={MOCK_ANALYSIS.cashflowMonthly.slice(0, 3)} />,
};
