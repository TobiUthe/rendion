import type { Meta, StoryObj } from '@storybook/react';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'Components/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'flat'],
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    variant: 'card',
    title: 'Vermögensentwicklung',
    children: <p className="text-neutral-600">Dieser Abschnitt zeigt die Vermögensentwicklung über 30 Jahre.</p>,
  },
};

export const Flat: Story = {
  args: {
    variant: 'flat',
    title: 'Metriken',
    children: <p className="text-neutral-600">Dies ist ein flaches Layout ohne sichtbare Grenze.</p>,
  },
};

export const WithSubtitle: Story = {
  args: {
    variant: 'card',
    title: 'Analyse',
    subtitle: 'Basierend auf Ihren Eingaben',
    children: <p className="text-neutral-600">Inhalt der Sektion.</p>,
  },
};

export const WithActions: Story = {
  args: {
    variant: 'card',
    title: 'Ergebnisse',
    actions: <Button size="sm" variant="secondary">Exportieren</Button>,
    children: <p className="text-neutral-600">Inhalt mit Action-Button.</p>,
  },
};

export const NoHeader: Story = {
  args: {
    variant: 'card',
    children: <p className="text-neutral-600">Dies ist eine Sektion ohne Kopfzeile.</p>,
  },
};
