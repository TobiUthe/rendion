import { QUICK_DEFAULTS } from "./defaults";
import type { QuickCalcInput } from "@/lib/schemas/calculator";
import type { ProjectionRow, TilgungsplanRow } from "@/lib/schemas/calculator-output";

export interface QuickCalcKapitalanlageResult {
  kaufpreisfaktor: number;
  jahresmiete: number;
  cashflowMonat: number;
  cashflowJahr: number;
  annuitaetJahr: number;
  annuitaetMonat: number;
  kostenMonat: number;
  vermoegen10: number;
  kumulativeTilgung: number;
  kumulativerCashflow: number;
  wertsteigerung: number;
  immobilienwert10: number;
  restschuld10: number;
  darlehenssumme: number;
  nebenkostenTotal: number;
  bruttoRendite: number;
  nettoRendite: number;
  eigenkapitalRendite: number;
  capRate: number;
  dscr: number;
  tilgungsdauerJahre: number;
  projection: ProjectionRow[];
  tilgungsplan: TilgungsplanRow[];
}

/**
 * Investor quick-check. Returns null for invalid input; callers should gate on that.
 */
export function quickCalcKapitalanlage(input: QuickCalcInput): QuickCalcKapitalanlageResult | null {
  const { kaufpreis, kaltmiete, eigenkapital } = input;
  if (kaufpreis <= 0 || kaltmiete <= 0) return null;

  const { zinssatzPa, tilgungPa, operatingCostRate, wertsteigerungPa, nebenkostenFaktor, projectionYears } =
    QUICK_DEFAULTS;

  const darlehenssumme = Math.max(0, kaufpreis - eigenkapital);
  const annuitaetJahr = (darlehenssumme * (zinssatzPa + tilgungPa)) / 100;
  const annuitaetMonat = annuitaetJahr / 12;
  const kostenMonat = kaltmiete * operatingCostRate;
  const kostenJahr = kostenMonat * 12;

  const cashflowMonat = kaltmiete - kostenMonat - annuitaetMonat;
  const cashflowJahr = cashflowMonat * 12;

  const jahresmiete = kaltmiete * 12;
  const kaufpreisfaktor = jahresmiete > 0 ? kaufpreis / jahresmiete : 0;

  const bruttoRendite = (jahresmiete / kaufpreis) * 100;
  const nettoRendite = ((jahresmiete - kostenJahr) / kaufpreis) * 100;
  const capRate = ((jahresmiete - kostenJahr) / kaufpreis) * 100;
  const eigenkapitalRendite =
    eigenkapital > 0 ? (cashflowJahr / eigenkapital) * 100 : 0;
  const dscr = annuitaetJahr > 0 ? (jahresmiete - kostenJahr) / annuitaetJahr : 0;

  const nebenkostenTotal = kaufpreis * nebenkostenFaktor;

  const tilgungsplan: TilgungsplanRow[] = [];
  const projection: ProjectionRow[] = [];
  let restschuld = darlehenssumme;
  let kumulativeTilgung = 0;
  let kumulativerCashflow = 0;
  let restschuld10 = darlehenssumme;

  for (let j = 1; j <= projectionYears; j++) {
    const zins = restschuld * (zinssatzPa / 100);
    const tilgung = Math.min(annuitaetJahr - zins, restschuld);
    restschuld = Math.max(0, restschuld - tilgung);
    kumulativeTilgung += tilgung;
    kumulativerCashflow += cashflowJahr;

    const wertzuwachs = kaufpreis * (Math.pow(1 + wertsteigerungPa, j) - 1);
    const immobilienwert = kaufpreis + wertzuwachs;

    if (j === 10) restschuld10 = restschuld;

    tilgungsplan.push({
      jahr: j,
      annuitaet: annuitaetJahr,
      zinsanteil: zins,
      tilgungsanteil: tilgung,
      sondertilgung: 0,
      restschuld,
    });

    projection.push({
      jahr: j,
      einnahmen: jahresmiete,
      ausgabenOhneDarlehen: kostenJahr,
      annuitaet: annuitaetJahr,
      cashflowVorSteuer: cashflowJahr,
      cashflowNachSteuer: cashflowJahr,
      steuerersparnis: 0,
      kumulierterCashflow: kumulativerCashflow,
      immobilienwert,
      restschuld,
      eigenkapitalAufbau: immobilienwert - restschuld - (kaufpreis - darlehenssumme),
      getilgterBetrag: kumulativeTilgung,
      wertzuwachs,
    });
  }

  const wertsteigerung10 = kaufpreis * (Math.pow(1 + wertsteigerungPa, 10) - 1);
  const immobilienwert10 = kaufpreis + wertsteigerung10;
  const kumulativerCashflow10 = cashflowJahr * 10;
  const vermoegen10 = immobilienwert10 - restschuld10 + kumulativerCashflow10 - nebenkostenTotal;

  // Tilgungsdauer: years until restschuld reaches 0 under current annuity.
  const tilgungsdauerJahre = estimateTilgungsdauer(darlehenssumme, annuitaetJahr, zinssatzPa);

  return {
    kaufpreisfaktor,
    jahresmiete,
    cashflowMonat,
    cashflowJahr,
    annuitaetJahr,
    annuitaetMonat,
    kostenMonat,
    vermoegen10,
    kumulativeTilgung,
    kumulativerCashflow,
    wertsteigerung: wertsteigerung10,
    immobilienwert10,
    restschuld10,
    darlehenssumme,
    nebenkostenTotal,
    bruttoRendite,
    nettoRendite,
    eigenkapitalRendite,
    capRate,
    dscr,
    tilgungsdauerJahre,
    projection,
    tilgungsplan,
  };
}

function estimateTilgungsdauer(darlehen: number, annuitaetJahr: number, zinssatzPa: number): number {
  if (darlehen <= 0 || annuitaetJahr <= 0) return 0;
  let rest = darlehen;
  for (let j = 1; j <= 60; j++) {
    const zins = rest * (zinssatzPa / 100);
    const tilgung = Math.min(annuitaetJahr - zins, rest);
    rest -= tilgung;
    if (rest <= 0) return j;
  }
  return 60;
}
