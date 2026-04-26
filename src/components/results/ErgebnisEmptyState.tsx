import { PublicLayout } from "@/components/layout/PublicLayout";
import { Calculator } from "@/components/calculator/Calculator";

export function ErgebnisEmptyState() {
  return (
    <PublicLayout width="full">
      <div className="container-lg page-px py-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)]/80 bg-[var(--color-surface)]/70 px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
              Noch keine Analyse
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-balance text-[var(--color-foreground)] sm:text-4xl">
              Lass uns gemeinsam deine <span className="text-primary-600">erste Zahl</span> berechnen.
            </h1>
            <p className="mt-3 max-w-lg text-base text-[var(--color-text-secondary)]">
              Drei Angaben. Kein Konto. Ein vollständiges Bild über 30 Jahre — inkl. Cashflow,
              Vermögensaufbau und Tilgungsplan.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-pine-500" />
                Bruttorendite, Cashflow, Kaufpreisfaktor — sofort im Vergleich
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-pine-500" />
                30-Jahre-Vermögensprojektion mit interaktivem D3-Chart
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-pine-500" />
                Tilgungsplan inklusive Zins- und Tilgungsanteil pro Jahr
              </li>
            </ul>
          </div>
          <div className="mx-auto w-full max-w-md lg:w-[420px]">
            <Calculator compact />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
