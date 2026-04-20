import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { NumberInput } from "@/components/ui/NumberInput";

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

export const WithSuffix: Story = {
  args: { label: "Kaufpreis", placeholder: "380.000", suffix: "€" },
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

export const NumberFormatted: Story = {
  args: { label: "Kaufpreis", placeholder: "380.000" },
  render: () => {
    const ControlledNumberInput = () => {
      const [value, setValue] = useState<number | null>(380000);
      return (
        <div className="w-72">
          <NumberInput label="Kaufpreis" value={value} onChange={setValue} placeholder="380.000" />
        </div>
      );
    };
    return <ControlledNumberInput />;
  },
};
