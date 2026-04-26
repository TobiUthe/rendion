import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DashboardParameterPanel } from '@/components/dashboard/DashboardParameterPanel';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { mapResultToView } from '@/lib/calculator/mapResultToView';
import { DEMO_INPUT } from '@/lib/calculator/defaults';

const meta = {
  title: 'Comprehensive Components/DashboardParameterPanel',
  component: DashboardParameterPanel,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DashboardParameterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoResult = quickCalcKapitalanlage(DEMO_INPUT)!;
const demoView = mapResultToView(DEMO_INPUT, demoResult);

export const Default: Story = {
  args: {
    input: DEMO_INPUT,
    view: demoView,
    onInputChange: (input) => console.log('Input changed:', input),
  },
};

export const OnDesktopInline: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: { defaultViewport: 'iphone15' },
  },
};

export const OnMobileSheet: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
