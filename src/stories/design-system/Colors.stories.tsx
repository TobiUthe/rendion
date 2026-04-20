import type { Meta } from '@storybook/react';
import { PALETTES, SEMANTIC, CHART_SEMANTIC, CHART_ROLES } from '@/lib/design-tokens';

const meta = {
  title: 'Design System/Colors',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

const ColorSwatch = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="h-12 w-12 rounded border border-sand-200" style={{ backgroundColor: value }} />
    <code className="text-xs font-mono text-neutral-600">{name}</code>
  </div>
);

export const Palettes = () => {
  const allPalettes = Object.entries(PALETTES);
  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Color Palettes</h1>
      <div className="space-y-8">
        {allPalettes.map(([paletteName, palette]) => (
          <div key={paletteName}>
            <h2 className="text-lg font-semibold mb-4 capitalize">{paletteName}</h2>
            <div className="grid grid-cols-10 gap-4">
              {Object.entries(palette).map(([step, color]) => (
                <ColorSwatch key={step} name={`${paletteName}-${step}`} value={color} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SemanticAliases = () => {
  const semanticEntries = Object.entries(SEMANTIC);
  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Semantic Color Tokens</h1>
      <div className="grid grid-cols-2 gap-8">
        {semanticEntries.map(([key, value]) => (
          <div key={key} className="space-y-2">
            <span className="text-sm font-medium text-neutral-600 uppercase">{key}</span>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded" style={{ backgroundColor: value }} />
              <code className="text-xs font-mono">{value}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartColors = () => {
  const roleEntries = Object.entries(CHART_ROLES);
  const semanticEntries = Object.entries(CHART_SEMANTIC);

  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Chart Color Tokens</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Chart Roles</h2>
        <div className="grid grid-cols-4 gap-4">
          {roleEntries.map(([role, color]) => (
            <ColorSwatch key={role} name={role} value={color.color} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Semantic Chart Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          {semanticEntries.map(([key, color]) => (
            <ColorSwatch key={key} name={key} value={color} />
          ))}
        </div>
      </div>
    </div>
  );
};
