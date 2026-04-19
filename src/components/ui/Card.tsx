import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  /** When true, children are rendered without the default px-6 py-5 wrapper. */
  noPadding?: boolean;
}

export function Card({ children, className = "", title, noPadding = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-sand-200 bg-[var(--color-surface)] shadow-sm ${className}`}
    >
      {title && (
        <div className="bg-sand-50 px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-neutral-800">{title}</h3>
        </div>
      )}
      {noPadding ? children : <div className="px-6 py-5">{children}</div>}
    </div>
  );
}
