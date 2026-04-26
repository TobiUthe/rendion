import { cn } from "@/lib/utils";
import { BODY, DATA } from "@/lib/design-tokens";

export function KpiCard({
  label,
  value,
  color,
  subtitle,
}: {
  label: string;
  value: string;
  color: "green" | "yellow" | "red" | "neutral";
  subtitle?: string;
}) {
  const borderColors = {
    green: "border-l-success-500",
    yellow: "border-l-warning-500",
    red: "border-l-danger-500",
    neutral: "border-l-neutral-300",
  };

  const bgColors = {
    green: "bg-success-500/5",
    yellow: "bg-warning-500/5",
    red: "bg-danger-500/5",
    neutral: "bg-[var(--color-surface-elevated)]",
  };

  return (
    <div
      className={`rounded-lg border-t border-r border-b border-[var(--color-border)]/60 border-l-[3px] p-5 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md ${borderColors[color]} ${bgColors[color]}`}
    >
      <p className={cn(BODY.sectionLabel)}>
        {label}
      </p>
      <p className={cn(DATA.kpiStandard, "mt-2")}>
        {value}
      </p>
      {subtitle && (
        <p className={cn(BODY.muted, "mt-1")}>{subtitle}</p>
      )}
    </div>
  );
}
