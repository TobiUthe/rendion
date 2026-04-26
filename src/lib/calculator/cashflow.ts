import type { AmortizationYear } from "./loan";

export interface CashflowYear {
  jahr: number;
  jahresmiete: number;
  annuitaetGezahlt: number;
  cashflowJahr: number;
  kumulierterCashflow: number;
}

export function computeSteadyStateCashflow(params: {
  kaltmiete: number;
  kostenMonat: number;
  annuitaetMonat: number;
}): { cashflowMonat: number; cashflowJahr: number } {
  const cashflowMonat = params.kaltmiete - params.kostenMonat - params.annuitaetMonat;
  return { cashflowMonat, cashflowJahr: cashflowMonat * 12 };
}

export function computePostPayoffCashflow(params: {
  kaltmiete: number;
  kostenMonat: number;
}): { cashflowMonat: number; cashflowJahr: number } {
  const cashflowMonat = params.kaltmiete - params.kostenMonat;
  return { cashflowMonat, cashflowJahr: cashflowMonat * 12 };
}

export function buildCashflowSeries(params: {
  jahresmiete: number;
  kostenJahr: number;
  amortization: AmortizationYear[];
  mietsteigerungPa?: number;
}): CashflowYear[] {
  const series: CashflowYear[] = [];
  const wachstum = (params.mietsteigerungPa ?? 0) / 100;
  let kumuliert = 0;

  for (const a of params.amortization) {
    const jahresmieteJahr = params.jahresmiete * Math.pow(1 + wachstum, a.jahr - 1);
    const cashflowJahr = jahresmieteJahr - params.kostenJahr - a.annuitaetGezahlt;
    kumuliert += cashflowJahr;
    series.push({
      jahr: a.jahr,
      jahresmiete: jahresmieteJahr,
      annuitaetGezahlt: a.annuitaetGezahlt,
      cashflowJahr,
      kumulierterCashflow: kumuliert,
    });
  }

  return series;
}
