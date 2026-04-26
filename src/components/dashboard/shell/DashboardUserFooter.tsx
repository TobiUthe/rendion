"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearMockAuth } from "@/lib/auth/mockAuth";
import { cn } from "@/lib/utils";

interface DashboardUserFooterProps {
  collapsed?: boolean;
}

export function DashboardUserFooter({ collapsed = false }: DashboardUserFooterProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearMockAuth();
    router.push("/");
    router.refresh();
  };

  return (
    <div
      className={cn(
        "border-t border-sand-200 px-3 py-3",
        collapsed ? "flex flex-col items-center gap-2" : "",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          collapsed ? "justify-center" : "",
        )}
      >
        <div
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum-100 text-sm font-semibold text-plum-700"
        >
          R
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-[var(--color-foreground)]">
              Eingeloggt
            </div>
            <div className="truncate text-xs text-[var(--color-text-secondary)]">
              Demo-Konto
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        title={collapsed ? "Abmelden" : undefined}
        className={cn(
          "mt-3 flex items-center gap-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]",
          collapsed ? "mt-0 h-9 w-9 justify-center p-0" : "w-full px-3 py-2",
        )}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {!collapsed && <span>Abmelden</span>}
      </button>
    </div>
  );
}
