import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HEADINGS, BODY } from "@/lib/design-tokens";

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
          className={cn(BODY.navLink, "mb-3 inline-flex items-center gap-1.5 transition hover:text-stone-700")}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLink.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className={cn(HEADINGS.h1)}>
              {title}
            </h1>
            {titleSuffix}
          </div>
          {subtitle && (
            <p className={cn(BODY.subtitle, "mt-1")}>{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
