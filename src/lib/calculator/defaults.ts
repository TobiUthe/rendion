import type {
  QuickCalcBasisdaten,
  QuickCalcInput,
  QuickCalcParameters,
} from "@/lib/schemas/calculator";

export const QUICK_DEFAULTS: QuickCalcParameters = {
  // Kaufnebenkosten
  grunderwerbsteuerSatz: 3.5,
  maklerSatz: 3.57,
  notarSatz: 1.5,
  grundbuchSatz: 0.5,
  // Finanzierung
  zinssatzPa: 3.5,
  tilgungPa: 2,
  zinsbindung: 10,
  // Nebenkosten (€/Monat)
  nichtUmlagefaehig: 40,
  grundsteuerMonat: 50,
  instandhaltungsruecklageMonat: 60,
  verwaltungskostenMonat: 25,
  // Steuern & Prognosen (%)
  grenzsteuersatz: 42,
  afaSatz: 2,
  mietsteigerungPa: 1.5,
  wertsteigerungPa: 1.5,
  leerstandsquote: 2,
  // Projection horizon (Jahre)
  projectionYears: 30,
};

export const DEMO_BASISDATEN: QuickCalcBasisdaten = {
  kaufpreis: 380000,
  kaltmiete: 1200,
  eigenkapital: 95000,
};

export function withDefaults(
  basisdaten: QuickCalcBasisdaten,
  overrides?: Partial<QuickCalcParameters>,
): QuickCalcInput {
  return { ...QUICK_DEFAULTS, ...overrides, ...basisdaten };
}

export const DEMO_INPUT: QuickCalcInput = withDefaults(DEMO_BASISDATEN);
