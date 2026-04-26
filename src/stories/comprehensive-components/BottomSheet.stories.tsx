import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'Comprehensive Components/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ title, lots = false }: { title?: string; lots?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-sand-50 p-6">
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={title}>
        {lots ? (
          <div className="space-y-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-sand-200 p-3">
                <p className="text-sm text-stone-700">Row {i + 1}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-stone-700">Bottom sheet content goes here.</p>
            <Button onClick={() => setOpen(false)}>Schließen</Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export const Default: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => <Demo title="Parameter anpassen" />,
};

export const Untitled: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => <Demo />,
};

export const LongContent: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => <Demo title="Lange Liste" lots />,
};
