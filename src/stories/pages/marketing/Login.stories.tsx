import type { Meta } from '@storybook/react';
import LoginPage from '@/app/anmelden/page';

const meta = {
  title: 'Pages/Marketing/Login',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

export const Default = {
  render: () => <LoginPage />,
};
