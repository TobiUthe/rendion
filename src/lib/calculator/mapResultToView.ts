import { computePostPayoffCashflow } from "./cashflow";
import { deriveVerdict, type VerdictLevel } from "./kpis";
import { formatEuro, formatPercent, formatFactor, formatNumber, formatDelta } from "@/lib/format";
import type { QuickCalcInput } from "@/lib/schemas/calculator";
import type { QuickCalcKapitalanlageResult } from "./quick-calc";
import type { ProjectionRow, TilgungsplanRow } from "@/lib/schemas/calculator-output";

type KpiColor = "green" | "yellow" | "red" | null;

export interface KpiItem {
  label: string;
  value: string;
  color: KpiColor;
}

export interface WaterfallItem {
  label: string;
  value: number;
  isTotal?: boolean;
  description?: string;
}

export interface WaterfallMeta {
  timeframeLabel: string;
  postPayoffNote?: string;
}

export type { VerdictLevel };

export interface ErgebnisView {
  kpis: KpiItem[];
  projection: ProjectionRow[];
  tilgungsplan: TilgungsplanRow[];
  waterfall: WaterfallItem[];
  waterfallMeta: WaterfallMeta;
  verdict: { level: VerdictLevel; label: string };
  title: string;
  subtitle: string;
  kaufnebenkosten: number;
}

// Local aliases — thin wrappers so call sites below stay readable.
const EURO = (n: number) => formatDelta(n, formatEuro);
const EURO_PLAIN = (n: number) => formatEuro(n);
const PERCENT = (n: number) => formatPercent(n, { decimals: 2 });
const FACTOR = (n: number) => formatFactor(n, { decimals: 1 });

export function mapResultToView(
  input: QuickCalcInput,
  result: QuickCalcKapitalanlageResult,
): ErgebnisView {
  const { kaufpreis, kaltmiete, eigenkapital } = input;

  const kaufpreisfaktorColor: KpiColor =
    result.kaufpreisfaktor < 20 ? "green" : result.kaufpreisfaktor <= 28 ? "yellow" : "red";
  const cashflowColor: KpiColor = result.cashflowMonat >= 0 ? "green" : "red";
  const bruttoColor: KpiColor =
    result.bruttoRendite >= 4 ? "green" : result.bruttoRendite >= 3 ? "yellow" : "red";
  const nettoColor: KpiColor =
    result.nettoRendite >= 3 ? "green" : result.nettoRendite >= 2 ? "yellow" : "red";
  const ekColor: KpiColor =
    result.eigenkapitalRendite >= 6 ? "green" : result.eigenkapitalRendite >= 3 ? "yellow" : "red";
  const dscrColor: KpiColor =
    result.dscr >= 1.2 ? "green" : result.dscr >= 1 ? "yellow" : "red";
  const tilgColor: KpiColor =
    result.tilgungsdauerJahre <= 25 ? "green" : result.tilgungsdauerJahre <= 35 ? "yellow" : "red";
  const vermoegenColor: KpiColor = result.vermoegen10 > 0 ? "green" : "red";

  const kpis: KpiItem[] = [
    { label: "Bruttorendite", value: PERCENT(result.bruttoRendite), color: bruttoColor },
    { label: "Nettorendite", value: PERCENT(result.nettoRendite), color: nettoColor },
    { label: "Cashflow / Monat", value: EURO(result.cashflowMonat), color: cashflowColor },
    { label: "Kaufpreisfaktor", value: FACTOR(result.kaufpreisfaktor), color: kaufpreisfaktorColor },
    {
      label: "Eigenkapitalrendite",
      value: eigenkapital > 0 ? PERCENT(result.eigenkapitalRendite) : "—",
      color: eigenkapital > 0 ? ekColor : null,
    },
    { label: "Cap Rate", value: PERCENT(result.capRate), color: nettoColor },
    { label: "DSCR", value: formatNumber(result.dscr, { decimals: 2 }), color: dscrColor },
    {
      label: "Tilgungsdauer",
      value: result.tilgungsdauerJahre >= 60 ? "> 60 Jahre" : `${result.tilgungsdauerJahre} Jahre`,
      color: tilgColor,
    },
    { label: "Vermögen 10 J.", value: EURO_PLAIN(result.vermoegen10), color: vermoegenColor },
  ];

  const waterfall: WaterfallItem[] = [
    { label: "Kaltmiete", value: kaltmiete, description: "Monatliche Mieteinnahmen" },
    {
      label: "Nebenkosten",
      value: -result.kostenMonat,
      description: "Nicht umlagefähig, Grundsteuer, Instandhaltung, Verwaltung",
    },
    {
      label: "Annuität",
      value: -result.annuitaetMonat,
      description: `${formatPercent(input.zinssatzPa + input.tilgungPa, { decimals: 2 })} p.a. auf ${EURO_PLAIN(result.darlehenssumme)}`,
    },
    { label: "Cashflow", value: result.cashflowMonat, isTotal: true },
  ];

  const waterfallMeta = buildWaterfallMeta({
    tilgungsdauerJahre: result.tilgungsdauerJahre,
    kaltmiete,
    kostenMonat: result.kostenMonat,
    projectionYears: input.projectionYears,
  });

  const verdict = deriveVerdict({
    kaufpreisfaktor: result.kaufpreisfaktor,
    cashflowMonat: result.cashflowMonat,
  });

  const title = `Analyse · ${EURO_PLAIN(kaufpreis)} · ${EURO_PLAIN(kaltmiete)} Kaltmiete`;
  const subtitle = `Eigenkapital ${EURO_PLAIN(eigenkapital)} · Darlehen ${EURO_PLAIN(result.darlehenssumme)} · 10 J. Vermögen ${EURO_PLAIN(result.vermoegen10)}`;

  return {
    kpis,
    projection: result.projection,
    tilgungsplan: result.tilgungsplan,
    waterfall,
    waterfallMeta,
    verdict,
    title,
    subtitle,
    kaufnebenkosten: result.nebenkostenTotal,
  };
}

function buildWaterfallMeta(params: {
  tilgungsdauerJahre: number;
  kaltmiete: number;
  kostenMonat: number;
  projectionYears: number;
}): WaterfallMeta {
  const { tilgungsdauerJahre, kaltmiete, kostenMonat, projectionYears } = params;
  const horizon = projectionYears;
  const endJahr = Math.min(tilgungsdauerJahre || horizon, horizon);
  const hasPayoffWithinHorizon =
    tilgungsdauerJahre > 0 && tilgungsdauerJahre <= horizon;

  const timeframeLabel = hasPayoffWithinHorizon
    ? `Tilgungsphase · Jahr 1–${endJahr}`
    : `Tilgungsphase · Jahr 1–${horizon}+`;

  let postPayoffNote: string | undefined;
  if (hasPayoffWithinHorizon) {
    const post = computePostPayoffCashflow({ kaltmiete, kostenMonat });
    postPayoffNote = `Ab Jahr ${endJahr + 1} entfällt die Annuität — Cashflow steigt auf ${EURO(post.cashflowMonat)} / Monat.`;
  }

  return { timeframeLabel, postPayoffNote };
}
