import type { Meta } from '@storybook/react';
import SignupPage from '@/app/registrieren/page';

const meta = {
  title: 'Pages/Marketing/Register',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

export const Default = {
  render: () => <SignupPage />,
};
