import type { Meta, StoryObj } from "@storybook/react";
import { WealthAccumulationChart } from "@/components/charts/d3/WealthAccumulationChart";
import { quickCalcKapitalanlage } from "@/lib/calculator/quick-calc";
import { DEMO_INPUT } from "@/lib/calculator/defaults";

const result = quickCalcKapitalanlage(DEMO_INPUT)!;

const meta = {
  title: "Comprehensive Components/Charts/WealthAccumulationChart",
  component: WealthAccumulationChart,
  parameters: { layout: "centered" },
} satisfies Meta<typeof WealthAccumulationChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projection: result.projection,
    eigenkapital: DEMO_INPUT.eigenkapital,
    kaufnebenkosten: result.nebenkostenTotal,
  },
  render: (args) => (
    <div className="w-[720px]">
      <WealthAccumulationChart {...args} />
    </div>
  ),
};
