import type { Meta } from '@storybook/react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { MockAuthForm } from '@/components/auth/MockAuthForm';

const meta = {
  title: 'Pages/Marketing/Register',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

const RegisterPageComposition = () => (
  <PublicLayout width="full">
    <div className="container-lg page-px py-16">
      <MockAuthForm
        mode="signup"
        title="Konto erstellen"
        submitLabel="Kostenlos registrieren"
      />
    </div>
  </PublicLayout>
);

export const Default = {
  render: RegisterPageComposition,
};
