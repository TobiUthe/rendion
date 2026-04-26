export interface AppreciationYear {
  jahr: number;
  wertzuwachs: number;
  immobilienwert: number;
}

/** `wertsteigerungPa` is a percent (e.g. 1.5 → 1.5 % p.a.). */
export function computeWertzuwachs(
  kaufpreis: number,
  wertsteigerungPa: number,
  jahr: number,
): number {
  const rate = wertsteigerungPa / 100;
  return kaufpreis * (Math.pow(1 + rate, jahr) - 1);
}

export function buildAppreciationSeries(
  kaufpreis: number,
  wertsteigerungPa: number,
  years: number,
): AppreciationYear[] {
  const series: AppreciationYear[] = [];
  for (let j = 1; j <= years; j++) {
    const wertzuwachs = computeWertzuwachs(kaufpreis, wertsteigerungPa, j);
    series.push({ jahr: j, wertzuwachs, immobilienwert: kaufpreis + wertzuwachs });
  }
  return series;
}
