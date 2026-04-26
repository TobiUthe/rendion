'use client';

interface UpsellFooterProps {
  onClick: () => void;
  message?: string;
  cta?: string;
  title?: string;
}

export function UpsellFooter({
  onClick,
  title = 'Weitere Parameter anpassen',
  message = 'Registriere dich kostenlos, um Zinssatz, Laufzeit und mehr anzupassen',
  cta = 'Kostenlos anmelden',
}: UpsellFooterProps) {
  return (
    <div className="mt-6 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex-1">
        <p className="font-semibold text-[var(--color-foreground)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{message}</p>
      </div>
      <button
        onClick={onClick}
        className="whitespace-nowrap px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
      >
        {cta}
      </button>
    </div>
  );
}
