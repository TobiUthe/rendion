import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";

// Controlled wrapper — hides `onChange` from Storybook args table.
const ControlledTabs = ({
  options,
  value: initialValue,
  className,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  className?: string;
}) => {
  const [value, setValue] = useState(initialValue ?? options[0]?.value ?? "");
  return <Tabs options={options} value={value} onChange={setValue} className={className} />;
};

const meta = {
  title: "Primitives/Tabs",
  component: ControlledTabs,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ControlledTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const CHART_TABS = [
  { value: "vermoegensentwicklung", label: "Vermögen 30J." },
  { value: "cashflow", label: "Cashflow" },
  { value: "tilgungsplan", label: "Tilgungsplan" },
];

const PARAMETER_TABS = [
  { value: "basisdaten", label: "Basisdaten" },
  { value: "kaufnebenkosten", label: "Kaufnebenkosten" },
  { value: "finanzierung", label: "Finanzierung" },
  { value: "nebenkosten", label: "Nebenkosten" },
  { value: "steuern", label: "Steuern" },
];

export const ThreeTabs: Story = {
  args: { options: CHART_TABS, value: "vermoegensentwicklung" },
  render: (args) => (
    <div className="w-[480px]">
      <ControlledTabs {...args} />
      <div className="mt-4 rounded-lg border border-sand-200 bg-[var(--color-surface)] p-4 text-sm text-stone-600">
        Tab-Inhalt erscheint hier
      </div>
    </div>
  ),
};

export const FiveTabs: Story = {
  args: { options: PARAMETER_TABS, value: "basisdaten" },
  render: (args) => (
    <div className="w-[560px]">
      <ControlledTabs {...args} />
      <div className="mt-4 rounded-lg border border-sand-200 bg-[var(--color-surface)] p-4 text-sm text-stone-600">
        Tab-Inhalt erscheint hier
      </div>
    </div>
  ),
};

export const Mobile: Story = {
  args: { options: CHART_TABS, value: "vermoegensentwicklung" },
  parameters: { viewport: { defaultViewport: "mobile" } },
  render: (args) => (
    <div className="w-full px-0">
      <ControlledTabs {...args} />
    </div>
  ),
};
