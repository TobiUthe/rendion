import type { Meta, StoryObj } from "@storybook/react";
import { HeroWithCalculator } from "@/components/landing/HeroWithCalculator";

const meta = {
  title: "Comprehensive Components/HeroWithCalculator",
  component: HeroWithCalculator,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroWithCalculator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="container-xl page-px">
      <HeroWithCalculator />
    </div>
  ),
};
