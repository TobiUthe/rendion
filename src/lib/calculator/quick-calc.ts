import { buildAmortizationSchedule, computeAnnuity, estimateTilgungsdauer } from "./loan";
import { buildCashflowSeries, computeSteadyStateCashflow } from "./cashflow";
import { buildAppreciationSeries } from "./appreciation";
import { computeRenditen, computeVermoegen10 } from "./kpis";
import type { QuickCalcInput } from "@/lib/schemas/calculator";
import type { ProjectionRow, TilgungsplanRow } from "@/lib/schemas/calculator-output";

const GEBAEUDEANTEIL = 0.8;

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

export function quickCalcKapitalanlage(input: QuickCalcInput): QuickCalcKapitalanlageResult | null {
  const {
    kaufpreis,
    kaltmiete,
    eigenkapital,
    grunderwerbsteuerSatz,
    maklerSatz,
    notarSatz,
    grundbuchSatz,
    zinssatzPa,
    tilgungPa,
    nichtUmlagefaehig,
    grundsteuerMonat,
    instandhaltungsruecklageMonat,
    verwaltungskostenMonat,
    grenzsteuersatz,
    afaSatz,
    mietsteigerungPa,
    wertsteigerungPa,
    projectionYears,
  } = input;

  if (kaufpreis <= 0 || kaltmiete <= 0) return null;

  const darlehenssumme = Math.max(0, kaufpreis - eigenkapital);
  const annuitaetJahr = computeAnnuity(darlehenssumme, zinssatzPa, tilgungPa);
  const annuitaetMonat = annuitaetJahr / 12;

  const kostenMonat =
    nichtUmlagefaehig + grundsteuerMonat + instandhaltungsruecklageMonat + verwaltungskostenMonat;
  const kostenJahr = kostenMonat * 12;
  const jahresmiete = kaltmiete * 12;
  const nebenkostenSatz = grunderwerbsteuerSatz + maklerSatz + notarSatz + grundbuchSatz;
  const nebenkostenTotal = (kaufpreis * nebenkostenSatz) / 100;

  const amortization = buildAmortizationSchedule({
    darlehenssumme,
    annuitaetJahr,
    zinssatzPa,
    years: projectionYears,
  });
  const appreciation = buildAppreciationSeries(kaufpreis, wertsteigerungPa, projectionYears);
  const cashflow = buildCashflowSeries({
    jahresmiete,
    kostenJahr,
    amortization,
    mietsteigerungPa,
  });

  const steady = computeSteadyStateCashflow({ kaltmiete, kostenMonat, annuitaetMonat });
  const renditen = computeRenditen({
    jahresmiete,
    kaufpreis,
    kostenJahr,
    eigenkapital,
    cashflowJahr: steady.cashflowJahr,
    annuitaetJahr,
  });
  const v10 = computeVermoegen10({ amortization, cashflow, appreciation, nebenkostenTotal });
  const tilgungsdauerJahre = estimateTilgungsdauer(darlehenssumme, annuitaetJahr, zinssatzPa);
  const kaufpreisfaktor = jahresmiete > 0 ? kaufpreis / jahresmiete : 0;

  const afaJahr = kaufpreis * GEBAEUDEANTEIL * (afaSatz / 100);
  const steuerSatz = grenzsteuersatz / 100;
  const eigenkapitalNetto = kaufpreis - darlehenssumme;

  const projection: ProjectionRow[] = amortization.map((a, i) => {
    const app = appreciation[i];
    const cf = cashflow[i];
    const steuerersparnis = Math.max(0, (a.zins + afaJahr) * steuerSatz);
    return {
      jahr: a.jahr,
      einnahmen: cf.jahresmiete,
      ausgabenOhneDarlehen: kostenJahr,
      annuitaet: a.annuitaetGezahlt,
      cashflowVorSteuer: cf.cashflowJahr,
      cashflowNachSteuer: cf.cashflowJahr + steuerersparnis,
      steuerersparnis,
      kumulierterCashflow: cf.kumulierterCashflow,
      immobilienwert: app.immobilienwert,
      restschuld: a.restschuld,
      eigenkapitalAufbau: app.immobilienwert - a.restschuld - eigenkapitalNetto,
      getilgterBetrag: a.kumulativeTilgung,
      wertzuwachs: app.wertzuwachs,
    };
  });

  const tilgungsplan: TilgungsplanRow[] = amortization.map((a) => ({
    jahr: a.jahr,
    annuitaet: a.annuitaetGezahlt,
    zinsanteil: a.zins,
    tilgungsanteil: a.tilgung,
    sondertilgung: 0,
    restschuld: a.restschuld,
  }));

  const kumulativeTilgung = amortization[amortization.length - 1]?.kumulativeTilgung ?? 0;
  const kumulativerCashflow = cashflow[cashflow.length - 1]?.kumulierterCashflow ?? 0;
  const wertsteigerung = appreciation[Math.min(10, appreciation.length) - 1]?.wertzuwachs ?? 0;

  return {
    kaufpreisfaktor,
    jahresmiete,
    cashflowMonat: steady.cashflowMonat,
    cashflowJahr: steady.cashflowJahr,
    annuitaetJahr,
    annuitaetMonat,
    kostenMonat,
    vermoegen10: v10.vermoegen10,
    kumulativeTilgung,
    kumulativerCashflow,
    wertsteigerung,
    immobilienwert10: v10.immobilienwert10,
    restschuld10: v10.restschuld10,
    darlehenssumme,
    nebenkostenTotal,
    bruttoRendite: renditen.bruttoRendite,
    nettoRendite: renditen.nettoRendite,
    eigenkapitalRendite: renditen.eigenkapitalRendite,
    capRate: renditen.capRate,
    dscr: renditen.dscr,
    tilgungsdauerJahre,
    projection,
    tilgungsplan,
  };
}
