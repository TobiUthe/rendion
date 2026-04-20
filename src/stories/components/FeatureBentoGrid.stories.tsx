import type { Meta, StoryObj } from '@storybook/react';
import { FeatureBentoGrid } from '@/components/landing/FeatureBentoGrid';

const meta = {
  title: 'Components/FeatureBentoGrid',
  component: FeatureBentoGrid,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FeatureBentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
