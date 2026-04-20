import { quickCalcKapitalanlage } from "@/lib/calculator/quick-calc";
import { DEMO_INPUT } from "@/lib/calculator/defaults";
import type { ProjectionRow } from "@/lib/schemas/calculator-output";
import type { WaterfallItem } from "@/components/charts/d3/WaterfallChart";

export interface MockKpi {
  label: string;
  value: string;
  color: "green" | "yellow" | "red" | null;
}

export interface MockAnalysis {
  id: string;
  title: string;
  address: string;
  createdAt: string;
  verdict: { level: "good" | "mixed" | "risky"; label: string };
  kaufpreis: number;
  kaltmiete: number;
  eigenkapital: number;
  kaufnebenkosten: number;
  kpis: MockKpi[];
  projection: ProjectionRow[];
  cashflowWaterfall: WaterfallItem[];
}

const demo = quickCalcKapitalanlage(DEMO_INPUT)!;
const firstYear = demo.projection[0];

const cashflowWaterfall: WaterfallItem[] = [
  {
    label: "Kaltmiete",
    value: firstYear.einnahmen / 12,
    description: "Monatliche Mieteinnahmen",
  },
  {
    label: "Nebenkosten",
    value: -(firstYear.ausgabenOhneDarlehen / 12),
    description: "Nicht umlagefähige Kosten",
  },
  {
    label: "Annuität",
    value: -(firstYear.annuitaet / 12),
    description: "Kapitaldienst",
  },
  {
    label: "Cashflow",
    value: firstYear.cashflowNachSteuer / 12,
    isTotal: true,
  },
];

export const MOCK_ANALYSIS: MockAnalysis = {
  id: "demo-001",
  title: "Altbauapartment Berlin-Prenzlauer Berg",
  address: "Kastanienallee 47, 10119 Berlin",
  createdAt: "2026-04-15",
  verdict: { level: "good", label: "Attraktive Rendite" },
  kaufpreis: DEMO_INPUT.kaufpreis,
  kaltmiete: DEMO_INPUT.kaltmiete,
  eigenkapital: DEMO_INPUT.eigenkapital,
  kaufnebenkosten: demo.nebenkostenTotal,
  kpis: [
    { label: "Bruttorendite", value: "3,79 %", color: "yellow" },
    { label: "Nettorendite", value: "2,41 %", color: "yellow" },
    { label: "Cashflow / Monat", value: "+148 €", color: "green" },
    { label: "Kaufpreisfaktor", value: "26,4×", color: "yellow" },
    { label: "Eigenkapitalrendite", value: "7,2 %", color: "green" },
    { label: "Cap Rate", value: "3,1 %", color: "yellow" },
    { label: "DSCR", value: "1,18", color: "green" },
    { label: "Tilgungsdauer", value: "28 Jahre", color: "yellow" },
    { label: "Vermögen 10 J.", value: "142.300 €", color: "green" },
  ],
  projection: demo.projection,
  cashflowWaterfall,
};
