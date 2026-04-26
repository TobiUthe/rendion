export interface DashboardAnalysisSummary {
  id: string;
  title: string;
  address: string;
  createdAt: string;
  verdict: { level: "good" | "mixed" | "risky"; label: string };
  kaufpreis: number;
  kaltmiete: number;
  eigenkapital: number;
  bruttorenditePct: number;
  cashflowMonat: number;
}

export const MOCK_DASHBOARD_ANALYSES: DashboardAnalysisSummary[] = [
  {
    id: "demo-001",
    title: "Altbauapartment Berlin-Prenzlauer Berg",
    address: "Kastanienallee 47, 10119 Berlin",
    createdAt: "2026-04-15",
    verdict: { level: "good", label: "Attraktive Rendite" },
    kaufpreis: 380000,
    kaltmiete: 1200,
    eigenkapital: 95000,
    bruttorenditePct: 3.79,
    cashflowMonat: 148,
  },
  {
    id: "demo-002",
    title: "Neubauwohnung München-Maxvorstadt",
    address: "Theresienstr. 12, 80333 München",
    createdAt: "2026-04-10",
    verdict: { level: "mixed", label: "Gemischtes Bild" },
    kaufpreis: 680000,
    kaltmiete: 1850,
    eigenkapital: 170000,
    bruttorenditePct: 3.26,
    cashflowMonat: -82,
  },
  {
    id: "demo-003",
    title: "Mehrfamilienhaus Leipzig-Gohlis",
    address: "Landsberger Str. 88, 04157 Leipzig",
    createdAt: "2026-04-05",
    verdict: { level: "good", label: "Sehr attraktiv" },
    kaufpreis: 420000,
    kaltmiete: 2400,
    eigenkapital: 105000,
    bruttorenditePct: 6.86,
    cashflowMonat: 612,
  },
];
