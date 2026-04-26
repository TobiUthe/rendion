import type { Meta } from '@storybook/react';
import { ErgebnisView } from '@/components/results/ErgebnisView';
import { ErgebnisEmptyState } from '@/components/results/ErgebnisEmptyState';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { mapResultToView } from '@/lib/calculator/mapResultToView';
import { withDefaults } from '@/lib/calculator/defaults';

const meta = {
  title: 'Pages/Dashboard/Results',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

const mockInput = withDefaults({
  kaufpreis: 500000,
  eigenkapital: 100000,
  kaltmiete: 2500,
});

const mockResult = quickCalcKapitalanlage(mockInput);
const mockView = mockResult ? mapResultToView(mockInput, mockResult) : null;

export const Default = {
  render: () => mockView ?
    <ErgebnisView view={mockView} input={mockInput} /> :
    <ErgebnisEmptyState />,
};

export const Empty = {
  render: () => <ErgebnisEmptyState />,
};
