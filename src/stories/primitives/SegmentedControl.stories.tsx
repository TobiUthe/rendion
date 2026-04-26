import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { PercentInput } from "@/components/ui/PercentInput";
import { YearsInput } from "@/components/ui/YearsInput";

// Controlled wrapper — hides `onChange` from Storybook args table.
const ControlledSegmentedControl = ({
  options,
  value: initialValue,
  className,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  className?: string;
}) => {
  const [value, setValue] = useState(initialValue ?? options[0]?.value ?? "");
  return (
    <SegmentedControl options={options} value={value} onChange={setValue} className={className} />
  );
};

const meta = {
  title: "Primitives/SegmentedControl",
  component: ControlledSegmentedControl,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ControlledSegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoSegments: Story = {
  args: {
    options: [
      { value: "cashflow", label: "Cashflow" },
      { value: "rendite", label: "Rendite" },
    ],
    value: "cashflow",
  },
  render: (args) => (
    <div className="w-80">
      <ControlledSegmentedControl {...args} />
    </div>
  ),
};

export const ThreeSegments: Story = {
  args: {
    options: [
      { value: "cashflow", label: "Cashflow" },
      { value: "prognose", label: "Prognose" },
      { value: "vergleich", label: "Vergleich" },
    ],
    value: "cashflow",
  },
  render: (args) => (
    <div className="w-80">
      <ControlledSegmentedControl {...args} />
    </div>
  ),
};

export const FourSegments: Story = {
  args: {
    options: [
      { value: "tab1", label: "Basisdaten" },
      { value: "tab2", label: "Finanzierung" },
      { value: "tab3", label: "Nebenkosten" },
      { value: "tab4", label: "Steuern" },
    ],
    value: "tab1",
  },
  render: (args) => (
    <div className="w-96">
      <ControlledSegmentedControl {...args} />
    </div>
  ),
};

/**
 * Alignment regression test: SegmentedControl and all numeric inputs
 * must sit at the same h-11 height. This is the original bug fix.
 */
export const AlignmentCheck: Story = {
  args: {
    options: [
      { value: "kaufen", label: "Kaufen" },
      { value: "mieten", label: "Mieten" },
    ],
    value: "kaufen",
  },
  render: () => {
    const [seg, setSeg] = useState("kaufen");
    const [currency, setCurrency] = useState(380000);
    const [percent, setPercent] = useState(3.5);
    const [years, setYears] = useState(15);
    return (
      <div className="w-[480px] space-y-4">
        <p className="text-xs uppercase tracking-wider text-stone-400">
          Alle Elemente sollen dieselbe Höhe haben
        </p>
        <div className="grid grid-cols-2 gap-3">
          <SegmentedControl
            options={[
              { value: "kaufen", label: "Kaufen" },
              { value: "mieten", label: "Mieten" },
            ]}
            value={seg}
            onChange={setSeg}
            className="col-span-2"
          />
          <CurrencyInput label="Kaufpreis" value={currency} onChange={setCurrency} />
          <PercentInput label="Zinssatz" value={percent} onChange={setPercent} />
          <YearsInput label="Zinsbindung" value={years} onChange={setYears} />
        </div>
      </div>
    );
  },
};

export const Mobile: Story = {
  args: {
    options: [
      { value: "cashflow", label: "Cashflow" },
      { value: "prognose", label: "Prognose" },
      { value: "vergleich", label: "Vergleich" },
    ],
    value: "cashflow",
  },
  parameters: { viewport: { defaultViewport: "mobile" } },
  render: (args) => (
    <div className="w-full px-4">
      <ControlledSegmentedControl {...args} />
    </div>
  ),
};
