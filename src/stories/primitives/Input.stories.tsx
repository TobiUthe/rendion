import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/ui/Input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "E-Mail", placeholder: "demo@rendion.de" },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: "Kaufpreis", placeholder: "380.000" },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const WithSuffix: Story = {
  args: { label: "Kaufpreis", placeholder: "380.000", suffix: "€" },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const WithPrefix: Story = {
  args: { label: "Webseite", placeholder: "rendion.de", prefix: "https://" },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: { label: "Kaltmiete", placeholder: "1.200", suffix: "€", error: "Pflichtfeld" },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const WithHelperText: Story = {
  args: {
    label: "Zinssatz",
    placeholder: "3,5",
    suffix: "%",
    helperText: "Aktueller Durchschnitt: 3,8 %",
  },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: "Kaufpreis", value: "380.000", suffix: "€", disabled: true },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: { label: "Kaufpreis", placeholder: "380.000", suffix: "€" },
  parameters: { viewport: { defaultViewport: "mobile" } },
  render: (args) => (
    <div className="w-full px-4">
      <Input {...args} />
    </div>
  ),
};
