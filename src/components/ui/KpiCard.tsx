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
    neutral: "bg-neutral-50",
  };

  return (
    <div
      className={`rounded-lg border-t border-r border-b border-sand-200/60 border-l-[3px] p-5 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md ${borderColors[color]} ${bgColors[color]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-bold tabular-nums text-neutral-800">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-neutral-400">{subtitle}</p>
      )}
    </div>
  );
}
