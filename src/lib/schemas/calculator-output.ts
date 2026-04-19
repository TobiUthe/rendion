export interface TilgungsplanRow {
  jahr: number;
  annuitaet: number;
  zinsanteil: number;
  tilgungsanteil: number;
  sondertilgung: number;
  restschuld: number;
}

export interface ProjectionRow {
  jahr: number;
  einnahmen: number;
  ausgabenOhneDarlehen: number;
  annuitaet: number;
  cashflowVorSteuer: number;
  cashflowNachSteuer: number;
  steuerersparnis: number;
  kumulierterCashflow: number;
  immobilienwert: number;
  restschuld: number;
  eigenkapitalAufbau: number;
  getilgterBetrag: number;
  wertzuwachs: number;
}
