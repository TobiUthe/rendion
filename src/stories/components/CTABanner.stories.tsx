import type { Meta, StoryObj } from '@storybook/react';
import { CTABanner } from '@/components/landing/CTABanner';

const meta = {
  title: 'Components/CTABanner',
  component: CTABanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CTABanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
