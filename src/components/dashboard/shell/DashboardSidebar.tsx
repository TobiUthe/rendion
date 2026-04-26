"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, FolderOpen, LayoutDashboard, Settings } from "lucide-react";
import { RendionLogo } from "@/components/brand/RendionLogo";
import { cn } from "@/lib/utils";
import { DashboardSidebarItem } from "./DashboardSidebarItem";
import { DashboardUserFooter } from "./DashboardUserFooter";

export const DASHBOARD_NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Übersicht",
    icon: LayoutDashboard,
    match: "exact" as const,
  },
  {
    href: "/dashboard/analysen",
    label: "Meine Analysen",
    icon: FolderOpen,
    match: "prefix" as const,
  },
  {
    href: "/dashboard/einstellungen",
    label: "Einstellungen",
    icon: Settings,
    match: "prefix" as const,
  },
];

interface DashboardSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  /** When rendered inside the mobile drawer, hide the collapse toggle and force full width. */
  variant?: "desktop" | "drawer";
  onNavigate?: () => void;
}

export function DashboardSidebar({
  collapsed = false,
  onToggleCollapse,
  variant = "desktop",
  onNavigate,
}: DashboardSidebarProps) {
  const isDrawer = variant === "drawer";
  const effectiveCollapsed = isDrawer ? false : collapsed;

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]",
        isDrawer ? "w-[var(--sidebar-expanded)]" : effectiveCollapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-expanded)]",
        !isDrawer && "transition-[width] duration-200 ease-out",
      )}
      aria-label="Dashboard-Navigation"
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-[var(--color-border)]",
          effectiveCollapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-[var(--color-foreground)]"
        >
          <RendionLogo size={26} />
          {!effectiveCollapsed && <span>rendion</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <DashboardSidebarItem
                href={item.href}
                label={item.label}
                icon={item.icon}
                match={item.match}
                collapsed={effectiveCollapsed}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <DashboardUserFooter collapsed={effectiveCollapsed} />

      {/* Collapse toggle (desktop only) */}
      {!isDrawer && onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Seitenleiste ausklappen" : "Seitenleiste einklappen"}
          aria-expanded={!collapsed}
          className="absolute -right-3 top-20 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] shadow-sm transition hover:text-[var(--color-foreground)] md:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </aside>
  );
}
