"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface DashboardTopbarProps {
  onOpenDrawer: () => void;
}

export function DashboardTopbar({ onOpenDrawer }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 backdrop-blur-[24px]">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Menü öffnen"
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)] md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
}
