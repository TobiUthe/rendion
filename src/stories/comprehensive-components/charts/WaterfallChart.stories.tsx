import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, userEvent, expect } from "storybook/test";
import { WaterfallChart } from "@/components/charts/d3/WaterfallChart";

const meta = {
  title: "Comprehensive Components/Charts/WaterfallChart",
  component: WaterfallChart,
  parameters: { layout: "centered" },
} satisfies Meta<typeof WaterfallChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  { label: "Kaltmiete", value: 1200, description: "Monatliche Mieteinnahmen" },
  { label: "Nebenkosten", value: -360, description: "Nicht umlagefähige Kosten" },
  { label: "Annuität", value: -1188, description: "Kapitaldienst bei 6,5 % p.a." },
  { label: "Cashflow", value: -348, isTotal: true },
];

export const Default: Story = {
  args: {
    title: "Monatlicher Cashflow",
    items: defaultItems,
  },
  render: (args) => (
    <div className="w-[640px]">
      <WaterfallChart {...args} />
    </div>
  ),
};

export const WithTimeframe: Story = {
  args: {
    title: "Monatlicher Cashflow",
    subtitle: "Tilgungsphase · Jahr 1–28",
    footnote: "Ab Jahr 29 entfällt die Annuität — Cashflow steigt auf +840 € / Monat.",
    items: defaultItems,
  },
  render: (args) => (
    <div className="w-[640px]">
      <WaterfallChart {...args} />
    </div>
  ),
};

/** Clicks the "Zufluss" legend button to activate it — other categories dim. */
export const FocusActive: Story = {
  args: {
    title: "Monatlicher Cashflow",
    items: defaultItems,
  },
  render: (args) => (
    <div className="w-[640px]">
      <WaterfallChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Find the "Zufluss" legend button by its accessible name (aria-pressed buttons with text)
    const zuflussBtn = canvas.getByRole("button", { name: /zufluss/i });
    await userEvent.click(zuflussBtn);
    // After clicking, aria-pressed should be true
    await expect(zuflussBtn).toHaveAttribute("aria-pressed", "true");
    // Clicking again clears the focus
    await userEvent.click(zuflussBtn);
    await expect(zuflussBtn).toHaveAttribute("aria-pressed", "false");
  },
};

export const Mobile: Story = {
  args: {
    title: "Monatlicher Cashflow",
    items: defaultItems,
  },
  render: (args) => (
    <div className="w-full">
      <WaterfallChart {...args} />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: "mobile" },
    layout: "fullscreen",
  },
};
