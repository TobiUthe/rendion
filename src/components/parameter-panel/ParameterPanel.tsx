'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ParameterPanelBody } from './ParameterPanelBody';
import type { ParameterTab } from './types';
import { cn } from '@/lib/utils';
import type { ErgebnisView } from '@/lib/calculator/mapResultToView';
import type { QuickCalcInput } from '@/lib/schemas/calculator';

type InlineFrom = 'sm' | 'md' | 'lg';

interface ParameterPanelProps {
  input: QuickCalcInput;
  view?: ErgebnisView;
  onInputChange?: (input: QuickCalcInput) => void;
  onAuthRequest: () => void;
  /** Breakpoint above which the panel renders inline. Below it: sticky trigger + BottomSheet. */
  inlineFrom?: InlineFrom;
  /** Tabs that are fully editable. Others render as LockedField with upsell. */
  unlockedTabs?: readonly ParameterTab[];
  /** If true, the inline panel always renders expanded (no accordion toggle). */
  defaultExpanded?: boolean;
}

const HIDE_ABOVE: Record<InlineFrom, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
};
const SHOW_ABOVE: Record<InlineFrom, string> = {
  sm: 'hidden sm:block',
  md: 'hidden md:block',
  lg: 'hidden lg:block',
};

export function ParameterPanel({
  input,
  view,
  onInputChange,
  onAuthRequest,
  inlineFrom = 'md',
  unlockedTabs = ['basisdaten'],
  defaultExpanded = false,
}: ParameterPanelProps) {
  const [inlineOpen, setInlineOpen] = useState(defaultExpanded);
  const [sheetOpen, setSheetOpen] = useState(false);

  const body = (
    <ParameterPanelBody
      input={input}
      view={view}
      unlockedTabs={unlockedTabs}
      onInputChange={onInputChange}
      onAuthRequest={onAuthRequest}
    />
  );

  return (
    <>
      {/* Inline (desktop) */}
      <div className={SHOW_ABOVE[inlineFrom]}>
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <button
            onClick={() => setInlineOpen(!inlineOpen)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--color-surface-elevated)] transition-colors"
            aria-expanded={inlineOpen}
          >
            <h3 className="font-semibold text-[var(--color-foreground)]">Parameter anpassen</h3>
            <span className={cn('transition-transform duration-200', inlineOpen && 'rotate-180')}>
              <ChevronDown className="h-5 w-5 text-[var(--color-text-tertiary)]" />
            </span>
          </button>
          {inlineOpen && <div className="border-t border-[var(--color-border)] px-6 py-5">{body}</div>}
        </div>
      </div>

      {/* Mobile sticky trigger */}
      <div
        className={cn(
          HIDE_ABOVE[inlineFrom],
          'sticky bottom-0 z-[var(--z-sticky)] -mx-4 border-t border-sand-200 bg-[var(--color-surface)]/95 backdrop-blur-md px-4 py-3',
        )}
      >
        <button
          onClick={() => setSheetOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 px-4 py-2.5 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Parameter anpassen
        </button>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Parameter anpassen"
      >
        {body}
      </BottomSheet>
    </>
  );
}
