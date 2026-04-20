import type { Meta, StoryObj } from "@storybook/react";
import { WaterfallChart } from "@/components/charts/d3/WaterfallChart";

const meta = {
  title: "Comprehensive Components/Charts/WaterfallChart",
  component: WaterfallChart,
  parameters: { layout: "centered" },
} satisfies Meta<typeof WaterfallChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Monatlicher Cashflow",
    items: [
      { label: "Kaltmiete", value: 1200, description: "Monatliche Mieteinnahmen" },
      { label: "Nebenkosten", value: -360, description: "Nicht umlagefähige Kosten" },
      { label: "Annuität", value: -1188, description: "Kapitaldienst bei 6,5 % p.a." },
      { label: "Cashflow", value: -348, isTotal: true },
    ],
  },
  render: (args) => (
    <div className="w-[640px]">
      <WaterfallChart {...args} />
    </div>
  ),
};
