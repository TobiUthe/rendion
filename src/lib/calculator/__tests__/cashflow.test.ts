import { describe, it, expect } from 'vitest';
import { buildCashflowSeries, computeSteadyStateCashflow } from '@/lib/calculator/cashflow';
import { buildAmortizationSchedule, computeAnnuity } from '@/lib/calculator/loan';

function makeAmortization(years = 10) {
  const darlehen = 200_000;
  const annuitaet = computeAnnuity(darlehen, 3.5, 2);
  return buildAmortizationSchedule({
    darlehenssumme: darlehen,
    annuitaetJahr: annuitaet,
    zinssatzPa: 3.5,
    years,
  });
}

describe('computeSteadyStateCashflow', () => {
  it('cashflowJahr = cashflowMonat * 12', () => {
    const result = computeSteadyStateCashflow({
      kaltmiete: 1000,
      kostenMonat: 175,
      annuitaetMonat: 916.67,
    });
    expect(result.cashflowJahr).toBeCloseTo(result.cashflowMonat * 12, 5);
  });
});

describe('buildCashflowSeries', () => {
  const jahresmiete = 12_000; // 1000/month
  const kostenJahr = 2_100;   // 175/month
  const amortization = makeAmortization(10);

  it('series length equals amortization length', () => {
    const series = buildCashflowSeries({ jahresmiete, kostenJahr, amortization });
    expect(series).toHaveLength(amortization.length);
  });

  it('year-1 jahresmiete equals base jahresmiete when mietsteigerung is 0', () => {
    const series = buildCashflowSeries({
      jahresmiete,
      kostenJahr,
      amortization,
      mietsteigerungPa: 0,
    });
    // year 1: jahresmiete * (1+0)^(1-1) = jahresmiete * 1 = jahresmiete
    expect(series[0].jahresmiete).toBeCloseTo(jahresmiete, 5);
  });

  it('year-N jahresmiete is indexed by (1+rate)^(N-1)', () => {
    const rate = 2; // 2% p.a.
    const series = buildCashflowSeries({
      jahresmiete,
      kostenJahr,
      amortization,
      mietsteigerungPa: rate,
    });
    // year 5: jahresmiete * (1.02)^4
    const expected = jahresmiete * Math.pow(1.02, 4);
    expect(series[4].jahresmiete).toBeCloseTo(expected, 5);
  });

  it('kumulierterCashflow is the running sum of cashflowJahr', () => {
    const series = buildCashflowSeries({ jahresmiete, kostenJahr, amortization });
    let runningSum = 0;
    for (const row of series) {
      runningSum += row.cashflowJahr;
      expect(row.kumulierterCashflow).toBeCloseTo(runningSum, 5);
    }
  });
});
