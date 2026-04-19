import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'Primitives/AnimatedNumber',
  component: AnimatedNumber,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'number' },
    duration: { control: 'number' },
  },
} satisfies Meta<typeof AnimatedNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 142300,
    duration: 600,
  },
};

export const Currency: Story = {
  args: {
    value: 380000,
    duration: 600,
    format: (n) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
    className: 'text-3xl font-mono font-bold text-neutral-900',
  },
};

export const Percentage: Story = {
  args: {
    value: 3.79,
    duration: 600,
    format: (n) => `${n.toFixed(2).replace('.', ',')} %`,
    className: 'text-2xl font-mono font-semibold text-neutral-900',
  },
};

export const Interactive: Story = {
  args: { value: 0, duration: 600 },
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState(142300);
      const values = [142300, 380000, 95000, 1200];
      return (
        <div className="flex flex-col items-center gap-6">
          <AnimatedNumber
            value={value}
            duration={600}
            format={(n) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
            className="text-4xl font-mono font-bold text-neutral-900"
          />
          <div className="flex gap-2">
            {values.map((v) => (
              <Button key={v} variant="secondary" size="sm" onClick={() => setValue(v)}>
                {v.toLocaleString('de-DE')}
              </Button>
            ))}
          </div>
        </div>
      );
    };
    return <Demo />;
  },
};
