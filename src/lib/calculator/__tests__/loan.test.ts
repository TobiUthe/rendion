import { describe, it, expect } from 'vitest';
import { computeAnnuity, buildAmortizationSchedule, estimateTilgungsdauer } from '@/lib/calculator/loan';

describe('computeAnnuity', () => {
  it('formula: darlehen * (zins + tilgung) / 100', () => {
    // 200000 * (3.5 + 2) / 100 = 200000 * 5.5 / 100 = 11000
    expect(computeAnnuity(200_000, 3.5, 2)).toBeCloseTo(11_000, 5);
  });

  it('returns 0 when darlehenssumme is 0', () => {
    expect(computeAnnuity(0, 3.5, 2)).toBe(0);
  });
});

describe('buildAmortizationSchedule', () => {
  const darlehen = 100_000;
  const annuitaet = computeAnnuity(darlehen, 3.5, 2); // 5500
  const schedule = buildAmortizationSchedule({
    darlehenssumme: darlehen,
    annuitaetJahr: annuitaet,
    zinssatzPa: 3.5,
    years: 30,
  });

  it('produces exactly `years` rows', () => {
    expect(schedule).toHaveLength(30);
  });

  it('year-1 zins + tilgung = annuitaetGezahlt', () => {
    const row = schedule[0];
    expect(row.zins + row.tilgung).toBeCloseTo(row.annuitaetGezahlt, 5);
  });

  it('cumulative tilgung + final restschuld ≈ original darlehen', () => {
    const last = schedule[schedule.length - 1];
    expect(last.kumulativeTilgung + last.restschuld).toBeCloseTo(darlehen, -1);
  });

  it('restschuld never goes negative', () => {
    for (const row of schedule) {
      expect(row.restschuld).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('estimateTilgungsdauer', () => {
  it('returns a finite number between 1 and 60', () => {
    const result = estimateTilgungsdauer(100_000, 5_500, 3.5);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(60);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('returns 0 when darlehen is 0', () => {
    expect(estimateTilgungsdauer(0, 5_500, 3.5)).toBe(0);
  });
});
