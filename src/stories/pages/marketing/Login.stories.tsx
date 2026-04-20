import type { Meta } from '@storybook/react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { MockAuthForm } from '@/components/auth/MockAuthForm';

const meta = {
  title: 'Pages/Marketing/Login',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

const LoginPageComposition = () => (
  <PublicLayout width="full">
    <div className="container-lg page-px py-16">
      <MockAuthForm
        mode="signin"
        title="Willkommen zurück"
        submitLabel="Anmelden"
      />
    </div>
  </PublicLayout>
);

export const Default = {
  render: LoginPageComposition,
};
