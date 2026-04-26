import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  /** Custom icon node (e.g. an SVG illustration) rendered instead of the Lucide icon. */
  iconNode?: ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  iconNode,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const hasIcon = Icon || iconNode;

  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] px-6 py-16 text-center ${className}`}>
      {hasIcon && (
        <div className="mb-4 flex items-center justify-center">
          {iconNode ?? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-elevated)]">
              {Icon && <Icon className="h-6 w-6 text-[var(--color-text-tertiary)]" />}
            </div>
          )}
        </div>
      )}
      <h2 className="text-sm-plus font-semibold text-[var(--color-foreground)]">{title}</h2>
      <p className="mt-1 max-w-sm text-xs-plus text-[var(--color-text-secondary)]">
        {description}
      </p>
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-xs-plus font-medium text-white shadow-sm transition hover:bg-primary-700 active:scale-[var(--scale-press)]"
          >
            {action.icon}
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-xs-plus font-medium text-white shadow-sm transition hover:bg-primary-700 active:scale-[var(--scale-press)]"
          >
            {action.icon}
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
