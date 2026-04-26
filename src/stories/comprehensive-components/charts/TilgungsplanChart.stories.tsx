import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, userEvent, expect } from "storybook/test";
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

/** Toggle "Zinsanteil" off — bars show only Tilgungsanteil, y-axis rescales. */
export const SeriesHidden: Story = {
  args: { tilgungsplan: result.tilgungsplan },
  render: (args) => (
    <div className="w-[720px]" style={{ minHeight: 320 }}>
      <TilgungsplanChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const zinsBtn = canvas.getByRole("button", { name: /zinsanteil/i });
    // Starts visible
    await expect(zinsBtn).toHaveAttribute("aria-pressed", "true");
    // Toggle off
    await userEvent.click(zinsBtn);
    await expect(zinsBtn).toHaveAttribute("aria-pressed", "false");
    // Toggle back on
    await userEvent.click(zinsBtn);
    await expect(zinsBtn).toHaveAttribute("aria-pressed", "true");
  },
};

export const Mobile: Story = {
  args: { tilgungsplan: result.tilgungsplan },
  render: (args) => (
    <div className="w-full" style={{ minHeight: 320 }}>
      <TilgungsplanChart {...args} />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: "mobile" },
    layout: "fullscreen",
  },
};
