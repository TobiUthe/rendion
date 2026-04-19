import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <div className="flex items-center justify-between bg-white border-b border-sand-200 px-4 py-3 w-full">
        <div className="text-sm font-semibold">Rendion</div>
        <Story />
      </div>
    ),
  ],
};
