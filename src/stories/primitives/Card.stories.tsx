import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/ui/Card';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Übersicht',
    children: <p className="text-neutral-600">Dies ist der Inhalt einer Standard-Karte mit Titel.</p>,
  },
};

export const WithoutTitle: Story = {
  args: {
    children: <p className="text-neutral-600">Dies ist der Inhalt einer Karte ohne Titel.</p>,
  },
};

export const NoPadding: Story = {
  args: {
    title: 'Full-Bleed Image',
    noPadding: true,
    children: <div className="h-48 w-full bg-gradient-to-br from-primary-100 to-primary-50" />,
  },
};

export const WithCustomClass: Story = {
  args: {
    title: 'Custom Styling',
    className: 'mt-4 border-2 border-primary-200',
    children: <p className="text-neutral-600">Dies ist eine Karte mit benutzerdefinierten Klassen.</p>,
  },
};
