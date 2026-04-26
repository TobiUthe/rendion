export interface AmortizationYear {
  jahr: number;
  zins: number;
  tilgung: number;
  annuitaetGezahlt: number;
  restschuld: number;
  kumulativeTilgung: number;
}

export function computeAnnuity(
  darlehenssumme: number,
  zinssatzPa: number,
  tilgungPa: number,
): number {
  return (darlehenssumme * (zinssatzPa + tilgungPa)) / 100;
}

export function buildAmortizationSchedule(params: {
  darlehenssumme: number;
  annuitaetJahr: number;
  zinssatzPa: number;
  years: number;
}): AmortizationYear[] {
  const { darlehenssumme, annuitaetJahr, zinssatzPa, years } = params;
  const schedule: AmortizationYear[] = [];
  let restschuld = darlehenssumme;
  let kumulativeTilgung = 0;

  for (let j = 1; j <= years; j++) {
    const zins = restschuld > 0 ? restschuld * (zinssatzPa / 100) : 0;
    const tilgung = restschuld > 0 ? Math.min(annuitaetJahr - zins, restschuld) : 0;
    const annuitaetGezahlt = zins + tilgung;
    restschuld = Math.max(0, restschuld - tilgung);
    kumulativeTilgung += tilgung;

    schedule.push({ jahr: j, zins, tilgung, annuitaetGezahlt, restschuld, kumulativeTilgung });
  }

  return schedule;
}

export function estimateTilgungsdauer(
  darlehen: number,
  annuitaetJahr: number,
  zinssatzPa: number,
): number {
  if (darlehen <= 0 || annuitaetJahr <= 0) return 0;
  let rest = darlehen;
  for (let j = 1; j <= 60; j++) {
    const zins = rest * (zinssatzPa / 100);
    const tilgung = Math.min(annuitaetJahr - zins, rest);
    rest -= tilgung;
    if (rest <= 0) return j;
  }
  return 60;
}
