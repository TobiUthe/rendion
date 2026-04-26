import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ParameterPanel } from '@/components/parameter-panel/ParameterPanel';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { mapResultToView } from '@/lib/calculator/mapResultToView';
import { DEMO_INPUT, withDefaults } from '@/lib/calculator/defaults';
import type { QuickCalcBasisdaten, QuickCalcInput } from '@/lib/schemas/calculator';

const meta = {
  title: 'Comprehensive Components/ParameterPanel',
  component: ParameterPanel,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ParameterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

function getMockView(input: QuickCalcInput) {
  const result = quickCalcKapitalanlage(input);
  return result ? mapResultToView(input, result) : null;
}

function buildStoryArgs(basisdaten?: QuickCalcBasisdaten) {
  const input = basisdaten ? withDefaults(basisdaten) : DEMO_INPUT;
  return {
    input,
    view: getMockView(input)!,
    onAuthRequest: () => {},
    defaultExpanded: true,
  };
}

export const Desktop: Story = {
  args: buildStoryArgs(),
};

export const DashboardInlineFromLg: Story = {
  args: { ...buildStoryArgs(), inlineFrom: 'lg' },
};

export const MobileSheet: Story = {
  args: { ...buildStoryArgs(), inlineFrom: 'md' },
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const AllLocked: Story = {
  args: { ...buildStoryArgs(), unlockedTabs: [] },
};

export const BasisdatenEditable: Story = {
  args: { ...buildStoryArgs({ kaufpreis: 650000, kaltmiete: 1800, eigenkapital: 200000 }) },
};
