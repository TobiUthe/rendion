import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HEADINGS, BODY } from "@/lib/design-tokens";

interface SectionProps {
  /** Optional section ID for deep linking */
  id?: string;
  /** Optional section title */
  title?: string;
  /** Optional subtitle / description */
  subtitle?: string;
  /** Action elements (buttons, links) rendered at the top-right */
  actions?: ReactNode;
  /** Section content */
  children: ReactNode;
  /** Additional classes on the outer wrapper */
  className?: string;
  /**
   * Visual style:
   * - "card"  = white card with border + shadow (default)
   * - "flat"  = no background, no border (for grouping content without a card)
   */
  variant?: "card" | "flat";
  /** When true, skip the default inner padding (for full-bleed content like charts) */
  noPadding?: boolean;
}

/**
 * Reusable section wrapper.
 *
 * Use for grouping related content on a page with a consistent card style.
 * Replaces ad-hoc `<div className="rounded-xl border border-sand-200 bg-white shadow-sm">` patterns.
 */
export function Section({
  id,
  title,
  subtitle,
  actions,
  children,
  className,
  variant = "card",
  noPadding = false,
}: SectionProps) {
  const isCard = variant === "card";

  return (
    <div
      id={id}
      className={cn(
        isCard && "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm",
        className
      )}
    >
      {(title || actions) && (
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-3",
            isCard ? "border-b border-[var(--color-border-subtle)] px-6 py-4" : "pb-4"
          )}
        >
          <div>
            {title && (
              <h2 className={cn(HEADINGS.h4)}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(BODY.default, "mt-0.5")}>{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(isCard && !noPadding && "px-6 py-5")}>{children}</div>
    </div>
  );
}
