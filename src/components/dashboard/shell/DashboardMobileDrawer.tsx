"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardMobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardMobileDrawer({ open, onClose }: DashboardMobileDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[var(--z-modal,50)] md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[var(--color-surface-overlay)] backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard-Navigation"
        className={cn(
          "absolute inset-y-0 left-0 flex h-full transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <DashboardSidebar variant="drawer" onNavigate={onClose} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Menü schließen"
          className="absolute -right-11 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)] shadow-md transition hover:text-[var(--color-foreground)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
