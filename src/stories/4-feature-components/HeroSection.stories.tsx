import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '@/components/landing/HeroSection';

const meta = {
  title: '4. Feature Components/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

