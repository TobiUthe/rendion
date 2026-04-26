import { AlertTriangle, ShieldCheck, XCircle } from "lucide-react";

interface VerdictHeroProps {
  level: "good" | "mixed" | "risky";
  label: string;
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

export function VerdictHero({ level, label }: VerdictHeroProps) {
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
    </div>
  );
}
