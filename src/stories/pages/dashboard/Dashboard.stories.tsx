import type { Meta } from '@storybook/react';
import DashboardPage from '@/app/dashboard/page';

const meta = {
  title: 'Pages/Dashboard/Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

export const Default = {
  render: () => <DashboardPage />,
};
