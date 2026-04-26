import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DashboardAnalysisView } from '@/components/dashboard/DashboardAnalysisView';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { mapResultToView } from '@/lib/calculator/mapResultToView';
import { DEMO_INPUT } from '@/lib/calculator/defaults';
import { MOCK_ANALYSIS } from '@/lib/mock/analysis';

const meta = {
  title: 'Pages/Dashboard/DashboardAnalysisView',
  component: DashboardAnalysisView,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DashboardAnalysisView>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoResult = quickCalcKapitalanlage(DEMO_INPUT)!;
const demoView = mapResultToView(DEMO_INPUT, demoResult);

export const Default: Story = {
  args: {
    id: 'demo-001',
    title: MOCK_ANALYSIS.title,
    address: MOCK_ANALYSIS.address,
    initialInput: DEMO_INPUT,
    initialView: demoView,
  },
};

export const Mobile: Story = {
  args: Default.args,
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};

export const Tablet: Story = {
  args: Default.args,
  parameters: {
    viewport: { defaultViewport: 'ipad' },
  },
};
