import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '@/components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';

const meta = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  args: {
    icon: BarChart3,
    title: 'Keine Analysen gefunden',
    description: 'Erstellen Sie Ihre erste Immobilienanalyse, um sie hier zu sehen.',
  },
};

export const WithAction: Story = {
  args: {
    icon: BarChart3,
    title: 'Keine Analysen gespeichert',
    description: 'Starten Sie eine neue Analyse, um Ihre Ergebnisse zu vergleichen.',
    action: {
      label: 'Neue Analyse',
      href: '/ergebnis',
    },
  },
};

export const WithButtonAction: Story = {
  args: {
    icon: BarChart3,
    title: 'Noch keine Daten',
    description: 'Beginnen Sie jetzt mit Ihrer ersten Analyse.',
    action: {
      label: 'Erstellen',
      onClick: () => console.log('clicked'),
    },
  },
};

export const NoIcon: Story = {
  args: {
    title: 'Keine Resultate',
    description: 'Passen Sie Ihre Suchfilter an und versuchen Sie es erneut.',
  },
};

export const FullWidth: Story = {
  args: {
    icon: BarChart3,
    title: 'Große leere Seite',
    description: 'Dies ist ein leerer Zustand mit großem Platz.',
    className: 'min-h-[400px]',
  },
};

export const Mobile: Story = {
  args: {
    icon: BarChart3,
    title: 'Keine Analysen gespeichert',
    description: 'Starten Sie eine neue Analyse, um Ihre Ergebnisse zu vergleichen.',
    action: { label: 'Neue Analyse', href: '/ergebnis' },
  },
  parameters: { viewport: { defaultViewport: 'mobile' } },
  render: (args) => (
    <div className="w-full px-4">
      <EmptyState {...args} />
    </div>
  ),
};
