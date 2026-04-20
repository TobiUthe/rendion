import type { Meta, StoryObj } from "@storybook/react";
import { MockAuthForm } from "@/components/auth/MockAuthForm";

const meta = {
  title: "Comprehensive Components/MockAuthForm",
  component: MockAuthForm,
  parameters: { layout: "centered" },
} satisfies Meta<typeof MockAuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  args: { mode: "signin", title: "Willkommen zurück", submitLabel: "Anmelden" },
};

export const SignUp: Story = {
  args: { mode: "signup", title: "Konto erstellen", submitLabel: "Kostenlos registrieren" },
};
