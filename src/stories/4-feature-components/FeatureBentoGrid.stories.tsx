import type { Meta, StoryObj } from '@storybook/react';
import { FeatureBentoGrid } from '@/components/landing/FeatureBentoGrid';

const meta = {
  title: '4. Feature Components/FeatureBentoGrid',
  component: FeatureBentoGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FeatureBentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

