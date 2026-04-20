import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { VerdictHero } from '@/components/results/VerdictHero';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTitle: Story = {
  args: {
    title: 'Meine Analysen',
    subtitle: '3 gespeicherte Analysen',
  },
};

export const WithBackLink: Story = {
  args: {
    title: 'Analyse Details',
    backLink: { href: '/dashboard', label: 'Zurück' },
  },
};

export const WithActions: Story = {
  args: {
    title: 'Übersicht',
    actions: <Button variant="primary" size="sm">Neue Analyse</Button>,
  },
};

export const WithTitleSuffix: Story = {
  args: {
    title: 'Berlin-Prenzlauer Berg',
    subtitle: 'Kastanienallee 47, 10119 Berlin',
    titleSuffix: <VerdictHero level="good" label="Attraktive Rendite" />,
  },
};

export const Full: Story = {
  args: {
    title: 'Analyse Details',
    subtitle: 'Alle Metriken und Prognosen',
    backLink: { href: '/dashboard', label: 'Zurück' },
    actions: <Button variant="secondary" size="sm">Exportieren</Button>,
    titleSuffix: <VerdictHero level="good" label="Sehr attraktiv" />,
  },
};
