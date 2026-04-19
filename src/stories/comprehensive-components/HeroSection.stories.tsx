import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '@/components/landing/HeroSection';

const meta = {
  title: 'Comprehensive Components/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
