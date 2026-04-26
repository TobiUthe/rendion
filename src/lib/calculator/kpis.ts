import type { AmortizationYear } from "./loan";
import type { CashflowYear } from "./cashflow";
import type { AppreciationYear } from "./appreciation";

export type VerdictLevel = "good" | "mixed" | "risky";

export function computeRenditen(params: {
  jahresmiete: number;
  kaufpreis: number;
  kostenJahr: number;
  eigenkapital: number;
  cashflowJahr: number;
  annuitaetJahr: number;
}): {
  bruttoRendite: number;
  nettoRendite: number;
  capRate: number;
  eigenkapitalRendite: number;
  dscr: number;
} {
  const { jahresmiete, kaufpreis, kostenJahr, eigenkapital, cashflowJahr, annuitaetJahr } = params;
  const bruttoRendite = (jahresmiete / kaufpreis) * 100;
  const nettoRendite = ((jahresmiete - kostenJahr) / kaufpreis) * 100;
  const capRate = nettoRendite;
  const eigenkapitalRendite = eigenkapital > 0 ? (cashflowJahr / eigenkapital) * 100 : 0;
  const dscr = annuitaetJahr > 0 ? (jahresmiete - kostenJahr) / annuitaetJahr : 0;
  return { bruttoRendite, nettoRendite, capRate, eigenkapitalRendite, dscr };
}

export function computeVermoegen10(params: {
  amortization: AmortizationYear[];
  cashflow: CashflowYear[];
  appreciation: AppreciationYear[];
  nebenkostenTotal: number;
}): { vermoegen10: number; immobilienwert10: number; restschuld10: number; kumulativerCashflow10: number } {
  const idx = Math.min(10, params.amortization.length) - 1;
  const restschuld10 = params.amortization[idx]?.restschuld ?? 0;
  const immobilienwert10 = params.appreciation[idx]?.immobilienwert ?? 0;
  const kumulativerCashflow10 = params.cashflow[idx]?.kumulierterCashflow ?? 0;
  const vermoegen10 =
    immobilienwert10 - restschuld10 + kumulativerCashflow10 - params.nebenkostenTotal;
  return { vermoegen10, immobilienwert10, restschuld10, kumulativerCashflow10 };
}

export function deriveVerdict(params: {
  kaufpreisfaktor: number;
  cashflowMonat: number;
}): { level: VerdictLevel; label: string } {
  if (params.kaufpreisfaktor <= 22 && params.cashflowMonat >= 0) {
    return { level: "good", label: "Attraktive Rendite" };
  }
  if (params.kaufpreisfaktor >= 32 || params.cashflowMonat < -200) {
    return { level: "risky", label: "Hohes Risiko" };
  }
  return { level: "mixed", label: "Gemischtes Bild" };
}
