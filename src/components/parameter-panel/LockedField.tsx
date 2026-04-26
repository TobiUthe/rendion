'use client';

import { Lock } from 'lucide-react';

interface LockedFieldProps {
  label: string;
  value: string;
  onClick: () => void;
}

export function LockedField({ label, value, onClick }: LockedFieldProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled="true"
      className="group relative w-full cursor-pointer text-left rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-raised)] focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-base font-semibold text-[var(--color-foreground)]">{value}</p>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <Lock className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
      </span>
    </button>
  );
}
