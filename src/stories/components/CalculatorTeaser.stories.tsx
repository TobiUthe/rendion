import type { Meta, StoryObj } from '@storybook/react';
import { CalculatorTeaser } from '@/components/landing/CalculatorTeaser';

const meta = {
  title: 'Components/CalculatorTeaser',
  component: CalculatorTeaser,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CalculatorTeaser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
