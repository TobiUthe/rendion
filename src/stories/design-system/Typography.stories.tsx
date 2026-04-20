import type { Meta } from '@storybook/react';

const meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

export const Headings = () => (
  <div className="p-8 space-y-8 bg-white">
    <div>
      <h1 className="text-5xl font-display font-bold mb-2">Heading 1 (h1)</h1>
      <code className="text-xs text-neutral-500">font-display text-5xl font-bold</code>
    </div>
    <div>
      <h2 className="text-4xl font-display font-semibold mb-2">Heading 2 (h2)</h2>
      <code className="text-xs text-neutral-500">font-display text-4xl font-semibold</code>
    </div>
    <div>
      <h3 className="text-3xl font-display font-semibold mb-2">Heading 3 (h3)</h3>
      <code className="text-xs text-neutral-500">font-display text-3xl font-semibold</code>
    </div>
    <div>
      <h4 className="text-2xl font-display font-semibold mb-2">Heading 4 (h4)</h4>
      <code className="text-xs text-neutral-500">font-display text-2xl font-semibold</code>
    </div>
    <div>
      <h5 className="text-xl font-display font-semibold mb-2">Heading 5 (h5)</h5>
      <code className="text-xs text-neutral-500">font-display text-xl font-semibold</code>
    </div>
  </div>
);

export const BodyText = () => (
  <div className="p-8 space-y-8 bg-white max-w-2xl">
    <div>
      <p className="text-base text-neutral-700 mb-2">
        This is default body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
      </p>
      <code className="text-xs text-neutral-500">text-base text-neutral-700</code>
    </div>
    <div>
      <p className="text-base font-semibold text-neutral-900 mb-2">
        This is strong body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
      <code className="text-xs text-neutral-500">text-base font-semibold</code>
    </div>
    <div>
      <p className="text-sm text-neutral-600 mb-2">
        This is caption text. Used for secondary information and annotations.
      </p>
      <code className="text-xs text-neutral-500">text-sm text-neutral-600</code>
    </div>
    <div>
      <p className="text-xs font-medium uppercase text-neutral-500 mb-2">
        This is section label text
      </p>
      <code className="text-xs text-neutral-500">text-xs font-medium uppercase</code>
    </div>
  </div>
);

export const DataText = () => (
  <div className="p-8 space-y-8 bg-white">
    <div>
      <p className="text-3xl font-mono font-bold text-neutral-900 mb-2">142.300 €</p>
      <code className="text-xs text-neutral-500">KPI Large - text-3xl font-bold font-mono</code>
    </div>
    <div>
      <p className="text-2xl font-mono font-semibold text-neutral-900 mb-2">3,79 %</p>
      <code className="text-xs text-neutral-500">KPI Standard - text-2xl font-semibold font-mono</code>
    </div>
    <div>
      <p className="text-xl font-mono text-neutral-900 mb-2">+148 €</p>
      <code className="text-xs text-neutral-500">Value - text-xl font-mono</code>
    </div>
    <div>
      <p className="text-xs font-mono text-neutral-600 mb-2">JAN FEB MÄR</p>
      <code className="text-xs text-neutral-500">Axis Label - text-xs font-mono</code>
    </div>
    <div>
      <p className="text-sm font-mono text-neutral-500 mb-2">Prognose 2035</p>
      <code className="text-xs text-neutral-500">Chart Annotation - text-sm font-mono</code>
    </div>
  </div>
);

export const Fonts = () => (
  <div className="p-8 space-y-12 bg-white">
    <div>
      <p className="font-sans text-2xl mb-4">Work Sans (font-sans)</p>
      <p className="font-sans text-base text-neutral-600">
        The quick brown fox jumps over the lazy dog. ABCDEFGHIJKLMNOPQRSTUVWXYZ
      </p>
    </div>
    <div>
      <p className="font-display text-2xl mb-4">Libre Baskerville (font-display)</p>
      <p className="font-display text-base text-neutral-600">
        The quick brown fox jumps over the lazy dog. ABCDEFGHIJKLMNOPQRSTUVWXYZ
      </p>
    </div>
    <div>
      <p className="font-mono text-2xl mb-4">IBM Plex Mono (font-mono)</p>
      <p className="font-mono text-base text-neutral-600">
        The quick brown fox jumps over the lazy dog. ABCDEFGHIJKLMNOPQRSTUVWXYZ
      </p>
    </div>
  </div>
);
