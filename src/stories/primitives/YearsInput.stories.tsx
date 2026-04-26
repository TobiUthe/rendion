import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { YearsInput } from "@/components/ui/YearsInput";

const ControlledYearsInput = ({
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
    <YearsInput
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
  title: "Primitives/YearsInput",
  component: ControlledYearsInput,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ControlledYearsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Zinsbindung", value: 10 },
  render: (args) => (
    <div className="w-64">
      <ControlledYearsInput {...args} />
    </div>
  ),
};

export const Filled: Story = {
  args: { label: "Zinsbindung", value: 15 },
  render: (args) => (
    <div className="w-64">
      <ControlledYearsInput {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: { label: "Zinsbindung", value: 15 },
  parameters: { viewport: { defaultViewport: "mobile" } },
  render: (args) => (
    <div className="w-full px-4">
      <ControlledYearsInput {...args} />
    </div>
  ),
};
