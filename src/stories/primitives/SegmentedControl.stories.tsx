import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useState } from 'react';

type ControlledProps = Omit<React.ComponentProps<typeof SegmentedControl>, 'onChange'>;

const ControlledSegmentedControl = (args: ControlledProps) => {
  const [value, setValue] = useState(args.value || (args.options && args.options[0]?.value) || '');
  return <SegmentedControl {...args} value={value} onChange={setValue} />;
};

const meta = {
  title: 'Primitives/SegmentedControl',
  component: ControlledSegmentedControl,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ControlledSegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoOptions: Story = {
  render: (args) => <ControlledSegmentedControl {...args} />,
  args: {
    options: [
      { value: 'cashflow', label: 'Cashflow' },
      { value: 'rendite', label: 'Rendite' },
    ],
    value: 'cashflow',
  },
};

export const ThreeOptions: Story = {
  render: (args) => <ControlledSegmentedControl {...args} />,
  args: {
    options: [
      { value: 'cashflow', label: 'Cashflow' },
      { value: 'prognose', label: 'Prognose' },
      { value: 'vergleich', label: 'Vergleich' },
    ],
    value: 'cashflow',
  },
};

export const FiveOptions: Story = {
  render: (args) => <ControlledSegmentedControl {...args} />,
  args: {
    options: [
      { value: 'tab1', label: 'Option 1' },
      { value: 'tab2', label: 'Option 2' },
      { value: 'tab3', label: 'Option 3' },
      { value: 'tab4', label: 'Option 4' },
      { value: 'tab5', label: 'Option 5' },
    ],
    value: 'tab1',
  },
};
