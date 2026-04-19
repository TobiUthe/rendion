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

export type VerdictLevel = "good" | "mixed" | "risky";

export interface ErgebnisView {
  kpis: KpiItem[];
  projection: ProjectionRow[];
  tilgungsplan: TilgungsplanRow[];
  waterfall: WaterfallItem[];
  verdict: { level: VerdictLevel; label: string };
  title: string;
  subtitle: string;
  kaufnebenkosten: number;
}

const EURO = (n: number) =>
  (n >= 0 ? "+" : "−") + Math.abs(Math.round(n)).toLocaleString("de-DE") + " €";

const EURO_PLAIN = (n: number) =>
  Math.round(n).toLocaleString("de-DE") + " €";

const PERCENT = (n: number) => n.toFixed(2).replace(".", ",") + " %";

const FACTOR = (n: number) => n.toFixed(1).replace(".", ",") + "×";

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
    { label: "DSCR", value: result.dscr.toFixed(2).replace(".", ","), color: dscrColor },
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
      description: "Nicht umlagefähige Kosten (≈ 30 % der Kaltmiete)",
    },
    {
      label: "Annuität",
      value: -result.annuitaetMonat,
      description: `${Math.round((result.annuitaetMonat * 12) / result.darlehenssumme * 100 * 10) / 10 || 0} % p.a. auf ${EURO_PLAIN(result.darlehenssumme)}`,
    },
    { label: "Cashflow", value: result.cashflowMonat, isTotal: true },
  ];

  const verdict = deriveVerdict(result);

  const title = `Analyse · ${EURO_PLAIN(kaufpreis)} · ${EURO_PLAIN(kaltmiete)} Kaltmiete`;
  const subtitle = `Eigenkapital ${EURO_PLAIN(eigenkapital)} · Darlehen ${EURO_PLAIN(result.darlehenssumme)} · 10 J. Vermögen ${EURO_PLAIN(result.vermoegen10)}`;

  return {
    kpis,
    projection: result.projection,
    tilgungsplan: result.tilgungsplan,
    waterfall,
    verdict,
    title,
    subtitle,
    kaufnebenkosten: result.nebenkostenTotal,
  };
}

function deriveVerdict(r: QuickCalcKapitalanlageResult): { level: VerdictLevel; label: string } {
  if (r.kaufpreisfaktor <= 22 && r.cashflowMonat >= 0) {
    return { level: "good", label: "Attraktive Rendite" };
  }
  if (r.kaufpreisfaktor >= 32 || r.cashflowMonat < -200) {
    return { level: "risky", label: "Hohes Risiko" };
  }
  return { level: "mixed", label: "Gemischtes Bild" };
}
