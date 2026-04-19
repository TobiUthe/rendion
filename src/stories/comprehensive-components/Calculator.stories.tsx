import type { Meta, StoryObj } from "@storybook/react";
import { Calculator } from "@/components/calculator/Calculator";

const meta = {
  title: "Comprehensive Components/Calculator",
  component: Calculator,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Calculator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
  render: () => (
    <div className="w-[420px]">
      <Calculator />
    </div>
  ),
};

export const Prefilled: Story = {
  args: {},
  render: () => (
    <div className="w-[420px]">
      <Calculator initial={{ kaufpreis: 380000, kaltmiete: 1200, eigenkapital: 95000 }} />
    </div>
  ),
};

export const Compact: Story = {
  args: {},
  render: () => (
    <div className="w-[360px]">
      <Calculator compact initial={{ kaufpreis: 450000, kaltmiete: 1400, eigenkapital: 110000 }} />
    </div>
  ),
};
