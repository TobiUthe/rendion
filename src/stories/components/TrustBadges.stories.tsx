import type { Meta, StoryObj } from '@storybook/react';
import { TrustBadges } from '@/components/landing/TrustBadges';

const meta = {
  title: 'Components/TrustBadges',
  component: TrustBadges,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TrustBadges>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
