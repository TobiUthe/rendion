"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/ui/NumberInput";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import { quickCalcKapitalanlage } from "@/lib/calculator/quick-calc";
import { encodeQuickParams } from "@/lib/calculator/url-params";
import { DEMO_INPUT } from "@/lib/calculator/defaults";
import { isValidQuickCalcInput } from "@/lib/schemas/calculator";
import { trackEvent, bucketCashflow } from "@/lib/analytics/umami";

interface CalculatorProps {
  initial?: {
    kaufpreis?: number | null;
    kaltmiete?: number | null;
    eigenkapital?: number | null;
  };
  compact?: boolean;
}

export function Calculator({ initial, compact = false }: CalculatorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [kaufpreis, setKaufpreis] = useState<number | null>(initial?.kaufpreis ?? null);
  const [kaltmiete, setKaltmiete] = useState<number | null>(initial?.kaltmiete ?? null);
  const [eigenkapital, setEigenkapital] = useState<number | null>(initial?.eigenkapital ?? null);

  const candidate = { kaufpreis: kaufpreis ?? 0, kaltmiete: kaltmiete ?? 0, eigenkapital: eigenkapital ?? 0 };
  const isValid = isValidQuickCalcInput(candidate);

  const livePreview = useMemo(() => {
    if (!isValid) return null;
    return quickCalcKapitalanlage(candidate);
  }, [candidate, isValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    trackEvent("calculator_submit", {
      bruttoRendite: Math.round((livePreview?.bruttoRendite ?? 0) * 10) / 10,
      cashflowBucket: bucketCashflow(livePreview?.cashflowMonat ?? 0),
    });
    const qs = encodeQuickParams(candidate);
    startTransition(() => {
      router.push(`/ergebnis?${qs}`);
    });
  };

  const handleDemo = () => {
    trackEvent("calculator_demo_open");
    const qs = encodeQuickParams(DEMO_INPUT);
    startTransition(() => {
      router.push(`/ergebnis?${qs}`);
    });
  };

  return (
    <div className="relative">
      <RouteProgressBar active={pending} />
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-5 rounded-2xl border border-sand-200/80 bg-white/95 p-6 shadow-xl shadow-neutral-900/5 ring-1 ring-neutral-900/5 backdrop-blur-sm sm:p-7 ${
          compact ? "" : "lg:-rotate-[0.4deg] lg:transition-transform lg:duration-500 lg:hover:rotate-0"
        }`}
        noValidate
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-neutral-900">Rendite schnell berechnen</h3>
          <span className="rounded-full bg-pine-50 px-2 py-0.5 text-2xs font-medium text-pine-700">
            In 5 Sekunden
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <NumberInput
            label="Kaufpreis"
            value={kaufpreis}
            onChange={setKaufpreis}
            placeholder="380.000"
            suffix="€"
          />
          <NumberInput
            label="Monatliche Kaltmiete"
            value={kaltmiete}
            onChange={setKaltmiete}
            placeholder="1.200"
            suffix="€"
          />
          <NumberInput
            label="Eigenkapital"
            value={eigenkapital}
            onChange={setEigenkapital}
            placeholder="95.000"
            suffix="€"
          />
        </div>

        <LivePreview
          bruttoRendite={livePreview?.bruttoRendite ?? 0}
          kaufpreisfaktor={livePreview?.kaufpreisfaktor ?? 0}
          cashflowMonat={livePreview?.cashflowMonat ?? 0}
          hasData={Boolean(livePreview)}
        />

        <div className="flex flex-col gap-2">
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={!isValid || pending}>
            {pending ? "Ergebnis wird berechnet…" : "Ergebnis berechnen"}
          </Button>
          <p className="text-center text-xs text-neutral-500">
            Kostenlos · Ohne Anmeldung · DSGVO-konform
          </p>
        </div>

        <button
          type="button"
          onClick={handleDemo}
          className="text-center text-sm text-neutral-500 underline-offset-2 hover:text-neutral-700 hover:underline"
        >
          Demo-Analyse ansehen
        </button>
      </form>
    </div>
  );
}

interface LivePreviewProps {
  bruttoRendite: number;
  kaufpreisfaktor: number;
  cashflowMonat: number;
  hasData: boolean;
}

function LivePreview({ bruttoRendite, kaufpreisfaktor, cashflowMonat, hasData }: LivePreviewProps) {
  return (
    <div
      className={`rounded-xl border border-sand-200 bg-sand-50/70 px-4 py-3 transition-opacity duration-300 ${
        hasData ? "opacity-100" : "opacity-60"
      }`}
      aria-live="polite"
    >
      <p className="text-2xs font-semibold uppercase tracking-wider text-neutral-500">Live-Vorschau</p>
      <div className="mt-1.5 grid grid-cols-3 gap-3">
        <PreviewMetric
          label="Bruttorendite"
          value={hasData ? <AnimatedNumber value={bruttoRendite} format={(n) => `${n.toFixed(2).replace(".", ",")} %`} /> : "—"}
        />
        <PreviewMetric
          label="Faktor"
          value={hasData ? <AnimatedNumber value={kaufpreisfaktor} format={(n) => `${n.toFixed(1).replace(".", ",")}×`} /> : "—"}
        />
        <PreviewMetric
          label="Cashflow/M."
          value={
            hasData ? (
              <AnimatedNumber
                value={cashflowMonat}
                format={(n) => `${n >= 0 ? "+" : "−"}${Math.abs(Math.round(n)).toLocaleString("de-DE")} €`}
              />
            ) : (
              "—"
            )
          }
          tone={hasData ? (cashflowMonat >= 0 ? "positive" : "negative") : undefined}
        />
      </div>
    </div>
  );
}

function PreviewMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: "positive" | "negative";
}) {
  const toneClass =
    tone === "positive" ? "text-pine-700" : tone === "negative" ? "text-sienna-700" : "text-neutral-900";
  return (
    <div>
      <p className="text-2xs text-neutral-500">{label}</p>
      <p className={`mt-0.5 font-mono text-sm font-semibold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}
