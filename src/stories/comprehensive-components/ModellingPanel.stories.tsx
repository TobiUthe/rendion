import type { Meta, StoryObj } from '@storybook/react';
import { ModellingPanel } from '@/components/dashboard/ModellingPanel';

const meta = {
  title: 'Comprehensive Components/ModellingPanel',
  component: ModellingPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ModellingPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
