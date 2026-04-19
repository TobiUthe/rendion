export interface QuickCalcInput {
  kaufpreis: number;
  kaltmiete: number;
  eigenkapital: number;
}

export function isValidQuickCalcInput(input: Partial<QuickCalcInput>): input is QuickCalcInput {
  return (
    typeof input.kaufpreis === "number" &&
    input.kaufpreis > 0 &&
    typeof input.kaltmiete === "number" &&
    input.kaltmiete > 0 &&
    typeof input.eigenkapital === "number" &&
    input.eigenkapital >= 0
  );
}
