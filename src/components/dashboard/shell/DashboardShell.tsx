"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { DashboardMobileDrawer } from "./DashboardMobileDrawer";

const COLLAPSE_KEY = "rendion.dashboard.sidebar.collapsed";

// External store for the collapse flag — avoids setState-in-useEffect on mount.
let collapsedState = false;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  return collapsedState;
}

function getServerSnapshot(): boolean {
  return false;
}

function initCollapsed() {
  try {
    collapsedState = window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    collapsedState = false;
  }
}

if (typeof window !== "undefined") {
  initCollapsed();
}

function writeCollapsed(next: boolean) {
  collapsedState = next;
  try {
    window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
  } catch {
    // ignore
  }
  emitChange();
}

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCollapse = useCallback(() => {
    writeCollapsed(!collapsedState);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] md:grid md:grid-cols-[auto_1fr]">
      <div className="hidden md:block">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
        </div>
      </div>

      <div className="flex min-h-screen flex-col">
        <DashboardTopbar onOpenDrawer={() => setDrawerOpen(true)} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>

      <DashboardMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
