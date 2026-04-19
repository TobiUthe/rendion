"use client";

interface RouteProgressBarProps {
  active: boolean;
}

export function RouteProgressBar({ active }: RouteProgressBarProps) {
  if (!active) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px] overflow-hidden bg-transparent">
      <div className="h-full w-1/3 animate-route-progress bg-gradient-to-r from-primary-400 via-primary-500 to-primary-700" />
    </div>
  );
}
