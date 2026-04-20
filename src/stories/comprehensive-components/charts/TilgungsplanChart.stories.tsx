import type { Meta, StoryObj } from "@storybook/react";
import { TilgungsplanChart } from "@/components/charts/d3/TilgungsplanChart";
import { quickCalcKapitalanlage } from "@/lib/calculator/quick-calc";
import { DEMO_INPUT } from "@/lib/calculator/defaults";

const result = quickCalcKapitalanlage(DEMO_INPUT)!;

const meta = {
  title: "Comprehensive Components/Charts/TilgungsplanChart",
  component: TilgungsplanChart,
  parameters: { layout: "centered" },
} satisfies Meta<typeof TilgungsplanChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tilgungsplan: result.tilgungsplan },
  render: (args) => (
    <div className="w-[720px]" style={{ minHeight: 320 }}>
      <TilgungsplanChart {...args} />
    </div>
  ),
};
