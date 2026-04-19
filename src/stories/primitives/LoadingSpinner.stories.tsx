import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const meta = {
  title: 'Primitives/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  args: { size: 'md' },
  render: () => (
    <div className="flex gap-8">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-xs text-neutral-500">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="md" />
        <span className="text-xs text-neutral-500">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-neutral-500">lg</span>
      </div>
    </div>
  ),
};
