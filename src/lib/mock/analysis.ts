export interface MockKpi {
  label: string;
  value: string;
  color: "green" | "yellow" | "red" | null;
}

export interface MockChartDataPoint {
  year: number;
  immobilienwert: number;
  eigenkapital: number;
  restschuld: number;
  kumulierterCashflow: number;
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
  kpis: MockKpi[];
  projection: MockChartDataPoint[];
  cashflowMonthly: { month: string; cashflow: number }[];
}

export const MOCK_ANALYSIS: MockAnalysis = {
  id: "demo-001",
  title: "Altbauapartment Berlin-Prenzlauer Berg",
  address: "Kastanienallee 47, 10119 Berlin",
  createdAt: "2026-04-15",
  verdict: { level: "good", label: "Attraktive Rendite" },
  kaufpreis: 380000,
  kaltmiete: 1200,
  eigenkapital: 95000,
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
  projection: [
    { year: 1, immobilienwert: 384800, eigenkapital: 99200, restschuld: 285600, kumulierterCashflow: 1776 },
    { year: 2, immobilienwert: 389700, eigenkapital: 103600, restschuld: 286100, kumulierterCashflow: 3552 },
    { year: 5, immobilienwert: 405000, eigenkapital: 118000, restschuld: 287000, kumulierterCashflow: 8880 },
    { year: 10, immobilienwert: 432000, eigenkapital: 142300, restschuld: 289700, kumulierterCashflow: 17760 },
    { year: 15, immobilienwert: 461000, eigenkapital: 172000, restschuld: 289000, kumulierterCashflow: 26640 },
    { year: 20, immobilienwert: 492000, eigenkapital: 210000, restschuld: 282000, kumulierterCashflow: 35520 },
    { year: 25, immobilienwert: 526000, eigenkapital: 263000, restschuld: 263000, kumulierterCashflow: 44400 },
    { year: 30, immobilienwert: 561000, eigenkapital: 381000, restschuld: 180000, kumulierterCashflow: 53280 },
  ],
  cashflowMonthly: [
    { month: "Jan", cashflow: 148 },
    { month: "Feb", cashflow: 148 },
    { month: "Mär", cashflow: 148 },
    { month: "Apr", cashflow: 148 },
    { month: "Mai", cashflow: 148 },
    { month: "Jun", cashflow: 148 },
    { month: "Jul", cashflow: 148 },
    { month: "Aug", cashflow: 148 },
    { month: "Sep", cashflow: 148 },
    { month: "Okt", cashflow: 148 },
    { month: "Nov", cashflow: 148 },
    { month: "Dez", cashflow: 148 },
  ],
};
