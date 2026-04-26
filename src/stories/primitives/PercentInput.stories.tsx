import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { PercentInput } from "@/components/ui/PercentInput";

const ControlledPercentInput = ({
  label,
  value: initialValue,
  placeholder,
  className,
  min,
  max,
}: {
  label: string;
  value: number;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
}) => {
  const [value, setValue] = useState(initialValue);
  return (
    <PercentInput
      label={label}
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      className={className}
      min={min}
      max={max}
    />
  );
};

const meta = {
  title: "Primitives/PercentInput",
  component: ControlledPercentInput,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ControlledPercentInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Zinssatz", value: 0 },
  render: (args) => (
    <div className="w-64">
      <ControlledPercentInput {...args} />
    </div>
  ),
};

export const Filled: Story = {
  args: { label: "Zinssatz", value: 3.5 },
  render: (args) => (
    <div className="w-64">
      <ControlledPercentInput {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: { label: "Zinssatz", value: 3.5 },
  parameters: { viewport: { defaultViewport: "mobile" } },
  render: (args) => (
    <div className="w-full px-4">
      <ControlledPercentInput {...args} />
    </div>
  ),
};
