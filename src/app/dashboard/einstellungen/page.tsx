import { Cog } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
import { BODY, HEADINGS } from "@/lib/design-tokens";

export default function EinstellungenPage() {
  return (
    <div className="container-md page-px py-8 sm:py-10">
      <PageHeader
        title="Einstellungen"
        subtitle="Konto-, Darstellungs- und Benachrichtigungseinstellungen"
      />

      <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)]/60 px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]">
          <Cog className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h2 className={cn(HEADINGS.h3)}>Bald verfügbar</h2>
          <p className={cn(BODY.subtitle, "mt-1 max-w-md")}>
            Dieser Bereich wird in Kürze ausgebaut. Für Feedback oder Wünsche freut sich das Rendion-Team.
          </p>
        </div>
      </div>
    </div>
  );
}
