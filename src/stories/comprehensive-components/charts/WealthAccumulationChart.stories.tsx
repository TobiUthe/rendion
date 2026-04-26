import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, userEvent, expect } from "storybook/test";
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

const defaultArgs = {
  projection: result.projection,
  eigenkapital: DEMO_INPUT.eigenkapital,
  kaufnebenkosten: result.nebenkostenTotal,
};

export const Default: Story = {
  args: defaultArgs,
  render: (args) => (
    <div className="w-[720px]">
      <WealthAccumulationChart {...args} />
    </div>
  ),
};

/** Toggle "Wertzuwachs" off — the area re-layers. Toggle back on. */
export const SeriesHidden: Story = {
  args: defaultArgs,
  render: (args) => (
    <div className="w-[720px]">
      <WealthAccumulationChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // All series start visible (aria-pressed="true")
    const wertzuwachsBtn = canvas.getByRole("button", { name: /wertzuwachs/i });
    await expect(wertzuwachsBtn).toHaveAttribute("aria-pressed", "true");
    // Toggle off
    await userEvent.click(wertzuwachsBtn);
    await expect(wertzuwachsBtn).toHaveAttribute("aria-pressed", "false");
    // Toggle the net line off
    const netBtn = canvas.getByRole("button", { name: /nettowert/i });
    await userEvent.click(netBtn);
    await expect(netBtn).toHaveAttribute("aria-pressed", "false");
    // Toggle both back on
    await userEvent.click(wertzuwachsBtn);
    await expect(wertzuwachsBtn).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(netBtn);
    await expect(netBtn).toHaveAttribute("aria-pressed", "true");
  },
};

export const Mobile: Story = {
  args: defaultArgs,
  render: (args) => (
    <div className="w-full">
      <WealthAccumulationChart {...args} />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: "mobile" },
    layout: "fullscreen",
  },
};
