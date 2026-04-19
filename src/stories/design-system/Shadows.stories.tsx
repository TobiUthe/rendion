import type { Meta } from '@storybook/react';

const meta = {
  title: 'Design System/Shadows',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

export const Elevation = () => (
  <div className="p-8 bg-sand-50 space-y-6">
    <h1 className="text-3xl font-bold">Shadow Tokens</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div>
        <div className="h-24 bg-white rounded shadow-sm" />
        <code className="text-xs text-neutral-600 mt-2 block">shadow-sm</code>
      </div>
      <div>
        <div className="h-24 bg-white rounded shadow-md" />
        <code className="text-xs text-neutral-600 mt-2 block">shadow-md</code>
      </div>
      <div>
        <div className="h-24 bg-white rounded shadow-lg" />
        <code className="text-xs text-neutral-600 mt-2 block">shadow-lg</code>
      </div>
      <div>
        <div className="h-24 bg-white rounded shadow-xl" />
        <code className="text-xs text-neutral-600 mt-2 block">shadow-xl</code>
      </div>
      <div>
        <div className="h-24 bg-white rounded shadow-inner" />
        <code className="text-xs text-neutral-600 mt-2 block">shadow-inner</code>
      </div>
    </div>
  </div>
);

export const Radii = () => (
  <div className="p-8 bg-sand-50 space-y-6">
    <h1 className="text-3xl font-bold">Border Radius Tokens</h1>
    <div className="grid grid-cols-3 gap-6">
      <div>
        <div className="h-24 bg-white rounded border-2 border-sand-300" />
        <code className="text-xs text-neutral-600 mt-2 block">radius-sm (8px)</code>
      </div>
      <div>
        <div className="h-24 bg-white rounded-lg border-2 border-sand-300" />
        <code className="text-xs text-neutral-600 mt-2 block">radius-md (12px)</code>
      </div>
      <div>
        <div className="h-24 bg-white rounded-full border-2 border-sand-300" />
        <code className="text-xs text-neutral-600 mt-2 block">radius-full</code>
      </div>
    </div>
  </div>
);

export const Spacing = () => (
  <div className="p-8 bg-sand-50 space-y-8">
    <h1 className="text-3xl font-bold">Spacing Tokens</h1>
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">gap-2 (itemGap)</p>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-primary-500 rounded" />
          <div className="h-8 w-8 bg-primary-500 rounded" />
          <div className="h-8 w-8 bg-primary-500 rounded" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">gap-3 (componentGap)</p>
        <div className="flex gap-3">
          <div className="h-8 w-8 bg-primary-500 rounded" />
          <div className="h-8 w-8 bg-primary-500 rounded" />
          <div className="h-8 w-8 bg-primary-500 rounded" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">gap-6 (sectionGap)</p>
        <div className="flex gap-6">
          <div className="h-8 w-8 bg-primary-500 rounded" />
          <div className="h-8 w-8 bg-primary-500 rounded" />
          <div className="h-8 w-8 bg-primary-500 rounded" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">gap-8 (pageGap)</p>
        <div className="flex gap-8">
          <div className="h-8 w-8 bg-primary-500 rounded" />
          <div className="h-8 w-8 bg-primary-500 rounded" />
          <div className="h-8 w-8 bg-primary-500 rounded" />
        </div>
      </div>
    </div>
  </div>
);
