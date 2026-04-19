import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/ui/Skeleton';

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  args: {
    className: 'h-4 w-48',
  },
};

export const Paragraph: Story = {
  args: { className: 'h-4 w-full' },
  render: () => (
    <div className="space-y-3 w-64">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  ),
};

export const KpiCardSkeleton: Story = {
  args: { className: 'h-4 w-full' },
  render: () => (
    <div className="border border-sand-200 rounded-lg p-4 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  ),
};

export const ChartSkeleton: Story = {
  args: {
    className: 'h-80 w-full',
  },
};

export const PageSkeleton: Story = {
  args: { className: 'h-4 w-full' },
  render: () => (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  ),
};
