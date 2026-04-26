"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

export interface DashboardSidebarItemProps {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  collapsed?: boolean;
  /** Match strategy. `"exact"` only highlights on exact path match; `"prefix"` highlights on any descendant route. */
  match?: "exact" | "prefix";
  onNavigate?: () => void;
}

export function DashboardSidebarItem({
  href,
  label,
  icon: Icon,
  collapsed = false,
  match = "exact",
  onNavigate,
}: DashboardSidebarItemProps) {
  const pathname = usePathname() ?? "";
  const isActive =
    match === "exact"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed ? "justify-center px-2" : "",
        isActive
          ? "bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          isActive ? "text-[var(--color-foreground)]" : "text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]",
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "truncate transition-all",
          collapsed ? "sr-only" : "opacity-100",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
