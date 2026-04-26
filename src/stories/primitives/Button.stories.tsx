import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Speichern',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Abbrechen',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'Mehr Info',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'md',
    children: 'Löschen',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Mehr erfahren',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Speichern',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Neu berechnen',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    iconOnly: true,
    children: <Plus size={20} />,
  },
};

export const AsLink: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    href: '/ergebnis',
    children: 'Zur Analyse',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: 'Speichern',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: 'Berechnet...',
  },
};

export const Mobile: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Neue Analyse starten',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    layout: 'padded',
  },
  render: (args) => (
    <div className="w-full px-4 space-y-3">
      <Button {...args} variant="primary" size="md" className="w-full">
        Neue Analyse starten
      </Button>
      <Button {...args} variant="secondary" size="md" className="w-full">
        Abbrechen
      </Button>
      <Button {...args} variant="ghost" size="md" className="w-full">
        Mehr Info
      </Button>
    </div>
  ),
};
