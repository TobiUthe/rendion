import { AlertTriangle, ShieldCheck, XCircle } from "lucide-react";

interface VerdictHeroProps {
  level: "good" | "mixed" | "risky";
  label: string;
  /** Optional Kaufpreisfaktor → positions marker on the gauge (domain 10 – 40). */
  kaufpreisfaktor?: number;
}

const VERDICT_STYLES = {
  good: {
    bg: "bg-success-500/10",
    border: "border-success-500/20",
    text: "text-success-500",
    icon: ShieldCheck,
  },
  mixed: {
    bg: "bg-warning-500/10",
    border: "border-warning-500/20",
    text: "text-warning-500",
    icon: AlertTriangle,
  },
  risky: {
    bg: "bg-danger-500/10",
    border: "border-danger-500/20",
    text: "text-danger-500",
    icon: XCircle,
  },
} as const;

export function VerdictHero({ level, label, kaufpreisfaktor }: VerdictHeroProps) {
  const vstyle = VERDICT_STYLES[level];
  const VerdictIcon = vstyle.icon;

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${vstyle.bg} ${vstyle.border}`}
      >
        <VerdictIcon className={`h-4 w-4 ${vstyle.text}`} />
        <span className={`text-sm font-semibold ${vstyle.text}`}>{label}</span>
      </div>
      {typeof kaufpreisfaktor === "number" && <VerdictGauge value={kaufpreisfaktor} />}
    </div>
  );
}

function VerdictGauge({ value }: { value: number }) {
  const domain: [number, number] = [10, 40];
  const clamped = Math.max(domain[0], Math.min(domain[1], value));
  const pct = ((clamped - domain[0]) / (domain[1] - domain[0])) * 100;

  return (
    <div className="w-full max-w-[280px] sm:w-[280px]">
      <div className="relative h-2.5 overflow-hidden rounded-full bg-sand-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--color-pine-400) 0%, var(--color-pine-400) 33%, var(--color-gold-400) 33%, var(--color-gold-400) 66%, var(--color-sienna-400) 66%, var(--color-sienna-400) 100%)",
          }}
        />
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pct}%` }}
        >
          <span className="block h-4 w-4 rounded-full border-2 border-white bg-neutral-800 shadow-md" />
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-medium uppercase tracking-wider text-neutral-500">
        <span>Stark</span>
        <span>Mittel</span>
        <span>Schwach</span>
      </div>
      <p className="mt-1 text-xs text-neutral-500">
        Kaufpreisfaktor <span className="font-mono font-semibold tabular-nums text-neutral-700">{value.toFixed(1).replace(".", ",")}×</span>
      </p>
    </div>
  );
}
