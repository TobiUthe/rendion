"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/umami";

export function CalculatorTeaser() {
  const router = useRouter();
  const [kaufpreis, setKaufpreis] = useState("380000");
  const [kaltmiete, setKaltmiete] = useState("1200");
  const [eigenkapital, setEigenkapital] = useState("95000");
  const [hasError, setHasError] = useState(false);

  const handleCalculate = () => {
    const kp = parseFloat(kaufpreis);
    const km = parseFloat(kaltmiete);
    const ek = parseFloat(eigenkapital);

    if (!kp || kp <= 0 || !km || km <= 0 || !ek || ek < 0) {
      setHasError(true);
      trackEvent("quick_calc_error");
      return;
    }
    const rendite = ((km * 12) / kp) * 100;
    trackEvent("quick_calc_submit", { bruttoRendite: Math.round(rendite * 10) / 10 });
    router.push("/ergebnis");
  };

  const bruttorendite =
    kaufpreis && kaltmiete
      ? ((parseFloat(kaltmiete) * 12) / parseFloat(kaufpreis) * 100).toFixed(2)
      : null;

  return (
    <div className="rounded-xl border border-sand-200 bg-white shadow-sm px-6 py-8 max-w-md mx-auto">
      <h3 className="font-display text-xl font-semibold text-neutral-900 mb-4">
        Rendite schnell berechnen
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Kaufpreis (€)
          </label>
          <input
            type="number"
            value={kaufpreis}
            onChange={(e) => {
              setKaufpreis(e.target.value);
              setHasError(false);
            }}
            placeholder="380000"
            className="w-full font-mono tabular-nums transition-colors duration-150 rounded-lg border border-sand-200 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Monatliche Kaltmiete (€)
          </label>
          <input
            type="number"
            value={kaltmiete}
            onChange={(e) => {
              setKaltmiete(e.target.value);
              setHasError(false);
            }}
            placeholder="1200"
            className="w-full font-mono tabular-nums transition-colors duration-150 rounded-lg border border-sand-200 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Eigenkapital (€)
          </label>
          <input
            type="number"
            value={eigenkapital}
            onChange={(e) => {
              setEigenkapital(e.target.value);
              setHasError(false);
            }}
            placeholder="95000"
            className="w-full font-mono tabular-nums transition-colors duration-150 rounded-lg border border-sand-200 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
          />
        </div>
      </div>

      {hasError && (
        <p className="text-xs text-danger-600 mt-4 text-center">
          Bitte alle Felder korrekt ausfüllen.
        </p>
      )}

      {bruttorendite && (
        <div className="mt-4 rounded-lg border border-sand-200 bg-sand-50 px-4 py-3">
          <p className="text-xs text-neutral-500">Geschätzte Bruttorendite</p>
          <p className="font-mono text-lg font-bold text-primary-600 tabular-nums">
            {bruttorendite.replace(".", ",")} %
          </p>
        </div>
      )}

      <Button
        className="w-full mt-6"
        variant="primary"
        size="md"
        onClick={handleCalculate}
      >
        Rendite berechnen
      </Button>

      <p className="text-xs text-neutral-400 text-center mt-4">
        Kostenlos · Keine Anmeldung erforderlich
      </p>
    </div>
  );
}
