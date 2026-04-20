import type { Meta } from '@storybook/react';
import Home from '@/app/page';

const meta = {
  title: 'Pages/Marketing/Landing',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

export const Default = {
  render: () => <Home />,
};
