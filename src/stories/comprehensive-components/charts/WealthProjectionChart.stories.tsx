import type { Meta, StoryObj } from '@storybook/react';
import { WealthProjectionChart } from '@/components/charts/WealthProjectionChart';
import { MOCK_ANALYSIS } from '@/lib/mock/analysis';

const meta = {
  title: 'Comprehensive Components/Charts/WealthProjectionChart',
  component: WealthProjectionChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof WealthProjectionChart>;

export default meta;
type Story = StoryObj<typeof meta>;

type ProjectionPoint = (typeof MOCK_ANALYSIS.projection)[number];

const ChartFrame = ({ data }: { data: ProjectionPoint[] }) => (
  <div style={{ width: '600px', height: '350px' }}>
    <WealthProjectionChart data={data} />
  </div>
);

export const Default: Story = {
  args: { data: [] },
  render: () => <ChartFrame data={MOCK_ANALYSIS.projection} />,
};

export const ShortTerm: Story = {
  args: { data: [] },
  render: () => <ChartFrame data={MOCK_ANALYSIS.projection.slice(0, 5)} />,
};
