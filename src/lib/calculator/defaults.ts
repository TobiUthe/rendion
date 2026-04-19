export const QUICK_DEFAULTS = {
  zinssatzPa: 4.5,
  tilgungPa: 2,
  operatingCostRate: 0.3,
  wertsteigerungPa: 0.015,
  nebenkostenFaktor: 0.1,
  projectionYears: 30,
} as const;

export const DEMO_INPUT = {
  kaufpreis: 380000,
  kaltmiete: 1200,
  eigenkapital: 95000,
} as const;
