import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** Inline elements rendered next to the title (e.g. badges) */
  titleSuffix?: ReactNode;
  backLink?: { href: string; label: string };
}

export function PageHeader({
  title,
  subtitle,
  actions,
  titleSuffix,
  backLink,
}: PageHeaderProps) {
  return (
    <div>
      {backLink && (
        <Link
          href={backLink.href}
          className="mb-3 inline-flex items-center gap-1.5 text-xs-plus font-medium text-neutral-500 transition hover:text-neutral-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLink.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-neutral-900">
              {title}
            </h1>
            {titleSuffix}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm-plus text-neutral-500">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
