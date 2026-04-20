import type { Meta } from '@storybook/react';
import { ErgebnisView } from '@/components/results/ErgebnisView';
import { ErgebnisEmptyState } from '@/components/results/ErgebnisEmptyState';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { mapResultToView } from '@/lib/calculator/mapResultToView';

const meta = {
  title: 'Pages/Dashboard/Results',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

// Mock input data for results
const mockInput = {
  kaufpreis: 500000,
  eigenkapital: 100000,
  darlehensDauer: 30,
  zinsSatz: 3.5,
  nebenkosten: 50000,
};

const mockResult = quickCalcKapitalanlage(mockInput);
const mockView = mockResult ? mapResultToView(mockInput, mockResult) : null;

export const Default = {
  render: () => mockView && mockResult ?
    <ErgebnisView view={mockView} input={mockInput} kaufpreisfaktor={mockResult.kaufpreisfaktor} /> :
    <ErgebnisEmptyState />,
};

export const Empty = {
  render: () => <ErgebnisEmptyState />,
};
