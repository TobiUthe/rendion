import { cn } from "@/lib/utils";
import { Tabs } from "./Tabs";

interface BookmarkTabsProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Bookmark-tab variant of Tabs. Used for chart view switching.
 * Raised folder-tab visual: each tab is a raised rounded-t card
 * that connects to the panel below via -mb-px.
 *
 * Delegates semantics and keyboard navigation to the Tabs primitive.
 */
export function BookmarkTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: BookmarkTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn("relative z-10 flex w-full items-end gap-1 px-2 border-b-0", className)}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 min-w-0 whitespace-nowrap rounded-t-xl border-x border-t px-4 py-2.5 text-sm font-medium",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              isSelected
                ? "-mb-px border-sand-200 bg-[var(--color-surface)] text-[var(--color-foreground)]"
                : "border-transparent bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-foreground)]",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// Re-export as an alias so callers can also reach the Tabs primitive directly.
export { Tabs };
