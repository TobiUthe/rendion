import { Calculator, Shield, Zap } from "lucide-react";

export function TrustBadges() {
  const badges = [
    { icon: Zap, label: "Ergebnis in unter 2 Minuten", iconClass: "text-warning-500" },
    { icon: Calculator, label: "Alle Bundesländer abgedeckt", iconClass: "text-primary-500" },
    { icon: Shield, label: "Keine Daten gespeichert ohne Konto", iconClass: "text-success-500" },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-y-3">
        {badges.map((badge, i) => (
          <div key={badge.label} className="flex items-center">
            {i > 0 && (
              <span className="mx-4 hidden text-neutral-200 sm:inline" aria-hidden="true">
                &middot;
              </span>
            )}
            <span className="flex items-center gap-2 text-xs-plus font-medium text-neutral-500">
              <badge.icon className={`size-4 ${badge.iconClass}`} />
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
