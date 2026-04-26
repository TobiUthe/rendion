import { z } from "zod";

export interface QuickCalcBasisdaten {
  kaufpreis: number;
  kaltmiete: number;
  eigenkapital: number;
}

export interface QuickCalcParameters {
  // Kaufnebenkosten — percent of Kaufpreis
  grunderwerbsteuerSatz: number;
  maklerSatz: number;
  notarSatz: number;
  grundbuchSatz: number;
  // Finanzierung
  zinssatzPa: number;
  tilgungPa: number;
  zinsbindung: number;
  // Nebenkosten — EUR per month
  nichtUmlagefaehig: number;
  grundsteuerMonat: number;
  instandhaltungsruecklageMonat: number;
  verwaltungskostenMonat: number;
  // Steuern & Prognosen — percent
  grenzsteuersatz: number;
  afaSatz: number;
  mietsteigerungPa: number;
  wertsteigerungPa: number;
  leerstandsquote: number;
  // Projection horizon — years
  projectionYears: number;
}

export type QuickCalcInput = QuickCalcBasisdaten & QuickCalcParameters;

export function isValidBasisdaten(
  input: Partial<QuickCalcBasisdaten>,
): input is QuickCalcBasisdaten {
  return (
    typeof input.kaufpreis === "number" &&
    input.kaufpreis > 0 &&
    typeof input.kaltmiete === "number" &&
    input.kaltmiete > 0 &&
    typeof input.eigenkapital === "number" &&
    input.eigenkapital >= 0
  );
}

export const isValidQuickCalcInput = isValidBasisdaten;

const nonNegative = z.number().finite().nonnegative();
const percent = z.number().finite().min(0).max(100);

export const quickCalcInputSchema = z.object({
  kaufpreis: z.number().finite().positive(),
  kaltmiete: z.number().finite().positive(),
  eigenkapital: nonNegative,
  grunderwerbsteuerSatz: percent,
  maklerSatz: percent,
  notarSatz: percent,
  grundbuchSatz: percent,
  zinssatzPa: percent,
  tilgungPa: percent,
  zinsbindung: z.number().int().min(1).max(50),
  nichtUmlagefaehig: nonNegative,
  grundsteuerMonat: nonNegative,
  instandhaltungsruecklageMonat: nonNegative,
  verwaltungskostenMonat: nonNegative,
  grenzsteuersatz: percent,
  afaSatz: percent,
  mietsteigerungPa: percent,
  wertsteigerungPa: percent,
  leerstandsquote: percent,
  projectionYears: z.number().int().min(1).max(60),
});
