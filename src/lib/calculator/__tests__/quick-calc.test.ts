import { describe, it, expect } from 'vitest';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { withDefaults } from '@/lib/calculator/defaults';

function makeInput(kaufpreis: number, kaltmiete: number, eigenkapital: number) {
  return withDefaults({ kaufpreis, kaltmiete, eigenkapital });
}

describe('quickCalcKapitalanlage', () => {
  it('returns null when kaufpreis is zero', () => {
    expect(quickCalcKapitalanlage(makeInput(0, 500, 0))).toBeNull();
  });

  it('returns null when kaufpreis is negative', () => {
    expect(quickCalcKapitalanlage(makeInput(-1, 500, 0))).toBeNull();
  });

  it('returns null when kaltmiete is zero', () => {
    expect(quickCalcKapitalanlage(makeInput(100_000, 0, 0))).toBeNull();
  });

  it('returns null when kaltmiete is negative', () => {
    expect(quickCalcKapitalanlage(makeInput(100_000, -1, 0))).toBeNull();
  });

  it('happy path 100k/500/0 — bruttoRendite is 6.0%', () => {
    // jahresmiete = 500 * 12 = 6000, bruttoRendite = 6000/100000*100 = 6.0
    const result = quickCalcKapitalanlage(makeInput(100_000, 500, 0));
    expect(result).not.toBeNull();
    expect(result!.bruttoRendite).toBeCloseTo(6.0, 5);
  });

  it('kaufpreisfaktor = kaufpreis / jahresmiete', () => {
    const result = quickCalcKapitalanlage(makeInput(100_000, 500, 0));
    // kaufpreisfaktor = 100000 / (500*12) = 100000 / 6000 ≈ 16.667
    expect(result!.kaufpreisfaktor).toBeCloseTo(100_000 / 6_000, 5);
  });

  it('amortization invariant: cumulative tilgung + restschuld ≈ darlehenssumme at every year', () => {
    const result = quickCalcKapitalanlage(makeInput(300_000, 1000, 60_000));
    expect(result).not.toBeNull();
    // darlehenssumme = 300000 - 60000 = 240000
    expect(result!.darlehenssumme).toBe(240_000);
    // For any year row: sum of tilgung up to and including that year + restschuld at that year ≈ original darlehen
    const year10 = result!.tilgungsplan[9]; // index 9 = year 10
    const cumulativeTilgungYear10 = result!.tilgungsplan
      .slice(0, 10)
      .reduce((sum, row) => sum + row.tilgungsanteil, 0);
    expect(cumulativeTilgungYear10 + year10.restschuld).toBeCloseTo(240_000, 0);
  });

  it('eigenkapital 0 means darlehenssumme equals kaufpreis', () => {
    const result = quickCalcKapitalanlage(makeInput(200_000, 800, 0));
    expect(result!.darlehenssumme).toBe(200_000);
  });
});
