import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { CurrencyInput } from "@/components/ui/CurrencyInput";

// Controlled wrapper for stories — hides onChange from Storybook controls.
const ControlledCurrencyInput = ({
  label,
  value: initialValue,
  placeholder,
  className,
  suffix,
}: {
  label: string;
  value: number;
  placeholder?: string;
  className?: string;
  suffix?: string;
}) => {
  const [value, setValue] = useState(initialValue);
  return (
    <CurrencyInput
      label={label}
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      className={className}
      suffix={suffix}
    />
  );
};

const meta = {
  title: "Primitives/CurrencyInput",
  component: ControlledCurrencyInput,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ControlledCurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Kaufpreis", value: 0 },
  render: (args) => (
    <div className="w-64">
      <ControlledCurrencyInput {...args} />
    </div>
  ),
};

export const Filled: Story = {
  args: { label: "Kaufpreis", value: 380000 },
  render: (args) => (
    <div className="w-64">
      <ControlledCurrencyInput {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: { label: "Kaufpreis", value: 380000 },
  parameters: { viewport: { defaultViewport: "mobile" } },
  render: (args) => (
    <div className="w-full px-4">
      <ControlledCurrencyInput {...args} />
    </div>
  ),
};
