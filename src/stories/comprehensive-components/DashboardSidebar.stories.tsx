import type { Meta, StoryObj } from '@storybook/react';
import { DashboardSidebar } from '@/components/dashboard/shell/DashboardSidebar';

const meta = {
  title: 'Comprehensive Components/Layout/DashboardSidebar',
  component: DashboardSidebar,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof DashboardSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  render: () => (
    <div className="h-screen flex">
      <DashboardSidebar collapsed={false} onToggleCollapse={() => {}} />
      <div className="flex-1 bg-sand-50 p-8 text-stone-500">
        <p>Sidebar expanded — 240px wide.</p>
      </div>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div className="h-screen flex">
      <DashboardSidebar collapsed={true} onToggleCollapse={() => {}} />
      <div className="flex-1 bg-sand-50 p-8 text-stone-500">
        <p>Sidebar collapsed — icons only, 68px wide.</p>
      </div>
    </div>
  ),
};

export const Drawer: Story = {
  render: () => (
    <div className="h-screen flex">
      <DashboardSidebar variant="drawer" />
      <div className="flex-1 bg-stone-900/40 p-8 text-white">
        <p>Mobile drawer variant — forced full width, no collapse toggle.</p>
      </div>
    </div>
  ),
};
