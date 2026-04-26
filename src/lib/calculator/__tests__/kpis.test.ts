import { describe, it, expect } from 'vitest';
import { computeRenditen, deriveVerdict } from '@/lib/calculator/kpis';

const BASE = {
  jahresmiete: 12_000,   // 1000/month
  kaufpreis: 200_000,
  kostenJahr: 2_400,     // 200/month
  eigenkapital: 50_000,
  cashflowJahr: -2_000,
  annuitaetJahr: 11_600,
};

describe('computeRenditen', () => {
  const r = computeRenditen(BASE);

  it('bruttoRendite = (jahresmiete / kaufpreis) * 100', () => {
    const expected = (12_000 / 200_000) * 100; // 6.0
    expect(r.bruttoRendite).toBeCloseTo(expected, 5);
  });

  it('dscr = (jahresmiete - kostenJahr) / annuitaetJahr', () => {
    // (12000 - 2400) / 11600 ≈ 0.8276
    const expected = (12_000 - 2_400) / 11_600;
    expect(r.dscr).toBeCloseTo(expected, 5);
  });

  it('capRate equals nettoRendite', () => {
    expect(r.capRate).toBeCloseTo(r.nettoRendite, 10);
  });

  it('eigenkapitalRendite = 0 when eigenkapital is 0', () => {
    const result = computeRenditen({ ...BASE, eigenkapital: 0 });
    expect(result.eigenkapitalRendite).toBe(0);
  });

  it('nettoRendite = ((jahresmiete - kostenJahr) / kaufpreis) * 100', () => {
    const expected = ((12_000 - 2_400) / 200_000) * 100; // 4.8
    expect(r.nettoRendite).toBeCloseTo(expected, 5);
  });
});

describe('deriveVerdict', () => {
  it('returns "good" when kaufpreisfaktor <= 22 and cashflowMonat >= 0', () => {
    const v = deriveVerdict({ kaufpreisfaktor: 18, cashflowMonat: 50 });
    expect(v.level).toBe('good');
    expect(v.label.length).toBeGreaterThan(0);
  });

  it('returns "risky" when kaufpreisfaktor >= 32', () => {
    const v = deriveVerdict({ kaufpreisfaktor: 33, cashflowMonat: 100 });
    expect(v.level).toBe('risky');
  });

  it('returns "risky" when cashflowMonat < -200', () => {
    const v = deriveVerdict({ kaufpreisfaktor: 25, cashflowMonat: -300 });
    expect(v.level).toBe('risky');
  });

  it('returns "mixed" for middle ground', () => {
    const v = deriveVerdict({ kaufpreisfaktor: 26, cashflowMonat: -50 });
    expect(v.level).toBe('mixed');
  });
});
