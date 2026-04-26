import { describe, it, expect } from 'vitest';
import { buildAppreciationSeries } from '@/lib/calculator/appreciation';

describe('buildAppreciationSeries', () => {
  const kaufpreis = 300_000;
  const rate = 2; // 2% p.a.

  it('series length equals years', () => {
    const series = buildAppreciationSeries(kaufpreis, rate, 30);
    expect(series).toHaveLength(30);
  });

  it('year-1 immobilienwert = kaufpreis * (1 + rate/100)^1', () => {
    // Note: year 1 (j=1) uses Math.pow(1+rate/100, 1), not 1.02^0
    const series = buildAppreciationSeries(kaufpreis, rate, 10);
    const expected = kaufpreis * Math.pow(1.02, 1);
    expect(series[0].immobilienwert).toBeCloseTo(expected, 5);
  });

  it('year-10 immobilienwert = kaufpreis * (1 + rate/100)^10', () => {
    const series = buildAppreciationSeries(kaufpreis, rate, 10);
    const expected = kaufpreis * Math.pow(1.02, 10);
    expect(series[9].immobilienwert).toBeCloseTo(expected, 2);
  });

  it('wertzuwachs = immobilienwert - kaufpreis', () => {
    const series = buildAppreciationSeries(kaufpreis, rate, 5);
    for (const row of series) {
      expect(row.wertzuwachs).toBeCloseTo(row.immobilienwert - kaufpreis, 5);
    }
  });

  it('immobilienwert is strictly increasing for positive rate', () => {
    const series = buildAppreciationSeries(kaufpreis, rate, 10);
    for (let i = 1; i < series.length; i++) {
      expect(series[i].immobilienwert).toBeGreaterThan(series[i - 1].immobilienwert);
    }
  });
});
