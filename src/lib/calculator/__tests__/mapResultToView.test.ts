import { describe, it, expect } from 'vitest';
import { mapResultToView } from '@/lib/calculator/mapResultToView';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { withDefaults } from '@/lib/calculator/defaults';

const input = withDefaults({ kaufpreis: 300_000, kaltmiete: 1_000, eigenkapital: 60_000 });
const result = quickCalcKapitalanlage(input)!;
const view = mapResultToView(input, result);

describe('mapResultToView', () => {
  it('kpis array has exactly 9 items', () => {
    expect(view.kpis).toHaveLength(9);
  });

  it('verdict.level is one of the VerdictLevel union values', () => {
    expect(['good', 'mixed', 'risky']).toContain(view.verdict.level);
  });

  it('verdict.label is a non-empty string', () => {
    expect(typeof view.verdict.label).toBe('string');
    expect(view.verdict.label.length).toBeGreaterThan(0);
  });

  it('each kpi has label and value as non-empty strings', () => {
    for (const kpi of view.kpis) {
      expect(typeof kpi.label).toBe('string');
      expect(kpi.label.length).toBeGreaterThan(0);
      expect(typeof kpi.value).toBe('string');
      expect(kpi.value.length).toBeGreaterThan(0);
    }
  });

  it('projection and tilgungsplan are non-empty arrays', () => {
    expect(view.projection.length).toBeGreaterThan(0);
    expect(view.tilgungsplan.length).toBeGreaterThan(0);
  });
});
