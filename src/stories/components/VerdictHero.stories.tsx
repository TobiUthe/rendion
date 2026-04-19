import type { Meta, StoryObj } from '@storybook/react';
import { VerdictHero } from '@/components/results/VerdictHero';

const meta = {
  title: 'Components/VerdictHero',
  component: VerdictHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    level: {
      control: 'select',
      options: ['good', 'mixed', 'risky'],
    },
  },
} satisfies Meta<typeof VerdictHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Good: Story = {
  args: {
    level: 'good',
    label: 'Attraktive Rendite',
  },
};

export const Mixed: Story = {
  args: {
    level: 'mixed',
    label: 'Gemischtes Bild',
  },
};

export const Risky: Story = {
  args: {
    level: 'risky',
    label: 'Nicht empfohlen',
  },
};

export const AllVariants: Story = {
  args: { level: 'good', label: 'All variants' },
  render: () => (
    <div className="space-y-6">
      <VerdictHero level="good" label="Attraktive Rendite" />
      <VerdictHero level="mixed" label="Gemischtes Bild" />
      <VerdictHero level="risky" label="Nicht empfohlen" />
    </div>
  ),
};
