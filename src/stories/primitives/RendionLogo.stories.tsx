import type { Meta, StoryObj } from '@storybook/react';
import { RendionLogo } from '@/components/brand/RendionLogo';

const meta = {
  title: 'Primitives/RendionLogo',
  component: RendionLogo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'number',
    },
    color: {
      control: 'color',
    },
  },
} satisfies Meta<typeof RendionLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 32,
  },
};

export const Small: Story = {
  args: {
    size: 24,
  },
};

export const Large: Story = {
  args: {
    size: 64,
  },
};

export const CustomColor: Story = {
  args: {
    size: 48,
    color: '#476352',
  },
};

export const OnDark: Story = {
  args: {
    size: 48,
    color: '#f7f7f8',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  args: { size: 32 },
  render: () => (
    <div className="flex gap-8 items-center">
      <RendionLogo size={24} />
      <RendionLogo size={32} />
      <RendionLogo size={48} />
      <RendionLogo size={64} />
    </div>
  ),
};
