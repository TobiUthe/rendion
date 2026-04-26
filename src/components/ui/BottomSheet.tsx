'use client';

import { useEffect, useRef, ReactNode, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxHeight?: string;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  maxHeight = '85vh',
  className,
}: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'bottom-sheet-title' : undefined}
      className="fixed inset-0 z-50 flex items-end justify-center"
    >
      <div
        className="fixed inset-0 bg-[var(--color-surface-overlay)] backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={cn(
          'relative w-full rounded-t-2xl bg-[var(--color-surface)] shadow-lg animate-bottom-sheet-in',
          className,
        )}
        style={{ maxHeight, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex flex-col items-center rounded-t-2xl bg-[var(--color-surface)]/95 backdrop-blur-sm pt-2">
          <div className="h-1 w-10 rounded-full bg-[var(--color-border)]" aria-hidden="true" />
          {title && (
            <div className="flex w-full items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
              <h2 id="bottom-sheet-title" className="text-base font-semibold text-[var(--color-foreground)]">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Schließen"
                className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div
          className="overflow-y-auto px-5 pb-5 pt-4"
          style={{ maxHeight: `calc(${maxHeight} - ${title ? '3.5rem' : '1.25rem'})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
